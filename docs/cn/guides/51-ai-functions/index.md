# AI 与机器学习集成

Databend 提供两种方式实现 AI/ML 能力：使用自有基础设施构建 AI 函数，或通过自然语言与数据交互。

## 外部函数（推荐）

外部函数让您可以将数据与自定义 AI/ML 服务对接，最大程度发挥灵活性和性能。

| 特性 | 优势 |
|---------|----------|
| **自定义模型** | 可接入任意开源或私有 AI/ML 模型 |
| **GPU 加速** | 部署在 GPU 机器上加速推理 |
| **数据私有** | 数据始终留在自有基础设施中 |
| **独立扩展** | 计算资源可按需独立调配 |
| **语言无关** | 支持任意编程语言和 ML 框架 |

## MCP 服务器 —— 用自然语言查数据

MCP（Model Context Protocol）服务器让 AI 助手能够用自然语言查询 Databend 数据库，非常适合构建对话式 BI 工具。在 Databend Cloud 上，将 AI 客户端指向**托管 MCP Server** 并在浏览器中登录即可 —— 无需 DSN、无需本地安装。

| 特性 | 优势 |
|---------|----------|
| **自然语言查询** | 用日常语言提问即可获取数据 |
| **AI 助手集成** | 支持 Claude、Cursor、Codex 及自定义 Agent |
| **OAuth 登录** | 一个 URL 即可接入，无需管理 token |

## 快速上手

**[外部函数指南](01-external-functions.md)** —— 通过示例学习如何创建和部署自定义 AI 函数

**[MCP Client 集成](03-mcp-integration.md)** —— 将 AI 助手连接到托管的 Databend Cloud MCP Server，或为自托管 Databend 运行本地 `mcp-databend` Server

**[MCP 服务器指南](02-mcp.md)** —— 使用本地 mcp-databend 构建对话式 BI 工具（也是连接自托管 Databend 的方式）

**[AI 文档处理流水线](04-document-pipeline.md)** —— 将 S3 中的 PDF 和图片依次经过 OCR、实体抽取和 Embedding，最终实现全文检索和向量检索