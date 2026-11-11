---
title: "Data Sources"
sidebar_label: "Data Sources"
toc_max_heading_level: 4
---

Read the [Overview](./index.md) first for authentication, request conventions, and errors.

A data source stores the connection to an external system: a database, object storage, a message queue, or a notification bot. A [data integration task](./14-data-integration-tasks.md) reads from a data source and writes to Databend.

All data source endpoints are v2. Send `orgSlug` in the body. `serviceId` selects the source type. Each type has one credentials object. See [Service ID](#service-id) and [Credentials Objects](#credentials-objects).

Secrets: list and get responses mask all secret values in `serviceArgs`. In an update, send `******` back to keep a saved secret, or send a new value. See [Credential Masking](#credential-masking).

## List Data Sources

`POST /api/v2/data-integration/datasources` · Read · Member

| Field | Type | Required | Description |
|---|---|---|---|
| `orgSlug` | string | Yes | Organization ID. |
| `page` | integer | No | Page number. Default: 1. |
| `perPage` | integer | No | Rows per page. Default: 20. |
| `serviceId` | integer (enum) | No | Filter by [Service ID](#service-id). |

Request example:

```json
{ "orgSlug": "<organization-id>", "page": 1, "perPage": 20, "serviceId": 2 }
```

Response example. `serviceArgs` is a JSON string. Parse it to read the connection settings.

```json
{
  "success": true,
  "data": {
    "total": 1,
    "page": 1,
    "perPage": 20,
    "list": [
      {
        "id": 12,
        "orgId": "1024",
        "name": "orders_mysql",
        "serviceId": 2,
        "serviceArgs": "{\"host\":\"mysql.example.com\",\"port\":3306,\"username\":\"sync\",\"password\":\"******\",\"database\":\"shop\",\"sslMode\":\"require\"}",
        "createdAccountId": 7,
        "createdAccountName": "Alice",
        "createdAccountEmail": "alice@example.com",
        "createdAt": "2026-11-01T02:00:00Z",
        "updatedAt": "2026-11-01T02:00:00Z"
      }
    ]
  }
}
```

## Get a Data Source

`POST /api/v2/data-integration/datasource/{datasourceId}/info` · Read · Member

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `datasourceId` | path | integer | Yes | Data source ID. |
| `orgSlug` | body | string | Yes | Organization ID. |

Response: `data` is one data source object with the same fields as one item of [List Data Sources](#list-data-sources).

```json
{ "success": true, "data": { "id": 12, "name": "orders_mysql", "serviceId": 2, "serviceArgs": "{...}" } }
```

## Test a Data Source Connection

`POST /api/v2/data-integration/datasource/test` · Probe · Member

Tests the connection settings without saving them. The body is the same as [Create a Data Source](#create-a-data-source), plus one optional field:

| Field | Type | Required | Description |
|---|---|---|---|
| `datasourceId` | integer | No | ID of a saved data source. Set it to test changed settings before an update: a secret sent as `******` is replaced with the saved value, under the rules in [Credential Masking](#credential-masking). Without it, `******` is rejected. |

Limits: each organization can run about one test every 5 seconds, with a burst of 5. The server returns HTTP 429 when the quota is used up. Wait and try again.

Response on success:

```json
{ "success": true }
```

Response on a failure. A parameter error returns HTTP 400 with a `[CLIENT-5001]` message. A connection failure returns HTTP 500. The message contains the reason from the external system.

```json
{ "success": false, "message": "dial tcp 10.0.0.12:3306: i/o timeout" }
```

## Create a Data Source

`POST /api/v2/data-integration/datasource/create` · Write · Member

Tests the connection, then saves the data source.

| Field | Type | Required | Description |
|---|---|---|---|
| `orgSlug` | string | Yes | Organization ID. |
| `name` | string | Yes | Unique name in the organization. For `serviceId` 4 (Feishu bot), use only letters, digits, and `_`. |
| `serviceId` | integer (enum) | Yes | [Service ID](#service-id). |
| One credentials object | object | Yes | The object that matches `serviceId`. See the table below. |

| `serviceId` | Credentials field |
|---|---|
| `1` | `awsCredentials` |
| `2` | `mysqlCredentials` |
| `3` | `postgresCredentials` |
| `4` | `feiShuBot` |
| `5` | `awsSqsS3` |
| `6` | `tidbCredentials` |
| `7` | `kafkaConsumer` |
| `8` | `mnsOss` |

Send exactly one credentials object. The fields of each object are in [Credentials Objects](#credentials-objects).

Request example (MySQL):

```json
{
  "orgSlug": "<organization-id>",
  "name": "orders_mysql",
  "serviceId": 2,
  "mysqlCredentials": {
    "host": "mysql.example.com",
    "port": 3306,
    "username": "sync",
    "password": "<password>",
    "database": "shop",
    "sslMode": "require"
  }
}
```

Request example (Kafka):

```json
{
  "orgSlug": "<organization-id>",
  "name": "events_kafka",
  "serviceId": 7,
  "kafkaConsumer": {
    "brokers": "b-1.kafka.example.com:9096,b-2.kafka.example.com:9096",
    "authentication": "SASL/PLAIN",
    "tlsEncryption": true,
    "saslPlain": { "username": "consumer", "password": "<password>" }
  }
}
```

Response. The ID is at the top level.

```json
{ "success": true, "id": 12 }
```

Errors: a duplicate name returns HTTP 500 with `[SERVER-6000] server err: name orders_mysql exists`. A failed connection test returns the same error as [Test a Data Source Connection](#test-a-data-source-connection).

## Update a Data Source

`POST /api/v2/data-integration/datasource/{datasourceId}/update` · Write · Member

Replaces the name and the credentials of a data source.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `datasourceId` | path | integer | Yes | Data source ID. |
| `orgSlug` | body | string | Yes | Organization ID. |
| `name` | body | string | Yes | Name. |
| `serviceId` | body | integer (enum) | Yes | The current [Service ID](#service-id) of the data source. |
| One credentials object | body | object | Yes | All credential fields. For a secret that you keep, send `******`. |

Request example:

```json
{
  "orgSlug": "<organization-id>",
  "name": "orders_mysql",
  "serviceId": 2,
  "mysqlCredentials": { "host": "mysql.example.com", "port": 3306, "username": "sync", "password": "<new-password>", "database": "shop", "sslMode": "require" }
}
```

Response:

```json
{ "success": true }
```

## Delete Data Sources

`POST /api/v2/data-integration/datasource/delete` · Write · Member

| Field | Type | Required | Description |
|---|---|---|---|
| `orgSlug` | string | Yes | Organization ID. |
| `datasourceIds` | integer[] | Yes | IDs of the data sources to delete. |

```json
{ "orgSlug": "<organization-id>", "datasourceIds": [12, 13] }
```

Response: `{ "success": true }`. If a task uses one of the data sources, the request fails and the server deletes nothing. Delete or change the task first.

## List MySQL Tables

`POST /api/v2/data-integration/datasource/{datasourceId}/mysql/tables` · Probe · Member

Connects to the MySQL server of the data source and returns the tables of its default database (`mysqlCredentials.database`). The data source must have a `database`. If it has none, the request fails with `param [database] required`. For a data source without a database, use [Preview MySQL Table Rules](#preview-mysql-table-rules).

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `datasourceId` | path | integer | Yes | ID of a MySQL data source (`serviceId` 2). |
| `orgSlug` | body | string | Yes | Organization ID. |

Response. The list is at the top level.

```json
{ "success": true, "tables": ["customers", "orders", "order_items"] }
```

## List PostgreSQL Tables

`POST /api/v2/data-integration/datasource/{datasourceId}/postgres/tables` · Probe · Member

Same as [List MySQL Tables](#list-mysql-tables), for a PostgreSQL data source (`serviceId` 3). `targetTableNames[i]` is the suggested Databend table name for `tables[i]`, without the schema prefix.

```json
{ "success": true, "tables": ["public.orders", "public.customers"], "targetTableNames": ["orders", "customers"] }
```

## Preview MySQL Table Rules

`POST /api/v2/data-integration/datasource/{datasourceId}/mysql/preview-objects` · Probe · Member

Shows which source tables a table selection matches, and the target names. Call it before you create a rule-based MySQL task.

| Field | In | Type | Required | Description |
|---|---|---|---|---|
| `datasourceId` | path | integer | Yes | ID of a MySQL data source. |
| `orgSlug` | body | string | Yes | Organization ID. |
| `tableRules` | body | string[] | No | [Table rules](./14-data-integration-tasks.md#table-rules). Do not use with `includeTables` or `excludeTables`. |
| `includeTables` | body | string[] | No | Tables in the default database to include. |
| `excludeTables` | body | string[] | No | Tables in the default database to exclude. |
| `limit` | body | integer | No | Maximum number of returned pairs. `0` uses the server default. |
| `targetDatabasePrefix`, `targetDatabaseSuffix`, `targetTablePrefix`, `targetTableSuffix` | body | string | No | Name affixes. Letters, digits, and `_` only. They change only the target names in the response. |

Request example:

```json
{
  "orgSlug": "<organization-id>",
  "tableRules": ["shop.orders", "shard_*.*", "!*.tmp_*"],
  "limit": 100,
  "targetDatabasePrefix": "raw_"
}
```

Response. The fields are at the top level. `total` counts all matches before `limit`. `unmatchedDatabases` lists databases that have tables but no match. `maxMatchedTables` is the most tables that one task can sync.

```json
{
  "success": true,
  "objects": [
    { "database": "shop", "table": "orders", "targetDatabase": "raw_shop", "targetTable": "orders" },
    { "database": "shard_01", "table": "events", "targetDatabase": "raw_shard_01", "targetTable": "events" }
  ],
  "total": 2,
  "unmatchedDatabases": ["analytics"],
  "maxMatchedTables": 5000
}
```

## Preview TiDB Table Rules

`POST /api/v2/data-integration/datasource/{datasourceId}/tidb/preview-objects` · Probe · Member

Reads the object storage of a TiDB data source (`serviceId` 6). Shows which source tables a table selection matches.

| Field | In | Type | Required | Description |
|---|---|---|---|---|
| `datasourceId` | path | integer | Yes | ID of a TiDB data source. |
| `orgSlug` | body | string | Yes | Organization ID. |
| `s3Prefix` | body | string | Yes | Prefix to read. For CDC, use the changefeed prefix. For a snapshot, use the Dumpling prefix. |
| `sourceKind` | body | string (enum) | No | `changefeed` (default): reads `{prefix}/{db}/{table}/`. `dumpling`: reads `{db}.{table}-schema.sql` files. |
| `tableRules`, `includeTables`, `excludeTables` | body | string[] | No | Table selection. Same rules as the MySQL preview. |
| `limit` | body | integer | No | Maximum number of returned pairs. `0` uses the server default. |
| `targetDatabasePrefix`, `targetDatabaseSuffix`, `targetTablePrefix`, `targetTableSuffix` | body | string | No | Name affixes for the target names in the response. |

Response: the same top-level fields as [Preview MySQL Table Rules](#preview-mysql-table-rules), without `maxMatchedTables`.

## Get AWS SQS (S3) Setup Information

`POST /api/v2/data-integration/aws-sqs-s3/setup-info` · Read · Member

Returns the values that you need to create the IAM role for an AWS SQS (S3) data source (`serviceId` 5). Put `externalID` in the trust policy of the role, and trust each principal with `required: true`.

| Field | Type | Required | Description |
|---|---|---|---|
| `orgSlug` | string | Yes | Organization ID. |

```json
{
  "success": true,
  "data": {
    "externalID": "acme-prod",
    "trustPrincipals": [
      { "name": "Databend Cloud", "arn": "arn:aws:iam::123456789012:role/databend-sqs-s3-consumer", "required": true }
    ]
  }
}
```

## Get TiDB Setup Information

`POST /api/v2/data-integration/tidb/setup-info` · Read · Member

Returns the same fields as [Get AWS SQS (S3) Setup Information](#get-aws-sqs-s3-setup-information). Use them when a TiDB data source reads S3 with `roleARN`.

## Types

### Service ID

| Value | Name | Source type |
|---|---|---|
| `1` | `AwsCredentials` | AWS S3, with an access key. |
| `2` | `MysqlCredentials` | MySQL. |
| `3` | `PostgresCredentials` | PostgreSQL. |
| `4` | `FeiShuBot` | Feishu or Lark bot, for task failure notifications. |
| `5` | `AwsSqsS3` | AWS S3 with SQS event notifications, with an IAM role. |
| `6` | `TiDBCDC` | TiDB, through TiCDC changefeed and Dumpling files in object storage. |
| `7` | `KafkaConsumer` | Kafka. |
| `8` | `MnsOss` | Alibaba Cloud OSS with MNS event notifications. |

Do not use `0`. The availability of a type depends on the cloud and region of the organization.

### Credentials Objects

Send one of these objects in [Create a Data Source](#create-a-data-source), [Update a Data Source](#update-a-data-source), and [Test a Data Source Connection](#test-a-data-source-connection).

#### awsCredentials (`serviceId` 1)

| Field | Type | Required | Description |
|---|---|---|---|
| `accessKey` | string | Yes | AWS access key ID. |
| `secretKey` | string | Yes | AWS secret access key. Secret. |

#### mysqlCredentials (`serviceId` 2)

| Field | Type | Required | Description |
|---|---|---|---|
| `host` | string | Yes | Host name or IP address. Databend Cloud must be able to reach it. |
| `port` | integer | Yes | Port, for example `3306`. |
| `username` | string | Yes | User name. The user needs binlog read privileges for CDC. |
| `password` | string | Yes | Password. Secret. |
| `database` | string | No | Default database. Required for tasks that use `includeTables`. Not used by tasks with `tableRules`. |
| `sslMode` | string (enum) | No | `disable` (default), `require`, `verify-ca`, or `verify-full`. |
| `serverId` | integer | No | Binlog replica server ID. It must be unique in the organization. If you omit it, create generates one and update keeps the current one. |
| `charset` | string | No | Connection character set. |

#### postgresCredentials (`serviceId` 3)

| Field | Type | Required | Description |
|---|---|---|---|
| `host` | string | Yes | Host name or IP address. |
| `port` | integer | Yes | Port, for example `5432`. |
| `username` | string | Yes | User name. The user needs logical replication privileges for CDC. |
| `password` | string | Yes | Password. Secret. |
| `database` | string | Yes | Database name. |
| `sslMode` | string (enum) | No | `disable` (default), `require`, `verify-ca`, or `verify-full`. |
| `schema` | string[] | No | Schemas. Default: `["public"]`. |
| `slotName` | string | No | Logical replication slot. The server makes a name if you omit it. |
| `publication` | string | No | Publication. The server makes a name if you omit it. |

#### feiShuBot (`serviceId` 4)

| Field | Type | Required | Description |
|---|---|---|---|
| `url` | string | Yes | Bot webhook URL. It must be `https://open.feishu.cn/open-apis/bot/v2/hook/<token>`, or the same path on `open.larksuite.com` or `open.larkoffice.com`. Secret. |
| `type` | integer | No | `1`: task error messages. |
| `template` | string | No | Message template. |
| `warehouse` | string | Yes | Warehouse name that the bot uses. |

#### awsSqsS3 (`serviceId` 5)

| Field | Type | Required | Description |
|---|---|---|---|
| `roleARN` | string | Yes | ARN of the IAM role that Databend Cloud assumes. Create it with [Get AWS SQS (S3) Setup Information](#get-aws-sqs-s3-setup-information). |
| `queueURL` | string | Yes | SQS queue URL, for example `https://sqs.us-east-2.amazonaws.com/123456789012/orders-events`. The server reads the region from it. |
| `bucket` | string | Yes | S3 bucket. |
| `prefix` | string | No | Load only objects with this key prefix. |
| `suffix` | string | No | Load only objects with this key suffix, for example `.csv`. |

Do not send `externalID` or `queueRegion`. The server sets them.

#### tidbCredentials (`serviceId` 6)

The TiDB data source reads TiCDC changefeed files and Dumpling export files from object storage. The S3 prefixes are set on the task, not on the data source.

| Field | Type | Required | Description |
|---|---|---|---|
| `storageProvider` | string (enum) | No | `s3` or empty (default): AWS S3 or an S3-compatible store. `oss`: Alibaba Cloud OSS. |
| `s3Bucket` | string | Yes | Bucket name. |
| `s3Region` | string | Yes | Region, for example `us-west-2`. For `oss`, the OSS region, for example `cn-hangzhou`. |
| `s3AccessKey` | string | Depends | Access key. Required for `oss`. For S3, send it with `s3SecretKey`, or send `roleARN`. |
| `s3SecretKey` | string | Depends | Secret key. Secret. |
| `roleARN` | string | Depends | IAM role ARN, instead of an access key. Not supported for `oss`. See [Get TiDB Setup Information](#get-tidb-setup-information). |
| `s3Endpoint` | string | No | Endpoint of an S3-compatible store. Must be empty for `oss`. |
| `sqsQueueURL` | string | No | SQS standard queue URL for event mode. FIFO queues are rejected. Not supported for `oss`. |
| `sqsRegion` | string | No | SQS region. Default: `s3Region`. |
| `database` | string | No | Default source database. Tasks without `tableRules` need it. |

Do not send `externalID`, `ossInternalEndpoint`, or `ossLoaderInternalEndpoint`. The server sets them.

#### kafkaConsumer (`serviceId` 7)

| Field | Type | Required | Description |
|---|---|---|---|
| `brokers` | string | Yes | Broker addresses (`host:port`), separated by commas. |
| `authentication` | string (enum) | No | `NONE` (default) or `SASL/PLAIN`. |
| `saslPlain` | object | Depends | `{ "username": "...", "password": "..." }`. Required for `SASL/PLAIN`. `password` is secret. |
| `tlsEncryption` | boolean | No | Use TLS. Default: `false`. |

The data source ignores `topics`, `dataFormat`, `offsetReset`, `maxBatchSizeBytes`, and `maxBatchWaitSeconds`. Set them on the task.

#### mnsOss (`serviceId` 8)

| Field | Type | Required | Description |
|---|---|---|---|
| `endpoint` | string | Yes | Public HTTPS MNS endpoint of the region, for example `https://123456789.mns.cn-hangzhou.aliyuncs.com`. |
| `region` | string | Yes | Region, for example `cn-hangzhou`. |
| `queueName` | string | Yes | MNS queue that gets the OSS events. |
| `quarantineQueueName` | string | Yes | Queue for messages that fail. It must be different from `queueName`. |
| `bucket` | string | Yes | OSS bucket. |
| `prefix` | string | No | Object key prefix. Empty, or it must end with `/`. |
| `suffix` | string | No | Object key suffix. |
| `accessKeyId` | string | Yes | Access key ID. |
| `accessKeySecret` | string | Yes | Access key secret. Secret. |
| `securityToken` | string | No | STS token. Secret. |

### Credential Masking

All endpoints in this section use one masking rule:

- The server replaces every secret value with the fixed string `******`. The rule is the same for list and get endpoints.
- A secret is a value that grants access: a password, a secret key, a session token, or a webhook URL that contains a token.
- Identifiers stay visible: host, port, user name, access key ID, role ARN, bucket, region, and queue. You need them to check the configuration.
- An empty secret stays empty. A masked secret is always `******`, whatever its length. Do not use the mask to guess the length or the value.
- No structured field in this section returns a secret in clear text.

Masked fields by endpoint:

| Endpoint | Object | Masked fields |
|---|---|---|
| [List Data Sources](#list-data-sources), [Get a Data Source](#get-a-data-source) | `serviceArgs` of `awsCredentials` | `secretKey` |
| | `serviceArgs` of `mysqlCredentials`, `postgresCredentials` | `password` |
| | `serviceArgs` of `feiShuBot` | `url` |
| | `serviceArgs` of `tidbCredentials` | `s3SecretKey` |
| | `serviceArgs` of `kafkaConsumer` | `saslPlain.password` |
| | `serviceArgs` of `mnsOss` | `accessKeySecret`, `securityToken` |

`awsSqsS3` data sources use an IAM role and have no secret field.

Rules for sending secrets:

- [Update a Data Source](#update-a-data-source) replaces all credential fields. For each secret, send a new value, or send `******` to keep the saved one.
- The server keeps a saved secret only while the connection target is unchanged. If you change a target field, enter the secret again. Otherwise the request fails with HTTP 400. This stops a request from sending a saved password to a new host.
- [Test a Data Source Connection](#test-a-data-source-connection) follows the same rules when you set `datasourceId`.
- [Create a Data Source](#create-a-data-source), and a test without `datasourceId`, reject `******` with HTTP 400.

Target fields by type:

| Type | Target fields |
|---|---|
| `awsCredentials` | `accessKey` |
| `mysqlCredentials`, `postgresCredentials` | `host`, `port`, `username`, `sslMode` |
| `feiShuBot` | None. The URL is the secret. |
| `tidbCredentials` | `storageProvider`, `s3Endpoint`, `s3Region`, `s3AccessKey` |
| `kafkaConsumer` | `brokers`, `authentication`, `tlsEncryption`, `saslPlain.username` |
| `mnsOss` | `endpoint`, `region`, `accessKeyId` |

The masking applies to structured fields only. The server does not mask SQL text in query history, query details, SQL task runs, and task flows. A SQL statement can contain a credential, for example in `CREATE STAGE`. Treat SQL text as sensitive.
