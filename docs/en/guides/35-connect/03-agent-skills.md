---
title: Agent Skills
sidebar_label: Agent Skills
description: Explore what the Databend Cloud skill can do and install it by pasting one message into your agent.
---

The `databend-cloud` skill gives your agent guidance and tools for working with Databend Cloud.

This skill is for **Databend Cloud only**, not self-hosted Databend.

## What It Can Do

- **Connect to Cloud:** Guide private API token setup and use the organization and warehouse you select.
- **Work with SQL:** Check Databend syntax, inspect databases and tables, and query data.
- **Diagnose queries:** Inspect execution status, results, history, and profiles to investigate slow or failed SQL.
- **Manage warehouses:** List, create, resize, resume, suspend, rename, or drop warehouses with the required admin role and your approval.
- **Investigate incidents:** Analyze alerts, OOMs, node exits, task failures, and version regressions.
- **Export evidence:** Export bounded logs as raw JSON Lines or readable events.

You need a Databend Cloud account and access to the target organization. Available operations depend on your account privileges and access to history, profiles, and logs.

## Install with Your Agent

Copy this message to install the skill and set up a reusable API key. Create a token in the [Cloud console](https://app.databend.com/) under **Account API Tokens → Access Tokens → Generate New Token**.

```text
Install the databend-cloud skill:
https://github.com/databendcloud/databend-cloud-skill

Follow SKILL.md to reuse an API key or help me save one for https://api.databend.com.
Keep the key out of chat. Stop after setup; do not connect or run SQL.
```

## Quick Verification

Run this command to make sure that your token, organization, and warehouse are correct. Replace the placeholders with your values.

```bash
curl --request POST 'https://api.databend.com/v1/query' \
  --header 'Content-Type: application/json' \
  --header 'X-DATABENDCLOUD-TOKEN: <YOUR_API_TOKEN>' \
  --header 'X-DATABENDCLOUD-ORG: <YOUR_ORGANIZATION_ID>' \
  --header 'X-DATABENDCLOUD-WAREHOUSE: <YOUR_WAREHOUSE>' \
  --data '{"sql":"SELECT 1"}'
```

## Security

- Set a token IP allowlist to reject requests from other IPs. An empty allowlist means no IP restriction.
- Allow the actual outbound IP of the agent's execution environment. A remote agent can use a different outbound IP from your local computer.
- Tokens follow your account's current organization role. Use database permissions for read-only access. The skill is not a read-only sandbox.
- Disable or delete tokens in the Cloud console to revoke access. Replacing a local key file does not revoke the old token.
- View the token's last-used IP and time in the Cloud console. This is not a complete request audit log.
- Keep tokens out of chat, code, and repositories. Local credential files are plaintext; the helper sets Unix permissions to `600`.
- Results and logs can enter the agent's model context. Follow your data policy.

Details: [Authentication](https://raw.githubusercontent.com/databendcloud/databend-cloud-skill/main/references/authentication.md) · [Query API](https://raw.githubusercontent.com/databendcloud/databend-cloud-skill/main/references/query-api.md).
