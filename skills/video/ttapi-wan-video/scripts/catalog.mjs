// Documented TTAPI video request shapes. No credentials or network calls here.
const wanPath = '/wan/api/v1/services/aigc/video-generation/video-synthesis';
const wanPoll = {method: 'GET', path: '/wan/api/v1/tasks/{task_id}', idParam: 'task_id', location: 'path'};
const grokPoll = {method: 'GET', path: '/grok/fetch', idParam: 'jobId', location: 'query'};
const spec = name => `https://docs.ttapi.io/openapi/en/${name}.json`;
const wanParameters = {
  type: 'object', additionalProperties: false,
  properties: {
    resolution: {type: 'string', enum: ['1080P', '720P', '480P'], default: '1080P'},
    ratio: {type: 'string', enum: ['adaptive', '16:9', '4:3', '1:1', '3:4', '9:16'], default: 'adaptive'},
    duration: {type: 'integer', oneOf: [{const: -1}, {minimum: 2, maximum: 30}], default: 5, description: 'Seconds, or -1 for smart duration.'},
    audio: {type: 'boolean', default: true},
    seed: {type: 'integer', minimum: 0, maximum: 2147483647},
    prompt_extend: {type: 'boolean', default: true},
    watermark: {type: 'boolean', default: false}
  }
};
const wanPrompt = {type: 'string', minLength: 1, maxLength: 20000};
function wanSchema(mode) {
  const input = {type: 'object', additionalProperties: false, properties: {prompt: wanPrompt}};
  if (mode === 'text') input.required = ['prompt'];
  else {
    input.required = ['media'];
    input.properties.media = {
      type: 'array', minItems: mode === 'first' ? 1 : 2, maxItems: mode === 'first' ? 1 : 2,
      items: {
        type: 'object', additionalProperties: false, required: ['type', 'url'],
        properties: {
          type: {type: 'string', enum: mode === 'first' ? ['first_frame'] : ['first_frame', 'last_frame']},
          url: {type: 'string', minLength: 1, description: 'Image URL or Base64 data; not a local filesystem path.'}
        }
      }
    };
  }
  return {
    type: 'object', additionalProperties: false, required: ['model', 'input'],
    properties: {model: {type: 'string', enum: ['wan3.0-video']}, input, parameters: wanParameters}
  };
}
const fastDurations = Array.from({length: 25}, (_, i) => String(i + 6)).filter(value => value !== '7' && value !== '11');
const otherDurations = Array.from({length: 15}, (_, i) => String(i + 1));
const grokModels = ['grok-imagine-video-1.5-fast', 'grok-imagine-video', 'grok-imagine-video-1.5', 'grok-imagine-video-1.5-lite'];
function grokSchema(firstFrame) {
  return {
    type: 'object', additionalProperties: false,
    required: firstFrame ? ['model', 'prompt', 'first_frame'] : ['model', 'prompt'],
    properties: {
      model: {type: 'string', enum: firstFrame ? ['grok-imagine-video-1.5-fast', 'grok-imagine-video-1.5'] : grokModels},
      prompt: {type: 'string', minLength: 1},
      aspect_ratio: {type: 'string', enum: ['2:3', '3:2', '1:1', '9:16', '16:9'], default: '16:9'},
      video_length: {type: 'string', default: '10', description: 'Seconds as a JSON string, not a number. Model-specific ranges apply.'},
      resolution_name: {type: 'string', enum: ['480p', '720p', '1080p'], default: '720p'},
      ...(firstFrame ? {first_frame: {type: 'string', minLength: 1, description: 'Public first-frame image URL.'}} : {}),
      hook_url: {type: 'string', minLength: 1, description: 'Optional callback URL. Omit when polling locally.'}
    },
    allOf: [
      {
        if: {properties: {model: {const: 'grok-imagine-video-1.5-fast'}}, required: ['model']},
        then: {properties: {video_length: {enum: fastDurations}, resolution_name: {enum: ['480p', '720p']}}},
        else: {properties: {video_length: {enum: otherDurations}, prompt: {maxLength: 4096}}}
      },
      {
        if: {properties: {model: {const: 'grok-imagine-video'}}, required: ['model']},
        then: {properties: {resolution_name: {enum: ['720p']}}}
      }
    ]
  };
}
const wanExampleParameters = {resolution: '720P', ratio: '16:9', duration: 5, audio: true};

const sourceCatalog = {
  skill: 'ttapi-video',
  title: 'TTAPI video generation with Wan 3.0 and Grok',
  operations: {
    'wan-text-to-video': {
      family: 'wan', description: 'Generate a video from a Chinese or English text prompt using wan3.0-video.',
      method: 'POST', path: wanPath, bodyType: 'json', schema: wanSchema('text'),
      example: {model: 'wan3.0-video', input: {prompt: 'A paper boat floats across a quiet pond at sunrise, slow cinematic camera movement.'}, parameters: wanExampleParameters},
      docs: [spec('wan-text-to-video'), spec('wan-task-result')], poll: wanPoll, assetPaths: ['output.video_url']
    },
    'wan-first-frame-to-video': {
      family: 'wan', description: 'Animate an explicitly specified first-frame image using wan3.0-video.',
      method: 'POST', path: wanPath, bodyType: 'json', schema: wanSchema('first'),
      example: {model: 'wan3.0-video', input: {prompt: 'The camera slowly moves closer as the subject turns toward the light.', media: [{type: 'first_frame', url: 'https://example.com/first-frame.jpg'}]}, parameters: wanExampleParameters},
      docs: [spec('wan-first-frame-to-video'), spec('wan-task-result')], poll: wanPoll, assetPaths: ['output.video_url']
    },
    'wan-first-last-frame-to-video': {
      family: 'wan', description: 'Generate a transition with exactly one first frame and one last frame using wan3.0-video.',
      method: 'POST', path: wanPath, bodyType: 'json', schema: wanSchema('first-last'),
      validate(input) {
        const types = input?.input?.media?.map(item => item.type) ?? [];
        if (types.filter(type => type === 'first_frame').length !== 1 || types.filter(type => type === 'last_frame').length !== 1) {
          return ['Wan first/last-frame generation requires exactly one first_frame and one last_frame.'];
        }
        return [];
      },
      example: {model: 'wan3.0-video', input: {prompt: 'A smooth continuous camera movement connects the two scenes.', media: [{type: 'first_frame', url: 'https://example.com/first-frame.jpg'}, {type: 'last_frame', url: 'https://example.com/last-frame.jpg'}]}, parameters: wanExampleParameters},
      docs: [spec('wan-first-last-frame-to-video'), spec('wan-task-result')], poll: wanPoll, assetPaths: ['output.video_url']
    },
    'grok-text-to-video': {
      family: 'grok', description: 'Generate a video from text with the TTAPI Grok compatibility endpoint.',
      method: 'POST', path: '/grok/generations', bodyType: 'json', schema: grokSchema(false),
      example: {model: 'grok-imagine-video-1.5-fast', prompt: 'A red fox crosses a snowy forest clearing, soft morning light, slow tracking shot.', aspect_ratio: '16:9', video_length: '6', resolution_name: '720p'},
      docs: [spec('grok-text-to-video'), spec('grok')], poll: grokPoll, assetPaths: ['data.videoUrl']
    },
    'grok-first-frame-to-video': {
      family: 'grok', description: 'Animate a first-frame image with Grok fast or Grok 1.5 through the TTAPI compatibility endpoint.',
      method: 'POST', path: '/grok/generations', bodyType: 'json', schema: grokSchema(true),
      example: {model: 'grok-imagine-video-1.5-fast', prompt: 'The subject gently turns toward the camera while the background remains stable.', first_frame: 'https://example.com/first-frame.jpg', aspect_ratio: '16:9', video_length: '6', resolution_name: '720p'},
      docs: [spec('grok-first-frame-to-video'), spec('grok')], poll: grokPoll, assetPaths: ['data.videoUrl']
    }
  }
};

// Independent product bundle; no imports from sibling Skills.
export const catalog={...sourceCatalog,skill:"ttapi-wan-video",title:"TTAPI Wan 3.0 Video",operations:Object.fromEntries(Object.entries(sourceCatalog.operations).filter(([id])=>["wan-text-to-video","wan-first-frame-to-video","wan-first-last-frame-to-video"].includes(id)))};
