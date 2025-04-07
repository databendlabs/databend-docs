---
title: Virtual Column
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VIRTUAL COLUMN'/>

Virtual Column 是一种结构，通过提取 [Variant](/sql/sql-reference/data-types/variant) 数据中的嵌套字段，并将这些数据存储在单独的存储文件中来形成。当您定期查询 Variant 数据中的特定嵌套字段时，请考虑使用 Virtual Column，以实现以下优势：

- **加速查询处理**: Virtual Column 通过消除遍历整个嵌套结构以定位所需数据的需求，从而简化了查询过程。从 Virtual Column 直接检索数据与访问常规列的过程类似，从而显著加速了查询执行。

- **减少内存使用**: Variant 数据通常包含许多内部字段，读取所有这些字段可能会导致大量内存消耗。通过转换为读取 Virtual Column，可以显著减少内存使用，从而降低潜在的内存溢出风险。

![Alt text](/img/sql/virtual-column.png)

## 管理 Virtual Column

Databend 提供了各种命令来管理 Virtual Column。有关详细信息，请参见 [VIRTUAL COLUMN](/sql/sql-reference/data-types/variant/)。

## 使用示例

此示例演示了 Virtual Column 的实际使用及其对查询执行的影响：

```sql
-- 创建一个名为 'test' 的表，其中包含类型为 Variant 的列 'id' 和 'val'。
CREATE TABLE test(id int, val variant);

-- 为 'val' 列中的特定元素创建 Virtual Column。
CREATE VIRTUAL COLUMN (
  val ['name'],                 -- 提取 'name' 字段。
  val ['tags'] [0],             -- 提取 'tags' 数组中的第一个元素。
  val ['pricings'] [0] ['type'] -- 提取 'pricings' 数组中第一个 pricing 的 'type' 字段。
) FOR test;

-- 将示例记录与 Variant 数据插入到 'test' 表中。
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

-- 刷新 Virtual Column
REFRESH VIRTUAL COLUMN FOR test;

-- 解释用于从表中选择特定字段的查询执行计划。
EXPLAIN
SELECT
  val ['name'],
  val ['tags'] [0],
  val ['pricings'] [0] ['type']
FROM
  test;

-[ EXPLAIN ]-----------------------------------
Exchange
├── output columns: [test.val['name'] (#2), test.val['tags'][0] (#3), test.val['pricings'][0]['type'] (#4)]
├── exchange type: Merge
└── TableScan
    ├── table: default.book_db.test
    ├── output columns: [val['name'] (#2), val['tags'][0] (#3), val['pricings'][0]['type'] (#4)]
    ├── read rows: 160
    ├── read size: 4.96 KiB
    ├── partitions total: 16
    ├── partitions scanned: 16
    ├── pruning stats: [segments: <range pruning: 6 to 6>, blocks: <range pruning: 16 to 16>]
    ├── push downs: [filters: [], limit: NONE]
    ├── virtual columns: [val['name'], val['pricings'][0]['type'], val['tags'][0]]
    └── estimated rows: 160.00

-- 解释用于仅从表中选择 'name' 字段的查询执行计划。
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
    ├── read size: 1.70 KiB
    ├── partitions total: 16
    ├── partitions scanned: 16
    ├── pruning stats: [segments: <range pruning: 6 to 6>, blocks: <range pruning: 16 to 16>]
    ├── push downs: [filters: [], limit: NONE]
    ├── virtual columns: [val['name']]
    └── estimated rows: 160.00

-- 显示系统中定义的所有 Virtual Column。
SHOW VIRTUAL COLUMNS;

┌─────────────────────────────────────────────────────────────────────────────┐
│ database │  table │                     virtual_columns                     │
├──────────┼────────┼─────────────────────────────────────────────────────────┤
│ default  │ test   │ val['name'], val['pricings'][0]['type'], val['tags'][0] │
└─────────────────────────────────────────────────────────────────────────────┘

-- 删除与 'test' 表关联的 Virtual Column。
DROP VIRTUAL COLUMN FOR test;
```