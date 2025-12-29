---
title: SHOW WAREHOUSES
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.687"/>

列出当前租户下的所有计算集群。

结果包含 `name`、`state`、`size`、`version`、`auto_suspend`、`cache_size`、`spill_size`、`created_on` 等列。

## 语法

```sql
SHOW WAREHOUSES
```

## 示例

```sql
SHOW WAREHOUSES;
```
