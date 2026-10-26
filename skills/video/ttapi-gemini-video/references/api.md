# Gemini video API

Sources: [generation](https://docs.ttapi.io/api/en/gemini/video-generations.md), [extension](https://docs.ttapi.io/api/en/gemini/video-extend.md), [fetch](https://docs.ttapi.io/api/en/gemini/video-fetch.md), [OpenAPI](https://docs.ttapi.io/openapi/en/gemini.json). Verified 2026-10-26.

## Generation

POST /gemini/video/generations takes prompt, model and aspect_ratio (all required). aspect_ratio is 16:9 or 9:16. Optional resolution is 720p or 1080p. Duration is a JSON string, not a number: 4, 6, 8 or 10. The three Veo 3.1 models only accept duration "8"; Omni Flash accepts the documented duration enum.

reference_images accepts at most three public HTTP(S) JPEG/PNG image URLs. generation_type is frame or reference; if omitted, the API documents two images as frame-to-video and three as reference-to-video. Preserve the requested frame/reference intent rather than guessing from an arbitrary array.

reference_videos accepts at most one public video URL and only with model=omni-flash. The generation endpoint also supports prompt-only video; do not add a mandatory image. The callback parameter is hookUrl.

## Extension

POST /gemini/video/extend requires the successful source jobId, prompt and aspect_ratio. It creates a new asynchronous task; save the new jobId separately. The source must be SUCCESS. omni-flash does not support extension: inspect the saved source result's data.model before choosing this operation. The request does not include model or duration; do not copy an entire generation request into it.

## Results

Both operations acknowledge with status=SUCCESS and data.jobId; that does not mean the video is finished. GET /gemini/video/fetch?jobId=... returns RUNNING, SUCCESS or FAILED. The final generated asset is data.video_url. Ignore echoed reference_images when saving output. The official fetch description marks jobs failed if no successful or failed result is available within 15 minutes. Resume the same task after a local timeout.
