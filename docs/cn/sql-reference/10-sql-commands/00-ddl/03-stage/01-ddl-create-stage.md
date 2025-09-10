---
title: CREATE STAGE
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.339"/>

创建内部或外部 Stage。

## 语法

```sql
-- 内部 Stage
CREATE [ OR REPLACE ] STAGE [ IF NOT EXISTS ] <internal_stage_name>
  [ FILE_FORMAT = (
         FORMAT_NAME = '<your-custom-format>'
         | TYPE = { CSV | TSV | NDJSON | PARQUET | ORC } [ formatTypeOptions ]
       ) ]
  [ COPY_OPTIONS = ( copyOptions ) ]
  [ COMMENT = '<string_literal>' ]

-- 外部 Stage
CREATE STAGE [ IF NOT EXISTS ] <external_stage_name>
    externalStageParams
  [ FILE_FORMAT = (
         FORMAT_NAME = '<your-custom-format>'
         | TYPE = { CSV | TSV | NDJSON | PARQUET | ORC } [ formatTypeOptions ]
       ) ]
  [ COPY_OPTIONS = ( copyOptions ) ]
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

不同存储服务可用的连接参数，请参见 [Connection Parameters](/00-sql-reference/51-connect-parameters.md)。

关于 `CONNECTION_NAME` 的更多信息，请参见 [CREATE CONNECTION](../13-connection/create-connection.md)。

### FILE_FORMAT

详情请参见 [Input & Output File Formats](../../../00-sql-reference/50-file-format-options.md)。

### copyOptions

```sql
copyOptions ::=
  [ SIZE_LIMIT = <num> ]
  [ PURGE = <bool> ]
```

| 参数 | 描述 | 是否必须 |
|:---|:---|:---|
| `SIZE_LIMIT = <num>` | 大于 0 的数字，指定单个 COPY 语句最多加载的数据行数。默认为 `0`。 | 可选 |
| `PURGE = <bool>` | 设为 true 表示文件成功加载到表后，命令会清理 Stage 中的文件。默认为 `false`。 | 可选 |


## 访问控制要求

| 权限 | 对象类型 | 描述 |
|:---|:---|:---|
| SUPER | 全局、表 | 操作 Stage（列出、创建、删除 Stage）、目录或共享。 |

创建 Stage 时，执行操作的用户或其 [current_role](/guides/security/access-control/roles) 必须拥有 SUPER [privilege](/guides/security/access-control/privileges)。

## 示例

### 示例 1：创建内部 Stage

以下示例创建名为 *my_internal_stage* 的内部 Stage：

```sql
CREATE STAGE my_internal_stage;

DESC STAGE my_internal_stage;

name             |stage_type|stage_params                                                  |copy_options                                                                                                                                                  |file_format_options             |number_of_files|creator           |comment|
-----------------+----------+--------------------------------------------------------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------+--------------------------------+---------------+------------------+-------+
my_internal_stage|Internal  |StageParams { storage: Fs(StorageFsConfig { root: "_data" }) }|CopyOptions { on_error: AbortNum(1), size_limit: 0, max_files: 0, split_size: 0, purge: false, single: false, max_file_size: 0, disable_variant_check: false }|Parquet(ParquetFileFormatParams)|              0|'root'@'127.0.0.1'|       |

```

### 示例 2：使用 Connection 创建外部 Stage

以下示例使用 Connection 在 Amazon S3 上创建名为 *my_s3_stage* 的外部 Stage：

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
+-------------+------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+-----------------------------------------------+--------------------------------------------------------------------------------------------------------------------+---------+
| name        | stage_type | stage_params                                                                                                                                                           | copy_options                                  | file_format_options                                                                                                | comment |
+-------------+------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+-----------------------------------------------+--------------------------------------------------------------------------------------------------------------------+---------+
| my_s3_stage | External   | StageParams { storage: S3(StageS3Storage { bucket: "load", path: "/files/", credentials_aws_key_id: "", credentials_aws_secret_key: "", encryption_master_key: "" }) } | CopyOptions { on_error: None, size_limit: 0 } | FileFormatOptions { format: Csv, skip_header: 0, field_delimiter: ",", record_delimiter: "\n", compression: None } |         |
+-------------+------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+-----------------------------------------------+--------------------------------------------------------------------------------------------------------------------+---------+
```

### 示例 3：使用 AWS IAM 用户创建外部 Stage

以下示例使用 AWS Identity and Access Management (IAM) 用户在 Amazon S3 上创建名为 *iam_external_stage* 的外部 Stage。

#### 步骤 1：为 S3 存储桶创建访问策略

以下步骤为 Amazon S3 上的存储桶 *databend-toronto* 创建名为 *databend-access* 的访问策略：

1. 登录 AWS 管理控制台，选择 **服务** > **安全性、身份与合规性** > **IAM**。
2. 在左侧导航栏选择 **账户设置**，在右侧页面进入 **安全令牌服务 (STS)** 区域，确保所属 AWS 区域状态为 **活动**。
3. 在左侧导航栏选择 **策略**，在右侧页面点击 **创建策略**。
4. 点击 **JSON** 选项卡，将以下代码复制粘贴到编辑器，并将策略保存为 *databend_access*。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllObjectActions",
      "Effect": "Allow",
      "Action": [
        "s3:*Object"
      ],
      "Resource": "arn:aws:s3:::databend-toronto/*"
    },
    {
      "Sid": "ListObjectsInBucket",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::databend-toronto"
    }
  ]
}
```

#### 步骤 2：创建 IAM 用户

以下步骤创建名为 *databend* 的 IAM 用户，并将访问策略 *databend-access* 附加到该用户：

1. 在左侧导航栏选择 **用户**，在右侧页面点击 **添加用户**。
2. 配置用户：
    - 用户名设为 *databend*。
    - 设置权限时，点击 **直接附加策略**，搜索并选择访问策略 *databend-access*。
3. 用户创建完成后，点击用户名进入详情页，选择 **安全凭证** 选项卡。
4. 在 **访问密钥** 区域，点击 **创建访问密钥**。
5. 用例选择 **第三方服务**，勾选下方复选框确认创建访问密钥。
6. 复制并妥善保存生成的访问密钥和秘密访问密钥。

#### 步骤 3：创建外部 Stage

使用 IAM 角色创建安全性更高的外部 Stage。

```sql
-- 先使用 IAM 角色创建 Connection
CREATE CONNECTION iam_s3_connection
  STORAGE_TYPE = 's3'
  ROLE_ARN = 'arn:aws:iam::123456789012:role/databend-access'
  EXTERNAL_ID = 'my-external-id-123';

-- 使用 Connection 创建 Stage
CREATE STAGE iam_external_stage 
  URL = 's3://databend-toronto' 
  CONNECTION = (CONNECTION_NAME = 'iam_s3_connection');
```

### 示例 4：在 Cloudflare R2 上创建外部 Stage

[Cloudflare R2](https://www.cloudflare.com/zh-cn/products/r2/) 是 Cloudflare 推出的对象存储服务，与 Amazon AWS S3 完全兼容。以下示例在 Cloudflare R2 上创建名为 *r2_stage* 的外部 Stage。

#### 步骤 1：创建存储桶

以下步骤在 Cloudflare R2 上创建名为 *databend* 的存储桶：

1. 登录 Cloudflare 控制台，在左侧导航栏选择 **R2**。
2. 点击 **创建存储桶**，设置存储桶名称为 *databend*。创建成功后，在存储桶详情页即可在存储桶名称下方看到存储桶端点。

#### 步骤 2：创建 R2 API 令牌

以下步骤创建包含 Access Key ID 和 Secret Access Key 的 R2 API 令牌：

1. 在 **R2** > **概述** 页面点击 **管理 R2 API 令牌**。
2. 点击 **创建 API 令牌**。
3. 配置令牌时选择所需权限，并按需设置 **TTL**。
4. 点击 **创建 API 令牌** 获取 Access Key ID 和 Secret Access Key，复制并妥善保存。

#### 步骤 3：创建外部 Stage

使用已生成的 Access Key ID 和 Secret Access Key 创建名为 *r2_stage* 的外部 Stage。

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