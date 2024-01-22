```
---
title: "CAST, ::"
---

将一个值从一种数据类型转换为另一种。`::`是CAST的别名。

## 语法 {#syntax}

```sql
CAST( <expr> AS <data_type> )

<expr>::<data_type>
```

## 示例 {#examples}

```sql
SELECT CAST(1 AS VARCHAR), 1::VARCHAR;

┌───────────────────────────────┐
│ cast(1 as string) │ 1::string │
├───────────────────┼───────────┤
│ 1                 │ 1         │
└───────────────────────────────┘
```
```