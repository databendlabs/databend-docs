---
title: "SQL Tasks"
sidebar_label: "SQL Tasks"
description: "Describe a SQL task that you created with CREATE TASK, and query its runs, with an account API token."
---

Read the [Overview](./index.md) first for authentication, request conventions, and errors.

SQL tasks are tasks that you create with `CREATE TASK`. To list or change SQL tasks, use SQL through the Query API. For task flows that you create in the console, see [Task Flows](./12-task-flows.md).

## Describe a SQL Task

`GET /api/v1/orgs/{orgSlug}/tenant/tasks/{taskName}` · Read · Member

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `orgSlug` | path | string | Yes | Organization ID. |
| `taskName` | path | string | Yes | Task name. |

`status` is `0` (suspended) or `1` (started). `scheduleOptions.scheduleType` is `0` (interval, in `interval` seconds) or `1` (cron, in `cron` and `timeZone`).

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

## Query SQL Task Runs

`POST /api/v1/orgs/{orgSlug}/tenant/tasks-runs/query` · Read · Member

| Field | Type | Required | Description |
|---|---|---|---|
| `taskName` | string | No | One task name. |
| `taskNames` | string[] | No | Several task names. |
| `scheduledTimeStart` | string | No | Start of the scheduled time range, RFC 3339. |
| `scheduledTimeEnd` | string | No | End of the scheduled time range, RFC 3339. |
| `page` | integer | No | Page number. Send it with `nextPageToken` when you go to the next page. |
| `perPage` | integer | No | Rows per page. |
| `nextPageToken` | string | No | The `nextPageToken` value of the previous response. |
| `previousPageToken` | string | No | The `previousPageToken` value of the previous response. |

Request example:

```json
{
  "taskNames": ["refresh_daily_sales"],
  "scheduledTimeStart": "2026-11-08T00:00:00Z",
  "scheduledTimeEnd": "2026-11-09T00:00:00Z",
  "perPage": 50
}
```

Response example. Task run fields use snake_case. `state` is a [task run state](#task-run-state). Page tokens are strings. If `nextPageToken` is missing, there is no next page.

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

## Types

### Task Run State

Used by SQL task runs (`state`) and task flow run history (`state`).

| Value | Name |
|---|---|
| `0` | `SCHEDULED` |
| `1` | `EXECUTING` |
| `2` | `SUCCEEDED` |
| `3` | `FAILED` |
| `4` | `CANCELLED` |
