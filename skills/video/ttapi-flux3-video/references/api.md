# FLUX 3 video API

Sources: [Generate a video with FLUX 3](https://docs.ttapi.io/api/en/flux/flux-3-video.md), [video result](https://docs.ttapi.io/api/en/flux/video-result.md), [OpenAPI](https://docs.ttapi.io/openapi/en/flux.json). Verified 2026-10-26. This is a real video endpoint in TTAPI's Video Generation category, separate from /bfl/v1/flux-3-image. The flux.json info.description still mentions Sora2; use the actual endpoint and page schema rather than that stale description.

## Operations

All four POST to /bfl/v1/flux-3-video with JSON:

| Operation | mode | Required content |
| --- | --- | --- |
| flux3-text-to-video | t2v | prompt |
| flux3-image-to-video | i2v | prompt, keyframes |
| flux3-video-continuation | v2v | prompt, start_video |
| flux3-draft-enhance | draft_enhance | draft_cache |

For the first three modes, duration is an integer 5–20 or the string auto. resolution is hd/fhd; aspect_ratio is auto, 21:9, 2:1, 16:9, 4:3, 1:1, 3:4 or 9:16. Optional generate_audio controls synchronized audio. Endpoint version accepts latest.

keyframes accepts an image string or 1–10 images. Inputs can be public HTTP(S) URLs or base64. One plain image starts the video; two set start/end; 3+ distribute intermediate frames and require an explicit duration. For exact timing, use increasing [seconds, image] pairs; do not mix plain references and pairs. With auto duration, timed pairs extend the video to the final timestamp rounded up, at most 20 seconds.

start_video is a public video URL or base64 MP4. Video continuation starts from the source's final frames.

## Drafts

Set draft=true on t2v/i2v/v2v only if the user wants a preview. The completed result can contain data.draftCache, a downloadable encrypted bundle. A later paid draft_enhance operation takes draft_cache as that bundle's URL (while valid) or the base64-encoded downloaded .bin. The bundle pins original inputs; draft_enhance only exposes output resolution and documented safety/callback fields. Do not invent a fresh prompt, seed or duration for enhancement.

## Poll and save

Save data.jobId on submission. The official query contract is GET /bfl/v1/fetch with a multipart body containing jobId, not a documented query-string parameter. The bundled transport handles this exact TTAPI endpoint. The schema documents PENDING_QUEUE (including a trailing-space enum typo), ON_QUEUE, SUCCESS and FAILED. Generated video is data.videoUrl; optional generated draft cache is data.draftCache. Only these output paths are downloaded. webhook_url is the optional callback field. Never use a client-provided polling URL to forward the API key to an unrelated host.
