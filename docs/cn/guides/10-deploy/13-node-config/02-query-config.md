---
title: 查询配置
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.199"/>

本页面描述了在 [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中可用的查询节点配置。

- 下表中列出的一些参数可能不在 [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 中出现。如果您需要这些参数，可以手动将它们添加到文件中。

- 您可以在 GitHub 上找到[示例配置文件](https://github.com/datafuselabs/databend/tree/main/scripts/ci/deploy/config)，这些文件为各种部署环境设置了 Databend。这些文件仅用于内部测试。请勿为您自己的目的修改它们。但是，如果您有类似的部署，参考它们编辑您自己的配置文件是个好主意。

## [query] 部分

以下是 [query] 部分中可用的参数列表：

| 参数                          | 描述                                              |
|-------------------------------|---------------------------------------------------|
| max_active_sessions           | 最大活动会话数。                                 |
| wait_timeout_mills            | 等待的超时时间（毫秒）。                         |
| flight_api_address            | 用于监听 Databend-Query 集群 shuffle 数据的 IP 地址和端口。 |
| admin_api_address             | 管理 REST API 的地址。                           |
| metric_api_address            | 指标 REST API 的地址。                           |
| mysql_handler_host            | MySQL 查询处理器的主机名。                       |
| mysql_handler_port            | MySQL 查询处理器的端口。                         |
| clickhouse_http_handler_host  | ClickHouse HTTP 查询处理器的主机名。             |
| clickhouse_http_handler_port  | ClickHouse HTTP 查询处理器的端口。               |
| http_handler_host             | HTTP API 查询处理器的主机名。                    |
| http_handler_port             | HTTP API 查询处理器的端口。                      |
| flight_sql_handler_host       | 实验性 Arrow Flight SQL API 查询处理器的主机名。 |
| flight_sql_handler_port       | 实验性 Arrow Flight SQL API 查询处理器的端口。   |
| tenant_id                     | 默认租户 ID。                                    |
| cluster_id                    | 默认集群 ID。                                    |
| table_engine_memory_enabled   | 启用内存表引擎的标志。                           |

## [[query.users]] 部分

以下是 [[query.users]] 部分中可用的参数列表。有关配置管理员用户的更多信息，请参见[配置管理员用户](../04-admin-users.md)。

| 参数         | 描述                                                      |
|--------------|-----------------------------------------------------------|
| name         | 用户名。                                                  |
| auth_type    | 认证类型（例如，no_password, double_sha1_password, sha256_password）。 |
| auth_string  | 认证字符串（例如，密码的 SHA-1 或 SHA-256 散列）。       |

## [log] 部分

此部分可以包括三个子部分：[log.file]、[log.stderr]、[log.query] 和 [log.tracing]。

### [log.file] 部分

以下是 [log.file] 部分中可用的参数列表：

| 参数            | 描述                                                                   |
|-----------------|------------------------------------------------------------------------|
| on              | 启用或禁用文件日志记录。默认为 true。                                  |
| dir             | 存储日志文件的路径。                                                   |
| level           | 日志级别：DEBUG、INFO 或 ERROR。默认为 INFO。                          |
| format          | 日志格式：json 或 text。默认为 json。                                  |

### [log.stderr] 部分

以下是 [log.stderr] 部分中可用的参数列表：



| 参数                | 描述                                                                                                 |
|---------------------|------------------------------------------------------------------------------------------------------|
| on                  | 启用或禁用 stderr 日志记录。默认为 false。                                                             |
| level               | 日志级别：DEBUG、INFO 或 ERROR。默认为 DEBUG。                                                         |
| format              | 日志格式：json 或 text。默认为 text。                                                                 |

### [log.query] 部分 {#log-query}

以下是 [log.query] 部分中可用的参数列表：

| 参数                | 描述                                                                                                 |
|---------------------|------------------------------------------------------------------------------------------------------|
| on                  | 启用将查询执行详情记录到日志目录中的 query-details 文件夹。默认为开启。如果存储空间有限，可以考虑禁用。     |

### [log.tracing] 部分 {#log-tracing}

以下是 [log.tracing] 部分中可用的参数列表：

| 参数                | 描述                                                                                                 |
|---------------------|------------------------------------------------------------------------------------------------------|
| capture_log_level   | 设置在执行期间捕获跟踪的日志级别（DEBUG、TRACE、INFO、WARN 或 ERROR）。                                |
| on                  | 控制是否启用跟踪。默认值为 'false' 表示禁用。设置为 'true' 以启用跟踪。                              |
| otlp_endpoint       | 指定用于跟踪的 OpenTelemetry 协议（OTLP）端点。默认为 'http://127.0.0.1:4317'，但你可以替换为所需的 OTLP 端点。 |

## [meta] 部分 {#meta}

以下是 [meta] 部分中可用的参数列表：

| 参数                         | 描述                                                                                              |
|------------------------------|---------------------------------------------------------------------------------------------------|
| username                     | 用于连接到 Meta 服务的用户名。默认为 "root"。                                                       |
| password                     | 用于连接到 Meta 服务的密码。Databend 建议使用环境变量 META_PASSWORD 来提供密码。默认为 "root"。    |
| endpoints                    | 设置一个或多个此查询服务器可以连接到的 meta 服务器端点。为了稳定连接 Meta，如果可能，包括集群中的多个 meta 服务器作为备份。例如：["192.168.0.1:9191", "192.168.0.2:9191"]。默认为 ["0.0.0.0:9191"]。 |
| client_timeout_in_second     | 设置在终止尝试连接到 meta 服务器之前的等待时间（以秒为单位）。默认为 60。                             |
| auto_sync_interval           | 设置此查询服务器应多久自动从集群中的 meta 服务器同步端点的时间（以秒为单位）。启用后，Databend-query 定期联系 Databend-meta 服务器以获取 grpc_api_advertise_host:grpc-api-port 列表。要禁用同步，将其设置为 0。默认为 60。 |
| unhealth_endpoint_evict_time | 不查询不健康的 meta 节点端点的内部时间（以秒为单位）。默认为 120。                                    |

## [storage] 部分 {#storage}

以下是 [storage] 部分中可用的参数列表：

| 参数       | 描述                                                                                         |
|------------|----------------------------------------------------------------------------------------------|
| type       | 使用的存储类型。可以是以下之一：fs、s3、azblob、gcs、oss、cos、hdfs、webhdfs。                |


### [storage.fs] 部分 {#storage-fs}

以下是 [storage.fs] 部分中可用的参数列表：

| 参数       | 描述                                      |
|------------|-------------------------------------------|
| data_path  | 数据存储位置的路径。                       |

### [storage.s3] 部分 {#storage-s3}

以下是 [storage.s3] 部分中可用的参数列表：



| 参数                      | 描述                                                                                   |
|---------------------------|----------------------------------------------------------------------------------------|
| bucket                    | 您的 Amazon S3 兼容存储桶的名称。                                                         |
| endpoint_url              | S3 兼容存储服务的 URL 端点。默认为 "https://s3.amazonaws.com"。                             |
| access_key_id             | 用于与存储服务认证的访问密钥 ID。                                                       |
| secret_access_key         | 用于与存储服务认证的密钥访问密钥。                                                     |
| enable_virtual_host_style | 一个布尔标志，指示是否启用虚拟主机风格寻址。                                           |
| external_id               | 用于认证的外部 ID。                                                                     |
| master_key                | 用于认证的主密钥。                                                                     |
| region                    | S3 兼容存储服务的区域。                                                                 |
| role_arn                  | 用于认证的 ARN（Amazon 资源名称）。                                                       |
| root                      | HDFS 的根目录。                                                                         |
| security_token            | 用于认证的安全令牌。                                                                   |

### [storage.azblob] 部分

以下是[storage.azblob]部分中可用的参数列表：

| 参数           | 描述                                                                                             |
|----------------|--------------------------------------------------------------------------------------------------|
| endpoint_url   | Azure Blob 存储的 URL 端点（例如，`https://<your-storage-account-name>.blob.core.windows.net`）。     |
| container      | 您的 Azure 存储容器的名称。                                                                        |
| account_name   | 您的 Azure 存储账户的名称。                                                                        |
| account_key    | 用于与 Azure Blob 存储认证的账户密钥。                                                             |
| root           | Azure Blob 存储的根目录。                                                                         |

### [storage.gcs] 部分

以下是[storage.gcs]部分中可用的参数列表：

| 参数           | 描述                                                               |
|----------------|--------------------------------------------------------------------|
| bucket         | 您的 Google Cloud 存储桶的名称。                                      |
| endpoint_url   | Google Cloud 存储的 URL 端点。                                        |
| credential     | 用于与 Google Cloud 存储认证的凭据。                                 |
| root           | Google Cloud 存储的根目录。                                         |

### [storage.oss] 部分

以下是[storage.oss]部分中可用的参数列表：

| 参数                    | 描述                                                             |
|-------------------------|------------------------------------------------------------------|
| bucket                  | 您的阿里云 OSS 存储桶的名称。                                    |
| endpoint_url            | 阿里云 OSS 的 URL 端点。                                         |
| access_key_id           | 用于与阿里云 OSS 认证的访问密钥 ID。                             |
| access_key_secret       | 用于与阿里云 OSS 认证的访问密钥密钥。                           |
| presign_endpoint_url    | 用于与阿里云 OSS 进行预签名操作的 URL 端点。                       |
| root                    | 阿里云 OSS 的根目录。                                           |

### [storage.cos] 部分

以下是[storage.cos]部分中可用的参数列表：



| 参数          | 描述                                                         |
|--------------|-------------------------------------------------------------|
| bucket       | 你的腾讯云对象存储（COS）桶的名称。                           |
| endpoint_url | 腾讯云对象存储（COS）的 URL 端点（可选）。                      |
| secret_id    | 用于与腾讯云对象存储（COS）认证的密钥 ID。                     |
| secret_key   | 用于与腾讯云对象存储（COS）认证的密钥。                       |
| root         | 腾讯云对象存储的根目录。                                      |

### [storage.hdfs] 部分

以下是[storage.hdfs]部分中可用的参数列表：

| 参数            | 描述                                                     |
|----------------|---------------------------------------------------------|
| name_node      | Hadoop 分布式文件系统（HDFS）的名称节点地址。              |
| root           | HDFS 的根目录。                                           |


### [storage.webhdfs] 部分

以下是[storage.webhdfs]部分中可用的参数列表：

| 参数          | 描述                                                         |
|--------------|-------------------------------------------------------------|
| endpoint_url | WebHDFS（Hadoop 分布式文件系统）的 URL 端点。                   |
| root         | HDFS 的根目录。                                               |
| delegation   | 用于认证和授权的委托令牌。                                   |

## [cache] 部分

以下是[cache]部分中可用的参数列表：

| 参数                    | 描述                                                         |
|------------------------|-------------------------------------------------------------|
| data_cache_storage     | 用于表数据缓存的存储类型。可用选项："none"（禁用表数据缓存）、"disk"（启用磁盘缓存）。默认为"none"。|

### [cache.disk] 部分

以下是[cache.disk]部分中可用的参数列表：

| 参数                    | 描述                                                         |
|------------------------|-------------------------------------------------------------|
| path                   | 使用磁盘缓存时存储缓存的路径。                               |
| max_bytes              | 使用磁盘缓存时缓存数据的最大字节数。默认为 21474836480 字节（20GB）。|