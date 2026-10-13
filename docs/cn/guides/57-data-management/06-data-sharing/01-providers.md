---
title: 作为提供方共享数据
sidebar_label: 提供方配置
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="引入或更新于：v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

在提供方租户中执行以下步骤。开始前，确认已满足[要求](index.md#prerequisites)。

示例使用提供方租户 `provider_acct` 和消费方租户 `consumer_acct`。

## 存储配置 {/* #storage-setup */}

将共享表放在提供方连接可以读取的位置。

| 部署方式 | 表的位置 |
| --- | --- |
| **Databend Cloud** | 使用存放在你自有 bucket 中的外部位置表。Databend Cloud 管理默认存储，你没有其凭证。 |
| **自托管 Databend** | 使用外部位置表，或默认存储中的表。使用默认存储时，连接必须具有默认存储的读取权限。 |

连接的存储类型必须与表的存储类型相同。连接选项参见 [CREATE CONNECTION](/sql/sql-commands/ddl/connection/create-connection)。

自托管 Databend 使用文件系统存储时，使用不带参数的 `fs` 连接。消费方查询节点必须能够访问相同的文件。

## 创建 Share

### 1. 获取提供方租户 ID

```sql
SELECT CURRENT_TENANT_ID();
```

将此 ID 发送给消费方。消费方使用该 ID 创建共享数据库。

### 2. 创建连接

将占位符替换为你的凭证。凭证必须具有该 bucket 的读写权限。

```sql
CREATE CONNECTION share_conn
    STORAGE_TYPE = 's3'
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>';
```

可以使用 IAM 角色代替访问密钥。使用非 AWS 的 S3 兼容存储时，添加 `ENDPOINT_URL`。

示例中，表和 Share 使用此连接。Share 连接只需要读取权限。在生产环境中，可以为 Share 另建一个只读连接。

### 3. 准备源数据

如果共享已有表，跳过此步骤。

```sql
CREATE DATABASE orders_db;
CREATE TABLE orders_db.orders (id INT, region STRING, amount INT)
    's3://<your-bucket>/orders_db/'
    CONNECTION = (CONNECTION_NAME = 'share_conn');
INSERT INTO orders_db.orders VALUES (1, 'apac', 100), (2, 'emea', 200);
```

该表是 FUSE 表，数据存放在你的 bucket 中。

本数据库的其他表也可以使用同一位置。Databend 将每张表的数据存放在不同的子目录中。语法参见 [CREATE EXTERNAL TABLE](/sql/sql-commands/ddl/table/ddl-create-table-external-location)。

### 4. 创建 Share

:::caution
不要使用 `CREATE OR REPLACE SHARE` 更换凭证。该语句会创建新的 Share，之后每个消费方都必须重新创建共享数据库。更换凭证参见[更换连接](03-manage-shares.md#change-the-connection)。
:::

```sql
CREATE SHARE sales_share
    CONNECTION = share_conn
    COMMENT = 'Shared order data';
```

### 5. 授权数据库

```sql
GRANT USAGE ON DATABASE orders_db TO SHARE sales_share;
```

此授权不能访问表。在下一步中授权每张表。

### 6. 授权表

```sql
GRANT SELECT ON TABLE orders_db.orders TO SHARE sales_share;
```

表必须位于已授权的数据库中。表必须是不带行访问策略或掩码策略的 FUSE 表。

### 7. 添加消费方账号

从消费方获取租户 ID，然后执行以下语句：

```sql
ALTER SHARE sales_share ADD ACCOUNTS = consumer_acct;
```

如果 ID 包含大写字母或连字符等特殊字符，将 ID 放在反引号中：

```sql
ALTER SHARE sales_share ADD ACCOUNTS = `consumer-tenant`;
```

:::note
`ADD ACCOUNTS` 向列表中添加账号。`SET ACCOUNTS` 替换完整列表。
:::

### 8. 检查 Share

```sql
DESCRIBE SHARE sales_share;
SHOW SHARES LIKE 'sales_share';
```

确认 `DESCRIBE SHARE` 显示 `orders_db` 的 `DATABASE` 行和 `orders_db.orders` 的 `TABLE` 行。

确认 `SHOW SHARES` 的 `kind` 列显示 `OUTBOUND`，且 `to` 列包含消费方租户 ID。

## 后续步骤

将提供方租户 ID 和 Share 名称发送给消费方。消费方随后执行[消费方配置](02-consumers.md)中的步骤。

更改消费方账号、授权或连接，参见[管理 Share](03-manage-shares.md)。
