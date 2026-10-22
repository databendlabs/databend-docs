---
title: CREATE EXTERNAL TABLE
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

`CREATE TABLE ... CONNECTION = (...)` 语句在 S3 兼容存储桶中创建 Fuse 表，而不是使用服务端默认存储。

## 优势

- 您可以确定表数据的存储位置。
- 利用高性能存储，如 [Amazon S3 Express One Zone](https://aws.amazon.com/s3/storage-classes/express-one-zone/)，以提高性能。

## 语法

```sql
CREATE TABLE [IF NOT EXISTS] [db.]table_name (
    <column_name> <data_type> [NOT NULL | NULL] [{ DEFAULT <expr> }],
    <column_name> <data_type> [NOT NULL | NULL] [{ DEFAULT <expr> }],
    ...
)
's3://<bucket>/[<path>]'
CONNECTION = (
    ENDPOINT_URL = 'https://<endpoint-URL>'
    ACCESS_KEY_ID = '<your-access-key-ID>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
    REGION = '<region-name>'
    ENABLE_VIRTUAL_HOST_STYLE = 'true' | 'false'
)
|
CONNECTION = (
    CONNECTION_NAME = '<your-connection-name>'
)
[ S3_STORAGE_CLASS = 'standard' | 'intelligent_tiering' ];
```

连接参数：

| Parameter                 | Description                                                                                                                                                      | Required |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `s3://<bucket>/[<path>]`  | 文件位于指定的外部位置（类 S3 存储桶）                                                                                                                           | YES      |
| ENDPOINT_URL              | 以 "https://" 开头的存储桶 endpoint URL。要使用以 "http://" 开头的 URL，请在文件 `databend-query-node.toml` 的 [storage] 块中将 `allow_insecure` 设置为 `true`。 | Optional |
| ACCESS_KEY_ID             | 用于连接 AWS S3 兼容对象存储的访问密钥 ID。如果未提供，Databend 将以匿名方式访问存储桶。                                                                         | Optional |
| SECRET_ACCESS_KEY         | 用于连接 AWS S3 兼容对象存储的密钥。                                                                                                                             | Optional |
| REGION                    | AWS 区域名称。例如，us-east-1。                                                                                                                                  | Optional |
| ENABLE_VIRTUAL_HOST_STYLE | 如果您使用虚拟主机来寻址存储桶，请将其设置为 "true"。                                                                                                            | Optional |

有关 `CONNECTION_NAME` 的更多信息，请参见 [CREATE CONNECTION](../13-connection/create-connection.md)

## S3 存储类别 {/* #s3-storage-class */}

使用 `S3_STORAGE_CLASS` 为非临时外部 Fuse 表后续写入的数据指定 S3 存储类别。表数据在 S3 中以对象（S3 Object）形式存储。取值不区分大小写：

| 值 | S3 存储类别 |
|----|-------------|
| `standard` | S3 Standard |
| `intelligent_tiering` | S3 Intelligent-Tiering |

此选项仅对 S3 及 S3 兼容存储生效。存储服务必须支持所选的存储类别。

### 数据库默认值与表级覆盖

- 使用 [CREATE DATABASE](../00-database/ddl-create-database.md) 或 [ALTER DATABASE](../00-database/ddl-alter-database.md) 设置 `DEFAULT_S3_STORAGE_CLASS`。
- 新建非临时外部 Fuse 表时，表会将此默认值复制到表选项中。显式指定的外部位置和从数据库默认连接及路径继承的外部位置均适用。
- 显式指定的 `S3_STORAGE_CLASS` 优先于数据库默认值。
- 后续更改数据库默认值不会影响已有表。
- `ALTER TABLE ... SET OPTIONS` 仅更改后续写入的存储类别，不会更改已写入的表数据的存储类别。
- `ALTER TABLE ... UNSET OPTIONS(S3_STORAGE_CLASS)` 删除表的 `S3_STORAGE_CLASS` 选项，无论该值是显式设置的，还是从数据库继承的。数据库默认值只在创建表时复制到表选项中，不会在每次写入时重新读取。`UNSET` 不会让表恢复使用当前数据库默认值；后续写入不再通过此表选项指定存储类别。
- 如果要确保后续写入使用某个存储类别，请使用 `SET OPTIONS` 显式设置该类别，而不是使用 `UNSET`。

### 限制

- 内部表不继承此默认值，其 S3 存储类别由服务端 `[storage.s3].storage_class` 配置决定。没有外部位置时，`CREATE TABLE` 和 `ALTER TABLE ... SET OPTIONS` 会拒绝 `S3_STORAGE_CLASS`。
- 临时表不继承此默认值，也不接受显式指定的 `S3_STORAGE_CLASS`。临时 S3 表使用 `STANDARD`。
- 非 Fuse 引擎不支持此选项。
- 物化视图（Materialized View）和动态表（Dynamic Table）目前仅使用内部存储。它们不会继承数据库默认值或源表的存储类别，也不接受显式指定的 `S3_STORAGE_CLASS`。

## S3 兼容存储桶策略要求

外部位置 S3 存储桶必须通过 S3 存储桶策略授予以下权限：

**只读访问权限：**

- `s3:GetObject`：允许从存储桶读取对象。
- `s3:ListBucket`：允许列出存储桶中的对象。
- `s3:ListBucketVersions`：允许列出存储桶中的对象版本。
- `s3:GetObjectVersion`：允许检索对象的特定版本。

**可写访问权限：**

- `s3:PutObject`：允许将对象写入存储桶。
- `s3:DeleteObject`：允许删除存储桶中的对象。
- `s3:AbortMultipartUpload`：允许中止分段上传。
- `s3:DeleteObjectVersion`：允许删除对象的特定版本。

Databend 使用实际生效的存储类别检查外部位置的权限。如果存储桶策略按存储类别限制 `s3:PutObject`，策略必须允许表选项或数据库默认值所选择的存储类别。

## 示例

:::info

在使用 `SHOW CREATE TABLE` 命令之前，您需要将 `hide_options_in_show_create_table` 变量设置为 `0`。

```sql
SET GLOBAL hide_options_in_show_create_table = 0;
```

:::

### 创建具有外部位置的表

创建一个表，并将数据存储在外部位置，例如 Amazon S3：

```sql
-- 创建一个名为 `mytable` 的表，并指定位置 `s3://testbucket/admin/data/` 用于数据存储
CREATE TABLE mytable (
  a INT
)
's3://testbucket/admin/data/'
CONNECTION = (
  ACCESS_KEY_ID = '<your_aws_key_id>',
  SECRET_ACCESS_KEY = '<your_aws_secret_key>',
  ENDPOINT_URL = 'https://s3.amazonaws.com'
);

-- 显示表结构
SHOW CREATE TABLE mytable;

CREATE TABLE mytable (
  a INT NULL
)
ENGINE = FUSE
COMPRESSION = 'zstd'
STORAGE_FORMAT = 'parquet'
LOCATION = 's3 | bucket=testbucket,root=/admin/data/,endpoint=https://s3.amazonaws.com';
```

### 设置和更改 S3 存储类别

连接 `s3_connection` 必须已存在，且具有存储桶访问权限。

```sql
CREATE OR REPLACE DATABASE external_analytics OPTIONS (
    DEFAULT_S3_STORAGE_CLASS = 'intelligent_tiering'
);

CREATE OR REPLACE TABLE external_analytics.events (id INT)
    's3://testbucket/events/'
    CONNECTION = (CONNECTION_NAME = 's3_connection')
    S3_STORAGE_CLASS = 'standard';

ALTER TABLE external_analytics.events SET OPTIONS (
    S3_STORAGE_CLASS = 'intelligent_tiering'
);

ALTER TABLE external_analytics.events UNSET OPTIONS (S3_STORAGE_CLASS);
```

创建表时，显式指定的 `standard` 会覆盖数据库默认值。如果省略此表选项，表会继承 `intelligent_tiering`。`SET OPTIONS` 只影响后续写入，不会更改已写入的表数据的存储类别。最后的 `UNSET OPTIONS` 删除表的 `S3_STORAGE_CLASS` 选项，不会恢复数据库的 `intelligent_tiering` 默认值，也不等同于设置为 `standard`。要确保后续写入使用 S3 Standard，请显式执行 `ALTER TABLE external_analytics.events SET OPTIONS(S3_STORAGE_CLASS = 'standard')`。

### 使用连接创建表

或者，您可以创建一个连接并使用它来创建表：

```sql
-- 为 S3 凭据创建一个名为 `s3_connection` 的连接
CREATE CONNECTION s3_connection
  STORAGE_TYPE = 's3'
  SECRET_ACCESS_KEY = '<your-secret-access-key>'
  ACCESS_KEY_ID = '<your-access-key-id>';

CREATE TABLE mytable (
  a INT
)
's3://testbucket/admin/data/'
CONNECTION = (
  CONNECTION_NAME = 's3_connection'
);

-- 显示表结构
SHOW CREATE TABLE mytable;

CREATE TABLE mytable (
  a INT NULL
)
ENGINE = FUSE
COMPRESSION = 'zstd'
STORAGE_FORMAT = 'parquet'
LOCATION = 's3 | bucket=testbucket,root=/admin/data/,endpoint=https://s3.amazonaws.com';
```
