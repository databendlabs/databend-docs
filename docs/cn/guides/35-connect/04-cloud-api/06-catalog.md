---
title: "Catalog"
sidebar_label: "Catalog"
description: "使用账户 API token 读取 Catalog 元数据：数据库、表、列、Stream，以及表的日志查询配置。结果只包含您的 SQL 角色可以访问的对象。"
---

调用前请先阅读[概览](./index.md)，了解鉴权、请求约定和错误处理。

Catalog 接口以您的 SQL 身份读取元数据，结果只包含您的 SQL 角色有权访问的对象。如需读取数据，请使用 Query API。

## 列出数据库 {/* #list-databases */}

`GET /api/v1/orgs/{orgSlug}/tenant/databases` · Read · Member

```json
{ "success": true, "data": [{ "name": "default" }, { "name": "sales" }] }
```

## 列出表 {/* #list-tables */}

`GET /api/v1/orgs/{orgSlug}/tenant/databases/{database}/tables` · Read · Member

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `orgSlug` | 路径 | string | 是 | 组织 ID。 |
| `database` | 路径 | string | 是 | 数据库名。 |

响应示例。大小的单位是字节。

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

## 获取表 {/* #get-a-table */}

`GET /api/v1/orgs/{orgSlug}/tenant/databases/{database}/tables/{table}` · Read · Member

返回单个表，字段与[列出表](#list-tables)相同。Catalog 返回建表语句时，`createQuery` 中包含 `CREATE TABLE` 语句。

## 列出表的列 {/* #list-table-columns */}

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

## 获取表的日志查询配置 {/* #get-the-log-query-configuration-of-a-table */}

`GET /api/v1/orgs/{orgSlug}/tenant/databases/{database}/tables/{table}/config` · Read · Member

返回表的 Loki 兼容日志查询配置。表没有配置时，响应为 `{ "success": true }`，不带 `data`。

| 字段 | 类型 | 说明 |
|---|---|---|
| `schemaType` | string（枚举） | `loki`：所有标签存放在一个 VARIANT 列中。`flat`：每个标签是单独的列。 |
| `timestampColumn` | string | 日志时间所在的列。 |
| `lineColumn` | string | 日志内容所在的列。 |
| `labelsColumn` | string | 存放标签的 VARIANT 列，仅用于 `loki`。 |
| `labelColumns` | object[] | 标签列，每项包含 `name`、`numeric` 和 `invertedIndex`。 |

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

## 列出 Stream {/* #list-streams */}

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

## 搜索数据库和表 {/* #search-databases-and-tables */}

`GET /api/v1/orgs/{orgSlug}/tenant/database-objects` · Read · Member

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `orgSlug` | 路径 | string | 是 | 组织 ID。 |
| `name` | 查询 | string | 否 | 数据库名或表名中的关键词。建议传入以缩小结果范围。 |

`kind` 为 `database` 或 `table`。

```json
{
  "success": true,
  "data": [
    { "name": "sales", "kind": "database", "database": "sales" },
    { "name": "orders", "kind": "table", "database": "sales" }
  ]
}
```
