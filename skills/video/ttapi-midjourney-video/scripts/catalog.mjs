// TTAPI Midjourney video endpoints are bundled in official openapi/en/sora.json.
// The historical spec title is not the endpoint's product name.
const httpImage = {type: 'string', pattern: '^https?://', description: 'Publicly accessible image URL; not a local path or Base64 payload.'};
const motion = {type: 'string', enum: ['low', 'high'], default: 'low', description: 'Motion intensity. This field is named manual even though its value is low/high.'};
const batch = {type: 'integer', enum: [1, 2, 4], default: 4, description: 'Number of generated videos. Normalized from the source int type and stringified numeric enum; specify explicitly to control the batch.'};
const hookUrl = {type: 'string', pattern: '^https?://', description: 'Optional callback URL; omit when polling.'};
const poll = {method: 'GET', path: '/midjourney/video/fetch', idParam: 'jobId', location: 'query'};
function operation(name, description, schema, example) {
  return {
    family: 'Midjourney Video', description, method: 'POST', path: `/midjourney/video/${name}`, bodyType: 'json',
    schema, example, poll, taskIdPaths: ['jobId', 'data.jobId'], statusPaths: ['status'], assetPaths: ['data.videos'],
    docs: [`https://docs.ttapi.io/api/en/videoapi/${name}`, 'https://docs.ttapi.io/api/en/videoapi/fetch', 'https://docs.ttapi.io/openapi/en/sora.json']
  };
}

export const catalog = {
  skill: 'ttapi-midjourney-video', title: 'TTAPI Midjourney Video',
  operations: {
    'midjourney-video-generate': operation('submit', 'Animate a starting image, optionally toward an ending image, and retrieve the resulting video batch.',
      {type: 'object', additionalProperties: false, required: ['prompt', 'imageUrl'], properties: {
        prompt: {type: 'string', minLength: 1, description: 'Requested motion and video content.'}, imageUrl: httpImage, endingUrl: httpImage,
        model: {type: 'string', enum: ['fast'], description: 'Speed mode, not a model ID. The documentation currently supports fast only.'},
        manual: motion, resolution: {type: 'string', enum: ['hd', 'sd'], default: 'sd'}, bs: batch, hookUrl
      }},
      {prompt: 'The camera slowly approaches the subject as leaves move gently in a light breeze.', imageUrl: 'https://example.com/your-first-frame.png', model: 'fast', manual: 'low', resolution: 'sd', bs: 1}),
    'midjourney-video-extend': operation('extend', 'Extend one selected video from a completed Midjourney video task; creates a new task.',
      {type: 'object', additionalProperties: false, required: ['jobId', 'index'], properties: {
        jobId: {type: 'string', minLength: 1, description: 'Completed source Midjourney VIDEO task ID.'},
        index: {type: 'integer', minimum: 0, maximum: 3, description: 'Zero-based source video index, also limited to the actual number of returned videos.'},
        manual: motion, animateMode: {type: 'string', enum: ['auto', 'manual'], default: 'auto'}, bs: batch, hookUrl
      }},
      {jobId: 'c679a92e-dae0-462d-b70f-dcfeaf2189fa', index: 0, manual: 'low', animateMode: 'auto', bs: 1})
  }
};
