---
title: 查询配置
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import LanguageDocs from '@site/src/components/LanguageDocs';
import DetailsWrap from '@site/src/components/DetailsWrap';

<FunctionDescription description="引入或更新：v1.2.901"/>

本页介绍 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中可用的 Query 节点配置。

- 下表中列出的某些参数可能未出现在 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 中。如需使用这些参数，可手动将其添加到文件。

- 您可在 GitHub 上找到[示例配置文件](https://github.com/databendlabs/databend/tree/main/scripts/ci/deploy/config)，这些文件为不同部署环境配置了 Databend。它们仅用于内部测试，请勿直接修改。若您的部署场景类似，可参考这些文件编辑自己的配置。

## [query] 部分

[query] 部分可用参数如下：

| 参数 | 描述 |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| max_active_sessions | 最大活跃会话数。 |
| shutdown_wait_timeout_ms | 等待超时时间（毫秒）。 |
| flight_api_address | 监听 Databend-Query 集群 shuffle 数据的 IP 地址与端口。 |
| admin_api_address | Admin REST API 地址。 |
| metric_api_address | Metrics REST API 地址。 |
| mysql_handler_host | MySQL 查询处理器主机名。 |
| mysql_handler_port | MySQL 查询处理器端口。 |
| clickhouse_http_handler_host | ClickHouse HTTP 查询处理器主机名。 |
| clickhouse_http_handler_port | ClickHouse HTTP 查询处理器端口。 |
| http_handler_host | HTTP API 查询处理器主机名。 |
| http_handler_port | HTTP API 查询处理器端口。 |
| flight_sql_handler_host | 实验性 Arrow Flight SQL API 查询处理器主机名。 |
| flight_sql_handler_port | 实验性 Arrow Flight SQL API 查询处理器端口。 |
| tenant_id | 默认租户 ID。 |
| cluster_id | 默认集群 ID。 |
| table_engine_memory_enabled | 是否启用 Memory 表引擎（Memory Table Engine）。 |
| max_running_queries | 可同时执行的最大查询数，默认为 8，0 表示无限制。 |
| data_retention_time_in_days_max | 设置 `data_retention_time_in_days` 的上限，默认为 90 天。 |

### [query.users] 部分

[[query.users]] 部分可用参数如下。有关管理员用户配置的更多信息，请参见[配置管理员用户](../admin-users.md)。

| 参数 | 描述 |
| ----------- | ------------------------------------------------------------------------------- |
| name | 用户名。 |
| auth_type | 认证类型（如 no_password、double_sha1_password、sha256_password）。 |
| auth_string | 认证字符串（如密码的 SHA-1 或 SHA-256 哈希）。 |

### [query.settings] 部分

[query.settings] 部分可用参数如下：

| 参数 | 描述 |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| aggregate_spilling_memory_ratio | 聚合操作触发磁盘溢出的内存阈值百分比。当内存使用超过总可用内存的该百分比时，数据将溢出到对象存储以避免内存耗尽。例如设为 60，则内存使用超过 60% 时触发溢出。 |
| join_spilling_memory_ratio | Join 操作触发磁盘溢出的内存阈值百分比。当内存使用超过总可用内存的该百分比时，数据将溢出到对象存储以避免内存耗尽。例如设为 60，则内存使用超过 60% 时触发溢出。 |

## [log] 部分

该部分可包含以下子部分：[log.file]、[log.stderr]、[log.query] 和 [log.tracing]。

### [log.file] 部分

[log.file] 部分可用参数如下：

| 参数 | 描述 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| on | 是否启用文件日志，默认为 `true`。 |
| dir | 日志文件存储路径。 |
| level | 日志级别，遵循 [env_logger](https://docs.rs/env_logger/latest/env_logger/) 语法：`error`、`warn`、`info`、`debug`、`trace`、`off`。默认为 `warn,databend_=info,openraft=info`。 |
| format | 日志格式：`json` 或 `text`，默认为 `json`。 |
| limit | 保留的最大日志文件数，默认为 `48`。 |

### [log.stderr] 部分

[log.stderr] 部分可用参数如下：

| 参数 | 描述 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| on | 是否启用 stderr 日志，默认为 `false`。 |
| level | 日志级别，遵循 [env_logger](https://docs.rs/env_logger/latest/env_logger/) 语法：`error`、`warn`、`info`、`debug`、`trace`、`off`。默认为 `warn,databend_=info,openraft=info`。 |
| format | 日志格式：`json` 或 `text`，默认为 `json`。 |

### [log.query] 部分

[log.query] 部分可用参数如下：

| 参数 | 描述 |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| on | 是否将查询执行详情记录到日志目录的 query-details 文件夹，默认为启用。存储空间有限时可考虑关闭。 |

### [log.tracing] 部分

[log.tracing] 部分可用参数如下：

| 参数 | 描述 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| capture_log_level | 执行期间捕获追踪的日志级别（DEBUG、TRACE、INFO、WARN 或 ERROR）。 |
| on | 是否启用追踪，默认为 `false`，设为 `true` 启用。 |
| otlp_endpoint | 用于追踪的 OpenTelemetry Protocol（OTLP）端点，默认为 `http://127.0.0.1:4317`，可替换为所需端点。 |

### [log.history] 部分

[log.history] 部分可用参数如下：

| 参数 | 描述 |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| on | 是否启用历史日志功能，默认为 false，设为 true 启用历史表。 |
| log_only | 启用后，节点将转换任务委托给其他节点，减轻自身负载。 |
| interval | 历史日志刷新的间隔（秒），默认为 2。 |
| stage_name | 临时保存日志数据的暂存区名称，默认为唯一值以避免冲突。 |
| level | 历史日志的日志级别（DEBUG、TRACE、INFO、WARN 或 ERROR），默认为 WARN。 |
| retention_interval | 触发保留流程检查并清理旧数据的间隔（小时），默认为 24。 |
| tables | 指定要启用的历史表及其保留策略。该数组中的每个对象包含 table_name（历史表名）和 retention（该表的保留时长，单位小时）。 |
| storage | 指定历史表的存储位置。默认与 [storage] 部分配置相同，也可单独指定，格式与 [storage] 部分完全一致。 |

`tables` 为对象数组，每个对象包含两个参数：
| 参数 | 描述 |
| --------- | ----------- |
| table_name | 历史表名（当前支持：`log_history`、`profile_history`、`query_history`、`login_history`） |
| retention | 该表的保留时长（小时）。 |
注意：`log_history` 表默认启用。

若指定了 `storage`，原有默认历史表将被删除并以新存储配置重建。同一租户下所有节点必须使用相同的 `storage` 配置以保证一致性。

## [meta] 部分

[meta] 部分可用参数如下：

| 参数 | 描述 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| username | 连接 Meta 服务的用户名，默认为 "root"。 |
| password | 连接 Meta 服务的密码。建议使用环境变量 META_PASSWORD 提供，默认为 "root"。 |
| endpoints | 查询服务器可连接的 meta 服务器端点列表。为提升连接可靠性，建议列出集群内多个 meta 服务器作为备份。示例：["192.168.0.1:9191", "192.168.0.2:9191"]，默认为 ["0.0.0.0:9191"]。 |
| client_timeout_in_second | 连接 meta 服务器的超时时间（秒），默认为 60。 |
| auto_sync_interval | 查询服务器自动从集群 meta 服务器同步端点列表的间隔（秒）。启用后，Databend-query 会定期联系 Databend-meta 获取 grpc_api_advertise_host:grpc-api-port 列表。设为 0 禁用同步，默认为 60。 |
| unhealth_endpoint_evict_time | 内部不再向不健康 meta 节点端点查询的时间（秒），默认为 120。 |

## [storage] 部分

[storage] 部分可用参数如下：

| 参数 | 描述 |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type | 存储类型，可选值：fs、s3、azblob、gcs、oss、cos。 |
| allow_insecure | 默认为 false。在 MinIO 部署或通过 `http://` 前缀 URL 加载数据时需设为 true，否则报错：“copy from insecure storage is not allowed. Please set `allow_insecure=true`”。 |
| `storage_retry_timeout` | _（秒）_ OpenDAL 读写操作超时后的重试阈值，默认为 `10`。 |
| `storage_retry_io_timeout` | _（秒）_ OpenDAL HTTP 请求超时后的重试阈值，默认为 `60`。 |
| `storage_pool_max_idle_per_host` | 每主机最大连接池大小，默认为无限制。 |
| `storage_connect_timeout` | _（秒）_ TCP 连接超时，默认为 `30`。 |
| `storage_tcp_keepalive` | _（秒）_ TCP keepalive 持续时间，默认为无。 |
| `storage_max_concurrent_io_requests` | 最大并发 I/O 请求数，默认为无限制。 |

### [storage.fs] 部分

[storage.fs] 部分可用参数如下：

| 参数 | 描述 |
| --------- | -------------------------------------- |
| data_path | 数据存储路径。 |

### [storage.s3] 部分

[storage.s3] 部分可用参数如下：

| 参数 | 描述 |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket | 类 Amazon S3 存储桶名称。 |
| endpoint_url | 类 S3 存储服务的 URL 端点，默认为 "https://s3.amazonaws.com"。 |
| access_key_id | 存储服务认证所需的 Access Key ID。 |
| secret_access_key | 存储服务认证所需的 Secret Access Key。 |
| enable_virtual_host_style | 是否启用虚拟主机风格寻址的布尔标志。 |
| external_id | 认证用的 External ID。 |
| master_key | 认证用的主密钥。 |
| region | 类 S3 存储服务的区域。 |
| role_arn | 认证用的 ARN（Amazon Resource Name）。 |
| root | 指定桶内 Databend 操作的目录。示例：若桶根目录有 `myroot` 文件夹，则 `root = "myroot/"`。 |
| security_token | 认证用的安全令牌。 |

### [storage.azblob] 部分

[storage.azblob] 部分可用参数如下：

| 参数 | 描述 |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| endpoint_url | Azure Blob Storage 的 URL 端点，如 `https://<your-storage-account-name>.blob.core.windows.net`。 |
| container | Azure 存储容器名称。 |
| account_name | Azure 存储账户名称。 |
| account_key | Azure Blob Storage 认证用的账户密钥。 |
| root | 指定容器内 Databend 操作的目录。示例：若容器根目录有 `myroot` 文件夹，则 `root = "myroot/"`。 |

### [storage.gcs] 部分

[storage.gcs] 部分可用参数如下：

| 参数 | 描述 |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket | Google Cloud Storage 桶名称。 |
| credential | 用于 GCS 认证的 base64 编码服务账户密钥文件。 |
| root | 指定桶内 Databend 操作的目录。示例：若桶根目录有 `myroot` 文件夹，则 `root = "myroot/"`。 |

获取 `credential` 的方法：按 Google 文档[创建服务账户密钥](https://cloud.google.com/iam/docs/keys-create-delete#creating)生成并下载密钥文件，然后执行：

```
base64 -i -o ~/Desktop/base64-encoded-key.txt
```

将其转为 base64 字符串。

### [storage.oss] 部分

[storage.oss] 部分可用参数如下：

| 参数 | 描述 |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket | 阿里云 OSS 桶名称。 |
| endpoint_url | 阿里云 OSS 的 URL 端点。 |
| access_key_id | 阿里云 OSS 认证用的 Access Key ID。 |
| access_key_secret | 阿里云 OSS 认证用的 Access Key Secret。 |
| presign_endpoint_url | 阿里云 OSS 预签名操作的 URL 端点。 |
| root | 指定桶内 Databend 操作的目录。示例：若桶根目录有 `myroot` 文件夹，则 `root = "myroot/"`。 |

<LanguageDocs
cn=
'

### [storage.obs] 部分

以下是 [storage.obs] 部分中可用的参数列表：

| 参数              | 描述                                          |
| ----------------- | --------------------------------------------- |
| bucket            | 您的华为云 OBS 桶名称。                    |
| endpoint_url      | 华为云 OBS 的 URL 端点。                      |
| access_key_id     | 用于华为云 OBS 认证的 Access Key ID。  |
| secret_access_key | 用于华为云 OBS 认证的 Secret Access Key。 |

'/>

### [storage.cos] 部分

[storage.cos] 部分可用参数如下：

| 参数 | 描述 |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket | 腾讯云 COS 桶名称。 |
| endpoint_url | 腾讯云 COS 的 URL 端点（可选）。 |
| secret_id | 腾讯云 COS 认证用的 Secret ID。 |
| secret_key | 腾讯云 COS 认证用的 Secret Key。 |
| root | 指定桶内 Databend 操作的目录。示例：若桶根目录有 `myroot` 文件夹，则 `root = "myroot/"`。 |

## [cache] 部分

[cache] 部分可用参数如下：

| 参数 | 描述 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| data_cache_storage | 表数据缓存的存储类型。可选："none"（禁用表数据缓存）、"disk"（启用磁盘缓存），默认为 "none"。 |
| iceberg_table_meta_count | 缓存的 Iceberg 表元数据条目数量，设为 `0` 禁用元数据缓存。 |

### [cache.disk] 部分

[cache.disk] 部分可用参数如下：

| 参数 | 描述 |
| --------- | -------------------------------------------------------------------------------------------------------- |
| path | 磁盘缓存的存储路径。 |
| max_bytes | 磁盘缓存的最大数据量（字节），默认为 21474836480 字节（20 GB）。 |

## [spill] 部分

Databend 支持将中间计算数据落盘（Spill），从而降低内存压力。

### 默认溢出存储（零配置）

- **存储介质**：与主数据存储（即 `[storage]` 配置）一致。
- **路径前缀**：`_query_spill/`（位于配置的 `root` 目录下）。
- **完整路径**：对于对象存储（S3/Azure/GCS 等），路径为 `<bucket>/<root>/_query_spill/`。
- **作为回退**：当启用本地磁盘溢出时，会自动作为回退存储使用。

### 本地磁盘溢出（支持自动降级）

- 优先将溢出数据写入本地磁盘。
- 当本地磁盘配额耗尽或空间不足时，自动降级至溢出存储后端（默认存储或 `[spill.storage]`）。

| 参数                                         | 描述                                                                                                                                                                                                                                      |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| spill_local_disk_path                      | 本地磁盘上用于存储溢出数据的目录路径。留空则表示禁用本地磁盘溢出功能。                                                                                                                                                                                                     |
| spill_local_disk_reserved_space_percentage | 本地磁盘保留空间百分比（不用于溢出）。用于防止磁盘被写满，保障系统稳定性。默认值：`10`（即保留 10%）。                                                                                                                                                                                   |
| spill_local_disk_max_bytes                 | 允许溢出到本地磁盘的最大字节数。当达到此上限时，后续的溢出操作会自动降级至溢出存储后端（默认存储或 `[spill.storage]`），确保查询任务不会中断。默认值：无限制（`unlimited`）。                                                                                                                                   |

**示例（本地磁盘溢出）：**

```toml
[spill]
spill_local_disk_path = "/data/spill"
spill_local_disk_reserved_space_percentage = 10.0
spill_local_disk_max_bytes = 53687091200
```

### 独立溢出存储配置（与主数据分离）

- 通过 `[spill.storage]` 进行配置。
- 仅影响溢出文件（含本地溢出的回退目标）；**不改变**表数据的存储位置。
- 依然使用 `_query_spill/` 作为路径前缀（位于该配置的 `root` 目录下）。

| 参数   | 描述                                                                                      |
| ---- | --------------------------------------------------------------------------------------- |
| type | 存储类型。可选值：`fs`、`s3`、`azblob`、`gcs`、`oss`、`cos` 等（与 `[storage]` 部分一致）。 |

### [spill.storage.s3] 部分（S3 远程存储）

参数配置与 [storage.s3 部分](#storages3-section) 完全一致。

- **前缀**：`_query_spill/`（位于 `root` 下）。
- **AWS S3**：溢出对象将使用 `STANDARD` 存储类型。

**示例（独立 S3 溢出存储后端）：**

```toml
[spill.storage]
type = "s3"

[spill.storage.s3]
bucket = "my-spill-bucket"
region = "us-west-2"
access_key_id = "your-access-key"
secret_access_key = "your-secret-key"
root = "spill/"
```
