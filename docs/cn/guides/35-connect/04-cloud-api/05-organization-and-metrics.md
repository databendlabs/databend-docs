---
title: "组织与监控"
sidebar_label: "组织与监控"
---

调用前请先阅读[概览](./index.md)，了解鉴权、请求约定和错误处理。

## 获取组织租户信息 {/* #get-organization-tenant-information */}

`GET /api/v1/orgs/{orgSlug}/tenant` · Read · Member

返回组织的云厂商、地域、套餐和已开通的功能。

响应示例：

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

## 获取组织统计 {/* #get-organization-statistics */}

`GET /api/v1/orgs/{orgSlug}/tenant/statistics` · Read · Member

返回查询、工作表、表、数据库和计算集群的数量，以及存储用量。

```json
{
  "success": true,
  "data": {
    "queryTimes": 18234,
    "worksheetsCount": 42,
    "tablesCount": 310,
    "databasesCount": 12,
    "warehousesCount": 3,
    "storageInfo": { "total": 0, "used": 1073741824, "changed": 1048576 },
    "planUsageInfo": { "credits": 120.5, "storage": {} }
  }
}
```

## 获取监控指标 {/* #get-metrics */}

`GET /api/v1/orgs/{orgSlug}/tenant/metrics/{queryType}` · Read · Member

返回单个指标的时间序列。

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `orgSlug` | 路径 | string | 是 | 组织 ID。 |
| `queryType` | 路径 | string（枚举） | 是 | 指标名，见下表。 |
| `from` | 查询 | string | 是 | 开始时间，RFC 3339。 |
| `to` | 查询 | string | 是 | 结束时间，RFC 3339，必须晚于 `from`。 |
| `step` | 查询 | string | 是 | 数据点间隔，使用时长格式：`30s`、`60s`、`5m`、`1h`。 |
| `warehouseName` | 查询 | string | 否 | 计算集群名称，用于计算集群相关指标。 |
| `taskId` | 查询 | integer | `TiDBSync`、`MySQLSync` 必填 | 数据集成任务 ID。 |

`queryType` 取值：

| 取值 | 说明 |
|---|---|
| `SQLQueriesOvertime` | 查询数量随时间的变化。 |
| `QueryPerMinute` | 每分钟查询数。 |
| `QueryErrorPerMinute` | 每分钟失败查询数。 |
| `QueryStatusCount` | 按状态统计的查询数。 |
| `QueryStatusCountByCluster` | 按状态和集群统计的查询数。 |
| `QueryReadWriteRows` | 读写行数。 |
| `QueryHttpRequestsCount` | HTTP 查询请求数。 |
| `QueryHttpRequestsCountByCluster` | 按集群统计的 HTTP 查询请求数。 |
| `QueryAcquiredCountByCluster` | 按集群统计的获得执行槽位的查询数。 |
| `SessionConnections` | 打开的会话数。 |
| `WarehouseStatus` | 计算集群状态随时间的变化。 |
| `WarehouseRunningClusters` | 每个计算集群正在运行的集群数。 |
| `S3ReadWriteBytesTotal` | 从对象存储读取和写入的字节数。 |
| `S3RequestPerMinute` | 每分钟对象存储请求数。 |
| `DataStoreOvertime` | 存储容量随时间的变化。 |
| `TiDBSync` | TiDB 数据集成任务的同步指标，见[获取同步指标](./14-data-integration-tasks.md#get-sync-metrics)。 |
| `MySQLSync` | MySQL 数据集成任务的同步指标，见[获取同步指标](./14-data-integration-tasks.md#get-sync-metrics)。 |

请求示例：

```bash
curl --get 'https://api.databend.cn/api/v1/orgs/<organization-id>/tenant/metrics/QueryPerMinute' \
  --header 'X-DATABENDCLOUD-TOKEN: <api-token>' \
  --data-urlencode 'from=2026-11-09T07:00:00Z' \
  --data-urlencode 'to=2026-11-09T08:00:00Z' \
  --data-urlencode 'step=60s'
```

响应示例。`time` 的值是 Unix 秒。值为 `null` 表示该时间点没有采样。

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
