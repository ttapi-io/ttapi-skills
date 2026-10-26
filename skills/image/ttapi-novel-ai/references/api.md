# NovelAI image workflows

Verified from TTAPI's public OpenAPI on 2026-10-26. Both operations submit asynchronous JSON jobs at `https://api.ttapi.io`.

| Operation | Submit endpoint | Required inputs |
| --- | --- | --- |
| `novel-text-to-image` | `POST /novelai/text-to-image` | `model`, `prompt` |
| `novel-image-to-image` | `POST /novelai/image-to-image` | `model`, `prompt`, `image` |

Models: `nai-diffusion-5-full`, `nai-diffusion-5-curated`, `nai-diffusion-4-5-full`, `nai-diffusion-4-5-curated`. Keep a specified model. `n` is an integer 1–4; default to one image unless the user asks for more. `seed` is a JSON string. Width, height and steps are integers; scale is numeric. Do not invent undocumented width/height ceilings.

Character prompts use `character_prompts:[{prompt,uc?,center:{x,y}}]`, with normalized center coordinates from 0 to 1. `vibe_transfer` and `character_reference` accept URL/base64 image references; their strength/fidelity values are numeric 0–1. Character reference types are `character&style`, `character`, `style`. Image-to-image additionally has `noise` 0–0.99 and `strength` 0.01–0.99. Use actual JSON booleans for `quality_toggle`; some source defaults are strings even though field types are boolean/numeric.

Submit acknowledgement: `status:SUCCESS` with `data.jobId` means accepted. Resume using `GET /novelai/fetch?jobId=...` and the same ID. Fetch statuses are `PENDING_QUEUE`, `ON_QUEUE`, `SUCCESS`, `FAILED`. The generated output is `data.imageUrl`; the official example returns an array even though its property annotation says string. The client accepts either. Reference images are inputs and are not exported as results. Optional callback field: `hook_url`.

Sources: [text-to-image](https://docs.ttapi.io/api/en/novel/text-to-image), [image-to-image](https://docs.ttapi.io/api/en/novel/image-to-image), [fetch](https://docs.ttapi.io/api/en/novel/fetch), [OpenAPI](https://docs.ttapi.io/openapi/en/novel.json).
