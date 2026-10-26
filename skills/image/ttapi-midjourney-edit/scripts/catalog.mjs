// Separate TTAPI Midjourney Edit product, checked 2026-10-26.
const poll = {method: 'GET', path: '/midjourney/image-edits/fetch', idParam: 'jobId', location: 'query'};
function operation(type) {
  return {
    family: 'Midjourney Edit',
    description: type === 'edit' ? 'Edit the transparent regions of a supplied image; returns four image candidates asynchronously.' : 'Retexture a supplied image using the dedicated Midjourney Edit product.',
    method: 'POST', path: '/midjourney/image-edits/submit', bodyType: 'json',
    schema: {
      type: 'object', additionalProperties: false, required: ['prompt', 'image', 'type'],
      properties: {
        prompt: {type: 'string', minLength: 1, description: 'Editing instruction; the documentation recommends English.'},
        image: {type: 'string', pattern: '^(https?://|data:image/(png|jpeg|jpg|bmp|webp);base64,)', description: 'Public image URL or image Base64 data URL. Edit regions should be transparent; no local file path.'},
        mode: {type: 'string', enum: ['relax', 'fast', 'turbo'], default: 'fast'},
        type: {type: 'string', const: type},
        hookUrl: {type: 'string', pattern: '^https?://', description: 'Optional callback URL; omit when polling.'}
      }
    },
    example: {prompt: type === 'edit' ? 'Fill the transparent region with a leafy green houseplant, matching the existing light.' : 'Restyle the scene as a refined watercolor illustration while retaining its layout.', image: 'https://example.com/your-image.png', mode: 'fast', type},
    poll, taskIdPaths: ['jobId', 'data.jobId'], statusPaths: ['status'], assetPaths: ['data.cdnImages'],
    docs: ['https://docs.ttapi.io/api/en/midjourneyedit/submit', 'https://docs.ttapi.io/api/en/midjourneyedit/fetch', 'https://docs.ttapi.io/openapi/en/midjourneyedit.json']
  };
}

export const catalog = {
  skill: 'ttapi-midjourney-edit', title: 'TTAPI Midjourney Edit',
  operations: {'midjourney-edit': operation('edit'), 'midjourney-retexture': operation('retexture')}
};
