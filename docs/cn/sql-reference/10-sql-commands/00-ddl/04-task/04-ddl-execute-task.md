---
title: EXECUTE TASK
sidebar_position: 4
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.371"/>

EXECUTE TASK 语句用于手动执行现有任务。

**注意：** 此功能仅在 Databend Cloud 中开箱即用。

## 语法

```sql
EXECUTE TASK  <name>
```

| 参数                           | 描述                                                                                           |
|----------------------------------|------------------------------------------------------------------------------------------------------|
| name                             | 任务的名称。这是一个必填字段。                                                                                 |

## 使用说明：
- SQL 命令只能执行独立任务或 DAG 中的根任务。如果输入子任务，该命令将返回用户错误。

## 使用示例

```sql
EXECUTE TASK  mytask;
```

此命令执行名为 mytask 的任务。