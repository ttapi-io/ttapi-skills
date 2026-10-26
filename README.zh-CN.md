# TTAPI Skills

TTAPI 官方 Agent 技能集：让 AI 助手生成图片、视频和音乐，保存结果并接入当前项目。每个 Skill 都带独立 Node.js 客户端、参数校验、示例与产品参考，直接调用 TTAPI，无需 MCP。

[English](README.md) · [给 Agent 的官方文档索引](https://docs.ttapi.io/llms.txt) · [获取 API Key](https://dashboard.ttapi.io/)

## 按产品选择 Skill

当前提供 **16 个独立产品 Skill**，按图片／视频／音频分类；原 **3 个综合 Skill** 保留兼容，共 **19 个可安装 Skill**。优先安装需要的产品，同一能力通常无需同时安装产品 Skill 和综合 Skill。

产品目录共有 **67 个操作入口**，综合 Skill 另保留 22 个重叠入口，仓库合计 89 个打包入口，**不代表 89 个不同 API 或模型**。清单是随版本维护的文档快照，不代表账号实时可用列表，也不承诺覆盖平台全部接口。

### 图片：8 个产品

| Skill | 已实现流程 |
| --- | --- |
| [ttapi-midjourney-image](skills/image/ttapi-midjourney-image/SKILL.md) | 生图、结果动作、图片融合、反推提示词、seed、局部重绘与查询 |
| [ttapi-midjourney-edit](skills/image/ttapi-midjourney-edit/SKILL.md) | 独立图片编辑与重纹理产品，与经典 Midjourney 局部重绘分开 |
| [ttapi-nano-banana](skills/image/ttapi-nano-banana/SKILL.md) | 五个已记录 Nano Banana 模型的同步生图／参考图编辑 |
| [ttapi-openai-image](skills/image/ttapi-openai-image/SKILL.md) | 标准 GPT Image 2/2.5 生图、GPT Image 2 编辑，以及单独标明 unofficial 的 TTAPI 异步线路 |
| [ttapi-flux-image](skills/image/ttapi-flux-image/SKILL.md) | Flux 生图、multipart 编辑、Kontext 与已记录的 BFL 图片线路，含 Flux 2/3 |
| [ttapi-grok-image](skills/image/ttapi-grok-image/SKILL.md) | Grok 生图与参考图编辑 |
| [ttapi-novel-ai](skills/image/ttapi-novel-ai/SKILL.md) | NovelAI 文生图、图生图 |
| [ttapi-seedream](skills/image/ttapi-seedream/SKILL.md) | 文生图、参考图／多图生成、分层、指令编辑与同步文生图 |

### 视频：6 个产品

| Skill | 已实现流程 |
| --- | --- |
| [ttapi-gemini-video](skills/video/ttapi-gemini-video/SKILL.md) | Veo 3.1／Gemini Omni Flash 生成；支持条件内的已完成任务续写 |
| [ttapi-grok-video](skills/video/ttapi-grok-video/SKILL.md) | Grok 兼容接口的文生视频与已支持模型的首帧生成 |
| [ttapi-midjourney-video](skills/video/ttapi-midjourney-video/SKILL.md) | 首帧／尾帧动画、选定视频续写、查询与下载 |
| [ttapi-flux3-video](skills/video/ttapi-flux3-video/SKILL.md) | 文生／图生视频、视频续写、草稿增强 |
| [ttapi-wan-video](skills/video/ttapi-wan-video/SKILL.md) | Wan 3.0 文生视频、首帧、首尾帧与查询 |
| [ttapi-happyhorse](skills/video/ttapi-happyhorse/SKILL.md) | 文生视频、首帧／参考图生成、视频编辑 |

### 音频：2 个产品

| Skill | 已实现流程 |
| --- | --- |
| [ttapi-suno](skills/audio/ttapi-suno/SKILL.md) | 歌曲／纯音乐、歌词、续写、翻唱、指定分轨／全分轨 |
| [ttapi-flowmusic](skills/audio/ttapi-flowmusic/SKILL.md) | Lyria 音乐、歌词、翻唱、续写、分轨、URL 导入、格式导出 |

### 原综合 Skill 继续可用

[ttapi-image](skills/ttapi-image/SKILL.md) 保留 GPT Image／Nano Banana；[ttapi-video](skills/ttapi-video/SKILL.md) 保留 Wan／Grok；[ttapi-audio](skills/ttapi-audio/SKILL.md) 保留 Suno／FlowMusic。已有安装可继续使用原名称；综合 Skill 不会自动包含全部新增产品。

## 第一步：在 AI 客户端安装

当前 `npx skills` 安装器需要 **Node.js 22.20+**；附带客户端脚本需要 **Node.js 20+**。AI 客户端需要支持 Agent Skills 并允许执行本地脚本。Codex、Claude Code、Cursor、Gemini CLI 的发现与执行设置各有差异。

在当前项目的 **AI 聊天框** 粘贴：

> 从 https://github.com/ttapi-io/ttapi-skills 为当前使用的客户端安装 ttapi-openai-image、ttapi-wan-video 和 ttapi-suno 到本项目。检查已安装文件并报告路径。读取 https://docs.ttapi.io/llms.txt，查找相关官方接口文档。安装过程中不要生成素材。

按需替换为上表产品名称。也可以在 **本机终端** 手动安装，在安装器中选择 Skill 和客户端：

~~~sh
npx skills add ttapi-io/ttapi-skills
npx skills add ttapi-io/ttapi-skills --skill ttapi-openai-image
npx skills add ttapi-io/ttapi-skills --skill ttapi-wan-video
npx skills add ttapi-io/ttapi-skills --skill ttapi-suno
~~~

使用[开放 Agent Skills 格式](https://agentskills.io/specification)。选中的每个目录都能独立运行，执行客户端无需全局 npm 包、Python 环境或 MCP 配置。

## 第二步：在本机设置 Key

从 [TTAPI 控制台](https://dashboard.ttapi.io/) 获取 Key，在实际执行脚本的环境设置 `TTAPI_API_KEY`；客户端将它作为 `TT-API-KEY` 请求头发送。只在本机隐藏输入提示处输入真实 Key。

**Windows PowerShell**：如果当前是 Windows CMD，先运行 `powershell`，之后保持在该 PowerShell 窗口中。

~~~powershell
$taskKey = Read-Host 'TTAPI API key' -AsSecureString
$env:TTAPI_API_KEY = [System.Net.NetworkCredential]::new('', $taskKey).Password
Remove-Variable taskKey
~~~

**macOS／Linux／WSL 的 Bash**：若当前使用 zsh，先运行 `bash` 再执行以下 Bash 命令。

~~~bash
read -rsp 'TTAPI API key: ' TTAPI_API_KEY
export TTAPI_API_KEY
printf '\n'
~~~

以上变量是临时设置，只由当前终端及其子进程继承。终端 Agent 应从同一已配置终端启动；已打开的编辑器／桌面客户端，需要在自己的脚本执行环境配置 Key，另一个终端不会自动更新它。`.env.example` 只是模板，脚本不会自动读取 `.env`。不要把 Key 放进聊天、请求 JSON、截图或 Git。

然后在 AI 聊天框检查：“仅检查运行 TTAPI 脚本的环境中 TTAPI_API_KEY 是否非空。只报告已配置或缺失，不显示值，不发送 API 请求。”这只验证环境可见性，不验证 Key 有效性、余额或模型可用性。

## 第三步：生成并接入项目素材

- “使用 ttapi-openai-image 和 GPT Image 2，为当前项目首页 Hero 生成符合现有风格的商品图。保存到既有素材目录，替换 Hero 引用并检查页面。”
- “使用 ttapi-wan-video 和 Wan 3.0，为当前项目背景生成五秒森林视频。保存任务 ID，下载结果并接入已有视频组件。”
- “使用 ttapi-suno 生成没有人声的电子风格背景音乐。保存任务 ID 和音频，把选定曲目接入当前项目由用户控制播放的播放器。”

编辑、续写需要提供真实参考素材和已完成源任务 ID。创作请求只授权该范围；安装、查看文档、dry-run 不授权付费生成。生成、编辑及部分辅助操作消耗 TTAPI 额度，查看当前[图片](https://docs.ttapi.io/grids/en/start/pricing/image)、[视频](https://docs.ttapi.io/grids/en/start/pricing/video)、[音频](https://docs.ttapi.io/grids/en/start/pricing/audio)定价。Skill 代码采用 MIT，安装和源码免费。

## 开发者直接运行

克隆后从仓库根目录执行，无需 `npm install`：

~~~sh
git clone https://github.com/ttapi-io/ttapi-skills.git
cd ttapi-skills
node skills/image/ttapi-openai-image/scripts/ttapi.mjs models
node skills/image/ttapi-openai-image/scripts/ttapi.mjs schema image2-generate
node skills/image/ttapi-openai-image/scripts/ttapi.mjs submit image2-generate --input skills/image/ttapi-openai-image/examples/image2-generate.json --dry-run
~~~

`models`、`schema`、`--dry-run` 都在本地运行，无需 Key，也不调用 API。实际提交前先改好示例；演示 URL、微型图像和旧任务 ID 不等于你的真实输入。以下会发送付费生成：

~~~sh
node skills/image/ttapi-openai-image/scripts/ttapi.mjs submit image2-generate --input skills/image/ttapi-openai-image/examples/image2-generate.json --output ./outputs/images
~~~

各产品操作查看自身的 `models` 和 `schema`。有明确 multipart 文件字段时，本地文件写为 `{"$file":"path/to/file.png"}`；仅接收 URL 的 JSON 接口不会自动上传本地路径。

## 结果与恢复

客户端返回标准状态、可用任务 ID、生成素材、原始响应和下载路径。异步任务先保存回执到 `.ttapi/jobs/` 再查询；记录包含提示词和结果 URL，应私下保存。`submitted`／`queued`／`running` 尚未完成；`succeeded` 表示文档定义的成功结果；遇到 `failed`／`canceled`／`unknown` 应检查响应，不自动重新生成。

~~~sh
node skills/video/ttapi-wan-video/scripts/ttapi.mjs get wan-text-to-video --task YOUR_SAVED_TASK_ID --wait --timeout 900 --output ./outputs/videos
~~~

`--timeout` 是总轮询等待预算，默认 300 秒；`--request-timeout` 是单次请求上限，异步操作默认 60 秒、同步操作默认 600 秒。等待超时不取消服务端任务。POST 不自动重试：超时未取得 ID 时先查回执／控制台，已有任务继续查询。暂时性查询错误会在等待预算内重试。标准 GPT 图片与 Nano Banana 同步请求使用 TTAPI 推荐的 `.org` 网关，其余已记录线路使用 `.io`；不混换标准／unofficial 线路或不同产品的任务 ID。

文件保留时间因服务而异，请及时下载。下载不携带 API Key、不覆盖现有文件。退出码：`0` 请求成功／任务已接受，`1` 错误，`2` 轮询等待超时。

## 验证与维护

运行 `npm run sync`、`npm run check`、`npm test`，详见 [DEVELOPMENT.md](docs/DEVELOPMENT.md)。19 个 Skill 的格式检查、155 项离线测试均通过；缓存的 `skills@1.7.4` 安装器已在隔离目录发现并安装全部 19 个。16 个独立产品的单独副本，在无 Key、无兄弟 Skill 时均通过本地 models/schema/dry-run 检查。

**本轮产品扩展使用离线／mock 验证。此前仅进行过一次标准 GPT Image 2 真实生成；其它产品流程没有进行付费生成实测。** 安装成功与本地检查不能证明所有模型／客户端的实时可用性或生成质量。样例来自官方文档或明确标注的 schema 构造数据。

[MIT](LICENSE) 适用于 Skill 文件与客户端代码；API 服务及生成内容使用遵循 TTAPI 和所选模型的适用条款。
