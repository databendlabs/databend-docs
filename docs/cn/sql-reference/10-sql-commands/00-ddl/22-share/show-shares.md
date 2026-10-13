---
title: SHOW SHARES
sidebar_position: 4
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="引入或更新于：v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

显示当前租户的 Share（`OUTBOUND`）和授权给当前租户的 Share（`INBOUND`）。

## 语法

```sql
SHOW SHARES [ LIKE '<pattern>' ] [ LIMIT <rows> ]
```

`LIKE` 按 Share 名称筛选。不支持 `WHERE`。

## 输出

| 列 | 描述 |
| --- | --- |
| `created_on` | 创建时间。 |
| `kind` | `OUTBOUND` 或 `INBOUND`。 |
| `owner_account` | 提供方租户 ID。 |
| `name` | Share 名称。 |
| `database_name` | 已授权数据库的名称。Share 未授权数据库时为空。 |
| `to` | 消费方账号。`INBOUND` Share 为空。 |
| `owner` | 未使用，始终为空。 |
| `comment` | 注释。 |
| `listing_global_name` | 未使用，始终为空。 |

所需权限参见[访问控制](/guides/data-management/data-sharing#access-control)。

## 示例

```sql
SHOW SHARES;
SHOW SHARES LIKE 'sales%' LIMIT 10;
```
