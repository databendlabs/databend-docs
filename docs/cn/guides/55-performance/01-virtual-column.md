---
title: 虚拟列
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VIRTUAL COLUMN'/>

虚拟列是通过提取[Variant](/sql/sql-reference/data-types/data-type-variant)数据中的嵌套字段，并将这些数据存储在单独的存储文件中形成的一种结构。当您经常查询 Variant 数据中的特定嵌套字段时，考虑使用虚拟列以实现以下好处：

- **加速查询处理**：虚拟列通过消除遍历整个嵌套结构以定位所需数据的需求，简化了查询过程。直接从虚拟列检索数据与访问常规列的过程相平行，从而显著加快了查询执行速度。

- **减少内存使用**：Variant 数据通常包含许多内部字段，读取所有这些字段可能导致大量内存消耗。通过转向读取虚拟列，内存使用量显著减少，降低了潜在内存溢出的风险。

![Alt text](@site/docs/public/img/sql/virtual-column.png)

## 管理虚拟列

Databend 提供了多种命令来管理虚拟列。详细信息，请参阅 [VIRTUAL COLUMN](/sql/sql-commands/ddl/virtual-column/)。

## 使用示例

本示例展示了虚拟列的实际应用及其对查询执行的影响：

```sql
-- 创建一个名为 'test' 的表，包含 'id' 和 'val' 列，类型为 Variant。
CREATE TABLE test(id int, val variant);

-- 为 'val' 列中的特定元素创建虚拟列。
CREATE VIRTUAL COLUMN (
  val ['name'],                 -- 提取 'name' 字段。
  val ['tags'] [0],             -- 提取 'tags' 数组中的第一个元素。
  val ['pricings'] [0] ['type'] -- 从 'pricings' 数组中的第一个定价提取 'type' 字段。
) FOR test;

-- 向 'test' 表插入一个包含 Variant 数据的示例记录。
INSERT INTO
  test
VALUES
  (
    1,
    '{"id":1,"name":"databend","tags":["powerful","fast"],"pricings":[{"type":"Standard","price":"Pay as you go"},{"type":"Enterprise","price":"Custom"}]}'
  );

-- 解释从表中选择特定字段的查询执行计划。
EXPLAIN
SELECT
  val ['name'],
  val ['tags'] [0],
  val ['pricings'] [0] ['type']
FROM
  test;

-[ EXPLAIN ]-----------------------------------
TableScan
├── table: default.default.test
├── output columns: [val['name'] (#2), val['tags'][0] (#3), val['pricings'][0]['type'] (#4)]
├── read rows: 1
├── read bytes: 203
├── partitions total: 1
├── partitions scanned: 1
├── pruning stats: [segments: <range pruning: 1 to 1>, blocks: <range pruning: 1 to 1, bloom pruning: 0 to 0>]
├── push downs: [filters: [], limit: NONE, virtual_columns: [val['name'], val['pricings'][0]['type'], val['tags'][0]]]
└── estimated rows: 1.00

-- 解释仅从表中选择 'name' 字段的查询执行计划。
EXPLAIN
SELECT
  val ['name']
FROM
  test;

-[ EXPLAIN ]-----------------------------------
TableScan
├── table: default.default.test
├── output columns: [val['name'] (#2)]
├── read rows: 1
├── read bytes: 203
├── partitions total: 1
├── partitions scanned: 1
├── pruning stats: [segments: <range pruning: 1 to 1>, blocks: <range pruning: 1 to 1, bloom pruning: 0 to 0>]
├── push downs: [filters: [], limit: NONE, virtual_columns: [val['name']]]
└── estimated rows: 1.00

-- 显示系统中定义的所有虚拟列。
SHOW VIRTUAL COLUMNS;

┌─────────────────────────────────────────────────────────────────────────────┐
│ database │  table │                     virtual_columns                     │
├──────────┼────────┼─────────────────────────────────────────────────────────┤
│ default  │ test   │ val['name'], val['pricings'][0]['type'], val['tags'][0] │
└─────────────────────────────────────────────────────────────────────────────┘

-- 删除与 'test' 表关联的虚拟列。
DROP VIRTUAL COLUMN FOR test;
```
