# FLUX image route guide

Verified 2026-10-26 against [TTAPI Flux OpenAPI](https://docs.ttapi.io/openapi/en/flux.json). This skill includes 15 image operations; it excludes `/bfl/v1/flux-3-video` and its video-result endpoint.

## Choose an endpoint

- `flux-3-image`: prompt-only generation, reference edits, restyling and composition using `images` as one URL/base64 string or 1–10 strings. Minimum reference size is documented as 256×256. Use `aspect_ratio` and resolution tiers `768sq`, `1k`, `1.5k`, `2k`, `4k`. It rejects `seed`, `width`, `height`, `input_image` and unknown fields. Bounding boxes belong in the prompt as [top,left,bottom,right] on a 0–1000 grid.
- `flux-3-image-klein`: same text/reference workflows plus paired integer `width` and `height` (64–6256, product ≤16,822,272), integer seed 0–4,294,967,295, `output_format` jpeg/png and steps 1–16. Exact dimensions override ratio/resolution. It does not expose the full FLUX 3 `grounding` field.
- BFL-named `flux-kontext-*`, `flux-ultra`, `flux-pro-1-1`, `flux-pro`, `flux-dev`, and `flux-2-*` select the model in the endpoint path; do not invent a request `model` field. Kontext/Flux 2 use `input_image`, `input_image_2` through `input_image_4` where their schema lists them. Older BFL `width`/`height` are JSON strings, documented 256–1440 and multiples of 32; do not copy FLUX 3 Klein integer controls to them. Some source `prompt_upsampling` fields incorrectly combine boolean type with string enums; this client follows the declared boolean type and textual true/false meaning.
- `flux-generate`: TTAPI compatibility body uses `mode`, not `model`; inspect its supported enum and size before submitting.
- `flux-edit`: multipart local files, one `image: {"$file":"./reference.png"}` or `image:[{"$file":"./a.png"},{"$file":"./b.png"}]`. The helper converts these markers to repeated file parts; replace the example path with an actual local file. Do not put file markers into JSON BFL reference fields.

## Submission, query and output

All routes submit once and return a `data.jobId`. Final images are obtained from `data.imageUrl` in the Flux result. A submit `SUCCESS` is acceptance, not completion. Fetch status values are `PENDING_QUEUE` (the source enum has a stray trailing space), `ON_QUEUE`, `SUCCESS`, `FAILED`.

**Unusual but documented transport:** `GET /flux/fetch` carries a multipart form body with field `jobId`. Both the OpenAPI and [Flux overview](https://docs.ttapi.io/api/en/flux/index) show GET + multipart, including a curl `--request GET --form jobId=...` example. This skill uses that transport. Do not silently change it to a query-string or POST variant without an updated TTAPI contract. Standard fetch() cannot send GET bodies; the bundled runtime must support this documented form-body query.

Callbacks: compatibility routes use `hookUrl`; BFL routes use `webhook_url`. Model IDs and field spellings are route-specific. Official references: [FLUX 3](https://docs.ttapi.io/api/en/flux/flux-3-image), [Klein](https://docs.ttapi.io/api/en/flux/flux-3-image-klein), [result query](https://docs.ttapi.io/api/en/flux/fetch), [OpenAPI](https://docs.ttapi.io/openapi/en/flux.json).
