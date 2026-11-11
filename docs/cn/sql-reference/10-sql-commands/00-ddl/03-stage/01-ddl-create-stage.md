---
title: CREATE STAGE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.941"/>

创建内部或外部 Stage。

完整的 S3 操作流程请从[从存储桶导入数据](/guides/load-data/load/s3)开始。该教程包含认证、Connection 和 Stage 创建、访问验证及数据导入。本页用于查询 Stage 语法和选项。

## 语法

```sql
-- 内部 Stage
CREATE [ OR REPLACE ] STAGE [ IF NOT EXISTS ] <internal_stage_name>
  [ FILE_FORMAT = (
         FORMAT_NAME = '<your-custom-format>'
         | TYPE = { CSV | TSV | NDJSON | PARQUET | ORC | AVRO } [ formatTypeOptions ]
       ) ]
  [ COMMENT = '<string_literal>' ]

-- 外部 Stage
CREATE STAGE [ IF NOT EXISTS ] <external_stage_name>
    externalStageParams
  [ FILE_FORMAT = (
         FORMAT_NAME = '<your-custom-format>'
         | TYPE = { CSV | TSV | NDJSON | PARQUET | ORC | AVRO } [ formatTypeOptions ]
       ) ]
  [ COMMENT = '<string_literal>' ]
```

### externalStageParams

:::tip
对于外部 Stage，建议使用 `CONNECTION` 参数引用预先配置的连接对象，而非内联凭据，以获得更高的安全性与可维护性。
:::

```sql
externalStageParams ::=
  '<protocol>://<location>'
  CONNECTION = (
        <connection_parameters>
  )
|
  CONNECTION = (
        CONNECTION_NAME = '<your-connection-name>'
  );
```

不同存储服务可用的连接参数，请参见 [Connection Parameters](/sql/sql-reference/connect-parameters)。

关于 `CONNECTION_NAME` 的更多信息，请参见 [CREATE CONNECTION](../13-connection/create-connection.md)。

### FILE_FORMAT

详情请参见 [Input & Output File Formats](../../../00-sql-reference/50-file-format-options.md)。

## 访问控制要求

| 权限  | 对象类型 | 描述                                               |
| :---- | :------- | :------------------------------------------------- |
| SUPER | 全局、表 | 操作 Stage（列出、创建、删除 Stage）、目录或共享。 |

创建 Stage 时，执行操作的用户或其 [current_role](/guides/security/access-control/roles) 必须拥有 SUPER [privilege](/guides/security/access-control/privileges)。

## 示例

### 示例 1：创建内部 Stage

以下示例创建名为 _my_internal_stage_ 的内部 Stage：

```sql
CREATE STAGE my_internal_stage;

DESC STAGE my_internal_stage;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│       name        │ stage_type │ storage_type │ url  │ endpoint │ has_credentials │ has_encryption_key │ storage_params │ file_format_options │  creator │         created_on         │ comment │     owner     │
├───────────────────┼────────────┼──────────────┼──────┼──────────┼─────────────────┼────────────────────┼────────────────┼─────────────────────┼──────────┼────────────────────────────┼─────────┼───────────────┤
│ my_internal_stage │ Internal   │ NULL         │ NULL │ NULL     │ false           │ false              │ NULL           │ {"compression":...} │ root@%   │ 2026-06-16 22:21:19.000000 │         │ account_admin │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 示例 2：使用 Connection 创建外部 Stage

以下示例使用 Connection 在 Amazon S3 上创建名为 _my_s3_stage_ 的外部 Stage：

```sql
-- 先创建 Connection
CREATE CONNECTION my_s3_connection
  STORAGE_TYPE = 's3'
  ACCESS_KEY_ID = '<your-access-key-id>'
  SECRET_ACCESS_KEY = '<your-secret-access-key>';

-- 使用 Connection 创建 Stage
CREATE STAGE my_s3_stage
  URL='s3://load/files/'
  CONNECTION = (CONNECTION_NAME = 'my_s3_connection');

DESC STAGE my_s3_stage;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│    name     │ stage_type │ storage_type │       url        │ endpoint │ has_credentials │ has_encryption_key │   storage_params      │ file_format_options │ creator │         created_on         │ comment │     owner     │
├─────────────┼────────────┼──────────────┼──────────────────┼──────────┼─────────────────┼────────────────────┼───────────────────────┼─────────────────────┼─────────┼────────────────────────────┼─────────┼───────────────┤
│ my_s3_stage │ External   │ s3           │ s3://load/files/ │ NULL     │ true            │ false              │ {"bucket":"load",...} │ {"compression":...} │ root@%  │ 2026-06-16 22:21:19.000000 │         │ account_admin │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 示例 3：使用 AWS IAM 用户创建外部 Stage

此示例使用 IAM 用户的访问密钥。Databend Cloud 推荐使用 [IAM 角色认证](/guides/cloud/security/iam-role/aws)，无需在 Databend 中保存访问密钥。

#### 准备 AWS 访问权限 {/* #步骤-1为-s3-存储桶创建访问策略 */}

<span id="步骤-2创建-iam-用户" />

按照[配置访问密钥](/guides/load-data/load/s3#access-keys)创建限定前缀的只读策略、IAM 用户和访问密钥。AWS 侧配置统一在该教程中维护，无需为此示例再创建一套策略或用户。

#### 创建 Stage {/* #步骤-3创建外部-stage */}

在 Connection 中使用 IAM 用户的凭证。此示例与导入教程使用相同的存储桶、前缀和 SQL 对象名称。请将示例值替换为您的实际配置。不要将真实密钥放入共享示例、截图或代码仓库。

```sql
CREATE CONNECTION s3_books_conn
  STORAGE_TYPE = 's3'
  ACCESS_KEY_ID = '<your-access-key-id>'
  SECRET_ACCESS_KEY = '<your-secret-access-key>'
  REGION = 'us-east-2';

CREATE STAGE s3_books_stage
  URL = 's3://databend-toronto/load/'
  CONNECTION = (CONNECTION_NAME = 's3_books_conn');
```

如果已经在导入教程中创建这些对象，请直接复用。接下来请[验证 S3 访问](/guides/load-data/load/s3#verify-s3-access)，再[导入示例数据](/guides/load-data/load/s3#load-sample-data)。

### 示例 4：在 Cloudflare R2 上创建外部 Stage

[Cloudflare R2](https://www.cloudflare.com/products/r2/) 是 Cloudflare 推出的对象存储服务，与 Amazon AWS S3 完全兼容。以下示例在 Cloudflare R2 上创建名为 _r2_stage_ 的外部 Stage。

#### 步骤 1：创建存储桶

以下步骤在 Cloudflare R2 上创建名为 _databend_ 的存储桶：

1. 登录 Cloudflare 控制台，在左侧导航栏选择 **R2**。
2. 点击 **创建存储桶**，设置存储桶名称为 _databend_。创建成功后，在存储桶详情页即可在存储桶名称下方看到存储桶端点。

#### 步骤 2：创建 R2 API 令牌

以下步骤创建包含 Access Key ID 和 Secret Access Key 的 R2 API 令牌：

1. 在 **R2** > **概述** 页面点击 **管理 R2 API 令牌**。
2. 点击 **创建 API 令牌**。
3. 配置令牌时选择所需权限，并按需设置 **TTL**。
4. 点击 **创建 API 令牌** 获取 Access Key ID 和 Secret Access Key，复制并妥善保存。

#### 步骤 3：创建外部 Stage {/* #步骤-3创建外部-stage-1 */}

使用已生成的 Access Key ID 和 Secret Access Key 创建名为 _r2_stage_ 的外部 Stage。

```sql
-- 先创建 Connection
CREATE CONNECTION r2_connection
  STORAGE_TYPE = 's3'
  REGION = 'auto'
  ENDPOINT_URL = '<your-bucket-endpoint>'
  ACCESS_KEY_ID = '<your-access-key-id>'
  SECRET_ACCESS_KEY = '<your-secret-access-key>';

-- 使用 Connection 创建 Stage
CREATE STAGE r2_stage
  URL='s3://databend/'
  CONNECTION = (CONNECTION_NAME = 'r2_connection');
```
