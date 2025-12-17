---
title: Query Configurations
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import LanguageDocs from '@site/src/components/LanguageDocs';
import DetailsWrap from '@site/src/components/DetailsWrap';

<FunctionDescription description="Introduced or updated: v1.2.901"/>

This page describes the Query node configurations available in the [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) configuration file.

- Some parameters listed in the table below may not be present in [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml). If you require these parameters, you can manually add them to the file.

- You can find [sample configuration files](https://github.com/databendlabs/databend/tree/main/scripts/ci/deploy/config) on GitHub that set up Databend for various deployment environments. These files were created for internal testing ONLY. Please do NOT modify them for your own purposes. But if you have a similar deployment, it is a good idea to reference them when editing your own configuration files.

## [query] Section

The following is a list of the parameters available within the [query] section:

| Parameter                       | Description                                                                                                 |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| max_active_sessions             | Maximum number of active sessions.                                                                          |
| shutdown_wait_timeout_ms        | Timeout in milliseconds for waiting.                                                                        |
| flight_api_address              | IP address and port for listening to Databend-Query cluster shuffle data.                                   |
| admin_api_address               | Address for the Admin REST API.                                                                             |
| metric_api_address              | Address for the Metrics REST API.                                                                           |
| mysql_handler_host              | Hostname for the MySQL query handler.                                                                       |
| mysql_handler_port              | Port for the MySQL query handler.                                                                           |
| clickhouse_http_handler_host    | Hostname for the ClickHouse HTTP query handler.                                                             |
| clickhouse_http_handler_port    | Port for the ClickHouse HTTP query handler.                                                                 |
| http_handler_host               | Hostname for the HTTP API query handler.                                                                    |
| http_handler_port               | Port for the HTTP API query handler.                                                                        |
| flight_sql_handler_host         | Hostname for the Experimental Arrow Flight SQL API query handler.                                           |
| flight_sql_handler_port         | Port for the Experimental Arrow Flight SQL API query handler.                                               |
| tenant_id                       | Default tenant ID.                                                                                          |
| cluster_id                      | Default cluster ID.                                                                                         |
| table_engine_memory_enabled     | Flag to enable the Memory table engine.                                                                     |
| max_running_queries             | Maximum number of queries that can be executed simultaneously, defaulting to 8, with 0 indicating no limit. |
| data_retention_time_in_days_max | Sets the upper limit for the `data_retention_time_in_days` setting, with a default value of 90 days.        |

### [query.users] Section

The following is a list of the parameters available within the [[query.users]] section. For more information about configuring admin users, see [Configuring Admin Users](../01-admin-users.md).

| Parameter   | Description                                                                     |
| ----------- | ------------------------------------------------------------------------------- |
| name        | User name.                                                                      |
| auth_type   | Authentication type (e.g., no_password, double_sha1_password, sha256_password). |
| auth_string | Authentication string (e.g., SHA-1 or SHA-256 hash of the password).            |

### [query.settings] Section

The following is a list of the parameters available within the [query.settings] section.

| Parameter                       | Description                                                                                                                                                                                                                                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| aggregate_spilling_memory_ratio | Controls the threshold for spilling data to disk during aggregation operations. When memory usage exceeds this percentage of the total available memory, data will be spilled to the object storage to avoid memory exhaustion. Example: if set to 60, spilling occurs when memory usage exceeds 60%. |
| join_spilling_memory_ratio      | Controls the threshold for spilling data to disk during join operations. When memory usage exceeds this percentage of the total available memory, data will be spilled to the object storage to avoid memory exhaustion. Example: if set to 60, spilling occurs when memory usage exceeds 60%.        |

## [log] Section

This section can include these subsections: [log.file], [log.stderr], [log.query], and [log.tracing].

### [log.file] Section

The following is a list of the parameters available within the [log.file] section:

| Parameter | Description                                                                                                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| on        | Enables or disables file logging. Defaults to `true`.                                                                                                                                       |
| dir       | Path to store log files.                                                                                                                                                                    |
| level     | Log level, following [env_logger](https://docs.rs/env_logger/latest/env_logger/) syntax: `error`, `warn`, `info`, `debug`, `trace`, `off`. Defaults to `warn,databend_=info,openraft=info`. |
| format    | Log format: `json` or `text`. Defaults to `json`.                                                                                                                                           |
| limit     | Determines the maximum number of log files to be retained. Defaults to `48`.                                                                                                                |

### [log.stderr] Section

The following is a list of the parameters available within the [log.stderr] section:

| Parameter | Description                                                                                                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| on        | Enables or disables stderr logging. Defaults to `false`.                                                                                                                                    |
| level     | Log level, following [env_logger](https://docs.rs/env_logger/latest/env_logger/) syntax: `error`, `warn`, `info`, `debug`, `trace`, `off`. Defaults to `warn,databend_=info,openraft=info`. |
| format    | Log format: `json` or `text`. Defaults to `json`.                                                                                                                                           |

### [log.query] Section

The following is a list of the parameters available within the [log.query] section:

| Parameter | Description                                                                                                                                                 |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| on        | Enables logging query execution details to the query-details folder in the log directory. Defaults to on. Consider disabling when storage space is limited. |

### [log.tracing] Section

The following is a list of the parameters available within the [log.tracing] section:

| Parameter         | Description                                                                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| capture_log_level | Sets the log level (DEBUG, TRACE, INFO, WARN, or ERROR) for capturing traces during execution.                                                                |
| on                | Controls whether tracing is enabled. Default value is 'false' for disabled. Set to 'true' to enable tracing.                                                  |
| otlp_endpoint     | Specifies the OpenTelemetry Protocol (OTLP) endpoint for tracing. Defaults to `http://127.0.0.1:4317`, but you can replace it with the desired OTLP endpoint. |

### [log.history] Section

The following is a list of the parameters available within the [log.history] section:

| Parameter          | Description                                                                                                                                                                                                                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| on                 | Enables or disables the history logging feature. Defaults to false. Set to true to enable history tables.                                                                                                                                                                                           |
| log_only           | Nodes with enabled will delegate transformation tasks to other nodes, reducing their own workload.                                                                                                                                                                                                  |
| interval           | Specifies the interval (in seconds) at which the history log is flushed. Defaults to 2.                                                                                                                                                                                                             |
| stage_name         | Specifies the name of the staging area that temporarily holds log data before it is finally copied into the table. Defaults to a unique value to avoid conflicts.                                                                                                                                   |
| level              | Sets the log level (DEBUG, TRACE, INFO, WARN, or ERROR) for history logging. Defaults to WARN.                                                                                                                                                                                                      |
| retention_interval | The interval (in hours) at which the retention process is triggered to check if need to clean up old data. Defaults to 24.                                                                                                                                                                          |
| tables             | Specifies which history tables to enable and their retention policies. This is an array of objects, each with table_name (the name of the history table) and retention (the retention period in hours for that table).                                                                              |
| storage            | Specifies the storage location for history tables. By default, history tables use the same storage configuration as defined in the [storage] section, but you can specify an alternative storage location specifically for history tables. The format is exactly the same as the [storage] section. |

`tables` are an array of objects, each object has two parameters:
| Parameter | Description |
| --------- | ----------- |
| table_name | The name of the history table. (currently support: `log_history`, `profile_history`, `query_history`, `login_history`) |
| retention | The retention period in hours for that table. |
Note: `log_history` table will be enable in default

If `storage` is specified, the original default history tables will be dropped and recreated with the new storage configuration. All nodes under the same tenant must maintain the same `storage` configuration to ensure consistency.

## [meta] Section

The following is a list of the parameters available within the [meta] section:

| Parameter                    | Description                                                                                                                                                                                                                                                                                                           |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| username                     | The username used to connect to the Meta service. Default: "root".                                                                                                                                                                                                                                                    |
| password                     | The password used to connect to the Meta service. Databend recommends using the environment variable META_PASSWORD to provide the password. Default: "root".                                                                                                                                                          |
| endpoints                    | Sets one or more meta server endpoints that this query server can connect to. For robust connection to Meta, include multiple meta servers within the cluster as backups if possible. Example: ["192.168.0.1:9191", "192.168.0.2:9191"]. Default: ["0.0.0.0:9191"].                                                   |
| client_timeout_in_second     | Sets the wait time (in seconds) before terminating the attempt to connect to a meta server. Default: 60.                                                                                                                                                                                                              |
| auto_sync_interval           | Sets how often (in seconds) this query server should automatically sync up endpoints from the meta servers within the cluster. When enabled, Databend-query contacts a Databend-meta server periodically to obtain a list of grpc_api_advertise_host:grpc-api-port. To disable the sync up, set it to 0. Default: 60. |
| unhealth_endpoint_evict_time | Internal time (in seconds) for not querying an unhealthy meta node endpoint. Default: 120.                                                                                                                                                                                                                            |

## [storage] Section

The following is a list of the parameters available within the [storage] section:

| Parameter                            | Description                                                                                                                                                                                                                                          |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type                                 | The type of storage used. It can be one of the following: fs, s3, azblob, gcs, oss, cos.                                                                                                                                                             |
| allow_insecure                       | Defaults to false. Set it to true when deploying Databend on MinIO or loading data via a URL prefixed by `http://`, otherwise, you may encounter the following error: "copy from insecure storage is not allowed. Please set `allow_insecure=true`". |
| `storage_retry_timeout`              | _(in seconds)_ Retries an OpenDAL read/write operation if it exceeds this threshold. Default: `10`.                                                                                                                                                  |
| `storage_retry_io_timeout`           | _(in seconds)_ Retries an OpenDAL HTTP request if it exceeds this threshold. Default: `60`.                                                                                                                                                          |
| `storage_pool_max_idle_per_host`     | Maximum connection pool size per host. Default: unlimit.                                                                                                                                                                                             |
| `storage_connect_timeout`            | _(in seconds)_ TCP connection timeout. Default: `30`.                                                                                                                                                                                                |
| `storage_tcp_keepalive`              | _(in seconds)_ TCP keepalive duration. Default: None.                                                                                                                                                                                                |
| `storage_max_concurrent_io_requests` | Maximum number of concurrent I/O requests. Default: unlimit.                                                                                                                                                                                         |

### [storage.fs] Section

The following is a list of the parameters available within the [storage.fs] section:

| Parameter | Description                            |
| --------- | -------------------------------------- |
| data_path | The path to the data storage location. |

### [storage.s3] Section

The following is a list of the parameters available within the [storage.s3] section:

| Parameter                 | Description                                                                                                                                                            |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket                    | The name of your Amazon S3-like storage bucket.                                                                                                                        |
| endpoint_url              | The URL endpoint for the S3-like storage service. Defaults to "https://s3.amazonaws.com".                                                                              |
| access_key_id             | The access key ID for authenticating with the storage service.                                                                                                         |
| secret_access_key         | The secret access key for authenticating with the storage service.                                                                                                     |
| enable_virtual_host_style | A boolean flag indicating whether to enable virtual host-style addressing.                                                                                             |
| external_id               | External ID for authentication.                                                                                                                                        |
| master_key                | Master key for authentication.                                                                                                                                         |
| region                    | The region for the S3-like storage service.                                                                                                                            |
| role_arn                  | ARN (Amazon Resource Name) for authentication.                                                                                                                         |
| root                      | Specifies a directory within the bucket from which Databend will operate. Example: if a bucket's root directory has a folder called `myroot`, then `root = "myroot/"`. |
| security_token            | Security token for authentication.                                                                                                                                     |

### [storage.azblob] Section

The following is a list of the parameters available within the [storage.azblob] section:

| Parameter    | Description                                                                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| endpoint_url | The URL endpoint for Azure Blob Storage (e.g., `https://<your-storage-account-name>.blob.core.windows.net)`.                                                           |
| container    | The name of your Azure storage container.                                                                                                                              |
| account_name | The name of your Azure storage account.                                                                                                                                |
| account_key  | The account key for authenticating with Azure Blob Storage.                                                                                                            |
| root         | Specifies a directory within the bucket from which Databend will operate. Example: if a bucket's root directory has a folder called `myroot`, then `root = "myroot/"`. |

### [storage.gcs] Section

The following is a list of the parameters available within the [storage.gcs] section:

| Parameter  | Description                                                                                                                                                            |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket     | The name of your Google Cloud Storage bucket.                                                                                                                          |
| credential | The base64 encoded service account key file for Google Cloud Storage authentication.                                                                                   |
| root       | Specifies a directory within the bucket from which Databend will operate. Example: if a bucket's root directory has a folder called `myroot`, then `root = "myroot/"`. |

To get the `credential`, you could follow the topic [Create a service account key](https://cloud.google.com/iam/docs/keys-create-delete#creating)
from the Google documentation to create and download a service account key file. After downloading the service account key file, you could
convert it into a base64 string via the following command:

```
base64 -i -o ~/Desktop/base64-encoded-key.txt
```

### [storage.oss] Section

The following is a list of the parameters available within the [storage.oss] section:

| Parameter            | Description                                                                                                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket               | The name of your Alibaba Cloud OSS bucket.                                                                                                                             |
| endpoint_url         | The URL endpoint for Alibaba Cloud OSS.                                                                                                                                |
| access_key_id        | The access key ID for authenticating with Alibaba Cloud OSS.                                                                                                           |
| access_key_secret    | The access key secret for authenticating with Alibaba Cloud OSS.                                                                                                       |
| presign_endpoint_url | The URL endpoint for presigned operations with Alibaba Cloud OSS.                                                                                                      |
| root                 | Specifies a directory within the bucket from which Databend will operate. Example: if a bucket's root directory has a folder called `myroot`, then `root = "myroot/"`. |

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

The following is a list of the parameters available within the [storage.cos] section:

| Parameter    | Description                                                                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket       | The name of your Tencent Cloud Object Storage (COS) bucket.                                                                                                            |
| endpoint_url | The URL endpoint for Tencent COS (optional).                                                                                                                           |
| secret_id    | The secret ID for authenticating with Tencent COS.                                                                                                                     |
| secret_key   | The secret key for authenticating with Tencent COS.                                                                                                                    |
| root         | Specifies a directory within the bucket from which Databend will operate. Example: if a bucket's root directory has a folder called `myroot`, then `root = "myroot/"`. |

## [cache] Section

The following is a list of the parameters available within the [cache] section:

| Parameter                | Description                                                                                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| data_cache_storage       | The type of storage used for table data cache. Available options: "none" (disables table data cache), "disk" (enables disk cache). Defaults to "none". |
| iceberg_table_meta_count | Controls the number of Iceberg table metadata entries to cache. Set to `0` to disable metadata caching.                                                |

### [cache.disk] Section

The following is a list of the parameters available within the [cache.disk] section:

| Parameter | Description                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------------- |
| path      | The path where the cache is stored when using disk cache.                                                |
| max_bytes | The maximum amount of cached data in bytes when using disk cache. Defaults to 21474836480 bytes (20 GB). |

## [spill] Section

Databend can spill intermediate data to reduce memory pressure.

### Default Spill Storage Backend (No Extra Config)

- Backend: same as the main [storage].
- Prefix: `_query_spill/` (under the configured `root`).
- Location: for object storage (S3/Azure/GCS/...), `<bucket>/<root>/_query_spill/`.
- Also used as fallback when local disk spill is enabled.

### Local Disk Spill (With Fallback)

- Writes spill files to local disk first.
- Falls back to the spill storage backend (default or [spill.storage]) when local quota is exhausted or disk is too full.

| Parameter                                  | Description                                                                                                                                                                                                                                                               |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| spill_local_disk_path                      | Specifies the directory path where spilled data will be stored on the local disk. Leave it empty to disable local disk spill.                                                                                                                                            |
| spill_local_disk_reserved_space_percentage | Defines the percentage of disk space that will be reserved and not used for spill. This prevents spill operations from completely filling the disk and ensures system stability. Default: `10`.                                                                          |
| spill_local_disk_max_bytes                 | Sets the maximum number of bytes allowed for spilling data to the local disk. When the local spill quota is exhausted, new spill operations automatically fall back to the spill storage backend (default or [spill.storage]), ensuring queries continue without interruption. Default: unlimited. |

**Example (Local Disk Spill):**

```toml
[spill]
spill_local_disk_path = "/data/spill"
spill_local_disk_reserved_space_percentage = 10.0
spill_local_disk_max_bytes = 53687091200
```

### Dedicated Spill Storage Backend (Separate From Data)

- Configure via [spill.storage].
- Affects spill files only (including local-disk fallback target); does not change where table data is stored.
- Still uses the `_query_spill/` prefix under the configured `root`.

| Parameter | Description                                                                                                               |
| --------- | ------------------------------------------------------------------------------------------------------------------------- |
| type      | Specifies the storage type. Available options: `fs`, `s3`, `azblob`, `gcs`, `oss`, `cos`, etc. (same as the [storage] section). |

### [spill.storage.s3] Section (S3 Remote Storage)

Same parameters as [storage.s3 Section](#storages3-section).

- Prefix: `_query_spill/` (under `root`).
- AWS S3: spill objects use `STANDARD` storage class.

**Example (Dedicated S3 Spill Backend):**

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
