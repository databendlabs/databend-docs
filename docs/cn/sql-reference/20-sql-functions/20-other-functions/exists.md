---
title: EXISTS
---

当子查询至少返回一行时，exists 条件与子查询结合使用，并被认为是“满足的”。

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