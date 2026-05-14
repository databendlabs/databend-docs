---
title: PostgreSQL - 连接凭证
---

本页介绍如何创建 `PostgreSQL - Credentials` 数据源。该数据源用于存储访问 PostgreSQL 所需的连接信息，可在多个 PostgreSQL 集成任务中复用。

## 使用场景

- 集中管理多个 PostgreSQL 同步任务的主机、端口和账户信息
- 避免在每个任务中重复输入相同的数据库连接配置
- 当数据库地址或账户发生变更时，只需在一处更新即可同步所有关联任务

## 创建 PostgreSQL - Credentials

1. 进入 **Data** > **Data Sources**，点击 **Create Data Source**。
2. 选择 **PostgreSQL - Credentials** 作为服务类型，然后填写连接信息：

| 字段 | 必填 | 说明 |
|------|------|------|
| **Name** | 是 | 数据源的描述性名称 |
| **Hostname** | 是 | PostgreSQL 服务器主机名或 IP 地址 |
| **Port Number** | 是 | PostgreSQL 服务器端口（默认：`5432`） |
| **DB Username** | 是 | 用于访问 PostgreSQL 的用户名 |
| **DB Password** | 是 | PostgreSQL 用户的密码 |
| **Database Name** | 是 | 源数据库名称 |
| **SSL Mode** | 否 | SSL 连接模式：`disable`、`require`、`verify-ca` 或 `verify-full`（默认：`disable`） |

![创建 PostgreSQL 数据源](/img/cloud/dataintegration/databendcloud-dataintegration-create-postgres-source.png)

3. 点击 **Test Connectivity** 验证连接。测试成功后，点击 **OK** 保存数据源。

## 使用建议

- 使用专用的 PostgreSQL 账户，避免与应用程序工作负载共享
- 如果计划创建 `CDC Only` 或 `Snapshot + CDC` 任务，请确保账户具有复制相关权限
- 在创建下游任务之前，请验证网络访问、WAL 配置和权限设置

## 后续步骤

创建数据源后，您可以使用它来创建 [PostgreSQL 集成任务](../task/03-postgres.md)。
