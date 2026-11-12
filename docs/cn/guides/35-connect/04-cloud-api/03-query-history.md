---
title: "查询历史"
sidebar_label: "查询历史"
---

调用前请先阅读[概览](./index.md)，了解鉴权、请求约定和错误处理。

## 搜索查询历史 {/* #search-query-history */}

`POST /api/v1/query/orgs/{orgSlug}/query-history/query` · Read · Member

搜索组织的查询历史。请求体中的字段都是可选的，但请求体必须是一个 JSON 对象。不加过滤条件时，传 `{}`。服务端从路径中确定组织，请勿传 `orgId`、`orgSlug`、`tenantId` 或 `accountId`。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `size` | integer | 否 | 每页条数。默认：15。 |
| `cursors` | array | 否 | 上一次响应中的 `cursors`。查询第一页时不传。 |
| `startTime` | string | 否 | 时间范围的起点。RFC 3339（`2026-11-09T00:00:00Z`）或日期（`2026-11-09`）。 |
| `endTime` | string | 否 | 时间范围的终点。格式同 `startTime`。 |
| `warehouse` | string | 否 | 计算集群名称。 |
| `email` | string | 否 | SQL 用户名。取值见[列出查询历史中的 SQL 用户](#list-sql-users-in-query-history)。 |
| `queryId` | string | 否 | 查询 ID，支持部分匹配。 |
| `queryText` | string | 否 | SQL 语句中的文本，所有词都需匹配。 |
| `queryKind` | string | 否 | 语句类型，例如 `Query`、`Insert` 或 `CopyIntoTable`。 |
| `database` | string | 否 | 查询的当前数据库。 |
| `sessionId` | string | 否 | 会话 ID。 |
| `userAgent` | string | 否 | 客户端 User-Agent 中的文本，任一词匹配即可。取结果项的 `userAgent` 值。 |
| `clusterId` | string | 否 | 集群 ID。取结果项的 `clusterId` 值。 |
| `nodeID` | string | 否 | 节点 ID。取结果项的 `nodeID` 值。注意字段名末尾是大写的 `ID`。 |
| `status` | integer | 否 | 单个[查询状态](#query-status)。 |
| `statusList` | integer[] | 否 | 多个[查询状态](#query-status)。 |
| `queryDurationGte` | integer | 否 | 最短耗时，单位毫秒。 |
| `queryDurationLte` | integer | 否 | 最长耗时，单位毫秒。 |
| `exceptionCode` | integer | 否 | 错误码。 |
| `exceptionText` | string | 否 | 错误信息中的文本。 |
| `queryTag` | string | 否 | 查询标签。 |
| `queryHash` | string | 否 | 查询哈希。 |
| `queryParameterizedHash` | string | 否 | 去掉字面值后的语句哈希。 |
| `sort` | string | 否 | 取值为 `startTime`、`queryDuration`、`queryQueuedDuration`、`resultRows`、`scanRows`、`warehouse` 之一。须与 `direction` 一起传。 |
| `direction` | string | 否 | `asc` 或 `desc`。须与 `sort` 一起传。两者都不传时，按 `startTime` `desc` 排序。 |

请求示例：

```json
{
  "size": 20,
  "startTime": "2026-11-09T00:00:00Z",
  "endTime": "2026-11-09T12:00:00Z",
  "warehouse": "<warehouse-name>",
  "statusList": [3, 4],
  "sort": "queryDuration",
  "direction": "desc"
}
```

响应示例。每条记录约有 70 个字段，示例只列出最常用的字段。

```json
{
  "success": true,
  "data": {
    "total": 1,
    "cursors": [35],
    "list": [
      {
        "queryId": "01a1b2c3-4d5e",
        "queryKind": "Query",
        "queryText": "SELECT count(*) FROM sales.orders",
        "status": 3,
        "logTypeName": "Error",
        "fail": true,
        "exceptionCode": 1025,
        "exceptionText": "Unknown table 'orders'",
        "sqlUser": "alice@example.com",
        "warehouse": "default",
        "currentDatabase": "sales",
        "startTime": "2026-11-09T08:00:01Z",
        "endTime": "2026-11-09T08:00:01Z",
        "queryDuration": 35,
        "scanRows": 0,
        "resultRows": 0,
        "hasProfiles": false,
        "sessionId": "8f6e1c2a"
      }
    ]
  }
}
```

获取下一页时，请求体保持不变，并把 `cursors` 设为本次响应中的 `cursors`。`list` 为空表示没有更多数据。

## 统计查询历史 {/* #count-query-history */}

`POST /api/v1/query/orgs/{orgSlug}/query-history/count` · Read · Member

统计符合过滤条件的查询数量。请求体与[搜索查询历史](#search-query-history)相同，服务端忽略 `size`、`cursors`、`sort` 和 `direction`。

响应示例：

```json
{ "success": true, "data": 1284 }
```

## 获取查询详情 {/* #get-query-details */}

`GET /api/v1/query/orgs/{orgSlug}/query-history/{queryId}/detail` · Read · Member

返回单个查询的详情。

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `orgSlug` | 路径 | string | 是 | 组织 ID。 |
| `queryId` | 路径 | string | 是 | 查询 ID。 |

响应示例：

```json
{
  "success": true,
  "data": {
    "queryId": "01a1b2c3-4d5e",
    "queryKind": "Query",
    "queryText": "SELECT count(*) FROM sales.orders",
    "startTime": "2026-11-09T08:00:01Z",
    "endTime": "2026-11-09T08:00:02Z",
    "queryDuration": 812,
    "queryQueuedDurationMS": 0,
    "status": 2,
    "fail": false,
    "failText": "",
    "database": "sales",
    "warehouse": "default",
    "warehouseSize": "Small",
    "tables": "sales.orders",
    "scanRows": 1200000,
    "bytesScanned": 48230000,
    "resultRows": 1,
    "resultBytes": 8,
    "hasProfiles": true,
    "accountEmail": "alice@example.com",
    "sessionId": "8f6e1c2a",
    "serverVersion": "v1.2.961-nightly"
  }
}
```

## 获取查询 Profile {/* #get-a-query-profile */}

`GET /api/v1/query/orgs/{orgSlug}/query-history/{queryId}/profile` · Read · Member

返回单个查询的执行 profile，用于定位慢算子。只有查询详情中 `hasProfiles` 为 `true` 时才调用此接口。参数与[获取查询详情](#get-query-details)相同。

响应使用 snake_case。`profiles` 是执行计划节点列表，`parent_id` 指向父节点。`statistics` 是一组数值，`statistics_desc` 说明每个数值的名称、单位和位置。

```json
{
  "success": true,
  "data": {
    "query_id": "01a1b2c3-4d5e",
    "warehouse": "default",
    "warehouse_size": "Small",
    "profiles": [
      {
        "id": 0,
        "parent_id": null,
        "name": "EvalScalar",
        "title": "",
        "cpu_time": 1520000,
        "wait_time": 0,
        "labels": [{ "name": "List of Expressions", "value": ["count(*)"] }],
        "statistics": [1520000, 0, 0, 0, 1, 8]
      }
    ],
    "statistics_desc": {}
  }
}
```

示例省略了 `statistics_desc` 的内容。它的每个键是统计项名称，每个值包含 `index` 字段，表示该统计项在各节点 `statistics` 列表中的位置。

## 列出查询历史中的 SQL 用户 {/* #list-sql-users-in-query-history */}

`GET /api/v1/query/orgs/{orgSlug}/query-history/sql-users` · Read · Member

返回查询历史中出现过的 SQL 用户名，可用作[搜索查询历史](#search-query-history)的 `email` 过滤值。

```json
{ "success": true, "data": ["alice@example.com", "etl_user"] }
```

## 类型 {/* #types */}

### 查询状态 {/* #query-status */}

用于查询历史（`status`、`statusList`）。

| 取值 | 名称 |
|---|---|
| `1` | `Start`（运行中） |
| `2` | `Finish` |
| `3` | `Error` |
| `4` | `Aborted` |
