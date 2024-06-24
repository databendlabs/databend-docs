---
title: 删除任务
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.371"/>

DROP TASK 语句用于删除一个现有的任务。

**注意：**此功能仅在 Databend Cloud 中开箱即用。

## 语法

```sql
DROP TASK [ IF EXISTS ] <name>
```

| 参数      | 描述                                                     |
| --------- | -------------------------------------------------------- |
| IF EXISTS | 可选。如果指定，只有当存在同名任务时，该任务才会被删除。 |
| name      | 任务的名称。这是一个必填字段。                           |

## 使用说明：

- 如果在 DAG 中删除一个前驱任务，那么所有之前将该任务标识为前驱的子任务将变为独立任务或根任务，这取决于是否有其他任务将这些之前的子任务标识为它们的前驱。这些之前的子任务默认会被挂起，并且必须手动恢复。
- 在删除前，根任务必须先被挂起。

## 使用示例

```sql
DROP TASK IF EXISTS mytask;
```

此命令将删除名为 mytask 的任务（如果它存在）。
