---
title: Agent 技能
sidebar_label: Agent 技能
description: 了解 Databend Cloud skill 的能力，将一段指令粘贴给 Agent 即可安装。
---

`databend-cloud` skill 为 Agent 提供使用 Databend Cloud 的操作指引和工具。

## 能做什么

- **连接 Cloud**：引导私下配置 API token，访问您指定的组织和计算集群。
- **使用 SQL**：核对 Databend 语法，查看数据库和表，查询数据。
- **诊断查询**：查看执行状态、结果、历史和 profile，分析慢 SQL 或失败查询。
- **管理计算集群**：具备所需管理员角色并获得您授权后，列出、创建、扩缩容、恢复、暂停、重命名或删除计算集群。
- **排查事故**：分析告警、OOM、节点退出、任务失败和版本回归。
- **导出证据**：按范围导出原始 JSON Lines 日志或可读事件。

实际可用的操作取决于账号权限，以及历史记录、profile 和日志的访问权限。

## 让 Agent 安装

将下面这段话复制给 Agent：

```text
请安装 databend-cloud skill，来源：
https://github.com/evotai/evot-skills/tree/main/skills/databend-cloud

按你支持的 skill 安装方式，只安装这个 skill，并确认能够发现和加载其 SKILL.md。
本次只安装，不配置凭证，不连接 Cloud，不执行 SQL。
```

## 安全与 API 参考

安装不会授予账号访问权限。需要连接时再私下配置个人 API token，不要将其粘贴到聊天中。请使用最小权限的数据库访问，skill 不是只读沙箱。

认证、token 范围、数据暴露、支持的接口和供 Agent 检索的文档链接，见 [Cloud API 安全与参考](./04-cloud-api.md)。
