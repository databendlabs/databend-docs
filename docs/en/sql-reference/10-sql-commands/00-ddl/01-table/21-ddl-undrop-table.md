---
title: UNDROP TABLE
sidebar_position: 20
---

Restores the recent version of a dropped table. This leverages the Databend Time Travel feature; a dropped object can be restored only within a retention period (defaults to 24 hours).

**See also:**
- [CREATE TABLE](./10-ddl-create-table.md)
- [DROP TABLE](./20-ddl-drop-table.md)
- [SHOW TABLES](show-tables.md)

## Syntax

```sql
UNDROP TABLE [<database_name>.]<table_name>
```

If a table with the same name already exists, an error is returned.

## Examples

```sql
CREATE TABLE test(a INT, b VARCHAR);

-- drop table
DROP TABLE test;

-- show dropped tables from current database
SHOW TABLES HISTORY;

┌────────────────────────────────────────────────────┐
│ Tables_in_orders_2024 │          drop_time         │
├───────────────────────┼────────────────────────────┤
│ test                  │ 2024-01-23 04:56:34.766820 │
└────────────────────────────────────────────────────┘

-- restore table
UNDROP TABLE test;
```