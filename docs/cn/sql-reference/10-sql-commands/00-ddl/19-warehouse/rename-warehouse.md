---
title: RENAME WAREHOUSE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.687"/>

将现有的计算集群重命名为新名称。

注意：部分会话可能仍会使用旧名称。重命名后建议重新连接，或执行 `USE WAREHOUSE <new_name>` 切换到新名称。

## 语法

```sql
RENAME WAREHOUSE <current_name> TO <new_name>
```

## 示例

此示例将 `test_warehouse_1` 重命名为 `test_warehouse`：

```sql
RENAME WAREHOUSE test_warehouse_1 TO test_warehouse;
```
