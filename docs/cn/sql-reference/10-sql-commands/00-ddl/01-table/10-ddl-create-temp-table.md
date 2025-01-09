---
title: 创建临时表
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.666"/>

创建一个在会话结束时自动删除的临时表。

- 临时表仅在创建它的会话中可见，并在会话结束时自动删除，所有数据都会被清理。
       - 如果临时表的自动清理失败——例如，由于查询节点崩溃——你可以使用 [FUSE_VACUUM_TEMPORARY_TABLE](../../../20-sql-functions/17-table-functions/fuse-vacuum-temporary-table.md) 函数手动清理临时表残留的文件。
- 要显示会话中现有的临时表，可以查询 [system.temporary_tables](../../../00-sql-reference/20-system-tables/system-temp-tables.md) 系统表。参见 [示例-1](#example-1)。
- 如果临时表与普通表同名，临时表将优先，隐藏普通表直到临时表被删除。参见 [示例-2](#example-2)。
- 创建或操作临时表不需要任何权限。
- Databend 支持使用 [Fuse Engine](../../../00-sql-reference/30-table-engines/00-fuse.md) 和 [Memory Engine](../../../00-sql-reference/30-table-engines/01-memory.md) 创建临时表。
- 使用 BendSQL 创建临时表时，请确保你使用的是最新版本的 BendSQL。

## 语法

```sql
CREATE [ OR REPLACE ] { TEMPORARY | TEMP } TABLE 
       [ IF NOT EXISTS ] 
       [ <database_name>. ]<table_name>
       ...
```

省略的部分遵循 [CREATE TABLE](10-ddl-create-table.md) 的语法。

## 示例

### 示例-1

此示例演示如何创建临时表并通过查询 [system.temporary_tables](../../../00-sql-reference/20-system-tables/system-temp-tables.md) 系统表来验证其存在：

```sql
CREATE TEMP TABLE my_table (id INT, description STRING);

SELECT * FROM system.temporary_tables;

┌────────────────────────────────────────────────────┐
│ database │   name   │       table_id      │ engine │
├──────────┼──────────┼─────────────────────┼────────┤
│ default  │ my_table │ 4611686018427407904 │ FUSE   │
└────────────────────────────────────────────────────┘
```

### 示例-2

此示例演示了与普通表同名的临时表如何优先。当两个表都存在时，操作将针对临时表，从而有效地隐藏普通表。一旦临时表被删除，普通表将再次可访问：

```sql
-- 创建一个普通表
CREATE TABLE my_table (id INT, name STRING);

-- 向普通表插入数据
INSERT INTO my_table VALUES (1, 'Alice'), (2, 'Bob');

-- 创建一个同名的临时表
CREATE TEMP TABLE my_table (id INT, description STRING);

-- 向临时表插入数据
INSERT INTO my_table VALUES (1, 'Temp Data');

-- 查询表：这将访问临时表，隐藏普通表
SELECT * FROM my_table;

┌────────────────────────────────────┐
│        id       │    description   │
├─────────────────┼──────────────────┤
│               1 │ Temp Data        │
└────────────────────────────────────┘

-- 删除临时表
DROP TABLE my_table;

-- 再次查询表：现在普通表可访问
SELECT * FROM my_table;

┌────────────────────────────────────┐
│        id       │       name       │
├─────────────────┼──────────────────┤
│               1 │ Alice            │
│               2 │ Bob              │
└────────────────────────────────────┘
```