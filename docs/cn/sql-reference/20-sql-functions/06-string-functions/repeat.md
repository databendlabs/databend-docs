---
title: REPEAT
---

返回一个由字符串 `str` 重复 `count` 次组成的字符串。如果 `count` 小于 1，则返回空字符串。如果 `str` 或 `count` 为 NULL，则返回 NULL。

## 语法

```sql
REPEAT(<str>, <count>)
```

## 参数

| 参数      | 描述       |
|-----------|------------|
| `<str>`   | 字符串     |
| `<count>` | 数字       |

## 示例

```sql
SELECT REPEAT('databend', 3);
+--------------------------+
| REPEAT('databend', 3)    |
+--------------------------+
| databenddatabenddatabend |
+--------------------------+

SELECT REPEAT('databend', 0);
+-----------------------+
| REPEAT('databend', 0) |
+-----------------------+
|                       |
+-----------------------+

SELECT REPEAT('databend', NULL);
+--------------------------+
| REPEAT('databend', NULL) |
+--------------------------+
|                     NULL |
+--------------------------+
```