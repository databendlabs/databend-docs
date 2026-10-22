---
title: Agent Skills
sidebar_label: Agent Skills
description: 安装 Databend Cloud skill，让 Agent 协助您查询数据、管理计算集群和排查故障。
---

借助 `databend-cloud` skill，Agent 可协助您使用 Databend Cloud，完成数据查询、计算集群管理和故障排查。

此 skill **仅适用于 Databend Cloud**，不适用于自建部署。

## 功能概览

- **配置连接**，使用 API token 连接指定的组织和计算集群。
- **查询数据**，查阅 Databend SQL 语法，查看数据库和表结构。
- **诊断查询问题**，结合执行状态、查询历史和性能分析（profile），分析慢查询和执行失败的原因。
- **管理计算集群**，查看、创建、调整规格、恢复运行、暂停、重命名或删除计算集群。操作需具备相应管理权限，并获得您的明确授权。
- **排查故障**，分析告警、内存不足（OOM）、节点异常退出、任务失败和版本变更后的异常。
- **导出日志**，按指定范围生成 JSON Lines 格式的原始日志，或便于阅读的日志文件。

使用前需有 Databend Cloud 账号，并具备目标组织的访问权限。可执行的操作以账号权限为准，查询诊断和故障排查还需要访问相应的历史记录、profile 和日志。

## 通过 Agent 安装

复制以下指令，安装 skill 并配置可复用的 API key。Token 可在 [Cloud 控制台](https://app.databend.cn/) 的 **账户 API 令牌 → 访问令牌 → 生成新令牌** 创建。

```text
请安装以下 databend-cloud skill。
https://github.com/evotai/evot-skills/tree/main/skills/databend-cloud

按 SKILL.md 为 https://api.databend.cn 复用已有 API key，缺少时引导我保存。
不要在聊天中索取 key。配置完成即停止，不连接数据库或执行 SQL。
```

:::note
这是 Databend 官方提供的 skill，非第三方项目。
:::

## 安全须知

- 请勿在聊天中发送 token，也不要将其提交到代码仓库。本地凭证以明文保存，辅助脚本会将文件的 Unix 权限设为 `600`。
- 请按需授予账号权限。Token 可访问该账号获准使用的组织，skill 本身不限制写操作。如需只读访问，请通过数据库权限控制。
- Agent 可能将查询结果和日志提交给模型处理，请遵循组织的数据安全要求。
- 如需撤销 token，请在 Cloud 控制台将其禁用或删除。替换本地密钥文件不会使旧 token 失效。

更多说明请参阅[身份认证](https://raw.githubusercontent.com/evotai/evot-skills/main/skills/databend-cloud/references/authentication.md)和 [Query API 参考](https://raw.githubusercontent.com/evotai/evot-skills/main/skills/databend-cloud/references/query-api.md)。
