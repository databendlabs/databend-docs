---
title: 聚合索引
---

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='AGGREGATING INDEX'/>

聚合索引的主要目的是提高查询性能，尤其是在涉及 MIN、MAX 和 SUM 等聚合查询的场景中。它通过预先计算并将查询结果单独存储在块中来实现这一点，从而无需扫描整个表，从而加快了数据检索速度。使用聚合索引时，请注意以下事项：

- 创建聚合索引时，请将其使用限制为标准 [Aggregate Functions](/sql/sql-functions/aggregate-functions/)（例如，AVG、SUM、MIN、MAX、COUNT 和 GROUP BY），同时请记住 [GROUPING SETS](../54-query/01-groupby/group-by-grouping-sets.md)、[Window Functions](/sql/sql-functions/window-functions/)、[LIMIT](/sql/sql-commands/query-syntax/query-select#limit-clause) 和 [ORDER BY](/sql/sql-commands/query-syntax/query-select#order-by-clause) 不被接受，否则会出现错误：`Currently create aggregating index just support simple query, like: SELECT ... FROM ... WHERE ... GROUP BY ...`。

- 创建聚合索引时定义的查询筛选范围应与实际查询的范围匹配或包含实际查询的范围。

- 要确认聚合索引是否适用于查询，请使用 [EXPLAIN](/sql/sql-commands/explain-cmds/explain) 命令来分析查询。

- 如果不再需要聚合索引，请考虑将其删除。请注意，删除聚合索引不会删除关联的存储块。要同时删除这些块，请使用 [VACUUM TABLE](/sql/sql-commands/ddl/table/vacuum-table) 命令。要禁用聚合索引功能，请将 `enable_aggregating_index_scan` 设置为 0。

## 刷新聚合索引

聚合索引需要定期刷新，因为表在创建聚合索引后可能会进行数据插入和更新。您可以使用以下选项来刷新聚合索引：

- **自动刷新**：如果聚合索引是**使用 SYNC 关键字创建的**，则当表收到可能影响查询结果的数据更新时，聚合索引将自动刷新。有关更多信息，请参见 [CREATE AGGREGATING INDEX](/sql/sql-commands/ddl/aggregating-index/create-aggregating-index)。

- **手动刷新**：如果聚合索引是**在没有 SYNC 关键字的情况下创建的**，则聚合索引不会自动刷新。相反，您可以使用 [REFRESH AGGREGATING INDEX](/sql/sql-commands/ddl/aggregating-index/refresh-aggregating-index) 命令手动刷新它。在这种情况下，Databend 建议在执行相关查询之前刷新聚合索引。

:::note automatic or manual?
Databend 中的自动刷新机制可能会影响重要数据加载的持续时间。这是因为 Databend 会保留数据加载结果，直到自动刷新的聚合索引已更新以反映最新结果。建议 Databend Cloud 用户使用手动刷新机制。这是因为 Databend Cloud 会在后台自动更新聚合索引，即使对于那些在没有 SYNC 关键字的情况下创建的索引，以响应表数据中的更改。
:::

## 管理聚合索引

Databend 提供了各种命令来管理聚合索引。有关详细信息，请参见 [Aggregating Index](/sql/sql-commands/ddl/aggregating-index/)。

## 使用示例

此示例演示了聚合索引的利用率，并说明了它们对查询执行计划的影响。

```sql
-- 准备数据
CREATE TABLE agg(a int, b int, c int);
INSERT INTO agg VALUES (1,1,4), (1,2,1), (1,2,4), (2,2,5);

-- 创建聚合索引
CREATE AGGREGATING INDEX my_agg_index AS SELECT MIN(a), MAX(c) FROM agg;

-- 刷新聚合索引
REFRESH AGGREGATING INDEX my_agg_index;

-- 验证聚合索引是否有效
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

-- 删除聚合索引
DROP AGGREGATING INDEX my_agg_index;

EXPLAIN SELECT MIN(a), MAX(c) FROM agg;
```

```text
explain
----------------------------------------------------------------------------------------------------------------------+
AggregateFinal
├── output columns: [MIN(a) (#3), MAX(c) (#4)]
├── group by: []
├── aggregate functions: [min(a), max(c)]
├── estimated rows: 1.00
└── AggregatePartial
    ├── output columns: [MIN(a) (#3), MAX(c) (#4)]
    ├── group by: []
    ├── aggregate functions: [min(a), max(c)]
    ├── estimated rows: 1.00
    └── TableScan
        ├── table: default.default.agg
        ├── output columns: [a (#0), c (#2)]
        ├── read rows: 4
        ├── read bytes: 61
        ├── partitions total: 1
        ├── partitions scanned: 1
        ├── pruning stats: `[segments: <range pruning: 1 to 1>, blocks: <range pruning: 1 to 1, bloom pruning: 0 to 0>]`
        ├── push downs: [filters: [], limit: NONE]
        └── estimated rows: 4.00
```