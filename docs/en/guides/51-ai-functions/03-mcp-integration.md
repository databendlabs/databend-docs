---
title: MCP Client Integration
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# MCP Client Integration

Connect AI assistants to Databend through the [Model Context Protocol](https://modelcontextprotocol.io). It works with Claude Code, Claude Desktop, Cursor, Codex, Kimi Code, Gemini CLI, VS Code, and other MCP-compatible clients.

**What you can do:**

- Generate complex SQL queries from natural language requirements.
- Explore databases, tables, schemas, warehouses, and your account identity.
- Run queries and inspect results directly from your AI assistant.

There are two ways to connect:

| Option | Best for | Auth |
| ------ | -------- | ---- |
| **Hosted MCP server (recommended)** | Databend Cloud users | OAuth sign-in, no token to manage |
| **Local `mcp-databend` server** | Self-hosted Databend, or DSN-based setups | DSN (username/password) |

## Hosted MCP Server (Recommended)

Databend Cloud runs a managed remote MCP server. You point your client at a single URL and sign in through your browser — there is no DSN to assemble, no token to paste, and nothing to install locally. Access is scoped to your Databend Cloud account and the organization (and optional SQL role) you pick at sign-in.

**Server URL:** `https://mcp.databend.com/mcp`

### Connect with a single URL

Most MCP clients support remote servers over Streamable HTTP. Add the server URL and the client handles OAuth automatically: on first connect it opens your browser, you log in to Databend Cloud, choose an organization, and click **Allow**. The client stores the resulting token and refreshes it silently — you never handle the token yourself.

<Tabs groupId="mcp-clients">

<TabItem value="add-mcp" label="add-mcp (any client)">

For any client that supports the `add-mcp` helper:

```bash
npx add-mcp https://mcp.databend.com/mcp
```

This writes the server entry into your client's config file and triggers the browser sign-in on first use.

</TabItem>

<TabItem value="claude-code" label="Claude Code">

```bash
claude mcp add databend https://mcp.databend.com/mcp
```

The first time a tool is called, Claude Code opens your browser to complete the OAuth sign-in.

</TabItem>

<TabItem value="codex" label="Codex">

```bash
codex mcp add databend --url https://mcp.databend.com/mcp
```

Or add to `~/.codex/config.toml`:

```toml
[mcp_servers.databend]
url = "https://mcp.databend.com/mcp"
```

Codex opens your browser for the OAuth sign-in on first connect.

</TabItem>

<TabItem value="cursor" label="Cursor">

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "databend": {
      "url": "https://mcp.databend.com/mcp"
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
      "url": "https://mcp.databend.com/mcp"
    }
  }
}
```

</TabItem>

<TabItem value="generic" label="Other clients">

Any client that accepts a remote MCP server URL works the same way — fill in the server URL and let the client negotiate OAuth:

```json
{
  "mcpServers": {
    "databend": {
      "url": "https://mcp.databend.com/mcp"
    }
  }
}
```

</TabItem>

</Tabs>

:::note
Config field names differ between clients (`url`, `serverUrl`, transport flags, and so on), but they all reduce to "enter the server URL." The OAuth flow is negotiated between the client and Databend Cloud automatically — you do not configure a token.
:::

### How sign-in works

On first connect your client receives an authorization challenge and opens `https://app.databend.com` in your browser:

1. Log in to Databend Cloud (if you are not already).
2. On the consent page, pick the **organization** the MCP session should act on.
3. Optionally, **downscope to a narrower SQL role**. For least-privilege access, create a read-only role in advance and select it here (see [Recommended: a read-only role](#recommended-a-read-only-role)).
4. Click **Allow**.

The client receives a token bound to that organization (and role) and can call the tools. When the token expires, the client refreshes it silently without opening the browser again.

### Recommended: a read-only role

`execute_sql` runs arbitrary SQL, so binding the session to a read-only SQL role is the simplest way to keep an AI agent from modifying data. Create the role once with only `SELECT` (and, if you use stages, `READ`) privileges, then select it on the consent page at sign-in:

```sql
-- Create a read-only role
CREATE ROLE ai_readonly;

-- Grant SELECT across all databases (covers SHOW/DESCRIBE as well)
GRANT SELECT ON *.* TO ROLE ai_readonly;

-- Optional: allow reading from stages (e.g. for COPY-source inspection)
GRANT READ ON STAGE my_stage TO ROLE ai_readonly;

-- Grant the role to the account you sign in with
GRANT ROLE ai_readonly TO USER '<your_account_email>';
```

For the full privilege list and grant syntax, see [Access Control](/guides/security/access-control), [GRANT](/sql/sql-commands/ddl/user/grant), and [CREATE ROLE](/sql/sql-commands/ddl/user/user-create-role).

### Organization and role scope

- A session is bound to a **single organization** — the one you chose at sign-in. To act on a different org, **re-authorize** (trigger your client's reconnect/re-login, or let the token expire) and pick another org on the consent page.
- If you selected a SQL role at sign-in, the session is **capped at that role**. The agent cannot escalate to a broader role within the session. Revoking or downgrading the role on the server takes effect on the next token refresh.

### Permissions

`execute_sql` runs arbitrary SQL — it is **not limited to read-only**. What the agent can actually do is governed by the RBAC privileges of your Databend Cloud account and the SQL role bound to the session. For AI agents, bind the session to a [read-only role](#recommended-a-read-only-role) at sign-in.

## Self-Hosted: Local `mcp-databend` Server

:::tip[Using Databend Cloud?]
Prefer the [hosted MCP server](#hosted-mcp-server-recommended) above. It needs no local install and no DSN. The steps below are for **self-hosted Databend**, or when you need a fixed DSN-based account (for example, CI pipelines).
:::

[mcp-databend](https://github.com/databendlabs/mcp-databend) is a local MCP server you run on your own machine and point at Databend with a DSN.

### 1. Get a Databend Connection

Build a DSN with a SQL user and the privileges it needs:

1. Create a SQL user and grant the required privileges. See [CREATE USER](/sql/sql-commands/ddl/user/user-create-user#example-1-full-access-across-all-databases).
2. Assemble the DSN:

   ```text
   databend://<username>:<password>@<host>:443/<database>?warehouse=<warehouse_name>
   ```

   For self-hosted instances:

   ```text
   databend://<username>:<password>@localhost:8000/<database>?sslmode=disable
   ```

Scope writes through least-privilege grants and keep `DATABEND_MCP_SAFE_MODE=true` in the next step.

### 2. Configure Your MCP Client

Use `DATABEND_MCP_SAFE_MODE=true` by default. In safe mode, production data remains read-only for AI agents, while write operations are scoped to session sandbox objects.

<Tabs groupId="mcp-clients-local">

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

<TabItem value="manual" label="Manual">

```bash
export DATABEND_DSN="databend://user:password@host:443/database?warehouse=your_warehouse"
export DATABEND_MCP_SAFE_MODE=true

uv tool run --from mcp-databend@latest mcp-databend
```

</TabItem>

</Tabs>

### Session Sandbox Safety

`DATABEND_MCP_SAFE_MODE` controls whether the local MCP server runs with session sandbox protection.

| Value | Behavior | Recommended usage |
| ----- | -------- | ----------------- |
| `true` | Production objects are read-only for the agent. Write operations are allowed only on session sandbox objects such as `mcp_sandbox_{session_id}_*`. | Default and recommended for AI tools. |
| `false` | The MCP server can write to objects allowed by the Databend user permissions. | Use only with trusted agents and least-privilege Databend users. |

### Configuration

| Variable                 | Description                                    | Default  |
| ------------------------ | ---------------------------------------------- | -------- |
| `DATABEND_DSN`           | Databend connection string                     | Required |
| `DATABEND_MCP_SAFE_MODE` | Enable session sandbox protection for AI tools | `true`   |
| `DATABEND_QUERY_TIMEOUT` | Query timeout in seconds                       | `300`    |

## Available Tools

The hosted Cloud server exposes a focused set of tools:

| Tool             | Description                                                                 |
| ---------------- | --------------------------------------------------------------------------- |
| `execute_sql`    | Execute SQL and return results (row-capped for LLM context: default 1000, max 10000). Permissions follow account RBAC. |
| `whoami`         | Return the bound identity: account (email), the single organization queries act on, and the SQL role in use. |
| `list_warehouses`| List warehouses available in the current organization.                      |
| `list_databases` | List databases visible to the account.                                      |
| `list_tables`    | List tables, optionally filtered by database.                               |
| `describe_table` | Get table schema information.                                               |

The `list_*` and `describe_table` tools are shortcuts for common metadata lookups. Everything else — stages, connections, scheduled tasks, `COPY`, `MERGE`, and any other operation your bound role is allowed to run — is available through `execute_sql`. For example, ask the agent to "list my stages" or "create a connection to S3" and it runs the corresponding SQL ([`SHOW STAGES`](/sql/sql-commands/ddl/stage/ddl-show-stages), [`CREATE CONNECTION`](/sql/sql-commands/ddl/connection/create-connection), and so on).
