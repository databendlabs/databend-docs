---
title: TRY_CAST
---

将一个值从一种数据类型转换为另一种数据类型。如果转换失败，则返回 NULL。

另请参阅：[CAST](cast.md)

## 语法

```sql
TRY_CAST( <expr> AS <data_type> )
```

## 示例

```sql
SELECT TRY_CAST(1 AS VARCHAR);

┌───────────────────────┐
│ try_cast(1 as string) │
├───────────────────────┤
│ 1                     │
└───────────────────────┘
```