import test from 'node:test';
import assert from 'node:assert/strict';
import {validateInput, planRequest, normalize, request, waitForTask} from '../scripts/ttapi-runtime.mjs';
import {catalog as image} from '../skills/image/ttapi-midjourney-image/scripts/catalog.mjs';
import {catalog as edit} from '../skills/image/ttapi-midjourney-edit/scripts/catalog.mjs';
import {catalog as video} from '../skills/video/ttapi-midjourney-video/scripts/catalog.mjs';

// Offline tests only. Every simulated API request below receives its own mock
// fetch and a fake key; no test uses the machine's real API environment.
const json = body => new Response(JSON.stringify(body), {status: 200, headers: {'Content-Type': 'application/json'}});
const catalogs = [image, edit, video];

for (const catalog of catalogs) for (const [name, op] of Object.entries(catalog.operations)) {
  test(`Midjourney documented example and isolated polling path: ${name}`, () => {
    validateInput(op, op.example);
    const submit = planRequest(op, op.example);
    assert.equal(submit.method, 'POST');
    assert.equal(new URL(submit.url).origin, 'https://api.ttapi.io');
    assert.deepEqual(submit.body, op.example);
    const poll = planRequest(op, undefined, 'job /?&=42');
    assert.equal(poll.method, 'GET');
    assert.equal(new URL(poll.url).pathname, op.poll.path);
    assert.equal(new URL(poll.url).searchParams.get('jobId'), 'job /?&=42');
    assert.equal(poll.body, undefined);
  });
}

test('classic image payloads keep endpoint-specific fields and server timeout range', () => {
  const imagine = image.operations['midjourney-imagine'];
  assert.throws(() => validateInput(imagine, {...imagine.example, model: 'grok-imagine-video'}), /Invalid input/);
  assert.throws(() => validateInput(imagine, {...imagine.example, timeout: 299}), /Invalid input/);
  assert.throws(() => validateInput(imagine, {...imagine.example, timeout: 1201}), /Invalid input/);
  validateInput(imagine, {...imagine.example, timeout: 1200});
  const action = image.operations['midjourney-action'];
  assert.throws(() => validateInput(action, {...action.example, action: ''}), /Invalid input/);
  assert.throws(() => validateInput(action, {...action.example, image: 'https://example.com/source.png'}), /Invalid input/);
});

test('blend accepts two to five Base64 images, not remote paths, and excludes unsupported turbo', () => {
  const op = image.operations['midjourney-blend'];
  const pixel = op.example.imgBase64Array[0];
  for (const count of [2, 5]) validateInput(op, {...op.example, imgBase64Array: Array(count).fill(pixel)});
  for (const count of [0, 1, 6]) assert.throws(() => validateInput(op, {...op.example, imgBase64Array: Array(count).fill(pixel)}), /Invalid input/);
  assert.throws(() => validateInput(op, {...op.example, imgBase64Array: ['https://example.com/a.png', 'C:/local.png']}), /Invalid input/);
  assert.throws(() => validateInput(op, {...op.example, mode: 'turbo'}), /Invalid input/);
});

test('describe schema conflict uses the documented Base64-required path; inpaint uses raw mask Base64', () => {
  const describe = image.operations['midjourney-describe'];
  assert.throws(() => validateInput(describe, {url: 'https://example.com/input.png'}), /Invalid input/);
  const inpaint = image.operations['midjourney-inpaint'];
  validateInput(inpaint, inpaint.example);
  assert.throws(() => validateInput(inpaint, {...inpaint.example, mask: `data:image/png;base64,${inpaint.example.mask}`}), /Invalid input/);
  assert.throws(() => validateInput(inpaint, {...inpaint.example, image: 'https://example.com/input.png'}), /Invalid input/);
});

test('describe and seed successful textual results do not require image downloads', () => {
  for (const name of ['midjourney-describe', 'midjourney-seed']) {
    const op = image.operations[name];
    assert.equal(normalize({status: 'SUCCESS', data: {jobId: 'pending'}}, op, name, 'submit').status, 'submitted');
    const result = normalize({status: 'SUCCESS', jobId: 'complete', data: {seed: '12345'}}, op, name, 'poll');
    assert.equal(result.status, 'succeeded');
    assert.deepEqual(result.assets, []);
    assert.equal(result.raw.data.seed, '12345');
  }
});

test('classic image normalization returns result tiles/grid and excludes callback and prompt URLs', () => {
  const op = image.operations['midjourney-imagine'];
  const result = normalize({status: 'SUCCESS', jobId: 'outer-id', data: {jobId: 'nested-id', images: ['https://cdn.ttapi.io/tile.png'], cdnImage: 'https://cdn.ttapi.io/grid.png', hookUrl: 'https://example.com/callback', prompt: 'https://example.com/reference.png'}}, op, 'midjourney-imagine', 'poll');
  assert.equal(result.taskId, 'outer-id');
  assert.equal(result.status, 'succeeded');
  assert.deepEqual(result.assets.map(asset => asset.url), ['https://cdn.ttapi.io/tile.png', 'https://cdn.ttapi.io/grid.png']);
  assert.equal(normalize({status: 'PENDING_QUEUE ', jobId: 'q'}, op, 'midjourney-imagine', 'poll').status, 'queued');
});

test('dedicated edit/retexture modes cannot be confused with classic jobId/mask inpainting', () => {
  const op = edit.operations['midjourney-edit'];
  assert.equal(op.poll.path, '/midjourney/image-edits/fetch');
  assert.throws(() => validateInput(op, {...op.example, type: 'retexture'}), /Invalid input/);
  assert.throws(() => validateInput(op, {...op.example, jobId: 'source', mask: 'AAAA'}), /Invalid input/);
  assert.throws(() => validateInput(op, {...op.example, image: 'C:/local/image.png'}), /Invalid input/);
  validateInput(edit.operations['midjourney-retexture'], edit.operations['midjourney-retexture'].example);
  const result = normalize({status: 'SUCCESS', jobId: 'edit-id', data: {cdnImages: ['https://cdn.ttapi.io/0.png', 'https://cdn.ttapi.io/1.png'], images: ['https://cdn.midjourney.com/0.png', 'https://cdn.midjourney.com/1.png']}}, op, 'midjourney-edit', 'poll');
  assert.equal(result.status, 'succeeded');
  assert.equal(result.assets.length, 2, 'download only the chosen CDN copy of each result');
});

test('Midjourney video supports only documented fields, explicit batch counts and numeric indices', () => {
  const generate = video.operations['midjourney-video-generate'];
  assert.equal(generate.example.bs, 1, 'one-clip example does not inherit the server default batch of four');
  for (const bs of [1, 2, 4]) validateInput(generate, {...generate.example, bs});
  for (const patch of [{bs: 3}, {bs: '1'}, {model: 'relax'}, {manual: 'manual'}, {duration: 5}, {imageUrl: 'data:image/png;base64,AAAA'}]) {
    assert.throws(() => validateInput(generate, {...generate.example, ...patch}), /Invalid input/);
  }
  const extend = video.operations['midjourney-video-extend'];
  for (const index of [0, 3]) validateInput(extend, {...extend.example, index});
  for (const patch of [{index: -1}, {index: 4}, {index: '0-3'}, {prompt: 'Continue'}, {resolution: 'hd'}]) {
    assert.throws(() => validateInput(extend, {...extend.example, ...patch}), /Invalid input/);
  }
});

test('video normalization respects outer task ID and downloads only data.videos', () => {
  const op = video.operations['midjourney-video-generate'];
  const result = normalize({status: 'SUCCESS', jobId: 'outer-video-id', data: {jobId: 'different-nested-id', videos: ['https://cdn.midjourney.com/video/0.mp4'], imageUrl: 'https://example.com/reference.png', hookUrl: 'https://example.com/hook'}}, op, 'midjourney-video-generate', 'poll');
  assert.equal(result.taskId, 'outer-video-id');
  assert.equal(result.status, 'succeeded');
  assert.deepEqual(result.assets, [{url: 'https://cdn.midjourney.com/video/0.mp4'}]);
  assert.equal(normalize({status: 'SUCCESS', data: {jobId: 'submitted'}}, op, 'midjourney-video-generate', 'submit').status, 'submitted');
});

test('mocked video polling uses one product endpoint, a fake key and no duplicate generation', async () => {
  const op = video.operations['midjourney-video-generate'];
  const calls = [];
  let time = 0;
  const result = await waitForTask(op, 'midjourney-video-generate', 'source-video', {
    apiKey: 'offline-test-key', timeout: 100, interval: 1, now: () => time, sleep: async ms => {time += ms;},
    fetchImpl: async (url, options) => {
      calls.push({url, options});
      return json(calls.length === 1 ? {status: 'ON_QUEUE', jobId: 'source-video'} : {status: 'SUCCESS', jobId: 'source-video', data: {videos: ['https://cdn.midjourney.com/video/0.mp4']}});
    }
  });
  assert.equal(result.status, 'succeeded');
  assert.equal(calls.length, 2);
  for (const call of calls) {
    assert.equal(call.options.method, 'GET');
    assert.equal(new URL(call.url).pathname, '/midjourney/video/fetch');
    assert.equal(new URL(call.url).searchParams.get('jobId'), 'source-video');
    assert.equal(call.options.headers['TT-API-KEY'], 'offline-test-key');
  }
});

test('an ambiguous Midjourney submission is sent once with a mock and its fake key is redacted', async () => {
  const op = image.operations['midjourney-imagine'];
  let calls = 0;
  await assert.rejects(request(planRequest(op, op.example), {apiKey: 'offline-fake-secret', fetchImpl: async () => {calls++; throw new Error('offline-fake-secret disconnected');}}), error => !error.message.includes('offline-fake-secret') && error.message.includes('may have reached'));
  assert.equal(calls, 1);
});
