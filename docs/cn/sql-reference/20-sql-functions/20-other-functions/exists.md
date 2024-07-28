---
title: EXISTS
---

EXISTS 条件与子查询一起使用，如果子查询返回至少一行，则认为该条件“被满足”。

## 语法

```sql
WHERE EXISTS ( <subquery> );
```

## 示例
```sql
SELECT number FROM numbers(5) AS A WHERE exists (SELECT * FROM numbers(3) WHERE number=1); 
+--------+
| number |
+--------+
|      0 |
|      1 |
|      2 |
|      3 |
|      4 |
+--------+
```