import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog as happy } from '../skills/video/ttapi-happyhorse/scripts/catalog.mjs';
import { catalog as gemini } from '../skills/video/ttapi-gemini-video/scripts/catalog.mjs';
import { catalog as flux } from '../skills/video/ttapi-flux3-video/scripts/catalog.mjs';
import { catalog as producer } from '../skills/audio/ttapi-producer/scripts/catalog.mjs';
import { validateInput, planRequest, normalize, waitForTask, request } from '../scripts/ttapi-runtime.mjs';

// Offline contracts only. Explicit mock credentials prevent using the real environment key.
const catalogs = [happy, gemini, flux, producer];
const rejected = (operation, input) => assert.throws(() => validateInput(operation, input), { code: 'INVALID_INPUT' });
const clone = value => structuredClone(value);

test('all 22 video/audio product examples validate without credentials or network', () => {
  assert.equal(catalogs.reduce((count, catalog) => count + Object.keys(catalog.operations).length, 0), 22);
  for (const catalog of catalogs) for (const operation of Object.values(catalog.operations)) {
    assert.doesNotThrow(() => validateInput(operation, operation.example));
    assert.equal(planRequest(operation, operation.example).method, 'POST');
    assert.ok(operation.docs.every(url => url.startsWith('https://docs.ttapi.io/')));
  }
});

test('HappyHorse follows dedicated page paths and requires one first frame', () => {
  for (const operation of Object.values(happy.operations)) assert.equal(operation.path, '/happyhorse/api/v1/services/aigc/video-generation/video-synthesis');
  const operation = happy.operations['happyhorse-image-to-video'];
  const input = clone(operation.example);
  input.input.media.push(clone(input.input.media[0]));
  rejected(operation, input);
  input.input.media = [{ type: 'last_frame', url: 'https://example.com/frame.png' }];
  rejected(operation, input);
  assert.equal(planRequest(operation, undefined, 'job/id').url, 'https://api.ttapi.io/happyhorse/api/v1/tasks/job%2Fid');
});

test('HappyHorse video edit needs exactly one source video and at most five references', () => {
  const operation = happy.operations['happyhorse-video-edit'];
  const input = clone(operation.example);
  input.input.media = [{ type: 'reference_image', url: 'https://example.com/frame.png' }];
  rejected(operation, input);
  input.input.media = [operation.example.input.media[0], operation.example.input.media[0]];
  rejected(operation, input);
});

test('Gemini Veo duration stays a string and source video references require Omni Flash', () => {
  const operation = gemini.operations['gemini-video-generate'];
  const input = clone(operation.example);
  rejected(operation, { ...input, duration: 8 });
  rejected(operation, { ...input, duration: '10' });
  rejected(operation, { ...input, reference_videos: ['https://example.com/source.mp4'] });
  assert.doesNotThrow(() => validateInput(operation, { ...input, model: 'omni-flash', duration: '10', reference_videos: ['https://example.com/source.mp4'] }));
  assert.equal(planRequest(operation, undefined, 'job fixture').url, 'https://api.ttapi.io/gemini/video/fetch?jobId=job+fixture');
});

test('FLUX 3 video modes and image timing cannot be mixed accidentally', () => {
  const t2v = flux.operations['flux3-text-to-video'];
  rejected(t2v, { ...t2v.example, mode: 'i2v' });
  rejected(t2v, { ...t2v.example, duration: '5' });
  const i2v = flux.operations['flux3-image-to-video'];
  rejected(i2v, { ...i2v.example, keyframes: ['https://example.com/a.png', [2, 'https://example.com/b.png']] });
  rejected(i2v, { ...i2v.example, keyframes: [[3, 'https://example.com/a.png'], [1, 'https://example.com/b.png']] });
  rejected(i2v, { ...i2v.example, duration: 'auto', keyframes: ['https://example.com/a.png', 'https://example.com/b.png', 'https://example.com/c.png'] });
  assert.doesNotThrow(() => validateInput(i2v, { ...i2v.example, keyframes: [[0, 'https://example.com/a.png'], [4, 'https://example.com/b.png']] }));
});

test('FLUX query preserves the documented GET multipart-body contract', async () => {
  const operation = flux.operations['flux3-text-to-video'];
  assert.equal(operation.poll.location, 'body');
  assert.equal(operation.poll.bodyType, 'multipart');
  const plan = planRequest(operation, undefined, 'flux-job-fixture');
  assert.equal(plan.method, 'GET');
  assert.equal(plan.url, 'https://api.ttapi.io/bfl/v1/fetch');
  assert.equal(plan.bodyType, 'multipart');
  await request(plan, {
    apiKey: 'mock-key-not-a-real-credential',
    fetchImpl: async (url, init) => {
      assert.equal(init.method, 'GET');
      assert.ok(init.body instanceof FormData);
      assert.equal(init.body.get('jobId'), 'flux-job-fixture');
      return new Response(JSON.stringify({ status: 'ON_QUEUE', data: { jobId: 'flux-job-fixture' } }), { status: 200 });
    }
  });
});

test('normalization downloads only each products generated output fields', () => {
  const cases = [
    [happy.operations['happyhorse-text-to-video'], { output: { task_id: 'happy-job', task_status: 'SUCCEEDED', video_url: 'https://example.com/output.mp4' }, request_id: 'trace-only' }, 'happy-job'],
    [gemini.operations['gemini-video-generate'], { status: 'SUCCESS', jobId: 'gemini-job', data: { video_url: 'https://example.com/output.mp4', reference_images: ['https://example.com/input.png'] } }, 'gemini-job'],
    [flux.operations['flux3-text-to-video'], { status: 'SUCCESS', jobId: 'flux-job', data: { videoUrl: 'https://example.com/output.mp4', start_video: 'https://example.com/input.mp4' } }, 'flux-job'],
    [producer.operations['producer-generate'], { status: 'SUCCESS', jobId: 'producer-job', data: { musics: [{ musicId: 'track-id', audioUrl: 'https://example.com/output.mp3', imageUrl: 'https://example.com/cover.png' }] } }, 'producer-job']
  ];
  for (const [operation, payload, taskId] of cases) {
    const result = normalize(payload, operation, 'fixture', 'poll');
    assert.equal(result.taskId, taskId);
    assert.equal(result.status, 'succeeded');
    assert.equal(result.assets.length, 1);
    assert.ok(result.assets[0].url.includes('/output.'));
  }
});

test('Producer distinguishes request jobId from source musicId and keeps numeric fields numeric', () => {
  const operation = producer.operations['producer-generate'];
  rejected(operation, { ...operation.example, sound_prompt: '', lyrics_text: '' });
  rejected(operation, { ...operation.example, lyrics_strength: '0.5' });
  rejected(operation, { ...operation.example, sound_strength: 0.1 });
  rejected(operation, { ...operation.example, model: 'FUZZ-2.0' });
  assert.equal(planRequest(operation, undefined, 'producer-job').url, 'https://api.ttapi.io/producer/v1/fetch?jobId=producer-job');
  const replace = producer.operations['producer-replace'];
  rejected(replace, { ...replace.example, starts: 20, ends: 10 });
});

test('Producer synchronous lyrics and video results do not require another paid task', () => {
  const lyrics = normalize({ status: 'SUCCESS', data: { jobId: 'lyrics-job', lyrics: 'Original fixture line.' } }, producer.operations['producer-lyrics'], 'producer-lyrics');
  assert.equal(lyrics.status, 'succeeded');
  assert.deepEqual(lyrics.assets, []);
  const video = normalize({ status: 'SUCCESS', data: { status: 'complete', videoUrl: 'https://example.com/video.mp4' } }, producer.operations['producer-generate-video'], 'producer-generate-video');
  assert.equal(video.status, 'succeeded');
  assert.equal(video.assets[0].url, 'https://example.com/video.mp4');
  assert.equal(producer.operations['producer-lyrics'].poll, undefined);
});

test('HappyHorse mock wait polls an existing task and never posts a generation', async () => {
  let calls = 0;
  const operation = happy.operations['happyhorse-text-to-video'];
  const result = await waitForTask(operation, 'happyhorse-text-to-video', 'saved-task', {
    apiKey: 'mock-key-not-a-real-credential', interval: 1, timeout: 100,
    now: () => calls, sleep: async () => {},
    fetchImpl: async (url, init) => {
      calls++;
      assert.equal(url, 'https://api.ttapi.io/happyhorse/api/v1/tasks/saved-task');
      assert.equal(init.method, 'GET');
      return new Response(JSON.stringify({ output: { task_id: 'saved-task', task_status: calls === 1 ? 'RUNNING' : 'SUCCEEDED', ...(calls > 1 ? { video_url: 'https://example.com/result.mp4' } : {}) } }), { status: 200 });
    }
  });
  assert.equal(calls, 2);
  assert.equal(result.status, 'succeeded');
});
