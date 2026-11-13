---
title: "SQL Task"
sidebar_label: "SQL Task"
description: "使用账户 API token 查看通过 CREATE TASK 创建的 SQL Task，并查询它的运行记录。"
---

调用前请先阅读[概览](./index.md)，了解鉴权、请求约定和错误处理。

SQL Task 是通过 `CREATE TASK` 创建的任务。如需列出或修改 SQL Task，请通过 Query API 执行 SQL。在控制台中创建的任务流见[任务流](./12-task-flows.md)。

## 查看 SQL Task {/* #describe-a-sql-task */}

`GET /api/v1/orgs/{orgSlug}/tenant/tasks/{taskName}` · Read · Member

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `orgSlug` | 路径 | string | 是 | 组织 ID。 |
| `taskName` | 路径 | string | 是 | 任务名。 |

`status` 为 `0`（已暂停）或 `1`（已启动）。`scheduleOptions.scheduleType` 为 `0`（按间隔调度，间隔秒数在 `interval` 中）或 `1`（按 cron 调度，表达式在 `cron` 中，时区在 `timeZone` 中）。

```json
{
  "success": true,
  "data": {
    "taskID": 1024,
    "taskName": "refresh_daily_sales",
    "queryText": "INSERT INTO sales.daily SELECT ...",
    "owner": "account_admin",
    "scheduleOptions": { "cron": "0 2 * * *", "timeZone": "UTC", "scheduleType": 1 },
    "warehouseOptions": { "warehouse": "default" },
    "nextScheduledAt": "2026-11-10T02:00:00Z",
    "status": 1,
    "createdAt": "2026-06-01T02:00:00Z",
    "updatedAt": "2026-11-01T02:00:00Z"
  }
}
```

## 查询 SQL Task 运行记录 {/* #query-sql-task-runs */}

`POST /api/v1/orgs/{orgSlug}/tenant/tasks-runs/query` · Read · Member

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `taskName` | string | 否 | 单个任务名。 |
| `taskNames` | string[] | 否 | 多个任务名。 |
| `scheduledTimeStart` | string | 否 | 计划执行时间范围的起点，RFC 3339。 |
| `scheduledTimeEnd` | string | 否 | 计划执行时间范围的终点，RFC 3339。 |
| `page` | integer | 否 | 页码。翻到下一页时与 `nextPageToken` 一起传。 |
| `perPage` | integer | 否 | 每页条数。 |
| `nextPageToken` | string | 否 | 上一次响应中的 `nextPageToken`。 |
| `previousPageToken` | string | 否 | 上一次响应中的 `previousPageToken`。 |

请求示例：

```json
{
  "taskNames": ["refresh_daily_sales"],
  "scheduledTimeStart": "2026-11-08T00:00:00Z",
  "scheduledTimeEnd": "2026-11-09T00:00:00Z",
  "perPage": 50
}
```

响应示例。任务运行记录的字段使用 snake_case。`state` 是[任务运行状态](#task-run-state)。分页令牌是字符串，没有 `nextPageToken` 表示没有下一页。

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "task_id": 1024,
        "task_name": "refresh_daily_sales",
        "query_text": "INSERT INTO sales.daily SELECT ...",
        "run_id": "7f9c1d2e",
        "attempt_number": 1,
        "state": 3,
        "error_code": 1025,
        "error_message": "Unknown table 'orders_tmp'",
        "scheduled_time": "2026-11-08T02:00:00Z",
        "completed_time": "2026-11-08T02:00:04Z",
        "query_id": "01a1b2c3-4d5e",
        "warehouse_options": { "warehouse": "default" }
      }
    ],
    "nextPageToken": "29319573127561217"
  }
}
```

## 类型 {/* #types */}

### 任务运行状态 {/* #task-run-state */}

用于 SQL Task 运行记录（`state`）和任务流运行历史（`state`）。

| 取值 | 名称 |
|---|---|
| `0` | `SCHEDULED` |
| `1` | `EXECUTING` |
| `2` | `SUCCEEDED` |
| `3` | `FAILED` |
| `4` | `CANCELLED` |
