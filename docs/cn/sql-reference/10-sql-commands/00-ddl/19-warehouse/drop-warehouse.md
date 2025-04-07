---
title: DROP WAREHOUSE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.687"/>

删除指定的计算集群并释放与其关联的资源。

## 语法

```sql
DROP WAREHOUSE <warehouse_name>
```

## 示例

此示例删除 `test_warehouse` 计算集群：

```sql
DROP WAREHOUSE test_warehouse;
```