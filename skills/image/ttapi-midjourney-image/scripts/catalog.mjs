// TTAPI public Midjourney image contract, checked 2026-10-26.
// Self-contained: no dependency on another Skill or the repository root.
const text = description => ({type: 'string', minLength: 1, description});
const imageData = {type: 'string', pattern: '^data:image/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/]+={0,2}$', description: 'Base64 image data URL, not a local path or remote URL.'};
const timeout = {type: 'integer', minimum: 300, maximum: 1200, description: 'Server-side task timeout in seconds; independent of the CLI polling timeout.'};
const common = {timeout, hookUrl: {type: 'string', pattern: '^https?://', description: 'Optional task callback URL; omit for local polling.'}};
const poll = {method: 'GET', path: '/midjourney/v1/fetch', idParam: 'jobId', location: 'query'};
const taskIdPaths = ['jobId', 'data.jobId'];
const statusPaths = ['status'];
const imageAssets = ['data.images', 'data.cdnImage'];
const base64Pixel = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=';
const exampleJob = 'c679a92e-dae0-462d-b70f-dcfeaf2189fa';
function operation(name, description, schema, example, assetPaths = imageAssets) {
  return {
    family: 'Midjourney Image', description, method: 'POST', path: `/midjourney/v1/${name}`, bodyType: 'json',
    schema, example, poll, taskIdPaths, statusPaths, assetPaths,
    docs: [`https://docs.ttapi.io/api/en/midjourney/${name}`, 'https://docs.ttapi.io/openapi/en/midjourney.json']
  };
}
const object = (required, properties) => ({type: 'object', additionalProperties: false, required, properties: {...properties, ...common}});

export const catalog = {
  skill: 'ttapi-midjourney-image', title: 'TTAPI Midjourney Image',
  operations: {
    'midjourney-imagine': operation('imagine', 'Create the initial Midjourney image grid; one request normally produces four images.',
      object(['prompt', 'mode'], {prompt: text('Image prompt. Put supported Midjourney prompt parameters in this string, not extra JSON fields.'), mode: {type: 'string', enum: ['relax', 'fast', 'turbo']}}),
      {prompt: 'A ceramic tea cup on a pale stone table, soft morning light, editorial product photograph', mode: 'fast'}),
    'midjourney-action': operation('action', 'Continue a completed image job using an action returned in its components list, such as upsample1 or variation1.',
      object(['jobId', 'action'], {jobId: text('Completed source image jobId; fetch this task before selecting an action.'), action: text('Exact executable component from the completed source task. Do not invent an action or use a video job ID.')}),
      {jobId: exampleJob, action: 'upsample1'}),
    'midjourney-blend': operation('blend', 'Blend two to five Base64 reference images into a new generated grid.',
      object(['imgBase64Array', 'mode'], {imgBase64Array: {type: 'array', minItems: 2, maxItems: 5, items: imageData}, mode: {type: 'string', enum: ['relax', 'fast'], description: 'The OpenAPI lists turbo, but current image pricing marks turbo blend unsupported; this client exposes relax/fast.'}, dimensions: {type: 'string', enum: ['PORTRAIT', 'SQUARE', 'LANDSCAPE']}}),
      {imgBase64Array: [`data:image/png;base64,${base64Pixel}`, `data:image/png;base64,${base64Pixel}`], mode: 'fast', dimensions: 'SQUARE'}),
    'midjourney-describe': operation('describe', 'Create four prompt suggestions from a Base64 image; the asynchronous result is text, not generated image assets.',
      object(['base64'], {base64: imageData, url: {type: 'string', pattern: '^https?://', description: 'Additional URL field from the API schema. URL-only requests are not exposed because the published schema requires base64.'}}),
      {base64: `data:image/png;base64,${base64Pixel}`}, []),
    'midjourney-seed': operation('seed', 'Retrieve seed information from an existing Midjourney image job; this is a separate asynchronous operation.',
      object(['jobId'], {jobId: text('Existing Midjourney image jobId whose seed is requested.')}),
      {jobId: exampleJob}, []),
    'midjourney-inpaint': operation('inpaint', 'Repaint a selected region of an existing image using a matching black-and-white mask.',
      object(['jobId', 'mask'], {jobId: text('Source Midjourney image jobId.'), mask: {type: 'string', minLength: 1, pattern: '^[A-Za-z0-9+/]+={0,2}$', description: 'Raw Base64 black-and-white mask, same dimensions as source: white repaint / black preserve. No data:image prefix.'}, prompt: text('Requested changes inside the selected white mask area.')}),
      {jobId: exampleJob, mask: base64Pixel, prompt: 'Replace only the selected region with a leafy plant'})
  }
};
