---
title: 创建阶段
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.339"/>

创建一个内部或外部阶段。

## 语法

```sql
-- 内部阶段
CREATE [ OR REPLACE ] STAGE [ IF NOT EXISTS ] <internal_stage_name>
  [ FILE_FORMAT = (
         FORMAT_NAME = '<your-custom-format>'
         | TYPE = { CSV | TSV | NDJSON | PARQUET | ORC } [ formatTypeOptions ]
       ) ]
  [ COPY_OPTIONS = ( copyOptions ) ]
  [ COMMENT = '<string_literal>' ]

-- 外部阶段
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

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="externalstageparams">

<TabItem value="Amazon S3-compatible Storage" label="Amazon S3类存储服务">

```sql
externalStageParams ::=
  's3://<bucket>[<path/>]'
  CONNECTION = (
        <connection_parameters>
  )
```

关于访问Amazon S3类存储服务的可用连接参数，请参阅[连接参数](/00-sql-reference/51-connect-parameters.md)。

:::note
要创建一个位于Amazon S3的外部阶段，您也可以使用IAM用户账户，这样您可以为阶段定义细粒度的访问控制，包括指定对特定S3桶的读或写访问等操作。请参阅[示例3：使用AWS IAM用户创建外部阶段](#示例3-使用aws-iam-用户创建外部阶段)。
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

关于访问Azure Blob存储的可用连接参数，请参阅[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Google Cloud Storage" label="Google Cloud存储">

```sql
externalLocation ::=
  'gcs://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

关于访问Google Cloud存储的可用连接参数，请参阅[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Alibaba Cloud OSS" label="阿里云OSS">

```sql
externalLocation ::=
  'oss://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

关于访问阿里云OSS的可用连接参数，请参阅[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Tencent Cloud Object Storage" label="腾讯云对象存储">

```sql
externalLocation ::=
  'cos://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

关于访问腾讯云对象存储的可用连接参数，请参阅[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="HDFS" label="HDFS">

```sql
externalLocation ::=
  "hdfs://<endpoint_url>[<path>]"
  CONNECTION = (
        <connection_parameters>
  )
```

关于访问HDFS的可用连接参数，请参阅[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="WebHDFS" label="WebHDFS">

```sql
externalLocation ::=
  "webhdfs://<endpoint_url>[<path>]"
  CONNECTION = (
        <connection_parameters>
  )
```

关于访问WebHDFS的可用连接参数，请参阅[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Hugging Face" label="Hugging Face">

```sql
externalLocation ::=
  "hf://<repo_id>[<path>]"
  CONNECTION = (
        <connection_parameters>
  )
```

关于访问Hugging Face的可用连接参数，请参阅[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>
</Tabs>

### FILE_FORMAT

详情请参阅[输入与输出文件格式](../../../00-sql-reference/50-file-format-options.md)。

### copyOptions

```sql
copyOptions ::=
  [ SIZE_LIMIT = <num> ]
  [ PURGE = <bool> ]
```

| 参数                | 描述                                                                                                                   | 必需性   |
|---------------------|------------------------------------------------------------------------------------------------------------------------|----------|
| `SIZE_LIMIT = <num>` | 指定一个大于0的数字，表示给定COPY语句要加载的最大数据行数。默认值为`0`                                                  | 可选     |
| `PURGE = <bool>`     | 如果为真，则指定命令将在成功将文件加载到表中后清除阶段中的文件。默认值为`false`                                       | 可选     |

## 示例

### 示例1：创建内部阶段

本示例创建一个名为*my_internal_stage*的内部阶段：

```sql
CREATE STAGE my_internal_stage;

DESC STAGE my_internal_stage;

name             |stage_type|stage_params                                                  |copy_options                                                                                                                                                  |file_format_options             |number_of_files|creator           |comment|
-----------------+----------+--------------------------------------------------------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------+--------------------------------+---------------+------------------+-------+
my_internal_stage|Internal  |StageParams { storage: Fs(StorageFsConfig { root: "_data" }) }|CopyOptions { on_error: AbortNum(1), size_limit: 0, max_files: 0, split_size: 0, purge: false, single: false, max_file_size: 0, disable_variant_check: false }|Parquet(ParquetFileFormatParams)|              0|'root'@'127.0.0.1'|       |

```

### 示例2：使用AWS访问密钥创建外部阶段

本示例在Amazon S3上创建一个名为*my_s3_stage*的外部阶段：

```sql
CREATE STAGE my_s3_stage URL='s3://load/files/' CONNECTION = (ACCESS_KEY_ID = '<your-access-key-id>' SECRET_ACCESS_KEY = '<your-secret-access-key>');

DESC STAGE my_s3_stage;
+-------------+------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+-----------------------------------------------+--------------------------------------------------------------------------------------------------------------------+---------+
| name        | stage_type | stage_params                                                                                                                                                           | copy_options                                  | file_format_options                                                                                                | comment |
+-------------+------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+-----------------------------------------------+--------------------------------------------------------------------------------------------------------------------+---------+
| my_s3_stage | External   | StageParams { storage: S3(StageS3Storage { bucket: "load", path: "/files/", credentials_aws_key_id: "", credentials_aws_secret_key: "", encryption_master_key: "" }) } | CopyOptions { on_error: None, size_limit: 0 } | FileFormatOptions { format: Csv, skip_header: 0, field_delimiter: ",", record_delimiter: "\n", compression: None } |         |
+-------------+------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+-----------------------------------------------+--------------------------------------------------------------------------------------------------------------------+---------+
```

### 示例3：使用AWS IAM用户创建外部阶段

本示例使用AWS身份和访问管理(IAM)用户在Amazon S3上创建一个名为*iam_external_stage*的外部阶段。

#### 步骤1：为S3桶创建访问策略

以下步骤为位于Amazon S3的*databend-toronto*桶创建一个名为*databend-access*的访问策略：

1. 登录AWS管理控制台，然后选择**服务** > **安全、身份与合规** > **IAM**。
2. 在左侧导航窗格中选择**账户设置**，然后在右侧页面转到**安全令牌服务(STS)**部分。确保您账户所属的AWS区域的**状态**为**活动**。
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

#### 步骤2：创建IAM用户

以下步骤创建一个名为*databend*的IAM用户，并将访问策略*databend-access*附加到该用户。

1. 在左侧导航窗格中选择**用户**，然后在右侧页面选择**添加用户**。
2. 配置用户：
    - 将用户名设置为*databend*。
    - 在为用户设置权限时，点击**直接附加策略**，然后搜索并选择访问策略*databend-access*。
3. 用户创建完成后，点击用户名打开详情页面，并选择**安全凭证**标签。
4. 在**访问密钥**部分，点击**创建访问密钥**。
5. 为用例选择**第三方服务**，并勾选下面的复选框以确认创建访问密钥。
6. 将生成的访问密钥和秘密访问密钥复制并保存到安全的地方。

#### 步骤3：创建外部阶段

使用为IAM用户*databend*生成的访问密钥和秘密访问密钥创建外部阶段。

```sql
CREATE STAGE iam_external_stage url = 's3://databend-toronto' CONNECTION =(aws_key_id='<your-access-key-id>' aws_secret_key='<your-secret-access-key>' region='us-east-2');
```

### 示例4：在Cloudflare R2上创建外部阶段

[Cloudflare R2](https://www.cloudflare.com/en-ca/products/r2/)是由Cloudflare推出的与Amazon的AWS S3服务完全兼容的对象存储服务。本示例在Cloudflare R2上创建一个名为*r2_stage*的外部阶段。

#### 步骤1：创建桶

以下步骤在Cloudflare R2上创建一个名为*databend*的桶。

1. 登录Cloudflare仪表板，并在左侧导航窗格中选择**R2**。
2. 点击**创建桶**来创建一个桶，并将桶名称设置为*databend*。桶成功创建后，在查看桶详情页面时，您可以在桶名称下方找到桶端点。

#### 步骤2：创建R2 API令牌

以下步骤创建一个包含访问密钥ID和秘密访问密钥的R2 API令牌。

1. 在**R2** > **概览**中点击**管理R2 API令牌**。
2. 点击**创建API令牌**来创建一个API令牌。
3. 在配置API令牌时，选择必要的权限并根据需要设置**TTL**。
4. 点击**创建API令牌**以获取访问密钥ID和秘密访问密钥。将它们复制并保存到安全的地方。

#### 步骤3：创建外部阶段

使用创建的访问密钥ID和秘密访问密钥创建名为*r2_stage*的外部阶段。

```sql
CREATE STAGE r2_stage
  URL='s3://databend/'
  CONNECTION = (
    REGION = 'auto'
    ENDPOINT_URL = '<your-bucket-endpoint>'
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>');
```