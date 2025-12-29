---
title: USE WAREHOUSE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.687"/>

设置用于执行查询的活动计算集群。

## 语法

```sql
USE WAREHOUSE '<warehouse_name>'
```

建议统一使用单引号包裹 `<warehouse_name>`。

## 示例

此示例将 `testwarehouse` 设置为当前使用的计算集群：

```sql
USE WAREHOUSE 'testwarehouse';
```
