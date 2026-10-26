# Nano Banana generation and reference editing

Verified 2026-10-26. Operation: `nano-generate`. `POST https://api.ttapi.org/gemini/image/generate`, JSON. Header: `TT-API-KEY` from `TTAPI_API_KEY`.

| Product name | Exact request `model` |
| --- | --- |
| Nano Banana | `gemini-2.5-flash-image` |
| Nano Banana Pro | `gemini-3-pro-image-preview` |
| Nano Banana 2 | `gemini-3.1-flash-image` |
| Nano Banana 2 Lite | `gemini-3.1-flash-lite-image` |
| Nano Banana 2.1 | `gemini-nano-banana-2.1` |

Always send the exact request value, even though marketing documentation also discusses product aliases.

Required: `model`, `prompt`. To edit or guide with references, use `refer_images:["https://..."]` in the same endpoint. No separate edit or upload endpoint is documented for this skill. Local filenames are not image URLs; obtain an accessible URL before submitting a reference-dependent request.

- `aspect_ratio`: Gemini 3 and later only. Common values: `1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9`. Additional `1:4`, `4:1`, `1:8`, `8:1` require `gemini-3.1-flash-image`, `gemini-3.1-flash-lite-image`, or `gemini-nano-banana-2.1`. Omit this field for `gemini-2.5-flash-image`.
- `image_size`: `1K` (server default), `2K`, `4K`; `512px` is documented **only** for `gemini-3.1-flash-image`.
- `thinking_level`: case-sensitive. Nano Banana 2.1 supports `Minimal`, `Medium`, `High` with default `Medium`. Nano Banana 2 and 2 Lite support `Minimal`, `High` with default `Minimal`. Omit the field for baseline Nano Banana and Nano Banana Pro, whose thinking controls are not listed in this endpoint.
- `google_search`, `image_search`: actual JSON booleans when used, not the string `"false"` found in the OpenAPI default metadata. Omit unless useful to the requested task.

Nano Banana generation is **synchronous**: the connection stays open and success returns `{"status":"SUCCESS","message":"success","data":{"prompt":"...","refer_images":null,"image_url":"https://...","quota":2}}`. Download **`data.image_url`**. The docs recommend `.org` for these long requests.

Although the OpenAPI file also lists `/gemini/image/fetch`, the Nano overview explicitly says not to submit a job and return later with fetch; its submit contract does not define a job ID workflow. This skill therefore has no poll mapping for Nano. On a timeout, report an uncertain submission instead of inventing an ID or resubmitting automatically.

Official sources:

- <https://docs.ttapi.io/api/en/gemini/index>
- <https://docs.ttapi.io/api/en/gemini/generate>
- <https://docs.ttapi.io/grids/en/start/nano-banana-models-guide>
- <https://docs.ttapi.io/openapi/en/gemini.json>
