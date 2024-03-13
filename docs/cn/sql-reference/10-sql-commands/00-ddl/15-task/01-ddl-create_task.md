---
title: 创建任务
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.371"/>

CREATE TASK 语句用于定义一个新任务，该任务根据计划或基于DAG的任务图执行指定的SQL语句。

**注意：**此功能仅在Databend Cloud中开箱即用。

## 语法

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

| 参数                              | 描述                                                                                        |
|----------------------------------|------------------------------------------------------------------------------------------------------|
| IF NOT EXISTS                    | 可选。如果指定，仅当同名任务不存在时才创建任务。 |
| name                             | 任务的名称。这是一个必填字段。                                                       |
| WAREHOUSE                        | 可选。指定用于任务的虚拟仓库。                                         |
| SCHEDULE                         | 可选。定义任务运行的计划。可以以分钟数指定，或使用CRON表达式及时区。 |
| SUSPEND_TASK_AFTER_NUM_FAILURES | 可选。连续失败后自动暂停任务的次数。      |
| AFTER                            | 列出在此任务开始前必须完成的任务。                                            |
| WHEN boolean_expr                | 任务运行必须为真的条件。                                                     |
| [ERROR_INTEGRATION](../16-notification/index.md)                | 可选。用于任务错误通知的通知集成名称，具体应用[任务错误负载](./10-task-error-integration-payload.md)                                        |
| COMMENT                          | 可选。作为任务注释或描述的字符串字面量。                      |
| session_parameter                | 可选。指定任务运行时使用的会话参数。                                             |
| sql                            | 任务将执行的SQL语句，可以是单个语句或脚本。这是一个必填字段。                               |



### 使用说明:
- 对于独立任务或DAG中的根任务，必须定义一个计划；否则，任务只能通过使用EXECUTE TASK手动执行。
- DAG中的子任务不能指定计划。
- 创建任务后，必须执行ALTER TASK … RESUME，任务才会根据任务定义中指定的参数运行。
- WHEN条件仅支持<boolean_expression>的子集
  在任务WHEN子句中支持以下内容：
  - [STREAM_STATUS](../../../00-sql-reference/20-system-tables/system-stream-status.md)支持在SQL表达式中评估。此函数指示指定的流是否包含变更跟踪数据。您可以使用此函数评估指定的流在开始当前运行之前是否包含变更数据。如果结果为FALSE，则任务不运行。
  - 布尔运算符，如AND、OR、NOT等。
  - 数字、字符串和布尔类型之间的转换。
  - 比较运算符，如等于、不等于、大于、小于等。

- 从单个表流中消费变更数据的多个任务会检索不同的增量。当任务使用DML语句消费流中的变更数据时，流会推进偏移量。变更数据对下一个任务来说不再可用。目前，我们建议只有一个任务从流中消费变更数据。可以为同一表创建多个流，并由不同的任务消费。

## 使用示例

```sql
CREATE TASK my_daily_task
 WAREHOUSE = 'compute_wh'
 SCHEDULE = USING CRON '0 9 * * * *' 'America/Los_Angeles'
 COMMENT = '每日汇总任务'
 AS
 INSERT INTO summary_table SELECT * FROM source_table;
```
在此示例中，创建了一个名为my_daily_task的任务。它使用compute_wh仓库运行一个SQL语句，该语句将数据从source_table插入到summary_table中。任务被安排在太平洋时间每天上午9点运行。

```sql
CREATE TASK IF NOT EXISTS mytask
 WAREHOUSE = 'system'
 SCHEDULE = 2 MINUTE
 SUSPEND_TASK_AFTER_NUM_FAILURES = 3
AS
INSERT INTO compaction_test.test VALUES((1));
```
此示例创建了一个名为mytask的任务，如果它尚不存在。任务被分配给系统仓库，并计划每2分钟运行一次。如果连续失败三次，任务将被暂停。任务执行将数据插入到compaction_test.test表中的操作。

```sql
CREATE TASK IF NOT EXISTS daily_sales_summary
 WAREHOUSE = 'analytics'
 SCHEDULE = 30 SECOND
FROM sales_data
GROUP BY sales_date;
```
在此示例中，创建了一个名为daily_sales_summary的任务，具有秒级调度。它计划每30秒运行一次。任务使用'analytics'仓库，并通过聚合sales_data表中的数据来计算每日销售汇总。

```sql
CREATE TASK IF NOT EXISTS process_orders
 WAREHOUSE = 'etl'
 AFTER task1, task2
ASINSERT INTO data_warehouse.orders
SELECT * FROM staging.orders;
```
在这个例子中，创建了一个名为 process_orders 的任务，并且定义它在 task1 和 task2 成功完成后运行。这对于在任务的有向无环图（DAG）中创建依赖关系很有用。该任务使用 'etl' 仓库，并将数据从暂存区传输到数据仓库。

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
在这个例子中，创建了一个名为 hourly_data_cleanup 的任务。它使用 maintenance 仓库，并且设置为每小时运行一次。该任务删除 archived_data 表中超过 24 小时的数据。只有当 change_stream 流包含变更数据时，任务才会运行。

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

在这个例子中，创建了一个名为 mytask 的任务。它使用 mywh 仓库，并且设置为每 30 秒运行一次。任务执行一个 BEGIN 块，其中包含一个 INSERT 语句和一个 DELETE 语句。在两个语句执行后，任务提交事务。当任务失败时，它将触发名为 myerror 的错误集成。