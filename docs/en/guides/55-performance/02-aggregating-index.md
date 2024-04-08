---
title: Aggregating Index
---
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='AGGREGATING INDEX'/>

The primary purpose of the aggregating index is to enhance query performance, especially in scenarios involving aggregation queries such as MIN, MAX, and SUM. It achieves this by precomputing and storing query results separately in blocks, eliminating the need to scan the entire table and thereby speeding up data retrieval. Please note the following when working with aggregating indexes:

- When creating aggregating indexes, limit their usage to standard [Aggregate Functions](/sql/sql-functions/aggregate-functions/) (e.g., AVG, SUM, MIN, MAX, COUNT and GROUP BY), while keeping in mind that [GROUPING SETS](../54-query/01-groupby/group-by-grouping-sets.md), [Window Functions](/sql/sql-functions/window-functions/), [LIMIT](/sql/sql-commands/query-syntax/query-select#limit-clause), and [ORDER BY](/sql/sql-commands/query-syntax/query-select#order-by-clause) are not accepted, or you will get an error: `Currently create aggregating index just support simple query, like: SELECT ... FROM ... WHERE ... GROUP BY ...`.

- The query filter scope defined when creating aggregating indexes should either match or encompass the scope of your actual queries.

- To confirm if an aggregating index works for a query, use the [EXPLAIN](/sql/sql-commands/explain-cmds/explain) command to analyze the query.

- If you no longer need an aggregating index, consider deleting it. Please note that deleting an aggregating index does NOT remove the associated storage blocks. To delete the blocks as well, use the [VACUUM TABLE](/sql/sql-commands/ddl/table/vacuum-table) command. To disable the aggregating indexing feature, set `enable_aggregating_index_scan` to 0.

## Refreshing Aggregating Index

An aggregating index requires regular refreshes since the table may undergo data insertions and updates after the creation of the aggregating index. You have the following options to refresh an aggregating index:

- **Automatic Refresh**: If an aggregating index is **created with the SYNC keyword**, the aggregating index will refresh automatically when the table receive data updates that may affect the query results. For more information, see [CREATE AGGREGATING INDEX](/sql/sql-commands/ddl/aggregating-index/create-aggregating-index).

- **Manual Refresh**: If an aggregating index is **created without the SYNC keyword**, the aggregating index does not refresh automatically. Instead, you can manually refresh it using the [REFRESH AGGREGATING INDEX](/sql/sql-commands/ddl/aggregating-index/refresh-aggregating-index) command. In this case, Databend recommends refreshing the aggregating index before executing the relevant query.

:::note automatic or manual?
The Automatic Refresh mechanism in Databend has the potential to affect the duration of significant data loading. This is because Databend withholds the data loading result until the automatically refreshing aggregating indexes have been updated to reflect the latest results. Databend Cloud users are recommended to use the Manual Refresh mechanism. This is because Databend Cloud automatically updates aggregating indexes in the background, even for those created without the SYNC keyword, in response to changes in table data.
:::

## Managing Aggregating Index

Databend provides a variety of commands to manage aggregating indexes. For details, see [Aggregating Index](/sql/sql-commands/ddl/aggregating-index/).

## Usage Examples

This example demonstrates the utilization of aggregating indexes and illustrates their impact on the query execution plan.

```sql
-- Prepare data
CREATE TABLE agg(a int, b int, c int);
INSERT INTO agg VALUES (1,1,4), (1,2,1), (1,2,4), (2,2,5);

-- Create an aggregating index
CREATE AGGREGATING INDEX my_agg_index AS SELECT MIN(a), MAX(c) FROM agg;

-- Refresh the aggregating index
REFRESH AGGREGATING INDEX my_agg_index;

-- Verify if the aggregating index works
EXPLAIN SELECT MIN(a), MAX(c) FROM agg;

explain                                                                                                               |
----------------------------------------------------------------------------------------------------------------------+
AggregateFinal                                                                                                        |
├── output columns: [MIN(a) (#8), MAX(c) (#9)]                                                                        |
├── group by: []                                                                                                      |
├── aggregate functions: [min(a), max(c)]                                                                             |
├── estimated rows: 1.00                                                                                              |
└── AggregatePartial                                                                                                  |
    ├── output columns: [MIN(a) (#8), MAX(c) (#9)]                                                                    |
    ├── group by: []                                                                                                  |
    ├── aggregate functions: [min(a), max(c)]                                                                         |
    ├── estimated rows: 1.00                                                                                          |
    └── TableScan                                                                                                     |
        ├── table: default.default.agg                                                                                |
        ├── output columns: [a (#5), c (#7)]                                                                          |
        ├── read rows: 4                                                                                              |
        ├── read bytes: 61                                                                                            |
        ├── partitions total: 1                                                                                       |
        ├── partitions scanned: 1                                                                                     |
        ├── pruning stats: [segments: <range pruning: 1 to 1>, blocks: <range pruning: 1 to 1, bloom pruning: 0 to 0>]|
        ├── push downs: [filters: [], limit: NONE]                                                                    |
        ├── aggregating index: [SELECT MIN(a), MAX(c) FROM default.agg]                                               |
        ├── rewritten query: [selection: [index_col_0 (#0), index_col_1 (#1)]]                                        |
        └── estimated rows: 4.00                                                                                      |

-- Delete the aggregating index
DROP AGGREGATING INDEX my_agg_index;

EXPLAIN SELECT MIN(a), MAX(c) FROM agg;

explain                                                                                                               |
----------------------------------------------------------------------------------------------------------------------+
AggregateFinal                                                                                                        |
├── output columns: [MIN(a) (#3), MAX(c) (#4)]                                                                        |
├── group by: []                                                                                                      |
├── aggregate functions: [min(a), max(c)]                                                                             |
├── estimated rows: 1.00                                                                                              |
└── AggregatePartial                                                                                                  |
    ├── output columns: [MIN(a) (#3), MAX(c) (#4)]                                                                    |
    ├── group by: []                                                                                                  |
    ├── aggregate functions: [min(a), max(c)]                                                                         |
    ├── estimated rows: 1.00                                                                                          |
    └── TableScan                                                                                                     |
        ├── table: default.default.agg                                                                                |
        ├── output columns: [a (#0), c (#2)]                                                                          |
        ├── read rows: 4                                                                                              |
        ├── read bytes: 61                                                                                            |
        ├── partitions total: 1                                                                                       |
        ├── partitions scanned: 1                                                                                     |
        ├── pruning stats: [segments: <range pruning: 1 to 1>, blocks: <range pruning: 1 to 1, bloom pruning: 0 to 0>]|
        ├── push downs: [filters: [], limit: NONE]                                                                    |
        └── estimated rows: 4.00                                                                                      |
```