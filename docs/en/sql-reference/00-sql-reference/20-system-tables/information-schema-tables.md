---
title: information_schema.tables
---

The `information_schema.tables` system table is a view that provides metadata about all tables across all databases, including their schema, type, engine, and creation details. It also includes storage metrics such as data length, index length, and row count, offering insights into table structure and usage.

See also: [system.tables](system-tables.md)

```sql title='Examples:'
SELECT * FROM information_schema.tables LIMIT 3;

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│    table_catalog   │    table_schema    │ table_name │ table_type │ engine │         create_time        │      drop_time      │    data_length   │   index_length   │    table_rows    │ auto_increment │ table_collation │ data_free │ table_comment │
├────────────────────┼────────────────────┼────────────┼────────────┼────────┼────────────────────────────┼─────────────────────┼──────────────────┼──────────────────┼──────────────────┼────────────────┼─────────────────┼───────────┼───────────────┤
│ default            │ default            │ json_table │ BASE TABLE │ FUSE   │ 2024-11-18 23:22:21.576421 │ NULL                │               68 │              425 │                1 │ NULL           │ NULL            │ NULL      │               │
│ information_schema │ information_schema │ views      │ VIEW       │ VIEW   │ 2024-11-20 21:04:12.952792 │ NULL                │             NULL │             NULL │             NULL │ NULL           │ NULL            │ NULL      │               │
│ information_schema │ information_schema │ statistics │ VIEW       │ VIEW   │ 2024-11-20 21:04:12.952795 │ NULL                │             NULL │             NULL │             NULL │ NULL           │ NULL            │ NULL      │               │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

To show the schema of `information_schema.tables`, use `DESCRIBE information_schema.tables`:

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