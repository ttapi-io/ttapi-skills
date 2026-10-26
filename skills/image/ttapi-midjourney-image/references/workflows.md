# Midjourney image operation contract

Checked 2026-10-26 against [midjourney.json](https://docs.ttapi.io/openapi/en/midjourney.json), the [official workflow guide](https://docs.ttapi.io/grids/en/start/midjourney-api-workflows) and [async guide](https://docs.ttapi.io/grids/en/start/midjourney-api-async-workflow). Discover updated pages through [llms.txt](https://docs.ttapi.io/llms.txt).

All listed submissions use JSON, the `TT-API-KEY` header and `https://api.ttapi.io`. No personal Midjourney token or account-hosting credential is required by these documented endpoints. No request has a standalone `model` field; do not copy another product's model IDs or invent image-size JSON fields.

| CLI operation | POST endpoint | Essential input |
| --- | --- | --- |
| `midjourney-imagine` | `/midjourney/v1/imagine` | `prompt`, `mode` (`relax`, `fast`, `turbo`) |
| `midjourney-action` | `/midjourney/v1/action` | completed source `jobId`, exact `action` from returned `components` |
| `midjourney-blend` | `/midjourney/v1/blend` | `imgBase64Array` with 2–5 image data URLs, `mode` |
| `midjourney-describe` | `/midjourney/v1/describe` | `base64` image data URL |
| `midjourney-seed` | `/midjourney/v1/seed` | source image `jobId` |
| `midjourney-inpaint` | `/midjourney/v1/inpaint` | source `jobId`, raw Base64 `mask`; optional edit `prompt` |

Optional `timeout` is an integer 300–1200 seconds for the server-side task. It differs from the CLI `--timeout` wait budget. Optional `hookUrl` receives task callbacks; omit it when polling. The client does not insert schema defaults.

## Selecting and continuing images

Imagine creates an initial four-image grid. Save the job ID, fetch the completed result, inspect `data.components`, then submit the user's chosen action with that exact source ID. The schema illustrates `upsample1` and `variation1`; pan, zoom, reroll and other continuation actions must likewise come from the completed result's actual components. Do not blindly use U/V buttons from an unfinished or unrelated job.

An action creates another task ID. Preserve that ID and fetch it rather than repeatedly calling action. Do not assume an upscale is free or included in the original image request.

## Reference-image and mask formats

- Blend uses `imgBase64Array`, not `images`, local paths or `{"$file":"..."}`. Encode the actual images as `data:image/...;base64,...`. `dimensions` is `PORTRAIT` (2:3), `SQUARE` (1:1), or `LANDSCAPE` (3:2).
- The blend OpenAPI enum includes `turbo`, while the current pricing table marks turbo blend unsupported. The installed client therefore limits blend to `relax` and `fast`.
- Describe's `url` description says either URL or Base64 may be supplied, but the same published schema requires `base64`. This Skill uses the nonempty Base64 route, retaining the optional URL field without advertising URL-only support. Its result is four prompt suggestions, not four newly generated image files.
- Inpaint's mask must match the selected source image dimensions. White selects the repaint region and black preserves it. Submit raw Base64 **without** the `data:image/png;base64,` prefix. This is different from blend/describe image data URLs and different from Midjourney Edit's transparent-area input image.
- The bundled tiny Base64 samples and public example task ID are only offline shape examples. They are not usable masks for an arbitrary source task. Produce the actual same-size mask before executing the requested inpaint operation.

## Results and recovery

Every submission documents an acknowledgement shaped as `{"status":"SUCCESS","message":"success","data":{"jobId":"..."}}`.

Poll `GET /midjourney/v1/fetch?jobId=...`. Status is `PENDING_QUEUE` (the raw schema contains a trailing space), `ON_QUEUE`, `SUCCESS` or `FAILED`. The runtime trims status strings. The catalog prefers outer `jobId` over `data.jobId` when both exist.

Image tasks expose tile URLs at `data.images[]` and a grid/image URL at `data.cdnImage`. The client may save both a grid and its tiles; these are outputs of the original task, not additional generations. The raw response retains `discordImage`, `components`, `quota`, dimensions and other metadata. Describe/seed operations intentionally have empty `assetPaths`: successful text or seed results do not require a downloadable image. The generic fetch schema does not define a stable property for describe's text; inspect the actual raw task result and do not invent `data.prompts`.

Fetch retrieves an existing task. Do not call describe or seed merely to check progress: [current image pricing](https://docs.ttapi.io/grids/en/start/pricing/image) lists them as billable operations. Preserve explicit user authorization for the chosen operation and use the same recorded task after timeouts. Download results promptly; storage retention is service-specific.

Sources: [Imagine](https://docs.ttapi.io/api/en/midjourney/imagine), [Action](https://docs.ttapi.io/api/en/midjourney/action), [Blend](https://docs.ttapi.io/api/en/midjourney/blend), [Describe](https://docs.ttapi.io/api/en/midjourney/describe), [Seed](https://docs.ttapi.io/api/en/midjourney/seed), [Inpaint](https://docs.ttapi.io/api/en/midjourney/inpaint), [Fetch](https://docs.ttapi.io/api/en/midjourney/fetch).
