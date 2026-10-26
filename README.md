# TTAPI Skills

Official [TTAPI](https://ttapi.io/?utm_source=github&utm_medium=skills&utm_campaign=ttapi-skills) Agent Skills for creating images, videos and music, saving results, and using them in your project. Each Skill includes a standalone Node.js client, validated schemas, examples and product references. It calls TTAPI directly; no MCP service is required.

[中文说明](README.zh-CN.md) · [API docs index for agents](https://docs.ttapi.io/llms.txt) · [Get an API key](https://dashboard.ttapi.io/)

## Choose a product Skill

**16 product Skills** are organized by image/video/audio, with **3 original combined Skills** retained for compatibility: **19 installable Skills** total. Prefer the product you need; installing an overlapping product and combined Skill is usually unnecessary.

Product catalogs contain **67 operation entries**. Combined Skills retain 22 overlapping entries, giving 89 bundled entries; this is not 89 distinct APIs or models. Catalogs are versioned documentation snapshots, not live account availability checks or coverage of every endpoint.

### Images — 8 products

| Skill | Implemented workflows |
| --- | --- |
| [ttapi-midjourney-image](skills/image/ttapi-midjourney-image/SKILL.md) | Imagine, returned image actions, blend, describe, seed, region inpainting and task retrieval |
| [ttapi-midjourney-edit](skills/image/ttapi-midjourney-edit/SKILL.md) | Dedicated image editing and retexturing, separate from classic Midjourney inpainting |
| [ttapi-nano-banana](skills/image/ttapi-nano-banana/SKILL.md) | Synchronous generation/reference editing with five documented Nano Banana models |
| [ttapi-openai-image](skills/image/ttapi-openai-image/SKILL.md) | Standard GPT Image 2/2.5 generation, GPT Image 2 editing, and the separately labeled TTAPI unofficial async route |
| [ttapi-flux-image](skills/image/ttapi-flux-image/SKILL.md) | Flux generation, multipart editing, Kontext and documented BFL image routes including Flux 2/3 |
| [ttapi-grok-image](skills/image/ttapi-grok-image/SKILL.md) | Grok image generation and reference-image editing |
| [ttapi-novel-ai](skills/image/ttapi-novel-ai/SKILL.md) | NovelAI text-to-image and image-to-image |
| [ttapi-seedream](skills/image/ttapi-seedream/SKILL.md) | Text/reference/multi-image generation, layers, instruction editing and synchronous text-to-image |

### Video — 6 products

| Skill | Implemented workflows |
| --- | --- |
| [ttapi-gemini-video](skills/video/ttapi-gemini-video/SKILL.md) | Veo 3.1/Gemini Omni Flash generation; eligible completed-job extension |
| [ttapi-grok-video](skills/video/ttapi-grok-video/SKILL.md) | Text-to-video and supported first-frame generation through the Grok compatibility API |
| [ttapi-midjourney-video](skills/video/ttapi-midjourney-video/SKILL.md) | Starting/ending-image animation, selected-video extension, task retrieval and downloads |
| [ttapi-flux3-video](skills/video/ttapi-flux3-video/SKILL.md) | Text/image-to-video, video continuation and draft enhancement |
| [ttapi-wan-video](skills/video/ttapi-wan-video/SKILL.md) | Wan 3.0 text-to-video, first frame, first/last frames and task retrieval |
| [ttapi-happyhorse](skills/video/ttapi-happyhorse/SKILL.md) | Text-to-video, first-frame/reference-image generation and video editing |

### Audio — 2 products

| Skill | Implemented workflows |
| --- | --- |
| [ttapi-suno](skills/audio/ttapi-suno/SKILL.md) | Songs/instrumentals, lyrics, continuation, covers, selected/all stems |
| [ttapi-flowmusic](skills/audio/ttapi-flowmusic/SKILL.md) | Lyria music, lyrics, covers, continuation, stems, URL import and format export |

### Original combined Skills

[ttapi-image](skills/ttapi-image/SKILL.md) retains GPT Image/Nano Banana; [ttapi-video](skills/ttapi-video/SKILL.md) retains Wan/Grok; [ttapi-audio](skills/ttapi-audio/SKILL.md) retains Suno/FlowMusic. Existing installations can keep these names. They do not automatically include every new product.

## 1. Install in your coding agent

The current `npx skills` installer requires **Node.js 22.20+**; bundled clients run on **Node.js 20+**. Your agent needs Agent Skills support and permission to run local scripts. Codex, Claude Code, Cursor and Gemini CLI have different discovery/execution settings.

Paste this into your agent's chat while your project is open:

> Install ttapi-openai-image, ttapi-wan-video and ttapi-suno from https://github.com/ttapi-io/ttapi-skills into this project for the agent I am using. Verify the installed files and report their paths. Read https://docs.ttapi.io/llms.txt for relevant official API references. Do not generate media during installation.

Choose other product names from the tables as needed. Or run this in your **local terminal**, selecting the Skills and agent in the installer:

~~~sh
npx skills add ttapi-io/ttapi-skills
npx skills add ttapi-io/ttapi-skills --skill ttapi-openai-image
npx skills add ttapi-io/ttapi-skills --skill ttapi-wan-video
npx skills add ttapi-io/ttapi-skills --skill ttapi-suno
~~~

Skills use the [open Agent Skills format](https://agentskills.io/specification). Each selected directory runs independently; no global npm package, Python environment or MCP setup is needed to execute its client.

## 2. Set your key locally

Get a key from the [TTAPI dashboard](https://dashboard.ttapi.io/). Set `TTAPI_API_KEY` in the environment running the scripts; the client sends it as `TT-API-KEY`. Enter it only at the hidden local prompt.

**Windows PowerShell:** if you are in Windows CMD, run `powershell` first and remain in that session.

~~~powershell
$taskKey = Read-Host 'TTAPI API key' -AsSecureString
$env:TTAPI_API_KEY = [System.Net.NetworkCredential]::new('', $taskKey).Password
Remove-Variable taskKey
~~~

**Bash on macOS/Linux/WSL:** if using zsh, run `bash` before these Bash commands.

~~~bash
read -rsp 'TTAPI API key: ' TTAPI_API_KEY
export TTAPI_API_KEY
printf '\n'
~~~

These settings are temporary and inherited by this terminal's child processes. Start a terminal agent from this configured terminal. An already running editor/desktop agent needs the key in its own script execution environment; another terminal does not update it automatically. `.env.example` is a template: clients do not automatically load `.env`. Keep keys out of chat, request JSON, screenshots and Git.

Ask your agent: “Check only whether TTAPI_API_KEY is nonempty in the environment used for TTAPI scripts. Report configured or missing without revealing the value. Make no API requests.” This checks visibility, not key validity, balance or model availability.

## 3. Create and use project assets

- “Use ttapi-openai-image and GPT Image 2 to create a product photo matching this project's landing-page hero. Save it in the existing asset folder, update the hero reference, and check the page.”
- “Use ttapi-wan-video and Wan 3.0 to create a five-second forest clip for this project's background. Save the task ID, download the result, and connect it to the existing video component.”
- “Use ttapi-suno to generate instrumental synthwave music without vocals. Save the task ID and audio, then connect the chosen track to this project's user-controlled player.”

Provide real reference media and completed source IDs for edits/continuation. A creative request authorizes only that requested scope; installation, inspection and dry runs do not authorize paid generation. Generation/editing and some auxiliary operations consume quota: check current [image](https://docs.ttapi.io/grids/en/start/pricing/image), [video](https://docs.ttapi.io/grids/en/start/pricing/video) and [audio](https://docs.ttapi.io/grids/en/start/pricing/audio) pricing. Skill code and installation are free under MIT.

## Run the client directly

Clone and run from the repository root; no `npm install` is needed:

~~~sh
git clone https://github.com/ttapi-io/ttapi-skills.git
cd ttapi-skills
node skills/image/ttapi-openai-image/scripts/ttapi.mjs models
node skills/image/ttapi-openai-image/scripts/ttapi.mjs schema image2-generate
node skills/image/ttapi-openai-image/scripts/ttapi.mjs submit image2-generate --input skills/image/ttapi-openai-image/examples/image2-generate.json --dry-run
~~~

`models`, `schema` and `--dry-run` run locally with no key/API call. Adapt examples first: demonstration URLs, tiny image data and previous-job IDs are not your actual inputs. This sends a paid generation request:

~~~sh
node skills/image/ttapi-openai-image/scripts/ttapi.mjs submit image2-generate --input skills/image/ttapi-openai-image/examples/image2-generate.json --output ./outputs/images
~~~

Use each product's `models` and `schema` for its operations. Documented multipart file fields accept `{"$file":"path/to/file.png"}`; URL-only JSON endpoints do not automatically upload local files.

## Results and recovery

The client returns normalized status, task ID when present, assets, raw response and saved paths. Async receipts go under `.ttapi/jobs/` before polling. Keep them private: they contain prompts and result URLs. `submitted`/`queued`/`running` are incomplete; `succeeded` indicates the documented result; inspect `failed`/`canceled`/`unknown` instead of submitting a replacement automatically.

~~~sh
node skills/video/ttapi-wan-video/scripts/ttapi.mjs get wan-text-to-video --task YOUR_SAVED_TASK_ID --wait --timeout 900 --output ./outputs/videos
~~~

`--timeout` controls polling (default 300 seconds); `--request-timeout` controls one request (default 60 seconds for async operations, 600 seconds for synchronous ones). A wait limit does not cancel the server task. POST submissions are never automatically retried: if no ID was returned after a timeout, inspect receipts/the dashboard first. Transient query errors are retried within the wait budget. Standard GPT image and Nano Banana use TTAPI's recommended `.org` gateway for synchronous images; other documented routes use `.io`. Do not mix standard/unofficial routes or product-specific IDs.

Download promptly; retention varies. Downloads do not receive your key or overwrite existing files. Exit codes: `0` successful/accepted task, `1` error, `2` polling wait limit.

## Verification and development

Run `npm run sync`, `npm run check` and `npm test`; see [DEVELOPMENT.md](docs/DEVELOPMENT.md). Format checks passed for 19 Skills, 155 offline tests passed, and the cached `skills@1.7.4` installer discovered/installed all 19 into an isolated directory. Standalone copies of all 16 products passed local models/schema/dry-run checks without keys or sibling Skills.

**This expansion used offline/mock verification. One standard GPT Image 2 generation was performed earlier; the other product workflows have not received paid live generation tests.** Installation and local checks do not establish every model/client's live availability or output quality. Fixtures are official examples or explicitly labeled schema-derived cases.

[MIT](LICENSE) covers the Skill files and clients. API access and generated-media use follow TTAPI and each selected model's applicable terms.
