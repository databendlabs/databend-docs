````
---
title: 创建阶段
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新：v1.2.294"/>

创建内部或外部阶段。

## 语法

```sql
-- 内部阶段
CREATE STAGE [ IF NOT EXISTS ] <internal_stage_name>
  [ FILE_FORMAT = (
         FORMAT_NAME = '<your-custom-format>'
         | TYPE = { CSV | TSV | NDJSON | PARQUET | XML } [ formatTypeOptions ]
       ) ]
  [ COPY_OPTIONS = ( copyOptions ) ]
  [ COMMENT = '<string_literal>' ]

-- 外部阶段
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

有关访问类似Amazon S3存储服务的连接参数，请参见[连接参数](/00-sql-reference/51-connect-parameters.md)。

:::note
要在Amazon S3上创建外部阶段，您还可以使用IAM用户账户，这样您可以为阶段定义细粒度的访问控制，包括指定对特定S3桶的读写访问等操作。请参见[示例3：使用AWS IAM用户创建外部阶段](#example-3-create-external-stage-with-aws-iam-user)。
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

有关访问Azure Blob存储的连接参数，请参见[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Google Cloud Storage" label="Google Cloud存储">

```sql
externalLocation ::=
  'gcs://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问Google Cloud存储的连接参数，请参见[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Alibaba Cloud OSS" label="阿里巴巴云OSS">

```sql
externalLocation ::=
  'oss://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问阿里巴巴云OSS的连接参数，请参见[连接参数](/00-sql-reference/51-connect-parameters.md)。
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

有关访问HDFS的连接参数，请参见[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="WebHDFS" label="WebHDFS">

```sql
externalLocation ::=
  "webhdfs://<endpoint_url>[<path>]"
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问WebHDFS的连接参数，请参见[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Hugging Face" label="Hugging Face">

```sql
externalLocation ::=
  "hf://<repo_id>[<path>]"
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问Hugging Face的连接参数，请参见[连接参数](/00-sql-reference/51-connect-parameters.md)。
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

| 参数                | 描述                                                                                                                         | 是否必须 |
|---------------------|------------------------------------------------------------------------------------------------------------------------------|----------|
| `SIZE_LIMIT = <num>`| 指定给定COPY语句加载的数据的最大行数的数字（> 0）。默认值为`0`                                                               | 可选     |
| `PURGE = <bool>`    | 如果为True，则指定命令将在数据成功加载到表中后清除阶段中的文件。默认值为`false`                                             | 可选     |

## 示例

### 示例 1：创建内部阶段

此示例创建名为*my_internal_stage*的内部阶段：

```sql
CREATE STAGE my_internal_stage;

DESC STAGE my_internal_stage;

name             |stage_type|stage_params                                                  |copy_options                                                                                                                                                  |file_format_options             |number_of_files|creator           |comment|
-----------------+----------+--------------------------------------------------------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------+--------------------------------+---------------+------------------+-------+
my_internal_stage|Internal  |StageParams { storage: Fs(StorageFsConfig { root: "_data" }) }|CopyOptions { on_error: AbortNum(1), size_limit: 0, max_files: 0, split_size: 0, purge: false, single: false, max_file_size: 0, disable_variant_check: false }|Parquet(ParquetFileFormatParams)|              0|'root'@'127.0.0.1'|       |

```

### 示例 2：使用AWS访问密钥创建外部阶段

此示例在Amazon S3上创建名为*my_s3_stage*的外部阶段：

```sql
CREATE STAGE my_s3_stage URL='s3://load/files/' CONNECTION = (ACCESS_KEY_ID = '<your-access-key-id>' SECRET_ACCESS_KEY = '<your-secret-access-key>');

DESC STAGE my_s3_stage;
+-------------+------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+-----------------------------------------------+--------------------------------------------------------------------------------------------------------------------+---------+
| name        | stage_type | stage_params                                                                                                                                                           | copy_options                                  | file_format_options                                                                                                | comment |
+-------------+------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+-----------------------------------------------+--------------------------------------------------------------------------------------------------------------------+---------+
| my_s3_stage | External   | StageParams { storage: S3(StageS3Storage { bucket: "load", path: "/files/", credentials_aws_key_id: "", credentials_aws_secret_key: "", encryption_master_key: "" }) } | CopyOptions { on_error: None, size_limit: 0 } | FileFormatOptions { format: Csv, skip_header: 0, field_delimiter: ",", record_delimiter: "\n", compression: None } |         |
+-------------+------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+-----------------------------------------------+--------------------------------------------------------------------------------------------------------------------+---------+
```

### 示例 3：使用AWS IAM用户创建外部阶段

此示例使用AWS身份和访问管理（IAM）用户在Amazon S3上创建名为*iam_external_stage*的外部阶段。

#### 步骤 1：为S3桶创建访问策略

以下程序为Amazon S3上的桶*databend-toronto*创建一个名为*databend-access*的访问策略：

1. 登录AWS管理控制台，然后选择**服务** > **安全性、身份和合规性** > **IAM**。
2. 在左侧导航窗格中选择**账户设置**，然后在右侧页面的**安全令牌服务（STS）**部分，确保您账户所属的AWS区域的状态为**激活**。
3. 在左侧导航窗格中选择**策略**，然后在右侧页面选择**创建策略**。
4. 点击**JSON**标签，将以下代码复制并粘贴到编辑器中，然后将策略保存为*databend_access*。

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

#### 步骤 2：创建IAM用户

以下程序创建一个名为*databend*的IAM用户，并将访问策略*databend-access*附加到该用户。

1. 在左侧导航窗格中选择**用户**，然后在右侧页面选择**添加用户**。
2. 配置用户：
    - 将用户名设置为*databend*。
    - 在为用户设置权限时，点击**直接附加策略**，然后搜索并选择访问策略*databend-access*。
3. 用户创建后，点击用户名打开详细信息页面并选择**安全凭证**标签。
4. 在**访问密钥**部分，点击**创建访问密钥**。
5. 选择**第三方服务**作为用例，并勾选下方的复选框以确认创建访问密钥。
6. 复制并将生成的访问密钥和密钥保存在安全的地方。

#### 步骤 3：创建外部阶段

使用为IAM用户*databend*生成的访问密钥和密钥创建外部阶段。

```sql
CREATE STAGE iam_external_stage url = 's3://databend-toronto' CONNECTION =(aws_key_id='<your-access-key-id>' aws_secret_key='<your-secret-access-key>' region='us-east-2');
```

### 示例 4：在Cloudflare R2上创建外部阶段

[Cloudflare R2](https://www.cloudflare.com/en-ca/products/r2/)是Cloudflare推出的对象存储服务，完全兼容Amazon的AWS S3服务。此示例在Cloudflare R2上创建名为*r2_stage*的外部阶段。

#### 步骤 1：创建桶

以下程序在Cloudflare R2上创建一个名为*databend*的桶。

1. 登录Cloudflare仪表板，并在左侧导航窗格中选择**R2**。
2. 点击**创建桶**来创建一个桶，并将桶名设置为*databend*。一旦桶成功创建，在查看桶详细信息页面时，您可以在桶名下方找到桶端点。

#### 步骤 2：创建R2 API令牌

以下程序创建一个包含访问密钥ID和密钥的R2 API令牌。

1. 在**R2** > **概览**上点击**管理R2 API令牌**。
2. 点击**创建API令牌**来创建一个API令牌。
3. 在配置API令牌时，选择必要的权限并根据需要设置**TTL**。
4. 点击**创建API令牌**以获取访问密钥ID和密钥。复制并将它们保存在安全的地方。

#### 步骤 3：创建外部阶段

使用创建的访问密钥ID和密钥创建名为*r2_stage*的外部阶段。

```sql
CREATE STAGE r2_stage
  URL='s3://databend/'
  CONNECTION = (
    REGION = 'auto'
    ENDPOINT_URL = '<your-bucket-endpoint>'
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>');
```
````