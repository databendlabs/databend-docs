---
title: UNDROP DATABASE
---

恢复已删除数据库的最新版本。这利用了Databend的时间回溯功能；已删除的对象只能在保留期内（默认为24小时）恢复。

另请参阅：[DROP DATABASE](ddl-drop-database.md)

## 语法

```sql
UNDROP DATABASE <database_name>
```

如果已存在同名数据库，则会返回错误。

## 示例

此示例创建、删除，然后恢复名为“orders_2024”的数据库：

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