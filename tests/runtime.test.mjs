import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, cp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { validateSchema, validateInput, normalize, planRequest, request, waitForTask, downloadAssets, main, modelChoices } from '../scripts/ttapi-runtime.mjs';
import { catalog as image } from '../skills/ttapi-image/scripts/catalog.mjs';
import { catalog as video } from '../skills/ttapi-video/scripts/catalog.mjs';
import { catalog as audio } from '../skills/ttapi-audio/scripts/catalog.mjs';

const catalogs = { image, video, audio };
const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } });
const fixtureFiles = await Promise.all(Object.keys(catalogs).map(async category => ({ category, fixtures: JSON.parse(await readFile(new URL(`./fixtures/${category}.json`, import.meta.url))) })));
for (const { category, fixtures } of fixtureFiles) for (const fixture of fixtures) {
  test(`${category} contract: ${fixture.name}`, () => {
    const result = normalize(fixture.payload, catalogs[category].operations[fixture.operation], fixture.operation, fixture.phase === 'submit' ? 'submit' : 'poll');
    assert.equal(result.taskId ?? null, fixture.expected.taskId ?? null);
    assert.equal(result.status, fixture.expected.status);
    assert.deepEqual(result.assets.filter(asset => asset.url).map(asset => asset.url), fixture.expected.assetUrls);
  });
}

for (const catalog of Object.values(catalogs)) for (const [id, operation] of Object.entries(catalog.operations)) {
  test(`accept documented input and build request: ${id}`, () => {
    validateInput(operation, operation.example);
    const plan = planRequest(operation, operation.example);
    assert.equal(new URL(plan.url).origin, operation.baseUrl || 'https://api.ttapi.io');
    assert.deepEqual(plan.body, operation.example);
    assert.equal(plan.method, 'POST');
    if (operation.poll) {
      const query = planRequest(operation, undefined, 'id /?&=42');
      assert.equal(query.method, operation.poll.method);
      if (operation.poll.location === 'query') assert.equal(new URL(query.url).searchParams.get(operation.poll.idParam), 'id /?&=42');
      if (operation.poll.location === 'path') assert(query.url.includes('id%20%2F%3F%26%3D42'));
    }
  });
}

test('conditional JSON input validation rejects type, shape, range and forbidden fields', () => {
  const schema = { type: 'object', properties: { mode: { enum: ['custom', 'auto'] }, duration: { type: 'integer', minimum: 1, maximum: 10 }, lyrics: { type: 'string', minLength: 1 } }, required: ['mode', 'duration'], additionalProperties: false, if: { properties: { mode: { const: 'custom' } } }, then: { required: ['lyrics'] } };
  assert.deepEqual(validateSchema({ mode: 'custom', duration: 5, lyrics: 'hello' }, schema), []);
  for (const value of [{ mode: 'custom', duration: 5 }, { mode: 'auto', duration: 11 }, { mode: 'auto', duration: '5' }, { mode: 'auto', duration: 2, secret: 'x' }]) assert(validateSchema(value, schema).length);
});

test('model discovery includes Suno mv in alternative input modes', () => {
  assert(modelChoices(audio.operations['suno-generate'].schema).includes('chirp-v6'));
  assert(modelChoices(image.operations['image2-generate'].schema).includes('gpt-image-2'));
});

test('an empty completed media envelope is not reported as a generated file', () => {
  assert.equal(normalize({ status: 'SUCCESS', data: {} }, image.operations['image2-generate'], 'image2-generate').status, 'unknown');
  assert.equal(normalize({}, image.operations['nano-generate'], 'nano-generate').status, 'unknown');
  assert.equal(normalize({ status: 'SUCCESS', data: { jobId: 'keep' } }, video.operations['grok-text-to-video'], 'grok-text-to-video').status, 'submitted');
});

test('invalid generation input is rejected before any request', () => {
  const operation = video.operations['wan-text-to-video'];
  assert.throws(() => planRequest(operation, {}), /Invalid input/);
  assert.throws(() => planRequest({ ...operation, baseUrl: 'https://example.com' }, operation.example), /Unsupported API host/);
  assert.throws(() => planRequest({ ...operation, path: '//example.com/key' }, operation.example), /configured TTAPI host/);
});

test('API requests use TTAPI auth only on a fixed API host', async () => {
  const operation = video.operations['wan-text-to-video'];
  let call;
  await request(planRequest(operation, operation.example), { apiKey: 'test-only-key', fetchImpl: async (url, options) => { call = { url, options }; return json({ output: { task_id: 'a', task_status: 'PENDING' } }); } });
  assert.equal(call.options.headers['TT-API-KEY'], 'test-only-key');
  assert.equal(call.options.redirect, 'error');
  assert.deepEqual(JSON.parse(call.options.body), operation.example);
  await assert.rejects(request(planRequest(operation, operation.example), { apiKey: '' }), /Set TTAPI_API_KEY/);
});

test('an uncertain paid submission is sent only once and secrets are redacted', async () => {
  let calls = 0;
  await assert.rejects(request(planRequest(audio.operations['suno-generate'], audio.operations['suno-generate'].example), { apiKey: 'test-secret', fetchImpl: async () => { calls++; throw new Error('test-secret disconnected'); } }), error => !error.message.includes('test-secret') && error.message.includes('may have reached'));
  assert.equal(calls, 1);
});

test('HTTP errors hide keys and malformed responses are explicit', async () => {
  const plan = planRequest(video.operations['grok-text-to-video'], video.operations['grok-text-to-video'].example);
  await assert.rejects(request(plan, { apiKey: 'test-secret', fetchImpl: async () => json({ message: 'bad test-secret' }, 401) }), error => error.status === 401 && !error.message.includes('test-secret'));
  await assert.rejects(request(plan, { apiKey: 'x', fetchImpl: async () => new Response('<html>unavailable</html>', { status: 502 }) }), error => error.code === 'INVALID_RESPONSE');
});

test('business error responses are sanitized before output or receipt persistence', async () => {
  const plan = planRequest(video.operations['grok-text-to-video'], video.operations['grok-text-to-video'].example);
  const key = 'test-"secret';
  const raw = await request(plan, { apiKey: key, fetchImpl: async () => json({ status: 'FAILED', message: `Rejected API key ${key}`, data: { nested: [key] } }) });
  assert(!JSON.stringify(raw).includes('secret'));
  assert.equal(raw.data.nested[0], '[REDACTED]');
  assert.equal(normalize(raw, video.operations['grok-text-to-video'], 'grok-text-to-video').status, 'failed');
});

test('response body disconnects and invalid submission responses preserve uncertainty', async () => {
  const plan = planRequest(video.operations['grok-text-to-video'], video.operations['grok-text-to-video'].example);
  let calls = 0;
  await assert.rejects(request(plan, { apiKey: 'x', fetchImpl: async () => { calls++; return { text: async () => { throw new Error('body disconnected'); } }; } }), error => error.code === 'NETWORK_ERROR' && error.message.includes('may have reached'));
  assert.equal(calls, 1);
  await assert.rejects(request(plan, { apiKey: 'x', fetchImpl: async () => new Response('unavailable', { status: 502 }) }), error => error.code === 'INVALID_RESPONSE' && error.message.includes('may have reached'));
});

test('polling follows one task to success without resubmission', async () => {
  const calls = [];
  let clock = 0;
  const result = await waitForTask(video.operations['wan-text-to-video'], 'wan-text-to-video', 'task-42', { apiKey: 'x', timeout: 1000, interval: 10, now: () => clock, sleep: async ms => { clock += ms; }, fetchImpl: async (url, options) => { calls.push({ url, method: options.method }); return json({ output: { task_id: 'task-42', task_status: calls.length === 1 ? 'RUNNING' : 'SUCCEEDED', ...(calls.length > 1 ? { video_url: 'https://cdn.ttapi.io/result.mp4' } : {}) } }); } });
  assert.equal(result.status, 'succeeded');
  assert.equal(result.assets[0].url, 'https://cdn.ttapi.io/result.mp4');
  assert(calls.every(call => call.method === 'GET' && call.url.endsWith('/task-42')));
});

test('poll timeout preserves ID and queued state', async () => {
  let clock = 0;
  const result = await waitForTask(video.operations['grok-text-to-video'], 'grok-text-to-video', 'keep-me', { apiKey: 'x', timeout: 30, interval: 10, now: () => clock, sleep: async ms => { clock += ms; }, fetchImpl: async () => json({ status: 'ON_QUEUE', data: { jobId: 'keep-me' } }) });
  assert.equal(result.taskId, 'keep-me');
  assert.equal(result.status, 'running');
  assert.equal(result.timedOut, true);
});

test('polling backs off on 429 and stops immediately on auth or failed generation', async () => {
  let clock = 0, calls = 0;
  const options = { apiKey: 'x', timeout: 100, interval: 10, now: () => clock, sleep: async ms => { clock += ms; } };
  const result = await waitForTask(video.operations['grok-text-to-video'], 'grok-text-to-video', 'one', { ...options, fetchImpl: async () => ++calls === 1 ? json({ message: 'rate limited' }, 429) : json({ status: 'FAILED', data: { jobId: 'one' } }) });
  assert.equal(calls, 2);
  assert.equal(result.status, 'failed');
  assert.equal(clock, 20);
  calls = 0;
  await assert.rejects(waitForTask(video.operations['grok-text-to-video'], 'grok-text-to-video', 'one', { ...options, fetchImpl: async () => { calls++; return json({ message: 'invalid key' }, 401); } }), error => error.status === 401);
  assert.equal(calls, 1);
});

test('downloads save output bytes, never send API keys, and never overwrite', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'ttapi-download-'));
  const calls = [];
  const result = { operation: 'wan-text-to-video', taskId: 'id-42', assets: [{ url: 'https://cdn.ttapi.io/result.mp4' }] };
  const fetchImpl = async (url, options) => { calls.push(options); return new Response(Buffer.from('test-video'), { headers: { 'Content-Type': 'video/mp4' } }); };
  const first = await downloadAssets(result, directory, { fetchImpl, apiKey: 'must-not-be-sent' });
  assert.equal(first.errors.length, 0);
  assert.equal(await readFile(first.files[0], 'utf8'), 'test-video');
  assert.equal(calls[0].headers, undefined);
  const second = await downloadAssets(result, directory, { fetchImpl });
  assert.equal(second.files.length, 0);
  assert(second.errors[0].message.includes('EEXIST'));
  assert.equal(await readFile(first.files[0], 'utf8'), 'test-video');
});

test('base64 images use their actual format and download redirects never receive auth', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'ttapi-images-'));
  const bytes = Buffer.from([255, 216, 255, 217]);
  const imageResult = await downloadAssets({ operation: 'image2-generate', assets: [{ base64: bytes.toString('base64'), mimeType: 'image/png' }] }, directory);
  assert(imageResult.files[0].endsWith('.jpg'));
  assert.deepEqual(await readFile(imageResult.files[0]), bytes);
  let calls = 0;
  const redirectResult = await downloadAssets({ operation: 'sample', assets: [{ url: 'https://cdn.ttapi.io/redirect' }] }, directory, { fetchImpl: async (url, options) => { calls++; assert.equal(options.headers, undefined); return calls === 1 ? new Response(null, { status: 302, headers: { Location: 'https://other.example/result.mp4' } }) : new Response('result', { headers: { 'Content-Type': 'video/mp4' } }); } });
  assert.equal(calls, 2);
  assert.equal(redirectResult.files.length, 1);
});

test('invalid base64 never becomes an empty or corrupted success file', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'ttapi-invalid-image-'));
  for (const base64 of ['A', '%%%invalid%%%', 'abc=broken', 'Zh==']) {
    const result = await downloadAssets({ operation: 'image2-generate', assets: [{ base64, mimeType: 'image/png' }] }, directory);
    assert.equal(result.files.length, 0);
    assert.equal(result.errors[0].message, 'Invalid base64 asset');
  }
});

test('each Skill operates independently after being copied out of the repository', async () => {
  for (const [category, catalog] of Object.entries(catalogs)) {
    const directory = await mkdtemp(join(tmpdir(), `ttapi-${category}-`));
    await cp(new URL(`../skills/${catalog.skill}/`, import.meta.url), directory, { recursive: true });
    const env = { ...process.env }; delete env.TTAPI_API_KEY;
    const models = spawnSync(process.execPath, ['scripts/ttapi.mjs', 'models'], { cwd: directory, env, encoding: 'utf8' });
    assert.equal(models.status, 0, models.stderr);
    assert.equal(JSON.parse(models.stdout).skill, catalog.skill);
    for (const operation of Object.keys(catalog.operations)) {
      const dryRun = spawnSync(process.execPath, ['scripts/ttapi.mjs', 'submit', operation, '--input', `examples/${operation}.json`, '--dry-run'], { cwd: directory, env, encoding: 'utf8' });
      assert.equal(dryRun.status, 0, dryRun.stderr);
      assert.equal(JSON.parse(dryRun.stdout).dryRun, true);
    }
  }
});

test('stdin JSON is supported without a key for dry runs', () => {
  const result = spawnSync(process.execPath, ['skills/ttapi-video/scripts/ttapi.mjs', 'submit', 'wan-text-to-video', '--input', '-', '--dry-run'], { input: JSON.stringify(video.operations['wan-text-to-video'].example), encoding: 'utf8', cwd: new URL('..', import.meta.url) });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).dryRun, true);
});

test('a task receipt exists before the first polling request', async () => {
  const originalCwd = process.cwd();
  const directory = await mkdtemp(join(tmpdir(), 'ttapi-receipt-'));
  const inputFile = join(directory, 'request.json');
  const { writeFile, readdir } = await import('node:fs/promises');
  await writeFile(inputFile, JSON.stringify(video.operations['wan-text-to-video'].example));
  const originalOut = process.stdout.write, originalErr = process.stderr.write;
  let calls = 0;
  try {
    process.chdir(directory);
    process.stdout.write = () => true; process.stderr.write = () => true;
    await main(['submit', 'wan-text-to-video', '--input', inputFile, '--wait'], { catalog: video, apiKey: 'test-key', fetchImpl: async (url, options) => {
      calls++;
      if (options.method === 'POST') return json({ output: { task_id: 'persisted-task', task_status: 'PENDING' } });
      const receipts = await readdir(join(directory, '.ttapi', 'jobs'));
      assert.equal(receipts.length, 1);
      const saved = JSON.parse(await readFile(join(directory, '.ttapi', 'jobs', receipts[0])));
      assert.equal(saved.taskId, 'persisted-task');
      return json({ output: { task_id: 'persisted-task', task_status: 'SUCCEEDED', video_url: 'https://cdn.ttapi.io/result.mp4' } });
    } });
  } finally { process.stdout.write = originalOut; process.stderr.write = originalErr; process.chdir(originalCwd); }
  assert.equal(calls, 2);
});
