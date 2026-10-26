# Seedream image workflows

Verified 2026-10-26. Exact models: `doubao-seedream-5-0-pro-260628` and `doubao-seedream-5-0-flash-260915`. Use one explicitly, not a product alias. All bodies are JSON and the base URL is https://api.ttapi.io.

| Operation | Inputs and behavior |
| --- | --- |
| `seedream-text-to-image` | Required model/prompt; asynchronous new image. |
| `seedream-image-to-image` | Required source `image` URL; redraw/style/edit. |
| `seedream-multi-image` | `image` array containing 2–10 reference URLs. |
| `seedream-layers` | Source image plus `layer_decomposition:true`; prompt can identify areas with `<bbox>(x1,y1,x2,y2)`. Base image and up to 16 layers are documented. |
| `seedream-edit` | Source image and edit intent; describe coordinates or bounding boxes in the prompt when needed. |
| `seedream-text-to-image-sync` | Direct result at `POST /sd/api/v3/images/generations`; do not poll this operation. |

The five async operations use `POST /sd/api/v3/images/generations/tasks`. Preserve **id**, which differs from other TTAPI products' jobId. Published workflow-specific schemas return top-level `id`; the combined Seedream schema instead illustrates `data.id`. This client accepts both and normalizes to taskId. Query `GET /sd/api/v3/images/generations/tasks/{id}`. Status: PENDING_QUEUE, ON_QUEUE, SUCCESS, FAILED. Generated URLs are `data.images`; synchronous generated URLs are `data[].url`. Download output URLs, not input reference URLs.

Size tiers are `1K`, `1.5K`, `2K`; layer decomposition also permits `auto`. The prose mentions pixel strings but the actual enum excludes them; this client exposes only enumerated tiers until the contract is clarified. Output format jpeg/png. The request advertises b64_json, but published response schemas specify only URLs; this release therefore exposes `response_format:url` for reliable downloads. Transparent image-to-image output requires a source with an alpha channel and PNG output; the source reference remains a remotely accessible URL. No local upload endpoint is invented.

Optional task controls: expiry 3600–259200 seconds, priority 0–9, safety_identifier ≤64 characters. Prompt optimization `fast` is not supported by Flash; use standard/omit there. Keep watermark at the documented server default unless the user asks for a different choice. Source examples turn it off, so adapt examples to the user's actual requirement.

The endpoint's response-format description currently says URL links last 24 hours; other storage guidance varies by host. Download promptly and do not promise permanent storage. Sources: [overview](https://docs.ttapi.io/api/en/seedream), [text-to-image](https://docs.ttapi.io/api/en/seedream/text-to-image), [image-to-image](https://docs.ttapi.io/api/en/seedream/image-to-image), [multi-image](https://docs.ttapi.io/api/en/seedream/multi-image), [layers](https://docs.ttapi.io/api/en/seedream/layer-decomposition), [interactive edit](https://docs.ttapi.io/api/en/seedream/interactive-edit), [sync generation](https://docs.ttapi.io/api/en/seedream/text-to-image-sync), [fetch](https://docs.ttapi.io/api/en/seedream/fetch).
