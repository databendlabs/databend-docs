---
title: RANGE
---

返回一个由 [start, end)（包含 start，不包含 end）构成的数组。

## 语法

```sql
RANGE( <start>, <end> )
```

## 示例

```sql
SELECT RANGE(1, 5);

┌───────────────┐
│  range(1, 5)  │
├───────────────┤
│ [1,2,3,4]     │
└───────────────┘
```