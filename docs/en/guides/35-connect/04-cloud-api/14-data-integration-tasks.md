---
title: "Data Integration Tasks"
sidebar_label: "Data Integration Tasks"
toc_max_heading_level: 4
---

Read the [Overview](./index.md) first for authentication, request conventions, and errors.

A data integration task reads from a [data source](./13-data-sources.md) and writes to a Databend table. The task type comes from the `serviceId` of its data source. All task endpoints are v2, except [Get Sync Metrics](#get-sync-metrics). Send `orgSlug` in the body.

| Source (`serviceId`) | Task object | Mode |
|---|---|---|
| AWS S3 (`1`) | `awsS3File` | One-time file load. |
| AWS SQS (S3) (`5`) | `awsS3File` | Continuous: loads new files from S3 event messages. |
| Alibaba Cloud MNS (OSS) (`8`) | `awsS3File` | Continuous: loads new files from OSS event messages. |
| Kafka (`7`) | `kafkaConsumer` | Continuous: writes NDJSON files to the stage `@kafka_consumer/<task-name>/`. |
| MySQL (`2`) | `mysqlTask` | Snapshot, CDC, or snapshot then CDC. |
| PostgreSQL (`3`) | `postgresTask` | Snapshot, CDC, or snapshot then CDC. |
| TiDB (`6`) | `tidbTask` | Snapshot, CDC, or snapshot then CDC. |

## List Tasks

`POST /api/v2/data-integration/tasks` · Read · Member

| Field | Type | Required | Description |
|---|---|---|---|
| `orgSlug` | string | Yes | Organization ID. |
| `page` | integer | No | Page number. Default: 1. |
| `perPage` | integer | No | Rows per page. Default: 20. |
| `serviceId` | integer (enum) | No | Filter by the [Service ID](./13-data-sources.md#service-id) of the data source. |
| `datasourceId` | integer | No | Filter by data source ID. |

Response example. `taskStatus` is a [task status](#task-status). `lastRunData` is the [last run data](#last-run-data).

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

`kind` is one of `awsS3`, `awsSqsS3`, `mnsOss`, `kafka`, `mysql`, `postgres`, `tidb`. `serviceArgs` (if present) is a JSON string copy of the task object. Read the typed object (`mysqlTask` and so on) instead.

## Get a Task

`POST /api/v2/data-integration/task/{taskId}/info` · Read · Member

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `taskId` | path | integer | Yes | Task ID. |
| `orgSlug` | body | string | Yes | Organization ID. |

Response: `data` is one task object with the same fields as one item of [List Tasks](#list-tasks). For SQS (S3), MNS (OSS), and Kafka tasks, `runtimeConfig` shows the runtime unit and its price.

## Preview Source Data

`POST /api/v2/data-integration/service/preview` · Probe · Member

Reads a sample from the source. Use the result to choose the target columns before you create a task.

| Field | Type | Required | Description |
|---|---|---|---|
| `orgSlug` | string | Yes | Organization ID. |
| `datasourceId` | integer | Yes | Data source ID. |
| One task object | object | Yes | `awsS3File`, `kafkaConsumer`, `mysqlTask`, `postgresTask`, or `tidbTask`. Use the object that matches the data source. |

Request example (S3 CSV files):

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

Response example. `headerNames[i]` and `headerTypes[i]` describe column `i`. `sampleLines` are raw sample rows.

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

## List Runtime Units

`POST /api/v2/data-integration/runtime-units` · Read · Member

Returns the compute units that a continuous consumer task can use, and their price per hour.

| Field | Type | Required | Description |
|---|---|---|---|
| `orgSlug` | string | Yes | Organization ID. |
| `runtimeKind` | string (enum) | Yes | `sqs-s3-consumer`, `mns-oss-consumer`, or `kafka-consumer`. |

Response. The list is in `data`.

```json
{
  "success": true,
  "data": [
    { "runtimeKind": "kafka-consumer", "unit": "4XSmall", "displayName": "4XSmall", "default": true, "prices": [{ "currencyCode": "USD", "currencySymbol": "$", "pricePerHour": "<price>" }] },
    { "runtimeKind": "kafka-consumer", "unit": "3XSmall", "displayName": "3XSmall", "prices": [{ "currencyCode": "USD", "currencySymbol": "$", "pricePerHour": "<price>" }] }
  ]
}
```

Units: `4XSmall` (1 CPU, 4 GiB, default), `3XSmall` (2 CPU, 8 GiB), `2XSmall` (4 CPU, 16 GiB).

## Create a Task

`POST /api/v2/data-integration/task/create` · Write · Member

Creates a task in the stopped state. To start it, call [Operate Tasks](#operate-tasks) with `operate: 1`.

| Field | Type | Required | Description |
|---|---|---|---|
| `orgSlug` | string | Yes | Organization ID. |
| `name` | string | Yes | Unique task name in the organization. |
| `datasourceId` | integer | Yes | Data source ID. The data source decides the task type. |
| `warehouse` | string | Depends | Warehouse that writes to Databend. Required for all task types except Kafka. |
| `database` | string | Depends | Target database. Required for S3, SQS (S3), MNS (OSS), PostgreSQL, and MySQL tasks that use `includeTables`. TiDB tasks and rule-based MySQL tasks derive the target database from the source database name. Kafka tasks do not use it. |
| `tableName` | string | Depends | Target table. Required for S3, SQS (S3), MNS (OSS), PostgreSQL, and MySQL tasks that use `includeTables`. Must be empty for rule-based MySQL tasks. Kafka tasks do not use it. |
| `tableFields` | [TableField](#tablefield)[] | Depends | Target columns. Required for S3, SQS (S3), and MNS (OSS) tasks. Each item needs `name` and `type`. |
| `awsS3File` | [AwsS3File](#awss3file) | Depends | Required for S3, SQS (S3), and MNS (OSS) tasks. `filePath` is required for S3 (`serviceId` 1). |
| `kafkaConsumer` | [KafkaConsumerArgs](#kafkaconsumerargs-task) | Depends | Required for Kafka tasks. |
| `mysqlTask` | [MysqlTaskArgs](#mysqltaskargs) | Depends | Required for MySQL tasks. |
| `postgresTask` | [PostgresTaskArgs](#postgrestaskargs) | Depends | Required for PostgreSQL tasks. |
| `tidbTask` | [TiDBTaskArgs](#tidbtaskargs) | Depends | Required for TiDB tasks. |
| `continuousIngestion` | integer | No | `0` off, `1` on. The server sets it from the source type and sync mode. |
| `runtimeConfig` | object | No | `{ "unit": "4XSmall" }`. Only for SQS (S3), MNS (OSS), and Kafka tasks. Default: the default unit of [List Runtime Units](#list-runtime-units). |

Request example (MySQL, snapshot then CDC, one table):

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

Request example (MySQL, several databases with table rules):

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

Request example (Kafka). The task writes files. It does not need `warehouse`, `database`, or `tableName`.

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

Request example (AWS SQS (S3), continuous CSV load):

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

Response. The ID is at the top level.

```json
{ "success": true, "id": 45 }
```

## Update a Task

`POST /api/v2/data-integration/task/{taskId}/update` · Write · Creator or Admin

Replaces the task settings. The body is the same as [Create a Task](#create-a-task), plus `taskId` in the path. Send all fields, not only the changed ones.

Rules:

- The task must be stopped. Stop it first with [Operate Tasks](#operate-tasks).
- You cannot change the source type. The new `datasourceId` must have the same `serviceId`.

Response: `{ "success": true }`.

## Operate Tasks

`POST /api/v2/data-integration/task/operate` · Write · Creator or Admin

Starts, stops, or deletes one or more tasks.

| Field | Type | Required | Description |
|---|---|---|---|
| `orgSlug` | string | Yes | Organization ID. |
| `taskIds` | integer[] | Yes | Task IDs. |
| `operate` | integer (enum) | Yes | [Operate type](#operate-type). |

```json
{ "orgSlug": "<organization-id>", "taskIds": [45], "operate": 1 }
```

Response: `{ "success": true }`. HTTP 400 means that the task state does not allow the operation, for example `task #45 orders_sync can only start from stopped (current: TaskRunning)`. The server operates the tasks in the given order and stops at the first error. The tasks before the failed one keep their new state. Read `message` to find the failed task.

## List Task Runs

`POST /api/v2/data-integration/task/runs` · Read · Member

Returns task runs, from the newest run. A run starts each time the task starts.

| Field | Type | Required | Description |
|---|---|---|---|
| `orgSlug` | string | Yes | Organization ID. |
| `taskId` | integer | No | Filter by task ID. Without it, the response lists the runs of all tasks in the organization. |
| `page` | integer | No | Page number. Default: 1. |
| `perPage` | integer | No | Rows per page. Default: 20. |

Response example. `status` is a [task run status](#task-run-status). `responseData` is the [last run data](#last-run-data) of the run. `taskSnapshot` is a JSON string with the task settings at run time.

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

## Get Task Run Details

`POST /api/v2/data-integration/task/runs/{executeId}` · Read · Member

Returns the status reports of one run.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `executeId` | path | string | Yes | `executeId` of a run. |
| `orgSlug` | body | string | Yes | Organization ID. |

Response example. `requestData` is a JSON string with the request that started the run.

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

## List MySQL Snapshot Table Results

`POST /api/v2/data-integration/task/runs/{executeId}/mysql/snapshot/tables` · Read · Member

Returns the result of each table in the snapshot of a MySQL run. Results are available when the run has `mysqlLastRun.tableResultsAvailable: true`.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `executeId` | path | string | Yes | `executeId` of a run. |
| `orgSlug` | body | string | Yes | Organization ID. |
| `status` | body | integer (enum) | No | Filter by [MySQL snapshot table status](#mysql-snapshot-table-status). |
| `page` | body | integer | No | Page number. Default: 1. |
| `perPage` | body | integer | No | Rows per page. Default: 20. Maximum: 100. A larger value returns HTTP 400. |

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

## List TiDB Full Sync Table Results

`POST /api/v2/data-integration/task/runs/{executeId}/tidb/full-sync/tables` · Read · Member

Same as [List MySQL Snapshot Table Results](#list-mysql-snapshot-table-results), for the full sync of a TiDB run. `status` is a [TiDB full sync table status](#tidb-full-sync-table-status). Each item has `totalChunks` and `completedChunks` instead of `rowsRead`.

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

## Get TiDB Task Metrics

`POST /api/v2/data-integration/task/{taskId}/metrics` · Read · Member

Returns fixed sync metrics of a TiDB task (`serviceId` 6) over a time range.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `taskId` | path | integer | Yes | ID of a TiDB task. |
| `orgSlug` | body | string | Yes | Organization ID. |
| `from` | body | string | Yes | Start time, RFC 3339. Must be before `to`. |
| `to` | body | string | Yes | End time, RFC 3339. Not more than 24 hours after `from`. |
| `stepSeconds` | body | integer | Yes | Seconds between points, from 30 to 3600. The range can have at most 1440 points. |

Request example:

```json
{ "orgSlug": "<organization-id>", "from": "2026-11-09T07:00:00Z", "to": "2026-11-09T08:00:00Z", "stepSeconds": 60 }
```

Response example. `time` values are Unix seconds. A `null` value means that there is no sample at that time. `latest` is the value of the last point, and it is missing if that point has no sample.

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

Metric names:

| Metric | Description |
|---|---|
| `cdc_freshness_seconds` | Delay of the last successful merge, in seconds. |
| `cdc_source_rows_per_second` | Source change events per second. |
| `cdc_merged_rows_per_second` | Rows merged into Databend per second. |
| `cdc_table_healthy_percent` | Percent of CDC tables without errors. |
| `cdc_error_tables` | CDC tables in the error state. |
| `cdc_backoff_tables` | CDC tables that wait to retry. |
| `cdc_permanent_error` | `1` if the CDC run has a permanent error. |
| `cdc_running` | `1` if CDC runs. |
| `cdc_sample_age_seconds` | Age of the last metric sample. |
| `cdc_run_success_percent` | Percent of successful CDC runs in the last 24 hours. |
| `snapshot_rows_per_second` | Snapshot rows loaded per second. |
| `snapshot_table_success_percent` | Percent of snapshot tables without errors. |
| `snapshot_progress_percent` | Snapshot progress. |
| `snapshot_running` | `1` if the snapshot runs. |
| `snapshot_run_success_percent` | Percent of successful snapshot runs in the last 24 hours. |

## Get Sync Metrics

`GET /api/v1/orgs/{orgSlug}/tenant/metrics/{queryType}` · Read · Member

Returns the sync metrics of a MySQL or TiDB task. This endpoint is the [Get Metrics](./05-organization-and-metrics.md#get-metrics) endpoint with `queryType` set to `MySQLSync` or `TiDBSync`. Use it for MySQL tasks. For TiDB tasks, you can also use [Get TiDB Task Metrics](#get-tidb-task-metrics).

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `orgSlug` | path | string | Yes | Organization ID. |
| `queryType` | path | string (enum) | Yes | `MySQLSync` or `TiDBSync`. It must match the task type. |
| `taskId` | query | integer | Yes | Task ID. |
| `from` | query | string | Yes | Start time, RFC 3339. |
| `to` | query | string | Yes | End time, RFC 3339. Not more than 24 hours after `from`. |
| `step` | query | string | Yes | Duration from `30s` to `1h`, in whole seconds. The range can have at most 1440 points. |

```bash
curl --get 'https://api.databend.com/api/v1/orgs/<organization-id>/tenant/metrics/MySQLSync' \
  --header 'X-DATABENDCLOUD-TOKEN: <api-token>' \
  --data-urlencode 'taskId=<task-id>' \
  --data-urlencode 'from=2026-11-09T07:00:00Z' \
  --data-urlencode 'to=2026-11-09T08:00:00Z' \
  --data-urlencode 'step=60s'
```

The response has the same shape as [Get Metrics](./05-organization-and-metrics.md#get-metrics). The metric names are the same as [Get TiDB Task Metrics](#get-tidb-task-metrics). MySQL tasks also return `cdc_source_lag_seconds` (how far the binlog reader is behind the source) and `cdc_skipped_tables`. MySQL tasks do not return `cdc_error_tables` or `cdc_backoff_tables`.

## Types

### Task Status

| Value | Name |
|---|---|
| `1` | `TaskStopped` |
| `2` | `TaskRunning` |

### Task Run Status

| Value | Name |
|---|---|
| `1` | `TaskRunRunning` |
| `2` | `TaskRunSuccess` |
| `3` | `TaskRunFail` |

### Operate Type

| Value | Name | Effect |
|---|---|---|
| `1` | `Start` | Starts a stopped task. |
| `2` | `Stop` | Stops a running task. A stopped task stays stopped. |
| `3` | `Drop` | Deletes a stopped task. Returns HTTP 400 if the task is running. |
| `4` | `Resume` | Starts a stopped task. A MySQL archive task keeps its current time window, so a failed window runs again. |
| `5` | `Cancel` | Stops a running task. Returns HTTP 400 if the task is not running. |

### Sync Mode

`mysqlTask.syncMode`, `postgresTask.syncMode`, and `tidbTask.syncMode` use the same values.

| Value | Mode | `continuousIngestion` |
|---|---|---|
| `1` | Snapshot only. | `0` |
| `2` | CDC only. | `1` |
| `3` | Snapshot, then CDC. | `1` |

### File Type

| Value | Format |
|---|---|
| `1` | CSV |
| `2` | Parquet |
| `3` | NDJSON |

### Copy On Error

`awsS3File.copyIntoOnError`:

| Value | Effect |
|---|---|
| `1` | `CONTINUE`: skip bad rows and continue. |
| `2` | `ABORT`: stop the load at the first error. |

### MySQL Archive Mode

`mysqlTask.archiveSchedule.archiveMode`: `1` daily, `2` weekly, `3` monthly.

### MySQL Snapshot Table Status

| Value | Name | Meaning |
|---|---|---|
| `1` | `Success` | All rows of the table are loaded. |
| `2` | `Failed` | The table failed after all retries. |
| `3` | `Skipped` | The table has no usable merge key. The run left it out. |
| `4` | `Pending` | The run ended before the snapshot reached the table. |

### TiDB Full Sync Table Status

`1` success, `2` failed.

### Task Objects

#### TableField

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Column name. |
| `type` | string | Yes | Databend data type, for example `VARCHAR`, `BIGINT`, `TIMESTAMP`, or `VARIANT`. |
| `nullable` | boolean | No | Whether the column accepts `NULL`. |
| `defaultValue` | string | No | Default value expression. |

#### AwsS3File

Used by S3, SQS (S3), and MNS (OSS) tasks.

| Field | Type | Required | Description |
|---|---|---|---|
| `region` | string | No | Bucket region, for example `us-east-2`. |
| `filePath` | string | Depends | Files to load. Required for S3 (`serviceId` 1). Wildcards are allowed: `s3://bucket/path/2026-11-*.csv`. SQS (S3) and MNS (OSS) tasks get the files from event messages. |
| `fileType` | integer (enum) | Yes | [File type](#file-type). The server does not check it when you create the task. Always set it. |
| `fileCsvArgs` | object | For CSV | [FileCsvArgs](#filecsvargs). |
| `copyIntoOnError` | integer (enum) | No | [Copy on error](#copy-on-error). |
| `copyIntoPurge` | boolean | No | Delete the source files after a successful load. |
| `copyIntoForce` | boolean | No | Load files again even if they were loaded before. |

#### FileCsvArgs

| Field | Type | Required | Description |
|---|---|---|---|
| `fieldDelimiter` | string | No | Default: `,`. |
| `recordDelimiter` | string | No | Default: `\n`. |
| `compression` | string | No | Default: `None`. Other values follow the Databend `COMPRESSION` file format option, for example `GZIP` or `AUTO`. |
| `skipHeader` | integer | No | Number of header lines to skip. |

#### KafkaConsumerArgs (Task)

The task part of the Kafka settings. The connection is on the [data source](./13-data-sources.md#kafkaconsumer-serviceid-7).

| Field | Type | Required | Description |
|---|---|---|---|
| `topics` | string | Yes | Topics, separated by commas. |
| `dataFormat` | string | No | Only `JSON`. Default: `JSON`. |
| `offsetReset` | string (enum) | No | `EARLIEST` or `LATEST`. Default: `LATEST`. |
| `maxBatchSizeBytes` | integer | No | Maximum size of one output file, in bytes. Default: `16777216`. |
| `maxBatchWaitSeconds` | integer | No | Maximum wait before the task writes a file. Default: `60`. |

#### MysqlTaskArgs

| Field | Type | Required | Description |
|---|---|---|---|
| `syncMode` | integer (enum) | Yes | [Sync mode](#sync-mode). |
| `includeTables` | string[] | Depends | Tables in the default database of the data source. Required if you do not use `tableRules`. |
| `excludeTables` | string[] | No | Tables to leave out. Use only with `includeTables`. |
| `tableRules` | string[] | Depends | [Table rules](#table-rules) for one or more databases. Up to 50 rules. Do not use with `includeTables`, `excludeTables`, or `archiveSchedule`. The request `tableName` must be empty. |
| `conflictKey` | string | Depends | Merge key column. Required for CDC modes (`2`, `3`) when you use `includeTables`. With `tableRules`, each table uses its primary key, and `conflictKey` is an optional override for tables without a composite key. |
| `allowDelete` | boolean | No | Apply source `DELETE` events to the target. |
| `snapshotWhereCondition` | string | No | SQL condition to filter snapshot rows. Only for syncMode `1`. At most 10,000 characters. It must not contain `DROP`, `DELETE`, `UPDATE`, `INSERT`, `TRUNCATE`, `EXEC`, `EXECUTE`, `CREATE`, `ALTER`, `GRANT`, or `REVOKE`. |
| `archiveSchedule` | object | No | Periodic archive. See below. Only with `includeTables`. |
| `maxMatchedTables` | integer | No | Most tables that `tableRules` can match. `0` uses the server default (5000). |
| `targetDatabasePrefix`, `targetDatabaseSuffix`, `targetTablePrefix`, `targetTableSuffix` | string | No | Name affixes for rule-based tasks. Letters, digits, and `_` only. Target database = prefix + source database + suffix. Target table = prefix + source table + suffix. |
| `mergeIntervalSeconds`, `rawTableTtlHours`, `checkpointIntervalSeconds`, `pipelineBufferSize`, `pipelineBatchSize`, `pipelineFlushIntervalSeconds`, `pipelineWorkers`, `batchSize` | integer | No | Advanced tuning. Omit them or send `0` to use the server defaults. |

`archiveSchedule` fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `enabled` | boolean | Yes | Turn on the archive. |
| `cronExpression` | string | If enabled | Cron expression, for example `0 1 * * *`. |
| `archiveMode` | integer (enum) | If enabled | [MySQL archive mode](#mysql-archive-mode). |
| `timeColumnName` | string | If `autoGenerateCondition` | Time column. Letters, digits, and `_`, at most 64 characters. |
| `autoGenerateCondition` | boolean | No | Generate the time window condition from `timeColumnName`. |
| `timezone` | string | No | IANA time zone, for example `Asia/Shanghai`. Default: UTC. |

#### PostgresTaskArgs

| Field | Type | Required | Description |
|---|---|---|---|
| `syncMode` | integer (enum) | Yes | [Sync mode](#sync-mode). |
| `includeTables` | string[] | Yes | Tables, for example `public.orders`. |
| `excludeTables` | string[] | No | Tables to leave out. |
| `conflictKey` | string | Depends | Merge key column. Required for syncMode `2` and `3`. |
| `allowDelete` | boolean | No | Apply source `DELETE` events to the target. |
| `snapshotWhereCondition` | string | No | Same rules as in MysqlTaskArgs. Only for syncMode `1`. |
| Tuning fields | integer | No | Same as in MysqlTaskArgs. |

#### TiDBTaskArgs

| Field | Type | Required | Description |
|---|---|---|---|
| `syncMode` | integer (enum) | Yes | [Sync mode](#sync-mode). |
| `dumplingS3Prefix` | string | Depends | Prefix of the Dumpling export. Required for syncMode `1` and `3`. |
| `changefeedS3Prefix` | string | Depends | Prefix that the TiCDC changefeed writes to. Required for syncMode `2` and `3`. Create the changefeed with `enable-tidb-extension=true` in its sink URI. |
| `tableRules` | string[] | Depends | [Table rules](#table-rules). Up to 50 rules. Required if the data source has no `database`. Do not use with `includeTables` or `excludeTables`. |
| `includeTables`, `excludeTables` | string[] | No | Tables in the default database of the data source. |
| `maxMatchedTables` | integer | No | Most tables that the task can sync. `0` uses the server default (5000). |
| `targetDatabasePrefix`, `targetDatabaseSuffix`, `targetTablePrefix`, `targetTableSuffix` | string | No | Name affixes. Letters, digits, and `_` only. With no affixes, the target names are the source names. |
| `conflictKey` | string | No | Merge key column. |
| `allowDelete` | boolean | No | Apply source `DELETE` events to the target. |
| `textToVariant` | boolean | No | Map `TEXT` columns to `VARIANT` instead of `STRING`. Set it before the first sync. Values must be valid JSON. |
| `dumplingEscapeBackslash` | boolean | Depends | Must match the `--escape-backslash` option of the Dumpling export. A non-empty export with text columns needs `false`, exported with `--escape-backslash=false --csv-output-dialect=snowflake`. |
| `dumplingCsvSeparator` | string | No | CSV separator of the export. |
| `dumplingCsvNull` | string | No | `NULL` marker of the export. |
| `dumplingCsvSkipHeader` | integer | No | Header lines in each file. Omit it to use the Dumpling default (one header line). |
| `dumplingAutoCreateTable` | boolean | No | Create target tables from the exported schema files. |
| `dumplingOnError` | string | No | `COPY INTO` `ON_ERROR` option for the snapshot. |
| `dumplingPurge` | boolean | No | Delete export files after a successful load. |
| `dumplingCopyBatchFiles` | integer | No | Files per `COPY`, from `0` to `64`. `0` uses 16. |
| `pollIntervalSeconds`, `batchFileCount`, `mergeIntervalSeconds`, `tableParallelism` | integer | No | Advanced tuning. Must not be negative. `0` uses the server default. |
| `errorIntegration` | string | No | Not available on Databend Cloud. Do not set it. The server rejects a value with HTTP 400. |

#### Table Rules

`tableRules` uses the TiCDC filter syntax. Each rule is `schemaPattern.tablePattern`. A rule that starts with `!` excludes objects.

| Rule | Matches |
|---|---|
| `app.orders` | One table. |
| `shard_*.*` | All tables in all databases whose names start with `shard_`. |
| `~^shard_\d+$.~^t` | Regular expressions on both sides. |
| `!*.tmp_*` | Excludes tables whose names start with `tmp_`. |

The server reads rules from the last one to the first. The first rule that matches decides. An object that matches no rule is excluded. A list of only `!` rules starts with an implicit `*.*`. Use [Preview MySQL Table Rules](./13-data-sources.md#preview-mysql-table-rules) or [Preview TiDB Table Rules](./13-data-sources.md#preview-tidb-table-rules) to check the result before you create a task.

### Last Run Data

`lastRunData` (on a task) and `responseData` (on a run) have this shape:

| Field | Type | Description |
|---|---|---|
| `kind` | string | Task kind, for example `mysql`. |
| `status` | integer (enum) | [Task run status](#task-run-status). |
| `error` | string | Error message of a failed run. |
| `warning` | string | Latest warning that did not stop the run, for example a skipped file. |
| `mysqlLastRun`, `postgresLastRun`, `tidbLastRun`, `kafkaLastRun`, `awsS3LastRun`, `awsSqsS3LastRun` | object | Progress details for the task kind. Only one is present. |

Useful progress fields:

| Object | Fields |
|---|---|
| `mysqlLastRun` | `phase` (`snapshot` or `cdc`), `rowsSynced`, `insertCount`, `updateCount`, `deleteCount`, `mergedRows`, `tablesTotal`, `tablesCompleted`, `tablesError`, `tablesSkipped`, `currentTable`, `rowsPerSecond`, `dataFressness` (seconds), `sourceLagSeconds`, `lastError`, `lastWarning`, `tableResultsAvailable` |
| `postgresLastRun` | `lsn`, `snapshotCompleted`, `rowsSynced`, `insertCount`, `updateCount`, `deleteCount`, `lastMessage` |
| `tidbLastRun` | `fullSyncPhase`, `fullSyncCompleted`, `rowsSynced`, `bytesSynced`, `chunksTotal`, `chunksCompleted`, `tablesTotal`, `tablesActive`, `tablesError`, `tablesBackoff`, `mergedRows`, `dataFressness` (seconds), `appliedResolvedTS`, `slowestTable`, `lastError`, `lastWarning`, `tableResultsAvailable` |
| `kafkaLastRun` | `windowStart`, `windowEnd`, `recordsReceived`, `recordsWritten`, `recordsFailed`, `bytesReceived`, `bytesWritten`, `errorCount` |
| `awsS3LastRun`, `awsSqsS3LastRun` | `bucket`, `object`, `total`, `success`, `fail` |

64-bit counters are JSON strings. `dataFressness` keeps its original spelling.
