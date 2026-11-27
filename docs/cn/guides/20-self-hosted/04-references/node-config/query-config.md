---
title: 查询配置
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import LanguageDocs from '@site/src/components/LanguageDocs';
import DetailsWrap from '@site/src/components/DetailsWrap';

<FunctionDescription description="Introduced or updated: v1.2.957"/>

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

<a id="remote-udf-servers"></a>

### 远程 UDF 服务器

这些参数属于 `[query]`。请在每个 Query 节点上使用相同策略：

| 参数 | 说明 |
|---|---|
| enable_udf_server | 启用远程 Arrow Flight UDF 服务器，默认为 `false`。 |
| udf_server_allow_insecure | 允许非 HTTPS 的远程 UDF 服务器连接，默认为 `false`。 |
| udf_server_allow_list | 允许的服务器 URL 列表，按主机比较，默认为 `[]`。 |

未指定 `EXTERNAL_ACCESS_INTEGRATIONS` 的 UDF，目标必须匹配配置 allow list。列表为空时拒绝该目标。

显式引用 integration 的 UDF，仍受非空配置列表的 operator 主机限制。目标必须同时通过配置列表和 SQL 主机/端口规则。空配置列表表示将 integration 绑定 UDF 的目标控制权交给租户 SQL 策略管理员，不会取消 `enable_udf_server` 或 TLS 检查。

SQL 配置与信任边界见[外部访问集成](/guides/security/external-access-integration)。

<a id="script-udf-resources"></a>

### 脚本 UDF 资源

以下节点配置属于 `[query]`，不是 `[query.settings]`。查询专属的 Python 标量 Worker 和自动 Worker 容量选择在 v1.2.955 中引入。从 v1.2.957 开始，本地 Python UDF 和 UDAF 使用 [CREATE SCALAR FUNCTION](/sql/sql-commands/ddl/udf/ddl-create-function#python) 中描述的强制 OS 沙箱。

| 参数 | 默认值 | 说明 |
|-----------|---------|-------------|
| `enable_udf_python_script` | `true` | 允许本地 Python 脚本，包括聚合函数。 |
| `enable_udf_sandbox` | `false` | 将 Python 标量函数路由到外部沙箱服务。此模式下拒绝 Python UDAF。此设置不会禁用本地 OS 沙箱。 |
| `python_udf_max_workers` | `0` | 节点 Worker 容量。`0` 使用 `query.num_cpus`；若 `num_cpus = 0`，则使用可用 CPU 并行度。 |
| `python_udf_max_workers_per_tenant` | `0` | 此节点上的租户容量。`0` 继承节点容量。 |
| `python_udf_max_workers_per_query` | `0` | 单次查询的驻留 Worker 上限。`0` 使用 `M + P - 1`，其中 `M` 为本地运行时数量，`P` 为有效并行度。 |
| `python_udf_max_queued_queries` | `128` | 最大准入等待数量，必须为正数。 |
| `python_udf_queue_timeout_secs` | `60` | 准入等待超时，单位为秒，必须为正数。 |
| `python_udf_execution_timeout_secs` | `300` | 每个 Worker 请求的超时，包括首次请求的解释器启动时间，必须为正数。 |
| `python_udf_worker_idle_timeout_secs` | `300` | 额外 Worker 的空闲超时。每个运行时保留一个最小 Worker；不会使忙碌 Worker 过期。必须为正数。 |
| `python_udf_pip_only_binary` | `true` | 只安装 wheel。`false` 允许源码分发包在 Query 节点上、Worker 沙箱之外执行构建脚本。 |
| `udf_script_memory_limit_mb` | `1024` | 每个 JavaScript 运行时的堆限制和每个 WASM 实例的线性内存限制，单位为 MiB。`0` 表示无限制。不限制 Python Worker 内存。 |
| `udf_script_execution_timeout_secs` | `300` | JavaScript 操作截止时间，包括模块初始化和转换。`0` 表示无限制。不对 WASM 强制执行。 |

Python 容量是单节点限制，不是整个计算集群的限制。非零配置的 Worker 限制必须满足 `query <= tenant <= node`。有效并行度遵循 SQL `max_threads`，并受节点和租户容量约束。每个已注册运行时准入一个最小 Worker；额外 Worker 按需增长。若查询预算无法容纳最小运行时数量，则会失败，而不是无限等待。

Python 请求超时不是整个 SQL 的超时。普通查询超时仍控制总执行时间。取消或失败/超时的 Worker 请求会使该运行时失效；批次不会自动重试。查询完成后会终止其 Worker。Worker 永远不会被后续查询共享。

进程数量和请求超时不提供 OS 强制执行的 Python 内存或 CPU 预算。Worker 内存不计入查询分配器。对于内存密集型包，请显式设置较小的 Worker 容量，并使用独立的 OS 资源控制。JavaScript 和 WASM 在进程内运行；WASM 没有执行超时，且这两个引擎都不会在运行中的调用内响应取消。

### 本地 Python UDF 外部访问

<FunctionDescription description="Introduced or updated: Unreleased"/>

| 参数 | 说明 |
|---|---|
| enable_python_udf_external_access | 允许本地 Python UDF 通过 integration 发起 HTTP(S) 请求。默认为 `false`。请在每个执行节点的 `[query]` 中设置。它不启用原生 socket，也不改变 UDF 执行路由。 |

原有的 `udf_server_allow_list` 同时作为此访问的 operator 主机限制。非空列表和租户 `HOST_PORT` 规则必须同时允许目标。列表为空时，租户规则可在 operator 启用此功能后选择公网目标。非公网 IP 需要 operator 添加精确的 IP 字面量；仅列出主机名不够。租户规则仍需授权端口。

此选项独立于远程 UDF 传输开关。Python worker 仍需强制执行的 Linux 沙箱和显式 integration 绑定。SQL 配置、撤销方式和端点信任限制见[本地 Python UDF 访问](/guides/security/external-access-integration#本地-python-udf-访问)。

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

## [task] 部分

在私有化部署中，可使用 [task] 部分启用私有化 Task：

```toml
[task]
on = true
```

私有化 Task 需要带有 `private_task` 功能的企业版 License。

:::note
启用私有化 Task 时，[query] 部分中的 `cloud_control_grpc_server_address` 必须为空，否则 Databend Query 将无法启动。
:::

| 参数 | 描述 |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| on | 是否在 Databend Query 节点上启用私有化 Task 调度与执行，默认为 `false`。 |

## [lineage] 部分

数据血缘是[企业版功能](/guides/self-hosted/editions/enterprise/features)。私有化部署需要企业版或试用版许可证。

使用 `[lineage]` 配置捕获并持久化对象级和列级数据血缘：

```toml
[lineage]
on = true
# retention = 720
```

请在所有 Query 节点上使用相同配置，并在修改配置后重启节点。

| 参数 | 描述 |
|------|------|
| on | 是否启用血缘捕获和持久化，默认为 `false`。 |
| retention | 可选的 DML 血缘保留时长，单位为小时。省略时永久保留血缘。 |

有关使用方法，请参见[数据血缘](/guides/data-management/data-lineage)。

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

<h3 id="unified-disk-cache">统一磁盘缓存</h3>

<FunctionDescription description="Introduced or updated: Unreleased"/>

磁盘缓存使用一个字节预算存放元数据、索引和数据。两种内存缓存后端均可使用。启用条件为 Enterprise Edition 构建、`data_cache_storage = "disk"`，且 `max_bytes` 大于 1024。默认的 `data_cache_storage = "none"` 保持禁用。

```toml
[cache]
data_cache_storage = "disk"

[cache.disk]
path = "/data/cache"
max_bytes = 107374182400
meta_max_ratio = 10
index_max_ratio = 20
data_max_ratio = 70
```

此示例为节点设置 100 GiB 预算。下列比例用于分配该预算。它们与 `[cache]` 中的内存池比例相互独立。

| `[cache.disk]` 中的参数 | 默认值 | 用途 |
|------------------------|--------|------|
| meta_max_ratio | 10 | 元数据，包括快照、Segment 和索引元数据。 |
| index_max_ratio | 20 | 索引数据，包括 Bloom Filter、倒排索引、向量索引和空间索引数据。 |
| data_max_ratio | 70 | 原始列数据及其他启用缓存的 Parquet 读取。 |

比例是权重，总和不必为 100。比例为零会禁用对应池。至少一个比例必须非零。解码后的列和 HNSW 索引仍仅缓存在内存中。Stage 表和 `COPY` 绕过此磁盘缓存。

**升级注意事项：**

- 使用总预算和池比例替代各类 `disk_cache_*_size` 容量限制。旧限制仍可解析，但不再生效。
- `data_cache_in_memory_bytes` 和 `table_data_cache_population_queue_size` 仍可解析，但不再生效。读取器不再将原始列字节缓存在内存中。
- 首次启动会删除旧缓存布局中的文件。新缓存填充期间会出现缓存未命中。此操作删除缓存副本，不删除存储中的表对象。
- `data_cache_key_reload_policy = "reset"` 仍为默认值。节点重启后从空缓存开始。`"fuzzy"` 会在配置容量内重新加载新布局中的条目，不保留旧布局条目。
- 使用 `shared_memory_enabled = true` 时，`memory_cache_segment_block_metas` 现在与旧后端一样默认禁用。如需启用，请在 `[cache.kind_max_bytes]` 中为此类型设置正的字节上限。它仍受共享元数据池预算限制。

运行时池容量和磁盘缓存类型开关见 [SYSTEM$SET_CACHE_CAPACITY](/sql/sql-functions/table-functions/set-cache-capacity#disk-cache-controls)。监控方式见 [system.caches](/sql/sql-reference/system-tables/system-caches#disk-cache-statistics)。

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
