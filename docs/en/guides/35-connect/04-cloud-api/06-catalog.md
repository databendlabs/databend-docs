---
title: "Catalog"
sidebar_label: "Catalog"
description: "Read catalog metadata with an account API token: databases, tables, columns, streams, and the log query configuration of a table. Results contain only the objects that your SQL role can access."
---

Read the [Overview](./index.md) first for authentication, request conventions, and errors.

Catalog endpoints read metadata through your SQL identity. The results contain only the objects that your SQL role can access. To read data, use the Query API.

## List Databases

`GET /api/v1/orgs/{orgSlug}/tenant/databases` · Read · Member

```json
{ "success": true, "data": [{ "name": "default" }, { "name": "sales" }] }
```

## List Tables

`GET /api/v1/orgs/{orgSlug}/tenant/databases/{database}/tables` · Read · Member

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `orgSlug` | path | string | Yes | Organization ID. |
| `database` | path | string | Yes | Database name. |

Response example. Sizes are in bytes.

```json
{
  "success": true,
  "data": [
    {
      "name": "orders",
      "database": "sales",
      "engine": "FUSE",
      "numRows": 1200000,
      "createTime": "2026-06-01 02:00:00.000 +0000",
      "dataSize": 96000000,
      "dataCompressedSize": 24000000,
      "indexSize": 120000,
      "createQuery": ""
    }
  ]
}
```

## Get a Table

`GET /api/v1/orgs/{orgSlug}/tenant/databases/{database}/tables/{table}` · Read · Member

Returns one table. The fields are the same as [List Tables](#list-tables). `createQuery` contains the `CREATE TABLE` statement when the catalog returns it.

## List Table Columns

`GET /api/v1/orgs/{orgSlug}/tenant/databases/{database}/tables/{table}/fields` · Read · Member

```json
{
  "success": true,
  "data": [
    { "name": "id", "type": "BIGINT", "nullable": false, "default": null },
    { "name": "created_at", "type": "TIMESTAMP", "nullable": true, "default": "now()" }
  ]
}
```

## Get the Log Query Configuration of a Table

`GET /api/v1/orgs/{orgSlug}/tenant/databases/{database}/tables/{table}/config` · Read · Member

Returns the Loki-compatible log query configuration of a table. If the table has no configuration, the response is `{ "success": true }` without `data`.

| Field | Type | Description |
|---|---|---|
| `schemaType` | string (enum) | `loki`: labels are in one VARIANT column. `flat`: each label is a separate column. |
| `timestampColumn` | string | Column with the log time. |
| `lineColumn` | string | Column with the log line. |
| `labelsColumn` | string | VARIANT column with the labels. Only for `loki`. |
| `labelColumns` | object[] | Label columns. Each item has `name`, `numeric`, and `invertedIndex`. |

```json
{
  "success": true,
  "data": {
    "database": "logs",
    "table": "app_logs",
    "schemaType": "loki",
    "timestampColumn": "ts",
    "lineColumn": "line",
    "labelsColumn": "labels",
    "labelColumns": [],
    "createdAt": "2026-10-01T02:00:00Z"
  }
}
```

## List Streams

`GET /api/v1/orgs/{orgSlug}/tenant/databases/{database}/streams` · Read · Member

```json
{
  "success": true,
  "data": [
    {
      "name": "orders_stream",
      "database": "sales",
      "catalog": "default",
      "tableName": "sales.orders",
      "mode": "append_only",
      "createdOn": "2026-06-01 02:00:00.000 +0000",
      "updatedOn": "2026-06-01 02:00:00.000 +0000"
    }
  ]
}
```

## Search Databases and Tables

`GET /api/v1/orgs/{orgSlug}/tenant/database-objects` · Read · Member

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `orgSlug` | path | string | Yes | Organization ID. |
| `name` | query | string | No | Keyword in the database or table name. Send it to limit the result. |

`kind` is `database` or `table`.

```json
{
  "success": true,
  "data": [
    { "name": "sales", "kind": "database", "database": "sales" },
    { "name": "orders", "kind": "table", "database": "sales" }
  ]
}
```
