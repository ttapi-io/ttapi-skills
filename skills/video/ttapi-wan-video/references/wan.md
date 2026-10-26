# Wan 3.0 video

Verified model ID: `wan3.0-video`. All three operations submit JSON to:

`POST /wan/api/v1/services/aigc/video-generation/video-synthesis`

| Operation | Required input |
| --- | --- |
| `wan-text-to-video` | `model`, `input.prompt` |
| `wan-first-frame-to-video` | `model`, `input.media` containing exactly one `first_frame` |
| `wan-first-last-frame-to-video` | `model`, `input.media` containing one `first_frame` and one `last_frame` |

```json
{
  "model": "wan3.0-video",
  "input": {
    "prompt": "The camera slowly moves closer as the subject turns toward the light.",
    "media": [
      {"type": "first_frame", "url": "https://example.com/first-frame.jpg"}
    ]
  },
  "parameters": {"resolution": "720P", "ratio": "16:9", "duration": 5, "audio": true}
}
```

Use `wan-first-frame-to-video` for this illustrated request; replace the image URL before executing. For text-only generation, remove `media`. For fixed end frames, add `{"type":"last_frame","url":"https://example.com/last-frame.jpg"}` and use `wan-first-last-frame-to-video`.

Prompt supports Chinese or English, at most 20,000 characters. For image-driven modes it may be omitted. Media URL fields accept a reachable image URL or Base64 data according to the source spec; the client does not upload local image files.

`parameters` is optional:

| Field | Supported values / documented default |
| --- | --- |
| `resolution` | `480P`, `720P`, `1080P`; default `1080P` |
| `ratio` | `adaptive`, `16:9`, `4:3`, `1:1`, `3:4`, `9:16`; default `adaptive` |
| `duration` | Integer 2–30 seconds, or `-1` for smart duration; default 5 |
| `audio` | Boolean; default `true` |
| `seed` | Integer 0–2147483647 |
| `prompt_extend` | Boolean; default `true` |
| `watermark` | Boolean; default `false` |

The CLI validates but does not insert schema defaults. Set duration and resolution explicitly when they affect the user's budget.

## Submission, polling and retention

Submission returns `output.task_id`, `output.task_status` and `request_id`. Query with `GET /wan/api/v1/tasks/{task_id}`; the task identifier is a URL path segment, not a `jobId` query parameter.

```json
{
  "output": {"task_status": "PENDING", "task_id": "0385dc79-5ff8-4d82-bcb6-xxxxxx"},
  "request_id": "4909100c-7b5a-9f92-bfe5-xxxxxx"
}
```

`output.task_status` is `PENDING`, `RUNNING`, `SUCCEEDED`, `FAILED`, `CANCELED` or `UNKNOWN`. Only `SUCCEEDED` is a successful terminal generation. Read the file URL from `output.video_url`, never from a reflected input URL. The task result may include `usage.duration`, `usage.video_count` and other output statistics; these are not a monetary cost quote.

The official task schema says task query validity and the output video URL retention are 24 hours. Download the result promptly. A local polling timeout does not cancel or fail the remote generation.

## Deliberate limit

Reference-video/media generation is not included in this release. The public reference OpenAPI schema names `input.media`, while its examples use `input.media_list` and disagree about mixing reference/link/file types. Do not guess a request shape or silently translate between them.

Sources, checked 2026-10-26:

- [Text-to-video OpenAPI](https://docs.ttapi.io/openapi/en/wan-text-to-video.json)
- [First-frame OpenAPI](https://docs.ttapi.io/openapi/en/wan-first-frame-to-video.json)
- [First/last-frame OpenAPI](https://docs.ttapi.io/openapi/en/wan-first-last-frame-to-video.json)
- [Task result OpenAPI](https://docs.ttapi.io/openapi/en/wan-task-result.json)
- [Reference input discrepancy](https://docs.ttapi.io/openapi/en/wan-reference-to-video.json)
