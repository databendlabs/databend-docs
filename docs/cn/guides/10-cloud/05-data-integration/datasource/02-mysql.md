---
title: MySQL - Credentials
---

本页介绍如何创建 `MySQL - Credentials` 数据源。该数据源用于保存访问 MySQL 所需的连接信息，可供多个 MySQL 集成任务复用。

## 使用场景

- 为多个 MySQL 同步任务统一管理主机、端口和账号信息
- 避免在每个任务里重复填写数据库连接配置
- 在数据库地址或账号变更后统一更新引用它的任务

## 创建 MySQL - Credentials

1. 前往 **Data** > **Data Sources**，点击 **Create Data Source**。
2. 将服务类型选择为 **MySQL - Credentials**，然后填写连接信息：

| 字段 | 是否必填 | 说明 |
|------|----------|------|
| **Name** | 是 | 当前数据源的描述性名称 |
| **Hostname** | 是 | MySQL 服务器主机名或 IP 地址 |
| **Port Number** | 是 | MySQL 服务端口，默认值为 `3306` |
| **DB Username** | 是 | 用于访问 MySQL 的用户名 |
| **DB Password** | 是 | MySQL 用户密码 |
| **Database Name** | 是 | 源数据库名称 |
| **DB Charset** | 否 | 字符集，默认值为 `utf8mb4` |
| **Server ID** | 否 | 唯一的 binlog 复制标识；如不填写则自动生成 |

![创建 MySQL 数据源](/img/cloud/dataintegration/databendcloud-dataintegration-create-mysql-source.png)

3. 点击 **Test Connectivity** 验证连接；如果测试成功，点击 **OK** 保存数据源。

## 使用建议

- 建议使用专门的 MySQL 账号，而不是业务应用共享账号
- 如果后续会创建 `CDC Only` 或 `Snapshot + CDC` 任务，请确保该账号具备复制相关权限
- 建议在任务创建前先确认网络访问、binlog 配置和权限配置已经满足要求

## 后续操作

创建完成后，您可以基于该数据源创建 [MySQL 集成任务](../task/02-mysql.md)。
