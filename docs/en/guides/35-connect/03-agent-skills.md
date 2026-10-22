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
https://github.com/evotai/evot-skills/tree/main/skills/databend-cloud

Follow SKILL.md to reuse an API key or help me save one for https://api.databend.com.
Keep the key out of chat. Stop after setup; do not connect or run SQL.
```

:::note
This is an official Databend skill, not a third-party skill.
:::

## Security

- Keep tokens out of chat and repositories. Local credential files are plaintext; the helper sets Unix permissions to `600`.
- Use least-privilege accounts. Tokens follow the account's org permissions. The skill is not a read-only sandbox; database privileges enforce read-only access.
- Results and logs can enter the agent's model context. Follow your data policy.
- Revoke tokens in the Cloud console. Replacing a local key file does not revoke the old token.

Details: [Authentication](https://raw.githubusercontent.com/evotai/evot-skills/main/skills/databend-cloud/references/authentication.md) · [Query API](https://raw.githubusercontent.com/evotai/evot-skills/main/skills/databend-cloud/references/query-api.md).
