---
title: ALTER VIEW
sidebar_position: 2
---

通过使用另一个 `QUERY` 来更改现有视图。

## Syntax

```sql
ALTER VIEW [ <database_name>. ]view_name [ (<column>, ...) ] AS SELECT query
```

## Examples

```sql
CREATE VIEW tmp_view AS SELECT number % 3 AS a, avg(number) FROM numbers(1000) GROUP BY a ORDER BY a;

SELECT * FROM tmp_view;
+------+-------------+
| a    | avg(number) |
+------+-------------+
|    0 |       499.5 |
|    1 |       499.0 |
|    2 |       500.0 |
+------+-------------+

ALTER VIEW tmp_view(c1) AS SELECT * from numbers(3);

SELECT * FROM tmp_view;
+------+
| c1   |
+------+
|    0 |
|    1 |
|    2 |
+------+
```

## Tag 操作

为视图分配或移除 Tag。Tag 必须先通过 [CREATE TAG](../08-tag/01-ddl-create-tag.md) 创建。完整说明请参阅 [SET TAG / UNSET TAG](../08-tag/04-ddl-set-tag.md)。

### 语法

```sql
ALTER VIEW [ IF EXISTS ] [ <database_name>. ]<view_name>
    SET TAG <tag_name> = '<value>' [, <tag_name> = '<value>' ...]

ALTER VIEW [ IF EXISTS ] [ <database_name>. ]<view_name>
    UNSET TAG <tag_name> [, <tag_name> ...]
```

### 示例

```sql
ALTER VIEW default.active_users SET TAG env = 'prod', owner = 'analytics';
ALTER VIEW default.active_users UNSET TAG env, owner;
```