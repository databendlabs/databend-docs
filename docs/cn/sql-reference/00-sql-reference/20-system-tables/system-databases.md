---
title: system.databases
---

提供系统中所有数据库的元数据，包括它们的目录、名称、唯一ID、所有者和删除时间戳。

另请参阅: [SHOW DATABASES](../../10-sql-commands/00-ddl/00-database/show-databases.md)

```sql title='示例:'
SELECT * FROM system.databases;

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ catalog │        name        │     database_id     │       owner      │      dropped_on     │
├─────────┼────────────────────┼─────────────────────┼──────────────────┼─────────────────────┤
│ default │ system             │ 4611686018427387905 │ NULL             │ NULL                │
│ default │ information_schema │ 4611686018427387906 │ NULL             │ NULL                │
│ default │ default            │                   1 │ NULL             │ NULL                │
│ default │ doc                │                2597 │ account_admin    │ NULL                │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

要显示 `system.databases` 的架构，请使用 `DESCRIBE system.databases`:

```sql
DESCRIBE system.databases;

┌───────────────────────────────────────────────────────────┐
│    Field    │       Type      │  Null  │ Default │  Extra │
├─────────────┼─────────────────┼────────┼─────────┼────────┤
│ catalog     │ VARCHAR         │ NO     │ ''      │        │
│ name        │ VARCHAR         │ NO     │ ''      │        │
│ database_id │ BIGINT UNSIGNED │ NO     │ 0       │        │
│ owner       │ VARCHAR         │ YES    │ NULL    │        │
│ dropped_on  │ TIMESTAMP       │ YES    │ NULL    │        │
└───────────────────────────────────────────────────────────┘
```