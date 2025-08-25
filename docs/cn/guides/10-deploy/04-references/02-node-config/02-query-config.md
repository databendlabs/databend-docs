title: 查询配置
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import LanguageDocs from '@site/src/components/LanguageDocs';

<FunctionDescription description="引入或更新于：v1.2.901"/>

本页面介绍 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中可用的查询节点配置。

- 下表中列出的某些参数可能不在 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 文件中。如需使用这些参数，可手动将其添加到文件。

- 您可在 GitHub 上找到[示例配置文件](https://github.com/databendlabs/databend/tree/main/scripts/ci/deploy/config)，这些文件为各种部署环境设置了 Databend。这些文件仅供内部测试使用，请勿直接修改。若部署场景类似，可在编辑自己的配置文件时参考。

## [query] 部分

以下是 [query] 部分中可用的参数列表：

| 参数                       | 描述                                                                                                 |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| max_active_sessions             | 最大活跃会话数。                                                                          |
| shutdown_wait_timeout_ms        | 等待超时时间（毫秒）。                                                                        |
| flight_api_address              | 用于监听 Databend-Query 集群 shuffle 数据的 IP 地址和端口。                                   |
| admin_api_address               | Admin REST API 地址。                                                                             |
| metric_api_address              | Metrics REST API 地址。                                                                           |
| mysql_handler_host              | MySQL 查询处理程序主机名。                                                                       |
| mysql_handler_port              | MySQL 查询处理程序端口。                                                                           |
| clickhouse_http_handler_host    | ClickHouse HTTP 查询处理程序主机名。                                                             |
| clickhouse_http_handler_port    | ClickHouse HTTP 查询处理程序端口。                                                                 |
| http_handler_host               | HTTP API 查询处理程序主机名。                                                                    |
| http_handler_port               | HTTP API 查询处理程序端口。                                                                        |
| flight_sql_handler_host         | 实验性 Arrow Flight SQL API 查询处理程序主机名。                                           |
| flight_sql_handler_port         | 实验性 Arrow Flight SQL API 查询处理程序端口。                                               |
| tenant_id                       | 默认租户 ID。                                                                                          |
| cluster_id                      | 默认集群 ID。                                                                                         |
| table_engine_memory_enabled     | 是否启用 Memory 表引擎的标志。                                                                     |
| max_running_queries             | 可同时执行的最大查询数，默认为 8，0 表示无限制。 |
| data_retention_time_in_days_max | 设置 `data_retention_time_in_days` 的上限，默认 90 天。        |

### [query.users] 部分

以下是 [[query.users]] 部分中可用的参数列表。有关配置管理员用户的更多信息，请参见[配置管理员用户](../01-admin-users.md)。

| 参数   | 描述                                                                     |
| ----------- | ------------------------------------------------------------------------------- |
| name        | 用户名。                                                                      |
| auth_type   | 身份验证类型（如 no_password、double_sha1_password、sha256_password）。 |
| auth_string | 身份验证字符串（如密码的 SHA-1 或 SHA-256 哈希）。            |

### [query.settings] 部分

以下是 [query.settings] 部分中可用的参数列表：

| 参数                       | 描述                                                                                                                                                                                                                                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| aggregate_spilling_memory_ratio | 控制聚合操作期间将数据溢出到磁盘的阈值。当内存使用超过总可用内存的此百分比时，数据将溢出到对象存储以避免内存耗尽。示例：若设为 60，则内存使用超过 60% 时触发溢出。 |
| join_spilling_memory_ratio      | 控制连接操作期间将数据溢出到磁盘的阈值。当内存使用超过总可用内存的此百分比时，数据将溢出到对象存储以避免内存耗尽。示例：若设为 60，则内存使用超过 60% 时触发溢出。        |

## [log] 部分

此部分可包含以下子部分：[log.file]、[log.stderr]、[log.query] 和 [log.tracing]。

### [log.file] 部分

以下是 [log.file] 部分中可用的参数列表：

| 参数 | 描述                                                                                                                                                                                 |
|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| on        | 是否启用文件日志。默认为 `true`。                                                                                                                                       |
| dir       | 日志文件存储路径。                                                                                                                                                                    |
| level     | 日志级别，遵循 [env_logger](https://docs.rs/env_logger/latest/env_logger/) 语法：`error`、`warn`、`info`、`debug`、`trace`、`off`。默认为 `warn,databend_=info,openraft=info`。 |
| format    | 日志格式：`json` 或 `text`。默认为 `json`。                                                                                                                                           |
| limit     | 保留的最大日志文件数。默认为 `48`。                                                                                                                |

### [log.stderr] 部分

以下是 [log.stderr] 部分中可用的参数列表：

| 参数 | 描述                                                                                                                                                                                 |
|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| on        | 是否启用 stderr 日志。默认为 `false`。                                                                                                                                    |
| level     | 日志级别，遵循 [env_logger](https://docs.rs/env_logger/latest/env_logger/) 语法：`error`、`warn`、`info`、`debug`、`trace`、`off`。默认为 `warn,databend_=info,openraft=info`。 |
| format    | 日志格式：`json` 或 `text`。默认为 `json`。                                                                                                                                           |

### [log.query] 部分

以下是 [log.query] 部分中可用的参数列表：

| 参数 | 描述                                                                                                                                                 |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| on        | 是否将查询执行详情记录到日志目录中的 query-details 文件夹。默认为开启。存储空间有限时可考虑关闭。 |

### [log.tracing] 部分

以下是 [log.tracing] 部分中可用的参数列表：

| 参数         | 描述                                                                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| capture_log_level | 设置执行期间捕获追踪的日志级别（DEBUG、TRACE、INFO、WARN 或 ERROR）。                                                                |
| on                | 是否启用追踪。默认为 false（禁用）。设为 true 以启用追踪。                                                  |
| otlp_endpoint     | 指定用于追踪的 OpenTelemetry Protocol (OTLP) 端点。默认为 `http://127.0.0.1:4317`，可替换为所需的 OTLP 端点。 |

### [log.history] 部分

以下是 [log.history] 部分中可用的参数列表：

| 参数         | 描述                                                                                                                                                      |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| on                | 是否启用历史日志功能。默认为 false。设为 true 以启用历史表。                                                        |
| log_only          | 启用后，节点会将转换任务委托给其他节点，减少自身工作负载。                                                               |
| interval          | 历史日志刷新间隔（秒）。默认为 2。                                                                          |
| stage_name        | 指定暂存区名称，用于在日志数据最终写入表前临时保存数据。默认为唯一值以避免冲突。|
| level             | 历史日志级别（DEBUG、TRACE、INFO、WARN 或 ERROR）。默认为 WARN。                                                                   |
| retention_interval| 触发保留进程检查并清理旧数据的时间间隔（小时）。默认为 24。                                       |
| tables            | 指定要启用的历史表及其保留策略。为对象数组，每个对象包含 table_name（历史表名称）和 retention（该表的保留期，以小时为单位）。 |
| storage           | 指定历史表的存储位置。默认使用 [storage] 部分定义的存储配置，也可为历史表单独指定存储位置。格式与 [storage] 部分完全一致。|

`tables` 为对象数组，每个对象包含两个参数：
| 参数  | 描述 |
| ---------  | ----------- |
| table_name | 历史表名称（当前支持：`log_history`、`profile_history`、`query_history`、`login_history`） |
| retention  | 该表的保留期（小时）。                                                                          |
注意：`log_history` 表默认启用。
 
若指定了 `storage`，原默认历史表将被删除并以新的存储配置重新创建。同一租户下的所有节点必须使用相同的 `storage` 配置以确保一致性。

## [meta] 部分

以下是 [meta] 部分中可用的参数列表：

| 参数                    | 描述                                                                                                                                                                                                                                                                                                           |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| username                     | 连接元数据服务的用户名。默认值："root"。                                                                                                                                                                                                                                                    |
| password                     | 连接元数据服务的密码。建议使用环境变量 META_PASSWORD 提供密码。默认值："root"。                                                                                                                                                          |
| endpoints                    | 设置查询服务器可连接的元数据服务器端点。为与元数据建立稳健连接，建议在集群中配置多个元数据服务器作为备份。示例：["192.168.0.1:9191", "192.168.0.2:9191"]。默认值：["0.0.0.0:9191"]。                                                   |
| client_timeout_in_second     | 连接元数据服务器超时时间（秒）。默认值：60。                                                                                                                                                                                                              |
| auto_sync_interval           | 查询服务器自动从集群内元数据服务器同步端点的频率（秒）。启用后，Databend-query 会定期联系 Databend-meta 服务器获取 grpc_api_advertise_host:grpc-api-port 列表。设为 0 可禁用同步。默认值：60。 |
| unhealth_endpoint_evict_time | 不查询不健康元数据节点端点的内部时间（秒）。默认值：120。                                                                                                                                                                                                                            |

## [storage] 部分

以下是 [storage] 部分中可用的参数列表：

| 参数      | 描述                                                                                                                                                                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type           | 存储类型。可选值：fs、s3、azblob、gcs、oss、cos。                                                                                                                                              |
| allow_insecure | 默认为 false。在 MinIO 上部署 Databend 或通过 `http://` 前缀的 URL 加载数据时，请设为 true，否则可能出现错误：“copy from insecure storage is not allowed. Please set `allow_insecure=true`”。 |
| `storage_retry_timeout`             | *（秒）* 若 OpenDAL 读/写操作超过此阈值则重试。默认值：`10`。 |
| `storage_retry_io_timeout`          | *（秒）* 若 OpenDAL HTTP 请求超过此阈值则重试。默认值：`60`。 |
| `storage_pool_max_idle_per_host`    | 每主机最大连接池大小。默认值：无限制。 |
| `storage_connect_timeout`           | *（秒）* TCP 连接超时。默认值：`30`。 |
| `storage_tcp_keepalive`             | *（秒）* TCP keepalive 持续时间。默认值：无。 |
| `storage_max_concurrent_io_requests`| 最大并发 I/O 请求数。默认值：无限制。 |

### [storage.fs] 部分

以下是 [storage.fs] 部分中可用的参数列表：

| 参数 | 描述                            |
| --------- | -------------------------------------- |
| data_path | 数据存储路径。 |

### [storage.s3] 部分

以下是 [storage.s3] 部分中可用的参数列表：

| 参数                 | 描述                                                                                                                                                            |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket                    | 类 Amazon S3 存储桶名称。                                                                                                                        |
| endpoint_url              | 类 S3 存储服务的 URL 端点。默认为 "https://s3.amazonaws.com"。                                                                              |
| access_key_id             | 用于身份验证的访问密钥 ID。                                                                                                         |
| secret_access_key         | 用于身份验证的密钥。                                                                                                     |
| enable_virtual_host_style | 是否启用虚拟主机样式寻址的布尔标志。                                                                                             |
| external_id               | 用于身份验证的外部 ID。                                                                                                                                        |
| master_key                | 用于身份验证的主密钥。                                                                                                                                         |
| region                    | 类 S3 存储服务的区域。                                                                                                                            |
| role_arn                  | 用于身份验证的 ARN (Amazon Resource Name)。                                                                                                                         |
| root                      | 指定桶内 Databend 操作的目录。示例：若桶根目录有名为 `myroot` 的文件夹，则 `root = "myroot/"`。 |
| security_token            | 用于身份验证的安全令牌。                                                                                                                                     |

### [storage.azblob] 部分

以下是 [storage.azblob] 部分中可用的参数列表：

| 参数    | 描述                                                                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| endpoint_url | Azure Blob 存储的 URL 端点（如 `https://<your-storage-account-name>.blob.core.windows.net)`）。                                                           |
| container    | Azure 存储容器名称。                                                                                                                              |
| account_name | Azure 存储帐户名称。                                                                                                                                |
| account_key  | 用于身份验证的 Azure Blob 存储帐户密钥。                                                                                                            |
| root         | 指定桶内 Databend 操作的目录。示例：若桶根目录有名为 `myroot` 的文件夹，则 `root = "myroot/"`。 |

### [storage.gcs] 部分

以下是 [storage.gcs] 部分中可用的参数列表：

| 参数  | 描述                                                                                                                                                            |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket     | Google Cloud Storage 桶名称。                                                                                                                          |
| credential | 用于身份验证的 base64 编码的 Google Cloud Storage 服务帐户密钥文件。                                                                                   |
| root       | 指定桶内 Databend 操作的目录。示例：若桶根目录有名为 `myroot` 的文件夹，则 `root = "myroot/"`。 |

获取 credential 的方法：参考 Google 文档主题 [创建服务帐户密钥](https://cloud.google.com/iam/docs/keys-create-delete#creating) 创建并下载服务帐户密钥文件。下载后，可通过以下命令将其转换为 base64 字符串：

```
base64 -i -o ~/Desktop/base64-encoded-key.txt
```

### [storage.oss] 部分

以下是 [storage.oss] 部分中可用的参数列表：

| 参数            | 描述                                                                                                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket               | 阿里云 OSS 桶名称。                                                                                                                             |
| endpoint_url         | 阿里云 OSS 的 URL 端点。                                                                                                                                |
| access_key_id        | 用于身份验证的访问密钥 ID。                                                                                                           |
| access_key_secret    | 用于身份验证的密钥。                                                                                                       |
| presign_endpoint_url | 用于预签名操作的阿里云 OSS URL 端点。                                                                                                      |
| root                 | 指定桶内 Databend 操作的目录。示例：若桶根目录有名为 `myroot` 的文件夹，则 `root = "myroot/"`。 |

<LanguageDocs
cn=
'

### [storage.obs] 部分

以下是 [storage.obs] 部分中可用的参数列表：

| 参数              | 描述                                        |
| ----------------- | ------------------------------------------- |
| bucket            | 您的华为云 OBS 桶的名称。                   |
| endpoint_url      | 华为云 OBS 的 URL 端点。                    |
| access_key_id     | 用于与华为云 OBS 进行身份验证的访问密钥 ID。  |
| secret_access_key | 用于与华为云 OBS 进行身份验证的秘密访问密钥。 |

'/>

### [storage.cos] 部分

以下是 [storage.cos] 部分中可用的参数列表：

| 参数    | 描述                                                                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket       | 腾讯云对象存储（COS）桶名称。                                                                                                            |
| endpoint_url | 腾讯云 COS 的 URL 端点（可选）。                                                                                                                           |
| secret_id    | 用于身份验证的腾讯云 COS Secret ID。                                                                                                                     |
| secret_key   | 用于身份验证的腾讯云 COS Secret Key。                                                                                                                    |
| root         | 指定桶内 Databend 操作的目录。示例：若桶根目录有名为 `myroot` 的文件夹，则 `root = "myroot/"`。 |

## [cache] 部分

以下是 [cache] 部分中可用的参数列表：

| 参数          | 描述                                                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| data_cache_storage | 表数据缓存的存储类型。可选值："none"（禁用表数据缓存），"disk"（启用磁盘缓存）。默认为 "none"。 |
| iceberg_table_meta_count | 控制缓存的 Iceberg 表元数据条目数。设为 `0` 可禁用元数据缓存。                         |

### [cache.disk] 部分

以下是 [cache.disk] 部分中可用的参数列表：

| 参数 | 描述                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------------- |
| path      | 使用磁盘缓存时的缓存存储路径。                                                |
| max_bytes | 使用磁盘缓存时的最大缓存数据量（字节）。默认为 21474836480 字节（20 GB）。 |

## [spill] 部分

Databend 支持溢出存储，以处理超出可用内存的大型查询。统一配置格式为所有存储类型提供一致模式，并具备自动检测能力。

### [spill.storage] 部分

| 参数 | 描述                                                                                    |
|-----------|------------------------------------------------------------------------------------------------|
| type      | 指定存储类型。可选值：`fs`（文件系统）、`s3`、`azblob`、`gcs`、`oss`、`cos` 等。 |

### [spill.storage.fs] 部分（文件系统存储）

| 参数                   | 描述                                                                                   |
|-----------------------------|-----------------------------------------------------------------------------------------------|
| data_path                   | 指定溢出数据在本地文件系统的存储目录路径。       |
| reserved_space_percentage   | 定义保留且不用于溢出的磁盘空间百分比，防止溢出操作完全填满磁盘，确保系统稳定。默认值：`30`。 |
| max_bytes                   | 设置允许溢出到本地文件系统的数据最大字节数。达到此限制时，新的溢出操作将自动回退到主数据存储（远程存储），确保查询不中断。默认值：无限制。            |

**示例（文件系统存储）：**
```toml
[spill.storage]
type = "fs"

[spill.storage.fs]
data_path = "/fast-ssd/spill"
reserved_space_percentage = 25.0
max_bytes = 107374182400  # 100GB
```

### [spill.storage.s3] 部分（S3 远程存储）

对于基于 S3 的溢出存储，请使用 [storage.s3 部分](#storages3-部分) 中定义的相同参数。

**示例（S3 存储）：**
```toml
[spill.storage]
type = "s3"

[spill.storage.s3]
bucket = "my-spill-bucket"
region = "us-west-2"
access_key_id = "your-access-key"
secret_access_key = "your-secret-key"
```

<details>
<summary>旧版格式（向后兼容）</summary>

:::note
旧版格式为保持向后兼容性而保留。若 Databend 版本低于 v1.2.901，请使用此格式。新部署应使用上述统一格式。
:::

| 参数                                  | 描述                                                                                                   |
|--------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| spill_local_disk_path                      | 指定溢出数据在本地磁盘的存储目录路径。                             |
| spill_local_disk_reserved_space_percentage | 定义保留且不用于溢出的磁盘空间百分比，防止溢出操作完全填满磁盘，确保系统稳定。默认值：`30`。 |
| spill_local_disk_max_bytes                 | 设置允许溢出到本地磁盘的数据最大字节数。达到此限制时，新的溢出操作将自动回退到主数据存储（远程存储），确保查询不中断。默认值：无限制。          |

**示例（旧版格式）：**
```toml
[spill]
spill_local_disk_path = "/data/spill"
spill_local_disk_reserved_space_percentage = 30.0
spill_local_disk_max_bytes = 53687091200
```

</details>