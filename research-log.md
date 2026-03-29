# Mini Builder 研究日志

> 自动记录每 2 小时搜索发现的新方案

---

## 使用说明

此文件由 cron 任务自动更新，每 2 小时运行一次研究搜索。

新发现会追加在下方，格式：

```
## 研究时间: YYYY-MM-DD HH:mm

### 发现 #[N]
- **主题**: ...
- **来源**: ...
- **核心数据**: ...
- **实施要点**: ...
```

---

## 研究时间: 2026-03-28 17:30 UTC

### 发现 #009
- **主题**: Home Assistant + Mac Mini M4 本地 AI 集成 — token 优化问题
- **来源**: Reddit r/homeassistant, community.home-assistant.io (2025)
- **核心数据**: 
  - Mac Mini M4 完全能跑本地 AI，但 Home Assistant 发送 prompt 存在 token 爆炸问题
  - HA 发送一次"关灯"指令时，prompt 扩展到 ~8k tokens（实体、工具等全部打包）
  - 导致本该 1 秒的响应变成 10+ 秒
  - 解决方向：创建 Ollama modelfile，提前内置工具/提示词，减少每次 API 调用体积
  - 工具调用（tool calling）+ 多模态模型 + 200+ 实体时问题更严重
- **实施要点**:
  - 自定义 Modelfile 示例：提前写入常用工具描述，减少每次 API token 体积
  - Ollama 命令：`ollama create <name> -f Modelfile`
  - 推荐用 phi:3.8b 或 qwen3:4b 等小模型做 HA 语音控制专用，响应更快
- **效果量化**: 优化后目标：关灯响应 < 2 秒（vs 当前 10+ 秒）

### 发现 #010
- **主题**: OpenClaw 私有文档助手 — Ollama + 本地知识库
- **来源**: Hostinger Tutorial (2026)
- **核心数据**: 
  - OpenClaw + Ollama 可搭建完全私有的文档问答助手
  - 支持上传合同、报告、参考资料，用自然语言提问
  - 所有文件留在本地硬件，无外部 API 数据传输
  - OpenClaw 可通过 browser automation 截图并发布到 Slack/Discord 并附摘要
  - OpenClaw VPS 部署后成为 24/7 数字员工，而非桌面工具
- **实施要点**:
  - `openclaw config set models.providers.ollama.baseUrl "http://127.0.0.1:11434"`
  - 使用 `openclaw browser` 技能实现无 API 截图/发布工作流
  - MCP 协议支持让 OpenClaw 连接本地文件系统和向量数据库
- **效果量化**: 完全私有化，$0 API 成本，响应延迟仅网络延迟

### 发现 #011
- **主题**: n8n Self-Hosted AI Starter Kit 完整部署方案
- **来源**: n8n-io/self-hosted-ai-starter-kit (GitHub) / Roundfleet
- **核心数据**: 
  - n8n + Ollama + 向量数据库 Docker Compose 一键部署
  - 已知问题：Ollama 在 Docker 外部运行时，n8n 容器内无法直接访问
  - 解决：`docker run` 时加 `--network host` 或用 `host.docker.internal:11434`
  - 个人开发者用 Mac Mini M4 Pro (48GB) 跑 n8n + Ollama + RAG，完全可行
  - 替代：npm 直接安装（`npm install n8n -g && n8n start`），免费，适合原型
- **实施要点**:
  ```bash
  git clone https://github.com/n8n-io/self-hosted-ai-starter-kit.git
  cd self-hosted-ai-starter-kit
  docker compose up -d
  ```
  - Mac Mini M4 Pro 48GB 机型推荐，32GB 可跑但 LLMs 压力大
- **效果量化**: n8n 400+ 集成节点，覆盖所有主流 SaaS 和自托管服务

### 发现 #012
- **主题**: 2026 本地 LLM 格局 — 最佳模型与硬件匹配
- **来源**: SitePoint, BuildMVPFast, LocalAIMaster (2026)
- **核心数据**: 
  - **Llama 3.3 8B** (Q4_K_M)：73.0 MMLU，约 6GB，适合 M4 16GB+
  - **Mistral Small 3 7B** (Q4_K_M)：68.5 MMLU，~50 tokens/sec (16GB 硬件)，最快推理速度
  - **Phi-4-mini 3.8B**：74.4 MMLU，~3GB，8GB RAM 也能跑，性价比极高
  - **Qwen3-coder 30B** (Q4)：最佳本地编程模型，可替代 Claude Code 部分场景
  - **Deepseek V3**：M4 Max 上 benchmark 强劲，多步推理能力突出
  - **indie hacker 实测**：Cursor + Ollama + Qwen-coder 30B，Anthropic API token 使用降低 98.75%
- **实施要点**:
  ```bash
  # 一键安装 Ollama
  curl -fsSL https://ollama.com/install.sh | sh
  # 拉取模型
  ollama pull phi:3.8b      # 最小配置
  ollama pull mistral-small-3:latest  # 推荐日常
  ollama pull qwen3:4b      # 通用
  ollama pull llama3.3:8b   # 高质量
  ```
- **效果量化**: Mistral Small 3 达 50 tok/s，Phi-4-mini 仅 3GB 内存占用

### 发现 #013
- **主题**: OpenClaw Mac Mini 作为 24/7 个人 AI 服务器 — 社群用例汇总
- **来源**: Reddit r/LocalLLM, Facebook 社群 (2026)
- **核心数据**: 
  - 有人在 Mac Mini M4 上跑 OpenClaw，iMessage/Telegram 通信，24/7 运行
  - 所有数据本地：邮件、日历、任务、家庭设备，无云 AI 依赖
  - OpenClaw + VPS 部署后：从桌面工具升级为持续运行的数字员工
  - 多代理系统：research agent / writing agent / monitoring agent 分工协作
  - VPS 方案：OpenClaw 部署在 VPS，数据通过 Cloudflare Tunnel/Tailscale 安全回传
- **实施要点**:
  - Mac Mini 作为 Home Lab 核心 + Tailscale 实现外网安全访问
  - OpenClaw cron job 设置为每 2-4 小时心跳，维持持续运行
  - 分离 agent 角色：不同 workspace 目录对应不同任务域
- **效果量化**: 替代月 $20-100 的 Big Tech AI 订阅，一次硬件投入 $599-$1999

### 发现 #014
- **主题**: Obsidian Git 插件自动备份方案 — 零订阅跨平台同步
- **来源**: Reddit r/ObsidianMD, Medium (@sojkin)
- **核心数据**: 
  - Obsidian Git 插件：配置 `Automatic Backup (Push)` 后台自动推送到 GitHub/GitLab
  - 有人用 Mac Mini M4 作为 headless Obsidian Sync 服务器
  - rsync + cron 方案：定时同步 vault 到外部 HDD + Backblaze B2 云端
  - Backblaze 订阅 $7/月，无容量限制，适合 Mac Mini 服务器
- **实施要点**:
  ```bash
  # Obsidian Git 插件配置 (Community Plugins → Git)
  # 勾选 "Automatic Backup" 和 "Auto backup on save"
  # 设置备份间隔 5-30 分钟
  # 可选：crontab 备份
  0 */3 * * * rsync -avz ~/Obsidian/ /Volumes/Backup/Obsidian/
  ```
- **效果量化**: 零额外订阅，笔记安全 3-2-1 备份（本地 + 外置 + 云）

---

## 待处理队列

（cron 任务会标记可建站的方案）

**【可建站】Home Assistant + Obsidian 自动日记**: 午夜触发，HA 写入 Obsidian vault，每日模板自动填充环境数据，完全零摩擦日志系统。

**【可建站】OpenClaw 晨间简报自动化**: OpenClaw cron job 定时生成 morning briefing（email/日历/天气/任务摘要），日省 30+ 分钟，Nathan 已在生产验证。

**【可建站】OpenClaw 全业务栈监控**: 多目录结构（brainstorm/monitoring/security/weekly）+ 定时任务，被动收集信息，AI 主动监控并告警。

**【可建站】n8n + Ollama 本地 RAG**: Docker Compose 一键部署 n8n + Ollama + 向量数据库，实现文档安全摘要和本地知识问答。

---

## 研究时间: 2026-03-28 01:30 UTC

### 发现 #001
- **主题**: Mac Mini M4 16GB — 本地 LLM 性价比最优选
- **来源**: like2byte.com (2026) | Reddit r/LocalLLaMA
- **核心数据**: 
  - M4 16GB 运行 7B–8B Q4_K_M/Q5 模型：**28–35 tokens/sec**（MLX/Ollama）
  - 量化模型内存占用：Q4_K_M 约 3.5–6GB，macOS 统一内存 Architecture 无 VRAM 上限
  - 13B+ 模型建议 M4 Pro 32GB+ 或 Mac Studio
- **实施要点**:
  - 推荐模型：Llama 3.3 8B（Q4_K_M, FP16, 73.0 MMLU）、Mistral Small 3 7B（Q4_K_M, 50 tokens/sec, 68.5 MMLU）
  - 避免加载 > 7GB 模型 + 扩展上下文（会导致 macOS freeze）
  - 24GB 机型可跑 8B Q4_K_M + 16k 上下文，稳定性尚可
- **效果量化**: 日常 7B 模型响应速度 28–35 tok/s，完全满足打字级交互

### 发现 #002
- **主题**: OpenClaw + 本地 LLM + Mac Mini M4 完整本地化安全部署指南
- **来源**: Medium (@yi.cheng, 2026)
- **核心数据**: 
  - 三步安装：1) 创建隔离用户 → 2) 安装 Ollama → 3) 拉取内存友好模型
  - 注意：Gemma 3 不支持 tool calling，需用 `ollama pull qwen3:8b-q4_K_M`
  - OpenClaw Ollama 配置：`openclaw config set models.providers.ollama.baseUrl "http://127.0.0.1:11434"`
  - 关键环境变量：`OLLAMA_KEEP_ALIVE=-1`（保持模型常驻内存）
  - 安全备份：`cp -r ~/.openclaw ~/Desktop/openclaw-backup-$(date +%Y%m%d)`
- **实施要点**:
  - 创建隔离用户禁用 iCloud，从零建立信任链
  - 首次测试用 `openclaw tui`，然后 `/model ollama/qwen3:8b-q4_K_M` 切换模型
  - 备份脚本加入 crontab 每日执行
- **效果量化**: 完全离线运行，无数据出站，$0 API 成本

---

## 研究时间: 2026-03-28 05:30 UTC

### 发现 #003
- **主题**: OpenClaw 实际用例生态 — 50+ 自动化工作流实测
- **来源**: forwardfuture.ai (编译自 Feb 2026 社区生产环境)
- **核心数据**: 
  - 覆盖范围：email + CRM + 任务管理 + 简报生成；开发 pipeline；视频生产；智能家居
  - 关键用例：Morning briefing（日省 30+ 分钟）；多代理 oversight 系统；Home Assistant 语音控制
  - ClawdHub 技能库已超 1,700 个技能（2026 年 2 月）
  - 免费 PDF 白板报告（41 页）可直接下载参考
- **实施要点**:
  - "先小后大" 原则：选一个痛点先做（如 morning briefing）
  - 用 TOOLS.md 保存配置，OpenClaw 会随时间积累变得更聪明
  - 生产验证：这些不是 Demo，是 24/7 持续运行的工作流
- **效果量化**: Morning briefing 自动化节省 30+ 分钟/天；CEO 级 dashboard 多代理覆盖率 100%

### 发现 #004
- **主题**: Mac Mini M4 vs Mini PC — 本地 LLM 硬件真相
- **来源**: Medium (@mayhemcode, 2026)
- **核心数据**: 
  - Mac Mini M4 和 AMD Ryzen AI Max 迷你 PC 均使用统一内存架构，无传统 VRAM 上限
  - M4 16GB 可运行量化 7B 模型；M4 Pro 48GB 可跑 70B 模型（如 Llama 3.1 70B）
  - Mac Mini 优势：静默运行、macOS 原生生态、"it just works" 可靠性
  - 迁移成本对比：放弃 Big Tech AI 订阅（月 $20–100）vs 一次性硬件投入
- **实施要点**:
  - 视频/评测：YouTube "What Local LLMs Can You Run on the $599 M4 Mac Mini?"
  - 推荐配置：M4 Pro 48GB = 性价比甜点（~$1,999），足够跑 70B Q4_K_M
  - 双机方案：两台 32GB Mac Mini 分布式跑 70B 模型

### 发现 #005
- **主题**: Home Assistant → Obsidian 日记自动生成工作流
- **来源**: XDA Developers (Jeff Butts, Oct 2025)
- **核心数据**: 
  - 每天午夜触发，Home Assistant 自动在 Obsidian vault 创建当日笔记
  - 模板自动填充：日期、前置matter、环境数据（室温、光照、 uptime、空气质量）
  - Obsidian 作为长期档案库，Home Assistant 作为实时环境数据源，两者互补
  - 统一格式：固定 sections（logs/plans/ideas），笔记一致性大幅提升
- **实施要点**:
  - 技术栈：Home Assistant 模板系统 + 网络共享目录（或 iCloud/Obsidian Sync）
  - 触发器：`time: "00:00:00"` 每日自动执行
  - 写入路径：直接写入 Obsidian vault 目录，Obsidian 启动时自动识别
- **效果量化**: 省去每日手动创建笔记的摩擦，笔记连续性从 ~60% 提升到 ~100%

### 发现 #006
- **主题**: OpenClaw Obsidian 集成 — 技能市场生态
- **来源**: Skywork.ai / LobeHub Skills Marketplace / awesome-openclaw-skills (GitHub)
- **核心数据**: 
  - VoltAgent/awesome-openclaw-skills：**42.3k stars, 4k forks, 63 contributors**（截至 2026 年 3 月）
  - 技能分类：Security & Passwords（54 个）、Gaming（35 个）、Productivity、Home Automation 等
  - `onnowei/openclaw-backup-obsidian-sync` 技能：OpenClaw workspace ↔ Obsidian 双向同步
  - Syncthing 方案：在 OpenClaw Docker 容器和 Obsidian PC 之间同步文件
- **实施要点**:
  - OpenClaw Browser Skills：AI 可读取网页、执行点击/滚动、抓取 DOM 结构
  - 命令：`openclaw browser open <url>` → `openclaw browser snapshot --json` → AI 分析
  - Obsidian MCP Server：OpenClaw 可作为 Obsidian 的 MCP host，实现语义搜索和笔记操作
- **效果量化**: 42k GitHub stars 说明这是目前最活跃的 AI Agent 技能市场之一

### 发现 #007
- **主题**: n8n Self-Hosted AI Starter Kit — Mac Mini 上的本地 AI 工作流
- **来源**: n8n-io/self-hosted-ai-starter-kit (GitHub, Docker Compose) / Roundfleet
- **核心数据**: 
  - `n8n-io/self-hosted-ai-starter-kit`：Docker Compose 一键启动 n8n + Ollama + 向量数据库
  - 适用场景：构建 AI agent 日程管理自动化；安全摘要公司文档；本地 RAG 聊天
  - Docker Desktop on Mac Mini = 最简单的本地方式（适合学习/原型）
  - npm 方式：`npm install n8n -g && n8n start`（完全免费，适合个人项目）
- **实施要点**:
  - 已知问题：Ollama 在 Docker 外部运行时，n8n 容器内无法直接访问（需要 `--network host` 或手动配置）
  - 解决：Ollama 独立安装在宿主机，n8n 通过 `http://host.docker.internal:11434` 调用
- **效果量化**: n8n 400+ 集成节点，覆盖主流 SaaS + 自托管服务

### 发现 #008
- **主题**: OpenClaw 全业务栈运行 — 从手机编程到自愈基础设施
- **来源**: Made By Nathan (Feb 2026)
- **核心数据**: 
  - 用户 Nathan 的实际运行报告：
    - `brainstorm/`：AI 每夜探索新想法
    - `email-triage/`：Gmail 日志自动分类
    - `monitoring/`：健康检查报告
    - `reconciliation/`：完整性核对
    - `security/`：审计日志
    - `velocity/`：性能指标
    - `weekly/`：基础设施报告
  - 自愈基础设施：用 OpenClaw 管理 Home Server，AI 自动检测并修复问题
  - Reef：从零构建了名为 Neat 的完整 Web 应用（ADHD 友好界面）
- **实施要点**:
  - 多文件夹系统 + 定时 cron 任务 = 被动信息收集
  - OpenClaw 作为 "第二大脑" 主动监控，而不是被动响应
  - 关键：每类任务独立的文件夹 + 结构化输出格式
  - OpenClaw 连接飞书/Discord/Telegram，自动执行 cron 任务
  - 完全离线运行，无数据外传
- **实施要点**:
  - `brew install openclaw` 或 Docker 方式部署
  - `openclaw gateway start` 启动守护进程
  - 通过飞书机器人接收消息，Agent 响应
  - Ollama 模型：推荐 qwen2.5 7B 或 llama3.2 3B（内存占用小，响应快）

### 发现 #003
- **主题**: Mac Mini M4 vs Mini PC — 为什么 Mac Mini 是本地 AI 最优选择
- **来源**: Medium (@mayhemcode, 2026)
- **核心数据**: 
  - M4 统一内存架构 = 无 VRAM 上限 = 比 RTX GPU 性价比更高
  - 安静（无风扇全速运转声）、低功耗（~15W 空闲）
  - 社区报告：€590 M4 Mac Mini 脱销
- **实施要点**:
  - 对比 x86 Mini PC：AMD Ryzen AI Max (64GB) 价格贵 2–3 倍
  - macOS 统一内存对 7B–13B 量化模型最优
  - 16GB 基础款适合 Ollama + OpenClaw + Home Assistant 共存

### 发现 #004
- **主题**: 2026 自托管 AI 全家桶对比表
- **来源**: GitHub Gist (yalexx, 2026)
- **核心数据**:
  - **OpenClaw 方案**：€549 一次性 + €0.80/月电费；100% 本地；完整自动化；Home Assistant/MQTT 集成；本地 Whisper + Kokoro 语音
  - 对比树莓派：€0–500 硬件但无内置编排，需手工 Docker 配置
  - 对比云托管：免费但无隐私、依赖网络
- **实施要点**:
  - Mac Mini M4 + OpenClaw = 最低总拥有成本（TCO）的全功能 AI 助手
  - 语音方案：Whisper（本地语音识别）+ Kokoro（TTS），无需云 API

### 发现 #005
- **主题**: n8n + Ollama — 杀手级自动化组合，每月 $0 运行成本
- **来源**: DEV.to Signal Weekly (2026) | n8n 社区
- **核心数据**:
  - n8n + Ollama 本地推理 = 私有 AI 自动化，**$0/月**运行成本
  - 已有用户实战：Telegram 支持 bot + AI 分类、市场监控 pipeline
  - n8n 支持通过 API 调用本地 Ollama，实现 AI-driven 工作流
- **实施要点**:
  - Docker 部署：`docker pull n8nio/n8n`
  - Ollama 作为 LLM provider：`http://litellm:4000` 统一接入
  - 示例 workflow：邮件 AI 分类 → 提取 action items → 创建飞书任务
  - GitHub 参考：penkayone/n8n-automation-portfolio（4 个生产级 workflow）

### 发现 #006
- **主题**: 2026 本地 LLM 模型实测排行榜（开发者视角）
- **来源**: SitePoint (2026)
- **核心数据**:
  - Llama 3.3 8B Q4_K_M：**73.0 MMLU**，8B 模型最高分，约 6GB 内存
  - Mistral Small 3 7B Q4_K_M：**50 tokens/sec**（同档最快），68.5 MMLU，仅需 8GB RAM，内存占用 ~3.5GB
  - Phi-4-mini：最小可用模型，适合 8GB 机器
  - 70B Q4_K_M 需要 >40GB 内存（Mac Studio 专用）
- **实施要点**:
  - M4 16GB 推荐：Mistral Small 3 7B（最快）或 Llama 3.3 8B（最高质量）
  - M4 Pro 24GB+：可上 Llama 3.3 8B + 32k 上下文

### 发现 #007
- **主题**: 自托管 RSS — Miniflux 完整方案
- **来源**: XDA Developers | christiano.dev (2026)
- **核心数据**:
  - Miniflux：极简开源 RSS 阅读器，100% 自托管，无广告/追踪
  - 用户报告：迁移后完全摆脱社交媒体获取新闻的习惯
  - 支持 API，可与 n8n/OpenClaw 集成做 AI 摘要
- **实施要点**:
  - Docker 部署：`docker run -d -p 80:8080 miniflux/miniflux`
  - 配合 OpenClaw 做 AI 摘要：n8n workflow 定时抓 RSS → 丢给 Ollama 摘要 → 飞书推送
  - 策略转变：从"算法推送"切换"主动订阅"，信息质量大幅提升

### 发现 #008
- **主题**: OpenClaw 实际用户案例 — 30 个真实工作流
- **来源**: Facebook OpenClaw 用户群 (2026)
- **核心数据**:
  - 晨间简报自动生成 → 发送至飞书/Discord
  - 服务器健康监控（截图 + 摘要推送）
  - 私人口档助手（Ollama + 本地文档问答）
  - 草稿回复生成（邮件/消息 AI 草稿，审核后发送）
  - 飞书多维表格数据录入自动化
- **实施要点**:
  - OpenClaw 的浏览器自动化可截图 + 摘要发 Slack/Discord
  - 私人口档助手：`brew install openclaw && openclaw skill install doc-qa`
  - 草稿回复：AI 生成初稿，人类审核，避免自动发送风险

### 发现 #009
- **主题**: Obsidian Git 备份 — 知识库双重保险
- **来源**: YouTube Obsidian Help | 2026 Guide
- **核心数据**:
  - Obsidian Local Backup 插件：自动将 vault 复制到指定文件夹
  - Git 插件：commit + push 到 GitHub/私有 Git 服务器
  - 组合策略：本地自动备份 + Git 版本控制
- **实施要点**:
  - `obsidian-git` 插件配置：每日自动 commit，push 到私有仓库
  - 配合 Mac Mini Time Machine = 三重备份（本地快照 + Git 版本 + Time Machine）
  - 关键文件（如 daily notes）可设置更高频率自动 commit

### 发现 #010
- **主题**: 有人在用 Claude Code 操控 n8n — AI 帮你建 Workflow
- **来源**: Facebook OpenClaw 用户群 (2026)
- **核心数据**:
  - n8n 有完整 API，可以用 API key 授权给 Claude Code
  - Claude Code 写完 workflow → 发布 → 测试，全程自动化
  - OpenClaw 用户经验：自己搭建 n8n workflow 让 AI 跑，太大材小用
- **实施要点**:
  - n8n API 文档 → 配合 Claude Code 直接写 workflow JSON
  - OpenClaw 更适合做 orchestrator（编排者），n8n 做执行者
  - 实际上 OpenClaw 可以通过 MCP 工具调用 n8n API，不需要分开两个 AI

---

**【可建站】Home Hub 方案**: Mac Mini M4 + Home Assistant + OpenClaw + 本地 LLM，打造完全离线智能家居控制中台，支持语音命令和飞书指令

**【可建站】AI 情报站**: Miniflux (RSS) → n8n (抓取+摘要) → Ollama (LLM 摘要) → 飞书推送，每日自动化情报聚合

**【可建站】Ollama + OpenClaw 飞书机器人**: 完全本地化的飞书 AI 助手，无 API 费用，支持文件问答、任务创建、日程管理

**【可建站】Mac Mini 即插即用服务器方案**: AdGuard + UniFi Network Server + Homebridge 三合一，一台设备替代多个独立服务器，低功耗 24/7 运行。

**【可建站】OpenClaw 多 Agent 协作系统**: 13 个专业 agents（研究/监控/执行/报告）并行工作，共享 memory，cron 驱动，n8n 做执行层，完全自动化业务流程。

---

## 研究时间: 2026-03-28 03:30 UTC (2026-03-27 20:30 PDT)

### 发现 #011
- **主题**: Mac Mini M4 统一内存架构 — 本地 LLM 的硬件优势量化
- **来源**: StratoBuilds (2025-09) | LinkedIn Dmitry Markov 基准测试
- **核心数据**:
  - M4 Pro Mac Mini **统一内存** vs RTX 3060 分离 VRAM：LLM 必须整块加载到显存，统一内存无 VRAM 上限
  - 内存带宽：Apple Silicon 超过消费级 Intel/AMD CPU，且无需 CPU↔GPU 数据拷贝
  - 功耗：Mac Mini 空闲 <5W，LLM 推理峰值 ~65W；对比 RTX 4090 系统（+250W+）
  - M4 Pro 跑 70B Q4 模型：实测可运行（需 48GB+ 配置）
- **实施要点**:
  - 推荐 M4 Pro 48GB（~$1,999）作为本地 LLM 主力机，平衡性价比与模型规模
  - M4 16GB 适合跑 7B–13B 量化模型 + OpenClaw + Home Assistant 共存
  - 电源监控：WLED 动画跟随 Mac 即时功耗，可视化 LLM 推理状态

### 发现 #012
- **主题**: Home Assistant + 本地 LLM 五大实战用法（XDA 实测）
- **来源**: XDA Developers (Samir Makwana, 2025-07)
- **核心数据**:
  - 语音控制（$13 M5Stack ATOM Echo）：自然语言链式命令，如"晚上模式开灯调暗开风扇"
  - 天气→穿衣建议：自动化 HA 提取天气预报 → 本地 LLM 生成"今天适合..."摘要
  - 每日任务建议：本地 LLM 基于天气和日程生成 action items
  - 自定义语音人格（GLaDOS）：修改 prompt + 定制 TTS 音色
  - 通知过滤：本地 LLM 判断通知优先级，过滤噪音
- **实施要点**:
  - Home Assistant 2025.6+ 原生 Ollama 集成：Settings → Devices & Services → Add Ollama
  - 语音 pipeline：Assist + Speech-to-Phrase + Ollama conversation agent
  - 推荐模型：Mistral 7B / Llama3 8B Q4_K_M（够用且响应快）

### 发现 #013
- **主题**: n8n Self-hosted AI Starter Kit — Mac Mini 一键部署本地 AI 全家桶
- **来源**: Roundfleet (n8n.io 官方维护)
- **核心数据**:
  - 包含组件：n8n + Ollama + Qdrant（向量数据库）+ PostgreSQL
  - Docker Compose 一键启动：`git clone → docker compose up`
  - 适合场景：AI agent 调度、文档摘要、workflow bot
- **实施要点**:
  - `brew install --cask docker` 安装 Docker Desktop
  - `git clone https://github.com/n8n-io/self-hosted-ai-starter-kit.git`
  - `cd self-hosted-ai-starter-kit && docker compose up`
  - 访问 http://localhost:5678 配置 n8n
  - 与 OpenClaw 协作：OpenClaw 做编排，n8n 做执行（通过 MCP 或 API）

### 发现 #014
- **主题**: OpenClaw 与 n8n 的分工定位 — 不是竞争，是互补
- **来源**: Reddit r/selfhosted | VPSBG.eu (2026)
- **核心数据**:
  - n8n：预定义 workflow，400+ 集成，适合结构化重复任务（定时、数据管道）
  - OpenClaw：自然语言决策，浏览器自动化，文件系统操作，适合开放式任务
  - OpenClaw 使用 MCP 工具协议，可直接调用 n8n API
  - 关键差异：n8n 需要预先设计 workflow；OpenClaw 可以动态生成任务
- **实施要点**:
  - OpenClaw 作为"大脑"，n8n 作为"手"：OpenClaw 决策 → 调用 n8n workflow 执行
  - 示例：OpenClaw 接收飞书消息 → 判断需要创建任务 → n8n workflow 在飞书多维表格中录入
  - OpenClaw 配置 n8n API key 后可用 `exec` 工具触发 workflow

### 发现 #015
- **主题**: Mac Mini M4 + Home Assistant 语音助手实战（MattCool.tech）
- **来源**: MattCool.tech (2026)
- **核心数据**:
  - Home Assistant + Ollama + 本地 LLM = 完全离线语音助手
  - Part 1：配置 HA + Voice Assist（preview edition）+ Ollama
  - 问题记录：唤醒词触发后 LLM 响应慢（Ollama 冷启动），建议设置"唤醒时才启动"机制
  - 轻量命令（计时器、开关灯）走 dumb agent，避免每次唤醒大模型
- **实施要点**:
  - 两层架构：轻量 agent 处理简单命令 + Ollama 大模型处理复杂请求
  - 本地 TTS（Kokoro）替代云端语音合成
  - Home Assistant 搭配 Wyoming 协议连接语音卫星

### 发现 #016
- **主题**: RSS + AI 摘要自动化 — n8n + Miniflux + Ollama 方案
- **来源**: christiano.dev | n8n 官方集成文档 (2026)
- **核心数据**:
  - Miniflux API：`GET /v1/entries?limit=10` 获取未读条目
  - n8n RSS Read 节点定时抓取 → Ollama 摘要 → 飞书/Discord 推送
  - 用户经验：RSS + AI 摘要彻底替代 Twitter/算法社交媒体信息源
- **实施要点**:
  - Miniflux Docker 部署：`docker run -d -p 80:8080 -e DATABASE_URL=... miniflux/miniflux`
  - n8n workflow：RSS → HTTP Request (Ollama API) → Condition → Send Message
  - Ollama prompt：`Summarize the following article in 3 bullet points: {article_text}`
  - 推送频率建议：每日 1-2 次（早间 + 午后）避免信息过载


---

## 研究时间: 2026-03-28 07:30 UTC

### 发现 #017
- **主题**: StratoBuilds — Ollama + Home Assistant + Open WebUI 完整指南（含功耗数据）
- **来源**: stratobuilds.com (Sep 2025, HA Version 2025.9.3)
- **核心数据**:
  - Mac Mini M4 Pro 功耗：**< 5W 空闲，峰值 ~65W**（实测 LLM 推理时）
  - 统一内存架构优势：GPU 可访问全部内存池，无传统 VRAM 上限
  - Home Assistant 2025.6+ 原生支持 Ollama 集成（Settings → Devices & Services → Add Ollama）
  - 推荐 URL：`http://<Mac-Mini-IP>:11434`，建议设置静态 IP
  - 天气自动化：每 30 分钟预生成天气报告，存储为 text helper，实现秒级响应
  - 模型组合：Gemma3:27B 分析雷达图 + Mistral-Small:24B 处理气象站数据
- **实施要点**:
  - 安装 Ollama：`curl -fsSL https://ollama.com/install.sh | sh`
  - HA 配置多个 conversation agents：Qwen3 4B 用于实时语音命令 + Mistral Small 24B 用于复杂推理
  - Open WebUI：Docker 一键部署，完全本地化 ChatGPT 替代品
  - 功耗可视化：用 WLED 动画跟随 Mac 即时功耗，直观观察 LLM 推理负载
- **效果量化**: 统一内存 vs RTX 3060 在大 context 场景性能相当，功耗远低于 GPU Server

### 发现 #018
- **主题**: Reddit 实测 — Mac Mini M4 24GB 模型级联方案（Sonnet 4.6 主 + Qwen 本地备）
- **来源**: Reddit r/LocalLLaMA (Atlas-Cowork, 2024)
- **核心数据**:
  - 24/7 Telegram 接口个人助手，3 层模型级联：
    - 主：Sonnet 4.6（云端，最佳推理能力）
    - 本地：Qwen 3.5 27B（Ollama，API 故障时自动切换，覆盖 80% 任务）
    - Whisper：Faster-Whisper Large v3（本地语音转文字，延迟 -10s，零云传输）
    - TTS：Piper TTS thorsten-high（108MB，德语，快速本地合成）
    - 图像：FLUX.1-schnell（本地，**7 分钟/图** ⚠️ MPS 太慢）
  - 关键配置：`KEEP_ALIVE=60s`（Ollama 保持模型在内存）
  - 24GB 内存约束：不要同时运行 Qwen + Whisper
  - 预算：Mac Mini M4 24GB ~$600，完全离线运行
- **实施要点**:
  - 开源配置模板：`github.com/Atlas-Cowork/openclaw-reference-setup`（含安全设置、模型级联、cron jobs）
  - Whisper 本地化是"无脑选"：质量好，延迟可接受异步场景，不上传语音数据
  - MPS 扩散模型预期管理：比 CUDA 慢很多，不要围绕它建核心工作流
- **效果量化**: 模型级联 = 最佳质量时用云 + 永远不"挂掉"；Mac Mini 空闲 15W，24/7 运行成本低
- **参考价值**: 这套 cascade architecture 是 Jeremy 目前最接近的生产方案

### 发现 #019
- **主题**: OpenClaw 工作流自动化全景 — 25 用例 + 购物清单/晨简/邮件/快递追踪
- **来源**: Hostinger Tutorials (Ariffud M., Feb 2026)
- **核心数据**:
  - 25 个经过生产验证的 OpenClaw 用例，分为 6 大类
  - 典型用例：
    - **晨间简报**（6:30 AM）：天气 + 日历前3项 + BBC 头条，150 词以内
    - **家庭购物清单**：监控 WhatsApp/Telegram 关键词，自动去重分类（乳制品/蔬果/调味品）
    - **语音日记**：录音 → ffmpeg 转换 → Whisper 转写 → AI 整理为 mood/highlights/lessons/tomorrow
    - **会议记录**：上传录音 → 转写 → 输出摘要 + 行动项 + 决策清单
    - **快递追踪**：从邮件/照片提取单号，自动查 API 状态，异常时告警
    - **邮件零收件箱**：每日摘要 + 自动分类，标记需优先处理
  - OpenClaw on VPS：24/7 可靠性优于本地设备，适合 sleep 期间运行的自动化
- **实施要点**:
  - 晨简 prompt 示例：`"Every morning at 6:30 AM, send me a message with: today's weather, first three calendar events, top three BBC headlines. Under 150 words."`
  - 购物清单关键：OpenClaw 监控对话关键词 + 去重 + 分类，比手动维护更省力
  - 语音日记流程：`ffmpeg` 格式转换 → Whisper 转写 → AI 分段整理 → 存入笔记 app
- **效果量化**: 晨简 2 分钟/天；会议记录节省 30+ 分钟/会；快递追踪消除反复查单号焦虑

**【可建站】OpenClaw 快递追踪助手**: 监听邮件/短信关键词，提取快递单号，自动查询状态并推送，异常时告警。适合飞书集成。

**【可建站】语音日记自动化**: 飞书语音消息 → Faster-Whisper 本地转写 → OpenClaw 整理 → 存入 Obsidian。完全本地化隐私保护。

---

## 研究时间: 2026-03-28 09:30 UTC (2026-03-28 02:30 PDT)

### 发现 #020
- **主题**: Mac Mini M4 + OpenClaw + n8n 完整 Headless AI Agent 部署方案
- **来源**: Medium (@creativeaininja, 2026)
- **核心数据**:
  - OpenClaw 作为 AI 推理引擎 + n8n 作为安全编排层（API 凭证隔离）
  - 从零开始一台 Mac Mini 到生产级 AI Agent 的完整路线图
  - 用户从单一 OpenClaw AI Assistant (Moltbot) 扩展到 **13 个专业 agents**（cron jobs + 共享 memory + 自更新看板）
  - 10 个 Must-Have Skills for Claude in 2026（可迁移到 OpenClaw）
- **实施要点**:
  - 分层架构：OpenClaw 负责自然语言推理 + 决策，n8n 负责执行（API 调用）
  - 安全隔离：n8n 持有敏感 API keys，OpenClaw 通过 n8n 间接调用外部服务
  - 多 agents 协作：每个专业任务独立的 agent，通过共享 workspace 通信
  - 自更新看板：agents 定期更新自己的任务状态，减少人工维护
- **效果量化**: 13 专业 agents 可并行处理任务，覆盖从研究到执行的完整 pipeline

### 发现 #021
- **主题**: ClawBox vs Mac Mini M4 — 真实 AI 助手硬件对比（含 TCO 计算）
- **来源**: GitHub Gist (yalexx, 2026)
- **核心数据**:
  - **Mac Mini M4 性价比优势明显**：比 ClawBox 便宜 ~€530（4 年周期）
  - Mac Mini M4 **快 3 倍**本地推理，可跑 70B 模型（16GB 配置）
  - 如果**已有 Mac Mini**：ClawBox 无意义；如果需要新硬件，这是重要决策参考
  - Mac Mini 一次性成本 vs 云 API 订阅（月 $20–100），2–4 年回本
- **实施要点**:
  - ClawBox 定位：紧凑型 Home Assistant 专用硬件（非通用 AI 推理）
  - Mac Mini 优势：通用计算 + 本地 LLM + OpenClaw + 家庭服务器
  - TCO 公式：硬件成本 + 电费 vs 云 API 订阅成本，Mac Mini 通常 2–3 年回本
- **效果量化**: Mac Mini M4 = 最低 TCO 的"全能 AI 服务器"方案

### 发现 #022
- **主题**: Mac Mini M4 家庭服务器实战 — AdGuard + UniFi + Homebridge
- **来源**: stealthpuppy.com (2026)
- **核心数据**:
  - Mac Mini 作为家庭服务器完全可行：低功耗 + macOS 稳定性
  - 实测配置：AdGuard Home（DNS 过滤）+ UniFi Network Server + Homebridge
  - Mac Mini M4 Pro 作为服务器，功耗极低，可 24/7 运行
  - macOS 配置：外部 DNS（安装期间）→ 安装后切换到路由器 DNS
- **实施要点**:
  - Homebridge：让 HomeKit 设备与 Home Assistant 互通
  - UniFi Network Server：需要较新 macOS 版本（ Monterey+）
  - 电源管理：Mac Mini 天然支持 Wake on LAN + 远程管理
- **效果量化**: 一台 Mac Mini 替代 3 个独立服务器设备（DNS + 网络控制器 + HomeKit bridge）

### 发现 #023
- **主题**: OpenClaw + Gmail 日报生成 — cron job + gog CLI 完整配方
- **来源**: devshorts.in (OpenClaw Developer Guide, 2026)
- **核心数据**:
  - 每日 AI 新闻摘要（来自 Gmail "AI digest" 标签）→ 推送到个人 WhatsApp
  - 核心技术栈：`openclaw cron add` + gog CLI（Gmail 客户端）
  - OpenClaw CLI 核心命令：
    - `openclaw configure` — 交互式安装后配置
    - `openclaw gateway status` — 检查守护进程状态
    - `openclaw cron run <jobId>` — 手动触发 cron job
  - cron 表达式：`0 10 * * *`（每天 10:00 AM）+ 时区设置 `--tz "Asia/Kolkata"`
- **实施要点**:
  - gog 配置 Gmail 访问：`gog account add "your-email-id"`
  - cron job 配置示例：
    ```
    openclaw cron add \
      --name "Daily AI digest from Gmail label" \
      --session isolated \
      --cron "0 10 * * *" \
      --tz "America/Vancouver" \
      --message 'Using gog with account "your-email-id", check Gmail label "AI digest" for emails from the last 24 hours...'
    ```
  - isolated session = 不占用主 session，完全后台运行
- **效果量化**: 每天自动汇聚 Gmail 中的 AI 资讯，0 手动操作

### 发现 #024
- **主题**: 本地 LLM 推理 2026 完整指南 — M4 Pro + Ollama 实战
- **来源**: blog.starmorph.com (2026)
- **核心数据**:
  - M3 Pro MacBook Pro 生成 7B 模型：**40–60 tokens/sec**
  - **Mac Mini M4 Pro 48GB**（$1,599）= 70B 参数模型最高性价比
  - Apple 分布式推理实验：Mac Mini 集群运行 671B 参数模型
  - Z.ai GLM-5：744B 参数（40B 活跃），MIT 许可，Text Arena 开放模型第一名
  - Claude Code 仍是复杂编码任务首选，本地模型不适合复杂 agentic 编码任务
- **实施要点**:
  - 7B 模型：M4 16GB 可流畅运行，Mistral Small 3 达到 50 tok/s
  - 70B 模型：仅 M4 Pro 48GB+ 配置可行
  - Apple 集群方案适合未来扩展，不是当前个人用户选项
  - Claude Code + 本地 Ollama = 最佳组合（Claude Code 做复杂任务，本地做日常推理）

### 发现 #025
- **主题**: Mac Mini 替代 AWS — 初创公司 95% 成本削减案例
- **来源**: Medium (@yogeshwar9354, 2026)
- **核心数据**:
  - 初创公司用 Mac Mini M4 替代 AWS 生产服务器，成本从每月 $XXX 降到 ~$15/月（电费）
  - Mac Mini 作为 VPS 替代品：完全私有、零订阅、无网络依赖
  - 适用于：个人项目、SaaS 部署、AI 服务端点
- **实施要点**:
  - Mac Mini 放在家里/办公室，通过 Tailscale 或 Cloudflare Tunnel 暴露服务
  - 需要考虑：静态 IP、UPS 备用电源、网络上行带宽
  - 与云 VPS 相比：前期硬件投入，但 6–12 个月后完全回本
- **效果量化**: $699 硬件一次性投入 ≈ 替代 $50–200/月 VPS 账单，1 年 ROI 超 1000%

### 发现 #026
- **主题**: OpenClaw + VPS = 24/7 数字员工 — Power User 进阶架构
- **来源**: go.lightnode.com (Advanced OpenClaw Workflows, 2026)
- **核心数据**:
  - OpenClaw 部署到 VPS 后，从"工具"变成"数字员工"：持续运行，主动工作
  - 多工具自动化链（Multi-Tool Automation Chains）：OpenClaw 的真正威力
  - 典型进阶架构：OpenClaw (VPS) + n8n (执行层) + Ollama (推理) + Telegram/飞书 (交互)
  - OpenClaw 天然支持飞书机器人，通过消息接口接收指令
- **实施要点**:
  - VPS 部署优势：sleep 期间也能工作（Mac Mini 关机时不断线）
  - 多 agents 分工：一个负责监控，一个负责执行，一个负责报告
  - OpenClaw 决策 + n8n 执行 = 可靠的 agentic workflow
- **效果量化**: 24/7 不间断运行，不需要 Mac Mini 一直开机

### 发现 #027
- **主题**: 500 个 OpenClaw 用例 — 完整分类清单
- **来源**: Reddit r/AISEOInsider (2026)
- **核心数据**:
  - OpenClaw 用例分为：生产力、研究监控、营销自动化、内容策划、开发辅助、个人组织
  - 核心价值：将 AI 从"聊天工具"变成"自动化工作流"
  - AI agents 可以连接多个工具，自动完成从研究→规划→创建→报告的完整链路
- **实施要点**:
  - 用例列表来源：ClawHub（clawhub.com）搜索
  - 飞书集成相关的用例：Feishu 消息分类、草稿生成、任务创建
  - 最有价值的用例：Research monitoring（持续追踪竞品/行业动态）
- **效果量化**: 用例数量说明 OpenClaw 生态已相当成熟，不是早期实验品

### 发现 #028
- **主题**: Mac Mini M4 + OpenClaw 真实购买体验 — €590 机器 2 天上手报告
- **来源**: thefountaininstitute.com (Jeff Humble, 2026)
- **核心数据**:
  - 购买动机：逃离 Big Tech AI 订阅（GPT $20/月 + Claude $20/月）
  - €590 M4 Mac Mini（德国打折）引发抢购，美国也报告缺货
  - OpenClaw 安装体验：普通用户 2 天从零到跑通（中途遇到一些坑）
  - 关键转变：从"在 Terminal 里折腾"到"躺在沙发上用短信跟 AI 说话"
  - 最终状态：Claude Code + ChatGPT + OpenClaw 三者同时打开，互相验证
- **实施要点**:
  - OpenClaw 的核心价值：持久记忆 + 能真正在电脑上执行任务
  - 对普通用户最友好的交互：飞书/Telegram 消息接口，不需要 Terminal
  - 实测建议：先看官方文档再动手，减少踩坑时间
- **效果量化**: 替代 $40+/月的云 AI 订阅，$0 边际成本，隐私全保

---

## 研究时间: 2026-03-28 11:30 UTC (2026-03-28 04:30 PDT)

### 发现 #029
- **主题**: Homelab AI Stack 2026 — n8n + Ollama = $0/月私有 AI 自动化
- **来源**: DEV.to Signal Weekly (2026)
- **核心数据**:
  - **杀手级用例**：n8n + Ollama 组合实现 $0/月私有 AI 自动化
  - n8n + LiteLLM 统一接入层：所有工具（n8n、Open WebUI、脚本）共用 `http://litellm:4000`，一个配置文件切换模型
  - OpenClaw 在 15W 设备（OrangePi 级）上 24/7 运行：Telegram 自动化 + 浏览器控制 + cron jobs
  - 本地 LLM 接入 n8n：自动分类邮件 + 监控服务器 + 摘要笔记 = 真实杠杆效应
- **实施要点**:
  - LiteLLM 作为统一网关：`litellm --model ollama/qwen` 格式调用本地模型
  - n8n workflow 示例：Ollama API 调用 → 判断邮件优先级 → 飞书任务创建
  - OrangePi 级低功耗设备适合 OpenClaw 基础运行，Mac Mini 跑更重的 Ollama 推理
- **效果量化**: $0 月成本 vs $20–100/月云 API 订阅；15W 设备 24/7 运行，电费可忽略

### 发现 #030
- **主题**: OpenClaw + 24GB Mac Mini M4 模型内存管理实战
- **来源**: Facebook OpenClaw 用户群 (2026)
- **核心数据**:
  - 24GB Mac Mini M4 模型加载注意事项：
    - 加载 8GB LLM + macOS 系统 ≈ 刚好够用，不够"呼吸"
    - 加载 6GB LLM + 16k 上下文扩展 → 模型实际占用 > 6GB，可能 freeze
    - 安全选择：3–4GB 模型（4–5GB 含 32k 上下文）= macOS 稳定运行
  - 推荐方案：Qwen3 4B 或 Phi-3 系列 = 小内存占用 + 足够智能
  - 24GB 机器上更激进方案：8B Q4 模型关闭扩展上下文，专注短交互
- **实施要点**:
  - `ollama pull qwen3:4b` — 最小可用本地模型
  - 避免 context extension + 大模型同时使用
  - 监控方式：Activity Monitor 看 Memory Pressure，控制在黄色以下
- **效果量化**: 稳定运行 vs freeze 的边界在 24GB 配置下非常清晰

### 发现 #031
- **主题**: rsync Time Machine 风格备份 — Mac Mini 增量快照方案
- **来源**: github.com/samdoran/rsync-time-machine (Shell 脚本)
- **核心数据**:
  - 核心命令：`rsync -avPh --delete --link-dest=$TARGETDIR/$USER`
  - `--link-dest` 关键：硬链接 unchanged 文件到上一个快照，新快照只写更改文件
  - 结果：时间旅行式增量快照，但只占用实际数据空间
  - 支持 cron 或 launchd 调度
- **实施要点**:
  - 变量：`TIMESTAMP=$(date+"%Y-%m-%dT%H-%M-%S")`，`SOURCEDIR`，`TARGETDIR`
  - 轨迹斜杠很重要：`$SOURCEDIR/` 结尾，rsync 行为正确
  - launchd plist 放在 `~/Library/LaunchAgents/` 实现开机自启
  - 外挂硬盘作为 TARGETDIR，2–3x 源数据大小
- **效果量化**: 增量快照每次只写变更文件，第二次备份几乎瞬间完成（GB 级数据）

### 发现 #032
- **主题**: Home Assistant on Mac Mini — UTM 免费虚拟化方案
- **来源**: YouTube (How to Set Up Home Assistant on Apple Silicon Mac Mini FREE using UTM)
- **核心数据**:
  - UTM：免费开源虚拟化工具，支持 Apple Silicon，无需 VMware/Parallels
  - HA OS 在 UTM ARM64 虚拟机内运行（类似树莓派镜像）
  - Mac Mini 性能完全足够 24/7 运行 HA 虚拟机
  - 另一个选项：Home Assistant Core 直接跑在 macOS 上（更轻量）
- **实施要点**:
  - UTM 下载：`brew install --cask utm`
  - HA OS ARM64 镜像：home-assistant.io → 下载 `haos_generic-aarch64-*.img.xz`
  - UTM 配置：分配 2–4 核 + 4GB RAM + 32GB 存储
  - 网络模式：共享网络（与宿主机同一网络段）
- **效果量化**: $0 软件成本，Mac Mini 性能远超树莓派，HA 响应速度更快

### 发现 #033
- **主题**: OpenClaw Obsidian 双向同步 — Syncthing 方案
- **来源**: awesome-openclaw-skills (GitHub) | 2026
- **核心数据**:
  - `onnowei/openclaw-backup-obsidian-sync`：OpenClaw workspace ↔ Obsidian vault 双向同步
  - Syncthing：开源 P2P 文件同步，跨设备（Docker 容器 ↔ 本地 PC）同步 Obsidian vault
  - 优势：无需云服务、完全私有、支持大文件、增量同步
  - OpenClaw 作为 Obsidian MCP host：AI 可语义搜索笔记、执行笔记操作
- **实施要点**:
  - Syncthing Docker Compose 一键部署
  - OpenClaw 写笔记 → Syncthing 同步 → Obsidian PC 实时看到
  - Obsidian MCP Server：OpenClaw 工具化操作笔记，支持自然语言查询
  - 示例 prompt：`Search my Obsidian vault for notes about "project alpha" from the last 30 days`
- **效果量化**: 双向同步 = OpenClaw 生产的输出自动进入知识库，零手动搬运

### 发现 #034
- **主题**: Advanced OpenClaw Power User 架构 — 多 Agent 系统设计
- **来源**: go.lightnode.com (Advanced OpenClaw Workflows, 2026)
- **核心数据**:
  - OpenClaw 部署到 VPS 后 = 持续运行的数字员工，不依赖 Mac Mini 开机
  - 多工具自动化链（Multi-Tool Chains）：OpenClaw 的真正威力
  - 分层架构：Monitor Agent（持续扫描信息源）+ Execute Agent（调用 API 执行）+ Report Agent（汇总输出）
  - OpenClaw + VPS = 夜间自动化不间断，不依赖本地机器
- **实施要点**:
  - OpenClaw 部署：`openclaw gateway start` 开机自启
  - Telegram/飞书作为统一消息接口
  - n8n 负责结构化执行，OpenClaw 负责推理决策
  - sessionTarget="isolated" 用于 cron job 隔离运行
- **效果量化**: 数字员工 24/7 在线，Mac Mini 可以 sleep，AI 工作不中断

### 发现 #035
- **主题**: OpenClaw 浏览器自动化 — 截图 + 摘要 + 推送完整链路
- **来源**: Hostinger Tutorials (2026)
- **核心数据**:
  - OpenClaw 浏览器技能：登录 → 打开正确页面 → 截图 → AI 分析 → 推送
  - 服务器健康监控示例：OpenClaw 截图监控面板 → AI 摘要 → 发 Slack/Discord
  - 私人口档助手：上传合同/报告 → 自然语言问答 → 本地 RAG（无数据外传）
  - 草稿回复生成：AI 起草，人类审核后再发送（避免自动发送风险）
- **实施要点**:
  - 命令链：`openclaw browser open <url>` → `openclaw browser snapshot --json` → AI 分析
  - 本地文档 RAG：Ollama + 向量数据库 + OpenClaw 语义搜索
  - 审核流程：AI 生成草稿 → 飞书通知 Jeremy → 确认后发送
- **效果量化**: 浏览器操作自动化节省大量人工操作；私人口档完全离线，数据零外传

### 发现 #036
- **主题**: 2026 本地 LLM Benchmark 汇总 — Tokens/sec 真实数据
- **来源**: LinkedIn | apxml.com (2026 最新)
- **核心数据**:
  - **Llama 3.3 8B Q4_K_M**：73.0 MMLU，约 6GB 内存，28–35 tok/s（M4 16GB）
  - **Mistral Small 3 7B Q4_K_M**：68.5 MMLU，50 tok/s（同档最快），3.5GB 内存
  - **Phi-4-mini**：最小可用模型，适合 8GB 机器，响应极快
  - **Ministral 3B/8B/14B**：2026 年新发布，专为 Apple Silicon 优化
  - 70B 模型：仅 M4 Pro 48GB+ 可行，Q4_K_M 约 40GB 占用
- **实施要点**:
  - M4 16GB 推荐：Mistral Small 3 7B（速度最优）或 Llama 3.3 8B（质量最优）
  - M4 Pro 24GB：可跑 8B + 16k 上下文
  - M4 Pro 48GB：70B Q4_K_M 可行，~$1,999 到位
- **效果量化**: Mistral Small 3 7B 50 tok/s = 打字级流畅交互体验

---

**【可建站】OpenClaw 多设备同步系统**: Syncthing + Obsidian vault 跨设备双向同步，OpenClaw 主机 ↔ 日常 PC 自动同步，零云依赖。

**【可建站】Home Assistant + UTM 虚拟化方案**: Mac Mini 上跑 UTM 虚拟机装 Home Assistant，$0 软件成本，性能远超树莓派，适合 HA 新手入门。

**【可建站】Mac Mini 全自动备份系统**: rsync Time Machine 风格脚本 + launchd 定时调度 + 外挂硬盘，实现增量快照备份，数据安全性对齐 Time Machine。

---

## 研究时间: 2026-03-28 17:30 UTC

### 发现 #054
- **主题**: OpenClaw 服务器备份策略 — 分层备份 + 恢复脚本
- **来源**: Tencent Cloud Techopedia (2026)
- **核心数据**:
  - 分层备份策略：实例级快照（快速全量恢复）+ 应用级备份（精细化还原）+ 异地复制（灾难恢复）
  - 备份清单：config/、dot-env、skills/、Docker volumes（对话历史、数据库）、TLS 证书
  - 保留策略：仅保留最近 14 天备份
  - 恢复三步走：解压备份 → 恢复配置 → 重启 OpenClaw
- **实施要点**:
  - 备份脚本（crontab 每日执行）：
    ```bash
    #!/bin/bash
    BACKUP_DIR="/backup/openclaw/$(date +%Y%m%d_%H%M%S)"
    mkdir "$BACKUP_DIR"
    cp -r ~/.openclaw/config "$BACKUP_DIR/"
    cp ~/.openclaw/dot-env "$BACKUP_DIR/"
    cp -r ~/.openclaw/skills "$BACKUP_DIR/"
    docker compose cp openclaw:/data/postgres "$BACKUP_DIR/postgres_data/"
    tar czf "$BACKUP_DIR/openclaw_data.tar.gz" -C /backup/openclaw "$(basename $BACKUP_DIR)"
    find /backup/openclaw -type d -mtime +14 -exec rm -rf {} \;
    ```
  - macOS Time Machine + 外置 HDD 组合实现物理备份
- **效果量化**: 14 天滚动备份，每天仅增量写入变更文件，恢复时间 < 5 分钟

### 发现 #055
- **主题**: OpenClaw 真实案例 — 物理世界物品目录 + 儿童内容策展 App
- **来源**: sidsaladi.substack "50+ OpenClaw Use Cases Part 2" (2026)
- **核心数据**:
  - **物理物品目录系统**：给房间拍照（玩具、工具、食材、办公设备）→ AI 自动构建可搜索分类目录
  - **儿童安全内容策展**：描述想要的内容类型 → coding agent 零代码构建无算法推荐、无广告、无自动播放的定制 App
  - **家庭教育 Agent 网络**：5 个专业 OpenClaw agents，分别跑在各自的 Mac Mini 上，管理 homeschool 课程、家庭财务、日程、开发项目和家务运营
  - **过夜 MVP 工厂**：睡前提交 App 需求 → 醒来查看生成的 MVP，完全自动化
- **实施要点**:
  - 物理目录：拍照 + OpenClaw 图像分析 + 结构化输出到 Obsidian/Notion
  - 儿童内容 App：OpenClaw coding agent 调用 Claude Code/_cursor 生成 React Native/Web app
  - 多 Mac Mini 分工：每个 agent 独立机器，避免内存争抢，稳定 24/7 运行
- **效果量化**: 物理目录省去"找不到东西"的搜索时间；儿童内容策展替代算法平台，保护专注力

### 发现 #056
- **主题**: OpenClaw 媒体服务器优化 — Mac Mini 影音中心
- **来源**: openclawn.com "Media Powerhouse: Optimizing OpenClaw Mac Mini" (2026)
- **核心数据**:
  - Mac Mini M4 Pro (Revision 3) 作为媒体服务器：同时跑 Plex/Jellyfin + OpenClaw + Ollama
  - 统一内存架构：媒体转码和 LLM 推理共用内存池，无 VRAM 瓶颈
  - 推荐配置：M4 Pro 48GB，媒体流 + 本地 LLM 双任务同时运行
  - 媒体自动化：OpenClaw 定时整理新下载媒体 → 重命名 + 归类 + 更新 Plex/Jellyfin 库
- **实施要点**:
  - Jellyfin（开源）替代 Plex，省订阅费
  - OpenClaw cron job：每周自动整理媒体库，清理无效文件
  - Tailscale 实现外网安全访问媒体库
- **效果量化**: 一台 Mac Mini 替代独立 NAS + AI 服务器，功耗合计 < 80W

### 发现 #057
- **主题**: OpenClaw 安全部署指南 — 控制爆炸半径
- **来源**: aminrj.com "How I Deployed OpenClaw as an AI Security Researcher" (2026)
- **核心数据**:
  - 安全部署核心原则：最小权限 + 隔离网络 + 监控告警
  - HomeKit 设备访问的安全顾虑：OpenClaw 本地运行有直接机器访问权限，与云 AI 沙盒不同
  - 社区成员建议：HomeKit 集成前先在独立测试环境验证
  - Docker 隔离：不同 agents 用不同容器，数据和权限隔离
  - TLS 证书 + API key 加密存储，不碰明文 dot-env
- **实施要点**:
  - HomeKit 安全 checklist：
    1. 独立 Mac Mini 或 VM 跑 Homebridge
    2. OpenClaw 通过 API 而非直接 socket 控制
    3. 日志审计：记录所有设备控制操作
    4. 网络隔离：HA/IoT 设备放独立 VLAN
- **效果量化**: 安全配置后，OpenClaw 作为家庭自动化控制中台，风险可控

### 发现 #058
- **主题**: 混合 AI Home Lab — Mac Mini + NVIDIA GPU 塔式 + 树莓派的分工架构
- **来源**: Plain English "Budget Optimized AI Home Lab" (2026)
- **核心数据**:
  - Mac Mini M4 16GB 作为"大脑"：协调调度 + 轻量推理 + Home Assistant
  - NVIDIA GPU 塔式服务器：大规模模型训练 + 图像/视频生成（Stable Diffusion、FLUX）
  - Raspberry Pi 400：常开边缘节点（传感器收集、简单自动化脚本）
  - 分工逻辑：Mac Mini 负责 orchestration，轻量任务；GPU 塔负责重计算；Pi 负责 24/7 感知层
- **实施要点**:
  - Mac Mini 通过 Tailscale/VPN 协调 GPU 塔式服务器
  - Raspberry Pi 运行 Home Assistant OS + Zigbee2MQTT
  - GPU 塔式按需唤醒（不需要 24/7 运行）
- **效果量化**: 按需使用 GPU 算力，Mac Mini 日常功耗 < 20W，GPU 塔仅任务时启动

### 发现 #059
- **主题**: Scaleway Cloud Mac Mini M4 — €0.22/小时云端 Apple Silicon
- **来源**: Scaleway (2026)
- **核心数据**:
  - Scaleway 提供云端 Mac Mini M4 按需租用，起步价 €0.22/小时
  - 用途：iOS 开发编译（Xcode）、跨平台测试、突发算力需求
  - 与自托管 Mac Mini 对比：适合偶发需求 vs 24/7 稳定运行
  - 云 Mac Mini 保留状态，可作为自托管方案的备份/扩展
- **实施要点**:
  - Scaleway 注册 + 选择 Apple Silicon 实例类型
  - 按小时计费，适合短期大规模测试
  - 配合 Scaleway Object Storage 做备份目标
- **效果量化**: €0.22/小时 vs 自购 Mac Mini €0.04/小时电费（但有硬件折旧）

### 发现 #060
- **主题**: Top 50 OpenClaw 用例排名 — 完整分类清单
- **来源**: o-mega.ai "Top 50 OpenClaw Use Cases 2026 Rankings" (2026)
- **核心数据**:
  - 用例分类：生产力、研究监控、营销自动化、内容策划、开发辅助、个人组织
  - 核心价值：AI 从"聊天工具"变成"自动化工作流"
  - AI agents 连接多工具，自动完成从研究→规划→创建→报告的完整链路
- **实施要点**:
  - ClawHub（clawhub.com）搜索获取完整用例列表
  - 飞书集成相关用例：消息分类、草稿生成、任务创建
  - Research monitoring（持续追踪竞品/行业动态）是最有价值用例之一
- **效果量化**: 用例数量说明 OpenClaw 生态已相当成熟

---

**【可建站】OpenClaw 物理物品目录系统**: 拍照即归档，AI 自动分类 + 可搜索目录，替代"东西放哪了"焦虑，特别适合工具间/厨房/儿童玩具管理。

**【可建站】Mac Mini 混合 AI Lab**: Mac Mini (协调层) + GPU 塔式 (重算力) + Pi 400 (感知层) 三层架构，按需调用，算力成本最优解。

---

## 研究时间: 2026-03-28 13:30 UTC (2026-03-28 06:30 PDT)

### 发现 #037
- **主题**: OpenClaw 完整特性解析 — 飞书/Telegram/Discord 多渠道集成
- **来源**: emergent.sh "What is OpenClaw?" (2026)
- **核心数据**:
  - OpenClaw 核心价值：**本地执行** = 数据不经过第三方，直接控制文件/脚本/环境
  - 支持渠道：Telegram、Discord、Slack、飞书（飞书集成通过 OpenClaw 扩展）
  - 工具集：shell 命令、文件系统操作、浏览器自动化、代码执行
  - 隐私模型：所有数据留在本地机器，适合处理敏感信息
- **实施要点**:
  - 与飞书集成：配置飞书机器人 token → 连接到 OpenClaw gateway
  - OpenClaw 作为持久层：每次对话基于完整上下文（memory）
  - Skills 扩展：GitHub 上 thousands of skills 可直接安装使用

### 发现 #038
- **主题**: 2026 年 Mac Mini M4 必备生产力 App 清单
- **来源**: Mailbird Best Apps for Mac Mini M4 (2026) | TechRadar Apple Silicon Apps
- **核心数据**:
  - Mailbird：统一邮件管理，整合多个 inbox
  - Raycast：Alfred 替代品，All-In-One Hub（窗口管理/剪贴板/代码片段）
  - Swish：手势控制窗口，触控板体验升级
  - 1Password：密码管理 + SSH key 管理
  - Trello/Notion：项目管理
  - **M4 Apple Silicon 优化**：Zoom 原生支持（无需 Rosetta），Office 套件原生 ARM 版本
- **实施要点**:
  - Raycast 是 OpenClaw 的好搭档：Raycast 处理即时搜索，OpenClaw 处理深度任务
  - Mac Mini M4 架构优势：多 productivity apps 同时运行无 thermal throttling
  - 建议组合：Raycast + 1Password + Obsidian + Home Assistant（Mac Mini 性能全覆盖）

### 发现 #039
- **主题**: OpenClaw 5 大核心用例 — 24/7 AI 助手真正能做什么
- **来源**: snackprompt.com "5 OpenClaw Use Cases" (2026)
- **核心数据**:
  - **Daily Memory Tracking**：构建可搜索日记，持续改进 OpenClaw 的记忆和上下文
  - **Vibe Coding**：无代码构建自定义 micro-apps，直接满足工作流需求
  - **Overnight Task Execution**：预约过夜任务执行，睡觉时 AI 也在工作
  - **Multi-Agent Orchestration**：多个专业 agents 分工协作
  - **CRM/Lead Management**：自动研究潜客 → 找 LinkedIn → 定制方案 → 发邮件 → 记录 CRM
- **实施要点**:
  - Daily Memory prompt 示例：`"Every evening, summarize our key decisions and add them to memory file"`
  - Overnight 执行：睡前提交任务 → 醒来查看结果，完全自动化
  - Vibe Coding：描述需求 → AI 生成 micro-app → 直接使用

### 发现 #040
- **主题**: OpenClaw 真实用户案例 — 从 Lead 管理到社交媒体运营
- **来源**: aiblewmymind.substack "OpenClaw Use Cases" (2026)
- **核心数据**:
  - Lead 管理完整链路：表单填写 → 研究公司 → 找 LinkedIn → 拉取案例 → 生成定制提案 → 发邮件 → 5 分钟内完成 → CRM 记录 → Slack 通知
  - 社交媒体运营：保持活跃 → 更新网站 → 发布案例研究 → 草稿跟进
  - **飞书集成场景**：OpenClaw 可以通过飞书机器人接收指令并执行
- **实施要点**:
  - OpenClaw 作为"第二大脑"：主动监控信息源，被动等待指令
  - 这套 lead 管理 workflow 如果实现，每月可节省 20+ 小时
  - 关键：OpenClaw 不是回答问题的工具，而是主动执行任务的数字员工

### 发现 #041
- **主题**: OpenClaw 作为个人 AI Assistant — 从安装到生产环境
- **来源**: towardsdatascience.com "Use OpenClaw to Make a Personal AI Assistant" (2026)
- **核心数据**:
  - OpenClaw 本质：无限期运行 Claude Code，将 AI 变成持久个人助手
  - 安装路径：`brew install openclaw` → `openclaw configure`
  - 个性化配置：SOUL.md + IDENTITY.md + AGENTS.md（定义 AI 角色）
  - **Skills 系统**：安装 skills 扩展 AI 能力（GitHub 上 hundreds of skills）
  - Docker 隔离：建议不同 agents 用不同 Docker 容器，数据隔离
- **实施要点**:
  - 推荐 skills 清单：browser、filesystem、code-interpreter、github
  - OpenClaw + Claude Code 订阅 = 免费（只需 Claude 订阅费）
  - 个性化三件套：SOUL.md（灵魂）+ IDENTITY.md（身份）+ AGENTS.md（工作区定义）

### 发现 #042
- **主题**: OpenClaw 25 个自动化用例 — 邮件草稿/健康监控/文档 RAG
- **来源**: Hostinger Tutorials "OpenClaw 25 Use Cases" (2026)
- **核心数据**:
  - 邮件草稿生成：AI 生成草稿 → 人工审核 → 发送（避免风险）
  - 服务器健康监控：截图 → AI 分析 → 推送 Slack/Discord
  - **私人口档助手**：上传合同/报告 → Ollama 本地 RAG → 自然语言问答
  - 视频剪辑 pipeline：OpenClaw 自动化视频素材整理 + 字幕生成
  - 竞品监控：定时抓取网站 → AI 摘要 → 告警重大变化
- **实施要点**:
  - 私人口档方案：Ollama + 本地向量数据库 + OpenClaw 语义搜索
  - 浏览器自动化链：`openclaw browser open` → `snapshot` → AI 分析
  - 本地 RAG 完全离线，数据零外传，适合处理敏感文档

### 发现 #043
- **主题**: Open WebUI + Ollama — Mac Mini M4 本地 ChatGPT 替代品
- **来源**: YouTube "SETUP Ollama AND Open WEBUI ON YOUR Mac Mini M4" (JSG Prime, Jan 2025)
- **核心数据**:
  - Open WebUI：开源 Web 界面，类似 ChatGPT，完全本地部署
  - 支持模型切换、对话历史、多用户（可选）
  - 完整步骤：安装 Homebrew → Miniforge (Conda) → Open WebUI → 下载模型
  - 推荐模型：Llama 3.2 3B（轻量入门）或 Mistral Small 3 7B（性能更优）
- **实施要点**:
  - 命令序列：
    ```bash
    # 安装 Homebrew
    /bin/bash -c "$(curl -fsSL https://brew.sh/install.sh)"
    # 安装 Miniforge
    bash Miniforge3-MacOSX-arm64.sh
    # 创建 conda 环境并安装 Open WebUI
    conda create -n open-webui python=3.12
    conda activate open-webui
    pip install open-webui
    # 下载模型
    ollama pull llama3.2:3b
    # 启动
    open-webui serve
    ```
  - 访问 `http://localhost:8080` 打开界面
  - Open WebUI + OpenClaw 互补：WebUI 做日常对话，OpenClaw 做深度任务

### 发现 #044
- **主题**: Obsidian 2026 必备插件 Top 10 — 知识管理终极工具链
- **来源**: obsibrain.com "Top Obsidian Plugins 2026" | dsebastien.net (2026)
- **核心数据**:
  - **Calendar**：月视图 + 每日笔记导航，事实标准的日记入口
  - **Tasks**：任务管理，语法 `[] `，支持日期/优先级/循环
  - **Periodic Notes**：按日/周/月生成模板化笔记
  - **Dataview**：类 SQL 查询 vault 数据，构建动态视图
  - **Templater/Button**：模板系统 + 快捷按钮，自动化笔记创建
  - **Homepage**：定义启动默认工作区，提升打开即专注体验
- **实施要点**:
  - 推荐组合：Calendar + Tasks + Periodic Notes + Dataview = 完整日记+任务系统
  - Dataview 示例 query：`TASK FROM "tasks" WHERE due = date(today)`
  - Templater 模板示例：自动插入当前日期/时间/天气/回顾问题
  - 安装前备份 vault：Tag Wrangler/Linter 会修改笔记内容

### 发现 #045
- **主题**: Miniflux + n8n + Ollama — RSS AI 摘要完整 Pipeline
- **来源**: christiano.dev | n8n 官方集成 (2026)
- **核心数据**:
  - Miniflux API：`GET /v1/entries?limit=10&status=unread` 获取未读条目
  - n8n workflow：RSS 定时抓取 → HTTP Request (Ollama API) → AI 摘要 → 飞书/Discord 推送
  - 推荐 prompt：`Summarize in 3 bullet points with key takeaways`
  - 用户报告：RSS + AI 摘要完全替代 Twitter/算法社交媒体信息源
- **实施要点**:
  - Miniflux Docker 部署：
    ```bash
    docker run -d \
      --name miniflux \
      -p 80:8080 \
      -e DATABASE_URL=postgres://miniflux:secret@localhost/miniflux \
      miniflux/miniflux
    ```
  - n8n workflow：RSS Read → HTTP Request (Ollama) → IF (重要) → Send Message
  - 推送频率：每日 1-2 次（早间 + 午后）避免信息过载
- **效果量化**: 完全替代社交媒体算法推送，信息质量可主观控制

### 发现 #046
- **主题**: n8n Self-Hosted vs Cloud — 2026 年成本对比完整分析
- **来源**: n8nlab.io "n8n Cloud vs Self-Hosted" (2026)
- **核心数据**:
  - n8n Cloud：省心但数据在第三方，月费 $20–99
  - Self-Hosted DIY：免费软件 + 硬件/运维成本，DevOps 工程师 $150/hr × 10h/月 = $13,000/年
  - **Self-Hosted Managed**：专业团队托管，$200–500/月，省心 + 数据控制
  - Mac Mini + Self-Hosted n8n = 最低 TCO（DevOps 成本仅电费）
  - Self-Hosted 适合：AI-native 企业 + 敏感数据 + 深度系统集成
- **实施要点**:
  - Mac Mini 自托管 n8n：Docker 一键部署，`docker pull n8nio/n8n`
  - 生产环境建议：PostgreSQL 外挂数据库 + Redis 缓存
  - 如果不想运维，n8n Cloud 是合理选择（省心 > 省钱）

### 发现 #047
- **主题**: Home Assistant on Mac Mini — 2026 最新方案对比
- **来源**: community.home-assistant.io "From Pi to Powerhouse" (2026)
- **核心数据**:
  - Mac Mini M4 Pro：Advanced HA Automations，每几秒执行 CPU 密集型自动化
  - HA 2026.3+：Area Automations + IR Control 重大更新
  - HA 支持本地执行：无需云端，24/7 稳定性极佳
  - UTM 虚拟化方案：Home Assistant OS 在 ARM64 虚拟机内运行
- **实施要点**:
  - HA OS on UTM：分配 2–4 核 + 4GB RAM + 32GB 存储
  - HA Core 直接跑 macOS：更轻量，不需要完整 VM
  - Home Assistant + OpenClaw 集成：通过本地 API/MQTT 通信
  - HA 2026.4 更新：Area-based automations 更直观，IR Control 支持更多设备

## 研究时间: 2026-03-28 15:30 UTC

### 发现 #048
- **主题**: Mac Mini M4 2026 本地 AI 选购指南 — 配置对比全面解析
- **来源**: Starmorph Blog "Best Mac Mini for Running Local LLMs and OpenClaw" (2026)
- **核心数据**:
  - **16GB M4（$599）**：运行 7B–8B 模型（Q4_K_M 量化），适合轻量本地 LLM + OpenClaw 日常任务
  - **24GB M4（$799）**：可跑 13B 模型（如 Mistral 13B Q5），多任务更稳
  - **48GB M4 Pro（$1,299）**：可跑 70B 模型（Llama 3.1 70B Q4_K_M），双模型 setup（Qwen3-Coder-32B + GLM-4.7-Flash）= 零云端配置
  - **64GB M4 Pro**：最佳"全本地"方案，两台 32GB Mac Mini 可分布式跑 70B 模型
  - OpenClaw + 云端 API 每月费用：$30–100/月；全本地 = 仅硬件成本
- **实施要点**:
  - 24GB 是 OpenClaw + 轻量 LLM 的最低推荐（不是 16GB！）
  - Ollama 模型选择：4GB 以下（Qwen2.5-3B、Phi-3-mini）= macOS 稳定性最好
  - 避免在 16GB 机型上同时跑 macOS + 8B 模型 + 扩展上下文，会 freeze

### 发现 #049
- **主题**: OpenClaw vs n8n vs Zapier — 工作流自动化的本质区别
- **来源**: VPSBG.eu "Meet OpenClaw - A Revolution in AI Workflow Automation" (2026)
- **核心数据**:
  - **n8n/Zapier**：基于预定义规则的可视化工作流，需手动配置节点和触发条件
  - **OpenClaw**：自然语言驱动，理解上下文和任务优先级，动态决策
  - OpenClaw 是真正的 AI Agent（理解目标），n8n 是状态机（执行固定流程）
  - OpenClaw 支持 self-hosted，数据留在本地基础设施，不经过第三方
  - n8n + OpenClaw 可以互补：n8n 做结构化数据 pipeline，OpenClaw 做智能决策层
- **实施要点**:
  - 推荐架构：n8n 负责定时数据同步（RSS → 数据库），OpenClaw 负责 AI 分析和决策
  - OpenClaw self-hosted on Mac Mini：隐私优先，数据永不离开本地网络
  - 典型组合：Miniflux（RSS）→ n8n（数据清洗）→ OpenClaw（AI 摘要）→ 飞书推送

### 发现 #050
- **主题**: Mac Mini M4 + OpenClaw 私人文档 RAG 助手 — 完全本地化
- **来源**: Hostinger Tutorials "OpenClaw 25 Use Cases" (2026)
- **核心数据**:
  - 上传合同/报告/参考材料 → Ollama 本地向量数据库 → 自然语言问答
  - 完全离线，数据零外传，适合处理敏感商业文档
  - 浏览器自动化链：`openclaw browser open` → snapshot → AI 分析
  - 服务器健康监控：截图 → AI 分析 → 推送 Slack/Discord
- **实施要点**:
  - 本地 RAG 方案：Ollama（模型）+ Qdrant/Chroma（向量数据库）+ OpenClaw（查询接口）
  - Docker Compose 一键部署完整 stack
  - 对比云端 ChatGPT：隐私差距巨大，但需要额外运维成本

### 发现 #051
- **主题**: Mac Mini M4 家庭服务器实战 — AdGuard + Homebridge + HA
- **来源**: stealthpuppy.com "A Mac mini as a home server" (2026)
- **核心数据**:
  - Mac Mini M4 Pro 作为家庭服务器：AdGuard Home（DNS 广告拦截）+ Homebridge（桥接 HomeKit）+ UniFi Controller
  - UTM 虚拟化方案：Home Assistant OS 在 ARM64 VM 内运行，分配 2–4 核 + 4GB RAM
  - HA Core 直接跑 macOS 更轻量，不需要完整 VM
  - HA 2026.3+：Area Automations + IR Control 重大更新
  - Mac Mini 功耗低、安静、24/7 运行成本低
- **实施要点**:
  - AdGuard Home：所有设备 DNS 流量统一拦截广告，保护隐私
  - Homebridge：让非 HomeKit 设备（小米、飞利浦 Hue）接入 Apple Home
  - OpenClaw 作为 HA 的智能层：通过 MQTT/本地 API 与 HA 通信

### 发现 #052
- **主题**: OpenClaw 晨间简报自动化 — Gmail Label → WhatsApp 推送
- **来源**: devshorts.in "OpenClaw Workflow and Automation Developer Guide" (2026)
- **核心数据**:
  - OpenClaw cron job 定时读取 Gmail label（如 "AI digest"）→ 摘要 → 推送到 WhatsApp
  - 命令：`openclaw cron add --name "Daily AI digest" --session isolated --cron "0 10 * * *" --tz "Asia/Kolkata"`
  - `openclaw gateway status` 检查服务状态
  - `openclaw cron run <job-id>` 手动触发测试
- **实施要点**:
  - gog CLI 用于 Gmail 读取
  - 推荐时区：设置与用户本地时区一致（如 America/Vancouver）
  - 发送频率：每日早间（10:00 AM），避免深夜推送打扰

### 发现 #053
- **主题**: "Mac Mini 变成全职 AI 员工" — Clawdbot 实战案例
- **来源**: 0xSojalSec Facebook post + YouTube (2026)
- **核心数据**:
  - Clawdbot = OpenClaw alias，运行在 Mac Mini 上的个人 AI agent
  - 处理业务范围：研究、笔记整理、日历管理 — 完全本地，成本仅电费
  - 12 分钟视频演示：AI 自动完成完整工作任务流
  - 结论：Mac Mini + OpenClaw = 最低成本"AI 员工"方案
- **实施要点**:
  - 与其买 Claude Pro/月，Mac Mini + OpenClaw 一次性投入，长期零订阅
  - 适合：个人创业者、小团队、高隐私需求用户
  - 关键：需要正确配置 SOUL.md + AGENTS.md 定义 AI 角色

---

**【可建站】Mac Mini + OpenClaw 零月租 AI 助手站**: 完整本地 AI 工作站搭建指南，涵盖 Ollama + OpenClaw + n8n + Home Assistant 全家桶，TCO vs 订阅制对比。

**【可建站】OpenClaw 全业务栈监控**: 多目录结构 + cron jobs 定时抓取 + AI 分析，被动信息收集 + 主动告警，适合个人知识管理和竞品监控。

## 研究时间: 2026-03-29 01:30 UTC

### 发现 #054
- **主题**: OpenClaw Lobster 工作流引擎 — YAML 驱动的本地自动化
- **来源**: QuantumByte "How People Use OpenClaw Workflows in 2026" (2026) + [GitHub openclaw/lobster](https://github.com/openclaw/lobster)
- **核心数据**:
  - Lobster 是 OpenClaw 原生工作流工具，描述为"typed, local-first workflow shell and macro engine"
  - 支持 YAML/JSON 格式：定义 steps、environment variables、conditions、approval gates
  - 用法示例：`node bin/lobster.js "workflows.run --name github.pr.monitor --args-json '{...}'"`
  - GitHub PR 监控工作流可自动追踪 PR 状态变化（author、state、reviewDecision 等）
  - 适用场景：重复性多步骤自动化，特别是涉及本地文件、脚本、私有上下文的工作流
- **实施要点**:
  - 工作流文件放在 `~/.openclaw/workflows/` 目录
  - 内置 approval gates 实现人工审批节点，适合财务/敏感操作
  - 可与 cron job 结合，实现定时执行复杂工作流
- **效果量化**: 本地执行，无 API 延迟，隐私完全自控

### 发现 #055
- **主题**: Awesome OpenClaw Use Cases — 27.8k Stars 社区工作流宝库
- **来源**: [GitHub hesamsheikh/awesome-openclaw-usecases](https://github.com/hesamsheikh/awesome-openclaw-usecases)
- **核心数据**:
  - **27,800+ GitHub stars**，2,300+ forks，业界最大的 OpenClaw 用例开源集合
  - 涵盖分类：社交媒体、内容创作、播客生产 Pipeline、个人 CRM、动态仪表盘、研究与学习、金融与交易、基础设施与 DevOps
  - **Podcasting Pipeline**：自动完成来宾研究、节目大纲、节目笔记、社媒推广
  - **Personal CRM**：自动从邮件/日历发现并追踪联系人，支持自然语言查询
  - **Dynamic Dashboard**：并行从 API、数据库、社媒获取数据，实时仪表盘
  - **Market Research & Product Factory**：挖掘 Reddit/X 真实痛点，结合 Last 30 Days skill，自动构建 MVP
  - **HF Papers Research Discovery**：从 Hugging Face 发现趋势 ML 论文，按 upvotes 排序，自动 arXiv 深度阅读
- **实施要点**:
  - 每个用例均为独立 Markdown 文件，含完整步骤和代码
  - 社区驱动，持续更新，所有用例均为真实生产环境验证
  - 推荐路径：先从 Personal CRM 或 Daily Briefing 入手，再扩展到复杂 Pipeline
- **效果量化**: 500+ 可用工作流，涵盖个人到企业级场景

### 发现 #056
- **主题**: Ollama vs vLLM 性能基准 — Mac Mini M4 单用户推理最优选
- **来源**: SitePoint "Ollama vs vLLM: Performance Benchmark 2026" (2026)
- **核心数据**:
  - **单用户场景**：Ollama TTFT（首 token 时间）~45ms，vLLM ~82ms（Llama 3.1 8B）
  - **并发 50 用户**：vLLM 吞吐量 ~840 tok/s，Ollama ~142 tok/s（差异巨大）
  - **单用户 p99 延迟**：Ollama 4.3s vs vLLM 3.8s（256-token 生成，几乎相同）
  - **内存占用**：Ollama（Q4_K_M 量化）仅 ~5.2GB VRAM，vLLM（FP16）需要 ~16.1GB
  - **结论**：Mac Mini M4（16-24GB RAM）单用户本地推理，Ollama 完胜；多用户服务器选 vLLM
- **实施要点**:
  - Mac Mini M4 16GB 用户：Ollama + Q4_K_M 量化模型，内存效率最优
  - 推荐模型：Llama 3.3 8B Q4_K_M（~6GB）或 Mistral Small 3（50 tok/s 推理速度）
  - Ollama 简单命令：`ollama pull llama3.3:8b` + `ollama serve`
- **效果量化**: Ollama 单用户推理 TTFT ~45ms，内存占用比 vLLM FP16 少 68%

### 发现 #057
- **主题**: $5 VPS 部署 OpenClaw — 4 分钟安装，月成本从 $200 降至 $15
- **来源**: Medium @rentierdigital "Anthropic just killed my $200/mo OpenClaw setup, so I rebuilt it for $15" (2026)
- **核心数据**:
  - 个人用 OpenClaw 在 $5/月 VPS（1GB RAM）上运行，成本从 Anthropic $200/月骤降至 $15/月
  - 部署步骤：购买 VPS → SSH 登录 → 运行安装脚本 → 配置 API key → 完成
  - 推荐 $15/月方案：2GB RAM + 2vCPU，跑 OpenClaw + Ollama + 向量数据库足够
  - Anthropic 定价调整后（Opus $5/M input），重度用户月账单可达 $200+，本地/VPS 方案凸显成本优势
  - Mac Mini + OpenClaw = $0 月租（仅电费），最低总拥有成本（TCO）
- **实施要点**:
  - $5 VPS 限制：1GB RAM 只能跑轻量模型（如 phi:3.8b），无法跑 7B 以上模型
  - 推荐 $15 VPS（Contabo、Hostinger）：2GB RAM，跑 Ollama + 7B Q4 模型
  - Mac Mini 适合固定地点用户；VPS 适合需要随时访问的移动用户
- **效果量化**: 月成本从 $200 降至 $15（节省 92.5%），Mac Mini 仅电费（~$3-5/月）

### 发现 #058
- **主题**: OpenClaw vs n8n vs Zapier — 决策框架与互补架构
- **来源**: VPSBG.eu "Meet OpenClaw - A Revolution in AI Workflow Automation" (2026)
- **核心数据**:
  - **n8n/Zapier**：基于预定义规则的可视化工作流引擎，状态机模式，需手动配置节点和触发器
  - **OpenClaw**：自然语言驱动的 AI Agent，理解上下文和任务优先级，动态决策
  - OpenClaw 是真正的 AI Agent（理解目标），n8n 是状态机（执行固定流程）
  - OpenClaw 支持完全本地部署，数据不经过第三方；n8n 也支持自托管但配置复杂
  - **最佳互补架构**：n8n 负责结构化数据 Pipeline（定时同步、定时抓取），OpenClaw 负责 AI 分析和决策层
- **实施要点**:
  - 典型 Stack：Miniflux（RSS）→ n8n（数据清洗入库）→ OpenClaw（AI 摘要）→ 飞书推送
  - n8n 自托管：`docker run -d --name n8n -p 5678:5678 n8nio/n8n`
  - OpenClaw 自托管：Mac Mini 上常驻运行，n8n 通过 webhook 触发 OpenClaw 任务
- **效果量化**: 架构组合后，结构化数据处理（n8n）+ 智能决策（OpenClaw），覆盖 95% 自动化场景
