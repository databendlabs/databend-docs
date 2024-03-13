---
title: 删除任务
sidebar_position: 3
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.371"/>

`DROP TASK` 语句用于删除已存在的任务。

**注意：**此功能仅在 Databend Cloud 中即插即用。

## 语法

```sql
DROP TASK [ IF EXISTS ] <name>
```

| 参数                             | 描述                                                                                       |
|----------------------------------|---------------------------------------------------------------------------------------------|
| IF EXISTS                        | 可选。如果指定，只有在同名任务已存在的情况下才会删除该任务。                                    |
| name                             | 任务的名称。这是一个必填字段。                                                                 |

## 使用说明：

- 如果在一个DAG中删除了一个前置任务，则所有将该任务作为前置的子任务都会变成独立任务或根任务，这取决于是否有其他任务将这些前子任务作为它们的前置。这些前子任务默认为暂停状态，必须手动恢复。
- 删除任务前，根任务必须先暂停

## 使用示例

```sql
DROP TASK IF EXISTS mytask;
```

此命令将删除名为 mytask 的任务（如果存在）。