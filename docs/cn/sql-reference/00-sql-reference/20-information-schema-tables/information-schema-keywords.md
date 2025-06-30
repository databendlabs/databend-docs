---
title: information_schema.keywords
---

系统表 `information_schema.keywords` 是一个视图，提供了 Databend 中的所有关键字。

```sql
DESCRIBE information_schema.keywords

╭─────────────────────────────────────────────────────────╮
│   Field  │       Type       │  Null  │ Default │  Extra │
│  String  │      String      │ String │  String │ String │
├──────────┼──────────────────┼────────┼─────────┼────────┤
│ keywords │ VARCHAR          │ NO     │ ''      │        │
│ reserved │ TINYINT UNSIGNED │ NO     │ 0       │        │
╰─────────────────────────────────────────────────────────╯
```