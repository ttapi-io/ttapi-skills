# Dedicated Midjourney Edit

Verified 2026-10-26 against [midjourneyedit.json](https://docs.ttapi.io/openapi/en/midjourneyedit.json), [submit](https://docs.ttapi.io/api/en/midjourneyedit/submit) and [fetch](https://docs.ttapi.io/api/en/midjourneyedit/fetch). [llms.txt](https://docs.ttapi.io/llms.txt) indexes the current official references.

This is a separate TTAPI product from classic Midjourney Imagine/Action/Inpaint. It creates a task from a supplied image; it does not accept a source `jobId`, separate `mask`, `imgBase64Array`, or video fields.

## Request

Both CLI operations use JSON `POST /midjourney/image-edits/submit` with the normal `TT-API-KEY` header:

| Operation | Type | Purpose |
| --- | --- | --- |
| `midjourney-edit` | `edit` | Fill or change the transparent edit regions in a supplied image |
| `midjourney-retexture` | `retexture` | Apply a retexture instruction to the supplied image |

```json
{
  "prompt": "Fill the transparent region with a leafy green houseplant, matching the existing light.",
  "image": "https://example.com/your-image.png",
  "mode": "fast",
  "type": "edit"
}
```

The URL is illustrative and must be replaced. The source supports image URL/Base64 and png, jpg, jpeg, bmp, webp formats. The client exposes HTTP(S) image URLs or `data:image/...;base64,...` strings; it does not automatically upload a local path or interpret `{"$file":"..."}`. For selected-area edits, prepare an image with transparent regions; PNG/WebP can preserve transparency. A URL alone does not prove that the correct area is transparent.

`prompt` and `image` are required by the API. This Skill additionally fixes and requires `type` per operation to avoid accidentally executing another edit mode. Optional `mode` is `relax`, `fast`, or `turbo` (documented default `fast`). Optional `hookUrl` receives callbacks. The CLI validates without inserting defaults. Do not invent a separate model parameter, image count parameter, or generation size parameter.

## Acknowledgement and query

Submission returns `{"status":"SUCCESS","message":"success","data":{"jobId":"..."}}`; this is task acceptance, not a completed image. Query `GET /midjourney/image-edits/fetch?jobId=...`. The docs explicitly say this fetch endpoint consumes no quota.

States are `PENDING_QUEUE`, `ON_QUEUE`, `SUCCESS`, `FAILED`. The catalogue prefers outer `jobId` over `data.jobId` when present. Save the original operation and identifier in the local receipt so recovery cannot accidentally poll the classic image or video endpoint.

On success, `data.images` contains original image URLs and `data.cdnImages` contains TTAPI CDN URLs. Although the field types are incorrectly labeled `string` in one part of the OpenAPI schema, its official example clearly shows both as arrays of four URLs. The client downloads `data.cdnImages`, leaving original URLs available in the raw response rather than downloading every image twice. Other result data include `progress`, `mode`, `prompt`, `quota`, `submitTime`, `finishTime`, and `hookUrl`.

Editing/retexturing is billable; pricing depends on speed mode and can change. Use [current image pricing](https://docs.ttapi.io/grids/en/start/pricing/image), preserve the user's authorized scope, and never automatically repeat a POST when its outcome is uncertain. Resume fetch with the same ID; a local wait limit is not task failure. Retention follows [Storage and Persistence](https://docs.ttapi.io/grids/en/faq/storage), so save results promptly.
