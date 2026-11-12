---
title: "Organization and Metrics"
sidebar_label: "Organization and Metrics"
---

Read the [Overview](./index.md) first for authentication, request conventions, and errors.

## Get Organization Tenant Information

`GET /api/v1/orgs/{orgSlug}/tenant` · Read · Member

Returns the cloud provider, region, plan, and enabled features of the organization.

Response example:

```json
{
  "success": true,
  "data": {
    "id": "tn3ftqihs",
    "state": "ready",
    "provider": "aws",
    "region": "us-east-2",
    "planType": "BUSINESS",
    "features": {},
    "provisionProgressItems": [],
    "createdAt": "2026-06-01T02:00:00Z",
    "updatedAt": "2026-11-01T02:00:00Z"
  }
}
```

## Get Metrics

`GET /api/v1/orgs/{orgSlug}/tenant/metrics/{queryType}` · Read · Member

Returns a time series for one metric.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `orgSlug` | path | string | Yes | Organization ID. |
| `queryType` | path | string (enum) | Yes | Metric name. See the table below. |
| `from` | query | string | Yes | Start time, RFC 3339. |
| `to` | query | string | Yes | End time, RFC 3339. Must be after `from`. |
| `step` | query | string | Yes | Interval between points, as a duration: `30s`, `60s`, `5m`, `1h`. |
| `warehouseName` | query | string | No | Warehouse name. Limits `QueryStatusCount`, `QueryStatusCountByCluster`, `QueryHttpRequestsCount`, `QueryHttpRequestsCountByCluster`, and `QueryAcquiredCountByCluster` to one warehouse. Other metrics ignore it. |
| `taskId` | query | integer | For `TiDBSync` and `MySQLSync` | Data integration task ID. |

`queryType` values:

| Value | Description |
|---|---|
| `SQLQueriesOvertime` | Query count over time. |
| `QueryPerMinute` | Queries per minute. |
| `QueryErrorPerMinute` | Failed queries per minute. |
| `QueryStatusCount` | Queries by status. |
| `QueryStatusCountByCluster` | Queries by status and cluster. |
| `QueryReadWriteRows` | Rows read and written. |
| `QueryHttpRequestsCount` | HTTP query requests. |
| `QueryHttpRequestsCountByCluster` | HTTP query requests by cluster. |
| `QueryAcquiredCountByCluster` | Queries that got a run slot, by cluster. |
| `SessionConnections` | Open sessions. |
| `WarehouseStatus` | Warehouse state over time. |
| `WarehouseRunningClusters` | Running clusters per warehouse. |
| `S3ReadWriteBytesTotal` | Bytes read from and written to object storage. |
| `S3RequestPerMinute` | Object storage requests per minute. |
| `DataStoreOvertime` | Storage size over time. |
| `TiDBSync` | Sync metrics of a TiDB data integration task. See [Get Sync Metrics](./14-data-integration-tasks.md#get-sync-metrics). |
| `MySQLSync` | Sync metrics of a MySQL data integration task. See [Get Sync Metrics](./14-data-integration-tasks.md#get-sync-metrics). |

Request example:

```bash
curl --get 'https://api.databend.com/api/v1/orgs/<organization-id>/tenant/metrics/QueryPerMinute' \
  --header 'X-DATABENDCLOUD-TOKEN: <api-token>' \
  --data-urlencode 'from=2026-11-09T07:00:00Z' \
  --data-urlencode 'to=2026-11-09T08:00:00Z' \
  --data-urlencode 'step=60s'
```

Response example. `time` values are Unix seconds. A `null` value means that there is no sample at that time.

```json
{
  "success": true,
  "data": {
    "resultType": "matrix",
    "time": [1762671600, 1762671660],
    "total": 18,
    "series": [
      { "metric": "default", "time": [1762671600, 1762671660], "value": [10, null], "total": 10, "max": 10, "min": 10, "latest": 10 }
    ]
  }
}
```
