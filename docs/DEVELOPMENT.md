# Updating TTAPI Skills

The installable unit is a complete directory under `skills/`. Keep every skill independently executable: runtime, catalog, references, local helpers, and examples must be available within that directory. Do not import a module from a sibling skill or the repository root.

## Source of truth

Read the relevant current schema from [TTAPI's documentation index](https://docs.ttapi.io/llms.txt). Public OpenAPI sources include:

- Images: `/openapi/en/openai.json`, `/openapi/en/gemini.json`.
- Video: `/openapi/en/wan-text-to-video.json`, `/openapi/en/wan-first-frame-to-video.json`, `/openapi/en/wan-first-last-frame-to-video.json`, `/openapi/en/wan-task-result.json`, `/openapi/en/grok-text-to-video.json`, `/openapi/en/grok-first-frame-to-video.json`, `/openapi/en/grok.json`.
- Audio: `/openapi/en/suno.json`, `/openapi/en/flowmuisc.json` (the source filename is spelled `flowmuisc`).

Paths are relative to `https://docs.ttapi.io`. Validate model-specific descriptions alongside the schema; when they disagree, document the uncertainty and expose only the confirmed subset. An existing fetch endpoint does not establish an asynchronous submit/poll workflow for a synchronous API. Never silently route a model to an alternate product or unofficial endpoint.

## Add or change an operation

1. Edit the relevant `skills/*/scripts/catalog.mjs`. Each operation has a family, description, method, path, body type, inline input schema, example, source links, generated `assetPaths`, and a `poll` descriptor when the API defines a task workflow. Use `baseUrl` only for the two trusted TTAPI gateways.
2. Keep required fields, model names, limits, and conditional fields aligned with official documentation. Use `validate(input)` returning a string array for constraints that are not conveniently expressed in the supported schema subset.
3. `assetPaths` uses dot-separated response fields and `*` for array entries. Select generated outputs only; do not include echoed source images, input audio, or preview artwork when the user requested audio.
4. Update the selected product reference and Skill routing only when behavior changes. Add official or clearly labeled synthetic fixtures under `tests/fixtures/`. Fixtures must not contain real credentials or private assets.
5. Run `npm run sync`, `npm run check`, and `npm test`. The root runtime is canonical; never patch its bundled copies independently. Update the operation count in both READMEs if the catalog grows.

`scripts/ttapi-runtime.mjs` implements a focused JSON Schema subset: types, required properties, enum/const, numeric/string/array/property limits, pattern/URL checks, nested objects, additional properties, dependent required fields, and anyOf/oneOf/allOf/if-then-else/not. It is not a complete general-purpose JSON Schema validator. Expand it with behavioral tests when a new contract needs additional keywords.

## Paid execution

Unit tests use injected HTTP responses and local fixtures. They never consume API quota. A live integration test requires a locally configured TTAPI key and an explicitly authorized generation and budget. Keep live checks separate from CI; GitHub Actions does not require secrets.

Preserve paid-action boundaries: submit once, persist a task receipt before polling, distinguish request acceptance from completion, and resume an existing task after an interrupted wait. Query retries must not become generation retries. Changes to a model, quantity, or paid follow-up operation must follow the user's requested scope.

## Publishing

Publish all files required by each installed skill. Verify a copied skill outside the repository with `models`, `schema`, and a dry run. Use the public install command to check distribution after publishing. GitHub stars and installation are distribution signals; successful API use and repeat customers require separate platform-side measurement.
