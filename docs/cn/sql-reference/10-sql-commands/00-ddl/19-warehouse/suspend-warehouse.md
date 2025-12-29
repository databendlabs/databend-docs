---
title: SUSPEND WAREHOUSE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.687"/>

暂停一个计算集群，释放相关的机器资源，但不会删除该计算集群。

## 语法

```sql
SUSPEND WAREHOUSE <warehouse_name>
```

## 示例

此示例暂停 `test_warehouse` 计算集群：

```sql
SUSPEND WAREHOUSE test_warehouse;
```
