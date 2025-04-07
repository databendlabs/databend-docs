---
title: Interval
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.677"/>

INTERVAL 数据类型表示一段时间的长度，允许精确地操作和存储跨各种单位的时间间隔。

- 接受自然语言格式（例如，“1 year 2 months ago”）或解释为微秒的数值。

  - 支持的时间单位包括 `Millennium`、`Century`、`Decade`、`Year`、`Quarter`、`Month`、`Week`、`Day`、`Hour`、`Minute`、`Second`、`Millisecond` 和 `Microsecond`。

  ```sql title='Examples:'
  -- Create a table with one INTERVAL column
  CREATE OR REPLACE TABLE intervals (duration INTERVAL);

  -- Insert different types of INTERVAL data
  INSERT INTO intervals VALUES
      ('1 year 2 months ago'),     -- Natural language format with 'ago' (negative interval)
      ('1 year 2 months'),         -- Natural language format without 'ago' (positive interval)
      ('1000000'),                 -- Positive numeric value interpreted as microseconds
      ('-1000000');                -- Negative numeric value interpreted as microseconds

  -- Query the table to see the results
  SELECT * FROM intervals;

  ┌──────────────────────────┐
  │         duration         │
  ├──────────────────────────┤
  │ -1 year -2 months        │
  │ 1 year 2 months          │
  │ 0:00:01                  │
  │ -1 month -1 day -0:00:01 │
  └──────────────────────────┘
  ```

  - 当给定一个数值时，Databend 仅识别该值的整数部分。例如，`TO_INTERVAL('1 seconds')` 和 `TO_INTERVAL('1.6 seconds')` 都表示 1 秒的时间间隔。小数点后的分数部分将被忽略。

  ```sql title='Examples:'
  SELECT TO_INTERVAL('1 seconds'), TO_INTERVAL('1.6 seconds');

  ┌───────────────────────────────────────────────────────┐
  │ to_interval('1 seconds') │ to_interval('1.6 seconds') │
  ├──────────────────────────┼────────────────────────────┤
  │ 0:00:01                  │ 0:00:01                    │
  └───────────────────────────────────────────────────────┘
  ```

- 可以处理精确到微秒的正负时间间隔。
- 一个时间间隔可以加到或减去另一个时间间隔。

  ```sql title='Examples:'
  SELECT TO_DAYS(3) + TO_DAYS(1), TO_DAYS(3) - TO_DAYS(1);

  ┌───────────────────────────────────────────────────┐
  │ to_days(3) + to_days(1) │ to_days(3) - to_days(1) │
  ├─────────────────────────┼─────────────────────────┤
  │ 4 days                  │ 2 days                  │
  └─────────────────────────┘
  ```

- 时间间隔可以加到或减去 DATE 和 TIMESTAMP 值。

  ```sql title='Examples:'
  SELECT DATE '2024-12-20' + TO_DAYS(2),  DATE '2024-12-20' - TO_DAYS(2);

  ┌───────────────────────────────────────────────────────────────────────────────────┐
  │ CAST('2024-12-20' AS DATE) + to_days(2) │ CAST('2024-12-20' AS DATE) - to_days(2) │
  ├─────────────────────────────────────────┼─────────────────────────────────────────┤
  │ 2024-12-22 00:00:00                     │ 2024-12-18 00:00:00                     │
  └───────────────────────────────────────────────────────────────────────────────────┘

  SELECT TIMESTAMP '2024-12-20 10:00:00' + TO_DAYS(2), TIMESTAMP '2024-12-20 10:00:00' - TO_DAYS(2);

  ┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ CAST('2024-12-20 10:00:00' AS TIMESTAMP) + to_days(2) │ CAST('2024-12-20 10:00:00' AS TIMESTAMP) - to_days(2) │
  ├───────────────────────────────────────────────────────┼───────────────────────────────────────────────────────┤
  │ 2024-12-22 10:00:00                                   │ 2024-12-18 10:00:00                                   │
  └───────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
  ```

- *不*建议使用 MySQL 客户端查询 Databend 中的 INTERVAL 列，因为 MySQL 协议不完全支持 INTERVAL 类型。这可能会导致错误或意外行为。
