---
title: DROP DATABASE
---

删除一个数据库。

另请参阅：[UNDROP DATABASE](undrop-database.md)

## 语法

```sql
DROP { DATABASE | SCHEMA } [ IF EXISTS ] <database_name>
```

`DROP SCHEMA` 是 `DROP DATABASE` 的同义词。

## 示例

此示例创建并删除名为 "orders_2024" 的数据库：

```sql
root@localhost:8000/default> CREATE DATABASE orders_2024;

CREATE DATABASE orders_2024

0 行写入于 0.014 秒。处理了 0 行，0 B（0 行/秒，0 B/秒）

root@localhost:8000/default> DROP DATABASE orders_2024;

DROP DATABASE orders_2024

0 行写入于 0.012 秒。处理了 0 行，0 B（0 行/秒，0 B/秒）
```