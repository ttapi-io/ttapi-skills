# TTAPI Skills

TTAPI 官方 Agent 技能集：让 AI 助手通过 TTAPI 生成图片、视频和音乐。

[English](README.md) · [接口文档](https://docs.ttapi.io/) · [获取 API Key](https://dashboard.ttapi.io/)

| Skill | 模型系列 | 当前能力 |
| --- | --- | --- |
| [ttapi-image](skills/ttapi-image/SKILL.md) | GPT Image 2 / 2.5、Nano Banana | 文生图、参考图编辑、GPT 异步任务查询 |
| [ttapi-video](skills/ttapi-video/SKILL.md) | Wan 3.0、Grok | 文生视频、首帧图生视频、Wan 首尾帧、查询与下载 |
| [ttapi-audio](skills/ttapi-audio/SKILL.md) | Suno、FlowMusic | 歌曲、纯音乐、歌词、续写、翻唱、分轨及部分音频导入导出 |

第一版包含 22 个操作。每个 Skill 都携带独立脚本、参数说明和示例，可单独安装，直接调用 TTAPI，无需 MCP。模型清单随版本维护，不代表账号实时可用列表。

## 安装

需要 Node.js 20+，以及支持 Agent Skills 且能执行本地脚本的 AI 客户端。

```sh
npx skills add ttapi-luke/ttapi-skills
```

按安装器提示选择 Skill 和客户端。也可以只安装一个：

```sh
npx skills add ttapi-luke/ttapi-skills --skill ttapi-image
npx skills add ttapi-luke/ttapi-skills --skill ttapi-video
npx skills add ttapi-luke/ttapi-skills --skill ttapi-audio
```

## 配置密钥

从 [TTAPI 控制台](https://dashboard.ttapi.io/) 获取 Key，设置运行脚本的进程环境变量 `TTAPI_API_KEY`。脚本会把它作为 `TT-API-KEY` 请求头发送给 TTAPI。

PowerShell 可用隐藏输入配置当前终端：

```powershell
$taskKey = Read-Host 'TTAPI API key' -AsSecureString
$env:TTAPI_API_KEY = [System.Net.NetworkCredential]::new('', $taskKey).Password
Remove-Variable taskKey
```

Bash：

```bash
read -rsp 'TTAPI API key: ' TTAPI_API_KEY
export TTAPI_API_KEY
printf '\n'
```

环境变量由当前终端和其子进程继承。已经运行的桌面 AI 客户端需要按自身环境配置方式设置，或从该终端启动。`.env.example` 仅为模板，脚本不会自动读取 `.env`。不要把真实 Key 放进对话、请求 JSON 或 Git。

**安装和源码免费；实际生成、编辑会消耗 TTAPI 额度。** 价格以当前[图片](https://docs.ttapi.io/grids/en/start/pricing/image)、[视频](https://docs.ttapi.io/grids/en/start/pricing/video)、[音频](https://docs.ttapi.io/grids/en/start/pricing/audio)文档为准。

## 直接告诉 AI 要做什么

- “使用 ttapi-image，通过 GPT Image 2 生成一张陶瓷杯的方形商品图，保存到项目素材目录。”
- “使用 ttapi-video，通过 Wan 3.0 生成一段五秒的雨中森林视频，保存任务 ID 并下载结果。”
- “使用 ttapi-audio，通过 Suno 生成电子风格的纯音乐，不要歌词，完成后保存音频。”

图生视频或参考图编辑需要提供真实、可访问的素材。Skill 会读取需求、准备参数，再运行附带脚本。

## 开发者直接运行

克隆后，从仓库根目录运行，无需 `npm install`：

```sh
git clone https://github.com/ttapi-luke/ttapi-skills.git
cd ttapi-skills

node skills/ttapi-video/scripts/ttapi.mjs models
node skills/ttapi-video/scripts/ttapi.mjs schema wan-text-to-video
node skills/ttapi-video/scripts/ttapi.mjs submit wan-text-to-video --input skills/ttapi-video/examples/wan-text-to-video.json --dry-run
```

`models`、`schema` 和 `--dry-run` 只做本地读取或校验，不需要 Key，也不调用 API。修改示例 JSON 为你的实际需求后，可执行付费生成：

```sh
node skills/ttapi-video/scripts/ttapi.mjs submit wan-text-to-video --input skills/ttapi-video/examples/wan-text-to-video.json --wait --timeout 900 --output ./outputs/videos
```

其他操作查看各 Skill 的 `models` 和 `schema`。编辑类示例中的旧曲目 ID、演示素材 URL 需要替换为真实输入。

## 结果与恢复

脚本输出 JSON，包含标准化状态、任务 ID、生成结果、原始响应及下载路径。异步任务在查询前先保存到当前目录的 `.ttapi/jobs/`。这些记录包含提示词和结果链接，请私下保存。

轮询超时不代表生成失败，使用原任务 ID 继续查询：

```sh
node skills/ttapi-video/scripts/ttapi.mjs get wan-text-to-video --task YOUR_SAVED_TASK_ID --wait --output ./outputs/videos
```

- `--timeout` 控制总查询等待时间，默认 300 秒。
- `--request-timeout` 控制单次 API 请求超时，异步接口默认 60 秒，同步图片接口默认 600 秒。
- 标准 GPT 图片和 Nano Banana 同步返回，使用 TTAPI 推荐的 `.org` 网关；当前客户端不为它们构造未定义的异步查询。
- 生成请求只发送一次。请求超时但没有任务 ID 时，先核查控制台，避免重复提交。
- 下载不会附带 API Key，也不会覆盖已有文件。文件保留时间因服务而异，请及时下载。

标准 GPT 图片与标注为 unofficial 的异步 GPT 路线使用不同模型 ID，请按图片 Skill 选择，脚本不会自动替换。

## 验证与维护

```sh
npm run sync
npm run check
npm test
```

测试覆盖请求、状态、轮询、下载和单独复制安装。测试样例来自官方文档或明确标注的 schema 构造数据。**首版未进行真实付费生成测试**；本地测试不能证明实时模型可用性或生成质量。详见[开发说明](docs/DEVELOPMENT.md)。

代码采用 [MIT](LICENSE) 协议；API 服务和生成内容的使用遵循 TTAPI 及所选模型的适用条款。
