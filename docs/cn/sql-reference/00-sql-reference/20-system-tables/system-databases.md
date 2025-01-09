---
title: system.databases
---

提供系统中所有数据库的元数据，包括它们的目录、名称、唯一ID、所有者以及删除时间戳。

另请参阅：[SHOW DATABASES](../../10-sql-commands/00-ddl/00-database/show-databases.md)

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

要显示 `system.databases` 的表结构，请使用 `DESCRIBE system.databases`：

```sql
DESCRIBE system.databases;

┌───────────────────────────────────────────────────────────┐
│    字段    │       类型      │  可为空  │ 默认值 │  额外  │
├─────────────┼─────────────────┼────────┼─────────┼────────┤
│ catalog     │ VARCHAR         │ 否     │ ''      │        │
│ name        │ VARCHAR         │ 否     │ ''      │        │
│ database_id │ BIGINT UNSIGNED │ 否     │ 0       │        │
│ owner       │ VARCHAR         │ 是     │ NULL    │        │
│ dropped_on  │ TIMESTAMP       │ 是     │ NULL    │        │
└───────────────────────────────────────────────────────────┘
```