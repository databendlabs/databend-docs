---
title: CREATE TASK
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.371"/>

CREATE TASK 语句用于定义一个新任务，该任务将按计划或基于任务图（DAG）执行指定的 SQL 语句。

**注意：** 此功能仅在 Databend Cloud 中开箱即用。

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

| 参数                                        | 描述                                                                                                                                                                  |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IF NOT EXISTS                                    | 可选。如果指定，则仅当不存在同名任务时才会创建任务。                                                                     |
| name                                             | 任务的名称。这是一个必填字段。                                                                                                                             |
| WAREHOUSE                                        | 可选。指定任务使用的虚拟计算集群。                                                                                                               |
| SCHEDULE                                         | 可选。定义任务运行的调度计划。可以以分钟为单位指定，或使用 CRON 表达式以及时区。                                    |
| SUSPEND_TASK_AFTER_NUM_FAILURES                  | 可选。任务在连续失败指定次数后会自动挂起。                                                                           |
| AFTER                                            | 列出在此任务开始之前必须完成的任务。                                                                                                                  |
| WHEN boolean_expr                                | 任务运行必须满足的条件。                                                                                                                           |
| [ERROR_INTEGRATION](../16-notification/index.md) | 可选。用于任务错误通知的通知集成名称，并应用特定的[任务错误负载](./10-task-error-integration-payload.md)。 |
| COMMENT                                          | 可选。作为任务注释或描述的字符串字面量。                                                                                             |
| session_parameter                                | 可选。指定任务运行期间使用的会话参数。                                                                                                  |
| sql                                              | 任务将执行的 SQL 语句，可以是单个语句或脚本。这是一个必填字段。                                                          |

### 使用说明

- 必须为独立任务或任务 DAG 中的根任务定义调度计划；否则，任务仅在手动使用 EXECUTE TASK 执行时运行。
- 不能为 DAG 中的子任务指定调度计划。
- 创建任务后，必须执行 ALTER TASK … RESUME，任务才会根据任务定义中指定的参数运行。
- WHEN 条件仅支持部分 `<boolean_expression>`，任务 WHEN 子句中支持以下内容：

  - [STREAM_STATUS](../../../20-sql-functions/17-table-functions/stream-status.md) 可用于 SQL 表达式中的评估。此函数指示指定的流是否包含变更跟踪数据。您可以在当前运行开始之前使用此函数评估指定的流是否包含变更数据。如果结果为 FALSE，则任务不会运行。
  - 布尔运算符，如 AND、OR、NOT 等。
  - 数值、字符串和布尔类型之间的转换。
  - 比较运算符，如等于、不等于、大于、小于等。

- 从单个表流中消费变更数据的多个任务会检索不同的增量。当任务使用 DML 语句消费流中的变更数据时，流会推进偏移量。变更数据不再可供下一个任务消费。目前，我们建议只有一个任务从流中消费变更数据。可以为同一表创建多个流，并由不同的任务消费。
- 任务不会在每次执行时重试；每次执行都是串行的。每个脚本 SQL 依次执行，没有并行执行。这确保了任务执行的顺序和依赖关系得以维护。
- 基于间隔的任务严格遵循固定的间隔点。这意味着如果当前任务执行时间超过间隔单位，下一个任务将立即执行。否则，下一个任务将等待直到下一个间隔单位触发。例如，如果任务定义为 1 秒间隔，且一次任务执行耗时 1.5 秒，则下一个任务将立即执行。如果一次任务执行耗时 0.5 秒，则下一个任务将等待直到下一个 1 秒间隔开始。

### 关于 Cron 表达式的重要说明

- `SCHEDULE` 参数中使用的 cron 表达式必须**恰好包含 6 个字段**。
- 字段表示以下内容：
  1. **秒** (0-59)
  2. **分钟** (0-59)
  3. **小时** (0-23)
  4. **日期** (1-31)
  5. **月份** (1-12 或 JAN-DEC)
  6. **星期几** (0-6，其中 0 是周日，或 SUN-SAT)

 #### Cron 表达式示例：

- **每天上午 9:00:00 太平洋时间：**
  - `USING CRON '0 0 9 * * *' 'America/Los_Angeles'`

- **每分钟：**
  - `USING CRON '0 * * * * *' 'UTC'`
  - 这将在每分钟开始时运行任务。

- **每小时的第 15 分钟：**
  - `USING CRON '0 15 * * * *' 'UTC'`
  - 这将在每小时的第 15 分钟运行任务。

- **每周一中午 12:00:00：**
  - `USING CRON '0 0 12 * * 1' 'UTC'`
  - 这将在每周一中午运行任务。

- **每月第一天午夜：**
  - `USING CRON '0 0 0 1 * *' 'UTC'`
  - 这将在每月第一天的午夜运行任务。

- **每个工作日早上 8:30:00：**
  - `USING CRON '0 30 8 * * 1-5' 'UTC'`
  - 这将在每个工作日（周一到周五）早上 8:30 运行任务。

## 使用示例

```sql
CREATE TASK my_daily_task
 WAREHOUSE = 'compute_wh'
 SCHEDULE = USING CRON '0 0 9 * * *' 'America/Los_Angeles'
 COMMENT = '每日汇总任务'
 AS
 INSERT INTO summary_table SELECT * FROM source_table;
```

在此示例中，创建了一个名为 my_daily_task 的任务。它使用 compute_wh 计算集群运行一个 SQL 语句，将数据从 source_table 插入到 summary_table 中。任务计划每天上午 9 点太平洋时间运行。

```sql
CREATE TASK IF NOT EXISTS mytask
 WAREHOUSE = 'system'
 SCHEDULE = 2 MINUTE
 SUSPEND_TASK_AFTER_NUM_FAILURES = 3
AS
INSERT INTO compaction_test.test VALUES((1));
```

此示例创建了一个名为 mytask 的任务，如果它尚不存在。任务分配给 system 计算集群，并计划每 2 分钟运行一次。如果连续失败三次，任务将被挂起。任务执行插入操作到 compaction_test.test 表中。

```sql
CREATE TASK IF NOT EXISTS daily_sales_summary
 WAREHOUSE = 'analytics'
 SCHEDULE = 30 SECOND
FROM sales_data
GROUP BY sales_date;
```

在此示例中，创建了一个名为 daily_sales_summary 的任务，并设置了秒级调度。它计划每 30 秒运行一次。任务使用 'analytics' 计算集群，并通过从 sales_data 表中聚合数据来计算每日销售汇总。

```sql
CREATE TASK IF NOT EXISTS process_orders
 WAREHOUSE = 'etl'
 AFTER task1, task2
ASINSERT INTO data_warehouse.orders
SELECT * FROM staging.orders;
```

在此示例中，创建了一个名为 process_orders 的任务，并定义它在 task1 和 task2 成功完成后运行。这对于在任务的有向无环图（DAG）中创建依赖关系非常有用。任务使用 'etl' 计算集群，并将数据从暂存区传输到数仓。

```sql
CREATE TASK IF NOT EXISTS hourly_data_cleanup
 WAREHOUSE = 'maintenance'
 SCHEDULE = '0 0 * * * *'
 WHEN STREAM_STATUS('change_stream') = TRUE
AS
DELETE FROM archived_data
WHERE archived_date < DATEADD(HOUR, -24, CURRENT_TIMESTAMP());

```

在此示例中，创建了一个名为 hourly_data_cleanup 的任务。它使用 maintenance 计算集群，并计划每小时运行一次。任务从 archived_data 表中删除超过 24 小时的数据。任务仅在 change_stream 流包含变更数据时运行。

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

在此示例中，创建了一个名为 mytask 的任务。它使用 mywh 计算集群，并计划每 30 秒运行一次。任务执行一个包含 INSERT 语句和 DELETE 语句的 BEGIN 块。任务在执行完两个语句后提交事务。当任务失败时，它将触发名为 myerror 的错误集成。