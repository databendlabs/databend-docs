---
title: "Warehouses"
sidebar_label: "Warehouses"
description: "List warehouses, and read the state, sessions, run history, and available sizes of a warehouse, with an account API token. These endpoints are read-only."
---

Read the [Overview](./index.md) first for authentication, request conventions, and errors.

These endpoints only read warehouse state. To create, resize, resume, suspend, or drop a warehouse, use warehouse management SQL through the Query API. These SQL statements need the `account_admin` role.

## List Warehouses

`GET /api/v1/orgs/{orgSlug}/tenant/warehouses` · Read · Member

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `orgSlug` | path | string | Yes | Organization ID. |
| `warehouseName` | query | string | No | Filter by name. Case-insensitive partial match. |
| `state` | query | string | No | Filter by state. Repeat the parameter for several states: `state=Running&state=Suspended`. See [Warehouse state](#warehouse-state). |

Response example:

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

`id` is the warehouse name. `autoSuspend` is in seconds.

## Get a Warehouse

`GET /api/v1/orgs/{orgSlug}/tenant/warehouses/{warehouseName}` · Read · Member

Returns one warehouse. The response `data` is one object with the same fields as [List Warehouses](#list-warehouses). HTTP 404 means that the warehouse does not exist.

## List Warehouse Sessions

`GET /api/v1/orgs/{orgSlug}/tenant/warehouses/{warehouseName}/processes` · Read · Member

Returns the sessions and running queries of a warehouse.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `orgSlug` | path | string | Yes | Organization ID. |
| `warehouseName` | path | string | Yes | Warehouse name. |

Response example:

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

## Get Warehouse Run History

`GET /api/v1/orgs/{orgSlug}/tenant/warehouse-history/{warehouseName}` · Read · Member

Returns the periods in which a warehouse was running, and the credits of each period. Each item groups the periods of one day. `bucket` is the day. Items are sorted from the newest day. `duration` is in seconds. `unitPrice` is the credit price per `unit`.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `orgSlug` | path | string | Yes | Organization ID. |
| `warehouseName` | path | string | Yes | Warehouse name. |

Response example:

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

## List Warehouse Sizes

`GET /api/v1/orgs/{orgSlug}/warehouse-sizes` · Read · Member

Returns the warehouse sizes that the organization can use, with their price.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `orgSlug` | path | string | Yes | Organization ID. |
| `provider` | query | string | No | Cloud provider, for example `aws`. Use it with `region` to get the price in another region. |
| `region` | query | string | No | Cloud region, for example `us-east-2`. |

Response example:

```json
{
  "success": true,
  "data": [
    { "name": "XSmall", "value": "XSmall", "vCPUs": 8, "computeUnitsPerHour": 1, "creditCostPerHour": 1, "creditCurrency": "$" },
    { "name": "Small", "value": "Small", "vCPUs": 16, "computeUnitsPerHour": 2, "creditCostPerHour": 2, "creditCurrency": "$" }
  ]
}
```

`creditCurrency` is the currency symbol of the site, for example `$` or `¥`.

## Types

### Warehouse State

`Running`, `Starting`, `Started`, `Suspended`, `Terminated`, `Failed`. The `state` filter is not case-sensitive.
