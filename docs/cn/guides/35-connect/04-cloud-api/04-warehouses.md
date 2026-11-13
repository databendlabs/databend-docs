---
title: "计算集群"
sidebar_label: "计算集群"
description: "使用账户 API token 列出计算集群，读取计算集群的状态、会话、运行历史和可用规格。这些接口只读。"
---

调用前请先阅读[概览](./index.md)，了解鉴权、请求约定和错误处理。

这些接口只读取计算集群状态。如需创建、调整规格、恢复、暂停或删除计算集群，请通过 Query API 执行计算集群管理 SQL。这些 SQL 需要 `account_admin` 角色。

## 列出计算集群 {/* #list-warehouses */}

`GET /api/v1/orgs/{orgSlug}/tenant/warehouses` · Read · Member

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `orgSlug` | 路径 | string | 是 | 组织 ID。 |
| `warehouseName` | 查询 | string | 否 | 按名称过滤，不区分大小写，支持部分匹配。 |
| `state` | 查询 | string | 否 | 按状态过滤。多个状态时重复传参：`state=Running&state=Suspended`。取值见[计算集群状态](#warehouse-state)。 |

响应示例：

```json
{
  "success": true,
  "data": [
    {
      "id": "default",
      "size": "Small",
      "state": "Running",
      "readySince": "2026-11-09T07:58:10Z",
      "createdBy": "alice@example.com",
      "createdAt": "2026-06-01T02:00:00Z",
      "role": "",
      "clusterStatus": { "enabled": 1, "running": 1, "starting": 0 },
      "autoSuspend": 300,
      "autoResume": true,
      "minAutoScaleClusters": 1,
      "maxAutoScaleClusters": 1,
      "comment": "",
      "tags": { "team": "data" }
    }
  ]
}
```

`id` 是计算集群名称。`autoSuspend` 的单位是秒。

## 获取计算集群 {/* #get-a-warehouse */}

`GET /api/v1/orgs/{orgSlug}/tenant/warehouses/{warehouseName}` · Read · Member

返回单个计算集群。响应中的 `data` 是一个对象，字段与[列出计算集群](#list-warehouses)相同。HTTP 404 表示计算集群不存在。

## 列出计算集群会话 {/* #list-warehouse-sessions */}

`GET /api/v1/orgs/{orgSlug}/tenant/warehouses/{warehouseName}/processes` · Read · Member

返回计算集群的会话和正在运行的查询。

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `orgSlug` | 路径 | string | 是 | 组织 ID。 |
| `warehouseName` | 路径 | string | 是 | 计算集群名称。 |

响应示例：

```json
{
  "success": true,
  "data": [
    {
      "id": "7c2f3a",
      "type": "HTTPQuery",
      "state": "Query",
      "database": "sales",
      "user": "alice@example.com",
      "clientAddress": "203.0.113.10",
      "currentQueryID": "01a1b2c3-4d5e",
      "memoryUsage": 10485760,
      "createdTime": "2026-11-09T08:00:01Z",
      "cluster": "default"
    }
  ]
}
```

## 获取计算集群运行历史 {/* #get-warehouse-run-history */}

`GET /api/v1/orgs/{orgSlug}/tenant/warehouse-history/{warehouseName}` · Read · Member

返回计算集群的各段运行时间及每段消耗的 credit。每一项汇总一天的运行记录，`bucket` 是日期，按日期从新到旧排序。`duration` 的单位是秒。`unitPrice` 是每个 `unit` 的 credit 单价。

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `orgSlug` | 路径 | string | 是 | 组织 ID。 |
| `warehouseName` | 路径 | string | 是 | 计算集群名称。 |

响应示例：

```json
{
  "success": true,
  "data": [
    {
      "bucket": "2026-11-09",
      "logs": [
        {
          "beginTime": "2026-11-09T08:00:00Z",
          "stopTime": "2026-11-09T09:00:00Z",
          "size": "Small",
          "duration": 3600,
          "computeUnits": 1,
          "unitPrice": 1.5,
          "creditCost": 1.5,
          "unit": "hour"
        }
      ]
    }
  ]
}
```

## 列出计算集群规格 {/* #list-warehouse-sizes */}

`GET /api/v1/orgs/{orgSlug}/warehouse-sizes` · Read · Member

返回组织可用的计算集群规格及价格。

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `orgSlug` | 路径 | string | 是 | 组织 ID。 |
| `provider` | 查询 | string | 否 | 云厂商，例如 `aws`。与 `region` 一起使用，可查询其他地域的价格。 |
| `region` | 查询 | string | 否 | 云地域，例如 `us-east-2`。 |

响应示例：

```json
{
  "success": true,
  "data": [
    { "name": "XSmall", "value": "XSmall", "vCPUs": 8, "computeUnitsPerHour": 1, "creditCostPerHour": 1, "creditCurrency": "$" },
    { "name": "Small", "value": "Small", "vCPUs": 16, "computeUnitsPerHour": 2, "creditCostPerHour": 2, "creditCurrency": "$" }
  ]
}
```

`creditCurrency` 是站点的货币符号，例如 `$` 或 `¥`。

## 类型 {/* #types */}

### 计算集群状态 {/* #warehouse-state */}

`Running`、`Starting`、`Started`、`Suspended`、`Terminated`、`Failed`。`state` 过滤不区分大小写。
