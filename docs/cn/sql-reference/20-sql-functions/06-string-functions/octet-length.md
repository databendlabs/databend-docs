---
title: OCTET_LENGTH
---

OCTET_LENGTH() 是 LENGTH() 的同义词。

## 语法

```sql
OCTET_LENGTH(<str>)
```

## 示例

```sql
SELECT OCTET_LENGTH('databend');
+--------------------------+
| OCTET_LENGTH('databend') |
+--------------------------+
|                        8 |
+--------------------------+
```