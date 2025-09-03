---
title: CREATE TASK
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.738"/>

CREATE TASK 语句用于定义一个新任务（Task），该任务可按计划或基于有向无环图（DAG）的任务图执行指定的 SQL 语句。

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

| 参数 | 描述 |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IF NOT EXISTS | 可选。若指定，仅当同名任务不存在时才创建任务。 |
| name | 任务名称，必填。 |
| WAREHOUSE | 必填。指定任务使用的虚拟计算集群（Virtual Warehouse）。 |
| SCHEDULE | 必填。定义任务运行计划，可按分钟指定，或使用 CRON 表达式与时区。 |
| SUSPEND_TASK_AFTER_NUM_FAILURES | 可选。连续失败多少次后自动挂起任务。 |
| AFTER | 列出必须完成后才启动此任务的任务。 |
| WHEN boolean_expr | 任务运行前必须为真的条件。 |
| [ERROR_INTEGRATION](../16-notification/index.md) | 可选。用于任务错误通知的通知集成（Notification Integration）名称，并应用特定的[任务错误负载](./10-task-error-integration-payload.md)。 |
| COMMENT | 可选。作为任务注释或描述的字符串字面量。 |
| session_parameter | 可选。指定任务运行时的会话参数。注意，会话参数必须放在 CREATE TASK 语句中所有其他任务参数之后。 |
| sql | 任务将执行的 SQL 语句，可为单条语句或脚本，必填。 |

### 使用须知

- 必须为独立任务或任务 DAG 中的根任务定义计划；否则，任务仅在手动执行 `EXECUTE TASK` 时运行。
- 不能为 DAG 中的子任务指定计划。
- 创建任务后，必须执行 `ALTER TASK … RESUME`，任务才会按定义中的参数运行。
- WHEN 条件仅支持 `<boolean_expression>` 的子集。
  任务 WHEN 子句支持以下内容：

  - SQL 表达式中支持 [STREAM_STATUS](../../../20-sql-functions/17-table-functions/stream-status.md) 函数求值。该函数指示指定 Stream 是否包含变更跟踪数据。可在当前运行开始前评估指定 Stream 是否包含变更数据；若结果为 FALSE，则任务不运行。
  - 布尔运算符，如 AND、OR、NOT 等。
  - 数值、字符串与布尔类型之间的类型转换。
  - 比较运算符，如等于、不等于、大于、小于等。
 
   :::note
  警告：在任务中使用 STREAM_STATUS 时，引用 Stream 必须包含数据库名（例如 `STREAM_STATUS('mydb.stream_name')`）。
   :::

- 多个任务从同一 Table Stream 消费变更数据时，会获取不同的增量。当某任务通过 DML 语句消费 Stream 中的变更数据后，Stream 会推进 Offset，变更数据将不再对后续任务可用。当前建议仅让一个任务消费同一 Stream 的变更数据；可为同一表创建多个 Stream，由不同任务分别消费。
- 任务每次执行不会重试；执行均为串行。脚本中的 SQL 逐一执行，无并行，确保任务执行顺序与依赖关系。
- 基于间隔的任务严格遵循固定间隔点。若当前任务执行时间超过间隔单位，则下一任务立即执行；否则，下一任务等待至下一间隔单位触发。例如，若任务定义 1 秒间隔，而某次执行耗时 1.5 秒，则下一任务立即执行；若耗时 0.5 秒，则下一任务等待至下一 1 秒间隔开始。
- 创建任务时可指定会话参数，也可后续通过 `ALTER TASK` 修改，例如：
  ```sql
  ALTER TASK simple_task SET 
      enable_query_result_cache = 1, 
      query_result_cache_min_execute_secs = 5;
  ```

### Cron 表达式重要说明

- `SCHEDULE` 参数中的 cron 表达式必须**恰好包含 6 个字段**。
- 各字段含义如下：
  1. **秒**（0–59）
  2. **分钟**（0–59）
  3. **小时**（0–23）
  4. **日**（1–31）
  5. **月**（1–12 或 JAN–DEC）
  6. **星期**（0–6，0 表示星期日，或 SUN–SAT）

 #### Cron 表达式示例：

- **太平洋时间每天上午 9:00:00：**
  - `USING CRON '0 0 9 * * *' 'America/Los_Angeles'`

- **每分钟：**
  - `USING CRON '0 * * * * *' 'UTC'`
  - 在每分钟开始时运行任务。

- **每小时第 15 分钟：**
  - `USING CRON '0 15 * * * *' 'UTC'`
  - 在每小时的第 15 分钟运行任务。

- **每周一中午 12:00:00：**
  - `USING CRON '0 0 12 * * 1' 'UTC'`
  - 在每周一中午运行任务。

- **每月第一天午夜：**
  - `USING CRON '0 0 0 1 * *' 'UTC'`
  - 在每月第一天的午夜运行任务。

- **每个工作日上午 8:30:00：**
  - `USING CRON '0 30 8 * * 1-5' 'UTC'`
  - 在周一至周五上午 8:30 运行任务。

## 使用示例

### CRON 计划

```sql
CREATE TASK my_daily_task
 WAREHOUSE = 'compute_wh'
 SCHEDULE = USING CRON '0 0 9 * * *' 'America/Los_Angeles'
 COMMENT = 'Daily summary task'
AS
 INSERT INTO summary_table SELECT * FROM source_table;
```

本例创建名为 `my_daily_task` 的任务（Task）。它使用 **compute_wh** 计算集群（Warehouse）运行 SQL，将数据从 source_table 插入 summary_table，并按 **CRON 表达式** 于**太平洋时间每天上午 9 点**执行。

### 自动挂起

```sql
CREATE TASK IF NOT EXISTS mytask
 WAREHOUSE = 'system'
 SCHEDULE = 2 MINUTE
 SUSPEND_TASK_AFTER_NUM_FAILURES = 3
AS
 INSERT INTO compaction_test.test VALUES((1));
```

本例创建名为 `mytask` 的任务（Task）（若不存在）。该任务分配至 **system** 计算集群（Warehouse），计划**每 2 分钟**运行一次，若**连续失败 3 次**将**自动挂起**，并对 compaction_test.test 表执行 INSERT。

### 秒级调度

```sql
CREATE TASK IF NOT EXISTS daily_sales_summary
 WAREHOUSE = 'analytics'
 SCHEDULE = 30 SECOND
AS
 SELECT sales_date, SUM(amount) AS daily_total
 FROM sales_data
 GROUP BY sales_date;
```

本例创建名为 `daily_sales_summary` 的任务（Task），具备**秒级调度**，计划**每 30 秒**运行一次。它使用 **analytics** 计算集群（Warehouse），聚合 sales_data 表数据计算每日销售汇总。

### 任务依赖

```sql
CREATE TASK IF NOT EXISTS process_orders
 WAREHOUSE = 'etl'
 AFTER task1, task2
AS
 INSERT INTO data_warehouse.orders SELECT * FROM staging.orders;
```

本例创建名为 `process_orders` 的任务（Task），定义为在 **task1** 与 **task2** **成功完成后**运行，用于在任务 **DAG** 中建立**依赖关系**。它使用 **etl** 计算集群（Warehouse），将数据从 Staging Area 传输至 Data Warehouse。

> 提示：使用 AFTER 参数时无需设置 SCHEDULE 参数。

### 条件执行

```sql
CREATE TASK IF NOT EXISTS hourly_data_cleanup
 WAREHOUSE = 'maintenance'
 SCHEDULE = USING CRON '0 0 9 * * *' 'America/Los_Angeles'
 WHEN STREAM_STATUS('db1.change_stream') = TRUE
AS
 DELETE FROM archived_data
 WHERE archived_date < DATEADD(HOUR, -24, CURRENT_TIMESTAMP());
```

本例创建名为 `hourly_data_cleanup` 的任务（Task）。它使用 **maintenance** 计算集群（Warehouse），计划**每小时**运行，删除 archived_data 表中 24 小时前的数据，并仅在 **STREAM_STATUS** 函数确认 `db1.change_stream` 包含变更数据时运行。

### 错误集成

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

本例创建名为 `mytask` 的任务（Task）。它使用 **mywh** 计算集群（Warehouse），计划**每 30 秒**运行一次，执行包含 INSERT 与 DELETE 语句的 **BEGIN 块**，并在两条语句执行后提交事务。任务失败时将触发名为 **myerror** 的**错误集成（Error Integration）**。

### 会话参数

```sql
CREATE TASK IF NOT EXISTS cache_enabled_task
 WAREHOUSE = 'analytics'
 SCHEDULE = 5 MINUTE
 COMMENT = 'Task with query result cache enabled'
 enable_query_result_cache = 1,
 query_result_cache_min_execute_secs = 5
AS
 SELECT SUM(amount) AS total_sales
 FROM sales_data
 WHERE transaction_date >= DATEADD(DAY, -7, CURRENT_DATE())
 GROUP BY product_category;
```

本例创建名为 `cache_enabled_task` 的任务（Task），并启用查询结果缓存的**会话参数（Session Parameter）**。任务计划**每 5 分钟**运行，使用 **analytics** 计算集群（Warehouse）。会话参数（Session Parameter） **`enable_query_result_cache = 1`** 与 **`query_result_cache_min_execute_secs = 5`** 置于**所有其他任务参数之后**，为执行时间 ≥5 秒的查询启用结果缓存。若底层数据未变，可提升相同任务后续执行的性能。