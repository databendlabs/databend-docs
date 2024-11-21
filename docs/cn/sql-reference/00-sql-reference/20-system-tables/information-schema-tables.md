---
title: information_schema.tables
---

`information_schema.tables` 系统表是一个视图，提供了所有数据库中所有表的元数据，包括它们的模式、类型、引擎和创建细节。它还包括存储指标，如数据长度、索引长度和行数，提供了对表结构和使用的洞察。

另请参阅: [system.tables](system-tables.md)

```sql title='示例:'
SELECT * FROM information_schema.tables LIMIT 3;

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│    table_catalog   │    table_schema    │ table_name │ table_type │ engine │         create_time        │      drop_time      │    data_length   │   index_length   │    table_rows    │ auto_increment │ table_collation │ data_free │ table_comment │
├────────────────────┼────────────────────┼────────────┼────────────┼────────┼────────────────────────────┼─────────────────────┼──────────────────┼──────────────────┼──────────────────┼────────────────┼─────────────────┼───────────┼───────────────┤
│ default            │ default            │ json_table │ BASE TABLE │ FUSE   │ 2024-11-18 23:22:21.576421 │ NULL                │               68 │              425 │                1 │ NULL           │ NULL            │ NULL      │               │
│ information_schema │ information_schema │ views      │ VIEW       │ VIEW   │ 2024-11-20 21:04:12.952792 │ NULL                │             NULL │             NULL │             NULL │ NULL           │ NULL            │ NULL      │               │
│ information_schema │ information_schema │ statistics │ VIEW       │ VIEW   │ 2024-11-20 21:04:12.952795 │ NULL                │             NULL │             NULL │             NULL │ NULL           │ NULL            │ NULL      │               │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

要显示 `information_schema.tables` 的模式，请使用 `DESCRIBE information_schema.tables`:

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