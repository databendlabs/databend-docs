---
title: "任务流"
sidebar_label: "任务流"
---

调用前请先阅读[概览](./index.md)，了解鉴权、请求约定和错误处理。

任务流（Task Flow）是在控制台中创建的一组 SQL Task，包含调度、计算集群和版本历史。以下接口均为只读的 v2 接口，需在请求体中传 `orgSlug`。

## 列出任务流 {/* #list-task-flows */}

`POST /api/v2/taskflow` · Read · Member

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `orgSlug` | string | 是 | 组织 ID。 |
| `page` | integer | 否 | 页码。默认：1。 |
| `perPage` | integer | 否 | 每页条数。默认：20。 |
| `filterName` | string | 否 | 按任务流名称部分匹配。 |
| `filterWarehouse` | string | 否 | 计算集群名称，精确匹配。 |
| `filterDataType` | integer（枚举） | 否 | [条目类型](#item-data-type)：`1` 单个任务，`2` 任务流。 |
| `filterStatus` | integer（枚举） | 否 | [任务流状态](#task-flow-status)。 |
| `filterCreatedAccountId` | integer | 否 | 创建者的账户 ID。 |
| `filterUpdatedAccountId` | integer | 否 | 最后修改者的账户 ID。 |
| `sort` | string | 否 | `createdAt` 或 `updatedAt`。默认：`createdAt`。 |
| `direction` | string | 否 | `asc` 或 `desc`。默认：`desc`。 |
| `search` | string | 否 | 任务流名称、任务名或任务 SQL 中的关键词。传入后响应会增加 `highlights`。 |
| `setSearchSnippetLen` | integer | 否 | `highlights` 中每段 SQL 摘要的长度。默认：128。 |

请求示例：

```json
{ "orgSlug": "<organization-id>", "page": 1, "perPage": 20, "search": "daily_sales" }
```

响应示例：

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

## 列出任务名 {/* #list-task-names */}

`POST /api/v2/taskflow/names` · Read · Member

返回任务流中的任务名以及单个任务的任务名，用 `itemDataType` 区分。可以用 `taskFullName` 在 SQL Task 运行记录中查找该任务的运行情况。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `orgSlug` | string | 是 | 组织 ID。 |

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

## 获取任务流依赖图 {/* #get-the-dependency-graph-of-task-flows */}

`POST /api/v2/taskflow/dag` · Read · Member

返回组织的所有任务流，以及每个任务流依赖的任务。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `orgSlug` | string | 是 | 组织 ID。 |

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

## 获取任务流 {/* #get-a-task-flow */}

`POST /api/v2/taskflow/{taskflowId}/info` · Read · Member

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `taskflowId` | 路径 | integer | 是 | 任务流 ID。 |
| `orgSlug` | 请求体 | string | 是 | 组织 ID。 |

响应：`data` 是一个任务流对象，字段与[列出任务流](#list-task-flows)中的单项相同。其中每个任务还可能包含 `runHistories`、`requireStream`、`requireTasks`、`errorIntegration` 和 `suspend_task_after_num_failures`。

## 列出任务流版本 {/* #list-task-flow-versions */}

`POST /api/v2/taskflow/versions` · Read · Member

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `orgSlug` | string | 是 | 组织 ID。 |
| `page` | integer | 否 | 页码。默认：1。 |
| `perPage` | integer | 否 | 每页条数。默认：20。 |
| `taskflowId` | integer | 否 | 按任务流 ID 过滤。 |
| `taskflowName` | string | 否 | 按任务流名称精确过滤。 |
| `warehouse` | string | 否 | 按计算集群过滤。 |

响应示例：

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

## 列出单个任务流的版本 {/* #list-the-versions-of-a-task-flow */}

`POST /api/v2/taskflow/versions/{taskflowId}` · Read · Member

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `taskflowId` | 路径 | integer | 是 | 任务流 ID。 |
| `orgSlug` | 请求体 | string | 是 | 组织 ID。 |
| `page` | 请求体 | integer | 否 | 页码。默认：1。 |
| `perPage` | 请求体 | integer | 否 | 每页条数。默认：20。 |

响应：与[列出任务流版本](#list-task-flow-versions)相同，另外多一个 `data.taskflowName`。

## 获取任务流的某个版本 {/* #get-a-task-flow-version */}

`POST /api/v2/taskflow/versions/{taskflowId}/{version}` · Read · Member

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `taskflowId` | 路径 | integer | 是 | 任务流 ID。 |
| `version` | 路径 | string | 是 | 版本列表中的版本字符串，例如 `a1b2c3d`。 |
| `orgSlug` | 请求体 | string | 是 | 组织 ID。 |

响应：`data` 是一个版本对象，包含版本列表单项的字段，另外 `tasks` 中是该版本的任务定义。

## 列出任务流运行历史 {/* #list-task-flow-run-history */}

`POST /api/v2/taskflow/histories` · Read · Member

按从新到旧返回所有任务流的任务运行记录。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `orgSlug` | string | 是 | 组织 ID。 |
| `perPage` | integer | 否 | 每页条数。默认：20。 |
| `nextPageToken` | string | 否 | 上一次响应中的 `nextPageToken`。 |

响应示例。`state` 是[任务运行状态](./07-sql-tasks.md#task-run-state)。`nextPageToken` 是字符串，缺失表示没有下一页。

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

## 列出单个任务流的运行历史 {/* #list-the-run-history-of-a-task-flow */}

`POST /api/v2/taskflow/histories/{taskflowId}` · Read · Member

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `taskflowId` | 路径 | integer | 是 | 任务流 ID。 |
| `orgSlug` | 请求体 | string | 是 | 组织 ID。 |
| `perPage` | 请求体 | integer | 否 | 每页条数。默认：20。 |
| `nextPageToken` | 请求体 | string | 否 | 上一次响应中的 `nextPageToken`。 |

响应结构与[列出任务流运行历史](#list-task-flow-run-history)相同，只有一点不同：每条记录中的 `queryText` 是一个键，SQL 文本在 `data.blobs[queryText]` 中。这样重复的 SQL 语句不会在每行中重复出现。

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

## 类型 {/* #types */}

### 条目类型 {/* #item-data-type */}

`1` 单个任务（一个 SQL Task），`2` 任务流（包含多个任务）。

### 任务流状态 {/* #task-flow-status */}

| 取值 | 名称 |
|---|---|
| `5` | `SuspendFailed` |
| `6` | `Suspended` |
| `7` | `Resumed` |
| `8` | `ResumeFailed` |
| `9` | `DropFailed` |
| `10` | `Dropped` |

### 调度类型 {/* #schedule-type */}

任务流的 `schedule.type`。`schedule.args` 是 JSON 字符串。

| 取值 | 名称 | `args` 示例 |
|---|---|---|
| `1` | 每 N 秒 | `{"value":"10"}` |
| `2` | 每 N 分钟 | `{"value":"10"}` |
| `3` | 每天指定时间 | `{"value":"10:05"}` |
| `4` | 每周指定日期和时间 | `{"value":"10:05","everyWeek":2}`（`0`-`6`） |
| `5` | 每月指定日期和时间 | `{"value":"10:05","everyDate":28}`（`1`-`31`） |
| `10` | Cron 表达式 | `{"value":"0 0 2 * * *"}` |
