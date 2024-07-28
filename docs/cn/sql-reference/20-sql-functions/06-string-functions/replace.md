---
title: REPLACE
---

返回将字符串 `str` 中所有出现的字符串 `from_str` 替换为字符串 `to_str` 后的结果。

## 语法

```sql
REPLACE(<str>, <from_str>, <to_str>)
```

## 参数

| 参数         | 描述         |
|--------------|--------------|
| `<str>`      | 源字符串。   |
| `<from_str>` | 要替换的字符串。 |
| `<to_str>`   | 替换后的字符串。 |

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