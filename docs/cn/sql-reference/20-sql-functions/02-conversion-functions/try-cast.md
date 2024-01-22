```markdown
---
title: TRY_CAST 函数
---

将一个值从一种数据类型转换为另一种数据类型。在出错时返回 NULL。

## 语法 {#syntax}

```sql
TRY_CAST( <expr> AS <data_type> )
```

## 示例 {#examples}

```sql
SELECT TRY_CAST(1 AS VARCHAR);

┌───────────────────────┐
│ try_cast(1 as string) │
├───────────────────────┤
│ 1                     │
└───────────────────────┘
```
```