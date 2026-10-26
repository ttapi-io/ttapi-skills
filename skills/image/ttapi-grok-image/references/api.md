# Grok Image workflow

Verified 2026-10-26 from [Grok Image OpenAPI](https://docs.ttapi.io/openapi/en/grokimage.json). This skill wraps image endpoints, not Grok Video or LLM chat.

- `grok-image-generate`: `POST /grok/image`. Use an explicit model: `grok-imagine-1.0`, `grok-imagine-2.0`, `grok-imagine-image`, `grok-imagine-image-quality`, `grok-imagine-image-2.0`. Prompt required; `n` is an integer 1–4.
- `grok-image-edit`: `POST /grok/image/edits`. Model values: `grok-imagine-1.0-edit`, `grok-imagine-2.0-edit`, or the three `grok-imagine-image*` values above. Supply `refer_images` with 1–5 actual public image URLs. Although the source required list omits it, an edit needs its documented source images; this client requires them. There is no local-image upload operation here.

`enable_pro` applies only to generation models `grok-imagine-1.0` and `grok-imagine-2.0`; the latter permits only true. Omit it for Grok Image models. `quality` low/medium is documented only for `grok-imagine-image-2.0`. `resolution` 1k/2k is documented for the three Grok Image models, not Imagine 1.0/2.0. Imagine 1.0 generation/editing supports aspect ratios 1:1, 16:9, 9:16, 3:2, 2:3; other documented ratios remain model-specific. Do not assume a control is shared because names look similar.

Generation/edit submission returns `status:SUCCESS` with `data.jobId`: accepted, not finished. Query **`POST /grok/image/fetch?jobId=...`**, with the ID in the URL query and no invented JSON body. The HTTP method differs from most TTAPI fetch endpoints. Status values: PENDING_QUEUE, ON_QUEUE, SUCCESS, FAILED. Final generated images are `data.images` (array). The source description calls these reference images, but its generation-result example puts generated URLs here; the input field is separately named `refer_images`. Optional callback uses `hook_url`.

Sources: [generate](https://docs.ttapi.io/api/en/grokimage/image), [edit](https://docs.ttapi.io/api/en/grokimage/editimage), [result](https://docs.ttapi.io/api/en/grokimage/fetch), [OpenAPI](https://docs.ttapi.io/openapi/en/grokimage.json).
