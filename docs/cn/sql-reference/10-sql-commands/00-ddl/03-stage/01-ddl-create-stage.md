---
title: 创建 Stage
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.339"/>

创建内部或外部 Stage。

## 语法

```sql
-- 内部 Stage
CREATE [ OR REPLACE ] STAGE [ IF NOT EXISTS ] <internal_stage_name>
  [ FILE_FORMAT = (
         FORMAT_NAME = '<your-custom-format>'
         | TYPE = { CSV | TSV | NDJSON | PARQUET | XML } [ formatTypeOptions ]
       ) ]
  [ COPY_OPTIONS = ( copyOptions ) ]
  [ COMMENT = '<string_literal>' ]

-- 外部 Stage
CREATE STAGE [ IF NOT EXISTS ] <external_stage_name>
    externalStageParams
  [ FILE_FORMAT = (
         FORMAT_NAME = '<your-custom-format>'
         | TYPE = { CSV | TSV | NDJSON | PARQUET | XML } [ formatTypeOptions ]
       ) ]
  [ COPY_OPTIONS = ( copyOptions ) ]
  [ COMMENT = '<string_literal>' ]
```

### externalStageParams

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="externalstageparams">

<TabItem value="Amazon S3-compatible Storage" label="类似Amazon S3的存储服务">

```sql
externalStageParams ::=
  's3://<bucket>[<path/>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问类似 Amazon S3 存储服务的连接参数，请参见[连接参数](/00-sql-reference/51-connect-parameters.md)。

:::note
要在 Amazon S3 上创建外部 Stage，您也可以使用 IAM 用户账户，使您能够为 Stage 定义细粒度的访问控制，包括指定对特定 S3 桶的读取或写入访问等操作。参见[示例 3：使用 AWS IAM 用户创建外部 Stage](#example-3-create-external-stage-with-aws-iam-user)。
:::
</TabItem>

<TabItem value="Azure Blob Storage" label="Azure Blob存储">

```sql
externalStageParams ::=
  'azblob://<container>[<path/>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 Azure Blob 存储的连接参数，请参见[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Google Cloud Storage" label="Google Cloud存储">

```sql
externalLocation ::=
  'gcs://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 Google Cloud 存储的连接参数，请参见[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Alibaba Cloud OSS" label="阿里云OSS">

```sql
externalLocation ::=
  'oss://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问阿里云 OSS 的连接参数，请参见[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Tencent Cloud Object Storage" label="腾讯云对象存储">

```sql
externalLocation ::=
  'cos://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问腾讯云对象存储的连接参数，请参见[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="HDFS" label="HDFS">

```sql
externalLocation ::=
  "hdfs://<endpoint_url>[<path>]"
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 HDFS 的连接参数，请参见[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="WebHDFS" label="WebHDFS">

```sql
externalLocation ::=
  "webhdfs://<endpoint_url>[<path>]"
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 WebHDFS 的连接参数，请参见[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Hugging Face" label="Hugging Face">

```sql
externalLocation ::=
  "hf://<repo_id>[<path>]"
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 Hugging Face 的连接参数，请参见[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>
</Tabs>

### FILE_FORMAT

有关详细信息，请参见[输入和输出文件格式](../../../00-sql-reference/50-file-format-options.md)。

### copyOptions

```sql
copyOptions ::=
  [ SIZE_LIMIT = <num> ]
  [ PURGE = <bool> ]
```

| 参数                 | 描述                                                                          | 是否必需 |
| -------------------- | ----------------------------------------------------------------------------- | -------- |
| `SIZE_LIMIT = <num>` | 指定给定 COPY 语句加载的数据的最大行数的数字（> 0）。默认值为`0`              | 可选     |
| `PURGE = <bool>`     | True 指定如果文件成功加载到表中，则命令将清除 Stage 中的文件。默认值为`false` | 可选     |

## 示例

### 示例 1：创建内部 Stage

此示例创建一个名为*my_internal_stage*的内部 Stage：

```sql
CREATE STAGE my_internal_stage;

DESC STAGE my_internal_stage;
```

### 示例 2：使用 AWS 访问密钥创建外部 Stage

此示例在 Amazon S3 上创建名为 _my_s3_stage_ 的外部 Stage：

```sql
CREATE STAGE my_s3_stage URL='s3://load/files/' CONNECTION = (ACCESS_KEY_ID = '<your-access-key-id>' SECRET_ACCESS_KEY = '<your-secret-access-key>');

DESC STAGE my_s3_stage;
+-------------+------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+-----------------------------------------------+--------------------------------------------------------------------------------------------------------------------+---------+
| name        | stage_type | stage_params                                                                                                                                                           | copy_options                                  | file_format_options                                                                                                | comment |
+-------------+------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+-----------------------------------------------+--------------------------------------------------------------------------------------------------------------------+---------+
| my_s3_stage | External   | StageParams { storage: S3(StageS3Storage { bucket: "load", path: "/files/", credentials_aws_key_id: "", credentials_aws_secret_key: "", encryption_master_key: "" }) } | CopyOptions { on_error: None, size_limit: 0 } | FileFormatOptions { format: Csv, skip_header: 0, field_delimiter: ",", record_delimiter: "\n", compression: None } |         |
+-------------+------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+-----------------------------------------------+--------------------------------------------------------------------------------------------------------------------+---------+
```

### 示例 3：使用 AWS IAM 用户创建外部 Stage

此示例使用 AWS 身份和访问管理（IAM）用户在 Amazon S3 上创建名为 _iam_external_stage_ 的外部 Stage。

#### 步骤 1：为 S3 桶创建访问策略

以下程序为 Amazon S3 上的桶 _databend-toronto_ 创建名为 _databend-access_ 的访问策略：

1. 登录 AWS 管理控制台，然后选择 **服务** > **安全性、身份与合规性** > **IAM**。
2. 在左侧导航窗格中选择 **账户设置**，并在右侧页面的 **安全令牌服务（STS）** 部分确保您账户所属的 AWS 区域状态为 **激活**。
3. 在左侧导航窗格中选择 **策略**，然后在右侧页面选择 **创建策略**。
4. 点击 **JSON** 标签，将以下代码复制并粘贴到编辑器中，然后将策略保存为 _databend_access_。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllObjectActions",
      "Effect": "Allow",
      "Action": ["s3:*Object"],
      "Resource": "arn:aws:s3:::databend-toronto/*"
    },
    {
      "Sid": "ListObjectsInBucket",
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::databend-toronto"
    }
  ]
}
```

#### 步骤 2：创建 IAM 用户

以下程序创建名为 _databend_ 的 IAM 用户，并将访问策略 _databend-access_ 附加到该用户。

1. 在左侧导航窗格中选择 **用户**，然后在右侧页面选择 **添加用户**。
2. 配置用户：
   - 将用户名设置为 _databend_。
   - 在为用户设置权限时，点击 **直接附加策略**，然后搜索并选择访问策略 _databend-access_。
3. 用户创建后，点击用户名打开详细信息页面并选择 **安全凭证** 标签。
4. 在 **访问密钥** 部分，点击 **创建访问密钥**。
5. 选择 **第三方服务** 作为用例，并勾选下方复选框以确认创建访问密钥。
6. 将生成的访问密钥和秘密访问密钥复制并保存到安全的地方。

#### 步骤 3：创建外部 Stage

使用为 IAM 用户 _databend_ 生成的访问密钥和秘密访问密钥创建外部 Stage。

```sql
CREATE STAGE iam_external_stage url = 's3://databend-toronto' CONNECTION =(aws_key_id='<your-access-key-id>' aws_secret_key='<your-secret-access-key>' region='us-east-2');
```

### 示例 4：在 Cloudflare R2 上创建外部 Stage

[Cloudflare R2](https://www.cloudflare.com/en-ca/products/r2/) 是 Cloudflare 推出的对象存储服务，完全兼容 Amazon 的 AWS S3 服务。此示例在 Cloudflare R2 上创建名为 _r2_stage_ 的外部 Stage。

#### 步骤 1：创建桶

以下程序在 Cloudflare R2 上创建名为 _databend_ 的桶。

1. 登录 Cloudflare 仪表板，并在左侧导航窗格中选择 **R2**。
2. 点击 **创建桶** 来创建一个桶，并将桶名称设置为 _databend_。一旦桶成功创建，当您查看桶详细信息页面时可以在桶名称下方找到桶端点。

#### 步骤 2：创建 R2 API 令牌

以下步骤创建了一个包含访问密钥 ID 和密钥访问密钥的 R2 API 令牌。

1. 点击 **R2** > **概览** 上的 **管理 R2 API 令牌**。
2. 点击 **创建 API 令牌** 来创建一个 API 令牌。
3. 配置 API 令牌时，选择必要的权限并根据需要设置 **TTL**。
4. 点击 **创建 API 令牌** 来获取访问密钥 ID 和密钥访问密钥。复制并将它们保存到安全的地方。

#### 步骤 3：创建外部 Stage

使用创建的访问密钥 ID 和密钥访问密钥来创建一个名为 _r2_stage_ 的外部 Stage。

```sql
CREATE STAGE r2_stage
  URL='s3://databend/'
  CONNECTION = (
    REGION = 'auto'
    ENDPOINT_URL = '<your-bucket-endpoint>'
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>');
```
