```markdown
---
title: 连接参数
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新：v1.2.294"/>

连接参数指的是一组用于建立与支持的外部存储服务（如Amazon S3）的安全连接所需的基本连接详细信息。这些参数被包含在括号内，并由逗号分隔的键值对组成。它通常用于创建阶段、将数据复制到Databend以及从外部源查询阶段文件等操作中。提供的键值对提供了连接所需的认证和配置信息。

### 语法和示例 {/*examples*/}

连接参数使用CONNECTION子句指定，并由逗号分隔。在[查询阶段文件](/guides/load-data/transform/querying-stage)时，CONNECTION子句被包含在另一组括号中。

```sql title='示例：'
-- 这个例子展示了一个'CREATE STAGE'命令，其中'CONNECTION'后跟'='，建立了一个带有特定连接参数的Minio阶段。
CREATE STAGE my_minio_stage
  's3://databend'
  CONNECTION = (
    ENDPOINT_URL = 'http://localhost:9000',
    ACCESS_KEY_ID = 'ROOTUSER',
    SECRET_ACCESS_KEY = 'CHANGEME123'
  );

-- 这个例子展示了一个'COPY INTO'命令，使用'='在'CONNECTION'后复制数据，同时指定文件格式详细信息。
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

-- 这个例子使用'SELECT'语句查询阶段文件。
-- 'CONNECTION'后跟'=>'来访问Minio数据，连接子句被包含在另一组括号中。
SELECT * FROM 's3://testbucket/admin/data/parquet/tuple.parquet' 
    (CONNECTION => (
        ACCESS_KEY_ID = 'minioadmin', 
        SECRET_ACCESS_KEY = 'minioadmin', 
        ENDPOINT_URL = 'http://127.0.0.1:9900/'
        )
    );
```

不同存储服务的连接参数根据它们的具体要求和认证机制而有所不同。更多信息，请参考下面的表格。

### 类Amazon S3存储服务

下表列出了访问类Amazon S3存储服务的连接参数：

| 参数                     	| 是否必须 	| 描述                                                        	|
|---------------------------	|-----------	|--------------------------------------------------------------	|
| endpoint_url              	| 是        	| 类Amazon S3存储服务的端点URL。                               	|
| access_key_id             	| 是        	| 用于识别请求者的访问密钥ID。                                 	|
| secret_access_key         	| 是        	| 用于认证的密钥。                                             	|
| allow_anonymous           	| 否        	| 是否允许匿名访问。默认为*false*。                            	|
| enable_virtual_host_style 	| 否        	| 是否使用虚拟主机风格的URL。默认为*false*。                   	|
| master_key                	| 否        	| 可选的主密钥，用于高级数据加密。                              	|
| region                    	| 否        	| 存储桶所在的AWS区域。                                         	|
| security_token            	| 否        	| 临时凭证的安全令牌。                                         	|

:::note
- 如果在命令中没有指定**endpoint_url**参数，Databend将默认在Amazon S3上创建阶段。因此，当您在S3兼容的对象存储或其他对象存储解决方案上创建外部阶段时，请确保包含**endpoint_url**参数。

- 如果您使用的是S3存储，并且您的存储桶具有公共读取权限，您可以在不提供凭据的情况下匿名访问和查询与存储桶关联的外部阶段。要启用此功能，请在*databend-query.toml*配置文件的[storage.s3]部分添加**allow_anonymous**参数，并将其设置为**true**。

- **region**参数不是必需的，因为Databend可以自动检测区域信息。您通常不需要手动指定此参数的值。如果自动检测失败，Databend将默认使用'us-east-1'作为区域。当使用MinIO部署Databend且没有配置区域信息时，它将自动默认使用'us-east-1'，并且这将正常工作。然而，如果您收到诸如"缺少区域"或"您尝试访问的存储桶需要特定的端点。请将所有未来的请求定向到这个特定端点"之类的错误消息，您需要确定您的区域名称并明确地将其分配给**region**参数。
:::

要访问您的Amazon S3存储桶，您还可以指定AWS IAM角色和外部ID进行认证。通过指定AWS IAM角色和外部ID，您可以更精细地控制用户可以访问哪些S3存储桶。这意味着，如果IAM角色被授权访问只有特定S3存储桶的权限，那么用户将只能访问这些存储桶。外部ID可以通过提供额外的验证层来进一步增强安全性。更多信息，请参见https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-role.html

下表列出了使用AWS IAM角色认证访问Amazon S3存储服务的连接参数：

| 参数        	| 是否必须 	| 描述                                                     	|
|--------------	|-----------	|-----------------------------------------------------------	|
| endpoint_url 	| 否        	| Amazon S3的端点URL。                                      	|
| role_arn     	| 是        	| 用于授权访问S3的AWS IAM角色的ARN。                        	|
| external_id  	| 否        	| 在角色扮演中用于增强安全性的外部ID。                       	|

### Azure Blob存储

下表列出了访问Azure Blob存储的连接参数：

| 参数          	| 是否必须 	| 描述                                                       	|
|----------------	|-----------	|-----------------------------------------------------------	|
| endpoint_url   	| 是        	| Azure Blob存储的端点URL。                                  	|
| account_key    	| 是        	| 用于认证的Azure Blob存储账户密钥。                         	|
| account_name   	| 是        	| 用于识别的Azure Blob存储账户名称。                         	|

### Google Cloud存储

下表列出了访问Google Cloud存储的连接参数：

| 参数          	| 是否必须 	| 描述                                                       	|
|----------------	|-----------	|-----------------------------------------------------------	|
| endpoint_url   	| 是        	| Google Cloud存储的端点URL。                                	|
| credential     	| 是        	| 用于认证的Google Cloud存储凭证。                           	|

### 阿里巴巴云OSS

下表列出了访问阿里巴巴云OSS的连接参数：

| 参数                  	| 是否必须 	| 描述                                                         	|
|------------------------	|-----------	|-------------------------------------------------------------	|
| access_key_id          	| 是        	| 用于认证的阿里巴巴云OSS访问密钥ID。                           	|
| access_key_secret      	| 是        	| 用于认证的阿里巴巴云OSS访问密钥密钥。                         	|
| endpoint_url           	| 是        	| 阿里巴巴云OSS的端点URL。                                      	|
| presign_endpoint_url   	| 否        	| 用于预签名阿里巴巴云OSS URL的端点URL。                         	|

### 腾讯云对象存储

下表列出了访问腾讯云对象存储（COS）的连接参数：

| 参数          	| 是否必须 	| 描述                                                         	|
|----------------	|-----------	|-------------------------------------------------------------	|
| endpoint_url   	| 是        	| 腾讯云对象存储的端点URL。                                    	|
| secret_id      	| 是        	| 用于认证的腾讯云对象存储密钥ID。                             	|
| secret_key     	| 是        	| 用于认证的腾讯云对象存储密钥密钥。                           	|

### HDFS

下表列出了访问Hadoop分布式文件系统（HDFS）的连接参数：

| 参数        	| 是否必须 	| 描述                                                        	|
|--------------	|-----------	|------------------------------------------------------------	|
| name_node    	| 是        	| 用于连接集群的HDFS NameNode地址。                            	|

### WebHDFS

下表列出了访问WebHDFS的连接参数：

| 参数          	| 是否必须 	| 描述                                                        	|
|----------------	|-----------	|------------------------------------------------------------	|
| endpoint_url   	| 是        	| WebHDFS的端点URL。                                          	|
| delegation     	| 否        	| 用于访问WebHDFS的委托令牌。                                 	|


### Hugging Face

下表列出了访问Hugging Face的连接参数：

| 参数       | 是否必须                  | 描述                                                                                                      |
|------------|---------------------------|----------------------------------------------------------------------------------------------------------|
| repo_id    | 是                        | Hugging Face仓库的标识符。例如，"opendal/huggingface-testdata"。请注意，repo_id必须有一个组织名称；存储在Hugging Face上的非组织格式的数据集（如https://huggingface.co/datasets/ropes）目前不受支持。 |
| repo_type  | 否（默认值：dataset）     | Hugging Face仓库的类型。可以是`dataset`或`model`。                                                        |
| revision   | 否（默认值：main）        | Hugging Face URI的修订版本。可以是仓库的分支、标签或提交。                                                |
| token      | 否                        | 来自Hugging Face的API令牌，可能需要用于访问私有仓库或某些资源。                                            |
```