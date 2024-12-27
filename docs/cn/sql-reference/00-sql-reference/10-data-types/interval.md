---
title: Interval
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.673"/>

INTERVAL 数据类型表示时间间隔，允许精确操作和存储跨不同单位的时间间隔。

- 接受自然语言格式（例如，'1 year 2 months ago'）或解释为微秒的数值。

    - 支持的时间单位包括 `Millennium`、`Century`、`Decade`、`Year`、`Quarter`、`Month`、`Week`、`Day`、`Hour`、`Minute`、`Second`、`Millisecond` 和 `Microsecond`。

    ```sql title='示例：'
    -- 创建一个包含 INTERVAL 列的表
    CREATE OR REPLACE TABLE intervals (duration INTERVAL);

    -- 插入不同类型的 INTERVAL 数据
    INSERT INTO intervals VALUES 
        ('1 year 2 months ago'),     -- 带有 'ago' 的自然语言格式（负间隔）
        ('1 year 2 months'),         -- 不带 'ago' 的自然语言格式（正间隔）
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

    - 当给定一个数值时，Databend 只识别该值的整数部分。例如，`TO_INTERVAL('1 seconds')` 和 `TO_INTERVAL('1.6 seconds')` 都表示 1 秒的间隔。小数点后的分数部分被忽略。

    ```sql title='示例：'
    SELECT TO_INTERVAL('1 seconds'), TO_INTERVAL('1.6 seconds');

    ┌───────────────────────────────────────────────────────┐
    │ to_interval('1 seconds') │ to_interval('1.6 seconds') │
    ├──────────────────────────┼────────────────────────────┤
    │ 0:00:01                  │ 0:00:01                    │
    └───────────────────────────────────────────────────────┘
    ```
- 处理正负间隔，精度可达微秒。
- *不* 建议使用 MySQL 客户端查询 Databend 中的 INTERVAL 列，因为 MySQL 协议不完全支持 INTERVAL 类型。这可能导致错误或意外行为。