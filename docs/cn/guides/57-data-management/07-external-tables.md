---
title: 外部表
sidebar_position: 7
---

import FunctionDescription from '@site/src/components/FunctionDescription';

Databend Cloud 默认管理表的存储。使用普通表时，无需配置存储桶或存储类别。

如果需要将表存储在自己的 S3 存储桶中，可以使用**外部表**。外部表使用 Fuse 引擎，支持 SQL 读写。它不用于直接查询存储桶中已有的任意文件。如需将已有文件加载到表中，请使用 [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table)。

## 准备工作

- 准备 S3 存储桶和表的存储路径。
- 授权 Databend Cloud 访问存储桶。使用 AWS 时，请先[配置 IAM 角色](/guides/cloud/security/iam-role)。
- 确保角色具有[所需的存储桶权限](/sql/sql-commands/ddl/table/ddl-create-table-external-location#bucket-permissions)。

示例使用 `mybucket`，请将其替换为自己的存储桶名称。在 Databend Cloud 工作表或已连接的 SQL 客户端中执行 SQL。

## 创建外部表

使用 IAM 角色创建可复用的连接。将 `<your-role-arn>` 替换为准备好的角色 ARN。

```sql
CREATE CONNECTION my_s3
    STORAGE_TYPE = 's3'
    ROLE_ARN = '<your-role-arn>';
```

创建数据库，并在建表时指定 S3 位置。

```sql
CREATE DATABASE external_analytics;

CREATE TABLE external_analytics.events (id INT, event_time TIMESTAMP)
    's3://mybucket/events/'
    CONNECTION = (CONNECTION_NAME = 'my_s3');

INSERT INTO external_analytics.events VALUES (1, '2026-01-01 00:00:00');
SELECT * FROM external_analytics.events;
```

如需使用访问密钥或 S3 兼容服务，请参阅 [CREATE CONNECTION](/sql/sql-commands/ddl/connection/create-connection)。

## 选择 S3 存储类别 {/* #s3-storage-class */}

<FunctionDescription description="Introduced or updated: v1.2.955"/>

可以为外部表后续写入的数据选择存储类别。取值不区分大小写。

| 值 | 适用场景 |
|----|----------|
| `standard` | 对于频繁访问的数据，使用 S3 Standard。 |
| `intelligent_tiering` | 由 S3 Intelligent-Tiering 根据访问模式管理存储层级。选择前请查看 [AWS 价格和使用条件](https://aws.amazon.com/s3/storage-classes/intelligent-tiering/)。 |

可以在表上设置存储类别，也可以在数据库上设置默认值。表级设置优先于数据库默认值。S3 兼容服务必须支持所选类别。修改只影响后续写入，不会更改已有 S3 对象，也不会删除表数据。

### 为表设置存储类别

创建表时添加 `S3_STORAGE_CLASS`。

```sql
CREATE TABLE external_analytics.archive_events (id INT)
    's3://mybucket/archive_events/'
    CONNECTION = (CONNECTION_NAME = 'my_s3')
    S3_STORAGE_CLASS = 'intelligent_tiering';
```

如需修改或取消已有表的设置，使用 `ALTER TABLE`，无需重建表。

```sql
-- Use Intelligent-Tiering for future writes.
ALTER TABLE external_analytics.events SET OPTIONS (S3_STORAGE_CLASS = 'intelligent_tiering');

-- Use S3 Standard for future writes.
ALTER TABLE external_analytics.events SET OPTIONS (S3_STORAGE_CLASS = 'standard');

-- Remove the stored table option.
ALTER TABLE external_analytics.events UNSET OPTIONS (S3_STORAGE_CLASS);
```

`UNSET` 恢复默认存储行为，**不会**重新继承数据库默认值。如需确保使用 S3 Standard，请显式设置 `standard`。

用以下语句查看已保存的选项。

```sql
SET hide_options_in_show_create_table = 0;
SHOW CREATE TABLE external_analytics.events;
```

执行 `UNSET` 后，表定义中不再包含 `S3_STORAGE_CLASS`。

### 设置数据库默认值

在数据库上设置 `DEFAULT_S3_STORAGE_CLASS`，无需在每次新建外部表时重复指定类别。

```sql
ALTER DATABASE external_analytics SET OPTIONS (
    DEFAULT_S3_STORAGE_CLASS = 'intelligent_tiering'
);

CREATE TABLE external_analytics.daily_events (id INT)
    's3://mybucket/daily_events/'
    CONNECTION = (CONNECTION_NAME = 'my_s3');
```

新表继承 `intelligent_tiering`。

也可以在创建数据库时同时设置连接、路径和类别。此后创建的表使用数据库的默认外部存储，无需再指定位置。

```sql
CREATE DATABASE external_logs OPTIONS (
    DEFAULT_STORAGE_CONNECTION = 'my_s3',
    DEFAULT_STORAGE_PATH = 's3://mybucket/logs/',
    DEFAULT_S3_STORAGE_CLASS = 'intelligent_tiering'
);

CREATE TABLE external_logs.app_events (id INT);
```

单独设置 `DEFAULT_S3_STORAGE_CLASS` 不会将表变为外部表。表必须显式指定外部位置，或从数据库继承外部位置。

修改数据库默认值只影响新表。如需改回 S3 Standard，请分别修改数据库默认值和每个已有表。

```sql
ALTER DATABASE external_analytics SET OPTIONS (DEFAULT_S3_STORAGE_CLASS = 'standard');
ALTER TABLE external_analytics.daily_events SET OPTIONS (S3_STORAGE_CLASS = 'standard');
```

### 限制和权限错误

- 存储类别选项仅适用于使用 S3 或 S3 兼容存储的非临时外部 Fuse 表。
- 内部表和临时表不继承数据库的存储类别。为这些表显式设置 `S3_STORAGE_CLASS` 会报错。
- 物化视图和动态表使用内部存储，不继承数据库或源表的存储类别，也不接受 `S3_STORAGE_CLASS`。
- 如果存储桶策略按存储类别限制 `s3:PutObject`，请允许表或数据库所选的类别。Databend 检查外部位置的访问权限时会使用该类别。

## SQL 参考

- [CREATE EXTERNAL TABLE](/sql/sql-commands/ddl/table/ddl-create-table-external-location)
- [CREATE DATABASE](/sql/sql-commands/ddl/database/ddl-create-database)
- [ALTER DATABASE](/sql/sql-commands/ddl/database/ddl-alter-database)
- [ALTER TABLE](/sql/sql-commands/ddl/table/alter-table#fuse-engine-options)
