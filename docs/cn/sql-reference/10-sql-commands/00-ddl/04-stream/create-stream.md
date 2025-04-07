---
title: CREATE STREAM
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.391"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='STREAM'/>

创建 Stream。

## 语法

```sql
CREATE [ OR REPLACE ] STREAM [ IF NOT EXISTS ] [ <database_name>. ]<stream_name> 
  ON TABLE [ <database_name>. ]<table_name> 
  [ AT ( { TIMESTAMP => <timestamp> | SNAPSHOT => '<snapshot_id>' | STREAM => <existing_stream_name> } ) ]
  [ APPEND_ONLY = true | false ]
  [ COMMENT = '<comment>' ]
```

| 参数                | 描述                                                                                                                                                                                                                                                                                                                       |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `< database_name >` | Stream 被视为属于特定数据库的对象，类似于表或视图。CREATE STREAM 允许 Stream 和关联表之间存在不同的数据库。如果未显式指定数据库，则当前数据库将用作您创建的 Stream 的数据库。                                                                                                                                                                                                                                                           |
| AT                  | 当使用 `AT` 后跟 `TIMESTAMP =>` 或 `SNAPSHOT =>` 时，您可以通过时间戳或快照 ID 创建一个包含特定历史点之后的数据更改的 Stream；当 `AT` 后跟 `STREAM =>` 时，它允许创建与现有 Stream 相同的新 Stream，从而保留相同的捕获数据更改。                                                                                                                                                                                                                                                           |
| APPEND_ONLY         | 设置为 `true` 时，Stream 在 `Append-Only` 模式下运行；设置为 `false` 时，它在 `Standard` 模式下运行。默认为 `true`。有关 Stream 操作模式的更多详细信息，请参见 [Stream 工作原理](/guides/load-data/continuous-data-pipelines/stream#how-stream-works)。                                                                                                                                                                                                                                                         |

## 示例

此示例演示如何创建名为“order_changes”的 Stream，以监视“orders”表中的更改：

```sql
-- 创建一个名为“orders”的表
CREATE TABLE orders (
    order_id INT,
    product_name VARCHAR,
    quantity INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 为表“orders”创建一个名为“order_changes”的 Stream
CREATE STREAM order_changes ON TABLE orders;

-- 将订单 1001 插入到表“orders”中
INSERT INTO orders (order_id, product_name, quantity) VALUES (1001, 'Product A', 10);

-- 将订单 1002 插入到表“orders”中
INSERT INTO orders (order_id, product_name, quantity) VALUES (1002, 'Product B', 20);

-- 从“order_changes”Stream 中检索所有记录
SELECT * FROM order_changes;

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     order_id    │   product_name   │     quantity    │         order_date         │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼──────────────────┼─────────────────┼────────────────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│            1002 │ Product B        │              20 │ 2024-03-28 03:24:16.629135 │ INSERT        │ false            │ acb58bd6bb4243a4bf0832bf570b38c2000000 │
│            1001 │ Product A        │              10 │ 2024-03-28 03:24:16.539178 │ INSERT        │ false            │ b93a15e694db4134ab5a23afa8c92b20000000 │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

以下示例使用 `AT` 参数创建一个名为“order_changes_copy”的新 Stream，其中包含与“order_changes”相同的数据更改：

```sql
-- 在“orders”表上创建一个 Stream“order_changes_copy”，从“order_changes”复制数据更改
CREATE STREAM order_changes_copy ON TABLE orders AT (STREAM => order_changes);

-- 从“order_changes_copy”Stream 中检索所有记录
SELECT * FROM order_changes_copy;

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     order_id    │   product_name   │     quantity    │         order_date         │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼──────────────────┼─────────────────┼────────────────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│            1002 │ Product B        │              20 │ 2024-03-28 03:24:16.629135 │ INSERT        │ false            │ acb58bd6bb4243a4bf0832bf570b38c2000000 │
│            1001 │ Product A        │              10 │ 2024-03-28 03:24:16.539178 │ INSERT        │ false            │ b93a15e694db4134ab5a23afa8c92b20000000 │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

此示例在“orders”表上创建两个 Stream。每个 Stream 都使用 `AT` 参数分别获取特定快照 ID 或时间戳之后的数据更改。

```sql
-- 从“orders”表中检索快照和时间戳信息
SELECT snapshot_id, timestamp from FUSE_SNAPSHOT('default','orders');

┌───────────────────────────────────────────────────────────────┐
│            snapshot_id           │          timestamp         │
├──────────────────────────────────┼────────────────────────────┤
│ f7f57c7d07f445a68e4aa53fa2578bbb │ 2024-03-28 03:24:16.633721 │
│ 11b9d81eabc94c7da648908f0ba313a1 │ 2024-03-28 03:24:16.611835 │
└───────────────────────────────────────────────────────────────┘

-- 在“orders”表上创建一个 Stream“order_changes_after_snapshot”，捕获特定快照之后的数据更改
CREATE STREAM order_changes_after_snapshot ON TABLE orders AT (SNAPSHOT => '11b9d81eabc94c7da648908f0ba313a1');

-- 查询“order_changes_after_snapshot”Stream 以查看在指定快照之后捕获的数据更改
SELECT * FROM order_changes_after_snapshot;

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     order_id    │   product_name   │     quantity    │         order_date         │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼──────────────────┼─────────────────┼────────────────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│            1002 │ Product B        │              20 │ 2024-03-28 03:24:16.629135 │ INSERT        │ false            │ acb58bd6bb4243a4bf0832bf570b38c2000000 │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- 在“orders”表上创建一个 Stream“order_changes_after_timestamp”，捕获特定时间戳之后的数据更改
CREATE STREAM order_changes_after_timestamp ON TABLE orders AT (TIMESTAMP => '2024-03-28 03:24:16.611835'::TIMESTAMP);

-- 查询“order_changes_after_timestamp”Stream 以查看在指定时间戳之后捕获的数据更改
SELECT * FROM order_changes_after_timestamp;

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     order_id    │   product_name   │     quantity    │         order_date         │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼──────────────────┼─────────────────┼────────────────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│            1002 │ Product B        │              20 │ 2024-03-28 03:24:16.629135 │ INSERT        │ false            │ acb58bd6bb4243a4bf0832bf570b38c2000000 │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```