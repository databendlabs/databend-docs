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

Copy this message into your agent. After installation, it will help you save an API key for this skill. Later tasks reuse the saved key; you do not need to enter it each time. Create a personal API token in the [Cloud console](https://app.databend.com/) under **Admin → API Tokens → Access Tokens → Generate New Token**.

```text
Install the databend-cloud skill from:
https://github.com/evotai/evot-skills/tree/main/skills/databend-cloud

Use your supported skill installation method. Install only this skill
and confirm that you can discover and load its SKILL.md.
After installation, read SKILL.md and guide me through personal API token setup.
Show me how to create a token at https://app.databend.com/ under
Admin > API Tokens > Access Tokens > Generate New Token.
Help me persist the key for this skill and https://api.databend.com through
a private terminal or the execution environment's persistent secret settings.
Follow the skill's credential storage instructions. Keep it outside the skill's
installation directory, so later tasks can reuse it and skill updates preserve it.
Reuse an existing key for this site; do not overwrite it.
Do not ask me to paste a token in chat. Stop after setup; do not connect
to a database or execute SQL.
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
