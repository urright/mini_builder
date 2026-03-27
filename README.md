# Mini Builder

> 为 Mac Mini M4（基础款 16G+256G）挖掘最大价值的增效方案库

## 🎯 项目目标

为 Mac Mini M4 基础款用户提供真实、可落地、效果可量化的增效方案。每方案包含：

- ✅ 真实案例（带具体数据和效果）
- ✅ 准确实施细节（命令、配置、步骤）
- ✅ 使用指导（日常场景、最佳实践）
- ✅ 效果量化（时间节省、效率提升、成本对比）

## 🍎 硬件环境

- **设备**: Mac Mini M4 基础款
- **CPU**: Apple M4 (10-core)
- **内存**: 16GB Unified Memory
- **硬盘**: 256GB SSD
- **系统**: macOS
- **AI助手**: OpenClaw + Lark 飞书

## 📁 网站结构

```
mini_builder/
├── index.html                    # 主页（方案索引）
├── solutions/                    # 各方案详情页
│   ├── local-llm-ollama.html    # 本地 LLM 方案
│   ├── openclaw-productivity.html # OpenClaw 个人助手
│   ├── home-assistant.html       # 智能家居中枢
│   ├── obsidian-second-brain.html # 第二大脑
│   ├── rss-information-diet.html  # RSS 信息节食
│   ├── n8n-workflow-automation.html # n8n 工作流
│   └── rsync-backup.html        # 增量备份
└── README.md                    # 本文档
```

## 📦 当前方案 (v1.0)

### AI & 本地大模型
| 方案 | 标签 | 核心效果 |
|------|------|---------|
| [本地 LLM (Ollama)](solutions/local-llm-ollama.html) | 🔥 热门 | 20+ tok/s, $0 订阅 |
| [OpenClaw 个人助手](solutions/openclaw-productivity-assistant.html) | ⭐ 必备 | +3h/天, 60% 自动化 |

### 自动化工作流
| 方案 | 标签 | 核心效果 |
|------|------|---------|
| [Home Assistant](solutions/home-assistant-smart-home.html) | 🏠 家居 | 100+ 设备支持 |
| [n8n 工作流](solutions/n8n-workflow-automation.html) | 🚀 新增 | 400+ 集成, 省 90% |

### 知识与信息管理
| 方案 | 标签 | 核心效果 |
|------|------|---------|
| [Obsidian 第二大脑](solutions/obsidian-second-brain.html) | 🧠 知识 | 300% 记忆留存 |
| [RSS 信息节食](solutions/rss-information-diet.html) | 📖 阅读 | -50% 无效阅读 |

### 数据备份与安全
| 方案 | 标签 | 核心效果 |
|------|------|---------|
| [rsync 增量备份](solutions/rsync-time-machine.html) | 💾 备份 | MB 级增量, 版本快照 |

## 🔄 更新机制

- **自动更新**: 每 2 小时全网搜索最新方案
- **手动提交**: 通过 Git 推送更新
- **持续迭代**: 根据用户反馈不断优化方案

## 🚀 使用方法

### 本地预览

```bash
# 方式1: 直接打开
open index.html

# 方式2: Python 服务器
cd mini_builder
python3 -m http.server 8080
# 访问 http://localhost:8080
```

### 添加新方案

1. 在 `solutions/` 目录创建新的 HTML 文件
2. 参考现有方案的格式和结构
3. 更新 `index.html` 添加索引卡片

## 📝 方案贡献格式

```markdown
## 方案名称

### 📊 效果量化
- 指标1: 数值/描述
- 指标2: 数值/描述

### 📋 真实案例
> 案例描述 (来源)

### 🔧 实施方案
1. 步骤1
2. 步骤2

### 📖 使用指南
- 场景1
- 场景2

### ✨ 方案优势
- 优势1
- 优势2
```

## 🔗 相关资源

- [OpenClaw 官网](https://openclaw.ai)
- [Ollama 模型库](https://ollama.com/library)
- [Home Assistant](https://www.home-assistant.io)
- [Obsidian](https://obsidian.md)
- [n8n](https://n8n.io)

## 📄 License

MIT License - 自由使用、修改、分发
