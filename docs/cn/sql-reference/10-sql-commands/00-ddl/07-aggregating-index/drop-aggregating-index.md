---
title: DROP AGGREGATING INDEX
sidebar_position: 4
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.151"/>

删除已存在的 aggregating index。请注意，删除 aggregating index 不会移除相关的存储块。要同时删除这些块，请使用 [VACUUM TABLE](../01-table/91-vacuum-table.md) 命令。要禁用 aggregating indexing 功能，请将 `enable_aggregating_index_scan` 设置为 0。

## 语法

```sql
DROP AGGREGATING INDEX <index_name>
```

## 示例

以下示例删除了名为 *my_agg_index* 的 aggregating index：

```sql
DROP AGGREGATING INDEX my_agg_index;
```
