# Standard GPT Image 2 generation and editing

Verified against TTAPI documentation on 2026-10-26. Base URL: `https://api.ttapi.org` (recommended by the endpoint pages for long synchronous requests). Auth header: `TT-API-KEY` from `TTAPI_API_KEY`.

## Text to image: `image2-generate`

`POST /v1/images/generations`, JSON. Required: `model`, `prompt`.

- Models: `gpt-image-2`, `gpt-image-2.5-flare`, `gpt-image-2.5-sunburst`.
- `prompt`: up to 32,000 characters. `n`: 1–10; omit for 1.
- `quality`: `auto`, `low`, `medium`, `high`; the 2.5 variants additionally accept `xhigh`, `max`.
- `size`: `auto`, standard `1024x1024` / `1536x1024` / `1024x1536`, or `WIDTHxHEIGHT`. Both dimensions must be multiples of 16; aspect ratio must be between 1:3 and 3:1. For 2.5 Flare/Sunburst only: longest edge ≤3840 and total pixels 655,360–8,294,400. The current schema does not state these extra edge/pixel bounds for standard `gpt-image-2`; do not infer them.
- `output_format`: `png` (default), `jpeg`, `webp`. `background`: `transparent`, `opaque`, `auto`; transparency needs PNG/WebP. `output_compression`: integer 0–100 for JPEG/WebP only; include an explicit format when using it.
- `moderation`: `low` or `auto`. `user`: optional end-user identifier.
- GPT image models return `data[].b64_json` directly; `response_format` is documented for DALL·E and omitted from this GPT-only client. Do not expect a job ID or URL response.

## Editing: `image2-edit`

`POST /v1/images/edits`, **JSON**, not multipart. In this version the only supported Image 2-family model is `gpt-image-2`; the edit model enum does not include the 2.5 variants.

Required: `model`, `prompt`, `images`. `images` contains 1–16 references, each with exactly one of `image_url` or `file_id`. `image_url` accepts a fully qualified image URL or base64 image data URL. `file_id` means an already existing File API identifier; this skill does not implement a File API upload endpoint. Optional `mask` uses the same exactly-one-field object format.

`input_fidelity`: `high` / `low` (default low). `quality`: `auto` / `low` / `medium` / `high`. Edit `size` is limited here to the explicitly listed `auto`, `1024x1024`, `1536x1024`, `1024x1536`; do not transfer arbitrary generation sizes to edits. Background, file format, compression, moderation and `n` follow the rules above. Output is synchronous `data[].b64_json`.

Local PNG/JPEG/WebP sources can be converted to JSON data URL references with `node scripts/local-edit.mjs SOURCE REQUEST_JSON PROMPT [MASK_PNG]`. The helper selects `gpt-image-2` and writes a request file; inspect or adjust optional fields before submission. `{"$file":"..."}` is the runtime's multipart convention and is not the JSON image-reference shape for this endpoint.

## Client constraints

The bundled JSON client exposes only `stream:false`. Upstream streaming and `partial_images` require a separate event-stream implementation. A long synchronous timeout does not establish whether generation was accepted; do not automatically retry a paid POST.

Official sources:

- <https://docs.ttapi.io/api/en/openai/images-generations>
- <https://docs.ttapi.io/api/en/openai/images-edits>
- <https://docs.ttapi.io/openapi/en/openai.json>
