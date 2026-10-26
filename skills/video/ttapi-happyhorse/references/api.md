# HappyHorse API

Official sources: [overview](https://docs.ttapi.io/api/en/happyhorse/index.md), [text](https://docs.ttapi.io/api/en/happyhorse/generations.md), [first frame](https://docs.ttapi.io/api/en/happyhorse/image-to-video.md), [references](https://docs.ttapi.io/api/en/happyhorse/reference-to-video.md), [edit](https://docs.ttapi.io/api/en/happyhorse/video-edit.md), [result](https://docs.ttapi.io/api/en/happyhorse/fetch.md). Verified 2026-10-26.

## Modes

All four submission operations use POST /happyhorse/api/v1/services/aigc/video-generation/video-synthesis, JSON body. The model and input.media select the mode.

| Operation | Exact model IDs | Input |
| --- | --- | --- |
| happyhorse-text-to-video | happyhorse-1.0-t2v, happyhorse-1.1-t2v | input.prompt |
| happyhorse-image-to-video | happyhorse-1.0-i2v, happyhorse-1.1-i2v | Exactly one media item: type=first_frame |
| happyhorse-reference-to-video | happyhorse-1.0-r2v, happyhorse-1.1-r2v | Prompt and 1–9 media items: type=reference_image |
| happyhorse-video-edit | happyhorse-1.0-video-edit | Prompt, exactly one type=video, optional 0–5 type=reference_image |

Media items are {type, url}; URLs must be public HTTP(S), not local paths. Reference-image order maps to character1, character2, etc. in the prompt. First-frame input keeps approximately its image aspect ratio; its parameters do not include ratio.

Text, first-frame and reference generation accept integer duration 3–15 seconds, resolution 720P or 1080P. Text/reference ratio accepts 16:9, 9:16, 1:1, 4:3, 3:4. Default watermark is true. A seed is an integer from 0 through 2147483647 and is not a guarantee of identical results.

Prompt documentation limits are 5000 non-Chinese characters or 2500 Chinese characters. The server may truncate longer input. Keep prompts within the appropriate limit. First-frame images: JPEG/JPG/PNG/WEBP, both dimensions at least 300 pixels, at most 10 MB. Reference images have a short side at least 400 pixels. Video-edit source: MP4/MOV, 3–60 seconds, at most 100 MB; output is at most 15 seconds and longer sources are truncated to the first 15 seconds. Edit audio_setting is auto or origin.

## Results and recovery

Save output.task_id, not the tracing request_id. Poll GET /happyhorse/api/v1/tasks/{task_id}. Status is output.task_status: PENDING, RUNNING, SUCCEEDED, FAILED, CANCELED or UNKNOWN. The task ID and output.video_url are documented as valid for 24 hours; download successful video promptly. Failure details can be in output.code and output.message.

## Documentation discrepancy

The aggregate happyhorse.json lists alternative /image-to-video, /reference-to-video and /video-edit paths and omits some 1.1 model enums. Each actual endpoint page instead includes its dedicated OpenAPI using /video-synthesis and the corresponding model. This catalog deliberately follows those dedicated page schemas. No production call was used to resolve the discrepancy.
