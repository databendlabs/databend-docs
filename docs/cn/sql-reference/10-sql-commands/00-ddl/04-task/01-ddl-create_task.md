---
title: CREATE TASK
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.738"/>

CREATE TASK 语句用于定义一个新任务，该任务可按计划或基于 DAG（有向无环图）的任务图执行指定的 SQL 语句。

**注意：** 此功能仅在 Databend Cloud 中开箱即用。

## 语法

```sql
CREATE [ OR REPLACE ] TASK [ IF NOT EXISTS ] <name>
 WAREHOUSE = <string>
 SCHEDULE = { <num> MINUTE | <num> SECOND | USING CRON <expr> <time_zone> }
 [ AFTER <string>
 [ WHEN <boolean_expr> ]
 [ SUSPEND_TASK_AFTER_NUM_FAILURES = <num> ]
 [ ERROR_INTEGRATION = <string> ]
 [ COMMENT = '<string_literal>' ]
 [ <session_parameter> = <value> [ , <session_parameter> = <value> ... ] ]
AS
{ <sql_statement>
| BEGIN
    <sql_statement>;
    [ <sql_statement>; ... ]
  END;
}
```

若需执行多条 SQL 语句，请将其置于 `BEGIN ... END;` 块中作为脚本，以确保按顺序执行。

| 参数 | 描述 |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IF NOT EXISTS | 可选。若指定，则仅当同名任务不存在时才创建任务。 |
| name | 任务名称。必填。 |
| WAREHOUSE | 必填。指定任务使用的虚拟计算集群（Warehouse）。 |
| SCHEDULE | 必填。定义任务运行计划。可用分钟数或 CRON 表达式加时区表示。 |
| SUSPEND_TASK_AFTER_NUM_FAILURES | 可选。连续失败多少次后任务将自动挂起。 |
| AFTER | 列出在此任务开始前必须完成的任务。 |
| WHEN boolean_expr | 任务运行前必须为真的条件。 |
| [ERROR_INTEGRATION](../16-notification/index.md) | 可选。用于任务错误通知的集成名称，附带特定的[任务错误负载](./10-task-error-integration-payload.md)。 |
| COMMENT | 可选。作为任务注释或描述的字符串字面量。 |
| session_parameter | 可选。指定任务运行时的会话参数。注意：会话参数必须放在 CREATE TASK 语句中所有其他任务参数之后。 |
| sql | 任务将执行的 SQL 语句。可为单条语句，也可为置于 `BEGIN ... END;` 块中的脚本。必填。 |

### 使用须知

- 独立任务或任务 DAG 中的根任务必须定义计划；否则，任务仅在使用 EXECUTE TASK 手动执行时运行。
- DAG 中的子任务不能指定计划。
- 创建任务后，必须执行 ALTER TASK … RESUME，任务才会按定义参数运行。
- WHEN 条件仅支持 `<boolean_expression>` 的子集。
  任务的 WHEN 子句支持以下内容：

  - [STREAM_STATUS](../../../20-sql-functions/17-table-functions/stream-status.md) 可在 SQL 表达式中求值。该函数指示指定流是否包含变更跟踪数据。可在当前运行开始前评估指定流是否包含变更数据。若结果为 FALSE，则任务不运行。
  - 布尔运算符，如 AND、OR、NOT 等。
  - 数值、字符串与布尔类型之间的强制转换。
  - 比较运算符，如等于、不等于、大于、小于等。
 
   :::note
  警告：在任务中使用 STREAM_STATUS 时，引用流必须包含数据库名（例如 `STREAM_STATUS('mydb.stream_name')`）。
   :::

- 多个任务从同一表流消费变更数据时，会获取不同的增量。当某任务使用 DML 语句消费流中的变更数据后，流会推进偏移量，变更数据不再对后续任务可见。当前建议仅让一个任务消费同一流。可为同一表创建多个流，由不同任务分别消费。
- 任务每次执行不会重试；执行串行进行。脚本中的 SQL 按顺序逐条执行，无并行。这确保了任务执行的顺序与依赖关系。
- 基于间隔的任务会严格按固定间隔点触发。若当前任务执行耗时超过间隔单位，则下一次任务立即执行；否则，等待下一间隔单位。例如，任务间隔为 1 秒，若某次执行耗时 1.5 秒，则下一次立即执行；若耗时 0.5 秒，则等待至下一个 1 秒刻度。
- 会话参数既可在创建任务时指定，也可后续使用 ALTER TASK 语句修改。例如：
  ```sql
  ALTER TASK simple_task SET 
      enable_query_result_cache = 1, 
      query_result_cache_min_execute_secs = 5;
  ```

### Cron 表达式重要说明

- `SCHEDULE` 参数中的 cron 表达式必须**恰好包含 6 个字段**。
- 各字段含义如下：
  1. **秒**（0–59）
  2. **分**（0–59）
  3. **时**（0–23）
  4. **日**（1–31）
  5. **月**（1–12 或 JAN–DEC）
  6. **星期**（0–6，0 表示周日，或 SUN–SAT）

 #### Cron 表达式示例：

- **太平洋时间每天上午 9:00:00：**
  - `USING CRON '0 0 9 * * *' 'America/Los_Angeles'`

- **每分钟：**
  - `USING CRON '0 * * * * *' 'UTC'`
  - 在每分钟的第 0 秒运行。

- **每小时的第 15 分钟：**
  - `USING CRON '0 15 * * * *' 'UTC'`
  - 在每小时的 15 分 0 秒运行。

- **每周一中午 12:00:00：**
  - `USING CRON '0 0 12 * * 1' 'UTC'`
  - 在每周一中午运行。

- **每月首日午夜：**
  - `USING CRON '0 0 0 1 * *' 'UTC'`
  - 在每月 1 日 00:00:00 运行。

- **每个工作日 8:30:00 AM：**
  - `USING CRON '0 30 8 * * 1-5' 'UTC'`
  - 在周一至周五的 8:30 AM 运行。

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

本例创建名为 `my_daily_task` 的任务，使用 **compute_wh** 计算集群，将 source_table 的数据插入 summary_table，并按 **CRON 表达式**于**太平洋时间每天上午 9 点**执行。

### 多语句脚本

```sql
CREATE TASK IF NOT EXISTS nightly_refresh
 WAREHOUSE = 'etl'
 SCHEDULE = USING CRON '0 0 2 * * *' 'UTC'
AS
BEGIN
    DELETE FROM staging.events WHERE event_time < DATEADD(DAY, -1, CURRENT_TIMESTAMP());
    INSERT INTO mart.events SELECT * FROM staging.events;
END;
```

本例创建名为 `nightly_refresh` 的任务，脚本通过将多条语句置于 `BEGIN ... END;` 块中，确保每次执行时先删除过期数据，再插入最新数据。

### 动态 SQL（EXECUTE IMMEDIATE）

```sql
CREATE OR REPLACE TASK alb_log_ingestion
  WAREHOUSE = 'default'
  SCHEDULE = USING CRON '0 * * * * *' 'Asia/Shanghai'
AS
EXECUTE IMMEDIATE $$
BEGIN
    LET path := CONCAT('@mylog/', DATE_FORMAT(CURRENT_DATE - INTERVAL 3 DAY, '%m/%d/'));

    LET sql := CONCAT(
        'COPY INTO alb_logs FROM ', path,
        ' PATTERN = ''.*[.]gz'' FILE_FORMAT = (type = NDJSON compression = AUTO) MAX_FILES = 10000'
    );

    EXECUTE IMMEDIATE :sql;
END;
$$;
```

本例创建一个每分钟运行的任务：根据当前日期动态计算 **3 天前**的日志路径（如 `@mylog/12/15/`），拼接出 `COPY INTO` 语句并通过 `EXECUTE IMMEDIATE` 执行，从而按日期分区持续加载数据。

### 自动挂起

```sql
CREATE TASK IF NOT EXISTS mytask
 WAREHOUSE = 'system'
 SCHEDULE = 2 MINUTE
 SUSPEND_TASK_AFTER_NUM_FAILURES = 3
AS
 INSERT INTO compaction_test.test VALUES((1));
```

本例创建名为 `mytask` 的任务（如不存在），分配给 **system** 计算集群，每 **2 分钟**运行一次，**连续失败 3 次后自动挂起**，对 compaction_test.test 表执行 INSERT。

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

本例创建名为 `daily_sales_summary` 的任务，采用**秒级调度**，每 **30 秒**运行一次，使用 **analytics** 计算集群，对 sales_data 表汇总每日销售额。

### 任务依赖

```sql
CREATE TASK IF NOT EXISTS process_orders
 WAREHOUSE = 'etl'
 AFTER task1
AS
 INSERT INTO data_warehouse.orders SELECT * FROM staging.orders;
```

本例创建名为 `process_orders` 的任务，在 **task1** 成功完成后运行，用于在任务 **DAG** 中建立**依赖关系**。任务使用 **etl** 计算集群，将数据从 staging 区传输到数据仓库。

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

本例创建名为 `hourly_data_cleanup` 的任务，使用 **maintenance** 计算集群，**每小时**运行，删除 archived_data 表中超过 24 小时的数据。仅当 **STREAM_STATUS** 函数检测到 `db1.change_stream` 包含变更数据时才运行。

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

本例创建名为 `mytask` 的任务，使用 **mywh** 计算集群，每 **30 秒**运行一次，执行包含 INSERT 与 DELETE 的 **BEGIN 块**，完成后提交事务。任务失败时将触发名为 **myerror** 的**错误集成**。

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

本例创建名为 `cache_enabled_task` 的任务，带启用查询结果缓存的**会话参数**，每 **5 分钟**运行一次，使用 **analytics** 计算集群。会话参数 **`enable_query_result_cache = 1`** 与 **`query_result_cache_min_execute_secs = 5`** 置于所有其他参数之后，为执行时间 ≥5 秒的查询启用缓存，若底层数据未变，可**提升**后续执行的**性能**。

### 查看任务运行历史

使用 `TASK_HISTORY()` 表函数查看任务何时、如何运行：

```sql
SELECT *
FROM TASK_HISTORY(
  TASK_NAME    => 'daily_sales_summary',
  RESULT_LIMIT => 20
)
ORDER BY scheduled_time DESC;
```

更多参数（如按时间范围或 DAG 的根任务 ID 过滤）参见 [TASK HISTORY](../../../20-sql-functions/17-table-functions/task_histroy.md)。
