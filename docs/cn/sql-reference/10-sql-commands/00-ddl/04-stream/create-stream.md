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

| 参数           | 描述                                                                                                                                                                                                                                                                                                                    |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `< database_name >` | 流被视为属于特定数据库的对象，类似于表或视图。CREATE STREAM 允许流和关联的表使用不同的数据库。如果未明确指定数据库，则当前数据库将作为创建的流的数据库。               |
| AT                  | 当使用 `AT` 后跟 `TIMESTAMP =>` 或 `SNAPSHOT =>` 时，您可以通过时间戳或快照 ID 创建一个包含特定历史点之后数据变化的流；当 `AT` 后跟 `STREAM =>` 时，它允许创建一个与现有流相同的新流，保留相同的数据变化捕获。 |
| APPEND_ONLY         | 当设置为 `true` 时，流以 `Append-Only` 模式运行；当设置为 `false` 时，流以 `Standard` 模式运行。默认为 `true`。有关流操作模式的更多详细信息，请参阅 [流的工作原理](/guides/load-data/continuous-data-pipelines/stream#how-stream-works)。                                        |

## 示例

此示例演示了创建一个名为 'order_changes' 的流，用于监控 'orders' 表中的变化：

```sql
-- 创建一个名为 'orders' 的表
CREATE TABLE orders (
    order_id INT,
    product_name VARCHAR,
    quantity INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 为表 'orders' 创建一个名为 'order_changes' 的流
CREATE STREAM order_changes ON TABLE orders;

-- 向表 'orders' 中插入订单 1001
INSERT INTO orders (order_id, product_name, quantity) VALUES (1001, 'Product A', 10);

-- 向表 'orders' 中插入订单 1002
INSERT INTO orders (order_id, product_name, quantity) VALUES (1002, 'Product B', 20);

-- 从 'order_changes' 流中检索所有记录
SELECT * FROM order_changes;

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     order_id    │   product_name   │     quantity    │         order_date         │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼──────────────────┼─────────────────┼────────────────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│            1002 │ Product B        │              20 │ 2024-03-28 03:24:16.629135 │ INSERT        │ false            │ acb58bd6bb4243a4bf0832bf570b38c2000000 │
│            1001 │ Product A        │              10 │ 2024-03-28 03:24:16.539178 │ INSERT        │ false            │ b93a15e694db4134ab5a23afa8c92b20000000 │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

以下示例使用 `AT` 参数创建一个名为 'order_changes_copy' 的新流，包含与 'order_changes' 相同的数据变化：

```sql
-- 在 'orders' 表上创建一个流 'order_changes_copy'，从 'order_changes' 复制数据变化
CREATE STREAM order_changes_copy ON TABLE orders AT (STREAM => order_changes);

-- 从 'order_changes_copy' 流中检索所有记录
SELECT * FROM order_changes_copy;

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     order_id    │   product_name   │     quantity    │         order_date         │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼──────────────────┼─────────────────┼────────────────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│            1002 │ Product B        │              20 │ 2024-03-28 03:24:16.629135 │ INSERT        │ false            │ acb58bd6bb4243a4bf0832bf570b38c2000000 │
│            1001 │ Product A        │              10 │ 2024-03-28 03:24:16.539178 │ INSERT        │ false            │ b93a15e694db4134ab5a23afa8c92b20000000 │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

此示例在 'orders' 表上创建了两个流。每个流都使用 `AT` 参数来获取特定快照 ID 或时间戳之后的数据变化。

```sql
-- 从 'orders' 表中检索快照和时间戳信息
SELECT snapshot_id, timestamp from FUSE_SNAPSHOT('default','orders');

┌───────────────────────────────────────────────────────────────┐
│            snapshot_id           │          timestamp         │
├──────────────────────────────────┼────────────────────────────┤
│ f7f57c7d07f445a68e4aa53fa2578bbb │ 2024-03-28 03:24:16.633721 │
│ 11b9d81eabc94c7da648908f0ba313a1 │ 2024-03-28 03:24:16.611835 │
└───────────────────────────────────────────────────────────────┘

-- 在 'orders' 表上创建一个流 'order_changes_after_snapshot'，捕获特定快照之后的数据变化
CREATE STREAM order_changes_after_snapshot ON TABLE orders AT (SNAPSHOT => '11b9d81eabc94c7da648908f0ba313a1');

-- 查询 'order_changes_after_snapshot' 流以查看捕获的特定快照之后的数据变化
SELECT * FROM order_changes_after_snapshot;

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     order_id    │   product_name   │     quantity    │         order_date         │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼──────────────────┼─────────────────┼────────────────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│            1002 │ Product B        │              20 │ 2024-03-28 03:24:16.629135 │ INSERT        │ false            │ acb58bd6bb4243a4bf0832bf570b38c2000000 │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- 在 'orders' 表上创建一个流 'order_changes_after_timestamp'，捕获特定时间戳之后的数据变化
CREATE STREAM order_changes_after_timestamp ON TABLE orders AT (TIMESTAMP => '2024-03-28 03:24:16.611835'::TIMESTAMP);

-- 查询 'order_changes_after_timestamp' 流以查看捕获的特定时间戳之后的数据变化
SELECT * FROM order_changes_after_timestamp;

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     order_id    │   product_name   │     quantity    │         order_date         │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼──────────────────┼─────────────────┼────────────────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│            1002 │ Product B        │              20 │ 2024-03-28 03:24:16.629135 │ INSERT        │ false            │ acb58bd6bb4243a4bf0832bf570b38c2000000 │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```