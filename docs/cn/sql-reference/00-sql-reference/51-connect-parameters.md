---
title: 连接参数
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.294"/>

连接参数是用于建立与外部存储服务（如 Amazon S3）安全连接的键值对。这些参数对于创建 Stage、将数据复制到 Databend 以及查询外部文件等任务至关重要。

有关每个存储服务的具体连接详细信息，请参见下表。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="operating-systems">
<TabItem value="Amazon S3" label="Amazon S3">

下表列出了用于访问类似 Amazon S3 的存储服务的连接参数：

| Parameter                 	| Required? 	| Description                                                  	|
|---------------------------	|-----------	|--------------------------------------------------------------	|
| endpoint_url              	| Yes       	| 类似 Amazon S3 的存储服务的 Endpoint URL。                   	|
| access_key_id             	| Yes       	| 用于标识请求者的 Access Key ID。                              	|
| secret_access_key         	| Yes       	| 用于身份验证的 Secret Access Key。                             	|
| enable_virtual_host_style 	| No        	| 是否使用虚拟主机样式的 URL。默认为 *false*。                  	|
| master_key                	| No        	| 用于高级数据加密的可选 Master Key。                           	|
| region                    	| No        	| Bucket 所在的 AWS 区域。                                     	|
| security_token            	| No        	| 用于临时凭证的安全令牌。                                     	|

:::note
- 如果命令中未指定 **endpoint_url** 参数，则 Databend 默认在 Amazon S3 上创建 Stage。因此，当您在 S3 兼容的对象存储或其他对象存储解决方案上创建外部 Stage 时，请务必包含 **endpoint_url** 参数。

- **region** 参数不是必需的，因为 Databend 可以自动检测区域信息。通常不需要手动为此参数指定值。如果自动检测失败，Databend 将默认使用 'us-east-1' 作为区域。当使用 MinIO 部署 Databend 且未配置区域信息时，它将自动默认使用 'us-east-1'，并且可以正常工作。但是，如果您收到诸如 "region is missing" 或 "The bucket you are trying to access requires a specific endpoint. Please direct all future requests to this particular endpoint" 等错误消息，则需要确定您的区域名称并将其显式分配给 **region** 参数。
:::

```sql title='Examples'
CREATE STAGE my_s3_stage
  's3://my-bucket'
  CONNECTION = (
    ACCESS_KEY_ID = '<your-ak>',
    SECRET_ACCESS_KEY = '<your-sk>'
  );
  
CREATE STAGE my_minio_stage
  's3://databend'
  CONNECTION = (
    ENDPOINT_URL = 'http://localhost:9000',
    ACCESS_KEY_ID = 'ROOTUSER',
    SECRET_ACCESS_KEY = 'CHANGEME123'
  );
```


要访问您的 Amazon S3 Bucket，您还可以指定 AWS IAM 角色和外部 ID 进行身份验证。通过指定 AWS IAM 角色和外部 ID，您可以更精细地控制用户可以访问哪些 S3 Bucket。这意味着如果 IAM 角色已被授予仅访问特定 S3 Bucket 的权限，则用户将只能访问这些 Bucket。外部 ID 可以通过提供额外的验证层来进一步增强安全性。有关更多信息，请参见 https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-role.html

下表列出了使用 AWS IAM 角色身份验证访问 Amazon S3 存储服务的连接参数：

| Parameter    	| Required? 	| Description                                           	|
|--------------	|-----------	|-------------------------------------------------------	|
| endpoint_url 	| No        	| Amazon S3 的 Endpoint URL。                           	|
| role_arn     	| Yes       	| 用于授权访问 S3 的 AWS IAM 角色的 ARN。                 	|
| external_id  	| No        	| 用于增强角色承担安全性的外部 ID。                       	|

```sql title='Examples'
CREATE STAGE my_s3_stage
  's3://my-bucket'
  CONNECTION = (
    ROLE_ARN = 'arn:aws:iam::123456789012:role/my-role',
    EXTERNAL_ID = 'my-external-id'
  );
```

</TabItem>

<TabItem value="Azure Blob" label="Azure Blob">

下表列出了用于访问 Azure Blob Storage 的连接参数：

| Parameter    	 | Required? 	 | Description                                         	 |
|----------------|-------------|-------------------------------------------------------|
| endpoint_url 	 | Yes       	 | Azure Blob Storage 的 Endpoint URL。                	 |
| account_key  	 | Yes       	 | 用于身份验证的 Azure Blob Storage 帐户密钥。          	 |
| account_name 	 | Yes       	 | 用于标识的 Azure Blob Storage 帐户名称。            	 |

```sql title='Examples'
CREATE STAGE my_azure_stage
  'azblob://my-container'
  CONNECTION = (
    ACCOUNT_NAME = 'myaccount',
    ACCOUNT_KEY = 'myaccountkey',
    ENDPOINT_URL = 'https://<your-storage-account-name>.blob.core.windows.net'
  );
```

</TabItem>

<TabItem value="Google GCS" label="Google GCS">

下表列出了用于访问 Google Cloud Storage 的连接参数：

| Parameter    	 | Required? 	 | Description                                         	 |
|----------------|-------------|-------------------------------------------------------|
| credential   	 | Yes       	 | 用于身份验证的 Google Cloud Storage 凭据。            	 |

要获取 `credential`，您可以按照 Google 文档中的主题 [创建服务帐户密钥](https://cloud.google.com/iam/docs/keys-create-delete#creating)
创建并下载服务帐户密钥文件。下载服务帐户密钥文件后，您可以通过以下命令将其转换为 base64 字符串：

```
base64 -i -o ~/Desktop/base64-encoded-key.txt
```

```sql title='Examples'
CREATE STAGE my_gcs_stage
  'gcs://my-bucket'
  CONNECTION = (
    CREDENTIAL = '<your-base64-encoded-credential>'
  );
```

</TabItem>

<TabItem value="Alibaba OSS" label="Alibaba Cloud OSS">

下表列出了用于访问阿里云 OSS 的连接参数：

| Parameter            	| Required? 	| Description                                             	|
|----------------------	|-----------	|---------------------------------------------------------	|
| access_key_id        	| Yes       	| 用于身份验证的阿里云 OSS Access Key ID。                	|
| access_key_secret    	| Yes       	| 用于身份验证的阿里云 OSS Access Key Secret。              	|
| endpoint_url         	| Yes       	| 阿里云 OSS 的 Endpoint URL。                            	|
| presign_endpoint_url 	| No        	| 用于预签名阿里云 OSS URL 的 Endpoint URL。                	|

```sql title='Examples'
CREATE STAGE my_oss_stage
  'oss://my-bucket'
  CONNECTION = (
    ACCESS_KEY_ID = '<your-ak>',
    ACCESS_KEY_SECRET = '<your-sk>',
    ENDPOINT_URL = 'https://<bucket-name>.<region-id>[-internal].aliyuncs.com'
  );
```

</TabItem>

<TabItem value="Tencent COS" label="Tencent COS">

下表列出了用于访问腾讯云对象存储（COS）的连接参数：

| Parameter    	| Required? 	| Description                                                 	|
|--------------	|-----------	|-------------------------------------------------------------	|
| endpoint_url 	| Yes       	| 腾讯云对象存储的 Endpoint URL。                              	|
| secret_id    	| Yes       	| 用于身份验证的腾讯云对象存储 Secret ID。                   	|
| secret_key   	| Yes       	| 用于身份验证的腾讯云对象存储 Secret Key。                  	|

```sql title='Examples'
CREATE STAGE my_cos_stage
  'cos://my-bucket'
  CONNECTION = (
    SECRET_ID = '<your-secret-id>',
    SECRET_KEY = '<your-secret-key>',
    ENDPOINT_URL = '<your-endpoint-url>'
  );
```

</TabItem>

<TabItem value="Hugging Face" label="HuggingFace">

下表列出了用于访问 Hugging Face 的连接参数：

| Parameter | Required?             | Description                                                                                                     |
|-----------|-----------------------|-----------------------------------------------------------------------------------------------------------------|
| repo_type | No (default: dataset) | Hugging Face 仓库的类型。可以是 `dataset` 或 `model`。                                                           |
| revision  | No (default: main)    | Hugging Face URI 的修订版本。可以是仓库的分支、标签或提交。                                                       |
| token     | No                    | 来自 Hugging Face 的 API 令牌，访问私有仓库或某些资源时可能需要。                                                 |

```sql title='Examples'
CREATE STAGE my_huggingface_stage
  'hf://opendal/huggingface-testdata/'
  CONNECTION = (
    REPO_TYPE = 'dataset'
    REVISION = 'main'
  );
```

</TabItem>

</Tabs>