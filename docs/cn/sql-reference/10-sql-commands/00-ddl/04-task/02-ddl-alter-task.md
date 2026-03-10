---
title: ALTER TASK
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.371"/>

ALTER TASK 语句用于修改已存在的 task。

**NOTICE:** 此功能仅在 Databend Cloud 中开箱即用。

## 语法

```sql
--- 暂停或恢复 task
ALTER TASK [ IF EXISTS ] <name> RESUME | SUSPEND

--- 更改 task 设置
ALTER TASK [ IF EXISTS ] <name> SET
  [ WAREHOUSE = <string> ]
  [ SCHEDULE = { <number> MINUTE | <number> SECOND | USING CRON <expr> <time_zone> } ]
  [ SUSPEND_TASK_AFTER_NUM_FAILURES = <num ]
  [ ERROR_INTEGRATION = <string> ]
   [ <session_parameter> = <value> [ , <session_parameter> = <value> ... ] ]
  [ COMMENT = <string> ]

--- 更改 task SQL
ALTER TASK [ IF EXISTS ] <name> MODIFY AS <sql>

--- 修改 DAG 的 when condition 和 after condition
ALTER TASK [ IF EXISTS ] <name> REMOVE AFTER <string> [ , <string> , ... ] | ADD AFTER <string> [ , <string> , ... ]
--- 允许更改 task 执行的 condition
ALTER TASK [ IF EXISTS ] <name> MODIFY WHEN <boolean_expr>
```

| 参数              | 描述                                                                                    |
| ----------------- | --------------------------------------------------------------------------------------- |
| IF EXISTS         | 可选。如果指定，则仅当已存在同名的 task 时，才会更改该 task。                           |
| name              | task 的名称。这是一个必填字段。                                                         |
| RESUME \| SUSPEND | 恢复或暂停 task。                                                                       |
| SET               | 更改 task 设置。详细的参数描述可以在 [Create Task](01-ddl-create_task.md) 中找到。      |
| MODIFY AS         | 更改 task SQL。                                                                         |
| REMOVE AFTER      | 从 task dag 中删除前置 task，如果未留下前置 task，则 task 将成为独立的 task 或根 task。 |
| ADD AFTER         | 将前置 task 添加到 task dag。                                                           |
| MODIFY WHEN       | 更改 task 执行的条件。                                                                  |

## 示例

```sql
ALTER TASK IF EXISTS mytask SUSPEND;
```

此命令会暂停名为 mytask 的 task（如果存在）。

```sql
ALTER TASK IF EXISTS mytask SET
  WAREHOUSE = 'new_warehouse'
  SCHEDULE = USING CRON '0 12 * * * *' 'UTC';
```

此示例更改 mytask task，将其计算集群更改为 new_warehouse，并将其计划更新为每天 UTC 时间中午运行。

```sql
ALTER TASK IF EXISTS mytask MODIFY
AS
INSERT INTO new_table SELECT * FROM source_table;
```

在此，mytask 执行的 SQL 语句已更改为将数据从 source_table 插入到 new_table 中。

```sql
ALTER TASK mytaskchild MODIFY WHEN STREAM_STATUS('stream3') = False;
```

在此示例中，我们正在修改 mytaskchild task 以更改其 WHEN 条件。现在，仅当 'stream3' 的 STREAM_STATUS 函数评估为 False 时，该 task 才会运行。这意味着当 'stream3' 不包含更改数据时，该 task 将执行。

```sql
ALTER TASK MyTask1 ADD AFTER 'task2', 'task3';
```

在此示例中，我们正在向 MyTask1 task 添加依赖项。现在，它将在 'task2' 和 'task3' 成功完成后运行。这会在 task 的有向无环图 (DAG) 中创建依赖关系。

```sql
ALTER TASK MyTask1 REMOVE AFTER 'task2';
```

在此，我们正在删除 MyTask1 task 的特定依赖项。它将不再在 'task2' 之后运行。如果要修改 task 在 task DAG 中的依赖项，这将非常有用。
