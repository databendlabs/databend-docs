---
title: "Task Flows"
sidebar_label: "Task Flows"
---

Read the [Overview](./index.md) first for authentication, request conventions, and errors.

A task flow is a group of SQL tasks that you create in the console. A flow has a schedule, a warehouse, and a version history. These endpoints are read-only. All task flow endpoints are v2. Send `orgSlug` in the body.

## List Task Flows

`POST /api/v2/taskflow` · Read · Member

| Field | Type | Required | Description |
|---|---|---|---|
| `orgSlug` | string | Yes | Organization ID. |
| `page` | integer | No | Page number. Default: 1. |
| `perPage` | integer | No | Rows per page. Default: 20. |
| `filterName` | string | No | Partial match on the flow name. |
| `filterWarehouse` | string | No | Exact warehouse name. |
| `filterDataType` | integer (enum) | No | [Item data type](#item-data-type): `1` task, `2` flow. |
| `filterStatus` | integer (enum) | No | [Task flow status](#task-flow-status). |
| `filterCreatedAccountId` | integer | No | Account ID of the creator. |
| `filterUpdatedAccountId` | integer | No | Account ID of the last editor. |
| `sort` | string | No | `createdAt` or `updatedAt`. Default: `createdAt`. |
| `direction` | string | No | `asc` or `desc`. Default: `desc`. |
| `search` | string | No | Keyword in the flow name, task names, or task SQL. The response adds `highlights`. |
| `setSearchSnippetLen` | integer | No | Length of each SQL snippet in `highlights`. Default: 128. |

Request example:

```json
{ "orgSlug": "<organization-id>", "page": 1, "perPage": 20, "search": "daily_sales" }
```

Response example:

```json
{
  "success": true,
  "data": {
    "total": 1,
    "page": 1,
    "perPage": 20,
    "keyword": "daily_sales",
    "list": [
      {
        "id": 31,
        "orgSlug": "acme-prod",
        "name": "nightly_sales",
        "version": "a1b2c3d",
        "warehouse": "default",
        "itemDataType": 2,
        "status": 7,
        "tasks": [
          {
            "id": 101,
            "name": "refresh_daily_sales",
            "fullName": "__taskflow___31_refresh_daily_sales",
            "warehouse": "default",
            "schedule": { "type": 10, "args": "{\"value\":\"0 0 2 * * *\"}", "timezone": "UTC" },
            "sql": "INSERT INTO sales.daily SELECT ..."
          }
        ],
        "highlights": [{ "taskName": "refresh_daily_sales", "sql": "...daily_sales...", "fullSql": "INSERT INTO sales.daily SELECT ..." }],
        "createdAccountId": 7,
        "createdAccountEmail": "alice@example.com",
        "lastExecutedAt": "2026-11-09T02:00:00Z",
        "createdAt": "2026-06-01T02:00:00Z",
        "updatedAt": "2026-11-01T02:00:00Z"
      }
    ]
  }
}
```

## List Task Names

`POST /api/v2/taskflow/names` · Read · Member

Returns the names of all tasks in task flows and of single tasks. [`itemDataType`](#item-data-type) tells which. Use `taskFullName` to find the runs of a task in the SQL task run history.

| Field | Type | Required | Description |
|---|---|---|---|
| `orgSlug` | string | Yes | Organization ID. |

```json
{
  "success": true,
  "data": {
    "list": [
      { "flowId": 31, "flowName": "nightly_sales", "taskName": "refresh_daily_sales", "taskFullName": "__taskflow___31_refresh_daily_sales", "itemDataType": 2 }
    ]
  }
}
```

## Get the Dependency Graph of Task Flows

`POST /api/v2/taskflow/dag` · Read · Member

Returns all flows of the organization and the tasks that each flow depends on.

| Field | Type | Required | Description |
|---|---|---|---|
| `orgSlug` | string | Yes | Organization ID. |

```json
{
  "success": true,
  "data": {
    "list": [
      { "flowId": 31, "flowName": "nightly_sales", "requireTasks": ["__taskflow___30_load_orders"] }
    ]
  }
}
```

## Get a Task Flow

`POST /api/v2/taskflow/{taskflowId}/info` · Read · Member

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `taskflowId` | path | integer | Yes | Task flow ID. |
| `orgSlug` | body | string | Yes | Organization ID. |

Response: `data` is one task flow object. The fields are the same as one item of [List Task Flows](#list-task-flows). Each task can also have `runHistories`, `requireStream`, `requireTasks`, `errorIntegration`, and `suspend_task_after_num_failures`.

## List Task Flow Versions

`POST /api/v2/taskflow/versions` · Read · Member

| Field | Type | Required | Description |
|---|---|---|---|
| `orgSlug` | string | Yes | Organization ID. |
| `page` | integer | No | Page number. Default: 1. |
| `perPage` | integer | No | Rows per page. Default: 20. |
| `taskflowId` | integer | No | Filter by task flow ID. |
| `taskflowName` | string | No | Filter by exact task flow name. |
| `warehouse` | string | No | Filter by warehouse. |

Response example:

```json
{
  "success": true,
  "data": {
    "total": 1,
    "page": 1,
    "perPage": 20,
    "list": [
      {
        "id": 88,
        "taskflowId": 31,
        "taskflowName": "nightly_sales",
        "warehouse": "default",
        "version": "a1b2c3d",
        "taskIds": [101],
        "createdAccountId": 7,
        "createdAccountEmail": "alice@example.com",
        "createdAt": "2026-11-01T02:00:00Z"
      }
    ]
  }
}
```

## List the Versions of a Task Flow

`POST /api/v2/taskflow/versions/{taskflowId}` · Read · Member

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `taskflowId` | path | integer | Yes | Task flow ID. |
| `orgSlug` | body | string | Yes | Organization ID. |
| `page` | body | integer | No | Page number. Default: 1. |
| `perPage` | body | integer | No | Rows per page. Default: 20. |

Response: the same as [List Task Flow Versions](#list-task-flow-versions), plus `data.taskflowName`.

## Get a Task Flow Version

`POST /api/v2/taskflow/versions/{taskflowId}/{version}` · Read · Member

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `taskflowId` | path | integer | Yes | Task flow ID. |
| `version` | path | string | Yes | Version string from a version list, for example `a1b2c3d`. |
| `orgSlug` | body | string | Yes | Organization ID. |

Response: `data` is one version object. It has the fields of a version list item, plus `tasks` with the task definitions of that version.

## List Task Flow Run History

`POST /api/v2/taskflow/histories` · Read · Member

Returns the task runs of all task flows, from the newest run.

| Field | Type | Required | Description |
|---|---|---|---|
| `orgSlug` | string | Yes | Organization ID. |
| `perPage` | integer | No | Rows per page. Default: 20. |
| `nextPageToken` | string | No | The `nextPageToken` value of the previous response. |

Response example. `state` is a [task run state](./07-sql-tasks.md#task-run-state). `nextPageToken` is a string. If it is missing, there is no next page.

```json
{
  "success": true,
  "data": {
    "nextPageToken": "29319573127561217",
    "results": [
      {
        "taskName": "__taskflow___31_refresh_daily_sales",
        "taskflowId": 31,
        "taskflowName": "nightly_sales",
        "queryText": "INSERT INTO sales.daily SELECT ...",
        "state": 2,
        "scheduledTime": "2026-11-09T02:00:00Z",
        "completedTime": "2026-11-09T02:00:41Z",
        "queryId": "01a1b2c3-4d5e",
        "warehouse": "default"
      }
    ]
  }
}
```

## List the Run History of a Task Flow

`POST /api/v2/taskflow/histories/{taskflowId}` · Read · Member

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `taskflowId` | path | integer | Yes | Task flow ID. |
| `orgSlug` | body | string | Yes | Organization ID. |
| `perPage` | body | integer | No | Rows per page. Default: 20. |
| `nextPageToken` | body | string | No | The `nextPageToken` value of the previous response. |

The response has the same shape as [List Task Flow Run History](#list-task-flow-run-history), with one difference. In each result, `queryText` is a key. The SQL text is in `data.blobs[queryText]`. This keeps a repeated SQL statement out of every row.

```json
{
  "success": true,
  "data": {
    "results": [
      { "taskName": "__taskflow___31_refresh_daily_sales", "queryText": "7d1f0a", "state": 3, "errorCode": "1025", "errorMessage": "Unknown table", "scheduledTime": "2026-11-09T02:00:00Z", "queryId": "01a1b2c3-4d5e" }
    ],
    "blobs": { "7d1f0a": "INSERT INTO sales.daily SELECT ..." }
  }
}
```

## Types

### Item Data Type

`1` task (a single SQL task), `2` flow (a task flow with several tasks).

### Task Flow Status

| Value | Name |
|---|---|
| `5` | `SuspendFailed` |
| `6` | `Suspended` |
| `7` | `Resumed` |
| `8` | `ResumeFailed` |
| `9` | `DropFailed` |
| `10` | `Dropped` |

### Schedule Type

Task flow `schedule.type`. `schedule.args` is a JSON string.

| Value | Name | `args` example |
|---|---|---|
| `1` | Every N seconds | `{"value":"10"}` |
| `2` | Every N minutes | `{"value":"10"}` |
| `3` | Every day at a time | `{"value":"10:05"}` |
| `4` | Every week on a day at a time | `{"value":"10:05","everyWeek":2}` (`0`-`6`) |
| `5` | Every month on a date at a time | `{"value":"10:05","everyDate":28}` (`1`-`31`) |
| `10` | Cron expression | `{"value":"0 0 2 * * *"}` |
