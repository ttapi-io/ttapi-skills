# Suno on TTAPI

Verified against the [official OpenAPI](https://docs.ttapi.io/openapi/en/suno.json) and [music endpoint](https://docs.ttapi.io/api/en/suno/suno_music) on 2026-10-26.

## Operation map

| CLI operation | POST path | Purpose |
| --- | --- | --- |
| `suno-generate` | `/suno/v1/music` | Song or instrumental |
| `suno-lyrics` | `/suno/v1/lyrics` | Lyrics writing |
| `suno-extend` | `/suno/v1/extend` | Continue a completed track |
| `suno-cover` | `/suno/v1/cover` | New style/version of a track |
| `suno-stems` | `/suno/v1/stems` | Extract one selected stem |
| `suno-stems-all` | `/suno/v1/stems-all` | Split all stems |

All wrapped Suno operations are asynchronous, use JSON and return `data.jobId`. Query with `GET /suno/v2/fetch?jobId=...`; the old `/suno/v1/fetch` is deprecated. The same `TT-API-KEY` header is required for submission and queries.

## Models and generation modes

Use exact `mv` values: `chirp-v6`, `chirp-v6-wild`, `chirp-v6-mini`. The docs map retired legacy names to `chirp-v6`; do not present that mapping as access to a retired model. A user-created custom model may use `chirp-custom:{model_id}`; it cannot be combined with `persona_id`.

**Custom instrumental**: `custom: true`, `instrumental: true`, `mv`. Add `tags` for style; lyrics are ignored.

```json
{"custom":true,"instrumental":true,"mv":"chirp-v6","title":"Quiet Morning","tags":"gentle acoustic guitar, warm piano, calm instrumental","duration":30,"audio_format":"mp3"}
```

**Custom vocal song**: `custom: true`, `instrumental: false`, `mv`, non-empty `prompt` containing the actual lyrics. `tags` describes style, not the lyrics. `auto_lyrics: true` allows the service to rewrite lyrics; omit or set false when the supplied lyrics must be preserved.

**Inspiration**: `custom: false`, `mv` and at least one of non-empty `gpt_description_prompt` or `reference_music_ids` (up to 10 existing track IDs). Use a description of the desired song, rather than misplacing it in `prompt`.

| Field | Documented meaning/range |
| --- | --- |
| `prompt` | Lyrics, up to 5000 characters |
| `gpt_description_prompt` | Inspiration description, up to 3000 characters |
| `title` | Up to 80 characters |
| `tags` | Style/genre, up to 1000 characters |
| `duration` | Integer seconds, 10–360 where supported |
| `style_weight`, `weirdness_constraint`, `audio_weight` | Number, 0–1 |
| `vocal_gender` | `Male` or `Female` |
| `audio_format` | `mp3`, `m4a`, `wav` |
| `variety` | `off`, `normal`, `high`, `extra`, `max` |
| `max_mode` | More compute; true doubles quota consumption |
| `hookUrl` | Callback URL; do not send `hook_url` |

Run `schema OP` before an advanced call: not every field applies to every mode or endpoint. The bundled JSON schemas preserve the endpoint distinctions.

## Track IDs and follow-up operations

Fetch results contain `data.musics[]`. Retain each `musicId` and `audioUrl`. A `jobId` identifies the request; a `musicId` identifies an individual track. Suno may return multiple tracks: report what the response contains and do not promise exactly one.

- Extension needs `music_id` from a completed result and `continue_at` in seconds. Supply desired continuation lyrics in `prompt`. The extension endpoint does not take `mv`; do not copy the generation payload wholesale.
- Cover needs `music_id`, `custom` and `mv`. In custom cover mode, `prompt: ""` means instrumental; a non-empty prompt supplies vocal lyrics. There is no `instrumental` field for this endpoint.
- Single-stem extraction uses `music_id` and optional `stem_type`, default `lead_vocal`. Use `schema suno-stems` for the full accepted stem-code enum. All-stem extraction only needs `music_id`.
- Lyrics use `prompt` plus optional `lyrics_model` (`classic` or `remi`) and are also fetched through V2.

## Interpreting results

A submission example is `{"status":"SUCCESS","message":"success","data":{"jobId":"..."}}`. This is acknowledgement only. Fetch returns outer `status` (`ON_QUEUE`, `SUCCESS`, `FAILED`), outer and/or `data.jobId`, and task-specific `data`.

For music tasks, completed audio is at `data.musics[].audioUrl`, with optional image/video URLs and track metadata. Download only output audio; do not scan arbitrary URL fields that might echo input references. Lyrics results use `data.lyrics`; preserve the raw response because task result shapes vary.

Sources: [overview](https://docs.ttapi.io/api/en/suno), [V2 result query](https://docs.ttapi.io/api/en/suno/suno_fetch_v2), [extension](https://docs.ttapi.io/api/en/suno/suno_extend), [cover](https://docs.ttapi.io/api/en/suno/suno_cover), [stems](https://docs.ttapi.io/api/en/suno/suno_stems), [all stems](https://docs.ttapi.io/api/en/suno/suno_stems_all).
