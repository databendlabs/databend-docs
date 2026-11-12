---
title: "数据集成任务"
sidebar_label: "数据集成任务"
toc_max_heading_level: 4
---

调用前请先阅读[概览](./index.md)，了解鉴权、请求约定和错误处理。

数据集成任务从[数据源](./13-data-sources.md)读取数据并写入 Databend 表。任务类型由所用数据源的 [`serviceId`](./13-data-sources.md#service-id) 决定。除[获取同步指标](#get-sync-metrics)外，所有任务接口都是 v2 接口，需在请求体中传 `orgSlug`。

| 数据源（`serviceId`） | 任务对象 | 模式 |
|---|---|---|
| AWS S3（`1`） | [`awsS3File`](#awss3file) | 一次性加载文件。 |
| AWS SQS (S3)（`5`） | [`awsS3File`](#awss3file) | 持续加载：根据 S3 事件消息加载新文件。 |
| 阿里云 MNS (OSS)（`8`） | [`awsS3File`](#awss3file) | 持续加载：根据 OSS 事件消息加载新文件。 |
| Kafka（`7`） | [`kafkaConsumer`](#kafkaconsumerargs-task) | 持续消费：把 NDJSON 文件写入 stage `@kafka_consumer/<task-name>/`。 |
| MySQL（`2`） | [`mysqlTask`](#mysqltaskargs) | 快照、CDC，或先快照再 CDC。 |
| PostgreSQL（`3`） | [`postgresTask`](#postgrestaskargs) | 快照、CDC，或先快照再 CDC。 |
| TiDB（`6`） | [`tidbTask`](#tidbtaskargs) | 快照、CDC，或先快照再 CDC。 |

## 列出任务 {/* #list-tasks */}

`POST /api/v2/data-integration/tasks` · Read · Member

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `orgSlug` | string | 是 | 组织 ID。 |
| `page` | integer | 否 | 页码。默认：1。 |
| `perPage` | integer | 否 | 每页条数。默认：20。 |
| `serviceId` | integer（枚举） | 否 | 按数据源的 [Service ID](./13-data-sources.md#service-id) 过滤。 |
| `datasourceId` | integer | 否 | 按数据源 ID 过滤。 |

响应示例。`taskStatus` 是[任务状态](#task-status)，`lastRunData` 是[最近运行数据](#last-run-data)。

```json
{
  "success": true,
  "data": {
    "total": 1,
    "page": 1,
    "perPage": 20,
    "list": [
      {
        "id": 45,
        "name": "orders_sync",
        "orgId": "1024",
        "datasourceId": 12,
        "datasourceServiceId": 2,
        "kind": "mysql",
        "taskStatus": 2,
        "warehouse": "default",
        "database": "raw_shop",
        "tableName": "orders",
        "continuousIngestion": 1,
        "mysqlTask": { "syncMode": 3, "includeTables": ["orders"], "conflictKey": "id", "allowDelete": true },
        "lastRunId": "a9f3c2e1",
        "lastRunData": { "kind": "mysql", "status": 1, "mysqlLastRun": { "phase": "cdc", "rowsSynced": "1203344", "dataFressness": "4" } },
        "lastRunCreatedAt": "2026-11-09T07:00:00Z",
        "createdAccountEmail": "alice@example.com",
        "createdAt": "2026-11-01T02:00:00Z",
        "updatedAt": "2026-11-01T02:00:00Z"
      }
    ]
  }
}
```

`kind` 取值为 `awsS3`、`awsSqsS3`、`mnsOss`、`kafka`、`mysql`、`postgres`、`tidb` 之一。`serviceArgs`（如果有）是任务对象的 JSON 字符串副本，请读取 `mysqlTask` 等结构化字段。

## 获取任务 {/* #get-a-task */}

`POST /api/v2/data-integration/task/{taskId}/info` · Read · Member

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `taskId` | 路径 | integer | 是 | 任务 ID。 |
| `orgSlug` | 请求体 | string | 是 | 组织 ID。 |

响应：`data` 是一个任务对象，字段与[列出任务](#list-tasks)中的单项相同。SQS (S3)、MNS (OSS) 和 Kafka 任务还会通过 `runtimeConfig` 返回运行单元及其价格。

## 预览源数据 {/* #preview-source-data */}

`POST /api/v2/data-integration/service/preview` · Probe · Member

从数据源读取样例数据。创建任务前，可根据结果确定目标列。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `orgSlug` | string | 是 | 组织 ID。 |
| `datasourceId` | integer | 是 | 数据源 ID。 |
| 一个[任务对象](#task-objects) | object | 是 | [`awsS3File`](#awss3file)、[`kafkaConsumer`](#kafkaconsumerargs-task)、[`mysqlTask`](#mysqltaskargs)、[`postgresTask`](#postgrestaskargs) 或 [`tidbTask`](#tidbtaskargs)，需与数据源类型对应。 |

请求示例（S3 CSV 文件）：

```json
{
  "orgSlug": "<organization-id>",
  "datasourceId": 10,
  "awsS3File": {
    "region": "us-east-2",
    "filePath": "s3://acme-raw/orders/2026-11-*.csv",
    "fileType": 1,
    "fileCsvArgs": { "fieldDelimiter": ",", "recordDelimiter": "\n", "skipHeader": 1 }
  }
}
```

响应示例。`headerNames[i]` 和 `headerTypes[i]` 描述第 `i` 列，`sampleLines` 是原始样例行。

```json
{
  "success": true,
  "data": {
    "kind": "awsS3",
    "awsS3Files": [{ "region": "us-east-2", "filePath": "s3://acme-raw/orders/2026-11-01.csv", "fileType": 1, "fileSize": 10240 }],
    "headerNames": ["id", "amount", "created_at"],
    "headerTypes": ["BIGINT", "DOUBLE", "TIMESTAMP"],
    "sampleLines": ["1,19.9,2026-11-01 08:00:00"]
  }
}
```

## 列出运行单元 {/* #list-runtime-units */}

`POST /api/v2/data-integration/runtime-units` · Read · Member

返回持续消费类任务可用的计算单元及每小时价格。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `orgSlug` | string | 是 | 组织 ID。 |
| `runtimeKind` | string（枚举） | 是 | `sqs-s3-consumer`、`mns-oss-consumer` 或 `kafka-consumer`。 |

响应。列表在 `data` 中。

```json
{
  "success": true,
  "data": [
    { "runtimeKind": "kafka-consumer", "unit": "4XSmall", "displayName": "4XSmall", "default": true, "prices": [{ "currencyCode": "USD", "currencySymbol": "$", "pricePerHour": "<price>" }] },
    { "runtimeKind": "kafka-consumer", "unit": "3XSmall", "displayName": "3XSmall", "prices": [{ "currencyCode": "USD", "currencySymbol": "$", "pricePerHour": "<price>" }] }
  ]
}
```

可用单元：`4XSmall`（1 CPU、4 GiB，默认）、`3XSmall`（2 CPU、8 GiB）、`2XSmall`（4 CPU、16 GiB）。

## 创建任务 {/* #create-a-task */}

`POST /api/v2/data-integration/task/create` · Write · Member

创建的任务处于停止状态。如需启动，请调用[操作任务](#operate-tasks)并传 `operate: 1`。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `orgSlug` | string | 是 | 组织 ID。 |
| `name` | string | 是 | 在组织内唯一的任务名。 |
| `datasourceId` | integer | 是 | 数据源 ID。任务类型由数据源决定。 |
| `warehouse` | string | 视情况 | 向 Databend 写入数据的计算集群。除 Kafka 外的所有任务类型都必填。 |
| `database` | string | 视情况 | 目标数据库。S3、SQS (S3)、MNS (OSS)、PostgreSQL 任务，以及使用 `includeTables` 的 MySQL 任务必填。TiDB 任务和基于规则的 MySQL 任务根据源数据库名生成目标数据库。Kafka 任务不使用此字段。 |
| `tableName` | string | 视情况 | 目标表。S3、SQS (S3)、MNS (OSS)、PostgreSQL 任务，以及使用 `includeTables` 的 MySQL 任务必填。基于规则的 MySQL 任务必须留空。Kafka 任务不使用此字段。 |
| `tableFields` | [TableField](#tablefield)[] | 视情况 | 目标列。S3、SQS (S3) 和 MNS (OSS) 任务必填，每项都需要 `name` 和 `type`。 |
| `awsS3File` | [AwsS3File](#awss3file) | 视情况 | S3、SQS (S3) 和 MNS (OSS) 任务必填。S3（`serviceId` 1）任务还必须填写 `filePath`。 |
| `kafkaConsumer` | [KafkaConsumerArgs](#kafkaconsumerargs-task) | 视情况 | Kafka 任务必填。 |
| `mysqlTask` | [MysqlTaskArgs](#mysqltaskargs) | 视情况 | MySQL 任务必填。 |
| `postgresTask` | [PostgresTaskArgs](#postgrestaskargs) | 视情况 | PostgreSQL 任务必填。 |
| `tidbTask` | [TiDBTaskArgs](#tidbtaskargs) | 视情况 | TiDB 任务必填。 |
| `continuousIngestion` | integer | 否 | `0` 关闭，`1` 开启。服务端会根据数据源类型和[同步模式](#sync-mode)自动设置。 |
| `runtimeConfig` | object | 否 | `{ "unit": "4XSmall" }`。仅用于 SQS (S3)、MNS (OSS) 和 Kafka 任务。默认使用[列出运行单元](#list-runtime-units)中的默认单元。 |

请求示例（MySQL，先快照再 CDC，单表）：

```json
{
  "orgSlug": "<organization-id>",
  "name": "orders_sync",
  "datasourceId": 12,
  "warehouse": "<warehouse-name>",
  "database": "raw_shop",
  "tableName": "orders",
  "mysqlTask": {
    "syncMode": 3,
    "includeTables": ["orders"],
    "conflictKey": "id",
    "allowDelete": true
  }
}
```

请求示例（MySQL，使用[表规则](#table-rules)同步多个数据库）：

```json
{
  "orgSlug": "<organization-id>",
  "name": "shards_sync",
  "datasourceId": 12,
  "warehouse": "<warehouse-name>",
  "mysqlTask": {
    "syncMode": 3,
    "tableRules": ["shard_*.*", "!*.tmp_*"],
    "targetDatabasePrefix": "raw_",
    "allowDelete": true
  }
}
```

请求示例（Kafka）。该任务写入文件，不需要 `warehouse`、`database` 或 `tableName`。

```json
{
  "orgSlug": "<organization-id>",
  "name": "events_stream",
  "datasourceId": 14,
  "kafkaConsumer": {
    "topics": "orders,payments",
    "offsetReset": "EARLIEST",
    "dataFormat": "JSON"
  },
  "runtimeConfig": { "unit": "4XSmall" }
}
```

请求示例（AWS SQS (S3)，持续加载 CSV）：

```json
{
  "orgSlug": "<organization-id>",
  "name": "clicks_ingest",
  "datasourceId": 15,
  "warehouse": "<warehouse-name>",
  "database": "web",
  "tableName": "clicks",
  "tableFields": [
    { "name": "ts", "type": "TIMESTAMP", "nullable": false },
    { "name": "url", "type": "VARCHAR", "nullable": true }
  ],
  "awsS3File": {
    "fileType": 1,
    "fileCsvArgs": { "fieldDelimiter": ",", "recordDelimiter": "\n", "skipHeader": 1 },
    "copyIntoOnError": 1
  }
}
```

响应。ID 在顶层。

```json
{ "success": true, "id": 45 }
```

## 更新任务 {/* #update-a-task */}

`POST /api/v2/data-integration/task/{taskId}/update` · Write · Creator or Admin

替换任务配置。请求体与[创建任务](#create-a-task)相同，另外在路径中传 `taskId`。请传全部字段，而不只是修改过的字段。

规则：

- 任务必须处于停止状态。请先通过[操作任务](#operate-tasks)停止任务。
- 不能修改数据源类型。新的 `datasourceId` 必须与原数据源的 `serviceId` 相同。

响应：`{ "success": true }`。

## 操作任务 {/* #operate-tasks */}

`POST /api/v2/data-integration/task/operate` · Write · Creator or Admin

启动、停止或删除一个或多个任务。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `orgSlug` | string | 是 | 组织 ID。 |
| `taskIds` | integer[] | 是 | 任务 ID 列表。 |
| `operate` | integer（枚举） | 是 | [操作类型](#operate-type)。 |

```json
{ "orgSlug": "<organization-id>", "taskIds": [45], "operate": 1 }
```

响应：`{ "success": true }`。HTTP 400 表示任务当前状态不允许该操作，例如 `task #45 orders_sync can only start from stopped (current: TaskRunning)`。服务端按传入顺序逐个处理，遇到第一个错误即停止，之前已处理的任务保持新状态。请根据 `message` 判断是哪个任务失败。

## 列出任务运行记录 {/* #list-task-runs */}

`POST /api/v2/data-integration/task/runs` · Read · Member

按从新到旧返回任务运行记录。任务每次启动都会产生一次运行。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `orgSlug` | string | 是 | 组织 ID。 |
| `taskId` | integer | 否 | 按任务 ID 过滤。不传时返回组织内所有任务的运行记录。 |
| `page` | integer | 否 | 页码。默认：1。 |
| `perPage` | integer | 否 | 每页条数。默认：20。 |

响应示例。`status` 是[任务运行结果](#task-run-status)。`responseData` 是该次运行的[最近运行数据](#last-run-data)。`taskSnapshot` 是 JSON 字符串，记录运行时的任务配置。

```json
{
  "success": true,
  "data": {
    "total": 3,
    "page": 1,
    "perPage": 20,
    "list": [
      {
        "id": 902,
        "orgId": "1024",
        "taskId": 45,
        "taskName": "orders_sync",
        "executeId": "a9f3c2e1",
        "status": 1,
        "responseData": { "kind": "mysql", "status": 1, "mysqlLastRun": { "phase": "cdc", "tablesTotal": 1, "tablesCompleted": 1, "rowsSynced": "1203344" } },
        "createdAt": "2026-11-09T07:00:00Z",
        "updatedAt": "2026-11-09T08:00:00Z"
      }
    ]
  }
}
```

## 获取任务运行详情 {/* #get-task-run-details */}

`POST /api/v2/data-integration/task/runs/{executeId}` · Read · Member

返回一次运行的状态上报记录。

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `executeId` | 路径 | string | 是 | 运行记录的 `executeId`。 |
| `orgSlug` | 请求体 | string | 是 | 组织 ID。 |

响应示例。`requestData` 是 JSON 字符串，记录启动这次运行的请求。

```json
{
  "success": true,
  "data": {
    "total": 1,
    "list": [
      {
        "id": 5521,
        "taskId": 45,
        "executeId": "a9f3c2e1",
        "status": 3,
        "hostname": "dataintegration-worker-0",
        "responseCode": 500,
        "responseData": { "kind": "mysql", "status": 3, "error": "Access denied for user 'sync'@'203.0.113.10'" },
        "createdAt": "2026-11-09T07:00:05Z"
      }
    ]
  }
}
```

## 列出 MySQL 快照的表级结果 {/* #list-mysql-snapshot-table-results */}

`POST /api/v2/data-integration/task/runs/{executeId}/mysql/snapshot/tables` · Read · Member

返回一次 MySQL 运行中快照阶段每张表的结果。运行记录中 `mysqlLastRun.tableResultsAvailable` 为 `true` 时才有结果。

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `executeId` | 路径 | string | 是 | 运行记录的 `executeId`。 |
| `orgSlug` | 请求体 | string | 是 | 组织 ID。 |
| `status` | 请求体 | integer（枚举） | 否 | 按 [MySQL 快照表状态](#mysql-snapshot-table-status)过滤。 |
| `page` | 请求体 | integer | 否 | 页码。默认：1。 |
| `perPage` | 请求体 | integer | 否 | 每页条数。默认：20。最大：100，超过时返回 HTTP 400。 |

```json
{
  "success": true,
  "data": {
    "total": 2,
    "page": 1,
    "perPage": 20,
    "list": [
      { "database": "shop", "table": "orders", "fullName": "shop.orders", "status": 1, "rowsRead": "1200000" },
      { "database": "shop", "table": "logs", "fullName": "shop.logs", "status": 3, "error": "no primary key and no conflictKey" }
    ]
  }
}
```

## 列出 TiDB 全量同步的表级结果 {/* #list-tidb-full-sync-table-results */}

`POST /api/v2/data-integration/task/runs/{executeId}/tidb/full-sync/tables` · Read · Member

与[列出 MySQL 快照的表级结果](#list-mysql-snapshot-table-results)相同，适用于 TiDB 运行的全量同步阶段。`status` 是 [TiDB 全量同步表状态](#tidb-full-sync-table-status)。每项包含 `totalChunks` 和 `completedChunks`，没有 `rowsRead`。

```json
{
  "success": true,
  "data": {
    "total": 1,
    "list": [
      { "database": "app", "table": "users", "fullName": "app.users", "status": 1, "totalChunks": 12, "completedChunks": 12 }
    ]
  }
}
```

## 获取 TiDB 任务指标 {/* #get-tidb-task-metrics */}

`POST /api/v2/data-integration/task/{taskId}/metrics` · Read · Member

返回 TiDB 任务（`serviceId` 6）在指定时间范围内的固定同步指标。

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `taskId` | 路径 | integer | 是 | TiDB 任务的 ID。 |
| `orgSlug` | 请求体 | string | 是 | 组织 ID。 |
| `from` | 请求体 | string | 是 | 开始时间，RFC 3339，必须早于 `to`。 |
| `to` | 请求体 | string | 是 | 结束时间，RFC 3339，与 `from` 相差不超过 24 小时。 |
| `stepSeconds` | 请求体 | integer | 是 | 数据点间隔秒数，范围 30 到 3600。整个时间范围最多 1440 个点。 |

请求示例：

```json
{ "orgSlug": "<organization-id>", "from": "2026-11-09T07:00:00Z", "to": "2026-11-09T08:00:00Z", "stepSeconds": 60 }
```

响应示例。`time` 的值是 Unix 秒。值为 `null` 表示该时间点没有采样。`latest` 是最后一个点的值，最后一个点没有采样时不返回。

```json
{
  "success": true,
  "data": {
    "resultType": "matrix",
    "time": [1762671600, 1762671660],
    "series": [
      { "metric": "cdc_freshness_seconds", "time": [1762671600, 1762671660], "value": [4, 5], "latest": 5 },
      { "metric": "cdc_merged_rows_per_second", "time": [1762671600, 1762671660], "value": [120.5, null] }
    ]
  }
}
```

指标名：

| 指标 | 说明 |
|---|---|
| `cdc_freshness_seconds` | 最近一次成功合并时的延迟，单位秒。 |
| `cdc_source_rows_per_second` | 每秒源端变更事件数。 |
| `cdc_merged_rows_per_second` | 每秒合并到 Databend 的行数。 |
| `cdc_table_healthy_percent` | 没有错误的 CDC 表占比。 |
| `cdc_error_tables` | 处于错误状态的 CDC 表数。 |
| `cdc_backoff_tables` | 等待重试的 CDC 表数。 |
| `cdc_permanent_error` | CDC 运行出现永久性错误时为 `1`。 |
| `cdc_running` | CDC 正在运行时为 `1`。 |
| `cdc_sample_age_seconds` | 最近一次指标采样距今的时间。 |
| `cdc_run_success_percent` | 最近 24 小时 CDC 运行的成功率。 |
| `snapshot_rows_per_second` | 每秒加载的快照行数。 |
| `snapshot_table_success_percent` | 没有错误的快照表占比。 |
| `snapshot_progress_percent` | 快照进度。 |
| `snapshot_running` | 快照正在运行时为 `1`。 |
| `snapshot_run_success_percent` | 最近 24 小时快照运行的成功率。 |

## 获取同步指标 {/* #get-sync-metrics */}

`GET /api/v1/orgs/{orgSlug}/tenant/metrics/{queryType}` · Read · Member

返回 MySQL 或 TiDB 任务的同步指标。此接口即 `queryType` 设为 `MySQLSync` 或 `TiDBSync` 的[获取监控指标](./05-organization-and-metrics.md#get-metrics)接口。MySQL 任务请使用此接口；TiDB 任务也可以使用[获取 TiDB 任务指标](#get-tidb-task-metrics)。

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `orgSlug` | 路径 | string | 是 | 组织 ID。 |
| `queryType` | 路径 | string（枚举） | 是 | `MySQLSync` 或 `TiDBSync`，必须与任务类型一致。 |
| `taskId` | 查询 | integer | 是 | 任务 ID。 |
| `from` | 查询 | string | 是 | 开始时间，RFC 3339。 |
| `to` | 查询 | string | 是 | 结束时间，RFC 3339，与 `from` 相差不超过 24 小时。 |
| `step` | 查询 | string | 是 | 时长，范围 `30s` 到 `1h`，必须是整秒。整个时间范围最多 1440 个点。 |

```bash
curl --get 'https://api.databend.cn/api/v1/orgs/<organization-id>/tenant/metrics/MySQLSync' \
  --header 'X-DATABENDCLOUD-TOKEN: <api-token>' \
  --data-urlencode 'taskId=<task-id>' \
  --data-urlencode 'from=2026-11-09T07:00:00Z' \
  --data-urlencode 'to=2026-11-09T08:00:00Z' \
  --data-urlencode 'step=60s'
```

响应结构与[获取监控指标](./05-organization-and-metrics.md#get-metrics)相同，指标名与[获取 TiDB 任务指标](#get-tidb-task-metrics)相同。MySQL 任务还会返回 `cdc_source_lag_seconds`（binlog 读取落后源端的时间）和 `cdc_skipped_tables`，但不返回 `cdc_error_tables` 和 `cdc_backoff_tables`。

## 类型 {/* #types */}

### 任务状态 {/* #task-status */}

| 取值 | 名称 |
|---|---|
| `1` | `TaskStopped` |
| `2` | `TaskRunning` |

### 任务运行结果 {/* #task-run-status */}

| 取值 | 名称 |
|---|---|
| `1` | `TaskRunRunning` |
| `2` | `TaskRunSuccess` |
| `3` | `TaskRunFail` |

### 操作类型 {/* #operate-type */}

| 取值 | 名称 | 效果 |
|---|---|---|
| `1` | `Start` | 启动已停止的任务。 |
| `2` | `Stop` | 停止正在运行的任务。已停止的任务保持停止。 |
| `3` | `Drop` | 删除已停止的任务。任务正在运行时返回 HTTP 400。 |
| `4` | `Resume` | 启动已停止的任务。MySQL 归档任务会保留当前时间窗口，失败的窗口会重新执行。 |
| `5` | `Cancel` | 停止正在运行的任务。任务未在运行时返回 HTTP 400。 |

### 同步模式 {/* #sync-mode */}

`mysqlTask.syncMode`、`postgresTask.syncMode` 和 `tidbTask.syncMode` 使用相同的取值。

| 取值 | 模式 | `continuousIngestion` |
|---|---|---|
| `1` | 仅快照。 | `0` |
| `2` | 仅 CDC。 | `1` |
| `3` | 先快照，再 CDC。 | `1` |

### 文件类型 {/* #file-type */}

| 取值 | 格式 |
|---|---|
| `1` | CSV |
| `2` | Parquet |
| `3` | NDJSON |

### 加载出错处理 {/* #copy-on-error */}

`awsS3File.copyIntoOnError`：

| 取值 | 效果 |
|---|---|
| `1` | `CONTINUE`：跳过出错的行，继续加载。 |
| `2` | `ABORT`：遇到第一个错误时停止加载。 |

### MySQL 归档模式 {/* #mysql-archive-mode */}

`mysqlTask.archiveSchedule.archiveMode`：`1` 按天，`2` 按周，`3` 按月。

### MySQL 快照表状态 {/* #mysql-snapshot-table-status */}

| 取值 | 名称 | 含义 |
|---|---|---|
| `1` | `Success` | 表的所有行都已加载。 |
| `2` | `Failed` | 所有重试之后仍然失败。 |
| `3` | `Skipped` | 表没有可用的合并键，本次运行跳过了它。 |
| `4` | `Pending` | 运行在快照处理到该表之前就结束了。 |

### TiDB 全量同步表状态 {/* #tidb-full-sync-table-status */}

`1` 成功，`2` 失败。

### 任务对象 {/* #task-objects */}

#### TableField {/* #tablefield */}

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `name` | string | 是 | 列名。 |
| `type` | string | 是 | Databend 数据类型，例如 `VARCHAR`、`BIGINT`、`TIMESTAMP` 或 `VARIANT`。 |
| `nullable` | boolean | 否 | 该列是否允许 `NULL`。 |
| `defaultValue` | string | 否 | 默认值表达式。 |

#### AwsS3File {/* #awss3file */}

用于 S3、SQS (S3) 和 MNS (OSS) 任务。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `region` | string | 否 | Bucket 所在地域，例如 `us-east-2`。 |
| `filePath` | string | 视情况 | 要加载的文件。S3（`serviceId` 1）任务必填，支持通配符：`s3://bucket/path/2026-11-*.csv`。SQS (S3) 和 MNS (OSS) 任务从事件消息中获取文件。 |
| `fileType` | integer（枚举） | 是 | [文件类型](#file-type)。创建任务时服务端不会校验此字段，请务必设置。 |
| `fileCsvArgs` | object | CSV 时必填 | [FileCsvArgs](#filecsvargs)。 |
| `copyIntoOnError` | integer（枚举） | 否 | [加载出错处理](#copy-on-error)。 |
| `copyIntoPurge` | boolean | 否 | 加载成功后删除源文件。 |
| `copyIntoForce` | boolean | 否 | 即使文件之前已加载过，也重新加载。 |

#### FileCsvArgs {/* #filecsvargs */}

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `fieldDelimiter` | string | 否 | 默认：`,`。 |
| `recordDelimiter` | string | 否 | 默认：`\n`。 |
| `compression` | string | 否 | 默认：`None`。其他取值与 Databend 文件格式选项 `COMPRESSION` 相同，例如 `GZIP` 或 `AUTO`。 |
| `skipHeader` | integer | 否 | 要跳过的表头行数。 |

#### KafkaConsumerArgs（任务） {/* #kafkaconsumerargs-task */}

Kafka 配置中属于任务的部分。连接配置在[数据源](./13-data-sources.md#kafkaconsumer-serviceid-7)上。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `topics` | string | 是 | Topic 列表，用逗号分隔。 |
| `dataFormat` | string | 否 | 只支持 `JSON`。默认：`JSON`。 |
| `offsetReset` | string（枚举） | 否 | `EARLIEST` 或 `LATEST`。默认：`LATEST`。 |
| `maxBatchSizeBytes` | integer | 否 | 单个输出文件的最大字节数。默认：`16777216`。 |
| `maxBatchWaitSeconds` | integer | 否 | 写出一个文件前的最长等待时间。默认：`60`。 |

#### MysqlTaskArgs {/* #mysqltaskargs */}

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `syncMode` | integer（枚举） | 是 | [同步模式](#sync-mode)。 |
| `includeTables` | string[] | 视情况 | 数据源默认数据库中的表。不使用 `tableRules` 时必填。 |
| `excludeTables` | string[] | 否 | 要排除的表。只能与 `includeTables` 一起使用。 |
| `tableRules` | string[] | 视情况 | 作用于一个或多个数据库的[表规则](#table-rules)，最多 50 条。不能与 `includeTables`、`excludeTables` 或 `archiveSchedule` 同时使用。请求中的 `tableName` 必须为空。 |
| `conflictKey` | string | 视情况 | 合并键列。使用 `includeTables` 且为 CDC 模式（`2`、`3`）时必填。使用 `tableRules` 时，每张表使用自己的主键，`conflictKey` 是可选的覆盖值，用于没有复合主键的表。 |
| `allowDelete` | boolean | 否 | 把源端 `DELETE` 事件同步到目标表。 |
| `snapshotWhereCondition` | string | 否 | 过滤快照行的 SQL 条件，仅用于 syncMode `1`。最多 10,000 个字符，不能包含 `DROP`、`DELETE`、`UPDATE`、`INSERT`、`TRUNCATE`、`EXEC`、`EXECUTE`、`CREATE`、`ALTER`、`GRANT` 或 `REVOKE`。 |
| `archiveSchedule` | object | 否 | 定期归档，见下表。只能与 `includeTables` 一起使用。 |
| `maxMatchedTables` | integer | 否 | `tableRules` 最多可匹配的表数。`0` 表示使用服务端默认值（5000）。 |
| `targetDatabasePrefix`、`targetDatabaseSuffix`、`targetTablePrefix`、`targetTableSuffix` | string | 否 | 基于规则的任务使用的名称前后缀，只能包含字母、数字和 `_`。目标数据库 = 前缀 + 源数据库名 + 后缀，目标表 = 前缀 + 源表名 + 后缀。 |
| `mergeIntervalSeconds`、`rawTableTtlHours`、`checkpointIntervalSeconds`、`pipelineBufferSize`、`pipelineBatchSize`、`pipelineFlushIntervalSeconds`、`pipelineWorkers`、`batchSize` | integer | 否 | 高级调优参数。不传或传 `0` 表示使用服务端默认值。 |

`archiveSchedule` 字段：

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `enabled` | boolean | 是 | 是否开启归档。 |
| `cronExpression` | string | 开启时必填 | Cron 表达式，例如 `0 1 * * *`。 |
| `archiveMode` | integer（枚举） | 开启时必填 | [MySQL 归档模式](#mysql-archive-mode)。 |
| `timeColumnName` | string | `autoGenerateCondition` 时必填 | 时间列。只能包含字母、数字和 `_`，最多 64 个字符。 |
| `autoGenerateCondition` | boolean | 否 | 根据 `timeColumnName` 自动生成时间窗口条件。 |
| `timezone` | string | 否 | IANA 时区，例如 `Asia/Shanghai`。默认：UTC。 |

#### PostgresTaskArgs {/* #postgrestaskargs */}

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `syncMode` | integer（枚举） | 是 | [同步模式](#sync-mode)。 |
| `includeTables` | string[] | 是 | 表列表，例如 `public.orders`。 |
| `excludeTables` | string[] | 否 | 要排除的表。 |
| `conflictKey` | string | 视情况 | 合并键列。syncMode `2` 和 `3` 必填。 |
| `allowDelete` | boolean | 否 | 把源端 `DELETE` 事件同步到目标表。 |
| `snapshotWhereCondition` | string | 否 | 规则与 [MysqlTaskArgs](#mysqltaskargs) 相同，仅用于 [syncMode](#sync-mode) `1`。 |
| 调优参数 | integer | 否 | 与 [MysqlTaskArgs](#mysqltaskargs) 相同。 |

#### TiDBTaskArgs {/* #tidbtaskargs */}

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `syncMode` | integer（枚举） | 是 | [同步模式](#sync-mode)。 |
| `dumplingS3Prefix` | string | 视情况 | Dumpling 导出的前缀。syncMode `1` 和 `3` 必填。 |
| `changefeedS3Prefix` | string | 视情况 | TiCDC changefeed 写入的前缀。syncMode `2` 和 `3` 必填。创建 changefeed 时，sink URI 中需设置 `enable-tidb-extension=true`。 |
| `tableRules` | string[] | 视情况 | [表规则](#table-rules)，最多 50 条。数据源没有配置 `database` 时必填。不能与 `includeTables` 或 `excludeTables` 同时使用。 |
| `includeTables`、`excludeTables` | string[] | 否 | 数据源默认数据库中的表。 |
| `maxMatchedTables` | integer | 否 | 任务最多可同步的表数。`0` 表示使用服务端默认值（5000）。 |
| `targetDatabasePrefix`、`targetDatabaseSuffix`、`targetTablePrefix`、`targetTableSuffix` | string | 否 | 名称前后缀，只能包含字母、数字和 `_`。不设置时目标名称与源名称相同。 |
| `conflictKey` | string | 否 | 合并键列。 |
| `allowDelete` | boolean | 否 | 把源端 `DELETE` 事件同步到目标表。 |
| `textToVariant` | boolean | 否 | 把 `TEXT` 列映射为 `VARIANT` 而不是 `STRING`。请在首次同步前设置，值必须是合法 JSON。 |
| `dumplingEscapeBackslash` | boolean | 视情况 | 必须与 Dumpling 导出时的 `--escape-backslash` 选项一致。非空且含文本列的导出需要设为 `false`，并使用 `--escape-backslash=false --csv-output-dialect=snowflake` 导出。 |
| `dumplingCsvSeparator` | string | 否 | 导出文件的 CSV 分隔符。 |
| `dumplingCsvNull` | string | 否 | 导出文件中表示 `NULL` 的标记。 |
| `dumplingCsvSkipHeader` | integer | 否 | 每个文件的表头行数。不传时使用 Dumpling 默认值（一行表头）。 |
| `dumplingAutoCreateTable` | boolean | 否 | 根据导出的 schema 文件创建目标表。 |
| `dumplingOnError` | string | 否 | 快照阶段 `COPY INTO` 的 `ON_ERROR` 选项。 |
| `dumplingPurge` | boolean | 否 | 加载成功后删除导出文件。 |
| `dumplingCopyBatchFiles` | integer | 否 | 每次 `COPY` 处理的文件数，范围 `0` 到 `64`。`0` 表示 16。 |
| `pollIntervalSeconds`、`batchFileCount`、`mergeIntervalSeconds`、`tableParallelism` | integer | 否 | 高级调优参数，不能为负数。`0` 表示使用服务端默认值。 |
| `errorIntegration` | string | 否 | Databend Cloud 不支持，请不要设置。传入值时服务端返回 HTTP 400。 |

#### 表规则 {/* #table-rules */}

`tableRules` 使用 TiCDC 过滤器语法。每条规则的格式为 `schemaPattern.tablePattern`。以 `!` 开头的规则表示排除。

| 规则 | 匹配 |
|---|---|
| `app.orders` | 单张表。 |
| `shard_*.*` | 所有名称以 `shard_` 开头的数据库中的所有表。 |
| `~^shard_\d+$.~^t` | 两侧都使用正则表达式。 |
| `!*.tmp_*` | 排除名称以 `tmp_` 开头的表。 |

服务端从最后一条规则往前匹配，第一条匹配上的规则生效。没有匹配任何规则的对象会被排除。如果列表中只有 `!` 规则，开头会隐含一条 `*.*`。创建任务前，请用[预览 MySQL 表规则](./13-data-sources.md#preview-mysql-table-rules)或[预览 TiDB 表规则](./13-data-sources.md#preview-tidb-table-rules)确认匹配结果。

### 最近运行数据 {/* #last-run-data */}

任务上的 `lastRunData` 和运行记录上的 `responseData` 结构如下：

| 字段 | 类型 | 说明 |
|---|---|---|
| `kind` | string | 任务类型，例如 `mysql`。 |
| `status` | integer（枚举） | [任务运行结果](#task-run-status)。 |
| `error` | string | 运行失败时的错误信息。 |
| `warning` | string | 最近一条未中断运行的警告，例如跳过了某个文件。 |
| `mysqlLastRun`、`postgresLastRun`、`tidbLastRun`、`kafkaLastRun`、`awsS3LastRun`、`awsSqsS3LastRun` | object | 对应任务类型的进度详情，只会出现其中一个。 |

常用进度字段：

| 对象 | 字段 |
|---|---|
| `mysqlLastRun` | `phase`（`snapshot` 或 `cdc`）、`rowsSynced`、`insertCount`、`updateCount`、`deleteCount`、`mergedRows`、`tablesTotal`、`tablesCompleted`、`tablesError`、`tablesSkipped`、`currentTable`、`rowsPerSecond`、`dataFressness`（秒）、`sourceLagSeconds`、`lastError`、`lastWarning`、`tableResultsAvailable` |
| `postgresLastRun` | `lsn`、`snapshotCompleted`、`rowsSynced`、`insertCount`、`updateCount`、`deleteCount`、`lastMessage` |
| `tidbLastRun` | `fullSyncPhase`、`fullSyncCompleted`、`rowsSynced`、`bytesSynced`、`chunksTotal`、`chunksCompleted`、`tablesTotal`、`tablesActive`、`tablesError`、`tablesBackoff`、`mergedRows`、`dataFressness`（秒）、`appliedResolvedTS`、`slowestTable`、`lastError`、`lastWarning`、`tableResultsAvailable` |
| `kafkaLastRun` | `windowStart`、`windowEnd`、`recordsReceived`、`recordsWritten`、`recordsFailed`、`bytesReceived`、`bytesWritten`、`errorCount` |
| `awsS3LastRun`、`awsSqsS3LastRun` | `bucket`、`object`、`total`、`success`、`fail` |

64 位计数器以 JSON 字符串返回。`dataFressness` 保留原有拼写。
