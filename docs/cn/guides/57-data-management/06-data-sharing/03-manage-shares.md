---
title: 管理 Share
sidebar_label: 管理 Share
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="引入或更新于：v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

在提供方租户中执行以下操作。所需权限参见[访问控制](index.md#access-control)。

变更对后续查询生效。正在执行的查询会继续执行。

## 管理消费方账号

| 语句 | 结果 |
| --- | --- |
| `ALTER SHARE sales_share ADD ACCOUNTS = a, b` | 添加账号。列表中已有的账号保留。 |
| `ALTER SHARE sales_share REMOVE ACCOUNTS = a` | 移除账号。其他账号保留。 |
| `ALTER SHARE sales_share SET ACCOUNTS = a, b` | 替换完整列表。语句中未列出的账号失去访问权限。 |

:::caution
`SET ACCOUNTS` 替换完整列表。添加或移除单个账号时，使用 `ADD ACCOUNTS` 或 `REMOVE ACCOUNTS`。
:::

移除账号后，消费方无法读取共享数据库。重新添加该账号后，消费方可以再次读取共享数据库。

### 配置空 Share

可以创建不带连接的 Share：

```sql
CREATE SHARE pending_share;
```

然后在一条语句中设置账号和连接：

```sql
ALTER SHARE pending_share SET
    ACCOUNTS = consumer_acct
    CONNECTION = share_conn
    COMMENT = 'Ready for consumers';
```

`ADD ACCOUNTS` 和 `SET ACCOUNTS` 需要连接。`SET` 可以在同一语句中设置连接。

## 更换连接 {/* #change-the-connection */}

使用以下步骤更换凭证。消费方保持访问权限。

1. 创建新连接。使用与已授权表相同的存储类型。
2. 在 Share 上设置新连接：

   ```sql
   ALTER SHARE sales_share SET CONNECTION = replacement_conn;
   ```

Databend 针对所有已授权表检查新连接。如果检查失败，Share 保留原连接。

完成第 2 步前，不要删除原连接。如果 Databend 找不到连接，读取会失败。

:::note
此步骤只更换消费方读取使用的凭证。外部位置表保存其连接设置的副本。更换提供方表的凭证时，使用 [ALTER TABLE ... CONNECTION](/sql/sql-commands/ddl/table/alter-table#外部表连接)。
:::

## 更改授权

在 `GRANT` 和 `REVOKE` 语句中使用对象的当前名称。

停止共享单张表时，执行以下语句：

```sql
REVOKE SELECT ON TABLE orders_db.orders FROM SHARE sales_share;
```

其他表授权保留。再次授权同一张表即可恢复访问。

:::caution
撤销数据库的 `USAGE` 时，Databend 同时移除 Share 中的所有表授权。
:::

```sql
REVOKE USAGE ON DATABASE orders_db FROM SHARE sales_share;
```

恢复访问时，先授权数据库，再授权每张表。

重命名后，撤销新名称。对旧名称或已删除对象执行 `REVOKE` 语句不产生任何作用。

提供方删除表后，其授权可能保留在 Share 中。`DESCRIBE SHARE` 可能以不完整的名称显示该授权。该授权不能访问同名的新表。

## 生命周期与恢复 {/* #lifecycle-and-recovery */}

| 提供方操作 | 对消费方的结果 | 恢复方式 |
| --- | --- | --- |
| 插入数据。 | 后续查询显示新数据。 | 不需要。 |
| 重命名表。 | 共享数据库显示新名称。 | 在查询中使用新名称。 |
| 重命名数据库。 | 共享数据库继续工作，其名称不变。 | 不需要。 |
| 撤销表的 `SELECT`。 | 消费方无法读取该表。 | 再次授权同一张表。 |
| 撤销数据库的 `USAGE`。 | 消费方无法读取共享数据库。所有表授权被移除。 | 再次授权数据库和每张表。 |
| 移除消费方账号。 | 消费方无法读取共享数据库。 | 再次添加该账号。 |
| 设置兼容的连接。 | 读取使用新凭证。 | 不需要。 |
| 删除连接。 | 读取失败。 | 重新创建连接，或设置其他连接。 |
| 向共享表添加行访问策略或掩码策略。 | Databend 拒绝该操作。 | 不适用。 |
| 删除表后重新创建。 | 新表是不同的对象，原授权不适用于新表。 | 授权新表。消费方重新创建其 Stream。 |
| 删除数据库后重新创建。 | 共享数据库停止工作。 | 授权新数据库和表。消费方重新创建共享数据库。 |
| 删除或替换 Share。 | 共享数据库停止工作。 | 配置新 Share。消费方重新创建共享数据库。 |

### 重新创建共享数据库

开始前，在提供方配置好 Share、授权和消费方账号。

:::warning
以下步骤会删除共享数据库，其上的 Stream 会失效。提供方数据不变。
:::

1. 在消费方会话中删除共享数据库：

   ```sql
   DROP DATABASE shared_orders;
   ```

2. 基于当前 Share 创建共享数据库：

   ```sql
   CREATE DATABASE shared_orders FROM SHARE provider_acct.sales_share;
   ```

3. 重新创建 Stream。

`CREATE DATABASE IF NOT EXISTS` 不能修复已存在的共享数据库。

## 删除 Share

```sql
DROP SHARE sales_share;
```

此语句不删除提供方表或连接。消费方的共享数据库保留，但读取会失败。

同名的新 Share 是不同的 Share，不能修复共享数据库。

错误处理参见[故障排查](04-troubleshooting.md)。完整语法参见 [Share SQL 参考](/sql/sql-commands/ddl/share)。
