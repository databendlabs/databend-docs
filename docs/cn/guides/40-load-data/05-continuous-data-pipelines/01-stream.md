---
title: 使用 Stream 追踪与转换数据
sidebar_label: 流（Stream）
---

Stream 是 Databend 用来记录行级变更的“增量表”。每次提交 INSERT/UPDATE/DELETE，Stream 都会缓存对应的最终状态，直到消费为止。本页沿用英语版的三个动手示例，帮助你快速体会两种模式以及增量计算的写法。

## 模式速览

| 模式 | 捕获内容 | 适用场景 |
| --- | --- | --- |
| 标准（`APPEND_ONLY = false`） | INSERT + UPDATE + DELETE，并在被消费前合并为每行的最新状态 | 需要完整记录变更、可回放更新/删除 |
| 仅追加（默认，`APPEND_ONLY = true`） | 只捕获 INSERT | 纯追加型事实/日志流水 |

Stream 不复制整张表，只保留“尚未消费的增量”。消费由谁触发、何时触发完全由你掌控。

## 示例 1：仅追加 Stream

### Step 1. 创建基表与 Stream

```sql
CREATE OR REPLACE TABLE sensor_readings (
    sensor_id INT,
    temperature DOUBLE
);

CREATE OR REPLACE STREAM sensor_readings_stream
    ON TABLE sensor_readings; -- APPEND_ONLY 默认即为 true
```

### Step 2. 插入并查看增量

```sql
INSERT INTO sensor_readings VALUES (1, 21.5), (2, 19.7);

SELECT sensor_id, temperature, change$action, change$is_update
FROM sensor_readings_stream;
```

```
┌────────────┬───────────────┬───────────────┬──────────────────┐
│ sensor_id  │ temperature   │ change$action │ change$is_update │
├────────────┼───────────────┼───────────────┼──────────────────┤
│          1 │ 21.5          │ INSERT        │ false            │
│          2 │ 19.7          │ INSERT        │ false            │
└────────────┴───────────────┴───────────────┴──────────────────┘
```

### Step 3. 消费并写入目标表

```sql
CREATE OR REPLACE TABLE sensor_readings_latest AS
SELECT sensor_id, temperature
FROM sensor_readings_stream;

SELECT * FROM sensor_readings_stream; -- 已为空
```

## 示例 2：标准 Stream（含更新与删除）

### Step 1. 为同一张表建立标准模式 Stream

```sql
CREATE OR REPLACE STREAM sensor_readings_stream_std
    ON TABLE sensor_readings
    APPEND_ONLY = false;
```

### Step 2. 执行更新、删除、插入并比较两个 Stream

```sql
UPDATE sensor_readings SET temperature = 22 WHERE sensor_id = 1; -- 更新
DELETE FROM sensor_readings WHERE sensor_id = 2;                -- 删除
INSERT INTO sensor_readings VALUES (3, 18.5);                   -- 新增

SELECT * FROM sensor_readings_stream; -- 仍为空（仅追加模式忽略更新/删除）

SELECT sensor_id, temperature, change$action, change$is_update
FROM sensor_readings_stream_std
ORDER BY change$row_id;
```

```
┌────────────┬───────────────┬───────────────┬──────────────────┐
│ sensor_id  │ temperature   │ change$action │ change$is_update │
├────────────┼───────────────┼───────────────┼──────────────────┤
│          1 │ 21.5          │ DELETE        │ true             │
│          1 │ 22            │ INSERT        │ true             │
│          2 │ 19.7          │ DELETE        │ false            │
│          3 │ 18.5          │ INSERT        │ false            │
└────────────┴───────────────┴───────────────┴──────────────────┘
```

更新对应“删除旧值 + 写入新值”，独立的 DELETE/INSERT 则各自占一条，因而在消费前始终能拿到最终状态。

## 示例 3：增量 Join 与计算

多条 Stream 可以在需要时“一次性消费”。借助 `WITH CONSUME`，每次只处理尚未消费的增量，既适合批式作业也能容忍不同步到达的变更。

### Step 1. 创建基表与 Stream

```sql
CREATE OR REPLACE TABLE customers (
    customer_id INT,
    segment VARCHAR,
    city VARCHAR
);

CREATE OR REPLACE TABLE orders (
    order_id INT,
    customer_id INT,
    amount DOUBLE
);

CREATE OR REPLACE STREAM customers_stream ON TABLE customers;
CREATE OR REPLACE STREAM orders_stream ON TABLE orders;
```

### Step 2. 首批数据

```sql
INSERT INTO customers VALUES
    (101, 'VIP', 'Shanghai'),
    (102, 'Standard', 'Beijing'),
    (103, 'VIP', 'Shenzhen');

INSERT INTO orders VALUES
    (5001, 101, 199.0),
    (5002, 101, 59.0),
    (5003, 102, 89.0);
```

### Step 3. 第一次增量聚合

```sql
WITH
    orders_delta AS (
        SELECT customer_id, amount
        FROM orders_stream WITH CONSUME
    ),
    customers_delta AS (
        SELECT customer_id, segment
        FROM customers_stream WITH CONSUME
    )
SELECT
    o.customer_id,
    c.segment,
    SUM(o.amount) AS incremental_sales
FROM orders_delta AS o
JOIN customers_delta AS c
    ON o.customer_id = c.customer_id
GROUP BY o.customer_id, c.segment
ORDER BY o.customer_id;
```

```
┌──────────────┬───────────┬────────────────────┐
│ customer_id  │ segment   │ incremental_sales  │
├──────────────┼───────────┼────────────────────┤
│          101 │ VIP       │ 258.0              │
│          102 │ Standard  │  89.0              │
└──────────────┴───────────┴────────────────────┘
```

### Step 4. 下一批到达后再次运行

```sql
INSERT INTO customers VALUES (104, 'Standard', 'Guangzhou');
INSERT INTO orders VALUES (5004, 101, 40.0), (5005, 104, 120.0);

WITH
    orders_delta AS (
        SELECT customer_id, amount
        FROM orders_stream WITH CONSUME
    ),
    customers_delta AS (
        SELECT customer_id, segment
        FROM customers_stream WITH CONSUME
    )
SELECT
    o.customer_id,
    c.segment,
    SUM(o.amount) AS incremental_sales
FROM orders_delta AS o
JOIN customers_delta AS c
    ON o.customer_id = c.customer_id
GROUP BY o.customer_id, c.segment
ORDER BY o.customer_id;
```

```
┌──────────────┬───────────┬────────────────────┐
│ customer_id  │ segment   │ incremental_sales  │
├──────────────┼───────────┼────────────────────┤
│          101 │ VIP       │ 40.0               │
│          104 │ Standard  │ 120.0              │
└──────────────┴───────────┴────────────────────┘
```

第二次运行自动只消费最新的增量，允许订单和客户信息在不同时间到达。

## 使用提示

**消费语义**
- `INSERT INTO target SELECT ... FROM stream` 成功提交后才会清空 Stream，失败则回滚。
- 同一条 Stream 同时只能被一个语句消费，其余会被回滚。

**模式选择**
- 仅追加 Stream 专注 INSERT，是事件、日志入湖的最佳拍档。
- 标准 Stream 能保留更新/删除前后的最终状态，适合需要完整变更信息的场景。

**隐藏列**
- 查询 Stream 时可使用 `change$action`、`change$is_update`、`change$row_id` 判断每条增量。
- 基表上还有 `_origin_version`、`_origin_block_id`、`_origin_block_row_num`，方便排查“最终值从何而来”。

**联动任务**
- 结合 Task 可以按计划自动消费 Stream，使用 `task_history('<name>', <limit>)` 查看执行记录。
- SQL 中搭配 `WITH CONSUME`，即可在批式作业里只处理“本次新增”的数据。
