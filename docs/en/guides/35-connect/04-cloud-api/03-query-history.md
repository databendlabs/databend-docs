---
title: "Query History"
sidebar_label: "Query History"
---

Read the [Overview](./index.md) first for authentication, request conventions, and errors.

## Search Query History

`POST /api/v1/query/orgs/{orgSlug}/query-history/query` · Read · Member

Searches the query history of the organization. All body fields are optional, but the body must be a JSON object. Send `{}` to search without filters. The server sets the organization from the path. Do not send `orgId`, `orgSlug`, `tenantId`, or `accountId`.

| Field | Type | Required | Description |
|---|---|---|---|
| `size` | integer | No | Rows per page. Default: 15. |
| `cursors` | array | No | The `cursors` value from the previous response. Omit it for the first page. |
| `startTime` | string | No | Start of the time range. RFC 3339 (`2026-11-09T00:00:00Z`) or date (`2026-11-09`). |
| `endTime` | string | No | End of the time range. Same format as `startTime`. |
| `warehouse` | string | No | Warehouse name. |
| `email` | string | No | SQL user name. Use a value from [List SQL Users](#list-sql-users-in-query-history). |
| `queryId` | string | No | Query ID. Partial values match. |
| `queryText` | string | No | Text in the SQL statement. All words must match. |
| `queryKind` | string | No | Statement kind, for example `Query`, `Insert`, or `CopyIntoTable`. |
| `database` | string | No | Current database of the query. |
| `sessionId` | string | No | Session ID. |
| `userAgent` | string | No | Text in the client user agent. Any word can match. Use the `userAgent` value of a result item. |
| `clusterId` | string | No | Cluster ID. Use the `clusterId` value of a result item. |
| `nodeID` | string | No | Node ID. Use the `nodeID` value of a result item. The field name ends in an uppercase `ID`. |
| `status` | integer | No | One [query status](#query-status). |
| `statusList` | integer[] | No | Several query statuses. |
| `queryDurationGte` | integer | No | Minimum duration in milliseconds. |
| `queryDurationLte` | integer | No | Maximum duration in milliseconds. |
| `exceptionCode` | integer | No | Error code. |
| `exceptionText` | string | No | Text in the error message. |
| `queryTag` | string | No | Query tag. |
| `queryHash` | string | No | Query hash. |
| `queryParameterizedHash` | string | No | Hash of the statement without literal values. |
| `sort` | string | No | One of `startTime`, `queryDuration`, `queryQueuedDuration`, `resultRows`, `scanRows`, `warehouse`. Send it together with `direction`. |
| `direction` | string | No | `asc` or `desc`. Send it together with `sort`. If you omit both, the order is `startTime` `desc`. |

Request example:

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

Response example. Each item has about 70 fields. This example shows the most useful ones.

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

To get the next page, send the same body with `cursors` set to the `cursors` value of the response. An empty `list` means that there are no more rows.

## Count Query History

`POST /api/v1/query/orgs/{orgSlug}/query-history/count` · Read · Member

Counts the queries that match the filters. The body is the same as [Search Query History](#search-query-history). The server ignores `size`, `cursors`, `sort`, and `direction`.

Response example:

```json
{ "success": true, "data": 1284 }
```

## Get Query Details

`GET /api/v1/query/orgs/{orgSlug}/query-history/{queryId}/detail` · Read · Member

Returns the details of one query.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `orgSlug` | path | string | Yes | Organization ID. |
| `queryId` | path | string | Yes | Query ID. |

Response example:

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

## Get a Query Profile

`GET /api/v1/query/orgs/{orgSlug}/query-history/{queryId}/profile` · Read · Member

Returns the execution profile of one query. Use it to find slow operators. Call this endpoint only if `hasProfiles` is `true` in the query details. Parameters are the same as [Get Query Details](#get-query-details).

The response uses snake_case. `profiles` is a list of plan nodes. `parent_id` links a node to its parent. `statistics` is a list of numbers. `statistics_desc` gives the name, unit, and index of each number.

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

The example leaves out the content of `statistics_desc`. Each key is a statistic name. Each value has an `index` field, which is the position of the statistic in the `statistics` list of each node.

## List SQL Users in Query History

`GET /api/v1/query/orgs/{orgSlug}/query-history/sql-users` · Read · Member

Returns the SQL user names that appear in the query history. Use a value as the `email` filter of [Search Query History](#search-query-history).

```json
{ "success": true, "data": ["alice@example.com", "etl_user"] }
```

## Types

### Query Status

Used by query history (`status`, `statusList`).

| Value | Name |
|---|---|
| `1` | `Start` (running) |
| `2` | `Finish` |
| `3` | `Error` |
| `4` | `Aborted` |
