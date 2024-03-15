---
title: 刷新聚合索引
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.151"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='聚合索引'/>

## 语法

```sql
REFRESH AGGREGATING INDEX <index_name> [ LIMIT <limit> ]
```

"LIMIT" 参数允许您控制每次刷新操作可以更新的最大块数。强烈建议使用此参数并设置一个明确的限制以优化内存使用。请注意，设置限制可能会导致部分数据更新。例如，如果您有100个块但设置了10的限制，单次刷新可能不会更新最新的数据，可能会留下一些未刷新的块。您可能需要执行多次刷新操作以确保完全更新。

## 何时使用 REFRESH AGGREGATING INDEX

- **当自动更新失败时：**在默认的自动更新（`SYNC` 模式）无法正常工作的情况下，使用 `REFRESH AGGREGATING INDEX` 来包含索引中遗漏的数据。
- **对于 ASYNC 索引：**如果聚合索引是用 `ASYNC` 选项创建的，它不会自动更新。您需要手动使用 `REFRESH AGGREGATING INDEX` 来刷新它。

## 示例

此示例创建并刷新一个名为 *my_agg_index* 的聚合索引：

```sql
-- 准备数据
CREATE TABLE agg(a int, b int, c int);
INSERT INTO agg VALUES (1,1,4), (1,2,1), (1,2,4);

-- 创建聚合索引
CREATE AGGREGATING INDEX my_agg_index AS SELECT MIN(a), MAX(c) FROM agg;

-- 插入新数据
INSERT INTO agg VALUES (2,2,5);

-- 刷新聚合索引
REFRESH AGGREGATING INDEX my_agg_index;
```