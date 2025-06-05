---
title: DEGREES
---

将弧度值 `x` 转换为角度值。

## 语法

```sql
DEGREES( <x> )
```

## 示例

```sql
SELECT DEGREES(PI());

┌───────────────┐
│ degrees(pi()) │
├───────────────┤
│           180 │
└───────────────┘
```