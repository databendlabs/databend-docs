---
title: ALTER VIEW
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.930"/>

为现有视图分配或移除 Tag。Tag 必须先通过 [CREATE TAG](../08-tag/01-ddl-create-tag.md) 创建。完整说明请参阅 [SET TAG / UNSET TAG](../08-tag/04-ddl-set-tag.md)。

:::note
不支持 `ALTER VIEW ... AS ...`。如需更改视图的查询或输出列，请使用 [CREATE OR REPLACE VIEW](ddl-create-view.md)。
:::

## 语法

```sql
ALTER VIEW [ IF EXISTS ] [ <database_name>. ]<view_name>
    SET TAG <tag_name> = '<value>' [, <tag_name> = '<value>' ...]

ALTER VIEW [ IF EXISTS ] [ <database_name>. ]<view_name>
    UNSET TAG <tag_name> [, <tag_name> ...]
```

## 示例

```sql
ALTER VIEW default.active_users SET TAG env = 'prod', owner = 'analytics';
ALTER VIEW default.active_users UNSET TAG env, owner;
```
