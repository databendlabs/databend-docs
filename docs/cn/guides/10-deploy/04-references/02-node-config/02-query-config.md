---
title: 查询（Query）节点配置
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import LanguageDocs from '@site/src/components/LanguageDocs';

<FunctionDescription description="引入或更新于：v1.2.698"/>

本页面介绍 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中可用的查询（Query）节点配置。

- 下表中列出的某些参数可能不存在于 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 中。如需这些参数，请手动添加至文件。

- 您可在 GitHub 上找到为不同部署环境配置 Databend 的[示例配置文件](https://github.com/databendlabs/databend/tree/main/scripts/ci/deploy/config)。这些文件**仅限**内部测试使用，**请勿**修改用于生产环境。若部署环境相似，编辑配置文件时可参考这些示例。

## [query] 部分

[query] 部分可用参数列表如下：

| 参数                       | 描述                                                                                                 |
| -------------------------- | ---------------------------------------------------------------------------------------------------- |
| max_active_sessions        | 最大活跃会话数。                                                                                     |
| shutdown_wait_timeout_ms   | 等待超时时间（毫秒）。                                                                               |
| flight_api_address         | 监听 Databend-Query 集群数据交换（Shuffle）的 IP 地址和端口。                                        |
| admin_api_address          | Admin REST API 地址。                                                                                |
| metric_api_address         | Metrics REST API 地址。                                                                              |
| mysql_handler_host         | MySQL 查询处理器主机名。                                                                             |
| mysql_handler_port         | MySQL 查询处理器端口。                                                                               |
| clickhouse_http_handler_host | ClickHouse HTTP 查询处理器主机名。                                                                   |
| clickhouse_http_handler_port | ClickHouse HTTP 查询处理器端口。                                                                     |
| http_handler_host          | HTTP API 查询处理器主机名。                                                                          |
| http_handler_port          | HTTP API 查询处理器端口。                                                                            |
| flight_sql_handler_host    | 实验性 Arrow Flight SQL API 查询处理器主机名。                                                       |
| flight_sql_handler_port    | 实验性 Arrow Flight SQL API 查询处理器端口。                                                         |
| tenant_id                  | 默认租户 ID。                                                                                        |
| cluster_id                 | 默认集群 ID。                                                                                        |
| table_engine_memory_enabled | 启用 Memory 表引擎的标志。                                                                           |
| max_running_queries        | 最大并发查询数，默认为 8（0 表示无限制）。                                                           |
| data_retention_time_in_days_max | `data_retention_time_in_days` 设置上限，默认值 90 天。                                             |

### [query.users] 部分

[[query.users]] 部分可用参数列表如下。管理员用户配置详见[配置管理员用户](../01-admin-users.md)：

| 参数        | 描述                                                                 |
| ----------- | -------------------------------------------------------------------- |
| name        | 用户名。                                                             |
| auth_type   | 认证类型（如 no_password, double_sha1_password, sha256_password）。 |
| auth_string | 认证字符串（如密码的 SHA-1/SHA-256 哈希值）。                        |

### [query.settings] 部分

[query.settings] 部分可用参数列表如下：

| 参数                           | 描述                                                                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| aggregate_spilling_memory_ratio | 控制聚合操作中数据落盘（Spilling）的阈值。当内存使用超过总可用内存的设定百分比时，数据将溢出至对象存储。示例：设为 60 时，内存使用超 60% 触发落盘。 |
| join_spilling_memory_ratio      | 控制连接操作中数据落盘（Spilling）的阈值。当内存使用超过总可用内存的设定百分比时，数据将溢出至对象存储。示例：设为 60 时，内存使用超 60% 触发落盘。 |

## [log] 部分

此部分包含子部分：[log.file], [log.stderr], [log.query], [log.tracing]。

### [log.file] 部分

[log.file] 部分可用参数列表如下：

| 参数   | 描述                                                                                                                                 |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| on     | 启用/禁用文件日志记录，默认 `true`。                                                                                                 |
| dir    | 日志文件存储路径。                                                                                                                   |
| level  | 日志级别（遵循 [env_logger](https://docs.rs/env_logger/latest/env_logger/) 语法：error, warn, info, debug, trace, off），默认 `warn,databend_=info,openraft=info`。 |
| format | 日志格式：`json` 或 `text`，默认 `json`。                                                                                            |
| limit  | 保留日志文件的最大数量，默认 `48`。                                                                                                  |

### [log.stderr] 部分

[log.stderr] 部分可用参数列表如下：

| 参数   | 描述                                                                                                                                 |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| on     | 启用/禁用 stderr 日志记录，默认 `false`。                                                                                            |
| level  | 日志级别（遵循 [env_logger](https://docs.rs/env_logger/latest/env_logger/) 语法：error, warn, info, debug, trace, off），默认 `warn,databend_=info,openraft=info`。 |
| format | 日志格式：`json` 或 `text`，默认 `json`。                                                                                            |

### [log.query] 部分

[log.query] 部分可用参数列表如下：

| 参数 | 描述                                                                                     |
| ---- | ---------------------------------------------------------------------------------------- |
| on   | 启用将查询详情记录至日志目录的 query-details 文件夹，默认启用。存储空间不足时可考虑禁用。 |

### [log.tracing] 部分

[log.tracing] 部分可用参数列表如下：

| 参数               | 描述                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| capture_log_level  | 执行期间捕获追踪（Tracing）的日志级别（DEBUG, TRACE, INFO, WARN, ERROR）。                       |
| on                 | 启用/禁用追踪，默认 `false`。设为 `true` 启用。                                                  |
| otlp_endpoint      | OpenTelemetry 协议（OTLP）追踪端点，默认 `http://127.0.0.1:4317`，可替换为所需 OTLP 端点。       |

### [log.history] 部分

[log.history] 部分可用参数列表如下：

| 参数                 | 描述                                                                                                                               |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| on                   | 启用/禁用历史日志功能，默认 `false`。设为 `true` 启用历史表。                                                                      |
| log_only             | 启用后节点将转换任务委派给其他节点以降低自身负载。                                                                                 |
| interval             | 历史日志刷新间隔（秒），默认 2。                                                                                                   |
| stage_name           | 暂存区（Stage）名称（用于临时存储日志数据），默认为避免冲突的唯一值。                                                              |
| level                | 历史日志级别（DEBUG, TRACE, INFO, WARN, ERROR），默认 WARN。                                                                       |
| retention_interval   | 触发数据清理检查的间隔（小时），默认 24。                                                                                          |
| tables               | 启用历史表及其保留策略的对象数组（含 table_name 和 retention 参数）。                                                              |
| storage              | 历史表存储位置。默认使用 [storage] 部分配置，可指定独立配置（格式同 [storage] 部分）。                                            |

`tables` 为对象数组，每个对象含两个参数：
| 参数        | 描述                                                                 |
| ----------- | -------------------------------------------------------------------- |
| table_name  | 历史表名称（当前支持：log_history, profile_history, query_history, login_history）。 |
| retention   | 表数据保留时长（小时）。                                             |
注意：`log_history` 表默认启用。

若指定 `storage`，原默认历史表将被删除并按新配置重建。同一租户下所有节点须保持相同 `storage` 配置以确保一致性。

## [meta] 部分

[meta] 部分可用参数列表如下：

| 参数                         | 描述                                                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| username                     | 连接元数据服务的用户名，默认 "root"。                                                                                                |
| password                     | 连接元数据服务的密码，建议通过环境变量 META_PASSWORD 提供，默认 "root"。                                                             |
| endpoints                    | 可连接的元数据服务器端点列表。建议包含多个端点提升可靠性，示例：["192.168.0.1:9191", "192.168.0.2:9191"]，默认 ["0.0.0.0:9191"]。     |
| client_timeout_in_second     | 元数据服务器连接超时时长（秒），默认 60。                                                                                            |
| auto_sync_interval           | 端点自动同步间隔（秒）。启用后定期从集群元数据服务器获取 grpc_api_advertise_host:grpc-api-port 列表。设为 0 禁用同步，默认 60。       |
| unhealth_endpoint_evict_time | 隔离不健康端点的时长（秒），默认 120。                                                                                               |

## [storage] 部分

[storage] 部分可用参数列表如下：

| 参数                              | 描述                                                                                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| type                              | 存储类型（可选：fs, s3, azblob, gcs, oss, cos）。                                                                          |
| allow_insecure                    | 默认 `false`。在 MinIO 部署或通过 `http://` URL 加载数据时需设为 `true`，否则报错："copy from insecure storage is not allowed. Please set `allow_insecure=true`"。 |
| storage_retry_timeout             | *（秒）* OpenDAL 读写操作超时重试阈值，默认 `10`。                                                                         |
| storage_retry_io_timeout          | *（秒）* OpenDAL HTTP 请求超时重试阈值，默认 `60`。                                                                        |
| storage_pool_max_idle_per_host    | 单主机最大连接池大小，默认无限制。                                                                                         |
| storage_connect_timeout           | *（秒）* TCP 连接超时，默认 `30`。                                                                                        |
| storage_tcp_keepalive             | *（秒）* TCP 保活时长，默认未启用。                                                                                        |
| storage_max_concurrent_io_requests| 最大并发 I/O 请求数，默认无限制。                                                                                          |

### [storage.fs] 部分

[storage.fs] 部分可用参数列表如下：

| 参数      | 描述               |
| --------- | ------------------ |
| data_path | 数据存储目录路径。 |

### [storage.s3] 部分

[storage.s3] 部分可用参数列表如下：

| 参数                     | 描述                                                                                                                               |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| bucket                   | Amazon S3 兼容存储桶名称。                                                                                                         |
| endpoint_url             | S3 兼容服务端点 URL，默认 "https://s3.amazonaws.com"。                                                                             |
| access_key_id            | 存储服务访问密钥 ID。                                                                                                              |
| secret_access_key        | 存储服务密钥访问密钥。                                                                                                             |
| enable_virtual_host_style | 是否启用虚拟主机寻址的布尔标志。                                                                                                   |
| external_id              | 认证外部 ID。                                                                                                                      |
| master_key               | 认证主密钥。                                                                                                                       |
| region                   | S3 兼容服务区域。                                                                                                                  |
| role_arn                 | 认证角色 ARN（Amazon 资源名称）。                                                                                                  |
| root                     | 存储桶内工作目录。示例：若桶根目录含 `myroot` 文件夹，则设为 `"myroot/"`。                                                         |
| security_token           | 认证安全令牌。                                                                                                                     |

### [storage.azblob] 部分

[storage.azblob] 部分可用参数列表如下：

| 参数         | 描述                                                                                                                               |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| endpoint_url | Azure Blob 存储端点 URL（如 `https://<存储账户名>.blob.core.windows.net`）。                                                       |
| container    | Azure 存储容器名称。                                                                                                               |
| account_name | Azure 存储账户名称。                                                                                                               |
| account_key  | Azure Blob 存储账户密钥。                                                                                                          |
| root         | 容器内工作目录。示例：若容器根目录含 `myroot` 文件夹，则设为 `"myroot/"`。                                                         |

### [storage.gcs] 部分

[storage.gcs] 部分可用参数列表如下：

| 参数       | 描述                                                                                                                               |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| bucket     | Google Cloud Storage 存储桶名称。                                                                                                  |
| credential | Google Cloud Storage 认证凭证（Base64 编码的服务账户密钥文件）。                                                                   |
| root       | 存储桶内工作目录。示例：若桶根目录含 `myroot` 文件夹，则设为 `"myroot/"`。                                                         |

获取 `credential` 请参考 Google 文档[创建服务账户密钥](https://cloud.google.com/iam/docs/keys-create-delete#creating)，下载密钥文件后通过以下命令转为 Base64 字符串：
```
base64 -i -o ~/Desktop/base64-encoded-key.txt
```

### [storage.oss] 部分

[storage.oss] 部分可用参数列表如下：

| 参数                 | 描述                                                                                                                               |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| bucket               | 阿里云 OSS 存储桶名称。                                                                                                            |
| endpoint_url         | 阿里云 OSS 端点 URL。                                                                                                              |
| access_key_id        | 阿里云 OSS 访问密钥 ID。                                                                                                           |
| access_key_secret    | 阿里云 OSS 访问密钥。                                                                                                              |
| presign_endpoint_url | 阿里云 OSS 预签名操作端点 URL。                                                                                                    |
| root                 | 存储桶内工作目录。示例：若桶根目录含 `myroot` 文件夹，则设为 `"myroot/"`。                                                         |

### [storage.obs] 部分

[storage.obs] 部分可用参数列表如下：

| 参数              | 描述                             |
| ----------------- | -------------------------------- |
| bucket            | 华为云 OBS 存储桶名称。          |
| endpoint_url      | 华为云 OBS 端点 URL。            |
| access_key_id     | 华为云 OBS 访问密钥 ID。         |
| secret_access_key | 华为云 OBS 密钥访问密钥。        |

### [storage.cos] 部分

[storage.cos] 部分可用参数列表如下：

| 参数         | 描述                                                                                                                               |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| bucket       | 腾讯云对象存储（COS）存储桶名称。                                                                                                  |
| endpoint_url | 腾讯云 COS 端点 URL（可选）。                                                                                                      |
| secret_id    | 腾讯云 COS 密钥 ID。                                                                                                               |
| secret_key   | 腾讯云 COS 密钥。                                                                                                                  |
| root         | 存储桶内工作目录。示例：若桶根目录含 `myroot` 文件夹，则设为 `"myroot/"`。                                                         |

## [cache] 部分

[cache] 部分可用参数列表如下：

| 参数                     | 描述                                                                                                 |
| ------------------------ | ---------------------------------------------------------------------------------------------------- |
| data_cache_storage       | 表数据缓存存储类型（"none"：禁用；"disk"：启用磁盘缓存），默认 "none"。                              |
| iceberg_table_meta_count | Iceberg 表元数据缓存条目数，设为 `0` 禁用元数据缓存。                                                |

### [cache.disk] 部分

[cache.disk] 部分可用参数列表如下：

| 参数      | 描述                                     |
| --------- | ---------------------------------------- |
| path      | 磁盘缓存存储路径。                       |
| max_bytes | 磁盘缓存数据上限（字节），默认 21474836480（20 GB）。 |

## [spill] 部分

[spill] 部分可用参数列表如下：

| 参数                                   | 描述                                                                 |
| -------------------------------------- | -------------------------------------------------------------------- |
| spill_local_disk_path                  | 本地磁盘落盘（Spilling）数据存储目录路径。                           |
| spill_local_disk_reserved_space_percentage | 保留不可用于落盘的磁盘空间百分比，默认值 `30`。                      |
| spill_local_disk_max_bytes             | 本地磁盘落盘数据最大字节数，默认无限制。                             |

### [spill.storage] 部分

[spill.storage] 部分可用参数列表如下：

| 参数 | 描述                     |
| ---- | ------------------------ |
| type | 远程落盘存储类型（如 `s3`）。 |

具体存储配置参数详见[存储部分](#storage-section)，示例参考[配置落盘存储](/guides/data-management/data-recycle#configuring-spill-storage)。