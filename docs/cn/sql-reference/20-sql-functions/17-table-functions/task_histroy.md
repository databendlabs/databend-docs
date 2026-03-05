---
title: TASK_HISTORY
---

根据指定参数显示任务运行历史。

## 语法
```sql
TASK_HISTORY(
      [ SCHEDULED_TIME_RANGE_START => <constant_expr> ]
      [, SCHEDULED_TIME_RANGE_END => <constant_expr> ]
      [, RESULT_LIMIT => <integer> ]
      [, TASK_NAME => '<string>' ]
      [, ERROR_ONLY => { TRUE | FALSE } ]
      [, ROOT_TASK_ID => '<string>'] )
```

## 参数说明

所有参数均为可选。

`SCHEDULED_TIME_RANGE_START => <constant_expr>`, `SCHEDULED_TIME_RANGE_END => <constant_expr>`

指定查询的时间范围（TIMESTAMP_LTZ 格式），仅限于过去 7 天内的任务调度记录。如果指定的时间范围超出过去 7 天，函数将返回错误。

* 如果未指定 `SCHEDULED_TIME_RANGE_END`，函数将返回已完成、正在运行以及计划在未来执行的任务。
* 如果 `SCHEDULED_TIME_RANGE_END` 为 CURRENT_TIMESTAMP，函数将返回已完成或正在运行的任务。请注意，紧邻当前时间执行的任务可能仍会被标记为“已调度”。
* 若要仅查询已完成或正在运行的任务，请添加 `WHERE query_id IS NOT NULL` 过滤条件。TASK_HISTORY 输出中的 QUERY_ID 列仅在任务开始运行后才会填充。

如果未指定开始或结束时间，则返回最近的任务记录，返回数量不超过 RESULT_LIMIT 指定的值。

`RESULT_LIMIT => <integer>`

指定函数返回的最大行数。

如果匹配的行数超过此限制，则优先返回时间戳最近的任务执行记录，直到达到限制数量。

取值范围：`1` 到 `10000`

默认值：`100`。

`TASK_NAME => <string>`

指定任务名称的字符串（不区分大小写）。仅支持非限定任务名称。函数仅返回指定任务的执行记录。注意，如果有多个任务同名，函数将返回这些任务的所有历史记录。

`ERROR_ONLY => { TRUE | FALSE }`

如果设置为 TRUE，函数仅返回失败或被取消的任务运行记录。

`ROOT_TASK_ID => <string>`

任务图中根任务的唯一标识符。此 ID 与 SHOW TASKS 输出中该任务的 ID 列值一致。指定 ROOT_TASK_ID 可显示根任务及其任务图中所有子任务的历史记录。

## 使用须知
* 此函数最多返回 10,000 行记录，具体数量由 RESULT_LIMIT 参数设定。默认值为 100。
* 此函数仅返回 ACCOUNTADMIN 角色的结果。


## 示例

```sql
SELECT
  *
FROM TASK_HISTORY() order by scheduled_time;
```
上述 SQL 查询从 TASK_HISTORY 函数中检索所有任务历史记录，并按 scheduled_time 列排序（最多 10,000 条）。



```sql
SELECT *
  FROM TASK_HISTORY(
    SCHEDULED_TIME_RANGE_START=>TO_TIMESTAMP('2022-01-02T01:12:00-07:00'),
    SCHEDULED_TIME_RANGE_END=>TO_TIMESTAMP('2022-01-02T01:12:30-07:00'))
```

上述 SQL 查询从 TASK_HISTORY 函数中检索调度时间范围在 '2022-01-02T01:12:00-07:00' 到 '2022-01-02T01:12:30-07:00' 之间的所有任务历史记录。这意味着它将返回在这个 30 秒时间窗口内计划运行的任务。结果将包含符合此条件的任务详细信息。