---
title: 创建聚合索引
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.339"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='聚合索引'/>

在 Databend 中创建一个新的聚合索引。

## 语法

```sql
CREATE [ OR REPLACE ] [ ASYNC ] AGGREGATING INDEX <index_name> AS SELECT ...
```

- `ASYNC` 选项：添加 ASYNC 是可选的。它允许索引异步创建。这意味着索引不会立即构建。要稍后构建它，请使用 [REFRESH AGGREGATING INDEX](refresh-aggregating-index.md) 命令。

- 在创建聚合索引时，限制它们的使用范围为标准的[聚合函数](../../../20-sql-functions/07-aggregate-functions/index.md)（例如，AVG、SUM、MIN、MAX、COUNT 和 GROUP BY），同时记住 [GROUPING SETS](/guides/query/groupby/group-by-grouping-sets)、[窗口函数](../../../20-sql-functions/08-window-functions/index.md)、[LIMIT](../../20-query-syntax/01-query-select.md#limit-clause) 和 [ORDER BY](../../20-query-syntax/01-query-select.md#order-by-clause) 不被接受，否则您将收到错误：`目前创建聚合索引仅支持简单查询，如：SELECT ... FROM ... WHERE ... GROUP BY ...`。

- 创建聚合索引时定义的查询过滤范围应该与您实际查询的范围匹配或包含该范围。

- 要确认聚合索引是否适用于某个查询，请使用 [EXPLAIN](../../40-explain-cmds/explain.md) 命令分析该查询。

## 示例

此示例为查询 “SELECT MIN(a), MAX(c) FROM agg” 创建一个名为 _my_agg_index_ 的聚合索引：

```sql
-- 准备数据
CREATE TABLE agg(a int, b int, c int);
INSERT INTO agg VALUES (1,1,4), (1,2,1), (1,2,4), (2,2,5);

-- 创建聚合索引
CREATE AGGREGATING INDEX my_agg_index AS SELECT MIN(a), MAX(c) FROM agg;
```
