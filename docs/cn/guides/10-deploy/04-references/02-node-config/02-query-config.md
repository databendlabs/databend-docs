---
title: 查询配置
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import LanguageDocs from '@site/src/components/LanguageDocs';

<FunctionDescription description="Introduced or updated: v1.2.698"/>

本页介绍了 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中可用的 Query 节点配置。

- 下表中列出的一些参数可能不存在于 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 中。如果需要这些参数，可以手动将它们添加到文件中。

- 你可以在 GitHub 上找到[示例配置文件](https://github.com/databendlabs/databend/tree/main/scripts/ci/deploy/config)，这些文件用于为各种部署环境设置 Databend。这些文件仅用于内部测试。请不要为了自己的目的修改它们。但是，如果你有类似的部署，参考它们来编辑自己的配置文件是个好主意。

## [query] 部分

以下是 [query] 部分中可用的参数列表：

| 参数                       | 描述                                                                                                 |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| max_active_sessions             | 最大活动会话数。                                                                          |
| shutdown_wait_timeout_ms        | 等待超时时间，以毫秒为单位。                                                                        |
| flight_api_address              | 用于监听 Databend-Query 集群 shuffle 数据的 IP 地址和端口。                                   |
| admin_api_address               | Admin REST API 的地址。                                                                             |
| metric_api_address              | Metrics REST API 的地址。                                                                           |
| mysql_handler_host              | MySQL 查询处理程序的主机名。                                                                       |
| mysql_handler_port              | MySQL 查询处理程序的端口。                                                                           |
| clickhouse_http_handler_host    | ClickHouse HTTP 查询处理程序的主机名。                                                             |
| clickhouse_http_handler_port    | ClickHouse HTTP 查询处理程序的端口。                                                                 |
| http_handler_host               | HTTP API 查询处理程序的主机名。                                                                    |
| http_handler_port               | HTTP API 查询处理程序的端口。                                                                        |
| flight_sql_handler_host         | 实验性 Arrow Flight SQL API 查询处理程序的主机名。                                           |
| flight_sql_handler_port         | 实验性 Arrow Flight SQL API 查询处理程序的端口。                                               |
| tenant_id                       | 默认租户 ID。                                                                                          |
| cluster_id                      | 默认集群 ID。                                                                                         |
| table_engine_memory_enabled     | 启用 Memory 表引擎的标志。                                                                     |
| max_running_queries             | 可以同时执行的最大查询数，默认为 8，0 表示没有限制。 |
| data_retention_time_in_days_max | 设置 `data_retention_time_in_days` 设置的上限，默认值为 90 天。        |

### [query.users] 部分

以下是 [[query.users]] 部分中可用的参数列表。有关配置管理员用户的更多信息，请参见 [配置管理员用户](../01-admin-users.md)。

| 参数   | 描述                                                                     |
| ----------- | ------------------------------------------------------------------------------- |
| name        | 用户名。                                                                      |
| auth_type   | 身份验证类型（例如，no_password、double_sha1_password、sha256_password）。 |
| auth_string | 身份验证字符串（例如，密码的 SHA-1 或 SHA-256 哈希值）。            |

### [query.settings] 部分

以下是 [query.settings] 部分中可用的参数列表。

| 参数                       | 描述                                                                                                                                                                                                                                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| aggregate_spilling_memory_ratio | 控制聚合操作期间将数据溢出到磁盘的阈值。当内存使用量超过可用内存的此百分比时，数据将溢出到对象存储以避免内存耗尽。示例：如果设置为 60，则当内存使用量超过 60% 时会发生溢出。 |
| join_spilling_memory_ratio      | 控制 Join 操作期间将数据溢出到磁盘的阈值。当内存使用量超过可用内存的此百分比时，数据将溢出到对象存储以避免内存耗尽。示例：如果设置为 60，则当内存使用量超过 60% 时会发生溢出。        |

## [log] 部分

本节可以包括以下子节：[log.file]、[log.stderr]、[log.query] 和 [log.tracing]。

### [log.file] 部分

以下是 [log.file] 部分中可用的参数列表：

| 参数 | 描述                                                                                                                                                                                 |
|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| on        | 启用或禁用文件日志记录。默认为 `true`。                                                                                                                                       |
| dir       | 存储日志文件的路径。                                                                                                                                                                    |
| level     | 日志级别，遵循 [env_logger](https://docs.rs/env_logger/latest/env_logger/) 语法：`error`、`warn`、`info`、`debug`、`trace`、`off`。默认为 `warn,databend_=info,openraft=info`。 |
| format    | 日志格式：`json` 或 `text`。默认为 `json`。                                                                                                                                           |
| limit     | 确定要保留的最大日志文件数。默认为 `48`。                                                                                                                |

### [log.stderr] 部分

以下是 [log.stderr] 部分中可用的参数列表：

```
| 参数 | 描述 |
|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| on        | 启用或禁用 stderr 日志记录。默认为 `false`。                                                                                                                                    |
| level     | 日志级别，遵循 [env_logger](https://docs.rs/env_logger/latest/env_logger/) 语法：`error`、`warn`、`info`、`debug`、`trace`、`off`。默认为 `warn,databend_=info,openraft=info`。 |
| format    | 日志格式：`json` 或 `text`。默认为 `json`。                                                                                                                                           |

### [log.query] Section

以下是 [log.query] 部分中可用的参数列表：

| 参数 | 描述 |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| on        | 启用将查询执行详细信息记录到日志目录中的 query-details 文件夹。默认为 on。当存储空间有限时，请考虑禁用。 |

### [log.tracing] Section

以下是 [log.tracing] 部分中可用的参数列表：

| 参数         | 描述 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| capture_log_level | 设置在执行期间捕获跟踪的日志级别（DEBUG、TRACE、INFO、WARN 或 ERROR）。                                                                |
| on                | 控制是否启用跟踪。默认值为 'false' 表示禁用。设置为 'true' 以启用跟踪。                                                  |
| otlp_endpoint     | 指定跟踪的 OpenTelemetry 协议 (OTLP) 端点。默认为 `http://127.0.0.1:4317`，但您可以将其替换为所需的 OTLP 端点。 |

## [meta] Section

以下是 [meta] 部分中可用的参数列表：

| 参数 | 描述 |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| username                     | 用于连接到 Meta 服务的用户名。默认值：“root”。                                                                                                                        |
| password                     | 用于连接到 Meta 服务的密码。Databend 建议使用环境变量 META_PASSWORD 来提供密码。默认值：“root”。                                                                                            |
| endpoints                    | 设置此查询服务器可以连接到的一个或多个 meta 服务器端点。为了与 Meta 建立可靠的连接，如果可能，请在集群中包含多个 meta 服务器作为备份。示例：["192.168.0.1:9191", "192.168.0.2:9191"]。默认值：["0.0.0.0:9191"]。                                                   |
| client_timeout_in_second     | 设置在终止尝试连接到 meta 服务器之前等待的时间（以秒为单位）。默认值：60。                                                                                  |
| auto_sync_interval           | 设置此查询服务器应多久自动从集群中的 meta 服务器同步端点（以秒为单位）。启用后，Databend-query 会定期联系 Databend-meta 服务器以获取 grpc_api_advertise_host:grpc-api-port 列表。要禁用同步，请将其设置为 0。默认值：60。 |
| unhealth_endpoint_evict_time | 不查询不健康的 meta 节点端点的内部时间（以秒为单位）。默认值：120。                                                                                                |

## [storage] Section

以下是 [storage] 部分中可用的参数列表：

| 参数 | 描述 |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type           | 使用的存储类型。它可以是以下之一：fs、s3、azblob、gcs、oss、cos。                                                                                                                                              |
| allow_insecure | 默认为 false。在 MinIO 上部署 Databend 或通过以 `http://` 为前缀的 URL 加载数据时，将其设置为 true，否则，您可能会遇到以下错误：“不允许从不安全的存储复制。请设置 `allow_insecure=true`”。 |

### [storage.fs] Section

以下是 [storage.fs] 部分中可用的参数列表：

| 参数 | 描述 |
| --------- | -------------------------------------- |
| data_path | 数据存储位置的路径。 |

### [storage.s3] Section

以下是 [storage.s3] 部分中可用的参数列表：
```

| 参数                    | 描述                                                                                                                                                            |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket                    | 您的类 Amazon S3 存储桶的名称。                                                                                                                                 |
| endpoint_url              | 类 S3 存储服务的 URL 端点。默认为 "https://s3.amazonaws.com"。                                                                                                      |
| access_key_id             | 用于向存储服务进行身份验证的访问密钥 ID。                                                                                                                             |
| secret_access_key         | 用于向存储服务进行身份验证的密钥。                                                                                                                                 |
| enable_virtual_host_style | 一个布尔标志，指示是否启用虚拟主机样式的寻址。                                                                                                                             |
| external_id               | 用于身份验证的外部 ID。                                                                                                                                          |
| master_key                | 用于身份验证的主密钥。                                                                                                                                           |
| region                    | 类 S3 存储服务的区域。                                                                                                                                            |
| role_arn                  | 用于身份验证的 ARN（Amazon 资源名称）。                                                                                                                              |
| root                      | 指定 Databend 将在存储桶中运行的目录。例如：如果存储桶的根目录有一个名为 `myroot` 的文件夹，则 `root = "myroot/"`。                                                              |
| security_token            | 用于身份验证的安全令牌。                                                                                                                                         |

### [storage.azblob] Section

以下是 [storage.azblob] 部分中可用的参数列表：

| 参数            | 描述                                                                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| endpoint_url | Azure Blob Storage 的 URL 端点（例如，`https://<your-storage-account-name>.blob.core.windows.net`）。                                                                |
| container    | 您的 Azure 存储容器的名称。                                                                                                                                        |
| account_name | 您的 Azure 存储帐户的名称。                                                                                                                                          |
| account_key  | 用于向 Azure Blob Storage 进行身份验证的帐户密钥。                                                                                                                      |
| root         | 指定 Databend 将在存储桶中运行的目录。例如：如果存储桶的根目录有一个名为 `myroot` 的文件夹，则 `root = "myroot/"`。                                                              |

### [storage.gcs] Section

以下是 [storage.gcs] 部分中可用的参数列表：

| 参数       | 描述                                                                                                                                                            |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket     | 您的 Google Cloud Storage 存储桶的名称。                                                                                                                             |
| credential | 用于 Google Cloud Storage 身份验证的 base64 编码的服务帐户密钥文件。                                                                                                       |
| root       | 指定 Databend 将在存储桶中运行的目录。例如：如果存储桶的根目录有一个名为 `myroot` 的文件夹，则 `root = "myroot/"`。                                                              |

要获取 `credential`，您可以按照 Google 文档中的主题 [创建服务帐户密钥](https://cloud.google.com/iam/docs/keys-create-delete#creating)
创建并下载服务帐户密钥文件。下载服务帐户密钥文件后，您可以通过以下命令将其转换为 base64 字符串：

```
base64 -i -o ~/Desktop/base64-encoded-key.txt
```

### [storage.oss] Section

以下是 [storage.oss] 部分中可用的参数列表：

| 参数                 | 描述                                                                                                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket               | 您的阿里云 OSS 存储桶的名称。                                                                                                                                   |
| endpoint_url         | 阿里云 OSS 的 URL 端点。                                                                                                                                        |
| access_key_id        | 用于向阿里云 OSS 进行身份验证的访问密钥 ID。                                                                                                                         |
| access_key_secret    | 用于向阿里云 OSS 进行身份验证的访问密钥。                                                                                                                            |
| presign_endpoint_url | 用于阿里云 OSS 预签名操作的 URL 端点。                                                                                                                               |
| root                 | 指定 Databend 将在存储桶中运行的目录。例如：如果存储桶的根目录有一个名为 `myroot` 的文件夹，则 `root = "myroot/"`。                                                              |

<LanguageDocs
cn=
'

### [storage.obs] Section

以下是 [storage.obs] 部分中可用的参数列表：

| 参数              | 描述                                          |
| ----------------- | --------------------------------------------- |
| bucket            | 您的华为云 OBS 桶的 名称。                    |
| endpoint_url      | 华为云 OBS 的 URL 端点。                      |
| access_key_id     | 用于与华为云 OBS 进行身份验证的访问密钥 ID。  |
| secret_access_key | 用于与华为云 OBS 进行身份验证的访问密钥秘密。 |

'/>

### [storage.cos] Section

以下是 [storage.cos] 部分中可用的参数列表：

| Parameter    | Description                                                                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket       | 您的腾讯云对象存储 (COS) 桶的名称。                                                                                                                                  |
| endpoint_url | 腾讯 COS 的 URL 端点（可选）。                                                                                                                                        |
| secret_id    | 用于与腾讯 COS 进行身份验证的 Secret ID。                                                                                                                             |
| secret_key   | 用于与腾讯 COS 进行身份验证的 Secret Key。                                                                                                                            |
| root         | 指定 Databend 将在桶中操作的目录。例如：如果桶的根目录有一个名为 `myroot` 的文件夹，则 `root = "myroot/"`。                                                               |

## [cache] Section

以下是 [cache] 部分中可用的参数列表：

| Parameter          | Description                                                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| data_cache_storage | 用于表数据缓存的存储类型。可用选项："none"（禁用表数据缓存），"disk"（启用磁盘缓存）。默认为 "none"。                                                                                                                            |
| iceberg_table_meta_count | 控制要缓存的 Iceberg 表元数据条目的数量。设置为 `0` 可禁用元数据缓存。                         |

### [cache.disk] Section

以下是 [cache.disk] 部分中可用的参数列表：

| Parameter | Description                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------------- |
| path      | 使用磁盘缓存时，缓存的存储路径。                                                                         |
| max_bytes | 使用磁盘缓存时，缓存数据的最大字节数。默认为 21474836480 字节 (20 GB)。                                  |

## [spill] Section

以下是 [spill] 部分中可用的参数列表：

| Parameter                                  | Description                                                                                                   |
|--------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| spill_local_disk_path                      | 指定溢出数据将存储在本地磁盘上的目录路径。                                                                     |
| spill_local_disk_reserved_space_percentage | 定义将保留且不用于溢出的磁盘空间百分比。默认值为 `30`。                                                        |
| spill_local_disk_max_bytes                 | 设置允许溢出到本地磁盘的数据的最大字节数。默认为无限制。                                                         |

### [spill.storage] Section

以下是 [spill.storage] 部分中可用的参数列表：

| Parameter | Description                                                        |
|-----------|--------------------------------------------------------------------|
| type      | 指定远程溢出的存储类型，例如 `s3`。                                 |

要指定特定的存储，请使用 [storage Section](#storage-section) 中的参数。有关示例，请参见 [配置溢出存储](/guides/data-management/data-recycle#configuring-spill-storage)。
