---
title: SHOW DROP DATABASES
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.658"/>

列出所有数据库及其删除时间戳（如果已被删除），允许用户查看已删除的数据库及其详细信息。

- 只有在数据保留期内的已删除数据库才能被检索。
- 建议使用 `root` 等管理员用户。如果您使用的是 Databend Cloud，请使用具有 `account_admin` 角色的用户来查询已删除的数据库。

另请参阅：[system.databases_with_history](../../../00-sql-reference/20-system-tables/system-databases-with-history.md)

## 语法

```sql
SHOW DROP DATABASES 
    [ FROM <catalog> ]
    [ LIKE '<pattern>' | WHERE <expr> ]
```

## 示例

```sql
-- 创建一个名为 my_db 的新数据库
CREATE DATABASE my_db;

-- 删除数据库 my_db
DROP DATABASE my_db;

-- 如果数据库已被删除，dropped_on 显示删除时间；
-- 如果数据库仍然处于活动状态，则 dropped_on 为 NULL。
SHOW DROP DATABASES;

┌─────────────────────────────────────────────────────────────────────────────────┐
│ catalog │        name        │     database_id     │         dropped_on         │
├─────────┼────────────────────┼─────────────────────┼────────────────────────────┤
│ default │ default            │                   1 │ NULL                       │
│ default │ information_schema │ 4611686018427387906 │ NULL                       │
│ default │ my_db              │                 114 │ 2024-11-15 02:44:46.207120 │
│ default │ system             │ 4611686018427387905 │ NULL                       │
└─────────────────────────────────────────────────────────────────────────────────┘
```