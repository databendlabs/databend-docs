---
title: POSITION
---

POSITION(substr IN str) 是 LOCATE(substr,str) 的同义词。
返回子字符串 substr 在字符串 str 中第一次出现的位置。
如果 substr 不在 str 中，则返回 0。如果任何参数为 NULL，则返回 NULL。

## 语法

```sql
POSITION(<substr> IN <str>)
```

## 参数

| 参数       | 描述         |
|------------|--------------|
| `<substr>` | 子字符串。   |
| `<str>`    | 字符串。     |

## 返回类型

`BIGINT`

## 示例

```sql
SELECT POSITION('bar' IN 'foobarbar')
+----------------------------+
| POSITION('bar' IN 'foobarbar') |
+----------------------------+
|                          4 |
+----------------------------+

SELECT POSITION('xbar' IN 'foobar')
+--------------------------+
| POSITION('xbar' IN 'foobar') |
+--------------------------+
|                        0 |
+--------------------------+
```