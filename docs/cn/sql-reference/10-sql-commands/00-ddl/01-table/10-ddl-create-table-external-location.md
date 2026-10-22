---
title: CREATE EXTERNAL TABLE
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

在自己的 S3 或 S3 兼容存储桶中创建 Fuse 表。Databend Cloud 管理普通表的存储；需要自定义存储位置时，再使用外部表。

完整操作流程请参阅[外部表](/guides/data-management/external-tables)。

## 语法

```sql
CREATE TABLE [IF NOT EXISTS] [db.]table_name (
    <column_name> <data_type> [, ...]
)
's3://<bucket>/<path>/'
CONNECTION = (CONNECTION_NAME = '<connection_name>')
[ S3_STORAGE_CLASS = 'standard' | 'intelligent_tiering' ];
```

| 参数 | 说明 |
|------|------|
| `s3://<bucket>/<path>/` | 表的外部存储位置。 |
| `CONNECTION_NAME` | 已有的存储连接。参阅 [CREATE CONNECTION](../13-connection/create-connection.md)。 |
| `S3_STORAGE_CLASS` | 后续写入使用的可选存储类别。参阅 [S3 存储类别](#s3-storage-class)。 |

也可以在 `CONNECTION = (...)` 中直接提供 [S3 连接参数](../../../00-sql-reference/51-connect-parameters.md)。使用命名连接可以在多个表之间复用凭证。

## S3 存储类别 {/* #s3-storage-class */}

<FunctionDescription description="Introduced or updated: v1.2.955"/>

`S3_STORAGE_CLASS` 支持 `standard` 和 `intelligent_tiering`，不区分大小写。它仅适用于非临时外部 Fuse 表，且存储服务必须支持所选类别。

省略此选项时，表继承数据库已设置的 `DEFAULT_S3_STORAGE_CLASS`。显式指定的表级值优先。继承仅发生在创建表时。

类别选择、数据库默认值和已有表的修改方法，请参阅[选择 S3 存储类别](/guides/data-management/external-tables#s3-storage-class)。

<a id="bucket-permissions"></a>

## S3 兼容存储桶策略要求

连接必须具有外部位置的以下权限。

| 访问类型 | 所需 S3 权限 |
|----------|--------------|
| 读取 | `s3:GetObject`, `s3:ListBucket`, `s3:ListBucketVersions`, `s3:GetObjectVersion` |
| 写入 | `s3:PutObject`, `s3:DeleteObject`, `s3:AbortMultipartUpload`, `s3:DeleteObjectVersion` |

如果存储桶策略按存储类别限制 `s3:PutObject`，策略必须允许所选类别。Databend 检查外部位置的访问权限时会使用实际生效的类别。

## 示例

连接 `my_s3` 必须已存在，且具有存储桶访问权限。

```sql
CREATE TABLE external_events (id INT)
    's3://mybucket/events/'
    CONNECTION = (CONNECTION_NAME = 'my_s3')
    S3_STORAGE_CLASS = 'intelligent_tiering';
```
