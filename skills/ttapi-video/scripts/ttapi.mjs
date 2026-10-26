#!/usr/bin/env node
// Canonical runtime. `npm run sync` bundles this file into each independent Skill.
import { readFile, writeFile, mkdir, open, unlink } from 'node:fs/promises';
import { resolve, join, extname, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { request as httpsRequest } from 'node:https';

const API_HOSTS = new Set(['https://api.ttapi.io', 'https://api.ttapi.org']);
const WAITING = new Set(['submitted', 'queued', 'running']);
const MAX_DOWNLOAD = 512 * 1024 * 1024;
const delay = milliseconds => new Promise(done => setTimeout(done, milliseconds));

export class TTAPIError extends Error {
  constructor(message, { code = 'TTAPI_ERROR', status, details } = {}) {
    super(message);
    this.name = 'TTAPIError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

function redact(value, key) {
  const serialized = typeof value === 'string' ? value : JSON.stringify(value);
  return key ? serialized.split(key).join('[REDACTED]') : serialized;
}

function sanitize(value, key) {
  if (typeof value === 'string') return redact(value, key);
  if (Array.isArray(value)) return value.map(item => sanitize(item, key));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([name, child]) => [redact(name, key), sanitize(child, key)]));
  return value;
}

export function validateSchema(value, schema = {}, path = '$') {
  if (schema === true) return [];
  if (schema === false) return [`${path} is not allowed`];
  const errors = [];
  const check = candidate => validateSchema(value, candidate, path);
  if (schema.allOf) for (const candidate of schema.allOf) errors.push(...check(candidate));
  if (schema.anyOf && !schema.anyOf.some(candidate => !check(candidate).length)) errors.push(`${path} must satisfy at least one allowed shape`);
  if (schema.oneOf && schema.oneOf.filter(candidate => !check(candidate).length).length !== 1) errors.push(`${path} must satisfy exactly one allowed shape`);
  if (schema.not && !check(schema.not).length) errors.push(`${path} matches a forbidden shape`);
  if (schema.if) {
    const branch = !check(schema.if).length ? schema.then : schema.else;
    if (branch) errors.push(...check(branch));
  }
  if (schema.const !== undefined && JSON.stringify(value) !== JSON.stringify(schema.const)) errors.push(`${path} must equal ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.some(item => JSON.stringify(item) === JSON.stringify(value))) errors.push(`${path} must be one of ${schema.enum.map(item => JSON.stringify(item)).join(', ')}`);
  const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
  const types = schema.type ? (Array.isArray(schema.type) ? schema.type : [schema.type]) : [];
  if (types.length && !types.some(item => item === type || (item === 'integer' && Number.isInteger(value)))) return [...errors, `${path} must be ${types.join(' or ')}`];
  if (type === 'object') {
    for (const property of schema.required || []) if (!Object.hasOwn(value, property)) errors.push(`${path}.${property} is required`);
    for (const [property, child] of Object.entries(value)) {
      if (schema.properties?.[property] !== undefined) errors.push(...validateSchema(child, schema.properties[property], `${path}.${property}`));
      else if (schema.additionalProperties === false) errors.push(`${path}.${property} is not supported`);
      else if (schema.additionalProperties && typeof schema.additionalProperties === 'object') errors.push(...validateSchema(child, schema.additionalProperties, `${path}.${property}`));
    }
    for (const [property, dependencies] of Object.entries(schema.dependentRequired || {})) {
      if (Object.hasOwn(value, property)) for (const dependency of dependencies) if (!Object.hasOwn(value, dependency)) errors.push(`${path}.${dependency} is required with ${property}`);
    }
    if (schema.minProperties !== undefined && Object.keys(value).length < schema.minProperties) errors.push(`${path} needs at least ${schema.minProperties} properties`);
    if (schema.maxProperties !== undefined && Object.keys(value).length > schema.maxProperties) errors.push(`${path} allows at most ${schema.maxProperties} properties`);
  }
  if (type === 'array') {
    if (schema.minItems !== undefined && value.length < schema.minItems) errors.push(`${path} needs at least ${schema.minItems} items`);
    if (schema.maxItems !== undefined && value.length > schema.maxItems) errors.push(`${path} allows at most ${schema.maxItems} items`);
    if (schema.uniqueItems && new Set(value.map(item => JSON.stringify(item))).size !== value.length) errors.push(`${path} must have unique items`);
    if (schema.items) value.forEach((item, index) => errors.push(...validateSchema(item, schema.items, `${path}[${index}]`)));
  }
  if (type === 'string') {
    if (schema.minLength !== undefined && [...value].length < schema.minLength) errors.push(`${path} needs at least ${schema.minLength} characters`);
    if (schema.maxLength !== undefined && [...value].length > schema.maxLength) errors.push(`${path} allows at most ${schema.maxLength} characters`);
    if (schema.pattern && !new RegExp(schema.pattern, 'u').test(value)) errors.push(`${path} has an invalid format`);
    if (['uri', 'url'].includes(schema.format)) {
      try { const url = new URL(value); if (!['https:', 'http:', 'data:'].includes(url.protocol)) throw new Error(); }
      catch { errors.push(`${path} must be a URL`); }
    }
  }
  if (type === 'number') {
    if (!Number.isFinite(value)) errors.push(`${path} must be finite`);
    if (schema.minimum !== undefined && value < schema.minimum) errors.push(`${path} must be >= ${schema.minimum}`);
    if (schema.maximum !== undefined && value > schema.maximum) errors.push(`${path} must be <= ${schema.maximum}`);
    if (schema.exclusiveMinimum !== undefined && value <= schema.exclusiveMinimum) errors.push(`${path} must be > ${schema.exclusiveMinimum}`);
    if (schema.exclusiveMaximum !== undefined && value >= schema.exclusiveMaximum) errors.push(`${path} must be < ${schema.exclusiveMaximum}`);
    if (schema.multipleOf && Math.abs(value / schema.multipleOf - Math.round(value / schema.multipleOf)) > 1e-9) errors.push(`${path} must be a multiple of ${schema.multipleOf}`);
  }
  return errors;
}

export function validateInput(operation, input) {
  const errors = validateSchema(input, operation.schema);
  if (!errors.length && operation.validate) errors.push(...(operation.validate(input) || []));
  if (errors.length) throw new TTAPIError(`Invalid input: ${errors.join('; ')}`, { code: 'INVALID_INPUT' });
}

function at(value, path) {
  return path.split('.').reduce((node, part) => node?.[part], value);
}

function select(value, parts) {
  if (!parts.length) return [value];
  const [head, ...tail] = parts;
  if (head === '*') return value && typeof value === 'object' ? Object.values(value).flatMap(item => select(item, tail)) : [];
  return value === undefined || value === null ? [] : select(value[head], tail);
}

const ASSET_KEYS = new Set(['url', 'image_url', 'imageUrl', 'video_url', 'videoUrl', 'audio_url', 'audioUrl', 'cdnImage', 'cdnVideo', 'cdnAudio', 'download_url', 'downloadUrl', 'b64_json']);
function collectAssets(value, assets, hint = '') {
  if (typeof value === 'string') {
    if (/^https:\/\//i.test(value)) assets.push({ url: value });
    else if (/^data:(image|audio|video)\/[a-z0-9.+-]+;base64,/i.test(value)) { const [,mimeType,base64]=/^data:([^;]+);base64,([\s\S]+)$/i.exec(value)||[]; if(base64)assets.push({base64,mimeType}); }
    else if (hint === 'b64_json' && value) assets.push({ base64: value, mimeType: 'image/png' });
  } else if (Array.isArray(value)) value.forEach(item => collectAssets(item, assets, hint));
  else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) if (ASSET_KEYS.has(key)) collectAssets(child, assets, key);
  }
}

export function normalize(raw, operation, operationName, phase = 'submit', knownTaskId) {
  const taskId = [...(operation.taskIdPaths || []), 'data.jobId', 'jobId', 'output.task_id', 'data.task_id', 'task_id', 'data.request_id', 'request_id'].map(path => at(raw, path)).find(value => typeof value === 'string' && value) || knownTaskId;
  const rawStatus = [...(operation.statusPaths || []), 'output.task_status', 'data.task_status', 'data.taskStatus', 'task_status', 'data.status', 'status'].map(path => at(raw, path)).find(value => typeof value === 'string');
  const label = rawStatus?.trim().toUpperCase();
  const statuses = { SUCCESS: 'succeeded', SUCCEEDED: 'succeeded', COMPLETED: 'succeeded', COMPLETE: 'succeeded', DONE: 'succeeded', FAILED: 'failed', FAILURE: 'failed', ERROR: 'failed', CANCELED: 'canceled', CANCELLED: 'canceled', PENDING: 'queued', PENDING_QUEUE: 'queued', QUEUED: 'queued', ON_QUEUE: 'running', RUNNING: 'running', PROCESSING: 'running', IN_PROGRESS: 'running', SUBMITTED: 'submitted', CREATED: 'submitted', UNKNOWN: 'unknown' };
  let status = operation.statusMap?.[label] || statuses[label] || 'unknown';
  const assets = [];
  for (const path of operation.assetPaths || []) for (const value of select(raw, path.split('.'))) collectAssets(value, assets, path.split('.').at(-1));
  const unique = [...new Map(assets.map(asset => [asset.url || asset.base64, asset])).values()];
  if (raw?.error || (raw?.code && !['0', '200', 'SUCCESS'].includes(String(raw.code)))) status = 'failed';
  if (phase === 'submit' && operation.poll && taskId && !unique.length && ['succeeded', 'unknown'].includes(status)) status = 'submitted';
  if (!operation.poll && phase === 'submit' && !['failed', 'canceled'].includes(status) && unique.length) status = 'succeeded';
  if (phase !== 'submit' && !rawStatus && unique.length) status = 'succeeded';
  if (status === 'succeeded' && operation.assetPaths?.length && !unique.length) status = 'unknown';
  return { operation: operationName, ...(taskId ? { taskId } : {}), status, assets: unique, raw };
}

function makeURL(base, path) {
  if (!API_HOSTS.has(base)) throw new TTAPIError('Unsupported API host', { code: 'INVALID_HOST' });
  const url = new URL(path, base);
  if (url.origin !== base) throw new TTAPIError('API path must remain on the configured TTAPI host', { code: 'INVALID_HOST' });
  return url;
}

export function planRequest(operation, input, taskId) {
  const base = operation.baseUrl || 'https://api.ttapi.io';
  if (taskId !== undefined) {
    if (!operation.poll) throw new TTAPIError('This operation returns synchronously and has no documented task query', { code: 'NOT_ASYNC' });
    const poll = operation.poll;
    const url = makeURL(poll.baseUrl || base, poll.location === 'path' ? poll.path.replace(/\{[^}]+\}/g, encodeURIComponent(taskId)) : poll.path);
    const body = poll.location === 'body' ? { [poll.idParam]: taskId } : undefined;
    if (poll.location === 'query') url.searchParams.set(poll.idParam, taskId);
    return { url: url.href, method: poll.method || 'GET', bodyType: poll.bodyType || 'json', body };
  }
  validateInput(operation, input);
  return { url: makeURL(base, operation.path).href, method: operation.method || 'POST', bodyType: operation.bodyType || 'json', body: input };
}

async function multipart(input) {
  const form = new FormData();
  async function append(key, value) {
    if (value && typeof value === 'object' && value.$file) {
      const path = resolve(value.$file);
      form.append(key, new Blob([await readFile(path)]), basename(path));
    } else form.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
  }
  for (const [key, value] of Object.entries(input)) {
    if (Array.isArray(value)) for (const item of value) await append(key, item);
    else await append(key, value);
  }
  return form;
}

// FLUX's documented result endpoint uses GET with multipart body. Fetch forbids
// GET bodies, so this narrowly scoped transport uses Node HTTPS for that shape.
export async function apiFetch(url, options = {}, httpsImpl = httpsRequest) {
  if (options.method !== 'GET' || options.body === undefined) return fetch(url, options);
  if (!API_HOSTS.has(new URL(url).origin)) throw new TTAPIError('Unsupported API host', {code:'INVALID_HOST'});
  const headers = new Headers(options.headers);
  let bytes;
  if (options.body instanceof FormData) {
    const encoded = new Response(options.body);
    headers.set('Content-Type', encoded.headers.get('Content-Type'));
    bytes = Buffer.from(await encoded.arrayBuffer());
  } else bytes = Buffer.from(options.body);
  headers.set('Content-Length', String(bytes.length));
  return new Promise((resolveResponse, reject) => {
    const outgoing = httpsImpl(url, {method:'GET',headers:Object.fromEntries(headers),signal:options.signal}, incoming => {
      const chunks=[];
      incoming.on('data',chunk=>chunks.push(chunk));
      incoming.on('error',reject);
      incoming.on('end',()=>{
        const responseHeaders=new Headers();
        for(let i=0;i<incoming.rawHeaders.length;i+=2)responseHeaders.append(incoming.rawHeaders[i],incoming.rawHeaders[i+1]);
        resolveResponse(new Response([204,205,304].includes(incoming.statusCode)?null:Buffer.concat(chunks),{status:incoming.statusCode,headers:responseHeaders}));
      });
    });
    outgoing.on('error',reject);
    outgoing.end(bytes);
  });
}

export async function request(plan, { apiKey = process.env.TTAPI_API_KEY, fetchImpl = apiFetch, requestTimeout = 60000 } = {}) {
  if (!apiKey?.trim()) throw new TTAPIError('Set TTAPI_API_KEY in the process environment before making API calls', { code: 'MISSING_API_KEY' });
  const headers = { 'TT-API-KEY': apiKey, Accept: 'application/json' };
  let body;
  if (plan.body !== undefined) {
    if (plan.bodyType === 'multipart') body = await multipart(plan.body);
    else { headers['Content-Type'] = 'application/json'; body = JSON.stringify(plan.body); }
  }
  let response, text;
  try {
    response = await fetchImpl(plan.url, { method: plan.method, headers, body, redirect: 'error', signal: AbortSignal.timeout(requestTimeout) });
    text = await response.text();
  } catch (error) {
    throw new TTAPIError(`API connection failed: ${redact(error.message, apiKey)}. ${plan.method === 'POST' ? 'The submission may have reached TTAPI. Check existing tasks before submitting again.' : 'Resume querying the same task ID.'}`, { code: 'NETWORK_ERROR' });
  }
  let raw;
  try { raw = sanitize(JSON.parse(text), apiKey); }
  catch { throw new TTAPIError(`TTAPI returned a non-JSON response (HTTP ${response.status}). ${plan.method === 'POST' ? 'The submission may have reached TTAPI. Check existing tasks before submitting again.' : 'Resume querying the same task ID.'}`, { code: 'INVALID_RESPONSE', status: response.status }); }
  if (!response.ok) throw new TTAPIError(`TTAPI HTTP ${response.status}: ${redact(raw?.message || raw?.error?.message || raw?.error || raw?.code || response.statusText, apiKey)}`, { code: 'HTTP_ERROR', status: response.status });
  return raw;
}

export async function waitForTask(operation, operationName, taskId, options = {}) {
  const { timeout = 300000, interval = 5000, now = Date.now, sleep = delay, onResult = async () => {} } = options;
  const deadline = now() + timeout;
  let latest = { operation: operationName, taskId, status: 'submitted', assets: [] };
  let backoff = interval;
  while (now() < deadline) {
    try {
      const raw = await request(planRequest(operation, undefined, taskId), { ...options, requestTimeout: Math.max(1, Math.min(options.requestTimeout || 60000, deadline - now())) });
      latest = normalize(raw, operation, operationName, 'poll', taskId);
      await onResult(latest);
      if (!WAITING.has(latest.status)) return latest;
      backoff = interval;
    } catch (error) {
      const transient = error.code === 'NETWORK_ERROR' || error.status === 429 || error.status >= 500;
      if (!transient) throw error;
      backoff = Math.min(backoff * 2, 30000);
    }
    const remaining = deadline - now();
    if (remaining > 0) await sleep(Math.min(backoff, remaining));
  }
  return { ...latest, timedOut: true, message: 'Wait limit reached. Resume with get and the same task ID; do not submit a new generation.' };
}

function safeName(value) { return String(value).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120) || 'result'; }

export async function saveJournal(result, cwd = process.cwd()) {
  const directory = join(cwd, '.ttapi', 'jobs');
  await mkdir(directory, { recursive: true });
  const path = join(directory, `${safeName(result.operation)}-${safeName(result.taskId || `${Date.now()}-${crypto.randomUUID()}`)}.json`);
  await writeFile(path, `${JSON.stringify(result, null, 2)}\n`, { mode: 0o600 });
  return path;
}

const EXTENSIONS = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp', 'video/mp4': '.mp4', 'video/webm': '.webm', 'audio/mpeg': '.mp3', 'audio/wav': '.wav', 'audio/x-wav': '.wav', 'audio/ogg': '.ogg', 'audio/mp4': '.m4a' };
export async function downloadAssets(result, directory, { fetchImpl = fetch } = {}) {
  await mkdir(directory, { recursive: true });
  const files = [];
  const errors = [];
  for (const [index, asset] of result.assets.entries()) {
    try {
      let response;
      let mimeType = asset.mimeType;
      if (asset.url) {
        const url = new URL(asset.url);
        if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Asset URL must use HTTPS without credentials');
        let current = url;
        for (let hop = 0; hop <= 5; hop++) {
          if (current.protocol !== 'https:' || current.username || current.password) throw new Error('Asset redirects must use HTTPS without credentials');
          response = await fetchImpl(current.href, { redirect: 'manual', signal: AbortSignal.timeout(300000) });
          if (![301, 302, 303, 307, 308].includes(response.status)) break;
          const location = response.headers.get('location');
          if (!location || hop === 5) throw new Error('Invalid or excessive asset redirects');
          await response.body?.cancel();
          current = new URL(location, current);
        }
        if (!response.ok) throw new Error(`Asset download HTTP ${response.status}`);
        if (Number(response.headers.get('content-length')) > MAX_DOWNLOAD) throw new Error('Asset exceeds the 512 MiB download limit');
        mimeType = response.headers.get('content-type')?.split(';')[0];
      }
      const remoteExtension = asset.url ? extname(new URL(asset.url).pathname).toLowerCase() : '';
      const bytes = asset.base64 ? Buffer.from(asset.base64, 'base64') : undefined;
      if (bytes?.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) mimeType = 'image/png';
      else if (bytes?.[0] === 255 && bytes?.[1] === 216) mimeType = 'image/jpeg';
      else if (bytes?.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP') mimeType = 'image/webp';
      const extension = EXTENSIONS[mimeType] || (/^\.(png|jpe?g|webp|gif|mp4|webm|mp3|wav|ogg|m4a|flac)$/.test(remoteExtension) ? remoteExtension : '.bin');
      const path = resolve(directory, `${safeName(result.operation)}-${safeName(result.taskId || crypto.randomUUID())}-${index + 1}${extension}`);
      if (asset.base64) {
        const encoded = asset.base64.replace(/\s/g, '');
        if (!bytes.length || encoded.length % 4 === 1 || !/^[A-Za-z0-9+/]*={0,2}$/.test(encoded) || bytes.toString('base64').replace(/=+$/, '') !== encoded.replace(/=+$/, '')) throw new Error('Invalid base64 asset');
        if (bytes.length > MAX_DOWNLOAD) throw new Error('Asset exceeds the download limit');
        await writeFile(path, bytes, { flag: 'wx' });
      } else {
        let size = 0;
        const limiter = new Transform({ transform(chunk, encoding, done) { size += chunk.length; done(size > MAX_DOWNLOAD ? new Error('Asset exceeds the download limit') : null, chunk); } });
        const handle = await open(path, 'wx');
        try { await pipeline(Readable.fromWeb(response.body), limiter, handle.createWriteStream()); }
        catch (error) { await handle.close().catch(() => {}); await unlink(path).catch(() => {}); throw error; }
      }
      files.push(path);
    } catch (error) { errors.push({ index: index + 1, message: error.message }); }
  }
  return { files, errors };
}

const HELP = `TTAPI media skill (Node.js 20+, no packages required)
  node scripts/ttapi.mjs models
  node scripts/ttapi.mjs schema OPERATION
  node scripts/ttapi.mjs submit OPERATION --input request.json --dry-run
  node scripts/ttapi.mjs submit OPERATION --input request.json --wait --output ./outputs
  node scripts/ttapi.mjs get OPERATION --task TASK_ID --wait --output ./outputs

Options: --timeout SECONDS (wait budget, default 300), --interval SECONDS (default 5),
         --request-timeout SECONDS (default 60 async / 600 sync), --output DIRECTORY.
--input - reads JSON from stdin. Dry run validates locally without a key or API calls.
Paid submissions are sent once. Async task receipts are saved to .ttapi/jobs/ before polling.
Set TTAPI_API_KEY in your environment; generation consumes your TTAPI account quota.
`;

function parseArgs(args) {
  const positionals = [];
  const options = {};
  const booleans = new Set(['wait', 'dry-run', 'help']);
  const values = new Set(['input', 'task', 'output', 'timeout', 'interval', 'request-timeout']);
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (!arg.startsWith('--')) { positionals.push(arg); continue; }
    const key = arg.slice(2);
    if (booleans.has(key)) options[key] = true;
    else if (values.has(key) && args[index + 1] !== undefined && !args[index + 1].startsWith('--')) options[key] = args[++index];
    else throw new TTAPIError(`Unknown option or missing value: ${arg}`, { code: 'INVALID_ARGUMENT' });
  }
  return { positionals, options };
}

function seconds(value, fallback, name, minimum = 1) {
  if (value === undefined) return fallback;
  const number = Number(value);
  if (!Number.isFinite(number) || number < minimum || number > 86400) throw new TTAPIError(`${name} must be between ${minimum} and 86400 seconds`, { code: 'INVALID_ARGUMENT' });
  return number * 1000;
}

export function modelChoices(schema) {
  const choices = new Set();
  function enums(node) {
    if (!node || typeof node !== 'object') return;
    for (const value of node.enum || []) if (typeof value === 'string') choices.add(value);
    if (typeof node.const === 'string') choices.add(node.const);
    for (const key of ['anyOf', 'oneOf', 'allOf']) for (const child of node[key] || []) enums(child);
  }
  function visit(node) {
    if (!node || typeof node !== 'object') return;
    for (const key of ['model', 'mv']) if (node.properties?.[key]) enums(node.properties[key]);
    for (const key of ['anyOf', 'oneOf', 'allOf']) for (const child of node[key] || []) visit(child);
  }
  visit(schema);
  return [...choices];
}

export async function main(args = process.argv.slice(2), dependencies = {}) {
  const { positionals: [command, operationName, ...extra], options } = parseArgs(args);
  if (!command || command === 'help' || options.help) { process.stdout.write(HELP); return; }
  if (extra.length) throw new TTAPIError('Unexpected positional arguments', { code: 'INVALID_ARGUMENT' });
  const catalog = dependencies.catalog || (await import(new URL('./catalog.mjs', import.meta.url))).catalog;
  if (command === 'models') {
    process.stdout.write(`${JSON.stringify({ skill: catalog.skill, operations: Object.entries(catalog.operations).map(([id, op]) => ({ id, family: op.family, description: op.description, asynchronous: Boolean(op.poll), models: modelChoices(op.schema) })) }, null, 2)}\n`);
    return;
  }
  const operation = catalog.operations[operationName];
  if (!operation) throw new TTAPIError(`Unknown operation '${operationName || ''}'. Run models to list supported operations.`, { code: 'INVALID_ARGUMENT' });
  if (command === 'schema') { process.stdout.write(`${JSON.stringify(operation, null, 2)}\n`); return; }
  if (!['submit', 'get'].includes(command)) throw new TTAPIError(`Unknown command '${command}'`, { code: 'INVALID_ARGUMENT' });
  if (command === 'submit' && !options.input) throw new TTAPIError('submit requires --input request.json (or --input -)', { code: 'INVALID_ARGUMENT' });
  if (command === 'get' && !options.task) throw new TTAPIError('get requires --task TASK_ID', { code: 'INVALID_ARGUMENT' });
  if (command === 'get' && options['dry-run']) throw new TTAPIError('--dry-run applies to submit', { code: 'INVALID_ARGUMENT' });
  const requestOptions = { ...dependencies, requestTimeout: seconds(options['request-timeout'], operation.poll ? 60000 : 600000, '--request-timeout') };
  let input;
  if (command === 'submit') {
    let text;
    if (options.input === '-') { const chunks = []; for await (const chunk of process.stdin) chunks.push(chunk); text = Buffer.concat(chunks.map(chunk => Buffer.from(chunk))).toString('utf8'); }
    else text = await readFile(resolve(options.input), 'utf8');
    try { input = JSON.parse(text); } catch { throw new TTAPIError('Input file must contain valid JSON', { code: 'INVALID_INPUT' }); }
  }
  const plan = planRequest(operation, input, command === 'get' ? options.task : undefined);
  if (options['dry-run']) { process.stdout.write(`${JSON.stringify({ dryRun: true, operation: operationName, request: { ...plan, headers: { 'TT-API-KEY': '[REDACTED]' } } }, null, 2)}\n`); return; }
  // Validate options before any paid action.
  const waitOptions = { ...requestOptions, timeout: seconds(options.timeout, 300000, '--timeout'), interval: seconds(options.interval, 5000, '--interval') };
  let result = normalize(await request(plan, requestOptions), operation, operationName, command === 'submit' ? 'submit' : 'poll', options.task);
  let journal;
  if (result.taskId || !operation.poll) {
    try { journal = await saveJournal(result); }
    catch (error) { process.stderr.write(`Could not save local receipt; preserve task ID ${result.taskId || '(synchronous result)'}: ${error.message}\n`); }
  }
  if (options.wait && operation.poll && result.taskId && WAITING.has(result.status)) {
    const receipt = { ...result, ...(journal ? { journal } : {}) };
    process.stderr.write(`${JSON.stringify({ receipt: { operation: receipt.operation, taskId: receipt.taskId, status: receipt.status, journal: receipt.journal } })}\n`);
    result = await waitForTask(operation, operationName, result.taskId, { ...waitOptions, onResult: async progress => { if (journal) await writeFile(journal, `${JSON.stringify(progress, null, 2)}\n`); } });
  }
  if (options.output && result.status === 'succeeded') {
    const downloads = await downloadAssets(result, resolve(options.output), requestOptions);
    result = { ...result, ...downloads };
  }
  if (journal) result.journal = journal;
  if (journal) await writeFile(journal, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (['failed', 'canceled', 'unknown'].includes(result.status) || result.errors?.length) process.exitCode = 1;
  if (result.timedOut) process.exitCode = 2;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    const message = redact(error.message, process.env.TTAPI_API_KEY);
    process.stderr.write(`${JSON.stringify({ error: { code: error.code || 'ERROR', message, ...(error.status ? { httpStatus: error.status } : {}) } })}\n`);
    process.exitCode = 1;
  });
}
