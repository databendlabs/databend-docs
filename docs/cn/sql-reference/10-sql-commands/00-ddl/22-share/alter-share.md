---
title: ALTER SHARE
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="引入或更新于：v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

修改 Share 的消费方账号、连接或注释。

## 语法

```sql
ALTER SHARE [ IF EXISTS ] <share_name>
    ADD ACCOUNTS = <tenant_id> [, <tenant_id> ... ]

ALTER SHARE [ IF EXISTS ] <share_name>
    REMOVE ACCOUNTS = <tenant_id> [, <tenant_id> ... ]

ALTER SHARE [ IF EXISTS ] <share_name> SET
    [ ACCOUNTS = <tenant_id> [, <tenant_id> ... ] ]
    [ CONNECTION = <connection_name> ]
    [ COMMENT = '<comment>' ]
```

| 子句 | 描述 |
| --- | --- |
| `ADD ACCOUNTS` | 添加消费方账号。列表中已有的账号保留。 |
| `REMOVE ACCOUNTS` | 移除消费方账号。其他账号保留。 |
| `SET ACCOUNTS` | 替换完整的消费方账号列表。 |
| `SET CONNECTION` | 替换连接。消费方保持访问权限。 |
| `SET COMMENT` | 替换注释。 |

## 使用说明

- 租户 ID 不是用户名，也不是角色名。使用 [CURRENT_TENANT_ID](/sql/sql-functions/context-functions/current-tenant-id) 获取租户 ID。
- 如果租户 ID 包含大写字母或特殊字符，将 ID 放在反引号中。
- `ADD ACCOUNTS` 和 `SET ACCOUNTS` 需要连接。`SET` 可以在同一语句中设置连接。
- `SET` 需要一个或多个属性。
- Databend 针对所有已授权表检查新连接。如果检查失败，Share 保留原连接。

:::caution
`SET ACCOUNTS` 替换完整列表。语句中未列出的账号失去访问权限。
:::

所需权限参见[访问控制](/guides/data-management/data-sharing#access-control)。操作步骤参见[管理 Share](/guides/data-management/data-sharing/manage-shares)。

## 示例

```sql
ALTER SHARE sales_share ADD ACCOUNTS = consumer_acct, `consumer-tenant`;
ALTER SHARE sales_share REMOVE ACCOUNTS = `consumer-tenant`;
ALTER SHARE sales_share SET ACCOUNTS = consumer_acct;
ALTER SHARE sales_share SET CONNECTION = replacement_conn;
ALTER SHARE sales_share SET COMMENT = 'Updated description';
```
