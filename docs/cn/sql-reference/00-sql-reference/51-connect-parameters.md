---
title: 连接参数
---
import FunctionDescription from '@site/src/components/FunctionDescription';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<FunctionDescription description="Introduced or updated: v1.2.294"/>

运行 `CREATE CONNECTION` 时需要给出一组键值对作为连接参数，用来定义可复用的外部连接。创建好连接后，可以在 Stage、COPY 等语句中通过 `CONNECTION = (CONNECTION_NAME = '<connection-name>')` 直接引用。完整语法请参见 [CREATE CONNECTION](../10-sql-commands/00-ddl/13-connection/create-connection.md)。

不同存储服务的连接参数见下表。

<Tabs groupId="operating-systems">
<TabItem value="Amazon S3" label="Amazon S3">

下表列出了访问 Amazon S3 及其兼容存储服务所需的连接参数：

| Parameter                 	| Required? 	| Description                                                  	|
|---------------------------	|-----------	|--------------------------------------------------------------	|
| endpoint_url              	| Yes       	| Amazon S3 兼容存储的 Endpoint URL。                          	|
| access_key_id             	| Yes       	| 请求方的 Access Key ID。                                     	|
| secret_access_key         	| Yes       	| 用于认证的 Secret Access Key。                               	|
| enable_virtual_host_style 	| No        	| 是否使用虚拟主机样式 URL，默认 *false*。                     	|
| master_key                	| No        	| 用于高级加密的 Master Key。                                  	|
| region                    	| No        	| Bucket 所在的 AWS 区域。                                     	|
| security_token            	| No        	| 临时凭证的安全令牌。                                         	|

:::note
- 如果命令里没有 **endpoint_url**，Databend 会默认把 Stage 建在 Amazon S3。因此在 S3 兼容对象存储或其他对象存储上建外部 Stage 时，记得显式填写 **endpoint_url**。

- **region** 通常不需手动填写，Databend 会自动识别区域信息；若识别失败，则回落到 `us-east-1`。例如在 MinIO 未配置区域时仍能正常工作。如果看到 “region is missing” 或 “The bucket you are trying to access requires a specific endpoint...” 之类的错误提示，请确认实际区域并为 **region** 指定正确值。
:::

```sql title='示例'
-- 创建可复用的 Amazon S3 连接
CREATE CONNECTION my_s3_conn
  STORAGE_TYPE = 's3'
  ACCESS_KEY_ID = '<your-ak>'
  SECRET_ACCESS_KEY = '<your-sk>';

-- 创建 Stage 时引用连接
CREATE STAGE my_s3_stage
  URL = 's3://my-bucket'
  CONNECTION = (CONNECTION_NAME = 'my_s3_conn');
  
-- 为 MinIO 等 S3 兼容服务创建连接
CREATE CONNECTION my_minio_conn
  STORAGE_TYPE = 's3'
  ENDPOINT_URL = 'http://localhost:9000'
  ACCESS_KEY_ID = 'ROOTUSER'
  SECRET_ACCESS_KEY = 'CHANGEME123';

CREATE STAGE my_minio_stage
  URL = 's3://databend'
  CONNECTION = (CONNECTION_NAME = 'my_minio_conn');
```

也可以改用 AWS IAM Role 和 External ID 认证，以更细粒度地控制可访问的 S3 Bucket，同时增加额外的安全校验。更多背景请参考 https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-role.html。

下表列出了使用 AWS IAM 角色访问 Amazon S3 的连接参数：

| Parameter    	| Required? 	| Description                                           	|
|--------------	|-----------	|-------------------------------------------------------	|
| endpoint_url 	| No        	| Amazon S3 的 Endpoint URL。                           	|
| role_arn     	| Yes       	| 用于授权访问 S3 的 AWS IAM 角色 ARN。                  	|
| external_id  	| No        	| 用于增强角色授权安全性的 External ID。                	|

```sql title='示例'
-- 使用 IAM 角色创建连接
CREATE CONNECTION my_iam_conn
  STORAGE_TYPE = 's3'
  ROLE_ARN = 'arn:aws:iam::123456789012:role/my-role'
  EXTERNAL_ID = 'my-external-id';

-- 创建 Stage 时引用连接
CREATE STAGE my_iam_stage
  URL = 's3://my-bucket'
  CONNECTION = (CONNECTION_NAME = 'my_iam_conn');
```

</TabItem>

<TabItem value="Azure Blob" label="Azure Blob">

下表列出了访问 Azure Blob Storage 的连接参数：

| Parameter    	 | Required? 	 | Description                                         	 |
|----------------|-------------|-------------------------------------------------------|
| endpoint_url 	 | Yes       	 | Azure Blob Storage 的 Endpoint URL。                	 |
| account_key  	 | Yes       	 | Azure Blob Storage 帐户密钥。                          |
| account_name 	 | Yes       	 | Azure Blob Storage 帐户名称。                          |

```sql title='示例'
-- 创建 Azure Blob Storage 连接
CREATE CONNECTION my_azure_conn
  STORAGE_TYPE = 'azblob'
  ACCOUNT_NAME = 'myaccount'
  ACCOUNT_KEY = 'myaccountkey'
  ENDPOINT_URL = 'https://<your-storage-account-name>.blob.core.windows.net';

-- 创建 Stage 并引用该连接
CREATE STAGE my_azure_stage
  URL = 'azblob://my-container'
  CONNECTION = (CONNECTION_NAME = 'my_azure_conn');
```

</TabItem>

<TabItem value="Google GCS" label="Google GCS">

下表列出了访问 Google Cloud Storage 的连接参数：

| Parameter    	 | Required? 	 | Description                                         	 |
|----------------|-------------|-------------------------------------------------------|
| credential   	 | Yes       	 | 用于认证的 Google Cloud Storage 凭证。               	 |

可以按照 Google 文档 [Create a service account key](https://cloud.google.com/iam/docs/keys-create-delete#creating) 生成服务账号密钥文件，并用下面的命令把它转成 base64：

```
base64 -i <key.json> -o ~/Desktop/base64-encoded-key.txt
```

```sql title='示例'
-- 创建 GCS 连接
CREATE CONNECTION my_gcs_conn
  STORAGE_TYPE = 'gcs'
  CREDENTIAL = '<your-base64-encoded-credential>';

-- 创建 Stage 时引用连接
CREATE STAGE my_gcs_stage
  URL = 'gcs://my-bucket'
  CONNECTION = (CONNECTION_NAME = 'my_gcs_conn');
```

</TabItem>

<TabItem value="Alibaba OSS" label="Alibaba Cloud OSS">

下表列出了访问阿里云 OSS 的连接参数：

| Parameter            	| Required? 	| Description                                             	|
|----------------------	|-----------	|---------------------------------------------------------	|
| access_key_id        	| Yes       	| 阿里云 OSS Access Key ID。                              	|
| access_key_secret    	| Yes       	| 阿里云 OSS Access Key Secret。                          	|
| endpoint_url         	| Yes       	| 阿里云 OSS 的 Endpoint URL。                            	|
| presign_endpoint_url 	| No        	| 用于预签名 URL 的 Endpoint。                            	|

```sql title='示例'
-- 创建阿里云 OSS 连接
CREATE CONNECTION my_oss_conn
  STORAGE_TYPE = 'oss'
  ACCESS_KEY_ID = '<your-ak>'
  ACCESS_KEY_SECRET = '<your-sk>'
  ENDPOINT_URL = 'https://<bucket-name>.<region-id>[-internal].aliyuncs.com';

-- 创建 Stage 并引用该连接
CREATE STAGE my_oss_stage
  URL = 'oss://my-bucket'
  CONNECTION = (CONNECTION_NAME = 'my_oss_conn');
```

</TabItem>

<TabItem value="Tencent COS" label="Tencent COS">

下表列出了访问腾讯云对象存储（COS）的连接参数：

| Parameter    	| Required? 	| Description                                                 	|
|--------------	|-----------	|-------------------------------------------------------------	|
| endpoint_url 	| Yes       	| 腾讯云 COS 的 Endpoint URL。                                	|
| secret_id    	| Yes       	| 腾讯云 COS Secret ID。                                      	|
| secret_key   	| Yes       	| 腾讯云 COS Secret Key。                                     	|

```sql title='示例'
-- 创建腾讯云 COS 连接
CREATE CONNECTION my_cos_conn
  STORAGE_TYPE = 'cos'
  SECRET_ID = '<your-secret-id>'
  SECRET_KEY = '<your-secret-key>'
  ENDPOINT_URL = '<your-endpoint-url>';

-- 创建 Stage 并引用该连接
CREATE STAGE my_cos_stage
  URL = 'cos://my-bucket'
  CONNECTION = (CONNECTION_NAME = 'my_cos_conn');
```

</TabItem>

<TabItem value="Hugging Face" label="HuggingFace">

下表列出了访问 Hugging Face 的连接参数：

| Parameter | Required?             | Description                                                                                                     |
|-----------|-----------------------|-----------------------------------------------------------------------------------------------------------------|
| repo_type | No (default: dataset) | Hugging Face 仓库类型，可取 `dataset` 或 `model`。                                                             |
| revision  | No (default: main)    | Hugging Face URI 的版本，可为分支、标签或提交。                                                                 |
| token     | No                    | Hugging Face API Token，访问私有仓库或部分资源时需要。                                                          |

```sql title='示例'
-- 创建 Hugging Face 连接
CREATE CONNECTION my_hf_conn
  STORAGE_TYPE = 'hf'
  REPO_TYPE = 'dataset'
  REVISION = 'main'
  TOKEN = '<optional-access-token>';

-- 创建 Stage 并引用该连接
CREATE STAGE my_huggingface_stage
  URL = 'hf://opendal/huggingface-testdata/'
  CONNECTION = (CONNECTION_NAME = 'my_hf_conn');
```

访问公开仓库可以省略 `TOKEN`，访问私有或受限仓库时再补上。

</TabItem>
</Tabs>
