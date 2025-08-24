---
title: CREATE AGGREGATING INDEX
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.339"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='AGGREGATING INDEX'/>

在 Databend 中创建一个新的聚合索引（Aggregating Index）。

## 语法

```sql
CREATE [ OR REPLACE ] [ ASYNC ] AGGREGATING INDEX <index_name> AS SELECT ...
```

- `ASYNC` 选项：添加 ASYNC 是可选的。它允许异步创建索引，即索引不会立即构建。要稍后构建，请使用 [REFRESH AGGREGATING INDEX](refresh-aggregating-index.md) 命令。

- 创建聚合索引（Aggregating Index）时，请将其使用限制在标准的[聚合函数](../../../20-sql-functions/07-aggregate-functions/index.md)（例如 AVG、SUM、MIN、MAX、COUNT 和 GROUP BY）内，同时请注意，不支持 GROUPING SETS、[窗口函数](../../../20-sql-functions/08-window-functions/index.md)、[LIMIT](../../20-query-syntax/01-query-select.md#limit-clause) 和 [ORDER BY](../../20-query-syntax/01-query-select.md#order-by-clause)，否则将收到错误提示：`Currently create aggregating index just support simple query, like: SELECT ... FROM ... WHERE ... GROUP BY ...`。

- 创建聚合索引（Aggregating Index）时定义的查询（Query）筛选范围应与实际查询（Query）的范围匹配或包含实际查询（Query）的范围。

- 要确认聚合索引（Aggregating Index）是否对某个查询（Query）生效，请使用 [EXPLAIN](../../40-explain-cmds/explain.md) 命令来分析该查询（Query）。

## 示例

此示例为查询（Query） “SELECT MIN(a), MAX(c) FROM agg” 创建一个名为 *my_agg_index* 的聚合索引（Aggregating Index）：

```sql
-- 准备数据
CREATE TABLE agg(a int, b int, c int);
INSERT INTO agg VALUES (1,1,4), (1,2,1), (1,2,4), (2,2,5);

-- 创建一个聚合索引
CREATE AGGREGATING INDEX my_agg_index AS SELECT MIN(a), MAX(c) FROM agg;
```