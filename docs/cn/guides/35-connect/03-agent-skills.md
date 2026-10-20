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

将以下内容复制给 Agent。安装完成后，它会引导您为这个 skill 保存 API key，后续任务自动复用，无需每次输入。个人 API token 可在 [Cloud 控制台](https://app.databend.cn/) 的 **管理 → API 令牌 → 访问令牌 → 生成新令牌** 创建。

```text
请安装 databend-cloud skill 的完整目录，并确认可以加载其中的 SKILL.md。
https://github.com/evotai/evot-skills/tree/main/skills/databend-cloud

安装完成后，请读取 SKILL.md，继续引导我配置个人 API token。
告诉我如何在 https://app.databend.cn/ 的
管理 > API 令牌 > 访问令牌 > 生成新令牌 创建 token。
按 skill 的凭证保存方式，引导我通过私有终端或当前执行环境的持久密钥设置，
为这个 skill 和 https://api.databend.cn 保存 key，供后续任务直接复用。
凭证放在 skill 安装目录之外，避免更新 skill 时丢失。
如果该站点已有 key，直接复用，不要覆盖。
不要让我在聊天中发送 token。本次只安装和配置 key，不连接数据库，也不执行 SQL。
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
