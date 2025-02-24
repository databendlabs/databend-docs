---
title: Virtual Column
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VIRTUAL COLUMN'/>

A virtual column is a construct formed by extracting nested fields within [Variant](/sql/sql-reference/data-types/variant) data and storing that data in separate storage files. Consider using virtual columns when you regularly query specific nested fields within Variant data to realize the following benefits:

- **Accelerated Query Processing**: Virtual columns streamline the querying process by eliminating the need to traverse the entire nested structure to locate the desired data. Direct data retrieval from virtual columns parallels the process of accessing regular columns, resulting in a significant acceleration of query execution.

- **Reduced Memory Usage**: Variant data often includes numerous internal fields, and reading all of them can lead to substantial memory consumption. By transitioning to reading virtual columns, there is a notable reduction in memory usage, mitigating the risk of potential memory overflows.

![Alt text](/img/sql/virtual-column.png)

## Managing Virtual Columns

Databend provides a variety of commands to manage virtual columns. For details, see [VIRTUAL COLUMN](/sql/sql-commands/ddl/virtual-column/).

## Usage Examples

This example demonstrates the practical use of virtual columns and their impact on query execution:

```sql
-- Create a table named 'test' with columns 'id' and 'val' of type Variant.
CREATE TABLE test(id int, val variant);

-- Create virtual columns for specific elements in the 'val' column.
CREATE VIRTUAL COLUMN (
  val ['name'],                 -- Extract the 'name' field.
  val ['tags'] [0],             -- Extract the first element in the 'tags' array.
  val ['pricings'] [0] ['type'] -- Extract the 'type' field from the first pricing in the 'pricings' array.
) FOR test;

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

-- Refresh the virtual columns
REFRESH VIRTUAL COLUMN FOR test;

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
    ├── read size: 1.70 KiB
    ├── partitions total: 16
    ├── partitions scanned: 16
    ├── pruning stats: [segments: <range pruning: 6 to 6>, blocks: <range pruning: 16 to 16>]
    ├── push downs: [filters: [], limit: NONE]
    ├── virtual columns: [val['name']]
    └── estimated rows: 160.00

-- Display all the virtual columns defined in the system.
SHOW VIRTUAL COLUMNS;

┌─────────────────────────────────────────────────────────────────────────────┐
│ database │  table │                     virtual_columns                     │
├──────────┼────────┼─────────────────────────────────────────────────────────┤
│ default  │ test   │ val['name'], val['pricings'][0]['type'], val['tags'][0] │
└─────────────────────────────────────────────────────────────────────────────┘

-- Drop the virtual columns associated with the 'test' table.
DROP VIRTUAL COLUMN FOR test;
```
