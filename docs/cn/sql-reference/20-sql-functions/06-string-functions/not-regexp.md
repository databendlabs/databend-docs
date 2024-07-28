---
title: NOT REGEXP
---

如果字符串 `expr` 不匹配由模式 `pat` 指定的正则表达式，则返回 1，否则返回 0。

## 语法

```sql
<expr> NOT REGEXP <pattern>
```

## 示例

```sql
SELECT 'databend' NOT REGEXP 'd*';
+------------------------------+
| ('databend' not regexp 'd*') |
+------------------------------+
|                            0 |
+------------------------------+
```