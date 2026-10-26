import test from 'node:test';
import assert from 'node:assert/strict';
import { validateInput, planRequest, normalize } from '../scripts/ttapi-runtime.mjs';
import { catalog as novel } from '../skills/image/ttapi-novel-ai/scripts/catalog.mjs';
import { catalog as flux } from '../skills/image/ttapi-flux-image/scripts/catalog.mjs';
import { catalog as grok } from '../skills/image/ttapi-grok-image/scripts/catalog.mjs';
import { catalog as seedream } from '../skills/image/ttapi-seedream/scripts/catalog.mjs';

// Offline tests only. API contracts: https://docs.ttapi.io/openapi/en/{novel,flux,grokimage,seedream}.json.
// Response shapes below are reduced from their public response examples; no keys or paid calls.
for (const catalog of [novel, flux, grok, seedream]) {
  for (const [name, operation] of Object.entries(catalog.operations)) {
    test(`${catalog.skill}: documented example validates and builds ${name}`, () => {
      validateInput(operation, operation.example);
      assert(!JSON.stringify(operation.schema).includes('"$ref"'), 'schemas must be self-contained');
      const request = planRequest(operation, operation.example);
      assert.equal(new URL(request.url).origin, 'https://api.ttapi.io');
      assert.equal(request.method, 'POST');
      assert.deepEqual(request.body, operation.example);
    });
  }
}

test('NovelAI validates typed seeds, image count, character positions and redraw strength', () => {
  const create = novel.operations['novel-text-to-image'];
  assert.throws(() => validateInput(create, { ...create.example, seed: 42 }), /must be string/);
  assert.throws(() => validateInput(create, { ...create.example, n: 5 }), /<= 4/);
  assert.throws(() => validateInput(create, { ...create.example, character_prompts: [{ prompt: 'adult explorer', center: { x: 1.1, y: 0.5 } }] }), /<= 1/);
  const edit = novel.operations['novel-image-to-image'];
  assert.throws(() => validateInput(edit, { ...edit.example, strength: 1 }), /<= 0.99/);
});

test('NovelAI accepts the officially illustrated imageUrl array as generated outputs', () => {
  const operation = novel.operations['novel-text-to-image'];
  const result = normalize({ status: 'SUCCESS', jobId: 'novel-task', data: { imageUrl: ['https://cdn.ttapi.io/result-a.png', 'https://cdn.ttapi.io/result-b.png'] } }, operation, 'novel-text-to-image', 'poll');
  assert.equal(result.status, 'succeeded');
  assert.deepEqual(result.assets.map(asset => asset.url), ['https://cdn.ttapi.io/result-a.png', 'https://cdn.ttapi.io/result-b.png']);
});

test('Flux 3 and Klein retain separate controls and a bounded exact-size contract', () => {
  const standard = flux.operations['flux-3-image'];
  assert.throws(() => validateInput(standard, { ...standard.example, width: 1024 }), /not supported/);
  const klein = flux.operations['flux-3-image-klein'];
  assert.throws(() => validateInput(klein, { ...klein.example, width: 1024 }), /together/);
  assert.throws(() => validateInput(klein, { ...klein.example, width: 6256, height: 6256 }), /16822272/);
  validateInput(klein, { ...klein.example, width: 1024, height: 1024, seed: 42, steps: 8 });
});

test('older Flux fields preserve documented numeric-string dimensions and boolean upsampling', () => {
  const operation = flux.operations['flux-pro'];
  validateInput(operation, { ...operation.example, width: '1024', height: '768', prompt_upsampling: true });
  assert.throws(() => validateInput(operation, { ...operation.example, width: 1024 }), /must be string/);
  assert.throws(() => validateInput(operation, { ...operation.example, width: '1025' }), /multiple of 32/);
  assert.throws(() => validateInput(operation, { ...operation.example, prompt_upsampling: 'true' }), /must be boolean/);
});

test('Flux multipart edits support one or multiple local-file markers without inventing JSON upload', () => {
  const operation = flux.operations['flux-edit'];
  validateInput(operation, { ...operation.example, image: [{ $file: './a.png' }, { $file: './b.png' }] });
  assert.equal(planRequest(operation, operation.example).bodyType, 'multipart');
  assert.throws(() => validateInput(operation, { ...operation.example, image: './a.png' }), /exactly one/);
});

test('Flux result retrieval uses the explicitly documented GET multipart form body', () => {
  const operation = flux.operations['flux-3-image'];
  const plan = planRequest(operation, undefined, 'flux-task');
  assert.equal(plan.method, 'GET');
  assert.equal(new URL(plan.url).pathname, '/flux/fetch');
  assert.equal(new URL(plan.url).search, '');
  assert.equal(plan.bodyType, 'multipart');
  assert.deepEqual(plan.body, { jobId: 'flux-task' });
});

test('Grok Image edits require a source and model-dependent controls remain restricted', () => {
  const create = grok.operations['grok-image-generate'];
  assert.throws(() => validateInput(create, { ...create.example, quality: 'medium' }), /grok-imagine-image-2.0/);
  assert.throws(() => validateInput(create, { ...create.example, enable_pro: true }), /one of/);
  assert.throws(() => validateInput(create, { model: 'grok-imagine-2.0', prompt: 'test', enable_pro: false }), /true/);
  const edit = grok.operations['grok-image-edit'];
  assert.throws(() => validateInput(edit, { model: 'grok-imagine-image', prompt: 'edit' }), /refer_images/);
  const poll = planRequest(edit, undefined, 'id /?&');
  assert.equal(poll.method, 'POST');
  assert.equal(new URL(poll.url).pathname, '/grok/image/fetch');
  assert.equal(new URL(poll.url).searchParams.get('jobId'), 'id /?&');
  assert.equal(poll.body, undefined);
});

test('Grok Image exports generated images and excludes reference inputs', () => {
  const result = normalize({ status: 'SUCCESS', jobId: 'grok-task', data: { images: ['https://cdn.ttapi.io/generated.jpg'], refer_images: ['https://cdn.ttapi.io/reference.jpg'] } }, grok.operations['grok-image-edit'], 'grok-image-edit', 'poll');
  assert.deepEqual(result.assets.map(asset => asset.url), ['https://cdn.ttapi.io/generated.jpg']);
});

test('Seedream recognizes both documented acceptance ID envelopes and encoded path polling', () => {
  const operation = seedream.operations['seedream-text-to-image'];
  for (const raw of [{ status: 'PENDING_QUEUE', id: 'seed-task' }, { status: 'SUCCESS', data: { id: 'seed-task' } }]) {
    const result = normalize(raw, operation, 'seedream-text-to-image', 'submit');
    assert.equal(result.taskId, 'seed-task');
    assert(['submitted', 'queued'].includes(result.status));
  }
  const plan = planRequest(operation, undefined, 'id /?&');
  assert(plan.url.endsWith('/id%20%2F%3F%26'));
  assert.equal(plan.body, undefined);
});

test('Seedream output selection, sync behavior and workflow constraints are explicit', () => {
  const operation = seedream.operations['seedream-text-to-image'];
  const result = normalize({ status: 'SUCCESS', id: 'seed-task', data: { images: ['https://cdn.ttapi.io/output.png'], image: ['https://cdn.ttapi.io/reference.png'] } }, operation, 'seedream-text-to-image', 'poll');
  assert.equal(result.status, 'succeeded');
  assert.deepEqual(result.assets.map(asset => asset.url), ['https://cdn.ttapi.io/output.png']);
  const sync = seedream.operations['seedream-text-to-image-sync'];
  assert.equal(sync.poll, undefined);
  assert.equal(normalize({ created: 1, data: [{ url: 'https://cdn.ttapi.io/sync.jpg' }] }, sync, 'seedream-text-to-image-sync').status, 'succeeded');
  const multi = seedream.operations['seedream-multi-image'];
  assert.throws(() => validateInput(multi, { ...multi.example, image: ['https://example.com/a.jpg'] }), /at least 2/);
  const layers = seedream.operations['seedream-layers'];
  assert.throws(() => validateInput(layers, { ...layers.example, layer_decomposition: false }), /true/);
  assert.throws(() => validateInput(operation, { ...operation.example, response_format: 'b64_json' }), /url/);
  assert.throws(() => validateInput(operation, { ...operation.example, model: 'doubao-seedream-5-0-flash-260915', optimize_prompt_options: { mode: 'fast' } }), /standard/);
});
