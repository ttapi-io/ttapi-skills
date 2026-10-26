# Producer music API

Sources: [Google Lyria 3 / Producer overview](https://docs.ttapi.io/api/en/producer/index.md), [generation](https://docs.ttapi.io/api/en/producer/producer_generate.md), [fetch](https://docs.ttapi.io/api/en/producer/producer_fetch.md), [OpenAPI](https://docs.ttapi.io/openapi/en/producer.json). Verified 2026-10-26. Producer and the newer FlowMusic module are distinct API products with different field names.

## Operations

All submissions use JSON and /producer/v1/. Run schema OP for the complete endpoint-specific shape.

| Operation | POST suffix | Execution/result |
| --- | --- | --- |
| producer-generate | music | Async; one song per request |
| producer-lyrics | lyrics | Normally synchronous data.title/data.lyrics |
| producer-extend | extend | Async; source track must have succeeded |
| producer-cover | cover | Async |
| producer-variation | variation | Async |
| producer-replace | replace | Async |
| producer-vocals-swap | vocals-swap | Async |
| producer-instrumentals-swap | instrumentals-swap | Async |
| producer-stems | stems | Async |
| producer-download | download | Async export request |
| producer-upload | upload | Async public-URL audio import |
| producer-generate-video | generate-video | Normally synchronous data.videoUrl |

## Models and fields

Generation uses mv, not model. Its documented IDs are FUZZ-2.0 Pro, FUZZ-2.0, FUZZ-2.0 Raw, FUZZ-1.1 Pro, FUZZ-1.0 Pro, FUZZ-1.0, FUZZ-1.1, FUZZ-0.8, Lyria 3 preview and Lyria 3 Pro. Some follow-up schemas omit Lyria 3 Pro; do not assume every generation model is accepted for every edit.

sound_prompt describes genre, instrumentation and sound. lyrics_text contains the words to sing. Both fields are marked required by the generation/edit schemas, but one may be empty; they cannot both be empty. Use instrumental=true with lyrics_text="" for pure music. lyrics_strength and weirdness are numbers 0–1; sound_strength is 0.2–1. seed is a string. Callback is hook_url and storage option is is_storage.

Follow-ups use music_id from data.musics[].musicId, not the jobId. starts/ends are seconds; for replacement, ends must be after starts and inside the source track. Variation only needs music_id. Lyrics writing uses prompt, not sound_prompt.

Upload takes audio_url, a public HTTP(S) audio file, not multipart or a local file path. Export takes music_id and format=mp3 or wav; it creates a task rather than directly downloading an existing URL. Video generation takes music_id and optional preset=modern/player/simple.

## Results and recovery

For asynchronous operations, save data.jobId immediately and poll GET /producer/v1/fetch?jobId=...; querying is documented as free. Fetch status is PENDING_QUEUE, ON_QUEUE, SUCCESS or FAILED. Completed music outputs use data.musics[].audioUrl and source-track IDs use musicId. Some metadata may be null for lyrics-only results.

The lyrics and generate-video examples return content synchronously, though their status enums also permit queued values. If content is missing and a jobId was returned, query the shared Producer endpoint with get producer-generate --task ID. If no task ID is returned, retain the response and report that state; do not resubmit automatically.

The stems page description incorrectly repeats variation wording; its page title, /stems endpoint and music_id input identify stem separation. The catalog does not invent undocumented stem selectors or output instrument names.
