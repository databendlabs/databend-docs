---
title: 创建流
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.391"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='STREAM'/>

创建一个流。

## 语法

```sql
CREATE [ OR REPLACE ] STREAM [ IF NOT EXISTS ] [ <database_name>. ]<stream_name>
  ON TABLE [ <database_name>. ]<table_name>
  [ AT ( { TIMESTAMP => <timestamp> | SNAPSHOT => '<snapshot_id>' | STREAM => <existing_stream_name> } ) ]
  [ APPEND_ONLY = true | false ]
  [ COMMENT = '<comment>' ]
```

| 参数                | 说明                                                                                                                                                                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `< database_name >` | 流（Stream）被视为属于特定数据库的对象，类似于表或视图。CREATE STREAM 允许流和关联表位于不同的数据库中。如果没有明确指定数据库，则创建流时将应用当前数据库。                                                                              |
| AT                  | 使用 `AT` 后跟 `TIMESTAMP =>` 或 `SNAPSHOT =>` 时，您可以创建一个流，其中包含自特定历史时间点以来的数据变化，该时间点由时间戳或快照 ID 确定；当 `AT` 后跟 `STREAM =>` 时，它允许创建一个与现有流相同的新流，捕获并反映现有流的变化。      |
| APPEND_ONLY         | 当设置为 `true` 时，流以 `Append-Only` 模式运行；当设置为 `false` 时，它以 `Standard` 模式运行。默认值为 `false`。有关流操作模式的更多详细信息，请参阅 [流是如何工作的](/guides/load-data/continuous-data-pipelines/stream#how-stream-works)。 |


## 示例

本示例展示了如何创建名为 'order_changes' 的流，以监控 'orders' 表中的变化：

```sql
-- Create a table named 'orders'
CREATE TABLE orders (
    order_id INT,
    product_name VARCHAR(255),
    quantity INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a stream named 'order_changes' for the table 'orders'
CREATE STREAM order_changes ON TABLE orders;

-- Insert order 1001 to the table 'orders'
INSERT INTO orders (order_id, product_name, quantity) VALUES (1001, 'Product A', 10);

-- Insert order 1002 to the table 'orders'
INSERT INTO orders (order_id, product_name, quantity) VALUES (1002, 'Product B', 20);

-- Retrieve all records from the 'order_changes' stream
SELECT * FROM order_changes;

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     order_id    │   product_name   │     quantity    │         order_date         │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼──────────────────┼─────────────────┼────────────────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│            1002 │ Product B        │              20 │ 2024-03-28 03:24:16.629135 │ INSERT        │ false            │ acb58bd6bb4243a4bf0832bf570b38c2000000 │
│            1001 │ Product A        │              10 │ 2024-03-28 03:24:16.539178 │ INSERT        │ false            │ b93a15e694db4134ab5a23afa8c92b20000000 │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

以下示例使用 AT 参数创建了一个名为 'order_changes_copy' 的新流，包含与 'order_changes' 相同的数据变化：

```sql
-- Create a stream 'order_changes_copy' on the 'orders' table, copying data changes from 'order_changes'
CREATE STREAM order_changes_copy ON TABLE orders AT (STREAM => order_changes);

-- Retrieve all records from the 'order_changes_copy' stream
SELECT * FROM order_changes_copy;

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     order_id    │   product_name   │     quantity    │         order_date         │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼──────────────────┼─────────────────┼────────────────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│            1002 │ Product B        │              20 │ 2024-03-28 03:24:16.629135 │ INSERT        │ false            │ acb58bd6bb4243a4bf0832bf570b38c2000000 │
│            1001 │ Product A        │              10 │ 2024-03-28 03:24:16.539178 │ INSERT        │ false            │ b93a15e694db4134ab5a23afa8c92b20000000 │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

本示例在 'orders' 表上创建了两个流。每个流利用 AT 参数分别获取特定快照 ID 或时间戳之后的数据变化。

```sql
-- Retrieve snapshot and timestamp information from the 'orders' table
SELECT snapshot_id, timestamp from FUSE_SNAPSHOT('default','orders');

┌───────────────────────────────────────────────────────────────┐
│            snapshot_id           │          timestamp         │
├──────────────────────────────────┼────────────────────────────┤
│ f7f57c7d07f445a68e4aa53fa2578bbb │ 2024-03-28 03:24:16.633721 │
│ 11b9d81eabc94c7da648908f0ba313a1 │ 2024-03-28 03:24:16.611835 │
└───────────────────────────────────────────────────────────────┘

-- Create a stream 'order_changes_after_snapshot' on the 'orders' table, capturing data changes after a specific snapshot
CREATE STREAM order_changes_after_snapshot ON TABLE orders AT (SNAPSHOT => '11b9d81eabc94c7da648908f0ba313a1');

-- Query the 'order_changes_after_snapshot' stream to view data changes captured after the specified snapshot
SELECT * FROM order_changes_after_snapshot;

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     order_id    │   product_name   │     quantity    │         order_date         │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼──────────────────┼─────────────────┼────────────────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│            1002 │ Product B        │              20 │ 2024-03-28 03:24:16.629135 │ INSERT        │ false            │ acb58bd6bb4243a4bf0832bf570b38c2000000 │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- Create a stream 'order_changes_after_timestamp' on the 'orders' table, capturing data changes after a specific timestamp
CREATE STREAM order_changes_after_timestamp ON TABLE orders AT (TIMESTAMP => '2024-03-28 03:24:16.611835'::TIMESTAMP);

-- Query the 'order_changes_after_timestamp' stream to view data changes captured after the specified timestamp
SELECT * FROM order_changes_after_timestamp;

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     order_id    │   product_name   │     quantity    │         order_date         │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼──────────────────┼─────────────────┼────────────────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│            1002 │ Product B        │              20 │ 2024-03-28 03:24:16.629135 │ INSERT        │ false            │ acb58bd6bb4243a4bf0832bf570b38c2000000 │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```