---
title: DROP WORKLOAD GROUP
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.743"/>

移除指定的工作负载组（Workload Group）。

## 语法

```sql
DROP WORKLOAD GROUP [IF EXISTS] <workload_group_name>
```

## 示例

此示例移除了工作负载组 `test_workload_group`：

```sql
DROP WORKLOAD GROUP test_workload_group;
```