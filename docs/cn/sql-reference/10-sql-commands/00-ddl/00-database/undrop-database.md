---
title: UNDROP DATABASE
---

恢复最近删除的数据库版本。这利用了 Databend 的时间回溯功能；删除的对象只能在保留期内恢复（默认为 24 小时）。

**参见：**
[DROP DATABASE](ddl-drop-database.md)
[SHOW DROP DATABASES](show-drop-databases.md)

## 语法

```sql
UNDROP DATABASE <database_name>
```

- 如果已存在同名的数据库，则会返回错误。

    ```sql title='Examples:'
    root@localhost:8000/default> CREATE DATABASE doc;
    processed in (0.030 sec)

    root@localhost:8000/default> DROP DATABASE doc;
    processed in (0.028 sec)

    root@localhost:8000/default> CREATE DATABASE doc;
    processed in (0.028 sec)

    root@localhost:8000/default> UNDROP DATABASE doc;
    error: APIError: QueryFailed: [2301]Database 'doc' already exists
    ```
- 恢复数据库不会自动将所有权恢复到原始角色。恢复后，必须手动将所有权授予之前的角色或其他角色。在此之前，数据库只能由 `account-admin` 角色访问。

    ```sql title='Examples:'
    GRNAT OWNERSHIP on doc.* to ROLE writer;
    ```

## 示例

此示例创建、删除然后恢复名为 "orders_2024" 的数据库：

```sql
root@localhost:8000/default> CREATE DATABASE orders_2024;

CREATE DATABASE orders_2024

0 row written in 0.014 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)

root@localhost:8000/default> DROP DATABASE orders_2024;

DROP DATABASE orders_2024

0 row written in 0.012 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)

root@localhost:8000/default> UNDROP DATABASE orders_2024;

UNDROP DATABASE orders_2024

0 row read in 0.011 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)
```