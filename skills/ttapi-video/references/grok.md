# Grok video through TTAPI

This skill uses the TTAPI compatibility API:

- Submit JSON: `POST /grok/generations`
- Query: `GET /grok/fetch?jobId=...`
- Submission identifier: `data.jobId`
- Final video: `data.videoUrl`

The separate `/grok/v1/videos/*` API uses `request_id`, different fields and a different query response. It is not implemented here; do not mix its examples with these operations.

| Model | Text-to-video | First-frame in this release | Duration | Resolution in this release |
| --- | --- | --- | --- | --- |
| `grok-imagine-video-1.5-fast` | Yes | Yes | String 6–30 seconds, excluding `"7"` and `"11"` | `480p`, `720p` |
| `grok-imagine-video` | Yes | No | String 1–15 seconds | `720p` |
| `grok-imagine-video-1.5` | Yes | Yes | String 1–15 seconds | `480p`, `720p`, `1080p` |
| `grok-imagine-video-1.5-lite` | Yes | Not included | String 1–15 seconds | `480p`, `720p`, `1080p` for text mode |

Use `grok-text-to-video` for text mode and `grok-first-frame-to-video` for a fixed first frame. The installed schema requires an explicit `model`, even though the API documents a default; this avoids accidentally selecting another model on a future server update.

```json
{
  "model": "grok-imagine-video-1.5-fast",
  "prompt": "The subject gently turns toward the camera while the background remains stable.",
  "first_frame": "https://example.com/first-frame.jpg",
  "aspect_ratio": "16:9",
  "video_length": "6",
  "resolution_name": "720p"
}
```

For text mode remove `first_frame`. Replace the illustrated URL with an accessible image before submitting image mode. `video_length` is a JSON **string**; `resolution_name` uses lowercase `p`. Supported `aspect_ratio` values are `2:3`, `3:2`, `1:1`, `9:16`, `16:9`. Optional `hook_url` receives the fetch-shaped callback; omit it for local polling.

The default duration is `"10"` and resolution is `"720p"`. The CLI validates without inserting schema defaults. Set them explicitly before paid submission. Non-fast models have a 4,096-character prompt limit; the fast model supports longer prompts, without a documented numeric limit in these sources.

## Polling

Submission acknowledgement is shaped as:

```json
{"status":"SUCCESS","message":"success","data":{"jobId":"jobId"}}
```

Here `SUCCESS` acknowledges submission. It does not mean a video exists. Preserve `data.jobId` and poll the fetch endpoint. Fetch status is `PENDING_QUEUE`, `ON_QUEUE`, `SUCCESS` or `FAILED`. For a completed fetch, read `data.videoUrl`; `data.quota` may contain actual consumed quota. Never download `data.referImage` as an output video.

## Deliberate limits and documentation differences

- Base-model resolution differs between the dedicated text schema (480p/720p) and the older combined schema (720P only); the installed operation conservatively supports `720p` for that model.
- The dedicated first-frame schema lists the lite model but omits its duration details and says 1080P is only available on 1.5. Lite first-frame support is therefore not exposed yet.
- Dedicated text and first-frame schemas take precedence over the older combined generate schema for their respective modes. The latter describes 1.5 as image-only, whereas the dedicated text schema explicitly includes it.
- Reference images, last frames, keyframes and extension APIs are not included. Do not silently append their fields to the supported request.

Sources, checked 2026-10-26:

- [Dedicated text-to-video OpenAPI](https://docs.ttapi.io/openapi/en/grok-text-to-video.json)
- [Dedicated first-frame OpenAPI](https://docs.ttapi.io/openapi/en/grok-first-frame-to-video.json)
- [Compatibility submit and fetch OpenAPI](https://docs.ttapi.io/openapi/en/grok.json)
- [Separate official-format API, not implemented](https://docs.ttapi.io/openapi/en/grok_video.json)
