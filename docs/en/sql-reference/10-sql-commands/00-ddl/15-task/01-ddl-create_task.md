---
title: CREATE TASK
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.371"/>

The CREATE TASK statement is used to define a new task that executes a specified SQL statement on a scheduled basis or dag based task graph.

**NOTICE:** this functionality works out of the box only in Databend Cloud.

## Syntax

```sql
CREATE TASK [ IF NOT EXISTS ] <name>
 [ WAREHOUSE = <string ]
 [ SCHEDULE = { <num> MINUTE | <num> SECOND | USING CRON <expr> <time_zone> } ]
 [ AFTER <string> [ , <string> , ... ]]
 [ WHEN <boolean_expr> ]
 [ SUSPEND_TASK_AFTER_NUM_FAILURES = <num> ]
 [ ERROR_INTEGRATION = <string> ]
 [ COMMENT = '<string_literal>' ]
 [ <session_parameter> = <value> [ , <session_parameter> = <value> ... ] ]
AS
<sql>
```

| Parameter                        | Description                                                                                        |
|----------------------------------|------------------------------------------------------------------------------------------------------|
| IF NOT EXISTS                    | Optional. If specified, the task will only be created if a task of the same name does not already exist. |
| name                             | The name of the task. This is a mandatory field.                                                       |
| WAREHOUSE                        | Optional. Specifies the virtual warehouse to use for the task.                                         |
| SCHEDULE                         | Optional. Defines the schedule on which the task will run. Can be specified in minutes or using a CRON expression along with a time zone. |
| SUSPEND_TASK_AFTER_NUM_FAILURES | Optional. The number of consecutive failures after which the task will be automatically suspended.      |
| AFTER                            | Lists tasks that must be completed before this task starts.                                            |
| WHEN boolean_expr                | A condition that must be true for the task to run.                                                     |
| [ERROR_INTEGRATION](../16-notification/index.md)                | Optional. The name of the notification integration to use for the task error notification with specific [task error payload ](./10-task-error-integration-payload.md)applied                                        |
| COMMENT                          | Optional. A string literal that serves as a comment or description for the task.                      |
| session_parameter                | Optional. Specifies session parameters to use for the task during task run.                                             |
| sql                            | The SQL statement that the task will execute, it could be a single statement or a script This is a mandatory field.                               |



### Usage Notes:
- A schedule must be defined for a standalone task or the root task in a DAG of tasks; otherwise, the task only runs if manually executed using EXECUTE TASK.
- A schedule cannot be specified for child tasks in a DAG.
- After creating a task, you must execute ALTER TASK … RESUME before the task will run based on the parameters specified in the task definition. 
- When Condition only support a subset of <boolean_expression>
 The following are supported in a task WHEN clause:
  - [STREAM_STATUS](../../../00-sql-reference/20-system-tables/system-stream-status.md) is supported for evaluation in the SQL expression. This function indicates whether a specified stream contains change tracking data. You can use this function to evaluate whether the specified stream contains change data before starting the current run. If the result is FALSE, then the task does not run.
  - Boolean operators such as AND, OR, NOT, and others.
  - Casts between numeric, string and boolean types.
  - Comparison operators such as equal, not equal, greater than, less than, and others.

- Multiple tasks that consume change data from a single table stream retrieve different deltas. When a task consumes the change data in a stream using a DML statement, the stream advances the offset. The change data is no longer available for the next task to consume. Currently, we recommend that only a single task consumes the change data from a stream. Multiple streams can be created for the same table and consumed by different tasks.

## Usage Examples

```sql
CREATE TASK my_daily_task
 WAREHOUSE = 'compute_wh'
 SCHEDULE = USING CRON '0 9 * * * *' 'America/Los_Angeles'
 COMMENT = 'Daily summary task'
 AS
 INSERT INTO summary_table SELECT * FROM source_table;
```
In this example, a task named my_daily_task is created. It uses the compute_wh warehouse to run a SQL statement that inserts data into summary_table from source_table. The task is scheduled to run daily at 9 AM Pacific Time.

```sql
CREATE TASK IF NOT EXISTS mytask
 WAREHOUSE = 'system'
 SCHEDULE = 2 MINUTE
 SUSPEND_TASK_AFTER_NUM_FAILURES = 3
AS
INSERT INTO compaction_test.test VALUES((1));
```
This example creates a task named mytask, if it doesn't already exist. The task is assigned to the system warehouse and is scheduled to run every 2 minutes. It will be suspended if it fails three times consecutively. The task performs an INSERT operation into the compaction_test.test table.

```sql
CREATE TASK IF NOT EXISTS daily_sales_summary
 WAREHOUSE = 'analytics'
 SCHEDULE = 30 SECOND
FROM sales_data
GROUP BY sales_date;
```
In this example, a task named daily_sales_summary is created with a second-level scheduling. It is scheduled to run  every 30 SECOND. The task uses the 'analytics' warehouse and calculates the daily sales summary by aggregating data from the sales_data table.


```sql
CREATE TASK IF NOT EXISTS process_orders
 WAREHOUSE = 'etl'
 AFTER task1, task2
ASINSERT INTO data_warehouse.orders
SELECT * FROM staging.orders;
```
In this example, a task named process_orders is created, and it is defined to run after the successful completion of task1 and task2. This is useful for creating dependencies in a Directed Acyclic Graph (DAG) of tasks. The task uses the 'etl' warehouse and transfers data from the staging area to the data warehouse.

```sql
CREATE TASK IF NOT EXISTS hourly_data_cleanup
 WAREHOUSE = 'maintenance'
 SCHEDULE = '0 * * * *'
 WHEN STREAM_STATUS('change_stream') = TRUE
AS
DELETE FROM archived_data
WHERE archived_date < DATEADD(HOUR, -24, CURRENT_TIMESTAMP());
CREATE TASK mytask
 WAREHOUSE = 'mywh'
 SCHEDULE = 30 SECOND
AS
 INSERT INTO mytable(ts)
 VALUES(CURRENT_TIMESTAMP);

 ```
In this example, a task named hourly_data_cleanup is created. It uses the maintenance warehouse and is scheduled to run every hour. The task deletes data from the archived_data table that is older than 24 hours. The task only runs if the change_stream stream contains change data. 

```sql
CREATE TASK IF NOT EXISTS mytask
 WAREHOUSE = 'mywh'
 SCHEDULE = 30 SECOND
 ERROR_INTEGRATION = 'myerror'
AS
BEGIN
    BEGIN;
    INSERT INTO mytable(ts) VALUES(CURRENT_TIMESTAMP);
    DELETE FROM mytable WHERE ts < DATEADD(MINUTE, -5, CURRENT_TIMESTAMP());
    COMMIT;
END;
```

In this example, a task named mytask is created. It uses the mywh warehouse and is scheduled to run every 30 seconds. The task executes a BEGIN block that contains an INSERT statement and a DELETE statement. The task commits the transaction after both statements are executed. when the task fails, it will trigger the error integration named myerror.
