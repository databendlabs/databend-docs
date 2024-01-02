---
title: 聚合索引
---
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='聚合索引'/>

聚合索引的主要目的是提高查询性能，特别是在涉及聚合查询（如 MIN、MAX 和 SUM）的场景中。它通过预先计算并分别在块中存储查询结果，从而无需扫描整个表，加快了数据检索速度。在使用聚合索引时，请注意以下几点：

- 创建聚合索引时，应将其使用限制在标准的[聚合函数](/sql/sql-functions/aggregate-functions/)（例如 AVG、SUM、MIN、MAX、COUNT 和 GROUP BY）上，同时请注意[GROUPING SETS](../54-query/01-groupby/group-by-grouping-sets.md)、[窗口函数](/sql/sql-functions/window-functions/)、[LIMIT](/sql/sql-commands/query-syntax/query-select#limit-clause) 和 [ORDER BY](/sql/sql-commands/query-syntax/query-select#order-by-clause) 不被接受，否则您将收到错误：`当前创建聚合索引仅支持简单查询，如：SELECT ... FROM ... WHERE ... GROUP BY ...`。

- 创建聚合索引时定义的查询过滤范围应与实际查询的范围相匹配或包含实际查询的范围。

- 要确认聚合索引是否适用于某个查询，请使用 [EXPLAIN](/sql/sql-commands/explain-cmds/explain) 命令分析该查询。

- 如果您不再需要某个聚合索引，请考虑删除它。请注意，删除聚合索引并不会移除关联的存储块。要同时删除这些块，请使用 [VACUUM TABLE](/sql/sql-commands/ddl/table/vacuum-table) 命令。要禁用聚合索引扫描功能，请将 `enable_aggregating_index_scan` 设置为 0。

### 刷新聚合索引

由于表在创建聚合索引后可能会进行数据插入和更新，聚合索引需要定期刷新。您有以下选项来刷新聚合索引：

- **自动刷新**：如果聚合索引是**使用 SYNC 关键字创建的**，当表接收可能影响查询结果的数据更新时，聚合索引将自动刷新。更多信息，请参见 [CREATE AGGREGATING INDEX](/sql/sql-commands/ddl/aggregating-index/create-aggregating-index)。

- **手动刷新**：如果聚合索引是**没有使用 SYNC 关键字创建的**，聚合索引不会自动刷新。相反，您可以使用 [REFRESH AGGREGATING INDEX](/sql/sql-commands/ddl/aggregating-index/refresh-aggregating-index) 命令手动刷新它。在这种情况下，Databend 建议在执行相关查询之前刷新聚合索引。

:::note 自动还是手动？
Databend 中的自动刷新机制可能会影响大量数据加载的持续时间。这是因为 Databend 会等到自动刷新的聚合索引更新以反映最新结果后，才会释放数据加载结果。Databend Cloud 用户建议使用手动刷新机制。这是因为 Databend Cloud 即使对于没有使用 SYNC 关键字创建的聚合索引，也会在后台自动更新聚合索引，以响应表数据的变化。
:::

### 管理聚合索引

Databend 提供了多种命令来管理聚合索引。详情请参见 [聚合索引](/sql/sql-commands/ddl/aggregating-index/)。

### 使用示例

此示例演示了聚合索引的使用，并说明了它们对查询执行计划的影响。

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