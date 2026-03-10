---
title: RESULT_SCAN
---

通过查询 ID 检索先前查询的缓存结果。

另请参阅：[system.query_cache](/sql/sql-reference/system-tables/system-query-cache)

## 语法

```sql
RESULT_SCAN('<query_id>' | LAST_QUERY_ID())
```

## 示例

此示例展示了如何启用查询结果缓存并运行一个结果将被缓存的查询：

```bash
# 启用查询结果缓存功能
mysql> SET enable_query_result_cache = 1;
Query OK, 0 rows affected (0.01 sec)

# 缓存所有查询，无论它们的执行速度有多快
mysql> SET query_result_cache_min_execute_secs = 0;
Query OK, 0 rows affected (0.01 sec)

# 执行一个查询并缓存其结果
mysql> SELECT * FROM t1 ORDER BY a;
+------+
| a    |
+------+
|    1 |
|    2 |
|    3 |
+------+
3 rows in set (0.02 sec)
Read 0 rows, 0.00 B in 0.006 sec., 0 rows/sec., 0.00 B/sec.
```

一旦结果被缓存，你可以使用 `RESULT_SCAN` 检索它而无需重新运行查询：

```bash
# 使用查询 ID 检索先前查询的缓存结果
mysql> SELECT * FROM RESULT_SCAN(LAST_QUERY_ID()) ORDER BY a;
+------+
| a    |
+------+
|    1 |
|    2 |
|    3 |
+------+
3 rows in set (0.02 sec)
Read 3 rows, 13.00 B in 0.006 sec., 464.06 rows/sec., 1.96 KiB/sec.
```