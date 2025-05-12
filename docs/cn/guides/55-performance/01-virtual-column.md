---
title: Virtual Column
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VIRTUAL COLUMN'/>

# Databend 中的虚拟列：加速半结构化数据的查询

Databend 中的虚拟列提供了一种强大而自动的方式，可以显著加速对半结构化数据的查询，尤其是存储在 [Variant](/sql/sql-reference/data-types/variant) 数据类型中的数据。此功能动态优化数据访问，从而加快查询执行速度并减少资源消耗。

## 概述

当处理 `VARIANT` 列中的嵌套数据结构时，访问特定数据点可能会成为性能瓶颈。Databend 的虚拟列通过自动识别和优化嵌套字段来解决此问题。虚拟列可以直接检索数据，类似于访问常规列，而无需重复遍历整个嵌套结构。

Databend 在数据提取期间自动检测 `VARIANT` 列中的嵌套字段。如果某个字段满足一定的存在阈值，它将在后台物化为虚拟列，确保数据随时可用于优化查询。此过程是完全自动的，无需手动配置或干预。

![Alt text](/img/sql/virtual-column.png)

## 性能优势

*   **显著的查询加速：** 虚拟列通过直接访问嵌套字段，显著减少了查询执行时间。这消除了为每个查询遍历复杂 JSON 结构的开销。
*   **降低资源消耗：** 通过仅物化必要的嵌套字段，虚拟列最大限度地减少了查询处理期间的内存消耗。这提高了资源利用率，并改善了整体系统性能。
*   **自动优化：** Databend 自动识别字段并将其物化为虚拟列。然后，查询优化器会自动重写查询，以便在访问 `VARIANT` 列中的数据时利用这些虚拟列。
*   **透明操作：** 虚拟列的创建和管理对用户完全透明。查询会自动优化，而无需更改查询语法或数据加载过程。查询优化器负责重写查询以利用虚拟列。

## 工作原理

1.  **数据提取：** 提取包含 `VARIANT` 列的数据时，Databend 会分析 JSON 数据的结构。
2.  **字段存在检查：** Databend 检查嵌套字段是否满足一定的存在阈值。
3.  **虚拟列物化：** 如果满足字段存在阈值，系统会自动在后台将该字段物化为虚拟列。
4.  **查询优化：** 当查询访问 `VARIANT` 列中的嵌套字段时，查询优化器会自动重写查询，以使用相应的虚拟列来更快地检索数据。

## 重要注意事项

*   **开销：** 虽然虚拟列通常可以提高查询性能，但它们确实会引入一些存储和维护开销。Databend 会自动平衡虚拟列的优势与此开销，以确保最佳性能。
*   **实验性功能：** 虚拟列目前是一项实验性功能。默认情况下处于禁用状态。要启用虚拟列，必须将 `enable_experimental_virtual_column` 设置为 `1`：
*   **自动刷新：** 插入数据后，虚拟列将自动刷新。如果您不想自动生成虚拟列数据，可以将 `enable_refresh_virtual_column_after_write` 设置为 `0` 以禁用虚拟列的生成。可以使用 refresh virtual column 命令完成异步刷新。有关详细信息，请参见 [REFRESH VIRTUAL COLUMN](/sql/sql-commands/ddl/virtual-column/refresh-virtual-column)。
*   **显示虚拟列：** 您可以通过 [SHOW VIRTUAL COLUMNS](/sql/sql-commands/ddl/virtual-column/show-virtual-columns) 命令查看有关虚拟列的信息，并且可以通过 [FUSE_VIRTUAL_COLUMN](/sql/sql-functions/system-functions/fuse_virtual_column) 系统函数查看有关虚拟列元数据的信息。

## 使用示例

此示例演示了虚拟列的实际使用及其对查询执行的影响：

```sql
SET enable_experimental_virtual_column=1;

-- Create a table named 'test' with columns 'id' and 'val' of type Variant.
CREATE TABLE test(id int, val variant);

-- Insert sample records into the 'test' table with Variant data.
INSERT INTO
  test
VALUES
  (
    1,
    '{"id":1,"name":"databend","tags":["powerful","fast"],"pricings":[{"type":"Standard","price":"Pay as you go"},{"type":"Enterprise","price":"Custom"}]}'
  ),
  (
    2,
    '{"id":2,"name":"databricks","tags":["scalable","flexible"],"pricings":[{"type":"Free","price":"Trial"},{"type":"Premium","price":"Subscription"}]}'
  ),
  (
    3,
    '{"id":3,"name":"snowflake","tags":["cloud-native","secure"],"pricings":[{"type":"Basic","price":"Pay per second"},{"type":"Enterprise","price":"Annual"}]}'
  ),
  (
    4,
    '{"id":4,"name":"redshift","tags":["reliable","scalable"],"pricings":[{"type":"On-Demand","price":"Pay per usage"},{"type":"Reserved","price":"1 year contract"}]}'
  ),
  (
    5,
    '{"id":5,"name":"bigquery","tags":["innovative","cost-efficient"],"pricings":[{"type":"Flat Rate","price":"Monthly"},{"type":"Flex","price":"Per query"}]}'
  );

INSERT INTO test SELECT * FROM test;
INSERT INTO test SELECT * FROM test;
INSERT INTO test SELECT * FROM test;
INSERT INTO test SELECT * FROM test;
INSERT INTO test SELECT * FROM test;

-- Show the virtual columns

-- Explain the query execution plan for selecting specific fields from the table.
EXPLAIN
SELECT
  val ['name'],
  val ['tags'] [0],
  val ['pricings'] [0] ['type']
FROM
  test;

-[ EXPLAIN ]-----------------------------------
Exchange
├── output columns: [test.val['name'] (#3), test.val['pricings'][0]['type'] (#5), test.val['tags'][0] (#8)]
├── exchange type: Merge
└── TableScan
    ├── table: default.default.test
    ├── output columns: [val['name'] (#3), val['pricings'][0]['type'] (#5), val['tags'][0] (#8)]
    ├── read rows: 160
    ├── read size: 1.69 KiB
    ├── partitions total: 6
    ├── partitions scanned: 6
    ├── pruning stats: [segments: <range pruning: 6 to 6>, blocks: <range pruning: 6 to 6>]
    ├── push downs: [filters: [], limit: NONE]
    ├── virtual columns: [val['name'], val['pricings'][0]['type'], val['tags'][0]]
    └── estimated rows: 160.00

-- Explain the query execution plan for selecting only the 'name' field from the table.
EXPLAIN
SELECT
  val ['name']
FROM
  test;

-[ EXPLAIN ]-----------------------------------
Exchange
├── output columns: [test.val['name'] (#2)]
├── exchange type: Merge
└── TableScan
    ├── table: default.book_db.test
    ├── output columns: [val['name'] (#2)]
    ├── read rows: 160
    ├── read size: < 1 KiB
    ├── partitions total: 16
    ├── partitions scanned: 16
    ├── pruning stats: [segments: <range pruning: 6 to 6>, blocks: <range pruning: 16 to 16>]
    ├── push downs: [filters: [], limit: NONE]
    ├── virtual columns: [val['name']]
    └── estimated rows: 160.00

-- Display all the auto generated virtual columns.
SHOW VIRTUAL COLUMNS WHERE table='test';

╭────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ database │  table │ source_column │ virtual_column_id │    virtual_column_name   │ virtual_column_type │
│  String  │ String │     String    │       UInt32      │          String          │        String       │
├──────────┼────────┼───────────────┼───────────────────┼──────────────────────────┼─────────────────────┤
│ default  │ test   │ val           │        3000000000 │ ['id']                   │ UInt64              │
│ default  │ test   │ val           │        3000000001 │ ['name']                 │ String              │
│ default  │ test   │ val           │        3000000002 │ ['pricings'][0]['price'] │ String              │
│ default  │ test   │ val           │        3000000003 │ ['pricings'][0]['type']  │ String              │
│ default  │ test   │ val           │        3000000004 │ ['pricings'][1]['price'] │ String              │
│ default  │ test   │ val           │        3000000005 │ ['pricings'][1]['type']  │ String              │
│ default  │ test   │ val           │        3000000006 │ ['tags'][0]              │ String              │
│ default  │ test   │ val           │        3000000007 │ ['tags'][1]              │ String              │
╰────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```