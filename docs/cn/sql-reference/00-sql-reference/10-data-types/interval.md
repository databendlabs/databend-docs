---
title: Interval
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.677"/>

INTERVAL 数据类型表示一段时间的持续时间，允许精确操作和存储各种时间单位的时间间隔。

- 接受自然语言格式（例如，'1 year 2 months ago'）或解释为微秒的数值。

    - 支持的时间单位包括 `Millennium` (千年)、`Century` (世纪)、`Decade` (十年)、`Year` (年)、`Quarter` (季度)、`Month` (月)、`Week` (周)、`Day` (天)、`Hour` (小时)、`Minute` (分钟)、`Second` (秒)、`Millisecond` (毫秒) 和 `Microsecond` (微秒)。

    ```sql title='Examples:'
    -- 创建一个包含一个 INTERVAL 列的表
    CREATE OR REPLACE TABLE intervals (duration INTERVAL);

    -- 插入不同类型的 INTERVAL 数据
    INSERT INTO intervals VALUES 
        ('1 year 2 months ago'),     -- 带有 'ago' 的自然语言格式 (负间隔)
        ('1 year 2 months'),         -- 不带 'ago' 的自然语言格式 (正间隔)
        ('1000000'),                 -- 解释为微秒的正数值
        ('-1000000');                -- 解释为微秒的负数值

    -- 查询表以查看结果
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

    - 当给定一个数值时，Databend 只识别该值的整数部分。例如，`TO_INTERVAL('1 seconds')` 和 `TO_INTERVAL('1.6 seconds')` 都表示 1 秒的间隔。小数点后的分数部分将被忽略。

    ```sql title='Examples:'
    SELECT TO_INTERVAL('1 seconds'), TO_INTERVAL('1.6 seconds');

    ┌───────────────────────────────────────────────────────┐
    │ to_interval('1 seconds') │ to_interval('1.6 seconds') │
    ├──────────────────────────┼────────────────────────────┤
    │ 0:00:01                  │ 0:00:01                    │
    └───────────────────────────────────────────────────────┘
    ```
- 精确处理正负间隔，精度可达微秒。
- 一个间隔可以与另一个间隔相加或相减。

    ```sql title='Examples:'
    SELECT TO_DAYS(3) + TO_DAYS(1), TO_DAYS(3) - TO_DAYS(1);

    ┌───────────────────────────────────────────────────┐
    │ to_days(3) + to_days(1) │ to_days(3) - to_days(1) │
    ├─────────────────────────┼─────────────────────────┤
    │ 4 days                  │ 2 days                  │
    └───────────────────────────────────────────────────┘
    ```
- 间隔可以与 DATE 和 TIMESTAMP 值相加或相减。

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
- 不建议使用 MySQL 客户端查询 Databend 中的 INTERVAL 列，因为 MySQL 协议不完全支持 INTERVAL 类型。这可能导致错误或意外行为。