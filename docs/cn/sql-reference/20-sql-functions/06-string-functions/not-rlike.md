---
title: NOT RLIKE
---

如果字符串 `expr` 不匹配由模式 `pat` 指定的正则表达式，则返回 1，否则返回 0。

## 语法

```sql
<expr> NOT RLIKE <pattern>
```

## 示例

```sql
SELECT 'databend' not rlike 'd*';
+-----------------------------+
| ('databend' not rlike 'd*') |
+-----------------------------+
|                           0 |
+-----------------------------+
```