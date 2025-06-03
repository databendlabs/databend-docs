---
title: 查询配置
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import LanguageDocs from '@site/src/components/LanguageDocs';

<FunctionDescription description="引入或更新版本: v1.2.698"/>

本页面描述了 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中可用的查询节点配置。

- 下表中列出的部分参数可能未包含在 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 中。如需使用这些参数，请手动添加到文件。
- GitHub 上提供了为不同部署环境配置 Databend 的[示例配置文件](https://github.com/databendlabs/databend/tree/main/scripts/ci/deploy/config)。这些文件**仅用于内部测试**，请勿自行修改。若部署环境类似，编辑配置文件时可参考这些示例。

## [query] 部分

[query] 部分可用参数列表：

| 参数                            | 描述                                                                                         |
| ------------------------------- | -------------------------------------------------------------------------------------------- |
| max_active_sessions             | 最大活跃会话数。                                                                             |
| shutdown_wait_timeout_ms        | 等待超时时间（毫秒）。                                                                       |
| flight_api_address              | 监听 Databend-Query 集群 shuffle 数据的 IP 地址和端口。                                      |
| admin_api_address               | Admin REST API 地址。                                                                        |
| metric_api_address              | Metrics REST API 地址。                                                                      |
| mysql_handler_host              | MySQL 查询处理器主机名。                                                                     |
| mysql_handler_port              | MySQL 查询处理器端口。                                                                       |
| clickhouse_http_handler_host    | ClickHouse HTTP 查询处理器主机名。                                                           |
| clickhouse_http_handler_port    | ClickHouse HTTP 查询处理器端口。                                                             |
| http_handler_host               | HTTP API 查询处理器主机名。                                                                  |
| http_handler_port               | HTTP API 查询处理器端口。                                                                    |
| flight_sql_handler_host         | 实验性 Arrow Flight SQL API 查询处理器主机名。                                              |
| flight_sql_handler_port         | 实验性 Arrow Flight SQL API 查询处理器端口。                                                |
| tenant_id                       | 默认租户 ID。                                                                                |
| cluster_id                      | 默认集群 ID。                                                                                |
| table_engine_memory_enabled     | 启用 Memory 表引擎的标志。                                                                   |
| max_running_queries             | 可同时执行的最大查询数，默认为 `8`，`0` 表示无限制。                                         |
| data_retention_time_in_days_max | 设置 `data_retention_time_in_days` 的上限值，默认 `90` 天。                                  |

### [query.users] 部分

[[query.users]] 部分可用参数列表。管理员用户配置详见[配置管理员用户](../01-admin-users.md)：

| 参数        | 描述                                                                                |
| ----------- | ----------------------------------------------------------------------------------- |
| name        | 用户名。                                                                            |
| auth_type   | 认证类型（例如 `no_password`、`double_sha1_password`、`sha256_password`）。        |
| auth_string | 认证字符串（例如密码的 SHA-1 或 SHA-256 哈希值）。                                 |

### [query.settings] 部分

[query.settings] 部分可用参数列表：

| 参数                            | 描述                                                                                                                                                                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| aggregate_spilling_memory_ratio | 控制聚合操作中数据落盘的阈值。当内存使用量超过总可用内存的百分比时，数据将溢出到对象存储。例如：设为 `60` 时，内存使用超 60% 触发落盘。                                                                                          |
| join_spilling_memory_ratio      | 控制连接操作中数据落盘的阈值。当内存使用量超过总可用内存的百分比时，数据将溢出到对象存储。例如：设为 `60` 时，内存使用超 60% 触发落盘。                                                                                          |

## [log] 部分

包含子部分：[log.file]、[log.stderr]、[log.query] 和 [log.tracing]。

### [log.file] 部分

[log.file] 部分可用参数列表：

| 参数   | 描述                                                                                                                                                                                               |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| on     | 启用/禁用文件日志记录，默认为 `true`。                                                                                                                                                             |
| dir    | 日志文件存储路径。                                                                                                                                                                                 |
| level  | 日志级别（遵循 [env_logger](https://docs.rs/env_logger/latest/env_logger/) 语法）：`error`、`warn`、`info`、`debug`、`trace`、`off`。默认为 `warn,databend_=info,openraft=info`。                 |
| format | 日志格式：`json` 或 `text`，默认为 `json`。                                                                                                                                                        |
| limit  | 保留的最大日志文件数，默认为 `48`。                                                                                                                                                                |

### [log.stderr] 部分

[log.stderr] 部分可用参数列表：

| 参数   | 描述                                                                                                                                                                                               |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| on     | 启用/禁用 stderr 日志记录，默认为 `false`。                                                                                                                                                        |
| level  | 日志级别（遵循 [env_logger](https://docs.rs/env_logger/latest/env_logger/) 语法）：`error`、`warn`、`info`、`debug`、`trace`、`off`。默认为 `warn,databend_=info,openraft=info`。                 |
| format | 日志格式：`json` 或 `text`，默认为 `json`。                                                                                                                                                        |

### [log.query] 部分

[log.query] 部分可用参数列表：

| 参数 | 描述                                                                                                                             |
| ---- | -------------------------------------------------------------------------------------------------------------------------------- |
| on   | 启用将查询执行详情记录到日志目录的 query-details 文件夹，默认启用。存储空间不足时可禁用。                                         |

### [log.tracing] 部分

[log.tracing] 部分可用参数列表：

| 参数              | 描述                                                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| capture_log_level | 执行期间捕获跟踪的日志级别（`DEBUG`、`TRACE`、`INFO`、`WARN` 或 `ERROR`）。                                                        |
| on                | 是否启用跟踪，默认为 `false`。设为 `true` 启用。                                                                                   |
| otlp_endpoint     | OpenTelemetry Protocol (OTLP) 跟踪端点。默认为 `http://127.0.0.1:4317`，可替换为所需 OTLP 端点。                                  |

### [log.history] 部分

[log.history] 部分可用参数列表：

| 参数               | 描述                                                                                                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| on                 | 启用/禁用历史日志功能，默认为 `false`。设为 `true` 启用历史表。                                                                                                                                         |
| interval           | 历史日志刷新间隔（秒），默认为 `2`。                                                                                                                                                                   |
| stage_name         | 临时保存日志数据的暂存区名称，默认为避免冲突的唯一值。                                                                                                                                                 |
| level              | 历史日志记录级别（`DEBUG`、`TRACE`、`INFO`、`WARN` 或 `ERROR`），默认为 `WARN`。                                                                                                                        |
| retention_interval | 触发旧数据清理检查的间隔（小时），默认为 `24`。                                                                                                                                                         |
| tables             | 启用的历史表及其保留策略（对象数组）。每个对象含 `table_name`（历史表名称）和 `retention`（该表保留小时数）。                                                                                          |

`tables` 为对象数组，每个对象含两个参数：
| 参数       | 描述                                                                                                                               |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| table_name | 历史表名称（当前支持：`log_history`、`profile_history`、`query_history`、`login_history`）。                                       |
| retention  | 表数据保留小时数。                                                                                                                 |
注意：`log_history` 表默认启用

## [meta] 部分

[meta] 部分可用参数列表：

| 参数                         | 描述                                                                                                                                                                                                 |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| username                     | 连接 Meta 服务的用户名，默认为 `"root"`。                                                                                                                                                            |
| password                     | 连接 Meta 服务的密码，建议通过环境变量 `META_PASSWORD` 提供。默认为 `"root"`。                                                                                                                       |
| endpoints                    | 查询服务器可连接的 meta 服务器端点（建议配置集群内多个端点）。示例：`["192.168.0.1:9191", "192.168.0.2:9191"]`，默认为 `["0.0.0.0:9191"]`。                                                         |
| client_timeout_in_second     | 连接 meta 服务器的超时时间（秒），默认为 `60`。                                                                                                                                                      |
| auto_sync_interval           | 查询服务器从集群 meta 服务器自动同步端点的间隔（秒）。启用时定期获取 `grpc_api_advertise_host:grpc-api-port` 列表。设为 `0` 禁用同步，默认为 `60`。                                                  |
| unhealth_endpoint_evict_time | 不健康 meta 节点端点的屏蔽时间（秒），默认为 `120`。                                                                                                                                                 |

## [storage] 部分

[storage] 部分可用参数列表：

| 参数                                | 描述                                                                                                                                                                                                 |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type                                | 存储类型：`fs`、`s3`、`azblob`、`gcs`、`oss`、`cos`。                                                                                                                                                |
| allow_insecure                      | 默认为 `false`。在 MinIO 部署或通过 `http://` 前缀 URL 加载数据时需设为 `true`，否则报错："copy from insecure storage is not allowed. Please set `allow_insecure=true`"。                         |
| `storage_retry_timeout`             | *(秒)* OpenDAL 读/写操作超时重试阈值，默认为 `10`。                                                                                                                                                 |
| `storage_retry_io_timeout`          | *(秒)* OpenDAL HTTP 请求超时重试阈值，默认为 `60`。                                                                                                                                                 |
| `storage_pool_max_idle_per_host`    | 单主机最大连接池大小，默认为无限制。                                                                                                                                                                 |
| `storage_connect_timeout`           | *(秒)* TCP 连接超时，默认为 `30`。                                                                                                                                                                  |
| `storage_tcp_keepalive`             | *(秒)* TCP keepalive 持续时间，默认为 `None`。                                                                                                                                                       |
| `storage_max_concurrent_io_requests`| 最大并发 I/O 请求数，默认为无限制。                                                                                                                                                                 |

### [storage.fs] 部分

[storage.fs] 部分可用参数列表：

| 参数      | 描述                   |
| --------- | ---------------------- |
| data_path | 数据存储位置路径。     |

### [storage.s3] 部分

[storage.s3] 部分可用参数列表：

| 参数                      | 描述                                                                                                                                                                             |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket                    | Amazon S3 存储桶名称。                                                                                                                                                          |
| endpoint_url              | S3 存储服务 URL 端点，默认为 `"https://s3.amazonaws.com"`。                                                                                                                      |
| access_key_id             | 存储服务认证访问密钥 ID。                                                                                                                                                        |
| secret_access_key         | 存储服务认证密钥。                                                                                                                                                               |
| enable_virtual_host_style | 是否启用虚拟主机寻址（布尔值）。                                                                                                                                                 |
| external_id               | 认证外部 ID。                                                                                                                                                                    |
| master_key                | 认证主密钥。                                                                                                                                                                     |
| region                    | S3 存储区域。                                                                                                                                                                    |
| role_arn                  | 认证 ARN (Amazon Resource Name)。                                                                                                                                                |
| root                      | Databend 操作目录。示例：桶根目录含 `myroot` 文件夹时，设为 `"myroot/"`。                                                                                                        |
| security_token            | 认证安全令牌。                                                                                                                                                                   |

### [storage.azblob] 部分

[storage.azblob] 部分可用参数列表：

| 参数         | 描述                                                                                                                                                                             |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| endpoint_url | Azure Blob Storage 端点 URL（如 `https://<your-storage-account-name>.blob.core.windows.net`）。                                                                                 |
| container    | Azure 存储容器名称。                                                                                                                                                            |
| account_name | Azure 存储账户名称。                                                                                                                                                            |
| account_key  | Azure Blob Storage 认证账户密钥。                                                                                                                                               |
| root         | Databend 操作目录。示例：桶根目录含 `myroot` 文件夹时，设为 `"myroot/"`。                                                                                                        |

### [storage.gcs] 部分

[storage.gcs] 部分可用参数列表：

| 参数       | 描述                                                                                                                                                                             |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket     | Google Cloud Storage 存储桶名称。                                                                                                                                               |
| credential | Google Cloud Storage 认证的 base64 编码服务账户密钥文件。                                                                                                                       |
| root       | Databend 操作目录。示例：桶根目录含 `myroot` 文件夹时，设为 `"myroot/"`。                                                                                                        |

获取 `credential` 步骤：
1. 按 Google 文档[创建服务账户密钥](https://cloud.google.com/iam/docs/keys-create-delete#creating)下载密钥文件
2. 执行命令转换：
```bash
base64 -i -o ~/Desktop/base64-encoded-key.txt
```

### [storage.oss] 部分

[storage.oss] 部分可用参数列表：

| 参数                 | 描述                                                                                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket               | 阿里云 OSS 存储桶名称。                                                                                                                                                         |
| endpoint_url         | 阿里云 OSS URL 端点。                                                                                                                                                           |
| access_key_id        | 阿里云 OSS 认证访问密钥 ID。                                                                                                                                                    |
| access_key_secret    | 阿里云 OSS 认证密钥。                                                                                                                                                           |
| presign_endpoint_url | 阿里云 OSS 预签名操作 URL 端点。                                                                                                                                                |
| root                 | Databend 操作目录。示例：桶根目录含 `myroot` 文件夹时，设为 `"myroot/"`。                                                                                                        |

<LanguageDocs
cn=
'

### [storage.obs] 部分

[storage.obs] 部分可用参数列表：

| 参数              | 描述                                          |
| ----------------- | --------------------------------------------- |
| bucket            | 华为云 OBS 存储桶名称。                       |
| endpoint_url      | 华为云 OBS URL 端点。                         |
| access_key_id     | 华为云 OBS 认证访问密钥 ID。                  |
| secret_access_key | 华为云 OBS 认证密钥。                         |

'/>

### [storage.cos] 部分

[storage.cos] 部分可用参数列表：

| 参数         | 描述                                                                                                                                                                             |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket       | 腾讯云对象存储 (COS) 存储桶名称。                                                                                                                                               |
| endpoint_url | 腾讯云 COS URL 端点（可选）。                                                                                                                                                  |
| secret_id    | 腾讯云 COS 认证密钥 ID。                                                                                                                                                        |
| secret_key   | 腾讯云 COS 认证密钥。                                                                                                                                                           |
| root         | Databend 操作目录。示例：桶根目录含 `myroot` 文件夹时，设为 `"myroot/"`。                                                                                                        |

## [cache] 部分

[cache] 部分可用参数列表：

| 参数                     | 描述                                                                                                                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data_cache_storage       | 表数据缓存存储类型：`"none"`（禁用）、`"disk"`（启用磁盘缓存），默认为 `"none"`。                                                                                                                       |
| iceberg_table_meta_count | Iceberg 表元数据缓存条目数，设为 `0` 禁用缓存。                                                                                                                                                        |

### [cache.disk] 部分

[cache.disk] 部分可用参数列表：

| 参数      | 描述                                                                                                     |
| --------- | -------------------------------------------------------------------------------------------------------- |
| path      | 磁盘缓存存储路径。                                                                                       |
| max_bytes | 磁盘缓存数据最大字节数，默认为 `21474836480` 字节 (20 GB)。                                              |

## [spill] 部分

[spill] 部分可用参数列表：

| 参数                                       | 描述                                                                                                      |
|--------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| spill_local_disk_path                      | 本地磁盘溢出数据存储目录路径。                                                                            |
| spill_local_disk_reserved_space_percentage | 保留不可用于溢出的磁盘空间百分比，默认值 `30`。                                                           |
| spill_local_disk_max_bytes                 | 本地磁盘溢出最大字节数，默认为无限制。                                                                    |

### [spill.storage] 部分

[spill.storage] 部分可用参数列表：

| 参数 | 描述                                                         |
|------|--------------------------------------------------------------|
| type | 远程溢出存储类型（如 `s3`）。                                |

指定存储需使用 [storage 部分](#storage-部分) 参数，示例见[配置溢出存储](/guides/data-management/data-recycle#configuring-spill-storage)。