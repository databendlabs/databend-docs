---
title: UNDROP TABLE
sidebar_position: 20
---

恢复最近删除的表。这利用了 Databend 的时间回溯功能；删除的对象只能在保留期内恢复（默认为 24 小时）。

**参见：**
- [CREATE TABLE](./10-ddl-create-table.md)
- [DROP TABLE](./20-ddl-drop-table.md)
- [SHOW TABLES](show-tables.md)
- [SHOW DROP TABLES](show-drop-tables.md)

## 语法

```sql
UNDROP TABLE [ <database_name>. ]<table_name>
```

- 如果已存在同名的表，则会返回错误。

    ```sql title='Examples:'
    root@localhost:8000/default> CREATE TABLE t(id INT);
    processed in (0.036 sec)

    root@localhost:8000/default> DROP TABLE t;
    processed in (0.033 sec)

    root@localhost:8000/default> CREATE TABLE t(id INT, name STRING);
    processed in (0.030 sec)

    root@localhost:8000/default> UNDROP TABLE t;
    error: APIError: QueryFailed: [2308]Undrop Table 't' already exists
    ```

- 恢复表不会自动将所有权恢复到原始角色。恢复后，必须手动将所有权授予先前的角色或其他角色。在此之前，该表仅对 `account-admin` 角色可见。

    ```sql title='Examples:'
    GRNAT OWNERSHIP on doc.t to ROLE writer;
    ```

## 示例

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