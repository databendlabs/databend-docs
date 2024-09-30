---
title: DROP AGGREGATING INDEX
sidebar_position: 4
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.151"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='AGGREGATING INDEX'/>

删除现有的聚合索引。请注意，删除聚合索引并不会移除关联的存储块。要同时删除块，请使用 [VACUUM TABLE](../01-table/91-vacuum-table.md) 命令。要禁用聚合索引功能，请将 `enable_aggregating_index_scan` 设置为 0。

## 语法

```sql
DROP AGGREGATING INDEX <index_name>
```

## 示例

此示例删除了名为 *my_agg_index* 的聚合索引：

```sql
DROP AGGREGATING INDEX my_agg_index;
```