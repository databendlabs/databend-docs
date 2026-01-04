---
title: MCP Client 集成
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# MCP Client 集成

## 概览

[Databend MCP](https://github.com/databendlabs/mcp-databend) 基于 Model Context Protocol 协议，将 Databend 的数据能力无缝集成到您的 AI 助手工作流中。支持 Claude Code、Codex、Cursor、Claude Desktop、VS Code 等主流 MCP 客户端。

**核心能力：**
- **智能 SQL 生成**：根据业务需求自动生成复杂的 SQL 查询。
- **自动化运维**：直接创建和管理定时数据管道任务。
- **交互式探索**：即时查看数据库 Schema 结构并校验查询语法。
- **ETL 工作流**：流畅执行 COPY、MERGE 和 Stage 文件操作。

例如：*"创建一个定时任务，每分钟从 @my_stage 复制 parquet 文件到 orders 表，并验证任务是否正常运行。"*

## 安装

### 1. 获取连接信息

推荐使用 **Databend Cloud** 以获得开箱即用的体验。

1.  登录 [Databend Cloud](https://app.databend.cn)。
2.  点击 **链接（DSN）**。
3.  获取常规连接信息（Host, User, Password 等）。
4.  复制完整 DSN，格式如下：
    `databend://user:pwd@host:443/database?warehouse=warehouse_name`

### 2. 配置 MCP 客户端

<Tabs groupId="mcp-clients">

<TabItem value="codex" label="Codex">

```bash
codex mcp add databend \
  --env DATABEND_DSN='databend://user:password@host:port/database?warehouse=your_warehouse' \
  --env SAFE_MODE='false' \
  -- uv tool run mcp-databend
```

或添加到 `~/.codex/config.toml`:

```toml
[mcp_servers.databend]
command = "uv"
args = ["tool", "run", "mcp-databend"]

[mcp_servers.databend.env]
DATABEND_DSN = "databend://user:password@host:port/database?warehouse=your_warehouse"
SAFE_MODE = "false"
```

</TabItem>

<TabItem value="claude-code" label="Claude Code">

```bash
claude mcp add databend \
  --env DATABEND_DSN='databend://user:password@host:port/database?warehouse=your_warehouse' \
  --env SAFE_MODE='false' \
  -- uv tool run mcp-databend
```

</TabItem>

<TabItem value="gemini-cli" label="Gemini CLI">

添加到 `~/.gemini/settings.json`:

```json
{
  "mcpServers": {
    "databend": {
      "command": "uv",
      "args": ["tool", "run", "mcp-databend"],
      "env": {
        "DATABEND_DSN": "databend://user:password@host:port/database?warehouse=your_warehouse",
        "SAFE_MODE": "false"
      }
    }
  }
}
```

</TabItem>

<TabItem value="cursor" label="Cursor">

添加到 `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "databend": {
      "command": "uv",
      "args": ["tool", "run", "mcp-databend"],
      "env": {
        "DATABEND_DSN": "databend://user:password@host:port/database?warehouse=your_warehouse",
        "SAFE_MODE": "false"
      }
    }
  }
}
```

</TabItem>

<TabItem value="claude-desktop" label="Claude Desktop">

添加到 `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) 或 `%APPDATA%/Claude/claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "databend": {
      "command": "uv",
      "args": ["tool", "run", "mcp-databend"],
      "env": {
        "DATABEND_DSN": "databend://user:password@host:port/database?warehouse=your_warehouse",
        "SAFE_MODE": "false"
      }
    }
  }
}
```

</TabItem>

<TabItem value="vscode" label="VS Code">

添加到 `.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "databend": {
      "command": "uv",
      "args": ["tool", "run", "mcp-databend"],
      "env": {
        "DATABEND_DSN": "databend://user:password@host:port/database?warehouse=your_warehouse",
        "SAFE_MODE": "false"
      }
    }
  }
}
```

</TabItem>

<TabItem value="manual" label="Manual">

```bash
export DATABEND_DSN="databend://user:password@host:port/database?warehouse=your_warehouse"
export SAFE_MODE="false"

uv tool run mcp-databend
```

</TabItem>

</Tabs>

## 功能列表

### 数据库操作

| 工具 | 说明 |
|------|------|
| `execute_sql` | 执行 SQL (含超时保护) |
| `show_databases` | 查看所有数据库 |
| `show_tables` | 查看表列表 (支持模糊搜索) |
| `describe_table` | 查看表结构信息 |

### Stage 管理

| 工具 | 说明 |
|------|------|
| `show_stages` | 查看所有 Stage |
| `list_stage_files` | 列出 Stage 文件 |
| `create_stage` | 创建 Stage (支持 Connection) |

### 连接管理

| 工具 | 说明 |
|------|------|
| `show_connections` | 查看可用连接 |

## 参数配置

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `DATABEND_DSN` | 连接字符串 (DSN) | 必填 |
| `SAFE_MODE` | 安全模式 (禁止 DROP/DELETE 等高危操作) | `true` |
| `DATABEND_QUERY_TIMEOUT` | 查询超时 (秒) | `300` |

更多关于构建对话式 BI 工具的内容，请参阅 [MCP Server 指南](02-mcp.md)。
