---
title: TO_MONTHS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.677"/>

将指定的月数转换为 Interval 类型。

- 接受正整数、零和负整数作为输入。

## 语法

```sql
TO_MONTHS(<months>)
```

## 返回类型

Interval（以月为单位表示）。

## 示例

```sql
SELECT TO_MONTHS(2), TO_MONTHS(0), TO_MONTHS((- 2));

┌──────────────────────────────────────────────┐
│ to_months(2) │ to_months(0) │ to_months(- 2) │
├──────────────┼──────────────┼────────────────┤
│ 2 months     │ 00:00:00     │ -2 months      │
└──────────────────────────────────────────────┘
```