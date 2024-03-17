---
title: TO_QUARTER
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.153"/>

从给定的日期或时间戳中检索季度（1、2、3 或 4）。

## 语法

```sql
TO_QUARTER( <date_or_time_expr> )
```

## 别名

- [QUARTER](quarter.md)

## 返回类型

整数。

## 示例

```sql
SELECT NOW(), TO_QUARTER(NOW()), QUARTER(NOW());

┌─────────────────────────────────────────────────────────────────┐
│            now()           │ to_quarter(now()) │ quarter(now()) │
├────────────────────────────┼───────────────────┼────────────────┤
│ 2024-03-14 23:32:52.743133 │                 1 │              1 │
└─────────────────────────────────────────────────────────────────┘
```