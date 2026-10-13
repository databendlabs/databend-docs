---
title: 使用共享数据
sidebar_label: 消费方配置
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="引入或更新于：v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

在消费方租户中执行以下步骤。提供方必须先完成[提供方配置](01-providers.md)中的步骤。

## 创建共享数据库

### 1. 获取消费方租户 ID

```sql
SELECT CURRENT_TENANT_ID();
```

将此 ID 发送给提供方。提供方将其添加到 Share 的消费方账号中。

### 2. 查找 Share

```sql
SHOW SHARES;
```

找到 `kind` 列显示 `INBOUND` 的行。记录 `owner_account` 列和 `name` 列的值。这两个值分别是提供方租户 ID 和 Share 名称。

### 3. 检查共享对象

```sql
DESCRIBE SHARE provider_acct.sales_share;
```

确认 Share 授权了你需要的数据库和表。

### 4. 创建共享数据库

```sql
CREATE DATABASE shared_orders FROM SHARE provider_acct.sales_share;
```

如果提供方租户 ID 包含大写字母或特殊字符，将 ID 放在反引号中：

```sql
CREATE DATABASE shared_orders FROM SHARE `provider-tenant`.sales_share;
```

在默认 catalog 中创建共享数据库。不要在 `FROM SHARE` 中使用 `ENGINE` 或 `OPTIONS`。

### 5. 查询数据

```sql
SHOW TABLES FROM shared_orders;
SELECT id, region, amount FROM shared_orders.orders ORDER BY id;
```

共享数据库只显示已授权的表。提供方的新数据在后续查询中可见。

## 使用共享数据库

- 创建共享数据库的角色拥有该数据库。所有者可以向消费方租户中的其他角色授权访问。
- 本地授权不能替代提供方的授权。如果提供方移除访问权限，本地授权不能提供访问。
- 共享表为只读。修改数据或表定义的语句会失败。`OPTIMIZE` 和 `VACUUM` 也会失败。
- 可以基于同一 Share 创建多个共享数据库。

## 共享表上的 Stream {/* #streams-on-shared-tables */}

消费方可以在共享表上创建 Stream。将 Stream 放在本地数据库中，不要放在共享数据库中。每个 Stream 都有自己的偏移量。

- 提供方必须在源表上启用变更跟踪。
- 创建 Stream 时，你必须具有本地数据库的 `CREATE` 权限。
- 在自托管 Databend 中，许可证还必须包含 Stream 功能。

### 1. 启用变更跟踪

在提供方会话中执行以下语句：

```sql
ALTER TABLE orders_db.orders SET OPTIONS(change_tracking = true);
```

### 2. 创建本地数据库

在消费方会话中执行以下语句：

```sql
CREATE DATABASE local_analytics;
```

### 3. 创建 Stream

```sql
CREATE STREAM local_analytics.order_changes ON TABLE shared_orders.orders;
```

默认 Stream 模式为追加模式。标准模式 Stream 需要添加 `APPEND_ONLY = false`。

### 4. 消费变更

```sql
CREATE TABLE local_analytics.order_sink (id INT, region STRING, amount INT);

INSERT INTO local_analytics.order_sink
    SELECT id, region, amount FROM local_analytics.order_changes;
```

单独的 `SELECT` 语句不会移动偏移量。成功的 `INSERT` 只移动此 Stream 的偏移量。

以下情况会使 Stream 失效：

- 提供方删除源表。
- 你删除共享数据库。
- 源表的变更跟踪中断了一段时间。

出现这些情况时，重新创建 Stream。Stream 语法参见 [CREATE STREAM](/sql/sql-commands/ddl/stream/create-stream)。

## 删除共享数据库

:::warning
删除共享数据库后，其上的 Stream 会失效。同名的新数据库不能修复这些 Stream。
:::

```sql
DROP DATABASE shared_orders;
```

此语句不删除提供方数据。在自托管 Databend 中，此语句不需要 `DataSharing` 许可功能。
