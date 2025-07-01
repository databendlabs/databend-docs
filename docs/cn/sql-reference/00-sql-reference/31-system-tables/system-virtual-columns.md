---
title: system.virtual_columns
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.262"/>

包含系统中已创建的虚拟列 (Virtual Column) 的信息。

另请参阅：[SHOW VIRTUAL COLUMNS](../../10-sql-commands/00-ddl/07-virtual-column/show-virtual-columns.md)

```sql
SET enable_experimental_virtual_column=1;

SELECT * FROM system.virtual_columns;

╭───────────────────────────────────────────────────────────────────────────────────────────────────╮
│ database │  table │ source_column │ virtual_column_id │ virtual_column_name │ virtual_column_type │
│  String  │ String │     String    │       UInt32      │        String       │        String       │
├──────────┼────────┼───────────────┼───────────────────┼─────────────────────┼─────────────────────┤
│ default  │ test   │ val           │        3000000000 │ ['id']              │ UInt64              │
│ default  │ test   │ val           │        3000000001 │ ['name']            │ String              │
╰───────────────────────────────────────────────────────────────────────────────────────────────────╯
```