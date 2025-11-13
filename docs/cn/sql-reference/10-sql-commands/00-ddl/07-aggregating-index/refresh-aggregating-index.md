---
title: REFRESH AGGREGATING INDEX
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.151"/>

Databend 默认以 `SYNC` 模式自动维护聚合索引。只有当表里已有数据、而聚合索引是后来补建时，才需要运行 `REFRESH AGGREGATING INDEX` 来补齐这些历史行。

## 语法

```sql
REFRESH AGGREGATING INDEX <index_name>
```

## 示例

以下示例演示：表先有数据，再创建聚合索引并通过 `REFRESH` 回填：

```sql
-- 先建表并写入在索引创建前的数据
CREATE TABLE agg(a int, b int, c int);
INSERT INTO agg VALUES (1,1,4), (1,2,1), (1,2,4);

-- 声明聚合索引（现有数据尚未被索引）
CREATE AGGREGATING INDEX my_agg_index AS SELECT MIN(a), MAX(c) FROM agg;

-- 回填历史数据
REFRESH AGGREGATING INDEX my_agg_index;

-- 索引创建后再写入的数据会自动同步
INSERT INTO agg VALUES (2,2,5);
-- SYNC 模式会自动保持索引最新
```
