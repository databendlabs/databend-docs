---
title: REPLACE
---

返回字符串 str 中所有出现的 from_str 字符串，并将其替换为 to_str 字符串。

## 语法

```sql
REPLACE(<str>, <from_str>, <to_str>)
```

## 参数

| 参数         | 描述             |
|--------------|------------------|
| `<str>`      | 字符串。         |
| `<from_str>` | 要替换的字符串。 |
| `<to_str>`   | 替换为的字符串。 |

## 返回类型

`VARCHAR`

## 示例

```sql
SELECT REPLACE('www.mysql.com', 'w', 'Ww');
+-------------------------------------+
| REPLACE('www.mysql.com', 'w', 'Ww') |
+-------------------------------------+
| WwWwWw.mysql.com                    |
+-------------------------------------+
```