---
title: FUSE_STATISTIC
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.587"/>

返回指定表中每一列的统计信息：

- `distinct_count`: 返回不同值的估计数量。
- `histogram`: 为列生成直方图，将数据分布分解为桶。每个桶包括以下信息：
    - `bucket id`: 桶的标识符。
    - `min`: 桶内的最小值。
    - `max`: 桶内的最大值。
    - `ndv` (不同值的数量): 桶内唯一值的计数。
    - `count`: 桶内的值的总数。

## 语法

```sql
FUSE_STATISTIC('<database_name>', '<table_name>')
```

必须将 `enable_analyze_histogram` 设置为 `1`，该函数才能生成直方图。默认情况下，此设置为 `0`，这意味着除非显式启用，否则不会生成直方图。

```sql
SET enable_analyze_histogram = 1;
```

## 示例

你很可能会将此函数与 [ANALYZE TABLE](/sql/sql-commands/ddl/table/analyze-table) 一起使用，以检查表的统计信息。请参见 [ANALYZE TABLE](/sql/sql-commands/ddl/table/analyze-table) 页面上的 [示例](/sql/sql-commands/ddl/table/analyze-table#examples) 部分。