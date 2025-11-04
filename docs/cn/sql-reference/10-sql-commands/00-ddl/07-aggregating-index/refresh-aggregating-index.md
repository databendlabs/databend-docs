---
title: REFRESH AGGREGATING INDEX
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.151"/>

## 语法

```sql
REFRESH AGGREGATING INDEX <index_name> [ LIMIT <limit> ]
```

"LIMIT" 参数允许您控制每次刷新操作可以更新的最大块数。 强烈建议使用此参数并定义限制以优化内存使用。 另请注意，设置限制可能会导致部分数据更新。 例如，如果您有 100 个块但设置的限制为 10，则单次刷新可能无法更新最新数据，可能会导致某些块未刷新。 您可能需要执行多次刷新操作以确保完全更新。

## 何时使用 REFRESH AGGREGATING INDEX

- **当自动更新失败时：** 如果默认自动更新（`SYNC` 模式）无法正常工作，请使用 `REFRESH AGGREGATING INDEX` 将任何遗漏的数据包含在索引中。
- **对于 ASYNC 索引：** 如果使用 `ASYNC` 选项创建聚合索引，则它不会自动更新。 您需要使用 `REFRESH AGGREGATING INDEX` 手动刷新它。

## 示例

此示例创建并刷新名为 *my_agg_index* 的聚合索引：

```sql
-- Prepare data
CREATE TABLE agg(a int, b int, c int);
INSERT INTO agg VALUES (1,1,4), (1,2,1), (1,2,4);

-- Create an aggregating index
CREATE AGGREGATING INDEX my_agg_index AS SELECT MIN(a), MAX(c) FROM agg;

-- Insert new data
INSERT INTO agg VALUES (2,2,5);

-- Refresh the aggregating index
REFRESH AGGREGATING INDEX my_agg_index;
```
