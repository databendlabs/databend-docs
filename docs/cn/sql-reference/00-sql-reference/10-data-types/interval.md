---
title: Interval
sidebar_position: 7
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于: v1.2.677"/>

## 概览

`INTERVAL` 表示一段时间，可以用自然语言文本（如 `'1 year 2 months'`、`'3 days ago'`）或微秒数的整数来表示。Databend 支持从千年到微秒的单位，并允许对区间、日期和时间戳进行算术运算。

:::note
解析数值区间时会丢弃小数部分。`'1.6 seconds'` 会变成 1 秒的区间。
:::

## 示例

### 字面量和数值

```sql
CREATE OR REPLACE TABLE intervals (duration INTERVAL);

INSERT INTO intervals VALUES
  ('1 year 2 months'),       -- 正向自然语言
  ('1 year 2 months ago'),   -- 负向，因为有 "ago"
  ('1000000'),               -- 1 秒（微秒单位）
  ('-1000000');              -- -1 秒

SELECT TO_STRING(duration) AS duration_text FROM intervals;
```

结果：
```
┌──────────────────────┐
│ duration_text        │
├──────────────────────┤
│ 1 year 2 months      │
│ -1 year -2 months    │
│ 0:00:01              │
│ -0:00:01             │
└──────────────────────┘
```

```sql
SELECT
  TO_STRING(TO_INTERVAL('1 seconds'))   AS whole,
  TO_STRING(TO_INTERVAL('1.6 seconds')) AS fractional;
```

结果：
```
┌────────┬────────────┐
│ whole  │ fractional │
├────────┼────────────┤
│ 0:00:01 │ 0:00:01   │
└────────┴────────────┘
```

### 区间运算

```sql
SELECT
  TO_STRING(TO_DAYS(3) + TO_DAYS(1)) AS add_interval,
  TO_STRING(TO_DAYS(3) - TO_DAYS(1)) AS subtract_interval;
```

结果：
```
┌──────────────┬──────────────────┐
│ add_interval │ subtract_interval │
├──────────────┼──────────────────┤
│ 4 days       │ 2 days           │
└──────────────┴──────────────────┘
```

### 应用于 DATE 和 TIMESTAMP

```sql
SELECT
  DATE '2024-12-20' + TO_DAYS(2) AS add_days,
  DATE '2024-12-20' - TO_DAYS(2) AS subtract_days,
  TIMESTAMP '2024-12-20 10:00:00' + TO_HOURS(36) AS add_hours,
  TIMESTAMP '2024-12-20 10:00:00' - TO_HOURS(36) AS subtract_hours;
```

结果：
```
┌────────────────────┬────────────────────┬────────────────────┬────────────────────┐
│ add_days           │ subtract_days      │ add_hours          │ subtract_hours     │
├────────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ 2024-12-22T00:00:00 │ 2024-12-18T00:00:00 │ 2024-12-21T22:00:00 │ 2024-12-18T22:00:00 │
└────────────────────┴────────────────────┴────────────────────┴────────────────────┘
```

区间的加减运算就像数字一样，使得滑动窗口或计算偏移量变得容易，并且可以精确控制到微秒。
