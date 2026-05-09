---
title: MCP Client 集成
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# MCP Client 集成

## 概览

[Databend MCP](https://github.com/databendlabs/mcp-databend) 基于 Model Context Protocol 协议，将 Databend 连接到 AI 助手工作流。支持 Codex、Kimi Code、Cursor、Claude Code、Claude Desktop、Gemini CLI、VS Code 以及其他兼容 MCP 的客户端。

**核心能力：**

- 根据自然语言需求生成复杂 SQL 查询。
- 探索数据库、表、Schema、Stage 和 Connection。
- 在执行前校验查询语法。
- 使用 COPY、MERGE 和 Stage 操作构建 ETL 工作流。
- 创建和管理定时数据管道任务。

例如：_“创建一个定时任务，每分钟从 @my_stage 复制 parquet 文件到 orders 表，并验证任务是否正常运行。”_

## 安装

### 1. 获取 Databend 连接信息

推荐使用 **Databend Cloud** 以获得开箱即用的体验。你有两种方式获取 DSN。

#### 方式 A：使用 **与 AI 工具连接**（推荐）

一键生成带会话沙箱防护的临时 DSN，适合快速接入 AI 工具。

1. 登录 [Databend Cloud](https://app.databend.cn)。
2. 点击 **与 AI 工具连接**。
3. 选择 MCP Server 使用的数据库和计算集群。
4. 除非明确需要让 Agent 写入生产对象，否则建议保持 **会话沙箱防护** 开启。
5. 复制完整 DSN，格式如下：

   ```text
   databend://user:password@host:443/database?warehouse=warehouse_name
   ```

![与 AI 工具连接](@site/static/img/connect/ai-tools.png)

#### 方式 B：使用自建 SQL 用户拼接 DSN

如果你希望使用固定的账号和权限（例如 CI 环境、共享给团队成员，或搭配最小权限策略），可以自行创建 SQL 用户并拼接 DSN。

1. 在 Databend Cloud 中创建 SQL 用户并授予所需权限，参阅[创建 SQL 用户](/guides/cloud/resources/warehouses#创建-sql-用户)。
2. 从 **概览 → 连接** 页面获取 `tenant`、`region`、`database`、`warehouse` 等信息。
3. 按下列格式拼接 DSN：

   ```text
   databend://<username>:<password>@<tenant>.gw.<region>.default.databend.com:443/<database>?warehouse=<warehouse_name>
   ```

自建用户不会自动启用会话沙箱，建议通过最小权限控制写入范围，并在下一步保持 `DATABEND_MCP_SAFE_MODE=true`。

### 2. 配置 MCP 客户端

默认使用 `DATABEND_MCP_SAFE_MODE=true`。在安全模式下，AI Agent 对生产数据保持只读，写操作仅限于会话沙箱对象。

<Tabs groupId="mcp-clients">

<TabItem value="codex" label="Codex">

```bash
codex mcp add databend \
  --env DATABEND_DSN='databend://user:password@host:443/database?warehouse=your_warehouse' \
  --env DATABEND_MCP_SAFE_MODE=true \
  -- uv tool run --from mcp-databend@latest mcp-databend
```

或添加到 `~/.codex/config.toml`：

```toml
[mcp_servers.databend]
command = "uv"
args = ["tool", "run", "--from", "mcp-databend@latest", "mcp-databend"]

[mcp_servers.databend.env]
DATABEND_DSN = "databend://user:password@host:443/database?warehouse=your_warehouse"
DATABEND_MCP_SAFE_MODE = "true"
```

</TabItem>

<TabItem value="claude-code" label="Claude Code">

```bash
claude mcp add databend \
  --env DATABEND_DSN='databend://user:password@host:443/database?warehouse=your_warehouse' \
  --env DATABEND_MCP_SAFE_MODE=true \
  -- uv tool run --from mcp-databend@latest mcp-databend
```

</TabItem>

<TabItem value="kimi-code" label="Kimi Code">

```bash
kimi mcp add --transport stdio databend \
  --env DATABEND_DSN='databend://user:password@host:443/database?warehouse=your_warehouse' \
  --env DATABEND_MCP_SAFE_MODE=true \
  -- uv tool run --from mcp-databend@latest mcp-databend
```

或添加到 `~/.kimi/mcp.json`：

```json
{
  "mcpServers": {
    "databend": {
      "command": "uv",
      "args": ["tool", "run", "--from", "mcp-databend@latest", "mcp-databend"],
      "env": {
        "DATABEND_DSN": "databend://user:password@host:443/database?warehouse=your_warehouse",
        "DATABEND_MCP_SAFE_MODE": "true"
      }
    }
  }
}
```

</TabItem>

<TabItem value="cursor" label="Cursor">

添加到 `~/.cursor/mcp.json`：

```json
{
  "mcpServers": {
    "databend": {
      "command": "uv",
      "args": ["tool", "run", "--from", "mcp-databend@latest", "mcp-databend"],
      "env": {
        "DATABEND_DSN": "databend://user:password@host:443/database?warehouse=your_warehouse",
        "DATABEND_MCP_SAFE_MODE": "true"
      }
    }
  }
}
```

</TabItem>

<TabItem value="gemini-cli" label="Gemini CLI">

添加到 `~/.gemini/settings.json`：

```json
{
  "mcpServers": {
    "databend": {
      "command": "uv",
      "args": ["tool", "run", "--from", "mcp-databend@latest", "mcp-databend"],
      "env": {
        "DATABEND_DSN": "databend://user:password@host:443/database?warehouse=your_warehouse",
        "DATABEND_MCP_SAFE_MODE": "true"
      }
    }
  }
}
```

</TabItem>

<TabItem value="claude-desktop" label="Claude Desktop">

添加到 macOS 的 `~/Library/Application Support/Claude/claude_desktop_config.json`，或 Windows 的 `%APPDATA%\Claude\claude_desktop_config.json`：

```json
{
  "mcpServers": {
    "databend": {
      "command": "uv",
      "args": ["tool", "run", "--from", "mcp-databend@latest", "mcp-databend"],
      "env": {
        "DATABEND_DSN": "databend://user:password@host:443/database?warehouse=your_warehouse",
        "DATABEND_MCP_SAFE_MODE": "true"
      }
    }
  }
}
```

</TabItem>

<TabItem value="vscode" label="VS Code">

打开 **Preferences: Open User Settings (JSON)**，添加：

```json
{
  "mcp.servers": {
    "databend": {
      "command": "uv",
      "args": ["tool", "run", "--from", "mcp-databend@latest", "mcp-databend"],
      "env": {
        "DATABEND_DSN": "databend://user:password@host:443/database?warehouse=your_warehouse",
        "DATABEND_MCP_SAFE_MODE": "true"
      }
    }
  }
}
```

</TabItem>

<TabItem value="manual" label="Manual">

```bash
export DATABEND_DSN="databend://user:password@host:443/database?warehouse=your_warehouse"
export DATABEND_MCP_SAFE_MODE=true

uv tool run --from mcp-databend@latest mcp-databend
```

</TabItem>

</Tabs>

## 会话沙箱防护

`DATABEND_MCP_SAFE_MODE` 用于控制 MCP Server 是否启用会话沙箱防护。

| 值 | 行为 | 推荐场景 |
| -- | ---- | -------- |
| `true` | Agent 对生产对象只读。写操作仅允许落在 `mcp_sandbox_{session_id}_*` 等会话沙箱对象上。 | 默认推荐，适合大多数 AI 工具场景。 |
| `false` | MCP Server 可写入该 Databend 用户权限允许的对象。 | 仅在可信 Agent 和最小权限 Databend 用户场景下使用。 |

大多数场景建议保持安全模式开启。只有当 Agent 必须修改真实生产对象，并且 Databend 用户已配置最小必要权限时，才建议关闭。

## 功能列表

### 数据库操作

| 工具             | 说明                      |
| ---------------- | ------------------------- |
| `execute_sql`    | 执行 SQL（含超时保护）    |
| `show_databases` | 查看所有数据库            |
| `show_tables`    | 查看表列表（支持模糊搜索） |
| `describe_table` | 查看表结构信息            |

### Stage 管理

| 工具               | 说明                         |
| ------------------ | ---------------------------- |
| `show_stages`      | 查看所有 Stage               |
| `list_stage_files` | 列出 Stage 文件              |
| `create_stage`     | 创建 Stage（支持 Connection） |

### 连接管理

| 工具               | 说明         |
| ------------------ | ------------ |
| `show_connections` | 查看可用连接 |

## 参数配置

| 变量                     | 说明                         | 默认值 |
| ------------------------ | ---------------------------- | ------ |
| `DATABEND_DSN`           | Databend 连接字符串（DSN）   | 必填   |
| `DATABEND_MCP_SAFE_MODE` | 为 AI 工具启用会话沙箱防护   | `true` |
| `DATABEND_QUERY_TIMEOUT` | 查询超时（秒）               | `300`  |

更多关于构建对话式 BI 工具的内容，请参阅 [MCP Server 指南](02-mcp.md)。
