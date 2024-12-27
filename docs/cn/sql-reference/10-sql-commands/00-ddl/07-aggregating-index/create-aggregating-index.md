---
title: 创建聚合索引
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.339"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='AGGREGATING INDEX'/>

在 Databend 中创建一个新的聚合索引。

## 语法

```sql
CREATE [ OR REPLACE ] [ ASYNC ] AGGREGATING INDEX <index_name> AS SELECT ...
```

- `ASYNC` 选项：添加 ASYNC 是可选的。它允许异步创建索引。这意味着索引不会立即构建。要稍后构建它，请使用 [REFRESH AGGREGATING INDEX](refresh-aggregating-index.md) 命令。

- 在创建聚合索引时，将其使用限制在标准的 [聚合函数](../../../20-sql-functions/07-aggregate-functions/index.md)（例如 AVG、SUM、MIN、MAX、COUNT 和 GROUP BY）中，同时请注意 [GROUPING SETS](/guides/query/groupby/group-by-grouping-sets)、[窗口函数](../../../20-sql-functions/08-window-functions/index.md)、[LIMIT](../../20-query-syntax/01-query-select.md#limit-clause) 和 [ORDER BY](../../20-query-syntax/01-query-select.md#order-by-clause) 是不被接受的，否则你会收到错误：`Currently create aggregating index just support simple query, like: SELECT ... FROM ... WHERE ... GROUP BY ...`。

- 创建聚合索引时定义的查询过滤范围应匹配或包含实际查询的范围。

- 要确认聚合索引是否适用于查询，请使用 [EXPLAIN](../../40-explain-cmds/explain.md) 命令分析查询。

## 示例

此示例为查询 "SELECT MIN(a), MAX(c) FROM agg" 创建了一个名为 *my_agg_index* 的聚合索引：

```sql
-- 准备数据
CREATE TABLE agg(a int, b int, c int);
INSERT INTO agg VALUES (1,1,4), (1,2,1), (1,2,4), (2,2,5);

-- 创建聚合索引
CREATE AGGREGATING INDEX my_agg_index AS SELECT MIN(a), MAX(c) FROM agg;
```