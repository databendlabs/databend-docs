---
title: CREATE TASK
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.738"/>

CREATE TASK 语句用于定义一个新的 task，该 task 按照计划的时间表或基于 dag 的 task 图执行指定的 SQL 语句。

**注意：** 此功能仅在 Databend Cloud 中开箱即用。

## 语法

```sql
CREATE [ OR REPLACE ] TASK [ IF NOT EXISTS ] <name>
 WAREHOUSE = <string>
 SCHEDULE = { <num> MINUTE | <num> SECOND | USING CRON <expr> <time_zone> }
 [ AFTER <string> [ , <string> , ... ]]
 [ WHEN <boolean_expr> ]
 [ SUSPEND_TASK_AFTER_NUM_FAILURES = <num> ]
 [ ERROR_INTEGRATION = <string> ]
 [ COMMENT = '<string_literal>' ]
 [ <session_parameter> = <value> [ , <session_parameter> = <value> ... ] ]
AS
<sql>
```

| 参数                                             | 描述                                                                                                                                                                     |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IF NOT EXISTS                                    | 可选。如果指定，则仅当不存在同名的 task 时才会创建 task。                                                                                                                      |
| name                                             | task 的名称。这是一个必填字段。                                                                                                                                            |
| WAREHOUSE                                        | 必需。指定用于 task 的虚拟计算集群。                                                                                                                                        |
| SCHEDULE                                         | 必需。定义 task 运行的时间表。可以以分钟为单位指定，也可以使用 CRON 表达式以及时区指定。                                                                                              |
| SUSPEND_TASK_AFTER_NUM_FAILURES                  | 可选。task 在自动挂起之前连续失败的次数。                                                                                                                                    |
| AFTER                                            | 列出必须在此 task 启动之前完成的 task。                                                                                                                                     |
| WHEN boolean_expr                                | task 运行必须为 true 的条件。                                                                                                                                               |
| [ERROR_INTEGRATION](../16-notification/index.md) | 可选。用于 task 错误通知的通知集成的名称，并应用特定的 [task 错误负载 ](./10-task-error-integration-payload.md)。                                                               |
| COMMENT                                          | 可选。一个字符串文字，用作 task 的注释或描述。                                                                                                                               |
| session_parameter                                | 可选。指定在 task 运行期间用于 task 的会话参数。                                                                                                                             |
| sql                                              | task 将执行的 SQL 语句，它可以是单个语句或脚本。这是一个必填字段。                                                                                                                 |

### 使用说明

- 必须为独立 task 或 task DAG 中的根 task 定义时间表；否则，task 仅在手动使用 EXECUTE TASK 执行时运行。
- 无法为 DAG 中的子 task 指定时间表。
- 创建 task 后，必须先执行 ALTER TASK … RESUME，然后 task 才能根据 task 定义中指定的参数运行。
- When Condition 仅支持 `<boolean_expression>` 的子集
  task WHEN 子句中支持以下内容：

  - [STREAM_STATUS](../../../20-sql-functions/17-table-functions/stream-status.md) 支持在 SQL 表达式中进行评估。此函数指示指定的流是否包含更改跟踪数据。您可以使用此函数评估指定的流是否包含更改数据，然后再启动当前运行。如果结果为 FALSE，则 task 不运行。
  - 布尔运算符，例如 AND、OR、NOT 等。
  - 数值、字符串和布尔类型之间的转换。
  - 比较运算符，例如等于、不等于、大于、小于等。
 
   :::note
  警告：在 task 中使用 STREAM_STATUS 时，引用流时必须包含数据库名称（例如，`STREAM_STATUS('mydb.stream_name')`）。
   :::

- 多个从单个表流中使用更改数据的 task 检索不同的增量。当 task 使用 DML 语句使用流中的更改数据时，流会前进偏移量。更改数据不再可供下一个 task 使用。目前，我们建议只有一个 task 使用流中的更改数据。可以为同一表创建多个流，并由不同的 task 使用。
- task 不会在每次执行时重试；每次执行都是串行的。每个脚本 SQL 逐个执行，没有并行执行。这确保了 task 执行的顺序和依赖关系得以维护。
- 基于间隔的 task 以严格的方式遵循固定的间隔点。这意味着如果当前 task 执行时间超过间隔单位，则下一个 task 将立即执行。否则，下一个 task 将等待直到下一个间隔单位被触发。例如，如果一个 task 定义为 1 秒的间隔，并且一个 task 执行需要 1.5 秒，则下一个 task 将立即执行。如果一个 task 执行需要 0.5 秒，则下一个 task 将等待直到下一个 1 秒间隔刻度开始。

### 关于 Cron 表达式的重要说明

- `SCHEDULE` 参数中使用的 cron 表达式必须包含**正好 6 个字段**。
- 这些字段表示以下内容：
  1. **秒** (0-59)
  2. **分钟** (0-59)
  3. **小时** (0-23)
  4. **月份中的日期** (1-31)
  5. **月份** (1-12 或 JAN-DEC)
  6. **星期几** (0-6，其中 0 是星期日，或 SUN-SAT)

 #### Cron 表达式示例：

- **太平洋时间每天上午 9:00:00：**
  - `USING CRON '0 0 9 * * *' 'America/Los_Angeles'`

- **每分钟：**
  - `USING CRON '0 * * * * *' 'UTC'`
  - 这会在每分钟的开始时运行 task。

- **每小时的第 15 分钟：**
  - `USING CRON '0 15 * * * *' 'UTC'`
  - 这会在每小时的 15 分钟后运行 task。

- **每个星期一的下午 12:00:00：**
  - `USING CRON '0 0 12 * * 1' 'UTC'`
  - 这会在每个星期一的中午运行 task。

- **每个月的第一天的午夜：**
  - `USING CRON '0 0 0 1 * *' 'UTC'`
  - 这会在每个月的第一天的午夜运行 task。

- **每个工作日的上午 8:30:00：**
  - `USING CRON '0 30 8 * * 1-5' 'UTC'`
  - 这会在每个工作日（星期一至星期五）的上午 8:30 运行 task。

## 使用示例

```sql
CREATE TASK my_daily_task
 WAREHOUSE = 'compute_wh'
 SCHEDULE = USING CRON '0 0 9 * * *' 'America/Los_Angeles'
 COMMENT = 'Daily summary task'
 AS
 INSERT INTO summary_table SELECT * FROM source_table;
```

在此示例中，创建了一个名为 my_daily_task 的 task。它使用 compute_wh 计算集群运行一个 SQL 语句，该语句将数据从 source_table 插入到 summary_table 中。该 task 计划在太平洋时间每天上午 9 点运行。

```sql
CREATE TASK IF NOT EXISTS mytask
 WAREHOUSE = 'system'
 SCHEDULE = 2 MINUTE
 SUSPEND_TASK_AFTER_NUM_FAILURES = 3
AS
INSERT INTO compaction_test.test VALUES((1));
```

此示例创建一个名为 mytask 的 task（如果该 task 尚不存在）。该 task 被分配给 system 计算集群，并计划每 2 分钟运行一次。如果连续失败三次，它将被挂起。该 task 执行一个 INSERT 操作到 compaction_test.test 表中。

```sql
CREATE TASK IF NOT EXISTS daily_sales_summary
 WAREHOUSE = 'analytics'
 SCHEDULE = 30 SECOND
FROM sales_data
GROUP BY sales_date;
```

在此示例中，创建了一个名为 daily_sales_summary 的 task，并具有秒级调度。它计划每 30 秒运行一次。该 task 使用 'analytics' 计算集群，并通过聚合 sales_data 表中的数据来计算每日销售额摘要。

```sql
CREATE TASK IF NOT EXISTS process_orders
 WAREHOUSE = 'etl'
 AFTER task1, task2
ASINSERT INTO data_warehouse.orders
SELECT * FROM staging.orders;
```

在此示例中，创建了一个名为 process_orders 的 task，并将其定义为在 task1 和 task2 成功完成后运行。这对于在有向无环图 (DAG) 中创建依赖关系非常有用。该 task 使用 'etl' 计算集群，并将数据从暂存区域传输到数仓。

```sql
CREATE TASK IF NOT EXISTS hourly_data_cleanup
 WAREHOUSE = 'maintenance'
 SCHEDULE = '0 0 * * * *'
 WHEN STREAM_STATUS('change_stream') = TRUE
AS
DELETE FROM archived_data
WHERE archived_date < DATEADD(HOUR, -24, CURRENT_TIMESTAMP());

```

在此示例中，创建了一个名为 hourly_data_cleanup 的 task。它使用 maintenance 计算集群，并计划每小时运行一次。该 task 从 archived_data 表中删除早于 24 小时的数据。该 task 仅在 change_stream 流包含更改数据时运行。

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

在此示例中，创建了一个名为 mytask 的 task。它使用 mywh 计算集群，并计划每 30 秒运行一次。该 task 执行一个 BEGIN 块，其中包含一个 INSERT 语句和一个 DELETE 语句。该 task 在执行完两个语句后提交事务。当 task 失败时，它将触发名为 myerror 的错误集成。