---
title: MCP Client Integration
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# MCP Client Integration

## Overview

[Databend MCP](https://github.com/databendlabs/mcp-databend) connects AI assistants to Databend through the Model Context Protocol. It works with Codex, Kimi Code, Cursor, Claude Code, Claude Desktop, Gemini CLI, VS Code, and other MCP-compatible clients.

**What you can do:**

- Generate complex SQL queries from natural language requirements.
- Explore databases, tables, schemas, stages, and connections.
- Validate query syntax before running it.
- Build ETL workflows with COPY, MERGE, and Stage operations.
- Create and manage scheduled data pipeline tasks.

For example: _"Create a scheduled task that copies parquet files from @my_stage to the orders table every minute, and verify that it is running correctly."_

## Installation

### 1. Get a Databend Connection

We recommend using **Databend Cloud** for the best experience. You can obtain the DSN in two ways.

#### Option A: Use **Use with AI Tools** (recommended)

Generates a short-lived DSN with session sandbox safety in one click. Best for getting AI tools connected quickly.

1. Log in to [Databend Cloud](https://app.databend.com).
2. Click **Use with AI Tools**.
3. Choose the database and warehouse for the MCP server.
4. Keep **Session Sandbox Safety** enabled unless you explicitly need the agent to write to production objects.
5. Copy the DSN, which looks like:

   ```text
   databend://user:password@host:443/database?warehouse=warehouse_name
   ```

![Use with AI Tools](@site/static/img/connect/ai-tools.png)

#### Option B: Build the DSN with your own SQL user

Use this when you want a stable account and permission set (for example, CI pipelines, sharing with teammates, or pairing with a least-privilege policy).

1. Create a SQL user in Databend Cloud and grant the required privileges. See [CREATE USER](/sql/sql-commands/ddl/user/user-create-user#example-4-full-access-for-ai-tools-or-automation).
2. Get your `tenant`, `region`, `database`, and `warehouse` values from **Overview → Connect**.
3. Assemble the DSN using this format:

   ```text
   databend://<username>:<password>@<tenant>.gw.<region>.default.databend.com:443/<database>?warehouse=<warehouse_name>
   ```

Self-created users do not get the session sandbox automatically. Scope writes through least-privilege grants and keep `DATABEND_MCP_SAFE_MODE=true` in the next step.

### 2. Configure Your MCP Client

Use `DATABEND_MCP_SAFE_MODE=true` by default. In safe mode, production data remains read-only for AI agents, while write operations are scoped to session sandbox objects.

<Tabs groupId="mcp-clients">

<TabItem value="codex" label="Codex">

```bash
codex mcp add databend \
  --env DATABEND_DSN='databend://user:password@host:443/database?warehouse=your_warehouse' \
  --env DATABEND_MCP_SAFE_MODE=true \
  -- uv tool run --from mcp-databend@latest mcp-databend
```

Or add to `~/.codex/config.toml`:

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

Or add to `~/.kimi/mcp.json`:

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

Add to `~/.cursor/mcp.json`:

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

Add to `~/.gemini/settings.json`:

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

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS, or `%APPDATA%\Claude\claude_desktop_config.json` on Windows:

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

Open **Preferences: Open User Settings (JSON)** and add:

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

## Session Sandbox Safety

`DATABEND_MCP_SAFE_MODE` controls whether the MCP server runs with session sandbox protection.

| Value | Behavior | Recommended usage |
| ----- | -------- | ----------------- |
| `true` | Production objects are read-only for the agent. Write operations are allowed only on session sandbox objects such as `mcp_sandbox_{session_id}_*`. | Default and recommended for AI tools. |
| `false` | The MCP server can write to objects allowed by the Databend user permissions. | Use only with trusted agents and least-privilege Databend users. |

Keep safe mode enabled for most workflows. Disable it only when the agent must modify real production objects and the Databend user already has the minimum required permissions.

## Available Tools

### Database Operations

| Tool             | Description                                      |
| ---------------- | ------------------------------------------------ |
| `execute_sql`    | Execute SQL queries with timeout protection      |
| `show_databases` | List all databases                               |
| `show_tables`    | List tables in a database with optional filter   |
| `describe_table` | Get table schema information                     |

### Stage Management

| Tool               | Description                                |
| ------------------ | ------------------------------------------ |
| `show_stages`      | List all available stages                  |
| `list_stage_files` | List files in a specific stage             |
| `create_stage`     | Create a new stage with connection support |

### Connection Management

| Tool               | Description                    |
| ------------------ | ------------------------------ |
| `show_connections` | List all available connections |

## Configuration

| Variable                 | Description                                    | Default  |
| ------------------------ | ---------------------------------------------- | -------- |
| `DATABEND_DSN`           | Databend connection string                     | Required |
| `DATABEND_MCP_SAFE_MODE` | Enable session sandbox protection for AI tools | `true`   |
| `DATABEND_QUERY_TIMEOUT` | Query timeout in seconds                       | `300`    |

For more details on building conversational BI tools, see [MCP Server Guide](02-mcp.md).
