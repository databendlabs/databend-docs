---
title: "数据源"
sidebar_label: "数据源"
toc_max_heading_level: 4
---

调用前请先阅读[概览](./index.md)，了解鉴权、请求约定和错误处理。

数据源保存与外部系统的连接，外部系统可以是数据库、对象存储、消息队列或通知机器人。[数据集成任务](./14-data-integration-tasks.md)从数据源读取数据并写入 Databend。

所有数据源接口都是 v2 接口，需在请求体中传 `orgSlug`。`serviceId` 决定数据源类型，每种类型对应一个凭证对象。详见 [Service ID](#service-id) 和[凭证对象](#credentials-objects)。

密钥：列表和详情接口会对 `serviceArgs` 中的所有密钥值脱敏。更新时，传回 `******` 表示保留已保存的密钥，也可以传入新值。详见[凭证脱敏](#credential-masking)。

## 列出数据源 {/* #list-data-sources */}

`POST /api/v2/data-integration/datasources` · Read · Member

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `orgSlug` | string | 是 | 组织 ID。 |
| `page` | integer | 否 | 页码。默认：1。 |
| `perPage` | integer | 否 | 每页条数。默认：20。 |
| `serviceId` | integer（枚举） | 否 | 按 [Service ID](#service-id) 过滤。 |

请求示例：

```json
{ "orgSlug": "<organization-id>", "page": 1, "perPage": 20, "serviceId": 2 }
```

响应示例。`serviceArgs` 是 JSON 字符串，解析后可读取连接配置。

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

## 获取数据源 {/* #get-a-data-source */}

`POST /api/v2/data-integration/datasource/{datasourceId}/info` · Read · Member

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `datasourceId` | 路径 | integer | 是 | 数据源 ID。 |
| `orgSlug` | 请求体 | string | 是 | 组织 ID。 |

响应：`data` 是一个数据源对象，字段与[列出数据源](#list-data-sources)中的单项相同。

```json
{ "success": true, "data": { "id": 12, "name": "orders_mysql", "serviceId": 2, "serviceArgs": "{...}" } }
```

## 测试数据源连接 {/* #test-a-data-source-connection */}

`POST /api/v2/data-integration/datasource/test` · Probe · Member

测试连接配置，不保存。请求体与[创建数据源](#create-a-data-source)相同，另外可以传一个可选字段：

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `datasourceId` | integer | 否 | 已保存数据源的 ID。更新前测试修改后的配置时使用：值为 `******` 的密钥会替换为已保存的值，规则见[凭证脱敏](#credential-masking)。不传时，`******` 会被拒绝。 |

限制：每个组织大约每 5 秒可测试一次，突发上限为 5 次。配额用完时返回 HTTP 429，请稍后重试。

成功时的响应：

```json
{ "success": true }
```

失败时的响应：参数错误返回 HTTP 400，`message` 带 `[CLIENT-5001]` 前缀；连接失败返回 HTTP 500，`message` 中是外部系统返回的原因。

```json
{ "success": false, "message": "dial tcp 10.0.0.12:3306: i/o timeout" }
```

## 创建数据源 {/* #create-a-data-source */}

`POST /api/v2/data-integration/datasource/create` · Write · Member

先测试连接，再保存数据源。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `orgSlug` | string | 是 | 组织 ID。 |
| `name` | string | 是 | 在组织内唯一的名称。`serviceId` 为 4（飞书机器人）时，只能使用字母、数字和 `_`。 |
| `serviceId` | integer（枚举） | 是 | [Service ID](#service-id)。 |
| 一个凭证对象 | object | 是 | 与 `serviceId` 对应的对象，见下表。 |

| `serviceId` | 凭证字段 |
|---|---|
| `1` | `awsCredentials` |
| `2` | `mysqlCredentials` |
| `3` | `postgresCredentials` |
| `4` | `feiShuBot` |
| `5` | `awsSqsS3` |
| `6` | `tidbCredentials` |
| `7` | `kafkaConsumer` |
| `8` | `mnsOss` |

只能传一个凭证对象。各对象的字段见[凭证对象](#credentials-objects)。

请求示例（MySQL）：

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

请求示例（Kafka）：

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

响应。ID 在顶层。

```json
{ "success": true, "id": 12 }
```

错误：名称重复时返回 HTTP 500，`message` 为 `[SERVER-6000] server err: name orders_mysql exists`。连接测试失败时返回的错误与[测试数据源连接](#test-a-data-source-connection)相同。

## 更新数据源 {/* #update-a-data-source */}

`POST /api/v2/data-integration/datasource/{datasourceId}/update` · Write · Member

替换数据源的名称和凭证。

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `datasourceId` | 路径 | integer | 是 | 数据源 ID。 |
| `orgSlug` | 请求体 | string | 是 | 组织 ID。 |
| `name` | 请求体 | string | 是 | 名称。 |
| `serviceId` | 请求体 | integer（枚举） | 是 | 数据源当前的 [Service ID](#service-id)。 |
| 一个凭证对象 | 请求体 | object | 是 | 全部凭证字段。要保留的密钥传 `******`。 |

请求示例：

```json
{
  "orgSlug": "<organization-id>",
  "name": "orders_mysql",
  "serviceId": 2,
  "mysqlCredentials": { "host": "mysql.example.com", "port": 3306, "username": "sync", "password": "<new-password>", "database": "shop", "sslMode": "require" }
}
```

响应：

```json
{ "success": true }
```

## 删除数据源 {/* #delete-data-sources */}

`POST /api/v2/data-integration/datasource/delete` · Write · Member

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `orgSlug` | string | 是 | 组织 ID。 |
| `datasourceIds` | integer[] | 是 | 要删除的数据源 ID 列表。 |

```json
{ "orgSlug": "<organization-id>", "datasourceIds": [12, 13] }
```

响应：`{ "success": true }`。如果其中任一数据源正被任务使用，请求失败，服务端不会删除任何数据源。请先删除或修改相关任务。

## 列出 MySQL 表 {/* #list-mysql-tables */}

`POST /api/v2/data-integration/datasource/{datasourceId}/mysql/tables` · Probe · Member

连接数据源对应的 MySQL 服务器，返回其默认数据库（`mysqlCredentials.database`）中的表。数据源必须配置了 `database`，否则请求失败，报错 `param [database] required`。没有配置数据库的数据源，请使用[预览 MySQL 表规则](#preview-mysql-table-rules)。

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `datasourceId` | 路径 | integer | 是 | MySQL 数据源（`serviceId` 2）的 ID。 |
| `orgSlug` | 请求体 | string | 是 | 组织 ID。 |

响应。列表在顶层。

```json
{ "success": true, "tables": ["customers", "orders", "order_items"] }
```

## 列出 PostgreSQL 表 {/* #list-postgresql-tables */}

`POST /api/v2/data-integration/datasource/{datasourceId}/postgres/tables` · Probe · Member

与[列出 MySQL 表](#list-mysql-tables)相同，适用于 PostgreSQL 数据源（`serviceId` 3）。`targetTableNames[i]` 是 `tables[i]` 去掉 schema 前缀后建议使用的 Databend 表名。

```json
{ "success": true, "tables": ["public.orders", "public.customers"], "targetTableNames": ["orders", "customers"] }
```

## 预览 MySQL 表规则 {/* #preview-mysql-table-rules */}

`POST /api/v2/data-integration/datasource/{datasourceId}/mysql/preview-objects` · Probe · Member

显示表选择条件匹配到的源表及对应的目标名称。创建基于规则的 MySQL 任务前，请先调用此接口确认。

| 字段 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `datasourceId` | 路径 | integer | 是 | MySQL 数据源的 ID。 |
| `orgSlug` | 请求体 | string | 是 | 组织 ID。 |
| `tableRules` | 请求体 | string[] | 否 | [表规则](./14-data-integration-tasks.md#table-rules)。不能与 `includeTables` 或 `excludeTables` 同时使用。 |
| `includeTables` | 请求体 | string[] | 否 | 默认数据库中要包含的表。 |
| `excludeTables` | 请求体 | string[] | 否 | 默认数据库中要排除的表。 |
| `limit` | 请求体 | integer | 否 | 最多返回的条数。`0` 表示使用服务端默认值。 |
| `targetDatabasePrefix`、`targetDatabaseSuffix`、`targetTablePrefix`、`targetTableSuffix` | 请求体 | string | 否 | 名称前后缀，只能包含字母、数字和 `_`。只影响响应中的目标名称。 |

请求示例：

```json
{
  "orgSlug": "<organization-id>",
  "tableRules": ["shop.orders", "shard_*.*", "!*.tmp_*"],
  "limit": 100,
  "targetDatabasePrefix": "raw_"
}
```

响应。字段在顶层。`total` 是应用 `limit` 前的匹配总数。`unmatchedDatabases` 列出有表但没有被匹配到的数据库。`maxMatchedTables` 是单个任务最多可同步的表数。

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

## 预览 TiDB 表规则 {/* #preview-tidb-table-rules */}

`POST /api/v2/data-integration/datasource/{datasourceId}/tidb/preview-objects` · Probe · Member

读取 TiDB 数据源（`serviceId` 6）的对象存储，显示表选择条件匹配到的源表。

| 字段 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `datasourceId` | 路径 | integer | 是 | TiDB 数据源的 ID。 |
| `orgSlug` | 请求体 | string | 是 | 组织 ID。 |
| `s3Prefix` | 请求体 | string | 是 | 要读取的前缀。CDC 使用 changefeed 前缀，快照使用 Dumpling 前缀。 |
| `sourceKind` | 请求体 | string（枚举） | 否 | `changefeed`（默认）：读取 `{prefix}/{db}/{table}/`。`dumpling`：读取 `{db}.{table}-schema.sql` 文件。 |
| `tableRules`、`includeTables`、`excludeTables` | 请求体 | string[] | 否 | 表选择条件，规则与 MySQL 预览相同。 |
| `limit` | 请求体 | integer | 否 | 最多返回的条数。`0` 表示使用服务端默认值。 |
| `targetDatabasePrefix`、`targetDatabaseSuffix`、`targetTablePrefix`、`targetTableSuffix` | 请求体 | string | 否 | 用于生成响应中目标名称的前后缀。 |

响应：顶层字段与[预览 MySQL 表规则](#preview-mysql-table-rules)相同，但没有 `maxMatchedTables`。

## 获取 AWS SQS (S3) 接入信息 {/* #get-aws-sqs-s3-setup-information */}

`POST /api/v2/data-integration/aws-sqs-s3/setup-info` · Read · Member

返回为 AWS SQS (S3) 数据源（`serviceId` 5）创建 IAM 角色所需的信息。请把 `externalID` 写入角色的信任策略，并信任每个 `required: true` 的 principal。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `orgSlug` | string | 是 | 组织 ID。 |

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

## 获取 TiDB 接入信息 {/* #get-tidb-setup-information */}

`POST /api/v2/data-integration/tidb/setup-info` · Read · Member

返回的字段与[获取 AWS SQS (S3) 接入信息](#get-aws-sqs-s3-setup-information)相同。TiDB 数据源使用 `roleARN` 读取 S3 时需要这些信息。

## 类型 {/* #types */}

### Service ID {/* #service-id */}

| 取值 | 名称 | 数据源类型 |
|---|---|---|
| `1` | `AwsCredentials` | AWS S3，使用访问密钥。 |
| `2` | `MysqlCredentials` | MySQL。 |
| `3` | `PostgresCredentials` | PostgreSQL。 |
| `4` | `FeiShuBot` | 飞书或 Lark 机器人，用于任务失败通知。 |
| `5` | `AwsSqsS3` | 带 SQS 事件通知的 AWS S3，使用 IAM 角色。 |
| `6` | `TiDBCDC` | TiDB，读取对象存储中的 TiCDC changefeed 和 Dumpling 文件。 |
| `7` | `KafkaConsumer` | Kafka。 |
| `8` | `MnsOss` | 带 MNS 事件通知的阿里云 OSS。 |

不要使用 `0`。可用的数据源类型取决于组织所在的云厂商和地域。

### 凭证对象 {/* #credentials-objects */}

在[创建数据源](#create-a-data-source)、[更新数据源](#update-a-data-source)和[测试数据源连接](#test-a-data-source-connection)中传入以下对象之一。

#### awsCredentials（`serviceId` 1） {/* #awscredentials-serviceid-1 */}

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `accessKey` | string | 是 | AWS access key ID。 |
| `secretKey` | string | 是 | AWS secret access key。密钥。 |

#### mysqlCredentials（`serviceId` 2） {/* #mysqlcredentials-serviceid-2 */}

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `host` | string | 是 | 主机名或 IP 地址，必须能从 Databend Cloud 访问。 |
| `port` | integer | 是 | 端口，例如 `3306`。 |
| `username` | string | 是 | 用户名。CDC 需要该用户有 binlog 读取权限。 |
| `password` | string | 是 | 密码。密钥。 |
| `database` | string | 否 | 默认数据库。使用 `includeTables` 的任务必填，使用 `tableRules` 的任务不使用。 |
| `sslMode` | string（枚举） | 否 | `disable`（默认）、`require`、`verify-ca` 或 `verify-full`。 |
| `serverId` | integer | 否 | Binlog 复制的 server ID，在组织内必须唯一。不传时，创建会自动生成，更新会保留当前值。 |
| `charset` | string | 否 | 连接字符集。 |

#### postgresCredentials（`serviceId` 3） {/* #postgrescredentials-serviceid-3 */}

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `host` | string | 是 | 主机名或 IP 地址。 |
| `port` | integer | 是 | 端口，例如 `5432`。 |
| `username` | string | 是 | 用户名。CDC 需要该用户有逻辑复制权限。 |
| `password` | string | 是 | 密码。密钥。 |
| `database` | string | 是 | 数据库名。 |
| `sslMode` | string（枚举） | 否 | `disable`（默认）、`require`、`verify-ca` 或 `verify-full`。 |
| `schema` | string[] | 否 | Schema 列表。默认：`["public"]`。 |
| `slotName` | string | 否 | 逻辑复制槽。不传时由服务端生成名称。 |
| `publication` | string | 否 | Publication。不传时由服务端生成名称。 |

#### feiShuBot（`serviceId` 4） {/* #feishubot-serviceid-4 */}

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `url` | string | 是 | 机器人 Webhook URL，必须是 `https://open.feishu.cn/open-apis/bot/v2/hook/<token>`，或 `open.larksuite.com`、`open.larkoffice.com` 上的相同路径。密钥。 |
| `type` | integer | 否 | `1`：任务错误消息。 |
| `template` | string | 否 | 消息模板。 |
| `warehouse` | string | 是 | 机器人使用的计算集群名称。 |

#### awsSqsS3（`serviceId` 5） {/* #awssqss3-serviceid-5 */}

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `roleARN` | string | 是 | Databend Cloud 扮演的 IAM 角色 ARN。请根据[获取 AWS SQS (S3) 接入信息](#get-aws-sqs-s3-setup-information)创建该角色。 |
| `queueURL` | string | 是 | SQS 队列 URL，例如 `https://sqs.us-east-2.amazonaws.com/123456789012/orders-events`。服务端从中解析地域。 |
| `bucket` | string | 是 | S3 bucket。 |
| `prefix` | string | 否 | 只加载 key 带此前缀的对象。 |
| `suffix` | string | 否 | 只加载 key 带此后缀的对象，例如 `.csv`。 |

不要传 `externalID` 或 `queueRegion`，这两个字段由服务端设置。

#### tidbCredentials（`serviceId` 6） {/* #tidbcredentials-serviceid-6 */}

TiDB 数据源从对象存储读取 TiCDC changefeed 文件和 Dumpling 导出文件。S3 前缀在任务上设置，不在数据源上设置。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `storageProvider` | string（枚举） | 否 | `s3` 或空（默认）：AWS S3 或兼容 S3 的存储。`oss`：阿里云 OSS。 |
| `s3Bucket` | string | 是 | Bucket 名称。 |
| `s3Region` | string | 是 | 地域，例如 `us-west-2`。使用 `oss` 时为 OSS 地域，例如 `cn-hangzhou`。 |
| `s3AccessKey` | string | 视情况 | Access key。`oss` 必填。S3 需与 `s3SecretKey` 一起传，或改传 `roleARN`。 |
| `s3SecretKey` | string | 视情况 | Secret key。密钥。 |
| `roleARN` | string | 视情况 | IAM 角色 ARN，用于替代 access key。`oss` 不支持。详见[获取 TiDB 接入信息](#get-tidb-setup-information)。 |
| `s3Endpoint` | string | 否 | 兼容 S3 的存储的 endpoint。使用 `oss` 时必须为空。 |
| `sqsQueueURL` | string | 否 | 事件模式使用的 SQS 标准队列 URL。不接受 FIFO 队列。`oss` 不支持。 |
| `sqsRegion` | string | 否 | SQS 地域。默认：`s3Region`。 |
| `database` | string | 否 | 默认源数据库。不使用 `tableRules` 的任务需要此字段。 |

不要传 `externalID`、`ossInternalEndpoint` 或 `ossLoaderInternalEndpoint`，这些字段由服务端设置。

#### kafkaConsumer（`serviceId` 7） {/* #kafkaconsumer-serviceid-7 */}

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `brokers` | string | 是 | Broker 地址（`host:port`），用逗号分隔。 |
| `authentication` | string（枚举） | 否 | `NONE`（默认）或 `SASL/PLAIN`。 |
| `saslPlain` | object | 视情况 | `{ "username": "...", "password": "..." }`。使用 `SASL/PLAIN` 时必填。`password` 是密钥。 |
| `tlsEncryption` | boolean | 否 | 是否使用 TLS。默认：`false`。 |

数据源会忽略 `topics`、`dataFormat`、`offsetReset`、`maxBatchSizeBytes` 和 `maxBatchWaitSeconds`，请在任务上设置这些字段。

#### mnsOss（`serviceId` 8） {/* #mnsoss-serviceid-8 */}

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `endpoint` | string | 是 | 所在地域的公网 HTTPS MNS endpoint，例如 `https://123456789.mns.cn-hangzhou.aliyuncs.com`。 |
| `region` | string | 是 | 地域，例如 `cn-hangzhou`。 |
| `queueName` | string | 是 | 接收 OSS 事件的 MNS 队列。 |
| `quarantineQueueName` | string | 是 | 存放处理失败消息的队列，必须与 `queueName` 不同。 |
| `bucket` | string | 是 | OSS bucket。 |
| `prefix` | string | 否 | 对象 key 前缀。可以为空；不为空时必须以 `/` 结尾。 |
| `suffix` | string | 否 | 对象 key 后缀。 |
| `accessKeyId` | string | 是 | Access key ID。 |
| `accessKeySecret` | string | 是 | Access key secret。密钥。 |
| `securityToken` | string | 否 | STS token。密钥。 |

### 凭证脱敏 {/* #credential-masking */}

本节所有接口使用同一套脱敏规则：

- 服务端把所有密钥值替换为固定字符串 `******`，列表接口和详情接口规则相同。
- 密钥是指能授予访问权限的值：密码、secret key、session token，或包含 token 的 Webhook URL。
- 标识类信息保持可见：host、端口、用户名、access key ID、角色 ARN、bucket、地域和队列。检查配置时需要这些信息。
- 空密钥保持为空。脱敏后的密钥固定为 `******`，与原长度无关，请不要据此推测密钥长度或内容。
- 本节没有任何结构化字段会返回明文密钥。

各接口的脱敏字段：

| 接口 | 对象 | 脱敏字段 |
|---|---|---|
| [列出数据源](#list-data-sources)、[获取数据源](#get-a-data-source) | `awsCredentials` 的 `serviceArgs` | `secretKey` |
| | `mysqlCredentials`、`postgresCredentials` 的 `serviceArgs` | `password` |
| | `feiShuBot` 的 `serviceArgs` | `url` |
| | `tidbCredentials` 的 `serviceArgs` | `s3SecretKey` |
| | `kafkaConsumer` 的 `serviceArgs` | `saslPlain.password` |
| | `mnsOss` 的 `serviceArgs` | `accessKeySecret`、`securityToken` |

`awsSqsS3` 数据源使用 IAM 角色，没有密钥字段。

传入密钥的规则：

- [更新数据源](#update-a-data-source)会替换全部凭证字段。每个密钥可以传新值，也可以传 `******` 保留已保存的值。
- 只有连接目标不变时，服务端才会保留已保存的密钥。修改了目标字段就必须重新输入密钥，否则请求返回 HTTP 400。这样可以防止把已保存的密码发到新的主机。
- [测试数据源连接](#test-a-data-source-connection)传了 `datasourceId` 时，规则相同。
- [创建数据源](#create-a-data-source)以及不带 `datasourceId` 的测试请求，收到 `******` 时返回 HTTP 400。

各类型的目标字段：

| 类型 | 目标字段 |
|---|---|
| `awsCredentials` | `accessKey` |
| `mysqlCredentials`、`postgresCredentials` | `host`、`port`、`username`、`sslMode` |
| `feiShuBot` | 无。URL 本身就是密钥。 |
| `tidbCredentials` | `storageProvider`、`s3Endpoint`、`s3Region`、`s3AccessKey` |
| `kafkaConsumer` | `brokers`、`authentication`、`tlsEncryption`、`saslPlain.username` |
| `mnsOss` | `endpoint`、`region`、`accessKeyId` |

脱敏只作用于结构化字段。服务端不会对查询历史、查询详情、SQL Task 运行记录和任务流中的 SQL 文本脱敏。SQL 语句中可能包含凭证，例如 `CREATE STAGE` 语句。请把 SQL 文本当作敏感信息处理。
