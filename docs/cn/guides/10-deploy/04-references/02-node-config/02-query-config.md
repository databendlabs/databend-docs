---
title: 查询配置
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本: v1.2.344"/>

本页介绍[databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml)配置文件中可用的查询节点配置。

- 下表中列出的一些参数可能不在[databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml)中。如果需要这些参数，可以手动添加到文件中。

- 您可以在GitHub上找到[示例配置文件](https://github.com/datafuselabs/databend/tree/main/scripts/ci/deploy/config)，这些文件为各种部署环境设置了Databend。这些文件仅供内部测试使用。请不要为了自己的目的修改它们。但如果您的部署与之类似，在编辑自己的配置文件时参考它们是个好主意。

## [query] 部分

以下是在[query]部分中可用的参数列表：

| 参数                          | 描述                                       |
|------------------------------|---------------------------------------------------|
| max_active_sessions          | 最大活动会话数。                             |
| shutdown_wait_timeout_ms     | 等待超时时间（毫秒）。                       |
| flight_api_address           | 监听Databend-Query集群洗牌数据的IP地址和端口。 |
| admin_api_address            | 管理REST API的地址。                         |
| metric_api_address           | 指标REST API的地址。                         |
| mysql_handler_host           | MySQL查询处理程序的主机名。                 |
| mysql_handler_port           | MySQL查询处理程序的端口。                   |
| clickhouse_http_handler_host | ClickHouse HTTP查询处理程序的主机名。       |
| clickhouse_http_handler_port | ClickHouse HTTP查询处理程序的端口。         |
| http_handler_host            | HTTP API查询处理程序的主机名。             |
| http_handler_port            | HTTP API查询处理程序的端口。               |
| flight_sql_handler_host      | 实验性Arrow Flight SQL API查询处理程序的主机名。 |
| flight_sql_handler_port      | 实验性Arrow Flight SQL API查询处理程序的端口。 |
| tenant_id                    | 默认租户ID。                               |
| cluster_id                   | 默认集群ID。                              |
| table_engine_memory_enabled  | 启用内存表引擎的标志。                     |
| max_running_queries          | 可以同时执行的最大查询数，默认为8，0表示无限制。 | 
| data_retention_time_in_days_max | 设置`data_retention_time_in_days`设置的上限，默认值为90天。                          |

### [query.users] 部分

以下是在[[query.users]]部分中可用的参数列表。有关配置管理用户的更多信息，请参阅[配置管理用户](../01-admin-users.md)。

| 参数         | 描述                              |
|--------------|-----------------------------------|
| name         | 用户名。                          |
| auth_type    | 认证类型（例如，no_password, double_sha1_password, sha256_password）。 |
| auth_string  | 认证字符串（例如，密码的SHA-1或SHA-256哈希）。 |

### [query.settings] 部分

以下是在[query.settings]部分中可用的参数列表。

| 参数                               | 描述                                                                                                                                                                                                             |
|----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| aggregate_spilling_memory_ratio  | 控制聚合操作期间数据溢出到磁盘的阈值。当内存使用超过总可用内存的这一百分比时，数据将溢出到对象存储以避免内存耗尽。示例：如果设置为60，则当内存使用超过60%时发生溢出。                                           |
| join_spilling_memory_ratio       | 控制连接操作期间数据溢出到磁盘的阈值。当内存使用超过总可用内存的这一百分比时，数据将溢出到对象存储以避免内存耗尽。示例：如果设置为60，则当内存使用超过60%时发生溢出。                                                 |

## [log] 部分

此部分可以包括三个子部分：[log.file]、[log.stderr]、[log.query]和[log.tracing]。

### [log.file] 部分

以下是在[log.file]部分中可用的参数列表：

| 参数           | 描述                                                                                         |
|----------------|---------------------------------------------------------------------------------------------|
| on             | 启用或禁用文件日志记录。默认为true。                                                         |
| dir            | 存储日志文件的路径。                                                                          |
| level          | 日志级别：DEBUG、INFO或ERROR。默认为INFO。                                                   |
| format         | 日志格式：json或text。默认为json。                                                            |
| file_limit     | 确定要保留的最大日志文件数。默认为48。                                                      |

### [log.stderr] 部分

以下是在[log.stderr]部分中可用的参数列表：

| 参数           | 描述                                                                                         |
|----------------|---------------------------------------------------------------------------------------------|
| on             | 启用或禁用stderr日志记录。默认为false。                                                      |
| level          | 日志级别：DEBUG、INFO或ERROR。默认为DEBUG。                                                  |
| format         | 日志格式：json或text。默认为text。                                                           |

### [log.query] 部分

以下是在[log.query]部分中可用的参数列表：

| 参数           | 描述                                                                                         |
|----------------|---------------------------------------------------------------------------------------------|
| on             | 启用将查询执行详细信息记录到日志目录中的query-details文件夹。默认为启用。考虑在存储空间有限时禁用。 |

### [log.tracing] 部分

以下是在[log.tracing]部分中可用的参数列表：

| 参数             | 描述                                                                                                                                                   |
|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| capture_log_level | 设置执行期间捕获跟踪的日志级别（DEBUG、TRACE、INFO、WARN或ERROR）。                                                                                   |
| on               | 控制是否启用跟踪。默认值为'false'表示禁用。设置为'true'以启用跟踪。                                                                                   |
| otlp_endpoint    | 指定OpenTelemetry Protocol (OTLP)跟踪端点。默认为'http://127.0.0.1:4317'，但您可以将其替换为所需的OTLP端点。 |

## [meta] 部分

以下是在[meta]部分中可用的参数列表：

| 参数                    | 描述                                                                                           |
|------------------------|-------------------------------------------------------------------------------------------------------|
| username               | 用于连接到Meta服务的用户名。默认："root"。                                                          |
| password               | 用于连接到Meta服务的密码。Databend建议使用环境变量META_PASSWORD提供密码。默认："root"。                     |
| endpoints              | 设置此查询服务器可以连接的一个或多个元服务器端点。为了与Meta建立健壮的连接，如果可能，请在集群中包含多个元服务器作为备份。示例：["192.168.0.1:9191", "192.168.0.2:9191"]。默认：["0.0.0.0:9191"]。 |
| client_timeout_in_second | 在终止尝试连接到元服务器之前设置等待时间（以秒为单位）。默认：60。                                  |
| auto_sync_interval     | 设置此查询服务器应从集群内的元服务器自动同步端点的频率（以秒为单位）。启用后，Databend-query定期联系Databend-meta服务器以获取grpc_api_advertise_host:grpc-api-port列表。要禁用同步，请将其设置为0。默认：60。 |
| unhealth_endpoint_evict_time | 内部时间（以秒为单位），用于不查询不健康的元节点端点。默认：120。                                       |

## [storage] 部分

以下是在[storage]部分中可用的参数列表：

| 参数             | 描述                                                                                             |
|------------------|--------------------------------------------------------------------------------------------------|
| type             | 使用的存储类型。可选值包括：fs, s3, azblob, gcs, oss, cos, hdfs, webhdfs。                          |
| allow_insecure   | 默认值为false。当在MinIO上部署Databend或通过以`http://`开头的URL加载数据时，需设置为true，否则可能会遇到以下错误：“不允许从非安全存储复制。请设置`allow_insecure=true`”。 |

### [storage.fs] 部分

以下是在[storage.fs]部分中可用的参数列表：

| 参数         | 描述                             |
|--------------|----------------------------------|
| data_path    | 数据存储位置的路径。             |

### [storage.s3] 部分

以下是在[storage.s3]部分中可用的参数列表：

| 参数                   | 描述                                                                                   |
|------------------------|----------------------------------------------------------------------------------------|
| bucket                 | 您的Amazon S3类存储桶的名称。                                                           |
| endpoint_url           | S3类存储服务的URL端点。默认值为"https://s3.amazonaws.com"。                             |
| access_key_id          | 用于与存储服务进行身份验证的访问密钥ID。                                               |
| secret_access_key      | 用于与存储服务进行身份验证的秘密访问密钥。                                             |
| enable_virtual_host_style | 一个布尔标志，指示是否启用虚拟主机样式寻址。                                           |
| external_id            | 用于身份验证的外部ID。                                                                 |
| master_key             | 用于身份验证的主密钥。                                                                 |
| region                 | S3类存储服务的区域。                                                                   |
| role_arn               | 用于身份验证的ARN（Amazon资源名称）。                                                   |
| root                   | 指定Databend将在其中操作的存储桶内的目录。例如：如果存储桶的根目录有一个名为`myroot`的文件夹，则`root = "myroot/"`。 |
| security_token         | 用于身份验证的安全令牌。                                                               |

### [storage.azblob] 部分

以下是在[storage.azblob]部分中可用的参数列表：

| 参数           | 描述                                                                                             |
|----------------|--------------------------------------------------------------------------------------------------|
| endpoint_url   | Azure Blob存储的URL端点（例如，`https://<your-storage-account-name>.blob.core.windows.net`）。     |
| container      | 您的Azure存储容器的名称。                                                                        |
| account_name   | 您的Azure存储账户的名称。                                                                        |
| account_key    | 用于与Azure Blob存储进行身份验证的账户密钥。                                                      |
| root           | 指定Databend将在其中操作的存储桶内的目录。例如：如果存储桶的根目录有一个名为`myroot`的文件夹，则`root = "myroot/"`。 |

### [storage.gcs] 部分

以下是在[storage.gcs]部分中可用的参数列表：

| 参数         | 描述                                                                           |
|--------------|--------------------------------------------------------------------------------|
| bucket       | 您的Google Cloud Storage存储桶的名称。                                         |
| credential   | 用于Google Cloud Storage身份验证的base64编码的服务账户密钥文件。                |
| root         | 指定Databend将在其中操作的存储桶内的目录。例如：如果存储桶的根目录有一个名为`myroot`的文件夹，则`root = "myroot/"`。 |

要获取`credential`，您可以按照Google文档中的[创建服务账户密钥](https://cloud.google.com/iam/docs/keys-create-delete#creating)主题创建并下载服务账户密钥文件。下载服务账户密钥文件后，您可以通过以下命令将其转换为base64字符串：

```
base64 -i -o ~/Desktop/base64-encoded-key.txt
```

### [storage.oss] 部分

以下是在[storage.oss]部分中可用的参数列表：

| 参数               | 描述                                                                                   |
|--------------------|----------------------------------------------------------------------------------------|
| bucket             | 您的阿里云OSS存储桶的名称。                                                            |
| endpoint_url       | 阿里云OSS的URL端点。                                                                   |
| access_key_id      | 用于与阿里云OSS进行身份验证的访问密钥ID。                                              |
| access_key_secret  | 用于与阿里云OSS进行身份验证的访问密钥秘密。                                            |
| presign_endpoint_url | 用于阿里云OSS预签名操作的URL端点。                                                     |
| root               | 指定Databend将在其中操作的存储桶内的目录。例如：如果存储桶的根目录有一个名为`myroot`的文件夹，则`root = "myroot/"`。 |

### [storage.cos] 部分

以下是在[storage.cos]部分中可用的参数列表：

| 参数         | 描述                                                                                   |
|--------------|----------------------------------------------------------------------------------------|
| bucket       | 您的腾讯云对象存储（COS）存储桶的名称。                                                |
| endpoint_url | 腾讯COS的URL端点（可选）。                                                             |
| secret_id    | 用于与腾讯COS进行身份验证的密钥ID。                                                    |
| secret_key   | 用于与腾讯COS进行身份验证的密钥。                                                      |
| root         | 指定Databend将在其中操作的存储桶内的目录。例如：如果存储桶的根目录有一个名为`myroot`的文件夹，则`root = "myroot/"`。 |

### [storage.hdfs] 部分

以下是在[storage.hdfs]部分中可用的参数列表：

| 参数       | 描述                                                                                   |
|------------|----------------------------------------------------------------------------------------|
| name_node  | Hadoop分布式文件系统（HDFS）的名称节点地址。                                           |
| root       | 指定Databend将在其中操作的目录。                                                        |

### [storage.webhdfs] 部分

以下是在[storage.webhdfs]部分中可用的参数列表：

| 参数         | 描述                                                                                   |
|--------------|----------------------------------------------------------------------------------------|
| endpoint_url | WebHDFS（Hadoop分布式文件系统）的URL端点。                                             |
| root         | 指定Databend将在其中操作的目录。                                                        |
| delegation   | 用于身份验证和授权的委托令牌。                                                         |

## [cache] 部分

以下是在[cache]部分中可用的参数列表：

| 参数                 | 描述                                                                                   |
|----------------------|----------------------------------------------------------------------------------------|
| data_cache_storage   | 用于表数据缓存的存储类型。可用选项："none"（禁用表数据缓存），"disk"（启用磁盘缓存）。默认值为"none"。 |

### [cache.disk] 部分

以下是在[cache.disk]部分中可用的参数列表：

| 参数                 | 描述                                                                                   |
|----------------------|----------------------------------------------------------------------------------------|
| path                 | 使用磁盘缓存时缓存存储的路径。                                                           |
| max_bytes            | 使用磁盘缓存时缓存数据的最大字节数。默认值为21474836480字节（20GB）。                     |