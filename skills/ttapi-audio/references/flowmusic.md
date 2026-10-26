# FlowMusic on TTAPI

Verified against the [official OpenAPI](https://docs.ttapi.io/openapi/en/flowmuisc.json) and [music endpoint](https://docs.ttapi.io/api/en/flowmuisc/flowmuisc_generate) on 2026-10-26. The documentation path spells `flowmuisc`; the API path correctly spells `flowmusic`.

## Operation map

All operations use JSON and the `TT-API-KEY` header.

| CLI operation | POST path | Execution |
| --- | --- | --- |
| `flowmusic-generate` | `/flowmusic/v1/generations` | Async; one clip per request |
| `flowmusic-lyrics` | `/flowmusic/v1/lyrics-create` | Normally sync: `data.title`, `data.lyrics` |
| `flowmusic-cover` | `/flowmusic/v1/cover` | Async |
| `flowmusic-extend` | `/flowmusic/v1/extend` | Async; source must have succeeded |
| `flowmusic-stems` | `/flowmusic/v1/stems` | Async |
| `flowmusic-upload` | `/flowmusic/v1/upload-audio` | Async; import by public audio URL |
| `flowmusic-download` | `/flowmusic/v1/download-audio` | Async; request an export format |

Async submissions return `data.jobId`. Poll `GET /flowmusic/v1/fetch?jobId=...`. Lyrics schema also permits queue statuses: if text is not yet returned but a task ID is available, query this same fetch endpoint via `get flowmusic-lyrics --task ID`. A completed queued lyrics task may put its text in `data.clips[].lyrics_timing_markers`.

## Generate

Exact `model` values are `Lyria 3 Pro` and `Lyria 3.5`; an omitted model defaults to `Lyria 3 Pro`. These are model strings for FlowMusic, not Suno `mv` values.

```json
{"model":"Lyria 3 Pro","title":"Cafe Morning","sound_prompt":"Gentle instrumental jazz for a cafe, warm piano, soft brushes, no vocals","length":30}
```

At least one of `sound_prompt` or `lyrics` must be non-empty. Describe sound, genre and instrumentation in `sound_prompt`; put the words to sing in `lyrics`. For BGM, describe an instrumental result without inventing an `instrumental` parameter.

- `length`: integer seconds, 1–240.
- `bpm`: **string** containing a number greater than or equal to 1, for example `"90"`.
- `seed`: string for this generation endpoint.
- `hook_url`: optional callback; do not use Suno's `hookUrl` spelling.

## Use a completed clip

Fetch outputs use `data.clips[]` with fields such as `clip_id`, `audio_url`, `wav_url`, `video_url`, `title` and lyrics metadata. Store the `clip_id` for edits. Do not use the request `jobId` as the clip ID or a Suno `musicId` as a FlowMusic clip ID.

- Cover: `clip_id`, non-empty `instruction`, `strength` from 0 to 1; optional model/title/seed.
- Extend: completed `clip_id`, `extend_from_s`, `extend_s`, `instruction`. Start time cannot exceed the source duration; `extend_s` is positive and at most 164 seconds.
- Stems: `clip_id`; no fabricated stem selector is needed.
- Upload: `audio_url` pointing to a publicly retrievable audio file. This endpoint is not multipart and cannot read a local path or `{"$file":"..."}`. If the user supplies a local file, obtain an authorized hosted URL before importing; do not upload it elsewhere without authorization.
- Download/export: `clip_id`, `format` (`mp3` or `wav`). This creates an export task; it differs from fetching an already existing URL with the CLI's `--output` option.
- Lyrics: non-empty `prompt`, at most 3000 characters. Read synchronous `data.lyrics`; when queued, resume the returned job rather than re-submitting.

## Status and files

Outer status is `PENDING_QUEUE`, `ON_QUEUE`, `SUCCESS` or `FAILED`. `SUCCESS` plus only `data.jobId` in a submit acknowledgement means accepted. Fetch `SUCCESS` is terminal; some successful tasks (for example lyrics) correctly have no audio URLs.

The official fetch example illustrates a lyrics task and contains null audio URLs plus an old `mv` value. Do not use that example's `mv` as a current model ID. Use current request schemas for model selection. The CLI downloads only `data.clips[].audio_url` and `.wav_url`; keep the full response for other task-specific metadata. Preserve all returned asset URLs and save files locally rather than assuming source links remain available indefinitely.

Sources: [overview](https://docs.ttapi.io/api/en/flowmuisc), [generation](https://docs.ttapi.io/api/en/flowmuisc/flowmuisc_generate), [lyrics](https://docs.ttapi.io/api/en/flowmuisc/flowmuisc_lyricscreate), [fetch](https://docs.ttapi.io/api/en/flowmuisc/flowmuisc_fetch), [extend](https://docs.ttapi.io/api/en/flowmuisc/flowmuisc_extend), [stems](https://docs.ttapi.io/api/en/flowmuisc/flowmuisc_stems), [upload](https://docs.ttapi.io/api/en/flowmuisc/flowmuisc_uploadaudio), [download](https://docs.ttapi.io/api/en/flowmuisc/flowmuisc_download).
