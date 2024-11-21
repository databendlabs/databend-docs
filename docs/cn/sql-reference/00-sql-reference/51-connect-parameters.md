---
title: 连接参数
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.294"/>

连接参数是用于建立与外部存储服务（如Amazon S3）的安全链接的键值对。这些参数对于创建Stage、将数据复制到Databend以及查询外部文件等任务至关重要。

有关每个存储服务的具体连接详情，请参见下表。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="operating-systems">
<TabItem value="Amazon S3" label="Amazon S3">

下表列出了访问Amazon S3类存储服务的连接参数：

| 参数                      	| 必需?     	| 描述                                                        	|
|---------------------------	|-----------	|--------------------------------------------------------------	|
| endpoint_url              	| 是        	| Amazon S3类存储服务的端点URL。                              	|
| access_key_id             	| 是        	| 用于标识请求者的访问密钥ID。                                 	|
| secret_access_key         	| 是        	| 用于认证的秘密访问密钥。                                      	|
| enable_virtual_host_style 	| 否        	| 是否使用虚拟主机风格的URL。默认为*false*。                   	|
| master_key                	| 否        	| 用于高级数据加密的可选主密钥。                                	|
| region                    	| 否        	| 存储桶所在的AWS区域。                                         	|
| security_token            	| 否        	| 用于临时凭证的安全令牌。                                      	|

:::note
- 如果在命令中未指定**endpoint_url**参数，Databend将默认在Amazon S3上创建Stage。因此，当您在兼容S3的对象存储或其他对象存储解决方案上创建外部Stage时，请务必包含**endpoint_url**参数。

- **region**参数不是必需的，因为Databend可以自动检测区域信息。通常情况下，您不需要手动为此参数指定值。如果自动检测失败，Databend将默认使用'us-east-1'作为区域。当使用MinIO部署Databend且未配置区域信息时，它将自动默认使用'us-east-1'，并且这将正常工作。但是，如果您收到诸如“region is missing”或“The bucket you are trying to access requires a specific endpoint. Please direct all future requests to this particular endpoint”的错误消息，您需要确定您的区域名称并明确将其分配给**region**参数。
:::

```sql title='示例'
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

要访问您的Amazon S3存储桶，您还可以指定AWS IAM角色和外部ID进行认证。通过指定AWS IAM角色和外部ID，您可以更精细地控制用户可以访问哪些S3存储桶。这意味着如果IAM角色已被授予仅访问特定S3存储桶的权限，那么用户将只能访问这些存储桶。外部ID可以通过提供额外的验证层来进一步增强安全性。更多信息请参见https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-role.html

下表列出了使用AWS IAM角色认证访问Amazon S3存储服务的连接参数：

| 参数         	| 必需?     	| 描述                                                        	|
|--------------	|-----------	|--------------------------------------------------------------	|
| endpoint_url 	| 否        	| Amazon S3的端点URL。                                         	|
| role_arn     	| 是        	| 用于授权访问S3的AWS IAM角色的ARN。                           	|
| external_id  	| 否        	| 用于增强角色假设安全性的外部ID。                             	|

```sql title='示例'
CREATE STAGE my_s3_stage
  's3://my-bucket'
  CONNECTION = (
    ROLE_ARN = 'arn:aws:iam::123456789012:role/my-role',
    EXTERNAL_ID = 'my-external-id'
  );
```

</TabItem>

<TabItem value="Azure Blob" label="Azure Blob">

下表列出了访问Azure Blob存储的连接参数：

| 参数         	| 必需?     	| 描述                                                        	|
|----------------|-------------|--------------------------------------------------------------|
| endpoint_url  	| 是         	| Azure Blob存储的端点URL。                                   	|
| account_key   	| 是         	| 用于认证的Azure Blob存储账户密钥。                          	|
| account_name  	| 是         	| 用于标识的Azure Blob存储账户名称。                          	|

```sql title='示例'
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

下表列出了访问Google云存储的连接参数：

| 参数         	| 必需?     	| 描述                                                        	|
|----------------|-------------|--------------------------------------------------------------|
| credential    	| 是         	| 用于认证的Google云存储凭证。                                	|

要获取`credential`，您可以按照Google文档中的主题[创建服务账户密钥](https://cloud.google.com/iam/docs/keys-create-delete#creating)创建并下载服务账户密钥文件。下载服务账户密钥文件后，您可以通过以下命令将其转换为base64字符串：

```
base64 -i -o ~/Desktop/base64-encoded-key.txt
```

```sql title='示例'
CREATE STAGE my_gcs_stage
  'gcs://my-bucket'
  CONNECTION = (
    CREDENTIAL = '<your-base64-encoded-credential>'
  );
```

</TabItem>

<TabItem value="Alibaba OSS" label="Alibaba Cloud OSS">

下表列出了访问Alibaba云OSS的连接参数：

| 参数                      	| 必需?     	| 描述                                                        	|
|---------------------------	|-----------	|--------------------------------------------------------------	|
| access_key_id             	| 是        	| 用于认证的Alibaba云OSS访问密钥ID。                          	|
| access_key_secret         	| 是        	| 用于认证的Alibaba云OSS访问密钥秘密。                        	|
| endpoint_url              	| 是        	| Alibaba云OSS的端点URL。                                      	|
| presign_endpoint_url      	| 否        	| 用于预签名Alibaba云OSS URL的端点URL。                        	|

```sql title='示例'
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

下表列出了访问腾讯云对象存储（COS）的连接参数：

| 参数         	| 必需?     	| 描述                                                        	|
|--------------	|-----------	|--------------------------------------------------------------	|
| endpoint_url 	| 是        	| 腾讯云对象存储的端点URL。                                    	|
| secret_id    	| 是        	| 用于认证的腾讯云对象存储秘密ID。                             	|
| secret_key   	| 是        	| 用于认证的腾讯云对象存储秘密密钥。                           	|

```sql title='示例'
CREATE STAGE my_cos_stage
  'cos://my-bucket'
  CONNECTION = (
    SECRET_ID = '<your-secret-id>',
    SECRET_KEY = '<your-secret-key>',
    ENDPOINT_URL = '<your-endpoint-url>'
  );
```

</TabItem>

<TabItem value="HDFS" label="HDFS">

下表列出了访问Hadoop分布式文件系统（HDFS）的连接参数：

| 参数         	| 必需?     	| 描述                                                        	|
|--------------	|-----------	|--------------------------------------------------------------	|
| name_node    	| 是        	| 用于连接集群的HDFS NameNode地址。                           	|

```sql title='示例'
CREATE STAGE my_hdfs_stage
  'hdfs://my-bucket'
  CONNECTION = (
    NAME_NODE = 'hdfs://<namenode-host>:<port>'
  );
```

</TabItem>

<TabItem value="WebHDFS" label="WebHDFS">

下表列出了访问WebHDFS的连接参数：

| 参数         	| 必需?     	| 描述                                                        	|
|--------------	|-----------	|--------------------------------------------------------------	|
| endpoint_url 	| 是        	| WebHDFS的端点URL。                                           	|
| delegation   	| 否        	| 用于访问WebHDFS的委托令牌。                                  	|

```sql title='示例'
CREATE STAGE my_webhdfs_stage
  'webhdfs://my-bucket'
  CONNECTION = (
    ENDPOINT_URL = 'http://<namenode-host>:<port>'
  );
```

</TabItem>

<TabItem value="Hugging Face" label="HuggingFace">

下表列出了访问Hugging Face的连接参数：

| 参数      	| 必需?                 	| 描述                                                                                                    	|
|-----------	|-----------------------	|-----------------------------------------------------------------------------------------------------------------|
| repo_type 	| 否 (默认: dataset)    	| Hugging Face仓库的类型。可以是`dataset`或`model`。                                                          	|
| revision  	| 否 (默认: main)       	| Hugging Face URI的修订版本。可以是仓库的分支、标签或提交。                                                   	|
| token     	| 否                    	| Hugging Face的API令牌，可能需要访问私有仓库或某些资源。                                                     	|

```sql title='示例'
CREATE STAGE my_huggingface_stage
  'hf://opendal/huggingface-testdata/'
  CONNECTION = (
    REPO_TYPE = 'dataset'
    REVISION = 'main'
  );
```

</TabItem>

</Tabs>