---
title: ALTER VIEW
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.930"/>

Assigns or removes tags on an existing view. Tags must be created with [CREATE TAG](../08-tag/01-ddl-create-tag.md) first. For full details, see [SET TAG / UNSET TAG](../08-tag/04-ddl-set-tag.md).

:::note
`ALTER VIEW ... AS ...` is not supported. To change a view's query or output columns, use [CREATE OR REPLACE VIEW](ddl-create-view.md).
:::

## Syntax

```sql
ALTER VIEW [ IF EXISTS ] [ <database_name>. ]<view_name>
    SET TAG <tag_name> = '<value>' [, <tag_name> = '<value>' ...]

ALTER VIEW [ IF EXISTS ] [ <database_name>. ]<view_name>
    UNSET TAG <tag_name> [, <tag_name> ...]
```

## Examples

```sql
ALTER VIEW default.active_users SET TAG env = 'prod', owner = 'analytics';
ALTER VIEW default.active_users UNSET TAG env, owner;
```
