---
title: "CAST, ::"
---

将一个值从一种数据类型转换为另一种数据类型。`::` 是 CAST 的别名。

另请参阅：[TRY_CAST](try-cast.md)

## 语法

```sql
CAST( <expr> AS <data_type> )

<expr>::<data_type>
```

## 示例

```sql
SELECT CAST(1 AS VARCHAR), 1::VARCHAR;

┌───────────────────────────────┐
│ cast(1 as string) │ 1::string │
├───────────────────┼───────────┤
│ 1                 │ 1         │
└───────────────────────────────┘
```