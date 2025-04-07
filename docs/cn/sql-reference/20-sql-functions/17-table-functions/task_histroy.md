```markdown
---
title: TASK_HISTORY
---

显示给定变量的任务运行历史记录。

## 句法
```sql
TASK_HISTORY(
      [ SCHEDULED_TIME_RANGE_START => <constant_expr> ]
      [, SCHEDULED_TIME_RANGE_END => <constant_expr> ]
      [, RESULT_LIMIT => <integer> ]
      [, TASK_NAME => '<string>' ]
      [, ERROR_ONLY => { TRUE | FALSE } ]
      [, ROOT_TASK_ID => '<string>'] )
```



## 参数

所有参数都是可选的。

`SCHEDULED_TIME_RANGE_START => <constant_expr>`, `SCHEDULED_TIME_RANGE_END => <constant_expr>`

任务执行计划的时间范围（TIMESTAMP_LTZ 格式），在最近 7 天内。如果时间范围不在最近 7 天内，则返回错误。

* 如果未指定 `SCHEDULED_TIME_RANGE_END`，则该函数返回已完成、当前正在运行或计划在将来的任务。
* 如果 `SCHEDULED_TIME_RANGE_END` 是 CURRENT_TIMESTAMP，则该函数返回已完成或当前正在运行的任务。请注意，紧接在当前时间之前执行的任务仍可能被标识为已计划。
* 要仅查询已完成或当前正在运行的任务，请包含 `WHERE query_id IS NOT NULL` 作为过滤器。仅当任务已开始运行时，才会填充 TASK_HISTORY 输出中的 QUERY_ID 列。

如果未指定开始或结束时间，则返回最近的任务，最多为指定的 RESULT_LIMIT 值。

`RESULT_LIMIT => <integer>`

一个数字，指定函数返回的最大行数。

如果匹配的行数大于此限制，则返回具有最新时间戳的任务执行，最多为指定的限制。

范围：`1` 到 `10000`

默认值：`100`。

`TASK_NAME => <string>`

一个不区分大小写的字符串，用于指定任务。仅支持非限定任务名称。仅返回指定任务的执行。请注意，如果多个任务具有相同的名称，则该函数将返回每个任务的历史记录。

`ERROR_ONLY => { TRUE | FALSE }`

设置为 TRUE 时，此函数仅返回失败或已取消的任务运行。

`ROOT_TASK_ID => <string>`

任务图中的根任务的唯一标识符。此 ID 与同一任务的 SHOW TASKS 输出中的 ID 列值匹配。指定 ROOT_TASK_ID 以显示根任务的历史记录以及作为任务图一部分的任何子任务。

## 使用说明
* 此函数最多返回 10,000 行，在 RESULT_LIMIT 参数值中设置。默认值为 100。
* 此函数仅返回 ACCOUNTADMIN 角色的结果。


## 示例

```sql
SELECT
  *
FROM TASK_HISTORY() order by scheduled_time;
```
上面的 SQL 查询从 TASK_HISTORY 函数检索所有任务历史记录，并按 scheduled_time 列排序。（最多 10,000 条）



```sql
SELECT *
  FROM TASK_HISTORY(
    SCHEDULED_TIME_RANGE_START=>TO_TIMESTAMP('2022-01-02T01:12:00-07:00'),
    SCHEDULED_TIME_RANGE_END=>TO_TIMESTAMP('2022-01-02T01:12:30-07:00'))
```

上面的 SQL 查询从 TASK_HISTORY 函数检索所有任务历史记录，其中计划的时间范围从 '2022-01-02T01:12:00-07:00' 开始，到 '2022-01-02T01:12:30-07:00' 结束。这意味着它将返回计划在此特定 30 秒时间窗口内运行的任务。结果将包括符合此标准的任务的详细信息。
