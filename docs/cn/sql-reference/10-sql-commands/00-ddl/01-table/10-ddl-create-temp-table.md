---
title: CREATE TEMP TABLE
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.666"/>

创建一个临时表，该表在会话结束时自动删除。

- 临时表仅在创建它的会话中可见，并且在会话结束时自动删除，所有数据都会被清理。
       - 如果临时表的自动清理失败（例如，由于查询节点崩溃），您可以使用 [FUSE_VACUUM_TEMPORARY_TABLE](../../../20-sql-functions/17-table-functions/fuse-vacuum-temporary-table.md) 函数手动清理临时表的剩余文件。
- 要显示会话中现有的临时表，请查询 [system.temporary_tables](../../../00-sql-reference/20-system-tables/system-temp-tables.md) 系统表。请参见 [Example-1](#example-1)。
- 与普通表同名的临时表优先，在删除之前会隐藏普通表。请参见 [Example-2](#example-2)。
- 创建或操作临时表不需要任何权限。
- Databend 支持使用 [Fuse Engine](../../../00-sql-reference/30-table-engines/00-fuse.md) 和 [Memory Engine](../../../00-sql-reference/30-table-engines/01-memory.md) 创建临时表。
- 要使用 BendSQL 创建临时表，请确保您使用的是最新版本的 BendSQL。

## 语法

```sql
CREATE [ OR REPLACE ] { TEMPORARY | TEMP } TABLE 
       [ IF NOT EXISTS ] 
       [ <database_name>. ]<table_name>
       ...
```

省略的部分遵循 [CREATE TABLE](10-ddl-create-table.md) 的语法。

## 示例

### Example-1

此示例演示如何创建一个临时表，并通过查询 [system.temporary_tables](../../../00-sql-reference/20-system-tables/system-temp-tables.md) 系统表来验证其存在：

```sql
CREATE TEMP TABLE my_table (id INT, description STRING);

SELECT * FROM system.temporary_tables;

┌────────────────────────────────────────────────────┐
│ database │   name   │       table_id      │ engine │
├──────────┼──────────┼─────────────────────┼────────┤
│ default  │ my_table │ 4611686018427407904 │ FUSE   │
└────────────────────────────────────────────────────┘
```

### Example-2

此示例演示了与普通表同名的临时表如何优先。当两个表都存在时，操作目标是临时表，从而有效地隐藏了普通表。删除临时表后，可以再次访问普通表：

```sql
-- Create a normal table
CREATE TABLE my_table (id INT, name STRING);

-- Insert data into the normal table
INSERT INTO my_table VALUES (1, 'Alice'), (2, 'Bob');

-- Create a temporary table with the same name
CREATE TEMP TABLE my_table (id INT, description STRING);

-- Insert data into the temporary table
INSERT INTO my_table VALUES (1, 'Temp Data');

-- Query the table: This will access the temporary table, hiding the normal table
SELECT * FROM my_table;

┌────────────────────────────────────┐
│        id       │    description   │
├─────────────────┼──────────────────┤
│               1 │ Temp Data        │
└────────────────────────────────────┘

-- Drop the temporary table
DROP TABLE my_table;

-- Query the table again: Now the normal table is accessible
SELECT * FROM my_table;

┌────────────────────────────────────┐
│        id       │       name       │
├─────────────────┼──────────────────┤
│               1 │ Alice            │
│               2 │ Bob              │
└────────────────────────────────────┘
```