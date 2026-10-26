# TTAPI Skills

Official agent skills for generating images, videos, and music with [TTAPI](https://ttapi.io/?utm_source=github&utm_medium=skills&utm_campaign=ttapi-skills).

Install a skill, configure your TTAPI key, and describe what you want to create. Each skill includes its own Node.js client, request validation, examples, and product references. It calls TTAPI directly and works independently of MCP.

[中文说明](README.zh-CN.md) · [API documentation](https://docs.ttapi.io/) · [Get an API key](https://dashboard.ttapi.io/)

## Available skills

| Skill | Model families | Workflows |
| --- | --- | --- |
| [ttapi-image](skills/ttapi-image/SKILL.md) | GPT Image 2 / 2.5, Nano Banana | Generate images, edit reference images, retrieve asynchronous GPT image jobs |
| [ttapi-video](skills/ttapi-video/SKILL.md) | Wan 3.0, Grok | Text-to-video, first-frame image-to-video, Wan first/last frames, task retrieval |
| [ttapi-audio](skills/ttapi-audio/SKILL.md) | Suno, FlowMusic | Songs, instrumentals, lyrics, continuation, covers, stems, selected audio import/export |

The bundled catalog implements 22 documented operations. It is a versioned contract, not a live list of models enabled for your account. Standard GPT image models and TTAPI's explicitly labeled unofficial asynchronous GPT route use different model IDs; see the image skill before selecting one.

## Install

Requires Node.js 20+ and an agent with Agent Skills support and permission to run local scripts.

```sh
npx skills add ttapi-luke/ttapi-skills
```

Choose the skills and agent you want in the installer. To install one skill:

```sh
npx skills add ttapi-luke/ttapi-skills --skill ttapi-image
npx skills add ttapi-luke/ttapi-skills --skill ttapi-video
npx skills add ttapi-luke/ttapi-skills --skill ttapi-audio
```

Skills use the [open Agent Skills format](https://agentskills.io/specification). Client-specific discovery and execution settings vary; the bundled scripts also run directly from a clone. No global npm package, Python environment, or MCP service is required for execution.

## Configure your key

Create or sign in to your account at the [TTAPI dashboard](https://dashboard.ttapi.io/) and set `TTAPI_API_KEY` in the environment of the terminal or agent process that will run the scripts. The client sends it as the `TT-API-KEY` request header.

**Bash** — enter the key at the hidden prompt:

```bash
read -rsp 'TTAPI API key: ' TTAPI_API_KEY
export TTAPI_API_KEY
printf '\n'
```

**PowerShell** — enter the key at the hidden prompt:

```powershell
$taskKey = Read-Host 'TTAPI API key' -AsSecureString
$env:TTAPI_API_KEY = [System.Net.NetworkCredential]::new('', $taskKey).Password
Remove-Variable taskKey
```

These commands configure the current terminal process and its children. An already running desktop agent must inherit the variable through its own environment configuration or be launched from the configured terminal. `.env.example` is a template; the scripts do not automatically read `.env` files. Keep real keys out of chat, request JSON, screenshots, and Git.

The skills are free and MIT licensed. API generation and editing use your TTAPI account quota. Check the current [image](https://docs.ttapi.io/grids/en/start/pricing/image), [video](https://docs.ttapi.io/grids/en/start/pricing/video), and [audio](https://docs.ttapi.io/grids/en/start/pricing/audio) prices for the model and operation you select.

## Ask your agent

- “Use ttapi-image to generate one square product photo of a ceramic mug with GPT Image 2. Save it in my project's assets folder.”
- “Use ttapi-video and Wan 3.0 to create a five-second video of rain falling in a quiet forest. Save the task ID and download the completed video.”
- “Use ttapi-audio to generate instrumental synthwave background music with Suno. Preserve the task ID and save the audio files.”

Supply your actual reference media for edits and image-to-video. Creative requests authorize only the requested generation; an explanation or dry run does not send a paid request.

## Run the client directly

Clone the repository and run commands from its root. No `npm install` is needed:

```sh
git clone https://github.com/ttapi-luke/ttapi-skills.git
cd ttapi-skills

node skills/ttapi-image/scripts/ttapi.mjs models
node skills/ttapi-image/scripts/ttapi.mjs schema image2-generate
node skills/ttapi-image/scripts/ttapi.mjs submit image2-generate --input skills/ttapi-image/examples/image2-generate.json --dry-run
```

`models`, `schema`, and `--dry-run` run locally without a key or API call. Inspect and adapt the example JSON before submitting; reference URLs and previous track IDs in editing examples must be replaced with your real inputs.

The following commands send paid generation requests:

```sh
node skills/ttapi-image/scripts/ttapi.mjs submit image2-generate --input skills/ttapi-image/examples/image2-generate.json --output ./outputs/images

node skills/ttapi-video/scripts/ttapi.mjs submit wan-text-to-video --input skills/ttapi-video/examples/wan-text-to-video.json --wait --timeout 900 --output ./outputs/videos

node skills/ttapi-audio/scripts/ttapi.mjs submit suno-generate --input skills/ttapi-audio/examples/suno-generate.json --wait --timeout 900 --output ./outputs/audio
```

For Nano Banana, Grok, or FlowMusic, use the corresponding operation and example listed by that skill's `models` command.

## Results and recovery

The client prints JSON with the operation, task ID when available, normalized status, generated assets, raw API response, and downloaded file paths. Asynchronous task receipts are saved to `.ttapi/jobs/` in the working directory before polling. Keep these local records private; they include your prompts and result URLs, but do not include the request authentication header.

- `submitted`, `queued`, `running`: the generation is not complete yet.
- `succeeded`: the documented task status or synchronous result indicates completion.
- `failed`, `canceled`, `unknown`: inspect the returned response instead of starting a replacement automatically.

`--timeout` sets the polling wait budget (default 300 seconds); `--request-timeout` sets the time limit for an individual API request (default 60 seconds for asynchronous operations, 600 seconds for synchronous images). Waiting can end while a server-side task is still running. Resume the same task:

```sh
node skills/ttapi-video/scripts/ttapi.mjs get wan-text-to-video --task YOUR_SAVED_TASK_ID --wait --timeout 900 --output ./outputs/videos
node skills/ttapi-audio/scripts/ttapi.mjs get suno-generate --task YOUR_SAVED_TASK_ID --wait --output ./outputs/audio
```

Standard GPT image and Nano Banana calls return synchronously and have no task polling contract in this client. Their default gateway is `https://api.ttapi.org`, as recommended by TTAPI for long synchronous image requests. Other operations use `https://api.ttapi.io`. A timed-out paid submission may have reached the API; check existing task records or the dashboard before submitting again. Generation POST requests are never automatically retried. Transient polling failures are retried within the wait budget.

Download generated assets promptly; retention varies by service. Downloads never receive your API key and do not overwrite existing output files. A download failure preserves the API result and URL so you can retrieve the same asset again. Exit codes: `0` for a successful request or accepted pending task, `1` for errors, `2` when the polling wait budget is reached.

## Development and verification

```sh
npm run sync
npm run check
npm test
```

The source runtime lives in `scripts/ttapi-runtime.mjs`; `sync` copies it into each independently installable skill and refreshes example JSON from its catalog. `check` catches stale bundles, broken local skill references, and invalid catalog examples. Tests cover request construction, response normalization, validation, polling, receipt persistence, secret handling, asset downloads, and standalone skill copies.

Fixtures are sourced from official examples or explicitly marked schema-derived cases. Automated tests and dry runs do not generate media and do not establish live model availability or generation quality. This initial version has not been tested with paid live generation. See [development notes](docs/DEVELOPMENT.md) to update a model contract.

## License

[MIT](LICENSE) covers the skill files and client code. API access, generated media rights, and usage are governed by TTAPI and the selected model's applicable terms.
