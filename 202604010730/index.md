# Obsidian + AI 双脑：Mac Mini 上的本地知识管理方案

> 将你的 Obsidian 笔记库变成 AI 可访问的知识图谱，让 OpenClaw 直接基于你的笔记工作。

## 概述

在 Mac Mini M4 上，用 Obsidian 作为知识库，用 OpenClaw 作为 AI 推理引擎，两者通过 MCP (Model Context Protocol) 协议连接。AI 可以读取、搜索、关联你的所有笔记——完全本地运行，数据不离开设备。

## 标签

AI助手 / PKM / Obsidian / OpenClaw / MCP / 知识管理 / 本地优先 / 可建站

## 核心价值

- **个人知识管理开销从 30-40% 降至 <10%**（真实用户数据）
- **完全本地**：笔记数据留在 Mac Mini，不上传任何云服务
- **AI 主动关联**：不只是搜索，而是跨笔记推理和联想
- **成本为零**：无需 Notion AI 等订阅服务

## 真实案例

### 案例 1：Eric J. Ma 的十二人团队 PKM 系统

**来源**: [Mastering Personal Knowledge Management with Obsidian and AI — Eric J. Ma Blog (2026-03-06)](https://ericmjl.github.io/blog/2026/3/6/mastering-personal-knowledge-management-with-obsidian-and-ai/)

Eric J. Ma 管理 12 人、两个团队，每个团队同时处理 2-4 个项目。他用 Obsidian + AI 编码 agent 进行个人知识管理，将知识管理开销从 **30-40% 降低到 <10%**。核心设计：
- 选择纯文本 Markdown 格式（不被供应商绑定，天然适配 AI）
- 构建结构化笔记类型（项目笔记、会议笔记、决策日志）
- 将工作流编码为 AI agent skills
- AI agent 直接读取笔记上下文，不只是问答

### 案例 2：Obsidian Graph MCP Server — 语义图谱导航

**来源**: [Obsidian Graph MCP Server — GitHub (drewburchfield)](https://github.com/drewburchfield/obsidian-graph-mcp)

开源 MCP Server，将 Obsidian 笔记图谱暴露给 AI 模型做语义搜索和导航：
- 使用 1024 维语义向量表示笔记和关系
- AI agent 可以语义搜索"与 X 相关的笔记"
- 支持直接查询特定人物的关联笔记、项目背景
- 架构：Obsidian Vault → MCP Server → Claude Code/OpenClaw

### 案例 3：Claude Code + MCP + Obsidian 全本地 AI 研究助手

**来源**: [Obsidian AI Second Brain: Complete Guide 2026 — NxCode](https://www.nxcode.io/resources/news/obsidian-ai-second-brain-complete-guide-2026)

完整的工作流示例：
```
Obsidian Vault → MCP Server → OpenClaw (本地 AI agent)
                           → Claude Code (编码任务)
                           → Smart Connections (RAG 搜索)
```

推荐插件和工作流：
- **Smart Connections**：Vault 级别 RAG，AI 可聊整个笔记库
- **Claude Code + MCP**：命令行级 agent，可读/搜/创/改笔记
- **Obsidian Graph MCP**：语义图谱导航，非关键词关联发现

## 架构图

```
┌─────────────────────────────────────────────────────────┐
│  Mac Mini M4 (本地运行，所有数据不离开设备)               │
│                                                         │
│  ┌──────────────┐    MCP 协议    ┌──────────────────┐  │
│  │  Obsidian    │ ←────────────→ │  OpenClaw         │  │
│  │  笔记库       │                │  AI Agent        │  │
│  │  (.md 文件)   │                │                  │  │
│  └──────────────┘                └──────────────────┘  │
│         ↑                                     ↓         │
│         │              ┌──────────────────┐  ↓         │
│         └─────────────→│  Ollama           │  搜索/   │
│                        │  (本地 LLM, 可选)  │  推理    │
│                        └──────────────────┘            │
└─────────────────────────────────────────────────────────┘
```

## 实施步骤

### 第一步：安装 Obsidian（免费）

```bash
# macOS 安装 Obsidian
brew install --cask obsidian
# 或从官网下载：https://obsidian.md
```

### 第二步：配置 Obsidian 本地保险库

1. 创建专用笔记保险库（建议与 iCloud/OneDrive 同步备份）
2. 建立结构化文件夹：
   ```
   Vault/
   ├── 0-Inbox/        # 收集箱，快速记录
   ├── 1-Projects/     # 项目笔记
   ├── 2-Meetings/     # 会议记录
   ├── 3-People/       # 人物笔记（同事、联系人）
   ├── 4-Notes/        # 永久笔记（Zettelkasten 风格）
   └── 5-Archive/      # 归档
   ```

### 第三步：安装 Smart Connections 插件（免费，RAG 搜索）

1. Obsidian → Settings → Community Plugins → 开启
2. 搜索 "Smart Connections" → Install
3. 配置使用本地 Ollama 模型（或云端 API）
4. 在侧边栏可直接对话整个 Vault

### 第四步：部署 Obsidian Graph MCP Server

```bash
# 安装 Node.js（如果没有）
brew install node

# 克隆 Obsidian Graph MCP Server
git clone https://github.com/drewburchfield/obsidian-graph-mcp.git
cd obsidian-graph-mcp
npm install

# 配置 MCP Server 路径（在 Claude Code 或 OpenClaw 配置中）
# OpenClaw 配置示例：
# 在 ~/.openclaw/config.json 添加：
{
  "mcpServers": {
    "obsidian": {
      "command": "/path/to/obsidian-graph-mcp/bin/mcp-server",
      "args": ["--vault", "/Users/jeremy/Vault"]
    }
  }
}
```

### 第五步：在 OpenClaw 中连接知识库

```
# 在 OpenClaw SOUL.md 或 memory/ 中添加知识库上下文
# 例如设置知识库路径：
export OBSIDIAN_VAULT="/Users/jeremy/Vault"

# 让 OpenClaw 知道你有什么知识资产
# 在 memory/ 目录下存放知识库索引的说明文件
```

### 第六步：验证连接

```bash
# 测试 MCP Server 是否工作
# 在 OpenClaw 中输入：
"搜索我关于 Mac Mini 的所有笔记"

# 应该返回语义相关的笔记列表，而非关键词匹配
```

## 效果量化数据

| 指标 | 传统方式 | Obsidian + AI 方案 | 改善 |
|------|---------|-------------------|------|
| 知识管理耗时/天 | 30-40% 工作时间 | <10% 工作时间 | **-75%** |
| 笔记查找时间 | 数分钟～数小时 | 秒级语义搜索 | **快 10x+** |
| 跨笔记关联发现 | 几乎不可能 | AI 自动关联 | **新洞察** |
| 工具订阅费 | $8-20/月 (Notion AI等) | $0 | **-100%** |
| 数据隐私 | 第三方服务器 | 完全本地 | **100%** |

> 数据来源：[Eric J. Ma Blog](https://ericmjl.github.io/blog/2026/3/6/mastering-personal-knowledge-management-with-obsidian-and-ai/) 实际用户经验

## 推荐笔记工作流（结合 OpenClaw）

### 每日开门三件事
1. **收集**：用 Obsidian Quick Capture 记录当日想法
2. **AI 摘要**：OpenClaw 晨间阅读你的笔记，给出今日优先事项
3. **关联**：AI 自动发现新笔记与旧笔记的潜在联系

### 项目工作流
1. 项目启动 → 创建项目笔记模板（AI 辅助生成）
2. 过程中 → OpenClaw 实时记录决策到项目笔记
3. 复盘时 → AI 搜索全项目笔记生成总结报告

## 硬件推荐

| Mac Mini 配置 | 适合场景 | 本地 LLM 能力 |
|-------------|---------|--------------|
| **M4 16GB** | 云 API + Obsidian AI | 7B Q4 模型流畅 |
| **M4 24GB** | 云 API + 本地 embeddings | 7B-13B Q4 模型流畅 |
| **M4 Pro 48GB** | 全本地 AI（推荐） | 32B-70B Q4 模型流畅 |

> 推荐 M4 Pro 48GB 以上配置，真正实现全本地 AI 知识管理，无需任何云 API 依赖。

## 替代方案对比

| 方案 | 费用 | 数据位置 | AI 能力 | 适合人群 |
|------|------|---------|--------|---------|
| Notion AI | $8-20/月 | 云端 | 好 | 团队协作优先 |
| Obsidian + Cloud | 免费+同步费 | 云端 | 中 | 已有 Obsidian 习惯 |
| **Obsidian + OpenClaw + MCP** | **$0** | **完全本地** | **强** | **隐私优先、性能优先** |
| Apple Notes + AI | 免费 | iCloud | 弱 | 轻度用户 |

## 相关工具

- [Obsidian](https://obsidian.md) — 本地优先笔记软件
- [Smart Connections](https://smartconnections.app) — Obsidian RAG AI 插件
- [Obsidian Graph MCP Server](https://github.com/drewburchfield/obsidian-graph-mcp) — MCP 协议连接
- [OpenClaw](https://openclaw.com) — 本地 AI Agent 引擎
- [Ollama](https://ollama.com) — 本地 LLM 运行时

---

*最后更新：2026-04-01 | 来源收集于 2026-04-01 调研轮次*
