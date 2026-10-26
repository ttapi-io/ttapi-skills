# Maintaining TTAPI Skills

The canonical repository is [ttapi-io/ttapi-skills](https://github.com/ttapi-io/ttapi-skills). One complete Skill directory is the installable unit. Products live under `skills/image/<name>/`, `skills/video/<name>/` and `skills/audio/<name>/`; the original `skills/ttapi-image/`, `skills/ttapi-video/` and `skills/ttapi-audio/` remain compatibility entry points.

## Recursive discovery and standalone packaging

`scripts/list-skills.mjs` recursively finds directories containing `SKILL.md`, stops descending inside each Skill, and requires unique names. Synchronization and validation both use it; do not assume a single-level `skills/*` layout. Categorized Skills are installed by name:

~~~sh
npx skills add ttapi-io/ttapi-skills --skill ttapi-midjourney-image
~~~

The current installer requires Node.js 22.20+; bundled clients require Node.js 20+. Keep runtime, self-contained catalog, references, helpers and examples within each installed directory. Do not import from a sibling Skill/category or repository root. Each product works without MCP. Prefer product Skills instead of installing overlapping combined Skills as well.

Inventory: 17 products (8 image, 6 video, 3 audio), 3 combined Skills, 20 total; 79 product operation entries plus 22 overlapping compatibility entries = 101 bundled entries. These are catalog entries, not unique endpoints or model counts. Update both README tables/counts when inventory changes.

## Official source contracts

Start with [TTAPI llms.txt](https://docs.ttapi.io/llms.txt), follow the relevant index and read the exact current endpoint schema. Public sources below are relative to `https://docs.ttapi.io`:

| Product | Source |
| --- | --- |
| Midjourney Image | `/openapi/en/midjourney.json` |
| Midjourney Edit | `/openapi/en/midjourneyedit.json` |
| GPT image | `/openapi/en/openai.json` |
| Nano Banana; Gemini video | `/openapi/en/gemini.json` |
| Flux images; FLUX 3 video | `/openapi/en/flux.json` |
| Grok images | `/openapi/en/grokimage.json` |
| NovelAI | `/openapi/en/novel.json` |
| Seedream | `/openapi/en/seedream.json` and mode-specific `seedream-*.json` files in the same directory |
| Midjourney Video | `/openapi/en/sora.json`, specifically `/midjourney/video/*` paths |
| Grok Video | `/openapi/en/grok-text-to-video.json`, `grok-first-frame-to-video.json` and `grok.json` in that directory; `grok_video.json` defines a separate API shape |
| Wan Video | `wan-text-to-video.json`, `wan-first-frame-to-video.json`, `wan-first-last-frame-to-video.json` and `wan-task-result.json` under `/openapi/en/` |
| HappyHorse | `/openapi/en/happyhorse.json` and mode-specific `happyhorse-*.json` files |
| Suno | `/openapi/en/suno.json` |
| FlowMusic | `/openapi/en/flowmuisc.json` (official filename spelling) |
| Producer | `/openapi/en/producer.json` |

The historical Midjourney video bundle is named/titled Sora. Confirm actual paths with [submit](https://docs.ttapi.io/api/en/videoapi/submit), [extend](https://docs.ttapi.io/api/en/videoapi/extend) and [fetch](https://docs.ttapi.io/api/en/videoapi/fetch); do not substitute unrelated Sora operations.

Read model-specific descriptions and guides alongside raw schemas. Document contradictions and expose a reliable subset. Midjourney video's nonstandard `int`/stringified numeric enums are explicitly repaired in its reference. An existing fetch endpoint does not establish async submission for an otherwise synchronous API. Never silently swap standard/unofficial routes or conflate product-specific credentials, IDs or payloads.

## Add or change an operation

1. Edit the product's `scripts/catalog.mjs`. Each operation needs `family`, `description`, `method`, `path`, `bodyType`, inline `schema`, valid illustrative `example`, official `docs` and output `assetPaths`. Use `baseUrl` only for supported TTAPI gateways; avoid external `$ref` dependencies.
2. Preserve exact model names, required/conditional fields, numeric/string distinctions and documented limits. `validate(input)` can return a string array for extra constraints. Do not infer fields from similarly named provider APIs.
3. Add `poll` only for a documented task lifecycle: `method`, `path`, `idParam`, `location` (`query`/`body`/`path`), and optional polling `bodyType`. BFL's documented GET multipart polling must not silently become POST or query parameters.
4. Use ordered `taskIdPaths`/`statusPaths` and optional `statusMap` when a product's response differs. Map trimmed uppercase raw labels to `submitted`, `queued`, `running`, `succeeded`, `failed`, `canceled` or `unknown`. Distinguish acceptance from finished output, and successful text/metadata from missing media.
5. `assetPaths` uses dot notation and `*` for array entries. Select generated outputs only, excluding echoed inputs, callbacks and cover art when audio was requested. Prefer one CDN copy when original/CDN fields duplicate a result.
6. Update `SKILL.md` and relevant references for changed routing, limits, cost and recovery. Keep descriptions precise, with useful Chinese triggers. Add official or clearly labeled schema-derived fixtures without credentials/private inputs.
7. Run the checks below, then update both READMEs/counts. Shared runtime changes need meaningful behavioral tests; never edit bundled runtime copies independently.

~~~sh
npm run sync
npm run check
npm test
~~~

`sync` copies canonical `scripts/ttapi-runtime.mjs` into every discovered Skill and regenerates `examples/<operation>.json`. `check` catches stale bundles/examples, invalid shapes, missing official links, duplicate names and broken local references. Test standalone copies outside the repository too.

## Runtime boundaries

The runner uses Node built-ins and trusted origins `https://api.ttapi.io`/`https://api.ttapi.org`. Standard synchronous GPT images and Nano Banana use the documented `.org` gateway; preserve each operation's configured host. Auth is not forwarded to output downloads.

Bodies are JSON or multipart. A documented multipart file uses `{"$file":"path/to/file"}`; URL-only APIs do not gain file upload support through that convention. FLUX GET-with-body polling uses a narrowly scoped Node HTTPS transport because Fetch forbids GET bodies. Other API calls use Fetch. Do not generalize this path into redirects, an alternate proxy or automatic retries.

Extraction supports HTTPS URLs, documented Base64 fields and Base64 image/audio/video data URIs. Declare real output paths rather than scanning every response URL. Save outputs promptly, preserve raw responses and avoid overwriting files.

The validator supports types, required fields, enum/const, numeric/string/array/object limits, patterns/URL checks, nested and additional/dependent properties, and anyOf/oneOf/allOf/if-then-else/not. It is a focused subset, not a complete JSON Schema implementation. Add tested support when a verified contract needs another keyword.

## Paid execution and recovery

Tests must use fixtures or injected mock transports and fake keys. The machine may contain a real `TTAPI_API_KEY`: never let tests fall back to its credentials/network. `models`, `schema` and `--dry-run` are local and do not prove key validity or account access. CI does not require secrets.

Current verification: 20 Skills passed format checks; sync/check covered 101 bundled entries; 158 offline tests passed. The cached `skills@1.7.4` installer discovered/installed all 20 in isolation, and standalone copies of all 17 products passed models/schema/dry-run without keys or sibling Skills. This expansion used offline/mock checks. One standard GPT Image 2 generation was performed earlier; the other workflows have not received paid live generation tests. Do not describe installation/fixture checks as end-to-end generation tests.

Live checks need an explicitly authorized operation and quantity/budget. Some auxiliary operations are billable: current Midjourney pricing lists describe/seed, while dedicated edit/video fetch endpoints are documented as free. Read current product pricing rather than treating every POST or query-like operation alike.

Submit once and persist operation/task ID before polling. Never automatically retry a POST after an ambiguous response, timeout or disconnection: it may have reached the server. Resume an identified task; without an ID, inspect receipts/the dashboard before another paid action. Query retries remain within the wait budget and must not become generation retries. A local wait limit does not cancel the server task.

Keys belong in the script execution environment. Local setup is temporary and inherited by child processes; Windows CMD users should enter PowerShell for hidden-input setup. Running desktop/editor agents need their own environment configuration. Do not print keys or assume clients load `.env`.

## Publish and review

Publish every file required by each selected directory. Verify copied Skills using models/schema/dry-run; check public name-based installation after publishing. Use https://github.com/ttapi-io/ttapi-skills and `npx skills add ttapi-io/ttapi-skills` consistently.

Check product tables against actual catalogs. Preserve combined names for existing consumers without claiming they include every new product. Stars and installations measure distribution; successful paid use and repeat customers require separate platform-side measurement.
