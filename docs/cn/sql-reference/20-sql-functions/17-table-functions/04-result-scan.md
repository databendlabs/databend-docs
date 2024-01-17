```
---
title: RESULT_SCAN
---

返回同一会话中先前命令的结果集，就像结果是一个表一样。


## 语法 {/*syntax*/}

```sql
RESULT_SCAN( { '<query_id>' | LAST_QUERY_ID() } )
```

## 示例 {/*examples*/}

创建一个简单的表：

```sql
CREATE TABLE t1(a int);
```

插入一些值：

```sql
INSERT INTO t1(a) VALUES (1), (2), (3);
```

### `result_scan`


```shell
SELECT * FROM t1 ORDER BY a;
+-------+
|   a   |
+-------+
|   1   |
+-------+
|   2   |
+-------+
|   3   |
+-------+
```


```shell
SELECT * FROM RESULT_SCAN(LAST_QUERY_ID()) ORDER BY a;
+-------+
|   a   |
+-------+
|   1   |
+-------+
|   2   |
+-------+
|   3   |
+-------+
```

```