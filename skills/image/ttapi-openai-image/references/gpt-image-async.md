# TTAPI unofficial asynchronous GPT Image route

Verified 2026-10-26. TTAPI labels this endpoint **Unofficial**. It has different model values and fields from the standard Images API. Use it when the user chooses this route; retain its identity in the result.

Operation: `image2-async`. Base URL: `https://api.ttapi.io`. `POST /openai/gpt/generations`, JSON, with `TT-API-KEY` authentication.

| Field | Contract |
| --- | --- |
| `model` | Explicit client selection: `gpt-image-2`, `gpt-image-2-plus`, or `gpt-image-2.5`. Server default is `gpt-image-2`. |
| `prompt` | Required generation or reference-edit description. |
| `referImages` | Optional public reference-image URL array. CamelCase; do not use Nano's `refer_images`. |
| `aspect_ratio` | Only `gpt-image-2`; `1:1`, `3:4`, `4:3`, `16:9`, `9:16`. |
| `size` | Only `gpt-image-2-plus`; `WIDTHxHEIGHT`, dimensions divisible by 16, longest edge ≤3840, aspect ratio between 1:3 and 3:1, total pixels 655,360–8,294,400. Server docs say invalid input may be adjusted; the client instead rejects it before billing. |
| `hookUrl` | Optional HTTP(S) callback. Completion/failure shape follows fetch. |

The documented submission returns `{"status":"SUCCESS","message":"success","data":{"jobId":"..."}}`. This is acceptance, not a completed image.

Poll with `GET /openai/gpt/fetch?jobId=...` (`node scripts/ttapi.mjs get image2-async --task ID --wait --output ./outputs`). The documented task status is top-level `ON_QUEUE`, `SUCCESS`, or `FAILED`. `ON_QUEUE` means processing; no percentage or separate running status is documented here. The top-level `jobId` identifies the task. Completed output is **`data.imageUrl`**. `data.referImages` is input and must not be downloaded as generated output.

Failure uses `status:FAILED`, a specific `message`, and task data; the documented failure quota is 0. Do not assume every HTTP/API error has a refundable generation or automatically submit a replacement. No idempotency mechanism is documented for this route. On an uncertain POST response, preserve the original request and report uncertainty rather than repeating a chargeable submission.

Official sources:

- <https://docs.ttapi.io/api/en/openai/gpt-generations>
- <https://docs.ttapi.io/api/en/openai/gpt-fetch>
- <https://docs.ttapi.io/openapi/en/openai.json>
