---
title: Cloud API
sidebar_label: Cloud API
description: Authenticate with a personal API token, execute SQL, and manage query results in Databend Cloud.
---

Execute SQL and manage its results with a personal API token. For agent installation, see [Agent Skills](./03-agent-skills.md).

## Authentication

Base URL: `https://api.databend.com`.

Create a token in [Databend Cloud](https://app.databend.com/) under **Admin → API Tokens → Access Tokens**. Send JSON with `Content-Type: application/json` and these headers:

| Header | Value |
|--------|-------|
| `X-DATABENDCLOUD-TOKEN` | Personal API token, not a SQL user password. |
| `X-DATABENDCLOUD-ORG` | Organization ID from **Admin → Organization Profile**. |
| `X-DATABENDCLOUD-WAREHOUSE` | An accessible warehouse name, such as `default`. |

## Query Endpoints

Paths are relative to the Base URL. Keep the same org and warehouse for each query's requests.

| Method | Path | Action |
|--------|------|--------|
| `POST` | `/v1/query` | Execute SQL. Request body: `{"sql":"SELECT 1"}`. |
| `GET` | `/v1/query/{queryID}` | Get execution status. |
| `GET` | `/v1/query/{queryID}/page/{pageNum}` | Fetch a page from the server's continuation URI. |
| `GET` | `/v1/query/{queryID}/final` | Release results; unread pages may become unavailable. |
| `POST` | `/v1/query/{queryID}/kill` | Cancel execution; does not guarantee rollback. |

## Security

- **Scope:** A token uses the account's permissions in each requested org. It is not restricted to the org selected when creating it. Use least-privilege access.
- **Writes:** The API is not read-only. Enforce read-only access with database privileges. Agent confirmation does not replace server authorization.
- **Keys:** Use HTTPS and the confirmed API host. Keep keys out of chat, repositories, and command arguments. Skill credential files use Unix mode `600` but are plaintext.
- **Data:** Results, logs, and errors can enter the external agent's model context. Limit output and follow your data policy.
- **Revocation:** Disable or delete the token in the console. Replacing a local key file does not revoke the old token.
- **Retries:** A timeout may leave SQL running. Check the query ID before resubmitting, especially for writes.

Details: [Query API reference](https://raw.githubusercontent.com/evotai/evot-skills/main/skills/databend-cloud/references/query-api.md) · [API authentication boundaries](https://raw.githubusercontent.com/evotai/evot-skills/main/skills/databend-cloud/references/api-capabilities.md) · [SQL documentation index](https://docs.databend.com/llms.txt).
