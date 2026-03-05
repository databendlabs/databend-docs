---
title: TIME_SLICE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.799"/>

TIME_SLICE 是一个标量函数，用于将单个日期/时间戳值映射到固定的日历间隔（slice 或 bucket）。

它返回包含该时间点的日历间隔的边界（起点或终点），常用于按自定义日历周期对时间序列数据进行分组、聚合和报告，例如按 2 周、3 个月或 15 分钟的窗口进行汇总。

## 语法

```sql
TIME_SLICE(<date_or_time_expr>, <slice_length>, <IntervalKind> [, <start_or_end>])
```

| 参数 | 描述 |
|---|---|
| `<date_or_time_expr>` | DATE、TIME、TIMESTAMP 或其他日期/时间表达式。返回类型尽可能与输入类型匹配。 |
| `<slice_length>` | INTEGER >= 1。一个切片中连续的 IntervalKind 单元数（例如，对于 2 周的切片，值为 2）。 |
| `<IntervalKind>` | 以下之一（不区分大小写）：YEAR、QUARTER、MONTH、WEEK、DAY、HOUR、MINUTE、SECOND。 |
| `<start_or_end>` | 字符串 'START' 或 'END'（不区分大小写）。如果省略，默认为 'START'。 |


## 语义

- 对于给定的调用 `TIME_SLICE(value, slice_length, IntervalKind, start_or_end)`：
    - START 返回切片开始的精确日历边界（包含）。
    - END 返回紧随切片之后的边界（不包含的上界）。根据输入类型和系统精度，如果通过减去最小时间单位将其转换为包含的端点，END 也可以解释为切片可表示的最后一个瞬间。

- 支持的 IntervalKind 与输入类型：
    - DATE 输入：YEAR、QUARTER、MONTH、WEEK、DAY。
    - TIMESTAMP / TIMESTAMPTZ 输入：YEAR、QUARTER、MONTH、WEEK、DAY、HOUR、MINUTE、SECOND（所有 IntervalKind 值）。

- 对齐规则（日历边界）：
    - 年从 1 月 1 日开始。
    - 季度从季度边界开始（1 月 1 日、4 月 1 日、7 月 1 日、10 月 1 日）。
    - 月从每月 1 日开始。
    - 周根据实现的周约定进行对齐（默认使用周一作为一周的开始）。
    - 天从 00:00:00 开始。
    - 小时/分钟/秒的切片从这些单位的自然边界开始。

    
## 返回类型

- DATE 输入 → 返回 DATE。
- TIMESTAMP 输入 → 返回 TIMESTAMP。


## 示例

```sql
SELECT
    '2019-02-28'::DATE AS "DATE",
        TIME_SLICE("DATE", 4, 'MONTH', 'START') AS "start",
    TIME_SLICE("DATE", 4, 'MONTH', 'END') AS "end";

╭──────────────────────────────────────╮
│    DATE    │    start   │     end    │
├────────────┼────────────┼────────────┤
│ 2019-02-28 │ 2019-01-01 │ 2019-05-01 │
╰──────────────────────────────────────╯

```

```sql
CREATE OR REPLACE TABLE accounts (
  id INT,
  billing_date DATE,
  balance_due DECIMAL(11, 2)
)

INSERT INTO
  accounts (id, billing_date, balance_due)
VALUES
  (1, '2018-07-31', 100.00),
  (2, '2018-08-01', 200.00),
  (3, '2018-08-25', 400.00);
       
-- 按 2 周的切片进行分组：
SELECT
    TIME_SLICE(billing_date, 2, 'WEEK', 'START') AS slice_start,
    TIME_SLICE(billing_date, 2, 'WEEK', 'END') AS slice_end,
    COUNT(*) AS num_late_bills,
    SUM(balance_due) AS total_due
FROM
    accounts
WHERE
    balance_due > 0
GROUP BY 1, 2
ORDER BY
    total_due;

╭─────────────────────────────────────────────────────────────────────────────╮
│   slice_start  │    slice_end   │ num_late_bills │         total_due        │
├────────────────┼────────────────┼────────────────┼──────────────────────────┤
│ 2018-07-23     │ 2018-08-06     │              2 │                   300.00 │
│ 2018-08-20     │ 2018-09-03     │              1 │                   400.00 │
╰─────────────────────────────────────────────────────────────────────────────╯

```

## 另请参阅

- [DATE_TRUNC](date-trunc.md)：提供类似的功能，但语法不同，以更好地兼容 SQL 标准。