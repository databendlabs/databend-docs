---
title: Agent Skills
sidebar_label: Agent Skills
description: Explore what the Databend Cloud skill can do and install it by pasting one message into your agent.
---

The `databend-cloud` skill gives your agent guidance and tools for working with Databend Cloud.

## What It Can Do

- **Connect to Cloud:** Guide private API token setup and use the organization and warehouse you select.
- **Work with SQL:** Check Databend syntax, inspect databases and tables, and query data.
- **Diagnose queries:** Inspect execution status, results, history, and profiles to investigate slow or failed SQL.
- **Manage warehouses:** List, create, resize, resume, suspend, rename, or drop warehouses with the required admin role and your approval.
- **Investigate incidents:** Analyze alerts, OOMs, node exits, task failures, and version regressions.
- **Export evidence:** Export bounded logs as raw JSON Lines or readable events.

Available operations depend on your account privileges and access to history, profiles, and logs.

## Install with Your Agent

Copy this message into your agent:

```text
Install the databend-cloud skill from:
https://github.com/evotai/evot-skills/tree/main/skills/databend-cloud

Use your supported skill installation method. Install only this skill
and confirm that you can discover and load its SKILL.md.
Only install it. Do not configure credentials, connect to Cloud, or run SQL.
```

## Security and API Reference

Installation does not grant access to your account. Configure a personal API token privately only when you need to connect. Never paste it into chat. Use least-privilege database access; the skill is not a read-only sandbox.

See [Cloud API Security and Reference](./04-cloud-api.md) for authentication, token scope, data exposure, supported endpoints, and documentation links for agent retrieval.
