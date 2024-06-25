| Parameter                | Description                                                                                           |
|--------------------------|-------------------------------------------------------------------------------------------------------|
| type                     | Specifies the type of storage backend to use. Options include 's3', 'azblob', 'gcs', 'oss', 'minio', 'localfs', and 'swift'. Default: 's3'.                     |
| endpoint                 | The endpoint URL of the storage service. For example, for AWS S3, it would be 's3.amazonaws.com'. Default: ''. |
| access_key_id            | The access key ID for authentication with the storage service. Default: ''.                         |
| secret_access_key        | The secret access key for authentication with the storage service. Databend recommends using the environment variable STORAGE_SECRET_ACCESS_KEY to provide this. Default: ''. |
| bucket                   | The name of the bucket to use. Default: 'databend'.                                                   |
| path_style_access        | If set to true, uses path-style access for S3-compatible services. Default: false.                   |
| use_ssl                  | If set to true, uses SSL for connections to the storage service. Default: true.                      |
| compression_codec         | The compression codec to use for data stored in the object storage. Options include 'none', 'lz4', 'zstd', 'gzip', and 'brotli'. Default: 'none'.                |
| max_connections          | The maximum number of concurrent connections to the storage service. Default: 1024.                 |
| connect_timeout_ms       | The timeout (in milliseconds) for establishing a connection to the storage service. Default: 10000.  |
| read_timeout_ms          | The timeout (in milliseconds) for read operations from the storage service. Default: 60000.         |
| write_timeout_ms         | The timeout (in milliseconds) for write operations to the storage service. Default: 60000.          |
| max_retry_count          | The maximum number of retry attempts for failed operations. Default: 3.                             |
| retry_backoff_ms         | The backoff time (in milliseconds) between retry attempts. Default: 100.                             |
| max_single_part_upload_size | The maximum size (in bytes) for a single-part upload. Default: 5 * 1024 * 1024.                     |
| min_part_size_for_multipart_upload | The minimum size (in bytes) that triggers a multipart upload. Default: 5 * 1024 * 1024.           |
| max_part_size_for_multipart_upload | The maximum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| max_total_part_count_for_multipart_upload | The maximum number of parts allowed in a multipart upload. Default: 10000.                          |
| multipart_upload_threshold_size | The threshold size (in bytes) above which a multipart upload is preferred over a single-part upload. Default: 5 * 1024 * 1024.                               |
| multipart_upload_min_part_size | The minimum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_part_size | The maximum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_total_part_count | The maximum number of parts allowed in a multipart upload. Default: 10000.                          |
| multipart_upload_threshold_size | The threshold size (in bytes) above which a multipart upload is preferred over a single-part upload. Default: 5 * 1024 * 1024.                               |
| multipart_upload_min_part_size | The minimum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_part_size | The maximum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_total_part_count | The maximum number of parts allowed in a multipart upload. Default: 10000.                          |
| multipart_upload_threshold_size | The threshold size (in bytes) above which a multipart upload is preferred over a single-part upload. Default: 5 * 1024 * 1024.                               |
| multipart_upload_min_part_size | The minimum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_part_size | The maximum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_total_part_count | The maximum number of parts allowed in a multipart upload. Default: 10000.                          |
| multipart_upload_threshold_size | The threshold size (in bytes) above which a multipart upload is preferred over a single-part upload. Default: 5 * 1024 * 1024.                               |
| multipart_upload_min_part_size | The minimum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_part_size | The maximum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_total_part_count | The maximum number of parts allowed in a multipart upload. Default: 10000.                          |
| multipart_upload_threshold_size | The threshold size (in bytes) above which a multipart upload is preferred over a single-part upload. Default: 5 * 1024 * 1024.                               |
| multipart_upload_min_part_size | The minimum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_part_size | The maximum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_total_part_count | The maximum number of parts allowed in a multipart upload. Default: 10000.                          |
| multipart_upload_threshold_size | The threshold size (in bytes) above which a multipart upload is preferred over a single-part upload. Default: 5 * 1024 * 1024.                               |
| multipart_upload_min_part_size | The minimum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_part_size | The maximum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_total_part_count | The maximum number of parts allowed in a multipart upload. Default: 10000.                          |
| multipart_upload_threshold_size | The threshold size (in bytes) above which a multipart upload is preferred over a single-part upload. Default: 5 * 1024 * 1024.                               |
| multipart_upload_min_part_size | The minimum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_part_size | The maximum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_total_part_count | The maximum number of parts allowed in a multipart upload. Default: 10000.                          |
| multipart_upload_threshold_size | The threshold size (in bytes) above which a multipart upload is preferred over a single-part upload. Default: 5 * 1024 * 1024.                               |
| multipart_upload_min_part_size | The minimum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_part_size | The maximum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_total_part_count | The maximum number of parts allowed in a multipart upload. Default: 10000.                          |
| multipart_upload_threshold_size | The threshold size (in bytes) above which a multipart upload is preferred over a single-part upload. Default: 5 * 1024 * 1024.                               |
| multipart_upload_min_part_size | The minimum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_part_size | The maximum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_total_part_count | The maximum number of parts allowed in a multipart upload. Default: 10000.                          |
| multipart_upload_threshold_size | The threshold size (in bytes) above which a multipart upload is preferred over a single-part upload. Default: 5 * 1024 * 1024.                               |
| multipart_upload_min_part_size | The minimum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_part_size | The maximum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_total_part_count | The maximum number of parts allowed in a multipart upload. Default: 10000.                          |
| multipart_upload_threshold_size | The threshold size (in bytes) above which a multipart upload is preferred over a single-part upload. Default: 5 * 1024 * 1024.                               |
| multipart_upload_min_part_size | The minimum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_part_size | The maximum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_total_part_count | The maximum number of parts allowed in a multipart upload. Default: 10000.                          |
| multipart_upload_threshold_size | The threshold size (in bytes) above which a multipart upload is preferred over a single-part upload. Default: 5 * 1024 * 1024.                               |
| multipart_upload_min_part_size | The minimum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_part_size | The maximum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_total_part_count | The maximum number of parts allowed in a multipart upload. Default: 10000.                          |
| multipart_upload_threshold_size | The threshold size (in bytes) above which a multipart upload is preferred over a single-part upload. Default: 5 * 1024 * 1024.                               |
| multipart_upload_min_part_size | The minimum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_part_size | The maximum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_total_part_count | The maximum number of parts allowed in a multipart upload. Default: 10000.                          |
| multipart_upload_threshold_size | The threshold size (in bytes) above which a multipart upload is preferred over a single-part upload. Default: 5 * 1024 * 1024.                               |
| multipart_upload_min_part_size | The minimum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_part_size | The maximum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_total_part_count | The maximum number of parts allowed in a multipart upload. Default: 10000.                          |
| multipart_upload_threshold_size | The threshold size (in bytes) above which a multipart upload is preferred over a single-part upload. Default: 5 * 1024 * 1024.                               |
| multipart_upload_min_part_size | The minimum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_part_size | The maximum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_total_part_count | The maximum number of parts allowed in a multipart upload. Default: 10000.                          |
| multipart_upload_threshold_size | The threshold size (in bytes) above which a multipart upload is preferred over a single-part upload. Default: 5 * 1024 * 1024.                               |
| multipart_upload_min_part_size | The minimum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_part_size | The maximum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_total_part_count | The maximum number of parts allowed in a multipart upload. Default: 10000.                          |
| multipart_upload_threshold_size | The threshold size (in bytes) above which a multipart upload is preferred over a single-part upload. Default: 5 * 1024 * 1024.                               |
| multipart_upload_min_part_size | The minimum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_part_size | The maximum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_total_part_count | The maximum number of parts allowed in a multipart upload. Default: 10000.                          |
| multipart_upload_threshold_size | The threshold size (in bytes) above which a multipart upload is preferred over a single-part upload. Default: 5 * 1024 * 1024.                               |
| multipart_upload_min_part_size | The minimum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_part_size | The maximum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_total_part_count | The maximum number of parts allowed in a multipart upload. Default: 10000.                          |
| multipart_upload_threshold_size | The threshold size (in bytes) above which a multipart upload is preferred over a single-part upload. Default: 5 * 1024 * 1024.                               |
| multipart_upload_min_part_size | The minimum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_part_size | The maximum size (in bytes) of each part in a multipart upload. Default: 5 * 1024 * 1024.         |
| multipart_upload_max_total_part_count | The maximum number of parts allowed in a multipart upload. Default: 10000.                          |
| multipart_upload_threshold_size | The threshold size (in bytes) above which a multipart upload is preferred over a single-part upload. Default: 5 * 1024

| 参数             | 描述                                                                                             |
|------------------|---------------------------------------------------------------------------------------------------|
| type             | 使用的存储类型。可选值包括：fs, s3, azblob, gcs, oss, cos, hdfs, webhdfs。                          |
| allow_insecure   | 默认为false。当在MinIO上部署Databend或通过以`http://`开头的URL加载数据时，需设置为true，否则可能会遇到以下错误：“不允许从非安全存储复制。请设置`allow_insecure=true`”。 |

### [storage.fs] 部分

以下是在[storage.fs]部分中可用的参数列表：

| 参数         | 描述                             |
|--------------|----------------------------------|
| data_path    | 数据存储位置的路径。             |

### [storage.s3] 部分

以下是在[storage.s3]部分中可用的参数列表：

| 参数                   | 描述                                                                                     |
|------------------------|------------------------------------------------------------------------------------------|
| bucket                 | 您的Amazon S3类存储桶的名称。                                                             |
| endpoint_url           | S3类存储服务的URL端点。默认为"https://s3.amazonaws.com"。                                  |
| access_key_id          | 用于与存储服务进行身份验证的访问密钥ID。                                                  |
| secret_access_key      | 用于与存储服务进行身份验证的秘密访问密钥。                                                |
| enable_virtual_host_style | 一个布尔标志，指示是否启用虚拟主机样式寻址。                                             |
| external_id            | 用于身份验证的外部ID。                                                                   |
| master_key             | 用于身份验证的主密钥。                                                                   |
| region                 | S3类存储服务的区域。                                                                     |
| role_arn               | 用于身份验证的ARN（Amazon资源名称）。                                                     |
| root                   | HDFS的根目录。                                                                            |
| security_token         | 用于身份验证的安全令牌。                                                                 |

### [storage.azblob] 部分

以下是在[storage.azblob]部分中可用的参数列表：

| 参数           | 描述                                                                                                   |
|----------------|--------------------------------------------------------------------------------------------------------|
| endpoint_url   | Azure Blob存储的URL端点（例如，`https://<your-storage-account-name>.blob.core.windows.net`）。             |
| container      | 您的Azure存储容器的名称。                                                                               |
| account_name   | 您的Azure存储账户的名称。                                                                               |
| account_key    | 用于与Azure Blob存储进行身份验证的账户密钥。                                                             |
| root           | Azure Blob存储的根目录。                                                                                 |

### [storage.gcs] 部分

以下是在[storage.gcs]部分中可用的参数列表：

| 参数       | 描述                                                                                 |
|------------|--------------------------------------------------------------------------------------|
| bucket     | 您的Google Cloud Storage桶的名称。                                                     |
| credential | 用于Google Cloud Storage身份验证的base64编码服务账户密钥文件。                          |
| root       | Google Cloud Storage的根目录。                                                         |

要获取`credential`，您可以按照Google文档中的主题[创建服务账户密钥](https://cloud.google.com/iam/docs/keys-create-delete#creating)来创建并下载服务账户密钥文件。下载服务账户密钥文件后，您可以通过以下命令将其转换为base64字符串：

```
base64 -i -o ~/Desktop/base64-encoded-key.txt
```

### [storage.oss] 部分

以下是在[storage.oss]部分中可用的参数列表：

| 参数               | 描述                                                                                   |
|--------------------|----------------------------------------------------------------------------------------|
| bucket             | 您的阿里云OSS桶的名称。                                                                |
| endpoint_url       | 阿里云OSS的URL端点。                                                                   |
| access_key_id      | 用于与阿里云OSS进行身份验证的访问密钥ID。                                              |
| access_key_secret  | 用于与阿里云OSS进行身份验证的访问密钥秘密。                                            |
| presign_endpoint_url | 用于阿里云OSS预签名操作的URL端点。                                                      |
| root               | 阿里云OSS的根目录。                                                                    |

### [storage.cos] 部分

以下是在[storage.cos]部分中可用的参数列表：

| 参数       | 描述                                                                                   |
|------------|----------------------------------------------------------------------------------------|
| bucket     | 您的腾讯云对象存储（COS）桶的名称。                                                     |
| endpoint_url | 腾讯COS的URL端点（可选）。                                                             |
| secret_id  | 用于与腾讯COS进行身份验证的密钥ID。                                                      |
| secret_key | 用于与腾讯COS进行身份验证的密钥。                                                        |
| root       | 腾讯云对象存储的根目录。                                                                |

### [storage.hdfs] 部分

以下是在[storage.hdfs]部分中可用的参数列表：

| 参数       | 描述                                                                                     |
|------------|------------------------------------------------------------------------------------------|
| name_node  | Hadoop分布式文件系统（HDFS）的名称节点地址。                                              |
| root       | HDFS的根目录。                                                                            |

### [storage.webhdfs] 部分

以下是在[storage.webhdfs]部分中可用的参数列表：

| 参数       | 描述                                                                                     |
|------------|------------------------------------------------------------------------------------------|
| endpoint_url | WebHDFS（Hadoop分布式文件系统）的URL端点。                                                |
| root       | HDFS的根目录。                                                                            |
| delegation | 用于身份验证和授权的委托令牌。                                                           |

## [cache] 部分

以下是在[cache]部分中可用的参数列表：

| 参数                 | 描述                                                                                     |
|----------------------|------------------------------------------------------------------------------------------|
| data_cache_storage   | 用于表数据缓存的存储类型。可用选项："none"（禁用表数据缓存），"disk"（启用磁盘缓存）。默认为"none"。 |