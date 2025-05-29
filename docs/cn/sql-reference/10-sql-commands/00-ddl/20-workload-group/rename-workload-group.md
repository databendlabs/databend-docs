---
title: RENAME WORKLOAD GROUP
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于: v1.2.743"/>

将现有的工作负载组重命名为新名称。

## 语法

```sql
RENAME WORKLOAD GROUP <current_name> TO <new_name>
```

## 示例

此示例将 `test_workload_group_1` 重命名为 `test_workload_group`:

```sql
RENAME WAREHOUSE test_workload_group_1 TO test_workload_group;
```