---
title: USE WAREHOUSE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.687"/>

设置用于执行查询的活动计算集群。

## 语法

```sql
USE WAREHOUSE <warehouse_name>
```

## 示例

此示例将 `test_warehouse` 设置为活动计算集群：

```sql
USE WAREHOUSE test_warehouse;
```