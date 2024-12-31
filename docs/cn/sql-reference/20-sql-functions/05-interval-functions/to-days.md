---
title: TO_DAYS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.677"/>

将指定的天数转换为 Interval 类型。

- 接受正整数、零和负整数作为输入。

## 语法

```sql
TO_DAYS(<days>)
```

## 返回类型

Interval（以天为单位表示）。

## 示例

```sql
SELECT TO_DAYS(2), TO_DAYS(0), TO_DAYS(-2);

┌────────────────────────────────────────┐
│ to_days(2) │ to_days(0) │ to_days(- 2) │
├────────────┼────────────┼──────────────┤
│ 2 days     │ 00:00:00   │ -2 days      │
└────────────────────────────────────────┘
```