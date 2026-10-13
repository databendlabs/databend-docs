---
title: 数据共享
sidebar_label: 概述
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="引入或更新于：v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

数据共享（Data Sharing）向其他租户提供指定表的只读访问。Databend 不复制数据。

提供方创建 Share，并将表授权给 Share。消费方基于 Share 创建共享数据库。对共享数据库的查询直接读取提供方数据。

## 术语

| 术语 | 定义 |
| --- | --- |
| **提供方（Provider）** | 拥有源表和 Share 的租户。 |
| **消费方（Consumer）** | 获得授权、可以读取 Share 的租户。 |
| **Share** | 包含一个数据库授权、表授权、消费方账号和一个连接的对象。 |
| **消费方账号** | Share 中消费方的租户 ID。租户 ID 不是用户名，也不是角色名。 |
| **连接（Connection）** | 提供方的存储连接。Databend 使用其凭证读取共享表。 |
| **共享数据库** | 消费方基于 Share 创建的只读数据库。它不包含数据副本。 |

## 要求 {/* #prerequisites */}

- 使用 Databend v1.2.949 或更高版本。
- **Databend Cloud：** 提供方和消费方必须位于同一 Region。不支持跨 Region 共享。
- **自托管 Databend：** 提供方和消费方必须使用同一 Databend Meta 集群。每个部署都必须具有包含 `DataSharing` 功能的企业版许可证。
- 只能共享 FUSE 表。不支持视图、其他表引擎，以及带有行访问策略或掩码策略的表。
- 提供方连接必须具有共享表存储位置的读取权限。在自托管 Databend 中，消费方查询节点还必须能够通过网络访问该存储。
- 提供方和消费方必须具有[访问控制](#access-control)中的权限。

## 快速上手 {/* #quickstart */}

示例使用提供方租户 `provider_acct` 和消费方租户 `consumer_acct`。每个租户使用各自的会话。

开始前，准备一个 S3 bucket，以及具有该 bucket 读写权限的凭证。示例将共享表存放在该 bucket 中。此步骤也适用于 Databend Cloud。

在提供方会话中执行以下语句：

```sql
CREATE CONNECTION share_conn
    STORAGE_TYPE = 's3'
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>';

CREATE DATABASE orders_db;
CREATE TABLE orders_db.orders (id INT, region STRING, amount INT)
    's3://<your-bucket>/orders_db/'
    CONNECTION = (CONNECTION_NAME = 'share_conn');
INSERT INTO orders_db.orders VALUES (1, 'apac', 100), (2, 'emea', 200);

CREATE SHARE sales_share CONNECTION = share_conn;
GRANT USAGE ON DATABASE orders_db TO SHARE sales_share;
GRANT SELECT ON TABLE orders_db.orders TO SHARE sales_share;
ALTER SHARE sales_share ADD ACCOUNTS = consumer_acct;
```

为了简化示例，表和 Share 使用同一个连接。使用非 AWS 的 S3 兼容存储时，在连接中添加 `ENDPOINT_URL`。

在消费方会话中执行以下语句：

```sql
CREATE DATABASE shared_orders FROM SHARE provider_acct.sales_share;
SELECT * FROM shared_orders.orders;
```

各步骤及其选项参见[提供方配置](01-providers.md)和[消费方配置](02-consumers.md)。

## 访问控制 {/* #access-control */}

| 操作 | 所需权限 |
| --- | --- |
| `CREATE SHARE`、`ALTER SHARE`、`DROP SHARE` | 全局 `GRANT` 权限。 |
| `GRANT USAGE ON DATABASE ... TO SHARE` | 全局 `GRANT` 权限，以及提供方数据库的 `USAGE`。 |
| `GRANT SELECT ON TABLE ... TO SHARE` | 全局 `GRANT` 权限，以及提供方表的 `SELECT`。 |
| `REVOKE ... FROM SHARE` | 全局 `GRANT` 权限。如果对象存在，还需要该对象的 `USAGE` 或 `SELECT`。 |
| `SHOW SHARES`、`DESCRIBE SHARE` | 不需要其他权限。租户只能看到自己的 Share 和授权给自己的 Share。 |
| `CREATE DATABASE ... FROM SHARE` | 全局 `CREATE DATABASE` 权限。消费方租户必须是该 Share 的消费方账号。 |

在自托管 Databend 中，所有 Share 操作都需要 `DataSharing` 许可功能。

## 存储与连接 {/* #storage-and-connections */}

提供方授权表时，Databend 记录该表的存储位置，不记录凭证。消费方读取该表时，Databend 使用当前 Share 连接的凭证。

- 连接的凭证必须具有已授权表所在 bucket 的读取权限。
- 连接的存储类型必须与已授权表的存储类型相同。
- S3、Azure Blob 和 GCS 连接可以提供凭证。不带参数的 `fs` 连接使用提供方的文件系统配置。不支持其他存储类型。
- 消费方的默认存储不会改变共享数据的位置。
- 消费方无法获得连接的凭证。

## 限制

- 一个 Share 只能授权一个数据库。每个数据库使用不同的 Share。
- 先授予数据库的 `USAGE`，再授予每张表的 `SELECT`。只有 `USAGE` 不能访问表。
- 不支持列级授权和通配符表授权。
- 共享表为只读。消费方不能修改数据或表定义。
- 消费方不能将共享数据库授权给 Share。
- `SHOW SHARES` 只支持 `LIKE` 和 `LIMIT`。
- 提供方的变更对后续查询生效。正在执行的查询会继续执行。

消费方可以在共享表上创建 Stream。参见[共享表上的 Stream](02-consumers.md#streams-on-shared-tables)。

## 数据共享与 ATTACH TABLE

Databend 有两种不同的共享机制：

| 机制 | 配置方式 | 访问控制 |
| --- | --- | --- |
| **Share** | 提供方创建 Share。消费方基于 Share 创建共享数据库。 | 提供方控制表授权和消费方账号。 |
| **ATTACH TABLE** | 消费方根据存储位置附加表。 | 由存储配置控制访问。不使用 Share。 |

`ATTACH TABLE` 参见 [Databend 数据共享原理](/guides/how-databend-works/how-databend-share-data-works)。所有 Share 语句的语法参见 [Share SQL 参考](/sql/sql-commands/ddl/share)。
