---
title: 查询（Query）配置
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import LanguageDocs from '@site/src/components/LanguageDocs';

<FunctionDescription description="引入或更新于：v1.2.698"/>

本页面介绍 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中可用的查询（Query）节点配置。

- 下表中列出的某些参数可能不存在于 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 中。如果需要这些参数，可以手动将它们添加到文件中。

- 您可以在 GitHub 上找到[示例配置文件](https://github.com/databendlabs/databend/tree/main/scripts/ci/deploy/config)，这些文件为各种部署环境设置了 Databend。这些文件仅用于内部测试。请不要为了您自己的目的修改它们。但是，如果您有类似的部署，在编辑您自己的配置文件时参考它们是个好主意。

## [query] 部分

以下是 [query] 部分中可用的参数列表：

| 参数                            | 描述                                                                                                        |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| max_active_sessions             | 最大活跃会话数。                                                                                            |
| shutdown_wait_timeout_ms        | 等待超时（毫秒）。                                                                                          |
| flight_api_address              | 用于监听 Databend-Query 集群 shuffle 数据的 IP 地址和端口。                                                 |
| admin_api_address               | Admin REST API 的地址。                                                                                     |
| metric_api_address              | Metrics REST API 的地址。                                                                                   |
| mysql_handler_host              | MySQL 查询处理程序的主机名。                                                                                |
| mysql_handler_port              | MySQL 查询处理程序的端口。                                                                                  |
| clickhouse_http_handler_host    | ClickHouse HTTP 查询处理程序的主机名。                                                                      |
| clickhouse_http_handler_port    | ClickHouse HTTP 查询处理程序的端口。                                                                        |
| http_handler_host               | HTTP API 查询处理程序的主机名。                                                                             |
| http_handler_port               | HTTP API 查询处理程序的端口。                                                                               |
| flight_sql_handler_host         | 实验性 Arrow Flight SQL API 查询处理程序的主机名。                                                          |
| flight_sql_handler_port         | 实验性 Arrow Flight SQL API 查询处理程序的端口。                                                            |
| tenant_id                       | 默认租户 ID。                                                                                               |
| cluster_id                      | 默认集群 ID。                                                                                               |
| table_engine_memory_enabled     | 启用内存表引擎的标志。                                                                                      |
| max_running_queries             | 可同时执行的最大查询数，默认为 `8`，`0` 表示无限制。                                                        |
| data_retention_time_in_days_max | 设置 `data_retention_time_in_days` 的上限，默认值为 90 天。                                                |

### [query.users] 部分

以下是 [[query.users]] 部分中可用的参数列表。有关配置管理员用户的更多信息，请参见[配置管理员用户](../01-admin-users.md)。

| 参数        | 描述                                                                            |
| ----------- | ------------------------------------------------------------------------------- |
| name        | 用户名。                                                                        |
| auth_type   | 身份验证类型（例如：no_password, double_sha1_password, sha256_password）。      |
| auth_string | 身份验证字符串（例如：密码的 SHA-1 或 SHA-256 哈希值）。                        |

### [query.settings] 部分

以下是 [query.settings] 部分中可用的参数列表。

| 参数                            | 描述                                                                                                                                                                                                                                                                                                  |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| aggregate_spilling_memory_ratio | 控制聚合操作期间将数据溢出到磁盘的阈值。当内存使用超过总可用内存的此百分比时，数据将被溢出到对象存储以避免内存耗尽。例如：设置为 `60` 时，内存使用超过 60% 会触发溢出。                                                                                                                            |
| join_spilling_memory_ratio      | 控制连接操作期间将数据溢出到磁盘的阈值。当内存使用超过总可用内存的此百分比时，数据将被溢出到对象存储以避免内存耗尽。例如：设置为 `60` 时，内存使用超过 60% 会触发溢出。                                                                                                                            |

## [log] 部分

此部分可以包括以下子部分：[log.file]、[log.stderr]、[log.query] 和 [log.tracing]。

### [log.file] 部分

以下是 [log.file] 部分中可用的参数列表：

| 参数   | 描述                                                                                                                                                                                |
|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| on     | 启用或禁用文件日志记录。默认为 `true`。                                                                                                                                             |
| dir    | 存储日志文件的路径。                                                                                                                                                                |
| level  | 日志级别，遵循 [env_logger](https://docs.rs/env_logger/latest/env_logger/) 语法：`error`、`warn`、`info`、`debug`、`trace`、`off`。默认为 `warn,databend_=info,openraft=info`。 |
| format | 日志格式：`json` 或 `text`。默认为 `json`。                                                                                                                                         |
| limit  | 决定保留的最大日志文件数。默认为 `48`。                                                                                                                                             |

### [log.stderr] 部分

以下是 [log.stderr] 部分中可用的参数列表：

| 参数   | 描述                                                                                                                                                                                |
|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| on     | 启用或禁用 stderr 日志记录。默认为 `false`。                                                                                                                                        |
| level  | 日志级别，遵循 [env_logger](https://docs.rs/env_logger/latest/env_logger/) 语法：`error`、`warn`、`info`、`debug`、`trace`、`off`。默认为 `warn,databend_=info,openraft=info`。 |
| format | 日志格式：`json` 或 `text`。默认为 `json`。                                                                                                                                         |

### [log.query] 部分

以下是 [log.query] 部分中可用的参数列表：

| 参数 | 描述                                                                                                                                                        |
|------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| on   | 启用将查询执行详情记录到日志目录中的 query-details 文件夹。默认为 `on`。存储空间有限时建议禁用。                                                             |

### [log.tracing] 部分

以下是 [log.tracing] 部分中可用的参数列表：

| 参数              | 描述                                                                                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| capture_log_level | 设置执行期间捕获跟踪的日志级别（DEBUG、TRACE、INFO、WARN 或 ERROR）。                                                                                         |
| on                | 控制是否启用跟踪。默认值为 `false`（禁用）。设置为 `true` 以启用跟踪。                                                                                        |
| otlp_endpoint     | 指定用于跟踪的 OpenTelemetry Protocol (OTLP) 端点。默认为 `http://127.0.0.1:4317`，可替换为所需 OTLP 端点。                                                   |

### [log.history] 部分

以下是 [log.history] 部分中可用的参数列表：

| 参数               | 描述                                                                                                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| on                 | 启用或禁用历史日志功能。默认为 `false`。设置为 `true` 以启用历史表。                                                                                                                             |
| log_only           | 启用此选项的节点会将转换任务委托给其他节点，减少自身工作负载。                                                                                                                                   |
| interval           | 指定刷新历史日志的间隔（秒）。默认为 `2`。                                                                                                                                                      |
| stage_name         | 指定暂存区名称，用于在数据最终复制到表前临时保存日志数据。默认为唯一值以避免冲突。                                                                                                               |
| level              | 设置历史日志的日志级别（DEBUG、TRACE、INFO、WARN 或 ERROR）。默认为 `WARN`。                                                                                                                    |
| retention_interval | 触发保留流程检查是否需要清理旧数据的间隔（小时）。默认为 `24`。                                                                                                                                 |
| tables             | 指定要启用的历史表及其保留策略。此为对象数组，每个对象包含 table_name（历史表名称）和 retention（该表保留周期，小时）。                                                                          |

`tables` 是对象数组，每个对象有两个参数：
| 参数       | 描述                                                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| table_name | 历史表名称（当前支持：`log_history`、`profile_history`、`query_history`、`login_history`）。                           |
| retention  | 该表的保留周期（小时）。                                                                                               |
注意：`log_history` 表默认启用。

## [meta] 部分

以下是 [meta] 部分中可用的参数列表：

| 参数                         | 描述                                                                                                                                                                                                                                                                                                                  |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| username                     | 连接 Meta 服务的用户名。默认值：`root`。                                                                                                                                                                                                                                                                              |
| password                     | 连接 Meta 服务的密码。建议使用环境变量 META_PASSWORD 提供密码。默认值：`root`。                                                                                                                                                                                                                                       |
| endpoints                    | 设置此查询服务器可连接的元服务器端点。为保障连接可靠性，建议包含集群内多个元服务器作为备份。示例：`["192.168.0.1:9191", "192.168.0.2:9191"]`。默认值：`["0.0.0.0:9191"]`。                                                                                                                                            |
| client_timeout_in_second     | 设置连接元服务器的超时时间（秒）。默认值：`60`。                                                                                                                                                                                                                                                                      |
| auto_sync_interval           | 设置此查询服务器从集群元服务器同步端点的频率（秒）。启用后，Databend-query 定期联系 Databend-meta 服务器获取 grpc_api_advertise_host:grpc-api-port 列表。设置为 `0` 可禁用同步。默认值：`60`。                                                                                                                          |
| unhealth_endpoint_evict_time | 不查询不健康元节点端点的内部时间（秒）。默认值：`120`。                                                                                                                                                                                                                                                               |

## [storage] 部分

以下是 [storage] 部分中可用的参数列表：

| 参数                               | 描述                                                                                                                                                                                                                                         |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type                               | 存储类型（可选：fs, s3, azblob, gcs, oss, cos）。                                                                                                                                                                                           |
| allow_insecure                     | 默认为 `false`。在 MinIO 部署 Databend 或通过 `http://` 前缀 URL 加载数据时需设为 `true`，否则可能报错："不允许从不安全存储复制，请设置 `allow_insecure=true`"。                                                                             |
| `storage_retry_timeout`            | *（秒）* OpenDAL 读/写操作超时重试阈值。默认值：`10`。                                                                                                                                                                                      |
| `storage_retry_io_timeout`         | *（秒）* OpenDAL HTTP 请求超时重试阈值。默认值：`60`。                                                                                                                                                                                      |
| `storage_pool_max_idle_per_host`   | 单主机最大连接池大小。默认值：无限制。                                                                                                                                                                                                       |
| `storage_connect_timeout`          | *（秒）* TCP 连接超时。默认值：`30`。                                                                                                                                                                                                        |
| `storage_tcp_keepalive`            | *（秒）* TCP keepalive 时长。默认值：无。                                                                                                                                                                                                    |
| `storage_max_concurrent_io_requests`| 最大并发 I/O 请求数。默认值：无限制。                                                                                                                                                                                                        |


### [storage.fs] 部分

以下是 [storage.fs] 部分中可用的参数列表：

| 参数      | 描述                           |
| --------- | ------------------------------ |
| data_path | 数据存储位置路径。             |

### [storage.s3] 部分

以下是 [storage.s3] 部分中可用的参数列表：

| 参数                      | 描述                                                                                                                                                                   |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket                    | 类 Amazon S3 存储桶名称。                                                                                                                                              |
| endpoint_url              | 类 S3 存储服务的 URL 端点。默认为 `https://s3.amazonaws.com`。                                                                                                         |
| access_key_id             | 存储服务身份验证的访问密钥 ID。                                                                                                                                        |
| secret_access_key         | 存储服务身份验证的密钥访问密钥。                                                                                                                                       |
| enable_virtual_host_style | 是否启用虚拟主机式寻址的布尔标志。                                                                                                                                     |
| external_id               | 身份验证外部 ID。                                                                                                                                                      |
| master_key                | 身份验证主密钥。                                                                                                                                                       |
| region                    | 类 S3 存储服务的区域。                                                                                                                                                 |
| role_arn                  | 身份验证 ARN（Amazon Resource Name）。                                                                                                                                 |
| root                      | 指定存储桶内 Databend 的操作目录。示例：若存储桶根目录有 `myroot` 文件夹，则设为 `root = "myroot/"`。                                                                   |
| security_token            | 身份验证安全令牌。                                                                                                                                                     |

### [storage.azblob] 部分

以下是 [storage.azblob] 部分中可用的参数列表：

| 参数         | 描述                                                                                                                                                                   |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| endpoint_url | Azure Blob 存储 URL 端点（例如：`https://<your-storage-account-name>.blob.core.windows.net`）。                                                                        |
| container    | Azure 存储容器名称。                                                                                                                                                  |
| account_name | Azure 存储账户名称。                                                                                                                                                  |
| account_key  | Azure Blob 存储身份验证的账户密钥。                                                                                                                                   |
| root         | 指定存储桶内 Databend 的操作目录。示例：若存储桶根目录有 `myroot` 文件夹，则设为 `root = "myroot/"`。                                                                   |

### [storage.gcs] 部分

以下是 [storage.gcs] 部分中可用的参数列表：

| 参数       | 描述                                                                                                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket     | Google Cloud Storage 存储桶名称。                                                                                                                                      |
| credential | Google Cloud Storage 身份验证的 base64 编码服务账户密钥文件。                                                                                                          |
| root       | 指定存储桶内 Databend 的操作目录。示例：若存储桶根目录有 `myroot` 文件夹，则设为 `root = "myroot/"`。                                                                   |

获取 `credential` 可参考 Google 文档[创建服务账户密钥](https://cloud.google.com/iam/docs/keys-create-delete#creating)创建并下载密钥文件，通过以下命令转换为 base64 字符串：

```
base64 -i -o ~/Desktop/base64-encoded-key.txt
```

### [storage.oss] 部分

以下是 [storage.oss] 部分中可用的参数列表：

| 参数                 | 描述                                                                                                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket               | 阿里云 OSS 存储桶名称。                                                                                                                                                |
| endpoint_url         | 阿里云 OSS URL 端点。                                                                                                                                                  |
| access_key_id        | 阿里云 OSS 身份验证的访问密钥 ID。                                                                                                                                     |
| access_key_secret    | 阿里云 OSS 身份验证的访问密钥。                                                                                                                                        |
| presign_endpoint_url | 阿里云 OSS 预签名操作 URL 端点。                                                                                                                                       |
| root                 | 指定存储桶内 Databend 的操作目录。示例：若存储桶根目录有 `myroot` 文件夹，则设为 `root = "myroot/"`。                                                                   |

### [storage.obs] Section

以下是 [storage.obs] 部分中可用的参数列表：

| 参数              | 描述                                          |
| ----------------- | --------------------------------------------- |
| bucket            | 华为云 OBS 存储桶名称。                       |
| endpoint_url      | 华为云 OBS URL 端点。                         |
| access_key_id     | 华为云 OBS 身份验证的访问密钥 ID。            |
| secret_access_key | 华为云 OBS 身份验证的访问密钥。               |

### [storage.cos] 部分

以下是 [storage.cos] 部分中可用的参数列表：

| 参数         | 描述                                                                                                                                                                   |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket       | 腾讯云对象存储 (COS) 存储桶名称。                                                                                                                                      |
| endpoint_url | 腾讯云 COS URL 端点（可选）。                                                                                                                                          |
| secret_id    | 腾讯云 COS 身份验证的密钥 ID。                                                                                                                                         |
| secret_key   | 腾讯云 COS 身份验证的密钥。                                                                                                                                            |
| root         | 指定存储桶内 Databend 的操作目录。示例：若存储桶根目录有 `myroot` 文件夹，则设为 `root = "myroot/"`。                                                                   |

## [cache] 部分

以下是 [cache] 部分中可用的参数列表：

| 参数                     | 描述                                                                                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| data_cache_storage       | 表数据缓存存储类型（可选："none"禁用缓存，"disk"启用磁盘缓存）。默认为 `"none"`。                                                                       |
| iceberg_table_meta_count | 控制缓存的 Iceberg 表元数据条目数。设为 `0` 可禁用元数据缓存。                                                                                         |

### [cache.disk] 部分

以下是 [cache.disk] 部分中可用的参数列表：

| 参数      | 描述                                                                                                     |
| --------- | -------------------------------------------------------------------------------------------------------- |
| path      | 磁盘缓存的存储路径。                                                                                     |
| max_bytes | 磁盘缓存的最大数据量（字节）。默认为 `21474836480` 字节（20 GB）。                                        |

## [spill] 部分

以下是 [spill] 部分中可用的参数列表：

| 参数                                       | 描述                                                                                                          |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| spill_local_disk_path                      | 指定本地磁盘存储溢出数据的目录路径。                                                                          |
| spill_local_disk_reserved_space_percentage | 定义保留不用于溢出的磁盘空间百分比。默认值：`30`。                                                            |
| spill_local_disk_max_bytes                 | 本地磁盘溢出数据的最大字节数。默认为无限制。                                                                  |

### [spill.storage] 部分

以下是 [spill.storage] 部分中可用的参数列表：

| 参数 | 描述                                                               |
| ---- | ------------------------------------------------------------------ |
| type | 指定远程溢出的存储类型（例如：`s3`）。                             |

配置具体存储需使用 [storage 部分](#storage-部分)参数，示例参见[配置溢出存储](/guides/data-management/data-recycle#configuring-spill-storage)。