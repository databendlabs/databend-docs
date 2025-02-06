---
title: RESUME WAREHOUSE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.687"/>

重新启动先前挂起的集群，使其重新联机并重新分配其机器资源。如果没有可用节点，则 RESUME WAREHOUSE 命令将失败。在尝试恢复集群时，请确保有必要的资源可供集群成功重新启动。

## 语法

```sql
RESUME WAREHOUSE <warehouse_name>
```

## 例子

下面的例子恢复了 `test_warehouse` 集群：

```sql
RESUME WAREHOUSE test_warehouse;
```
