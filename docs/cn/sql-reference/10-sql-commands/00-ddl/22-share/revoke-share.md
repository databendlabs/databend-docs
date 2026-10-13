---
title: REVOKE FROM SHARE
sidebar_position: 7
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="引入或更新于：v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

从 Share 撤销数据库或表。源对象不变。

## 语法

```sql
REVOKE USAGE ON DATABASE <database_name> FROM SHARE <share_name>

REVOKE SELECT ON TABLE [ <database_name>. ]<table_name> FROM SHARE <share_name>
```

只支持这两种形式。未指定 `database_name` 时，Databend 使用当前数据库。

## 使用说明

- `REVOKE SELECT` 移除一张表的授权，其他表授权保留。
- 使用对象的当前名称。对旧名称或已删除对象执行 `REVOKE` 语句不产生任何作用。
- 移除消费方并保留授权时，使用 `ALTER SHARE ... REMOVE ACCOUNTS`。

:::caution
撤销数据库的 `USAGE` 时，同时移除 Share 中的所有表授权。
:::

所需权限参见[访问控制](/guides/data-management/data-sharing#access-control)。

## 示例

```sql
REVOKE SELECT ON TABLE orders_db.orders FROM SHARE sales_share;
REVOKE USAGE ON DATABASE orders_db FROM SHARE sales_share;
```
