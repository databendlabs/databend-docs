---
title: ARRAY_LENGTH
---

返回数组的长度。

## 语法

```sql
ARRAY_LENGTH( <array> )
```

## 示例

```sql
SELECT ARRAY_LENGTH([1, 2]);

┌──────────────────────┐
│ array_length([1, 2]) │
├──────────────────────┤
│                    2 │
└──────────────────────┘
```
