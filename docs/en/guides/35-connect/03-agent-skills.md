---
title: Agent Skills
sidebar_label: Agent Skills
description: Install the Databend Cloud skill by pasting a short instruction into your agent.
---

The `databend-cloud` skill teaches your agent how to connect to Databend Cloud, use SQL and APIs, and investigate incidents.

## Install with Your Agent

Copy this message into your agent:

```text
Install the databend-cloud skill from:
https://github.com/evotai/evot-skills/tree/main/skills/databend-cloud

Use your supported skill installation method. Install only this skill
and confirm that you can discover and load its SKILL.md.
Only install it. Do not configure credentials, connect to Cloud, or run SQL.
```

Alternatively, with Node.js and the [Skills CLI](https://github.com/vercel-labs/skills):

```bash
npx skills add evotai/evot-skills --skill databend-cloud
```

## Security and API Reference

Installation does not grant access to your account. Configure a personal API token privately only when you need to connect. Never paste it into chat. Use least-privilege database access; the skill is not a read-only sandbox.

See [Cloud API Security and Reference](./04-cloud-api.md) for authentication, token scope, data exposure, supported endpoints, and documentation links for agent retrieval.
