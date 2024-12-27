---
title: DROP TASK
sidebar_position: 3
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.371"/>

DROP TASK 语句用于删除现有的任务。

**注意：** 此功能仅在 Databend Cloud 中开箱即用。

## 语法

```sql
DROP TASK [ IF EXISTS ] <name>
```

| 参数                        | 描述                                                                                        |
|----------------------------------|------------------------------------------------------------------------------------------------------|
| IF EXISTS                        | 可选。如果指定，则仅当存在同名任务时才会删除该任务。 |
| name                             | 任务的名称。这是一个必填字段。                                                       |

## 使用说明：

- 如果 DAG 中的前驱任务被删除，那么所有将该任务作为前驱任务的子任务将变为独立任务或根任务，具体取决于是否有其他任务将这些子任务作为其前驱任务。这些子任务默认会被暂停，必须手动恢复。
- 根任务在删除前必须被暂停。

## 使用示例

```sql
DROP TASK IF EXISTS mytask;
```

此命令将删除名为 mytask 的任务（如果存在）。