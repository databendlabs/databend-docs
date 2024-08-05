---
title: FUSE_STATISTIC
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.587"/>

返回指定表中每一列的统计信息：

- `distinct_count`: 返回估计的不同值数量。
- `histogram`: 为列生成直方图，将数据分布分解为多个桶。每个桶包含以下信息：
    - `bucket id`: 桶的标识符。
    - `min`: 桶内的最小值。
    - `max`: 桶内的最大值。
    - `ndv` (number of distinct values): 桶内唯一值的计数。
    - `count`: 桶内值的总数。

## 语法

```sql
FUSE_STATISTIC('<database_name>', '<table_name>')
```

必须将 `enable_analyze_histogram` 设置为 `1`，该函数才会生成直方图。默认情况下，此设置为 `0`，即除非明确启用，否则不会生成直方图。

```sql
SET enable_analyze_histogram = 1;
```

## 示例

您最有可能与 [ANALYZE TABLE](/sql/sql-commands/ddl/table/analyze-table) 一起使用此函数来检查表的统计信息。请参阅 [ANALYZE TABLE](/sql/sql-commands/ddl/table/analyze-table) 页面上的 [示例](/sql/sql-commands/ddl/table/analyze-table#examples) 部分。