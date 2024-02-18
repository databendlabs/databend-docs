---
title: 删除视图
sidebar_position: 3
---

删除视图。

## 语法

```sql
DROP VIEW [ IF EXISTS ] [ <database_name>. ]view_name
```

## 示例

```sql
DROP VIEW IF EXISTS tmp_view;

SELECT * FROM tmp_view;
ERROR 1105 (HY000): Code: 1025, Text = 未知的表 'tmp_view'。
```