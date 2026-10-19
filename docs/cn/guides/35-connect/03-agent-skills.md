---
title: Agent 技能
sidebar_label: Agent 技能
description: 将简短指令粘贴给 Agent，安装 Databend Cloud skill。
---

`databend-cloud` skill 让 Agent 了解如何连接 Databend Cloud、使用 SQL 和 API，以及排查事故。

## 让 Agent 安装

将下面这段话复制给 Agent：

```text
请安装 databend-cloud skill，来源：
https://github.com/evotai/evot-skills/tree/main/skills/databend-cloud

按你支持的 skill 安装方式，只安装这个 skill，并确认能够发现和加载其 SKILL.md。
本次只安装，不配置凭证，不连接 Cloud，不执行 SQL。
```

也可以在具备 Node.js 的终端中使用 [Skills CLI](https://github.com/vercel-labs/skills)：

```bash
npx skills add evotai/evot-skills --skill databend-cloud
```

## 安全与 API 参考

安装不会授予账号访问权限。需要连接时再私下配置个人 API token，不要将其粘贴到聊天中。请使用最小权限的数据库访问，skill 不是只读沙箱。

认证、token 范围、数据暴露、支持的接口和供 Agent 检索的文档链接，见 [Cloud API 安全与参考](./04-cloud-api.md)。
