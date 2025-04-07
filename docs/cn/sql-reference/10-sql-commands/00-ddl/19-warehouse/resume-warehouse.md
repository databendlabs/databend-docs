---
title: RESUME WAREHOUSE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.687"/>

重新启动之前暂停的计算集群，使其恢复在线状态并重新分配其机器资源。如果没有可用的节点，RESUME WAREHOUSE 命令将失败。尝试恢复计算集群时，请确保有必要的资源可用于计算集群成功重启。

## 语法

```sql
RESUME WAREHOUSE <warehouse_name>
```

## 示例

此示例恢复 `test_warehouse` 计算集群：

```sql
RESUME WAREHOUSE test_warehouse;
```