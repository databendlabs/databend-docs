---
title: ALTER TASK
sidebar_position: 2
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.371"/>

ALTER TASK 语句用于修改现有任务。

**注意：** 此功能仅在 Databend Cloud 中开箱即用。

## 语法

```sql
--- 暂停或恢复任务
ALTER TASK [ IF EXISTS ] <name> RESUME | SUSPEND

--- 更改任务设置
ALTER TASK [ IF EXISTS ] <name> SET
  [ WAREHOUSE = <string> ]
  [ SCHEDULE = { <number> MINUTE | <number> SECOND | USING CRON <expr> <time_zone> } ]
  [ SUSPEND_TASK_AFTER_NUM_FAILURES = <num ]
  [ ERROR_INTEGRATION = <string> ]
   [ <session_parameter> = <value> [ , <session_parameter> = <value> ... ] ]
  [ COMMENT = <string> ]

--- 更改任务 SQL
ALTER TASK [ IF EXISTS ] <name> MODIFY AS <sql>

--- 修改 DAG 中的 when 条件和 after 条件
ALTER TASK [ IF EXISTS ] <name> REMOVE AFTER <string> [ , <string> , ... ] | ADD AFTER <string> [ , <string> , ... ]
--- 允许更改任务执行条件
ALTER TASK [ IF EXISTS ] <name> MODIFY WHEN <boolean_expr>
```

| 参数                        | 描述                                                                                        |
|----------------------------------|------------------------------------------------------------------------------------------------------|
| IF EXISTS                        | 可选。如果指定，仅当存在同名任务时才会修改任务。 |
| name                             | 任务的名称。这是一个必填字段。                                                       |
| RESUME \| SUSPEND                | 恢复或暂停任务。                                                                          |
| SET                              | 更改任务设置。详细参数描述请参见 [创建任务](01-ddl-create_task.md)。                                                                               |
| MODIFY AS                        | 更改任务 SQL。                                                                                     |
| REMOVE AFTER | 从任务 DAG 中移除前置任务，如果没有任何前置任务，任务将变为独立任务或根任务。 |
| ADD AFTER | 向任务 DAG 中添加前置任务。 |
| MODIFY WHEN | 更改任务执行条件。 |

## 示例

```sql
ALTER TASK IF EXISTS mytask SUSPEND;
```
此命令暂停名为 mytask 的任务（如果存在）。

```sql
ALTER TASK IF EXISTS mytask SET
  WAREHOUSE = 'new_warehouse'
  SCHEDULE = USING CRON '0 12 * * * *' 'UTC';
```
此示例修改了 mytask 任务，将其计算集群更改为 new_warehouse，并将其计划更新为每天中午 UTC 运行。

```sql
ALTER TASK IF EXISTS mytask MODIFY 
AS
INSERT INTO new_table SELECT * FROM source_table;
```
在此示例中，mytask 任务执行的 SQL 语句被更改为将数据从 source_table 插入到 new_table。

```sql
ALTER TASK mytaskchild MODIFY WHEN STREAM_STATUS('stream3') = False;
```
在此示例中，我们修改了 mytaskchild 任务的 WHEN 条件。现在，只有当 STREAM_STATUS 函数对 'stream3' 的评估结果为 False 时，任务才会运行。这意味着任务将在 'stream3' 不包含变更数据时执行。

```sql
ALTER TASK MyTask1 ADD AFTER 'task2', 'task3';
```
在此示例中，我们向 MyTask1 任务添加了依赖项。它现在将在 'task2' 和 'task3' 成功完成后运行。这在任务的有向无环图（DAG）中创建了依赖关系。

```sql
ALTER TASK MyTask1 REMOVE AFTER 'task2';
```
在此示例中，我们移除了 MyTask1 任务的特定依赖项。它将不再在 'task2' 之后运行。这在修改任务 DAG 中的依赖关系时非常有用。