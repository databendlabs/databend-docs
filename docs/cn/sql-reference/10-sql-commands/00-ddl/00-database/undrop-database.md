---
title: UNDROP DATABASE
---

恢复最近版本的已删除数据库。这利用了 Databend 的时间旅行特性；只有在保留期内（默认为24小时），才能恢复已删除的对象。

另见：[DROP DATABASE](ddl-drop-database.md)

## 语法

```sql
UNDROP DATABASE <database_name>
```

如果同名数据库已存在，则返回错误。

## 示例

此示例创建、删除，然后恢复名为 "orders_2024" 的数据库：

```sql
root@localhost:8000/default> CREATE DATABASE orders_2024;

CREATE DATABASE orders_2024

0 行在 0.014 秒内写入。处理了 0 行，0 B（0 行/秒，0 B/秒）

root@localhost:8000/default> DROP DATABASE orders_2024;

DROP DATABASE orders_2024

0 行在 0.012 秒内写入。处理了 0 行，0 B（0 行/秒，0 B/秒）

root@localhost:8000/default> UNDROP DATABASE orders_2024;

UNDROP DATABASE orders_2024

0 行在 0.011 秒内读取。处理了 0 行，0 B（0 行/秒，0 B/秒）
```