---
title: GRANT TO SHARE
sidebar_position: 6
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="引入或更新于：v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

将提供方的数据库或表授权给 Share。

## 语法

```sql
GRANT USAGE ON DATABASE <database_name> TO SHARE <share_name>

GRANT SELECT ON TABLE [ <database_name>. ]<table_name> TO SHARE <share_name>
```

只支持这两种形式。未指定 `database_name` 时，Databend 使用当前数据库。

## 使用说明

- 先授予数据库的 `USAGE`，再授予每张表的 `SELECT`。只有 `USAGE` 不能访问表。
- 一个 Share 只能授权一个数据库，表必须位于该数据库中。
- 授权表前，Share 必须已设置连接。
- 表必须是不带行访问策略或掩码策略的 FUSE 表。
- 不能授权共享数据库。
- 重命名表后，授权保留。删除表后重新创建时，需要授权新表。

所需权限参见[访问控制](/guides/data-management/data-sharing#access-control)。

## 示例

```sql
GRANT USAGE ON DATABASE orders_db TO SHARE sales_share;
GRANT SELECT ON TABLE orders_db.orders TO SHARE sales_share;
```
