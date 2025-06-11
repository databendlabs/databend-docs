---
title: CREATE TASK
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.738"/>

CREATE TASK 语句用于定义新任务，该任务可按计划或基于 DAG（有向无环图）任务图执行指定 SQL 语句。

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

| 参数                                         | 描述                                                                                                                                                                  |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IF NOT EXISTS                                | 可选。如果指定，仅当同名任务不存在时才创建任务                                                                                                                       |
| name                                         | 任务名称（必填）                                                                                                                                                     |
| WAREHOUSE                                    | 必需。指定任务使用的虚拟计算集群（Warehouse）                                                                                                                        |
| SCHEDULE                                     | 必需。定义任务运行计划，可按分钟/秒指定或使用 CRON 表达式及时区                                                                                                      |
| SUSPEND_TASK_AFTER_NUM_FAILURES              | 可选。连续失败指定次数后自动挂起任务                                                                                                                                 |
| AFTER                                        | 列出当前任务启动前必须完成的任务                                                                                                                                     |
| WHEN boolean_expr                            | 任务运行必须满足的条件                                                                                                                                               |
| [ERROR_INTEGRATION](../16-notification/index.md) | 可选。用于任务错误通知的通知集成名称，应用特定[任务错误负载](./10-task-error-integration-payload.md)                                                                 |
| COMMENT                                      | 可选。任务注释或描述的字符串字面量                                                                                                                                   |
| session_parameter                            | 可选。指定任务运行时使用的会话参数（必须位于所有其他参数之后）                                                                                                       |
| sql                                          | 任务执行的 SQL 语句（单语句或脚本，必填）                                                                                                                            |

### 使用说明

- 独立任务或 DAG（有向无环图）根任务必须定义计划，否则只能通过 EXECUTE TASK 手动执行
- DAG 子任务不可指定计划
- 创建任务后需执行 ALTER TASK … RESUME 才能按定义参数运行
- WHEN 条件仅支持 `<boolean_expression>` 子集：
  - 支持在 SQL 表达式中使用 [STREAM_STATUS](../../../20-sql-functions/17-table-functions/stream-status.md) 函数评估流是否含变更数据
  - 支持布尔运算符（AND/OR/NOT 等）
  - 支持数值/字符串/布尔类型转换
  - 支持比较运算符（等于/不等于/大于/小于等）
 
   :::note
   警告：任务中使用 STREAM_STATUS 时，引用流必须包含数据库名（如 `STREAM_STATUS('mydb.stream_name')`）
   :::

- 多个任务消费同一表流时会获取不同增量数据。当任务通过 DML 消费流数据时，流偏移量会推进，后续任务无法再消费相同数据。建议单任务消费单流，可为同表创建多流供不同任务使用
- 任务执行不重试，每次串行执行。脚本 SQL 按顺序逐一执行，无并行处理，确保任务执行顺序和依赖关系
- 基于间隔的任务严格遵循固定间隔：若当前任务超时，下一任务立即执行；若提前完成，则等待下一间隔触发。例如 1 秒间隔任务：执行 1.5 秒则下一任务立即启动；执行 0.5 秒则等待至下一秒触发
- 会话参数可在创建时指定，也可通过 ALTER TASK 修改：
  ```sql
  ALTER TASK simple_task SET 
      enable_query_result_cache = 1, 
      query_result_cache_min_execute_secs = 5;
  ```

### Cron 表达式重要说明

- `SCHEDULE` 的 cron 表达式必须包含 **6 个字段**：
  1. **秒** (0-59)
  2. **分钟** (0-59)
  3. **小时** (0-23)
  4. **日** (1-31)
  5. **月** (1-12 或 JAN-DEC)
  6. **星期** (0-6，0=周日 或 SUN-SAT)

 #### Cron 表达式示例：

- **太平洋时间每天 9:00:00：**
  - `USING CRON '0 0 9 * * *' 'America/Los_Angeles'`

- **每分钟：**
  - `USING CRON '0 * * * * *' 'UTC'`
  - 每分钟开始时执行

- **每小时第 15 分钟：**
  - `USING CRON '0 15 * * * *' 'UTC'`
  - 每小时过 15 分钟时执行

- **每周一 12:00:00：**
  - `USING CRON '0 0 12 * * 1' 'UTC'`
  - 每周一中午执行

- **每月首日午夜：**
  - `USING CRON '0 0 0 1 * *' 'UTC'`
  - 每月第一天午夜执行

- **工作日 8:30:00：**
  - `USING CRON '0 30 8 * * 1-5' 'UTC'`
  - 周一至周五 8:30 执行

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

此示例创建任务 `my_daily_task`，使用 **compute_wh** 计算集群（Warehouse）将 source_table 数据插入 summary_table。通过 **CRON 表达式**设定**每天太平洋时间 9:00** 执行。

### 自动挂起

```sql
CREATE TASK IF NOT EXISTS mytask
 WAREHOUSE = 'system'
 SCHEDULE = 2 MINUTE
 SUSPEND_TASK_AFTER_NUM_FAILURES = 3
AS
INSERT INTO compaction_test.test VALUES((1));
```

此示例创建任务 `mytask`（不存在时），分配至 **system** 计算集群（Warehouse），**每 2 分钟**运行。若**连续失败 3 次**则**自动挂起**，向 compaction_test.test 表插入数据。

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

此示例创建**秒级调度**任务 `daily_sales_summary`，**每 30 秒**运行。使用 **analytics** 计算集群（Warehouse）聚合 sales_data 表数据生成每日销售摘要。

### 任务依赖

```sql
CREATE TASK IF NOT EXISTS process_orders
 WAREHOUSE = 'etl'
 AFTER task1, task2
ASINSERT INTO data_warehouse.orders
SELECT * FROM staging.orders;
```

此示例创建任务 `process_orders`，在 **task1** 和 **task2** **成功完成后**运行。通过 **etl** 计算集群（Warehouse）将暂存区数据迁移至数据仓库，建立 **DAG（有向无环图）依赖关系**。

### 条件执行

```sql
CREATE TASK IF NOT EXISTS hourly_data_cleanup
 WAREHOUSE = 'maintenance'
 SCHEDULE = '0 0 * * * *'
 WHEN STREAM_STATUS('db1.change_stream') = TRUE
AS
DELETE FROM archived_data
WHERE archived_date < DATEADD(HOUR, -24, CURRENT_TIMESTAMP());
```

此示例创建任务 `hourly_data_cleanup`，使用 **maintenance** 计算集群（Warehouse）**每小时**清理 archived_data 表中 24 小时前数据。仅当 **STREAM_STATUS** 检测到 `db1.change_stream` 含变更数据时执行。

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

此示例创建任务 `mytask`，使用 **mywh** 计算集群（Warehouse）**每 30 秒**执行含 INSERT/DELETE 的 **BEGIN 块**。失败时触发 **myerror** **错误集成**。

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

此示例创建任务 `cache_enabled_task`，使用 **analytics** 计算集群（Warehouse）**每 5 分钟**生成销售汇总。通过**会话参数** **`enable_query_result_cache = 1`** 和 **`query_result_cache_min_execute_secs = 5`** 为执行超 5 秒的查询启用结果缓存，**提升重复执行性能**。