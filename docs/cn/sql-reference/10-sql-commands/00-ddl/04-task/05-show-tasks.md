---
title: SHOW TASKS
sidebar_position: 5
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="版本引入或更新: v1.2.900"/>

列出当前角色可见的任务。

**注意：** 该命令默认仅在 Databend Cloud 可用；自建部署需配置 Cloud Control 才能查询任务。

## 语法

```sql
SHOW TASKS [LIKE '<pattern>' | WHERE <expr>]
```

| 参数 | 说明 |
|-----------|-------------|
| LIKE      | 使用区分大小写的模式匹配（含 `%` 通配符）过滤任务名。 |
| WHERE     | 对输出列使用表达式过滤结果。 |

### 输出列

`SHOW TASKS` 返回以下列：

- `created_on`: 任务创建时间戳。
- `name`: 任务名称。
- `id`: 内部任务 ID。
- `owner`: 拥有该任务的角色。
- `comment`: 可选备注。
- `warehouse`: 关联的计算集群。
- `schedule`: 间隔或 CRON 调度（如有）。
- `state`: 当前状态（`Started` 或 `Suspended`）。
- `definition`: 任务执行的 SQL。
- `condition_text`: 任务的 WHEN 条件。
- `after`: DAG 中上游任务的逗号分隔列表。
- `suspend_task_after_num_failures`: 连续失败多少次后自动挂起。
- `error_integration`: 失败通知使用的集成名称。
- `next_schedule_time`: 下一次计划运行的时间戳。
- `last_committed_on`: 任务定义上次更新的时间戳。
- `last_suspended_on`: 上次挂起时间（如有）。
- `session_parameters`: 任务运行时应用的会话参数。

## 示例

列出当前角色可见的全部任务：

```sql
SHOW TASKS;
+----------------------------+---------------+------+---------------+---------+-----------+---------------------------------+----------+-------------------------------------------+------------------------+---------+-------------------------------------+-------------------+----------------------------+----------------------------+----------------------------+---------------------------------------------------+
| created_on                 | name          | id   | owner         | comment | warehouse | schedule                        | state    | definition                                | condition_text         | after   | suspend_task_after_num_failures     | error_integration | next_schedule_time         | last_committed_on          | last_suspended_on          | session_parameters                                  |
+----------------------------+---------------+------+---------------+---------+-----------+---------------------------------+----------+-------------------------------------------+------------------------+---------+-------------------------------------+-------------------+----------------------------+----------------------------+----------------------------+---------------------------------------------------+
| 2024-07-01 08:00:00.000000 | ingest_sales  | 101  | ACCOUNTADMIN  | NULL    | etl_wh    | CRON 0 5 * * * * TIMEZONE UTC   | Started  | COPY INTO sales FROM @stage PATTERN '.*'  | STREAM_STATUS('s1')    |         |                                   3 | slack_errors      | 2024-07-01 08:05:00.000000 | 2024-07-01 08:00:00.000000 | NULL                       | {"enable_query_result_cache":"1"}                   |
| 2024-07-01 09:00:00.000000 | hourly_checks | 102  | SYSADMIN      | health  | etl_wh    | INTERVAL 3600 SECOND            | Suspended | CALL run_health_check()                   |                        | ingest_sales |                                NULL | NULL              | 2024-07-01 10:00:00.000000 | 2024-07-01 09:05:00.000000 | 2024-07-01 09:10:00.000000 | {"query_result_cache_min_execute_secs":"5"}         |
+----------------------------+---------------+------+---------------+---------+-----------+---------------------------------+----------+-------------------------------------------+------------------------+---------+-------------------------------------+-------------------+----------------------------+----------------------------+----------------------------+---------------------------------------------------+
```

仅展示名称以 `ingest_` 开头的任务：

```sql
SHOW TASKS LIKE 'ingest_%';
```
