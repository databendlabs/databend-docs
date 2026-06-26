---
title: MCP Client 集成
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# MCP Client 集成

基于 [Model Context Protocol](https://modelcontextprotocol.io)，将 AI 助手连接到 Databend。支持 Claude Code、Claude Desktop、Cursor、Codex、Kimi Code、Gemini CLI、VS Code 以及其他兼容 MCP 的客户端。

**核心能力：**

- 根据自然语言需求生成复杂 SQL 查询。
- 探索数据库、表、Schema、计算集群以及账号身份。
- 直接在 AI 助手中执行查询并查看结果。

使用哪一种取决于你的部署方式：

| 方式 | 适用场景 | 认证 |
| ---- | -------- | ---- |
| **托管 MCP Server** | 使用 Databend Cloud | OAuth 登录，无需管理 token |
| **本地 `mcp-databend` Server** | 自托管 Databend，或需要固定 DSN 账号 | DSN（用户名/密码） |

## 托管 MCP Server（Databend Cloud）

Databend Cloud 提供托管的远程 MCP Server。你只需将客户端指向一个 URL 并在浏览器中登录即可，无需拼接 DSN、无需粘贴 token、本地也不用安装任何东西。访问范围限定在你的 Databend Cloud 账号，以及登录时所选择的组织（和可选的 SQL role）。

**Server 地址：** `https://mcp.databend.cn/mcp`

### 用一个 URL 接入

大多数 MCP 客户端通过 Streamable HTTP 支持远程 Server。你先填入 Server 地址，然后在浏览器中完成一次性的 OAuth 登录 —— 登录 Databend Cloud、选择组织、点击 **Allow**。部分客户端会自动打开浏览器，其余客户端需要一个显式的登录步骤（见下方各客户端标签页）。登录后，客户端保存 token 并在过期时静默续期 —— 你自始至终不需要接触 token。

<Tabs groupId="mcp-clients">

<TabItem value="add-mcp" label="add-mcp（任意客户端）">

对于支持 `add-mcp` 工具的客户端：

```bash
npx add-mcp https://mcp.databend.cn/mcp
```

它会把 Server 配置写入客户端的配置文件，首次使用时触发浏览器登录。

</TabItem>

<TabItem value="claude-code" label="Claude Code">

```bash
claude mcp add --transport http databend https://mcp.databend.cn/mcp
```

添加 server 只是完成注册。在 Claude Code 中运行 `/mcp`（或在命令行运行 `claude mcp login databend`）并按浏览器提示完成 OAuth 登录。

</TabItem>

<TabItem value="codex" label="Codex">

```bash
codex mcp add databend --url https://mcp.databend.cn/mcp
codex mcp login databend
```

或添加到 `~/.codex/config.toml`：

```toml
[mcp_servers.databend]
url = "https://mcp.databend.cn/mcp"
```

`codex mcp add --url`（或编辑 `config.toml`）只是注册 server。运行 `codex mcp login databend` 在浏览器中完成 OAuth 登录。

</TabItem>

<TabItem value="cursor" label="Cursor">

添加到 `~/.cursor/mcp.json`：

```json
{
  "mcpServers": {
    "databend": {
      "url": "https://mcp.databend.cn/mcp"
    }
  }
}
```

</TabItem>

<TabItem value="vscode" label="VS Code">

运行 **MCP: Open User Configuration** 打开 `mcp.json`（或在工作区创建 `.vscode/mcp.json`），添加：

```json
{
  "servers": {
    "databend": {
      "type": "http",
      "url": "https://mcp.databend.cn/mcp"
    }
  }
}
```

</TabItem>

<TabItem value="generic" label="其他客户端">

任何支持远程 MCP Server URL 的客户端都以相同方式接入 —— 填入 Server 地址，让客户端自动协商 OAuth：

```json
{
  "mcpServers": {
    "databend": {
      "url": "https://mcp.databend.cn/mcp"
    }
  }
}
```

</TabItem>

</Tabs>

:::note
不同客户端的配置字段名各异（`url`、`serverUrl`、传输方式参数等），但本质都是“填入 Server URL”。OAuth 流程由客户端与 Databend Cloud 自动协商，你无需配置 token。
:::

### 登录流程

当你发起 OAuth 登录时（自动或通过客户端的登录步骤），浏览器会打开 `https://app.databend.cn`：

1. 登录 Databend Cloud（如尚未登录）。
2. 在同意页选择该 MCP 会话所作用的**组织**。
3. 可选：**降权到更窄的 SQL role**。为获得最小权限访问，建议提前创建一个只读 role 并在此选择（参阅[推荐：创建只读 role](#推荐创建只读-role)）。
4. 点击 **Allow**。

客户端获得绑定该组织（和 role）的 token 后即可调用工具。token 过期时，客户端会静默续期，不再打开浏览器。

### 推荐：创建只读 role

`execute_sql` 执行任意 SQL，因此将会话绑定到一个只读 SQL role 是阻止 AI Agent 修改数据最简单的方式。先创建一个仅含 `SELECT`（如使用 Stage，则加上 `READ`）权限的 role，登录时在同意页选择它即可：

```sql
-- 创建只读 role
CREATE ROLE ai_readonly;

-- 授予所有库的 SELECT 权限（同时覆盖 SHOW / DESCRIBE）
GRANT SELECT ON *.* TO ROLE ai_readonly;

-- 可选：允许从 Stage 读取（例如检查 COPY 来源）
GRANT READ ON STAGE my_stage TO ROLE ai_readonly;

-- 将 role 授予登录所用的账号
GRANT ROLE ai_readonly TO USER '<your_account_email>';
```

完整的权限列表与授权语法，参阅 [访问控制](/guides/security/access-control)、[GRANT](/sql/sql-commands/ddl/user/grant) 和 [CREATE ROLE](/sql/sql-commands/ddl/user/user-create-role)。

### 组织与 role 范围

- 一个会话绑定**单一组织** —— 即登录时所选的那个。要操作其他组织，需**重新授权**：清除该 server 已存储的凭据（或使用客户端的登出/重新登录命令，例如 `codex mcp login databend`），让下次连接重新打开浏览器，然后在同意页选择另一个组织。仅仅等待 token 过期**不行** —— 客户端会静默续期并仍绑定到原来的组织。
- 如果登录时选择了 SQL role，会话将被**限制在该 role 之内**。Agent 无法在会话中提权到更宽的 role。在服务端撤销或降级该 role，会在下次 token 续期时生效。

如需**同时操作多个组织（或多个账号）**，可以添加多个**名字不同、地址相同**的 server 条目，在各自的浏览器授权流程中分别选择不同的组织（或用不同账号登录）：

```json
{
  "mcpServers": {
    "databend-org-a": { "url": "https://mcp.databend.cn/mcp" },
    "databend-org-b": { "url": "https://mcp.databend.cn/mcp" }
  }
}
```

每个条目各自持有一份绑定单一组织的 token，因此两个连接可以并存使用。前提是你的 MCP 客户端按 server 条目分别存储 OAuth 凭据（多数客户端如此）；若某个客户端按 URL 缓存 token，则两个条目会共用同一份凭据，此方式失效。

### 权限

`execute_sql` 执行任意 SQL，**不限于只读**。Agent 实际能执行的操作由你 Databend Cloud 账号的 RBAC 权限以及会话绑定的 SQL role 决定。对于 AI Agent，建议在登录时将会话绑定到一个[只读 role](#推荐创建只读-role)。

## 本地 `mcp-databend` Server

:::tip[使用 Databend Cloud？]
你也可以使用上面的[托管 MCP Server](#托管-mcp-serverdatabend-cloud)，无需本地安装、无需 DSN。下面的步骤是**自托管 Databend** 的必需方式，在 Cloud 上需要固定 DSN 账号时（例如 CI 流水线）同样适用。
:::

[mcp-databend](https://github.com/databendlabs/mcp-databend) 是一个在本机运行的 MCP Server，通过 DSN 连接到 Databend。

### 1. 获取 Databend 连接信息

使用 SQL 用户及其所需权限拼接 DSN：

1. 创建 SQL 用户并授予所需权限，参阅 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user#示例-1全库读写访问)。
2. 拼接 DSN：

   ```text
   databend://<username>:<password>@<host>:443/<database>?warehouse=<warehouse_name>
   ```

   自托管实例：

   ```text
   databend://<username>:<password>@localhost:8000/<database>?sslmode=disable
   ```

建议通过最小权限授权控制写入范围，并在下一步保持 `DATABEND_MCP_SAFE_MODE=true`。

### 2. 配置 MCP 客户端

默认使用 `DATABEND_MCP_SAFE_MODE=true`。在安全模式下，AI Agent 对生产数据保持只读，写操作仅限于会话沙箱对象。

<Tabs groupId="mcp-clients-local">

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

<TabItem value="manual" label="Manual">

```bash
export DATABEND_DSN="databend://user:password@host:443/database?warehouse=your_warehouse"
export DATABEND_MCP_SAFE_MODE=true

uv tool run --from mcp-databend@latest mcp-databend
```

</TabItem>

</Tabs>

### 会话沙箱防护

`DATABEND_MCP_SAFE_MODE` 用于控制本地 MCP Server 是否启用会话沙箱防护。

| 值 | 行为 | 推荐场景 |
| -- | ---- | -------- |
| `true` | Agent 对生产对象只读。写操作仅允许落在 `mcp_sandbox_{session_id}_*` 等会话沙箱对象上。 | 默认推荐，适合大多数 AI 工具场景。 |
| `false` | MCP Server 可写入该 Databend 用户权限允许的对象。 | 仅在可信 Agent 和最小权限 Databend 用户场景下使用。 |

### 参数配置

| 变量                     | 说明                         | 默认值 |
| ------------------------ | ---------------------------- | ------ |
| `DATABEND_DSN`           | Databend 连接字符串（DSN）   | 必填   |
| `DATABEND_MCP_SAFE_MODE` | 为 AI 工具启用会话沙箱防护   | `true` |
| `DATABEND_QUERY_TIMEOUT` | 查询超时（秒）               | `300`  |

## 功能列表

托管的 Cloud Server 提供一组聚焦的工具：

| 工具             | 说明                                                                       |
| ---------------- | -------------------------------------------------------------------------- |
| `execute_sql`    | 执行 SQL 并返回结果（为适配 LLM 上下文按行数截断：默认 1000、上限 10000）。权限由账号 RBAC 决定。 |
| `whoami`         | 返回绑定的身份：账号（email）、查询所作用的单一组织，以及当前使用的 SQL role。 |
| `list_warehouses`| 列出当前组织下可用的计算集群。                                             |
| `list_databases` | 列出账号可见的数据库。                                                     |
| `list_tables`    | 列出表，可按数据库过滤。                                                   |
| `describe_table` | 查看表结构。                                                               |

`list_*` 和 `describe_table` 是常用元数据查询的快捷方式。其余操作 —— Stage、Connection、定时任务、`COPY`、`MERGE`，以及绑定 role 允许执行的任何其他操作 —— 都可以通过 `execute_sql` 完成。例如，让 Agent “列出我的 Stage”或“创建一个到 S3 的 Connection”，它会执行对应的 SQL（[`SHOW STAGES`](/sql/sql-commands/ddl/stage/ddl-show-stages)、[`CREATE CONNECTION`](/sql/sql-commands/ddl/connection/create-connection) 等）。
