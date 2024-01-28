---
title: 连接参数
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新：v1.2.294"/>

连接参数指的是一组用于建立与支持的外部存储服务（如Amazon S3）的安全连接所需的基本连接详情。这些参数被包含在括号内，并由逗号分隔的键值对组成。它通常用于创建阶段、将数据复制到Databend以及从外部源查询阶段文件等操作中。提供的键值对为连接提供了必要的认证和配置信息。

### 语法和示例

连接参数使用CONNECTION子句指定，并由逗号分隔。在[查询阶段文件](/guides/load-data/transform/querying-stage)时，CONNECTION子句被包含在一组额外的括号内。

```sql title='示例：'
-- 此示例演示了一个'CREATE STAGE'命令，其中'CONNECTION'后跟'='，建立了一个具有特定连接参数的Minio阶段。
CREATE STAGE my_minio_stage
  's3://databend'
  CONNECTION = (
    ENDPOINT_URL = 'http://localhost:9000',
    ACCESS_KEY_ID = 'ROOTUSER',
    SECRET_ACCESS_KEY = 'CHANGEME123'
  );

-- 此示例展示了一个'COPY INTO'命令，使用'='在'CONNECTION'后复制数据，同时指定文件格式详细信息。
COPY INTO mytable
    FROM 's3://mybucket/data.csv'
    CONNECTION = (
        ACCESS_KEY_ID = '<your-access-key-ID>',
        SECRET_ACCESS_KEY = '<your-secret-access-key>'
    )
    FILE_FORMAT = (
        TYPE = CSV,
        FIELD_DELIMITER = ',',
        RECORD_DELIMITER = '\n',
        SKIP_HEADER = 1
    )
    SIZE_LIMIT = 10;

-- 此示例使用'SELECT'语句查询阶段文件。
-- 'CONNECTION'后跟'=>'以访问Minio数据，并且连接子句被包含在一组额外的括号内。
SELECT * FROM 's3://testbucket/admin/data/parquet/tuple.parquet' 
    (CONNECTION => (
        ACCESS_KEY_ID = 'minioadmin', 
        SECRET_ACCESS_KEY = 'minioadmin', 
        ENDPOINT_URL = 'http://127.0.0.1:9900/'
        )
    );
```

不同存储服务的连接参数根据其特定要求和认证机制而有所不同。有关更多信息，请参考下面的表格。

### 类Amazon S3存储服务

下表列出了访问类Amazon S3存储服务的连接参数：

| 参数                     	| 是否必须 	| 描述                                                  	|
|---------------------------	|-----------	|----------------------------------------------------------	|
| endpoint_url              	| 是        	| 类Amazon S3存储服务的端点URL。                           	|
| access_key_id             	| 是        	| 用于识别请求者的访问密钥ID。                             	|
| secret_access_key         	| 是        	| 用于认证的密钥访问密钥。                                	|
| enable_virtual_host_style 	| 否        	| 是否使用虚拟主机样式URL。默认为*false*。                	|
| master_key                	| 否        	| 可选的主密钥，用于高级数据加密。                        	|
| region                    	| 否        	| 存储桶所在的AWS区域。                                   	|
| security_token            	| 否        	| 临时凭证的安全令牌。                                    	|

:::note
- 如果在命令中未指定**endpoint_url**参数，Databend将默认在Amazon S3上创建阶段。因此，当您在S3兼容的对象存储或其他对象存储解决方案上创建外部阶段时，请确保包含**endpoint_url**参数。

- **region**参数不是必需的，因为Databend可以自动检测区域信息。您通常不需要手动为此参数指定值。如果自动检测失败，Databend将默认使用'us-east-1'作为区域。当使用MinIO部署Databend且未配置区域信息时，它将自动默认使用'us-east-1'，并且这将正确工作。然而，如果您收到如“缺少区域”或“您尝试访问的存储桶需要特定的端点。请将所有未来的请求定向到这个特定的端点”等错误消息，您需要确定您的区域名称并明确将其分配给**region**参数。
:::

要访问您的Amazon S3存储桶，您还可以指定AWS IAM角色和外部ID进行认证。通过指定AWS IAM角色和外部ID，您可以更精细地控制用户可以访问哪些S3存储桶。这意味着，如果IAM角色已被授权访问特定的S3存储桶，则用户将只能访问这些存储桶。外部ID可以通过提供额外的验证层来进一步增强安全性。有关更多信息，请参见 https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-role.html

下表列出了使用AWS IAM角色认证访问Amazon S3存储服务的连接参数：

| 参数        	| 是否必须 	| 描述                                           	|
|--------------	|-----------	|---------------------------------------------------	|
| endpoint_url 	| 否        	| Amazon S3的端点URL。                             	|
| role_arn     	| 是        	| 用于授权访问S3的AWS IAM角色的ARN。               	|
| external_id  	| 否        	| 在角色扮演中增强安全性的外部ID。                 	|

### Azure Blob存储

下表列出了访问Azure Blob存储的连接参数：



| 参数                | 是否必须? | 描述                                                         |
|-------------------|--------|------------------------------------------------------------|
| endpoint_url      | 是     | 用于 Azure Blob Storage 的端点 URL。                        |
| account_key       | 是     | 用于认证的 Azure Blob Storage 账户密钥。                    |
| account_name      | 是     | 用于识别的 Azure Blob Storage 账户名称。                    |

### Google Cloud Storage

以下表格列出了访问 Google Cloud Storage 的连接参数：

| 参数           | 是否必须? | 描述                                             |
|--------------|--------|------------------------------------------------|
| endpoint_url | 是     | 用于 Google Cloud Storage 的端点 URL。         |
| credential   | 是     | 用于认证的 Google Cloud Storage 凭证。         |

### 阿里云 OSS

以下表格列出了访问阿里云 OSS 的连接参数：

| 参数                  | 是否必须? | 描述                                                 |
|---------------------|--------|----------------------------------------------------|
| access_key_id       | 是     | 用于认证的阿里云 OSS 访问密钥 ID。                   |
| access_key_secret   | 是     | 用于认证的阿里云 OSS 访问密钥密文。                  |
| endpoint_url        | 是     | 用于阿里云 OSS 的端点 URL。                          |
| presign_endpoint_url| 否     | 用于预签名阿里云 OSS URLs 的端点 URL。               |

### 腾讯云对象存储

以下表格列出了访问腾讯云对象存储（COS）的连接参数：

| 参数          | 是否必须? | 描述                                                   |
|-------------|--------|------------------------------------------------------|
| endpoint_url| 是     | 用于腾讯云对象存储的端点 URL。                         |
| secret_id   | 是     | 用于认证的腾讯云对象存储密钥 ID。                      |
| secret_key  | 是     | 用于认证的腾讯云对象存储密钥密文。                     |

### HDFS

以下表格列出了访问 Hadoop 分布式文件系统（HDFS）的连接参数：

| 参数       | 是否必须? | 描述                                           |
|----------|--------|----------------------------------------------|
| name_node| 是     | 用于连接集群的 HDFS NameNode 地址。           |

### WebHDFS

以下表格列出了访问 WebHDFS 的连接参数：

| 参数          | 是否必须? | 描述                                       |
|-------------|--------|------------------------------------------|
| endpoint_url| 是     | 用于 WebHDFS 的端点 URL。                 |
| delegation  | 否     | 用于访问 WebHDFS 的委托令牌。             |

### Hugging Face

以下表格列出了访问 Hugging Face 的连接参数：

| 参数      | 是否必须?               | 描述                                                                                                                   |
|---------|---------------------|----------------------------------------------------------------------------------------------------------------------|
| repo_id | 是                   | Hugging Face 仓库的标识符。例如："opendal/huggingface-testdata"。请注意，repo_id 必须有一个组织名称；目前不支持存储在 Hugging Face 上的非组织格式的数据集（例如 https://huggingface.co/datasets/ropes）。 |
| repo_type| 否 (默认: dataset)  | Hugging Face 仓库的类型。可以是 `dataset` 或 `model`。                                                                |
| revision | 否 (默认: main)      | Hugging Face URI 的修订版本。可以是仓库的分支、标签或提交。                                                            |
| token    | 否                   | 从 Hugging Face 获取的 API 令牌，可能需要用于访问私有仓库或某些资源。                                                  |