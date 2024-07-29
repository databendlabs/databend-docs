---
title: LIKE
---

使用 SQL 模式进行模式匹配。返回 1（TRUE）或 0（FALSE）。如果 expr 或 pat 为 NULL，则结果为 NULL。

## 语法

```sql
<expr> LIKE <pattern>
```

## 示例

```sql
SELECT name, category FROM system.functions WHERE name like 'tou%' ORDER BY name;
+----------+------------+
| name     | category   |
+----------+------------+
| touint16 | conversion |
| touint32 | conversion |
| touint64 | conversion |
| touint8  | conversion |
+----------+------------+
```