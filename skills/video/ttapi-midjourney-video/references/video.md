# Midjourney video contract

Verified 2026-10-26 against [generation](https://docs.ttapi.io/api/en/videoapi/submit), [extension](https://docs.ttapi.io/api/en/videoapi/extend), [fetch](https://docs.ttapi.io/api/en/videoapi/fetch), and the machine-readable [sora.json](https://docs.ttapi.io/openapi/en/sora.json). The historical bundle is titled Sora, but these specific paths are the Midjourney Video product. Do not substitute Sora's other paths or field names. [llms.txt](https://docs.ttapi.io/llms.txt) indexes the current official pages.

All requests use `https://api.ttapi.io` and `TT-API-KEY` from `TTAPI_API_KEY`. This product is separate from `/midjourney/v1/*` images and `/midjourney/image-edits/*` editing.

## Generation

`midjourney-video-generate` sends JSON `POST /midjourney/video/submit`:

```json
{
  "prompt": "The camera slowly approaches the subject as leaves move gently in a light breeze.",
  "imageUrl": "https://example.com/your-first-frame.png",
  "model": "fast",
  "manual": "low",
  "resolution": "sd",
  "bs": 1
}
```

Replace the sample image URL. Required `prompt` describes motion; required `imageUrl` is a publicly accessible starting image. Optional `endingUrl` is a publicly accessible ending image. Only `model: "fast"` is documented; this field selects speed, not a versioned model ID.

`manual` means motion intensity (`low`, `high`), despite its name. `resolution` is `sd` (default) or `hd`, with different pricing. `bs` controls output count (1, 2, 4), default four. Optional `hookUrl` receives the same response shape as fetch. No generation `duration`, `aspect_ratio`, `audio`, `seed`, `mode`, `first_frame`, or file-upload field is defined in this schema.

## Extension

`midjourney-video-extend` sends JSON `POST /midjourney/video/extend`:

```json
{"jobId":"c679a92e-dae0-462d-b70f-dcfeaf2189fa","index":0,"manual":"low","animateMode":"auto","bs":1}
```

The public example ID is not the user's source task. Required `jobId` must identify a **completed Midjourney video** task. Required `index` is zero-based (0–3), and it must also be less than the actual number of videos returned by that source task. Check the source fetch response before extending. `manual` remains intensity; the separate `animateMode` is `auto` or `manual` (default `auto`). Optional `bs` and `hookUrl` have the same meanings as generation.

Extension has no documented `prompt`, `imageUrl`, `endingUrl`, `resolution`, `model` or duration field. Do not copy the entire generation request or another vendor's extension payload.

## Published schema corrections

The raw spec uses nonstandard JSON Schema type `int` for `bs` and `index`. It also writes counts as string enum values (`"1"`, `"2"`, `"4"`) and the index range as a single enum string `"0-3"`. The client normalizes these to integer counts 1/2/4 and integer index 0–3, matching their documented numeric meaning. This is an explicit local schema repair, not a claim of paid live compatibility testing. It does not invent extra input fields. Server acceptance still needs real account verification before a production launch.

## Submission and polling

Submission acknowledgement: `{"status":"SUCCESS","message":"success","data":{"jobId":"..."}}`. Save the task ID before waiting.

Query `GET /midjourney/video/fetch?jobId=...`. This endpoint is explicitly documented as free. Status is `PENDING_QUEUE` (one schema value has a trailing space), `ON_QUEUE`, `SUCCESS` or `FAILED`; the runtime trims status strings. On success, `data.videos` is an array of output video URLs. Other data include `action`, `progress`, `prompt`, `quota`, `hookUrl` and possibly another `jobId`.

The official fetch example has different outer `jobId` and `data.jobId` values. Catalog parsing deliberately prioritizes the outer `jobId`, then the nested value; preserve the acknowledged source ID in task receipts as well. Do not treat an echoed source image or webhook as a generated asset.

Generation and extension consume quota; fetch does not start or charge for a new generation. Use [current video pricing](https://docs.ttapi.io/grids/en/start/pricing/video) and set batch count explicitly. Never automatically resend an uncertain POST. Resume the same recorded task after wait limits, and save final videos promptly because retention varies by service.
