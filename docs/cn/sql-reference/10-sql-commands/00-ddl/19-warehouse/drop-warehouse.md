---
title: DROP WAREHOUSE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.687"/>

删除指定的集群并释放与之关联的资源。

## 语法

```sql
DROP WAREHOUSE <warehouse_name>
```

## 例子

下面的例子删除了 `test_warehouse` 集群：

```sql
DROP WAREHOUSE test_warehouse;
```
