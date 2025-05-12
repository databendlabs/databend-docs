---
title: DROP TASK
sidebar_position: 3
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.371"/>

DROP TASK 语句用于删除已存在的 task。

**注意：** 此功能仅在 Databend Cloud 中开箱即用。

## 语法

```sql
DROP TASK [ IF EXISTS ] <name>
```

| 参数            | 描述                                                                                       |
|-----------------|--------------------------------------------------------------------------------------------|
| IF EXISTS       | 可选。如果指定，仅当存在同名 task 时，才会删除该 task。                                              |
| name            | task 的名称。这是一个必填字段。                                                                  |

## 使用说明：

- 如果 DAG 中的前置 task 被删除，则所有将此 task 标识为前置 task 的子 task 将变为独立的 task 或根 task，具体取决于是否有其他 task 将这些先前的子 task 标识为其前置 task。 默认情况下，这些先前的子 task 将被暂停，必须手动恢复。
- 根 Task 必须在 DROP 之前暂停

## 使用示例

```sql
DROP TASK IF EXISTS mytask;
```

此命令删除名为 mytask 的 task（如果存在）。