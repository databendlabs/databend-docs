---
title: system.databases_with_history
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.1.658"/>

记录所有数据库，包括活跃和已删除的数据库。显示每个数据库的目录 (Catalog)、名称、唯一 ID (Unique ID)、所有者 (Owner)（如果已指定）以及删除时间戳 (Deletion Timestamp)（如果仍处于活跃状态，则为 NULL）。

另请参阅：[SHOW DROP DATABASES](../../10-sql-commands/00-ddl/00-database/show-drop-databases.md)

```sql
SELECT * FROM system.databases_with_history;

┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ catalog │        name        │     database_id     │       owner      │         dropped_on         │
├─────────┼────────────────────┼─────────────────────┼──────────────────┼────────────────────────────┤
│ default │ system             │ 4611686018427387905 │ NULL             │ NULL                       │
│ default │ information_schema │ 4611686018427387906 │ NULL             │ NULL                       │
│ default │ default            │                   1 │ NULL             │ NULL                       │
│ default │ my_db              │                 114 │ NULL             │ 2024-11-15 02:44:46.207120 │
└────────────────────────────────────────────────────────────────────────────────────────────────────┘
```