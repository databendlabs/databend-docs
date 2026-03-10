---
title: information_schema.tables
---

`information_schema.tables` 系统表是一个视图 (View)，提供所有数据库中所有表的元数据 (Metadata)，包括它们的模式 (Schema)、类型、引擎和创建细节。它还包括存储指标 (Storage Metrics)，例如数据长度、索引长度和行数，从而提供对表结构和使用情况的深入了解。

```sql
DESCRIBE information_schema.tables;

┌────────────────────────────────────────────────────────────────────────────────────┐
│      Field      │       Type      │  Null  │            Default           │  Extra │
├─────────────────┼─────────────────┼────────┼──────────────────────────────┼────────┤
│ table_catalog   │ VARCHAR         │ NO     │ ''                           │        │
│ table_schema    │ VARCHAR         │ NO     │ ''                           │        │
│ table_name      │ VARCHAR         │ NO     │ ''                           │        │
│ table_type      │ VARCHAR         │ NO     │ ''                           │        │
│ engine          │ VARCHAR         │ NO     │ ''                           │        │
│ create_time     │ TIMESTAMP       │ NO     │ '1970-01-01 00:00:00.000000' │        │
│ drop_time       │ TIMESTAMP       │ YES    │ NULL                         │        │
│ data_length     │ BIGINT UNSIGNED │ YES    │ NULL                         │        │
│ index_length    │ BIGINT UNSIGNED │ YES    │ NULL                         │        │
│ table_rows      │ BIGINT UNSIGNED │ YES    │ NULL                         │        │
│ auto_increment  │ NULL            │ NO     │ NULL                         │        │
│ table_collation │ NULL            │ NO     │ NULL                         │        │
│ data_free       │ NULL            │ NO     │ NULL                         │        │
│ table_comment   │ VARCHAR         │ NO     │ ''                           │        │
└────────────────────────────────────────────────────────────────────────────────────┘
```