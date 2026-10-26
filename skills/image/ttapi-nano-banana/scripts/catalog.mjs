// Contract snapshot: TTAPI public image documentation, checked 2026-10-26.
// These schemas intentionally expose the supported non-streaming image subset.
const string = (description) => ({ type: 'string', minLength: 1, description });
const enums = (values, description) => ({ type: 'string', enum: values, description });
const remoteImage = { type: 'string', pattern: '^https?://', description: 'Public HTTP(S) reference-image URL; not a local path.' };
const imageReference = {
  type: 'object', additionalProperties: false,
  properties: { file_id: string('An existing image File API ID.'), image_url: { type: 'string', pattern: '^(https?://|data:image/)', description: 'HTTP(S) image URL or base64 image data URL.' } },
  oneOf: [{ required: ['file_id'], not: { required: ['image_url'] } }, { required: ['image_url'], not: { required: ['file_id'] } }]
};
const standardProperties = {
  model: enums(['gpt-image-2', 'gpt-image-2.5-flare', 'gpt-image-2.5-sunburst'], 'Exact standard-image model ID; not the asynchronous gpt-image-2.5 alias.'),
  prompt: { ...string('Image prompt.'), maxLength: 32000 },
  background: enums(['transparent', 'opaque', 'auto'], 'Transparent output requires PNG or WebP.'),
  moderation: enums(['low', 'auto'], 'Documented moderation level.'),
  n: { type: 'integer', minimum: 1, maximum: 10, description: 'Number of images; omit for one.' },
  output_compression: { type: 'integer', minimum: 0, maximum: 100, description: 'Only for JPEG/WebP output.' },
  output_format: enums(['png', 'jpeg', 'webp'], 'Generated file format; default PNG.'),
  quality: enums(['auto', 'low', 'medium', 'high', 'xhigh', 'max'], 'xhigh/max are available only for the 2.5 variants.'),
  size: string('auto or WIDTHxHEIGHT. Generation dimensions must be divisible by 16 with aspect ratio from 1:3 to 3:1.'),
  stream: { type: 'boolean', const: false, description: 'This bundled JSON client supports non-streaming responses only.' },
  user: string('Optional end-user identifier.')
};
const standardRules = [
  { if: { properties: { model: { const: 'gpt-image-2' } } }, then: { properties: { quality: { enum: ['auto', 'low', 'medium', 'high'] } } } },
  { if: { required: ['background'], properties: { background: { const: 'transparent' } } }, then: { properties: { output_format: { enum: ['png', 'webp'] } } } },
  { if: { required: ['output_compression'] }, then: { required: ['output_format'], properties: { output_format: { enum: ['jpeg', 'webp'] } } } }
];
function validateSize(input, plus = false) {
  const errors = [];
  if (input.size === undefined || input.size === 'auto') return errors;
  const match = /^(\d+)x(\d+)$/.exec(input.size);
  if (!match) return ['size must be auto or WIDTHxHEIGHT with positive integer dimensions.'];
  const width = Number(match[1]), height = Number(match[2]);
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width <= 0 || height <= 0 || width % 16 !== 0 || height % 16 !== 0) errors.push('Both size dimensions must be positive safe integers divisible by 16.');
  if (width > height * 3 || height > width * 3) errors.push('size aspect ratio must be between 1:3 and 3:1.');
  if (plus || input.model === 'gpt-image-2.5-flare' || input.model === 'gpt-image-2.5-sunburst') {
    if (Math.max(width, height) > 3840) errors.push('This model limits the longest size edge to 3840.');
    if (width * height < 655360 || width * height > 8294400) errors.push('This model requires 655360–8294400 total pixels.');
  }
  return errors;
}
const sourceCatalog = {
  skill: 'ttapi-image',
  title: 'TTAPI GPT Image 2 and Nano Banana',
  operations: {
    'image2-generate': {
      family: 'GPT Image 2 · standard synchronous',
      description: 'Generate images with gpt-image-2 or the standard GPT Image 2.5 Flare/Sunburst variants. Returns base64 directly.',
      method: 'POST', baseUrl: 'https://api.ttapi.org', path: '/v1/images/generations', bodyType: 'json',
      schema: { type: 'object', additionalProperties: false, required: ['model', 'prompt'], properties: standardProperties, allOf: standardRules },
      validate: (input) => validateSize(input),
      example: { model: 'gpt-image-2', prompt: 'Editorial product photo of a ceramic tea cup on a pale stone table, soft morning light.', size: '1024x1024', quality: 'medium', output_format: 'png', n: 1, stream: false },
      docs: ['https://docs.ttapi.io/api/en/openai/images-generations', 'https://docs.ttapi.io/openapi/en/openai.json'],
      assetPaths: ['data.*.b64_json']
    },
    'image2-edit': {
      family: 'GPT Image 2 · standard synchronous edit',
      description: 'Edit with gpt-image-2 using JSON image URL/data URL/File ID references. Returns base64 directly; no multipart upload.',
      method: 'POST', baseUrl: 'https://api.ttapi.org', path: '/v1/images/edits', bodyType: 'json',
      schema: {
        type: 'object', additionalProperties: false, required: ['model', 'prompt', 'images'],
        properties: {
          ...standardProperties,
          model: { type: 'string', const: 'gpt-image-2', description: 'GPT Image 2.5 editing is not listed in the current TTAPI edit schema.' },
          images: { type: 'array', minItems: 1, maxItems: 16, items: imageReference },
          mask: imageReference,
          input_fidelity: enums(['high', 'low'], 'Source-detail preservation; server default low.'),
          size: enums(['auto', '1024x1024', '1536x1024', '1024x1536'], 'The edit schema lists these sizes; generation size rules are different.'),
          quality: enums(['auto', 'low', 'medium', 'high'], 'Edit quality.')
        },
        allOf: standardRules.slice(1)
      },
      example: { model: 'gpt-image-2', prompt: 'Replace the background with a softly lit photography studio, preserving the cup.', images: [{ image_url: 'https://cdn.ttapi.io/demo/2025-03-30/5d17dd5207daeeac86bcecd2d6405a0.jpg' }], size: '1024x1024', stream: false },
      docs: ['https://docs.ttapi.io/api/en/openai/images-edits', 'https://docs.ttapi.io/openapi/en/openai.json'],
      assetPaths: ['data.*.b64_json']
    },
    'image2-async': {
      family: 'GPT Image 2 · TTAPI unofficial asynchronous',
      description: 'Use TTAPI’s separately documented unofficial GPT Image 2/2 Plus/2.5 route. Generate or guide edits with public reference URLs and retrieve by jobId.',
      method: 'POST', baseUrl: 'https://api.ttapi.io', path: '/openai/gpt/generations', bodyType: 'json',
      schema: {
        type: 'object', additionalProperties: false, required: ['model', 'prompt'],
        properties: {
          model: enums(['gpt-image-2', 'gpt-image-2-plus', 'gpt-image-2.5'], 'Unofficial-route model IDs; not interchangeable with the standard route.'),
          prompt: string('Generation or reference-edit prompt; retain the user’s intent.'),
          referImages: { type: 'array', items: remoteImage, description: 'Public image URLs; exact camelCase API field.' },
          aspect_ratio: enums(['1:1', '3:4', '4:3', '16:9', '9:16'], 'Documented only for gpt-image-2.'),
          size: string('WIDTHxHEIGHT; documented only for gpt-image-2-plus.'),
          hookUrl: { type: 'string', pattern: '^https?://', description: 'Optional callback endpoint.' }
        },
        allOf: [
          { if: { required: ['aspect_ratio'] }, then: { properties: { model: { const: 'gpt-image-2' } } } },
          { if: { required: ['size'] }, then: { properties: { model: { const: 'gpt-image-2-plus' } } } }
        ]
      },
      validate: (input) => input.size === 'auto' ? ['The asynchronous plus route documents WIDTHxHEIGHT, not auto.'] : validateSize(input, true),
      example: { model: 'gpt-image-2', prompt: 'Generate a clean product photograph of a ceramic tea cup on a pale stone table.', aspect_ratio: '1:1' },
      docs: ['https://docs.ttapi.io/api/en/openai/gpt-generations', 'https://docs.ttapi.io/api/en/openai/gpt-fetch', 'https://docs.ttapi.io/openapi/en/openai.json'],
      poll: { method: 'GET', path: '/openai/gpt/fetch', idParam: 'jobId', location: 'query' },
      assetPaths: ['data.imageUrl']
    },
    'nano-generate': {
      family: 'Nano Banana · synchronous generation and reference editing',
      description: 'Generate or edit through all five documented Nano Banana models. The synchronous response contains data.image_url.',
      method: 'POST', baseUrl: 'https://api.ttapi.org', path: '/gemini/image/generate', bodyType: 'json',
      schema: {
        type: 'object', additionalProperties: false, required: ['model', 'prompt'],
        properties: {
          model: enums(['gemini-2.5-flash-image', 'gemini-3-pro-image-preview', 'gemini-3.1-flash-image', 'gemini-3.1-flash-lite-image', 'gemini-nano-banana-2.1'], 'Exact Gemini model value; see references/nano-banana.md for product aliases.'),
          prompt: string('Image generation or reference-edit description.'),
          refer_images: { type: 'array', items: remoteImage, description: 'Public reference image URLs; exact snake_case API field.' },
          aspect_ratio: enums(['1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9', '1:4', '4:1', '1:8', '8:1'], 'Only Gemini 3 and later. Extra-wide/tall ratios require 3.1 or Nano 2.1.'),
          image_size: enums(['512px', '1K', '2K', '4K'], '512px is documented only for gemini-3.1-flash-image.'),
          google_search: { type: 'boolean', description: 'Optional Google web search.' },
          image_search: { type: 'boolean', description: 'Optional Google image search.' },
          thinking_level: enums(['Minimal', 'Medium', 'High'], 'Case-sensitive. Medium is documented only for gemini-nano-banana-2.1.')
        },
        allOf: [
          { if: { required: ['aspect_ratio'] }, then: { properties: { model: { enum: ['gemini-3-pro-image-preview', 'gemini-3.1-flash-image', 'gemini-3.1-flash-lite-image', 'gemini-nano-banana-2.1'] } } } },
          { if: { required: ['aspect_ratio'], properties: { aspect_ratio: { enum: ['1:4', '4:1', '1:8', '8:1'] } } }, then: { properties: { model: { enum: ['gemini-3.1-flash-image', 'gemini-3.1-flash-lite-image', 'gemini-nano-banana-2.1'] } } } },
          { if: { required: ['image_size'], properties: { image_size: { const: '512px' } } }, then: { properties: { model: { const: 'gemini-3.1-flash-image' } } } },
          { if: { required: ['thinking_level'] }, then: { properties: { model: { enum: ['gemini-3.1-flash-image', 'gemini-3.1-flash-lite-image', 'gemini-nano-banana-2.1'] } } } },
          { if: { required: ['thinking_level'], properties: { thinking_level: { const: 'Medium' } } }, then: { properties: { model: { const: 'gemini-nano-banana-2.1' } } } }
        ]
      },
      example: { model: 'gemini-3.1-flash-image', prompt: 'Editorial product photo of a ceramic tea cup on a pale stone table, soft morning light.', aspect_ratio: '1:1', image_size: '1K' },
      docs: ['https://docs.ttapi.io/api/en/gemini/generate', 'https://docs.ttapi.io/grids/en/start/nano-banana-models-guide', 'https://docs.ttapi.io/openapi/en/gemini.json'],
      assetPaths: ['data.image_url']
    }
  }
};

// Independent product bundle; no imports from sibling Skills.
export const catalog={...sourceCatalog,skill:"ttapi-nano-banana",title:"TTAPI Nano Banana",operations:Object.fromEntries(Object.entries(sourceCatalog.operations).filter(([id])=>["nano-generate"].includes(id)))};
