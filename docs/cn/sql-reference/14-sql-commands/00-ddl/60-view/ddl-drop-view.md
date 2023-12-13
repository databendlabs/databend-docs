---
title: DROP VIEW
sidebar_position: 3
---

Drop the view.

## Syntax

```sql
DROP VIEW [IF EXISTS] [db.]view_name
```

## Examples

```sql
DROP VIEW IF EXISTS tmp_view;

SELECT * FROM tmp_view;
ERROR 1105 (HY000): Code: 1025, Text = Unknown table 'tmp_view'.
```