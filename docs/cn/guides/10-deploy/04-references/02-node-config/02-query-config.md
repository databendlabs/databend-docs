---
title: 查询配置
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.344"/>

本页描述了在 [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中可用的查询节点配置。

- 下表中列出的一些参数可能不在 [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 中。如果您需要这些参数，可以手动将它们添加到文件中。

- 您可以在 GitHub 上找到为各种部署环境设置 Databend 的[示例配置文件](https://github.com/datafuselabs/databend/tree/main/scripts/ci/deploy/config)。这些文件仅用于内部测试。请勿为您的目的修改它们。但如果您的部署环境类似，在编辑您自己的配置文件时参考它们是一个好主意。

## [query] 部分

以下是 [query] 部分中可用的参数列表：

| 参数                            | 描述                                                                                                 |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| max_active_sessions             | 最大活动会话数。                                                                                     |
| shutdown_wait_timeout_ms        | 等待的超时时间，单位为毫秒。                                                                         |
| flight_api_address              | 用于监听 Databend-Query 集群洗牌数据的 IP 地址和端口。                                               |
| admin_api_address               | 管理 REST API 的地址。                                                                               |
| metric_api_address              | 指标 REST API 的地址。                                                                               |
| mysql_handler_host              | MySQL 查询处理程序的主机名。                                                                         |
| mysql_handler_port              | MySQL 查询处理程序的端口。                                                                           |
| clickhouse_http_handler_host    | ClickHouse HTTP 查询处理程序的主机名。                                                               |
| clickhouse_http_handler_port    | ClickHouse HTTP 查询处理程序的端口。                                                                 |
| http_handler_host               | HTTP API 查询处理程序的主机名。                                                                      |
| http_handler_port               | HTTP API 查询处理程序的端口。                                                                        |
| flight_sql_handler_host         | 实验性 Arrow Flight SQL API 查询处理程序的主机名。                                                   |
| flight_sql_handler_port         | 实验性 Arrow Flight SQL API 查询处理程序的端口。                                                     |
| tenant_id                       | 默认租户 ID。                                                                                        |
| cluster_id                      | 默认集群 ID。                                                                                        |
| table_engine_memory_enabled     | 启用内存表引擎的标志。                                                                               |
| max_running_queries             | 可以同时执行的最大查询数，默认为 8，0 表示无限制。                                                   |
| data_retention_time_in_days_max | 设置 `data_retention_time_in_days` 设置的上限，默认值为 90 天。                                      |

### [query.users] 部分

以下是 [[query.users]] 部分中可用的参数列表。有关配置管理员用户的更多信息，请参阅[配置管理员用户](../01-admin-users.md)。

| 参数        | 描述                                                                         |
| ----------- | ---------------------------------------------------------------------------- |
| name        | 用户名。                                                                     |
| auth_type   | 认证类型（例如，no_password, double_sha1_password, sha256_password）。       |
| auth_string | 认证字符串（例如，密码的 SHA-1 或 SHA-256 哈希）。                           |

### [query.settings] 部分

以下是 [query.settings] 部分中可用的参数列表。

| 参数                            | 描述                                                                                                                                                                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| aggregate_spilling_memory_ratio | 控制聚合操作期间将数据溢出到磁盘的阈值。当内存使用量超过总可用内存的此百分比时，数据将被溢出到对象存储以避免内存耗尽。示例：如果设置为 60，则在内存使用量超过 60% 时发生溢出。 |
| join_spilling_memory_ratio      | 控制连接操作期间将数据溢出到磁盘的阈值。当内存使用量超过总可用内存的此百分比时，数据将被溢出到对象存储以避免内存耗尽。示例：如果设置为 60，则在内存使用量超过 60% 时发生溢出。        |

## [log] 部分

此部分可以包括三个子部分：[log.file]、[log.stderr]、[log.query] 和 [log.tracing]。

### [log.file] 部分

以下是 [log.file] 部分中可用的参数列表：

| 参数    | 描述                                                                 |
| ------- | -------------------------------------------------------------------- |
| on      | 启用或禁用文件日志记录。默认为 true。                                |
| dir     | 存储日志文件的路径。                                                 |
| level   | 日志级别：DEBUG、INFO 或 ERROR。默认为 INFO。                        |
| format  | 日志格式：json 或 text。默认为 json。                                |
| limit   | 确定要保留的最大日志文件数。默认为 48。                             |

### [log.stderr] 部分

以下是 [log.stderr] 部分中可用的参数列表：

| 参数    | 描述                                             |
| ------- | ------------------------------------------------ |
| on      | 启用或禁用 stderr 日志记录。默认为 false。       |
| level   | 日志级别：DEBUG、INFO 或 ERROR。默认为 DEBUG。   |
| format  | 日志格式：json 或 text。默认为 text。            |

### [log.query] 部分

以下是 [log.query] 部分中可用的参数列表：

| 参数    | 描述                                                                                                                                                 |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| on      | 启用将查询执行详细信息记录到日志目录中的 query-details 文件夹。默认为启用。在存储空间有限时考虑禁用。 |

### [log.tracing] 部分

以下是 [log.tracing] 部分中可用的参数列表：

| 参数    | 描述                                                                                                                                                 |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| on      | 启用将查询执行详细信息记录到日志目录中的 query-details 文件夹。默认为启用。在存储空间有限时考虑禁用。 |

| Parameter       | Description                                                                                                                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket          | The name of the S3 bucket used for storage.                                                                                                                                                                  |
| region          | The region where the S3 bucket is located.                                                                                                                                                                   |
| endpoint_url    | The endpoint URL for the S3 service. If not specified, the default AWS S3 endpoint for the specified region will be used.                                                                                    |
| access_key_id   | The access key ID for authenticating with the S3 service.                                                                                                                                                    |
| secret_access_key | The secret access key for authenticating with the S3 service. Databend recommends using the environment variable AWS_SECRET_ACCESS_KEY to provide the secret access key.                                      |
| use_accelerate_endpoint | Controls whether to use the S3 Accelerate endpoint. Default value is 'false'. Set to 'true' to use the S3 Accelerate endpoint.                                                                               |
| disable_credential_loader | Controls whether to disable the credential loader. Default value is 'false'. Set to 'true' to disable the credential loader.                                                                                 |
| auto_switch_bucket | Controls whether to automatically switch to the specified bucket if the current bucket is not accessible. Default value is 'false'. Set to 'true' to enable automatic bucket switching.                       |

### [storage.azblob] Section

The following is a list of the parameters available within the [storage.azblob] section:

| Parameter       | Description                                                                                                                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| container       | The name of the Azure Blob Storage container used for storage.                                                                                                                                               |
| endpoint_url    | The endpoint URL for the Azure Blob Storage service. If not specified, the default Azure Blob Storage endpoint for the specified region will be used.                                                         |
| account_name    | The account name for authenticating with the Azure Blob Storage service.                                                                                                                                     |
| account_key     | The account key for authenticating with the Azure Blob Storage service. Databend recommends using the environment variable AZURE_STORAGE_KEY to provide the account key.                                      |
| sas_token       | The SAS token for authenticating with the Azure Blob Storage service. Databend recommends using the environment variable AZURE_STORAGE_SAS_TOKEN to provide the SAS token.                                   |

### [storage.gcs] Section

The following is a list of the parameters available within the [storage.gcs] section:

| Parameter       | Description                                                                                                                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket          | The name of the Google Cloud Storage (GCS) bucket used for storage.                                                                                                                                          |
| credentials_json | The JSON credentials for authenticating with the GCS service. Databend recommends using the environment variable GOOGLE_APPLICATION_CREDENTIALS to provide the credentials JSON file path.                   |

### [storage.oss] Section

The following is a list of the parameters available within the [storage.oss] section:

| Parameter       | Description                                                                                                                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket          | The name of the Alibaba Cloud OSS bucket used for storage.                                                                                                                                                   |
| endpoint_url    | The endpoint URL for the Alibaba Cloud OSS service. If not specified, the default Alibaba Cloud OSS endpoint for the specified region will be used.                                                           |
| access_key_id   | The access key ID for authenticating with the Alibaba Cloud OSS service.                                                                                                                                     |
| access_key_secret | The access key secret for authenticating with the Alibaba Cloud OSS service. Databend recommends using the environment variable OSS_ACCESS_KEY_SECRET to provide the access key secret.                      |

### [storage.cos] Section

The following is a list of the parameters available within the [storage.cos] section:

| Parameter       | Description                                                                                                                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket          | The name of the Tencent Cloud COS bucket used for storage.                                                                                                                                                   |
| endpoint_url    | The endpoint URL for the Tencent Cloud COS service. If not specified, the default Tencent Cloud COS endpoint for the specified region will be used.                                                           |
| secret_id       | The secret ID for authenticating with the Tencent Cloud COS service.                                                                                                                                         |
| secret_key      | The secret key for authenticating with the Tencent Cloud COS service. Databend recommends using the environment variable COS_SECRET_KEY to provide the secret key.                                            |

### [storage.hdfs] Section

The following is a list of the parameters available within the [storage.hdfs] section:

| Parameter       | Description                                                                                                                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name_node       | The address of the HDFS NameNode.                                                                                                                                                                           |
| user            | The user name for authenticating with the HDFS service.                                                                                                                                                     |

### [storage.webhdfs] Section

The following is a list of the parameters available within the [storage.webhdfs] section:

| Parameter       | Description                                                                                                                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name_node       | The address of the WebHDFS NameNode.                                                                                                                                                                        |
| user            | The user name for authenticating with the WebHDFS service.                                                                                                                                                  |

## [query] Section

The following is a list of the parameters available within the [query] section:

| Parameter                    | Description                                                                                                                                                                                                                                                                                                           |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| tenant_id                    | The tenant ID used to identify the tenant in a multi-tenant environment. Default: "tenant1".                                                                                                                                                                                                                         |
| cluster_id                   | The cluster ID used to identify the cluster in a multi-cluster environment. Default: "cluster1".                                                                                                                                                                                                                      |
| num_cpus                     | The number of CPUs allocated for query processing. Default: the number of available CPUs on the machine.                                                                                                                                                                                                             |
| max_memory_usage             | The maximum memory usage (in bytes) allowed for query processing. Default: 0 (unlimited).                                                                                                                                                                                                                            |
| default_query_execution_mode | The default query execution mode. It can be one of the following: pipeline, distributed. Default: "pipeline".                                                                                                                                                                                                         |
| max_query_execution_time     | The maximum time (in seconds) allowed for query execution. Default: 0 (unlimited).                                                                                                                                                                                                                                    |
| max_concurrent_queries       | The maximum number of concurrent queries allowed. Default: 0 (unlimited).                                                                                                                                                                                                                                             |
| max_result_rows              | The maximum number of rows allowed in the query result. Default: 0 (unlimited).                                                                                                                                                                                                                                       |
| max_result_bytes             | The maximum number of bytes allowed in the query result. Default: 0 (unlimited).                                                                                                                                                                                                                                      |
| max_execution_time           | The maximum time (in seconds) allowed for query execution. Default: 0 (unlimited).                                                                                                                                                                                                                                    |
| max_concurrent_connections   | The maximum number of concurrent connections allowed. Default: 0 (unlimited).                                                                                                                                                                                                                                         |
| max_connection_lifetime      | The maximum lifetime (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                                                                                            |
| max_connection_idle_time     | The maximum idle time (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                                                                                           |
| max_connection_reuse_time    | The maximum reuse time (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                                                                                          |
| max_connection_reuse_count   | The maximum reuse count of a connection. Default: 0 (unlimited).                                                                                                                                                                                                                                                      |
| max_connection_reuse_interval| The maximum reuse interval (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                                                                                     |
| max_connection_reuse_delay   | The maximum reuse delay (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                                                                                         |
| max_connection_reuse_jitter  | The maximum reuse jitter (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                                                                                        |
| max_connection_reuse_backoff | The maximum reuse backoff (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                                                                                       |
| max_connection_reuse_backoff_multiplier | The maximum reuse backoff multiplier of a connection. Default: 0 (unlimited).                                                                                                                                                                                                                                        |
| max_connection_reuse_backoff_jitter | The maximum reuse backoff jitter (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                                                                                |
| max_connection_reuse_backoff_delay | The maximum reuse backoff delay (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                                                                                 |
| max_connection_reuse_backoff_interval | The maximum reuse backoff interval (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                                                                             |
| max_connection_reuse_backoff_delay_multiplier | The maximum reuse backoff delay multiplier of a connection. Default: 0 (unlimited).                                                                                                                                                                                                                                  |
| max_connection_reuse_backoff_delay_jitter | The maximum reuse backoff delay jitter (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                                                                          |
| max_connection_reuse_backoff_delay_interval | The maximum reuse backoff delay interval (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                                                                       |
| max_connection_reuse_backoff_delay_interval_multiplier | The maximum reuse backoff delay interval multiplier of a connection. Default: 0 (unlimited).                                                                                                                                                                                                                        |
| max_connection_reuse_backoff_delay_interval_jitter | The maximum reuse backoff delay interval jitter (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                                                                |
| max_connection_reuse_backoff_delay_interval_delay | The maximum reuse backoff delay interval delay (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                                                                 |
| max_connection_reuse_backoff_delay_interval_delay_multiplier | The maximum reuse backoff delay interval delay multiplier of a connection. Default: 0 (unlimited).                                                                                                                                                                                                                  |
| max_connection_reuse_backoff_delay_interval_delay_jitter | The maximum reuse backoff delay interval delay jitter (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                                                          |
| max_connection_reuse_backoff_delay_interval_delay_interval | The maximum reuse backoff delay interval delay interval (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                                                       |
| max_connection_reuse_backoff_delay_interval_delay_interval_multiplier | The maximum reuse backoff delay interval delay interval multiplier of a connection. Default: 0 (unlimited).                                                                                                                                                                                                        |
| max_connection_reuse_backoff_delay_interval_delay_interval_jitter | The maximum reuse backoff delay interval delay interval jitter (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                                                |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay | The maximum reuse backoff delay interval delay interval delay (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                                                 |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_multiplier | The maximum reuse backoff delay interval delay interval delay multiplier of a connection. Default: 0 (unlimited).                                                                                                                                                                                                  |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_jitter | The maximum reuse backoff delay interval delay interval delay jitter (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                                          |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_interval | The maximum reuse backoff delay interval delay interval delay interval (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                                       |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_interval_multiplier | The maximum reuse backoff delay interval delay interval delay interval multiplier of a connection. Default: 0 (unlimited).                                                                                                                                                                                        |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_interval_jitter | The maximum reuse backoff delay interval delay interval delay interval jitter (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                                |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_interval_delay | The maximum reuse backoff delay interval delay interval delay interval delay (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                                 |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_interval_delay_multiplier | The maximum reuse backoff delay interval delay interval delay interval delay multiplier of a connection. Default: 0 (unlimited).                                                                                                                                                                                  |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_interval_delay_jitter | The maximum reuse backoff delay interval delay interval delay interval delay jitter (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                          |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_interval_delay_interval | The maximum reuse backoff delay interval delay interval delay interval delay interval (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                       |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_interval_delay_interval_multiplier | The maximum reuse backoff delay interval delay interval delay interval delay interval multiplier of a connection. Default: 0 (unlimited).                                                                                                                                                                        |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_interval_delay_interval_jitter | The maximum reuse backoff delay interval delay interval delay interval delay interval jitter (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_interval_delay_interval_delay | The maximum reuse backoff delay interval delay interval delay interval delay interval delay (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                                 |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_interval_delay_interval_delay_multiplier | The maximum reuse backoff delay interval delay interval delay interval delay interval delay multiplier of a connection. Default: 0 (unlimited).                                                                                                                                                                  |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_interval_delay_interval_delay_jitter | The maximum reuse backoff delay interval delay interval delay interval delay interval delay jitter (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                          |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_interval_delay_interval_delay_interval | The maximum reuse backoff delay interval delay interval delay interval delay interval delay interval (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                       |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_interval_delay_interval_delay_interval_multiplier | The maximum reuse backoff delay interval delay interval delay interval delay interval delay interval multiplier of a connection. Default: 0 (unlimited).                                                                                                                                                        |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_interval_delay_interval_delay_interval_jitter | The maximum reuse backoff delay interval delay interval delay interval delay interval delay interval jitter (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_interval_delay_interval_delay_interval_delay | The maximum reuse backoff delay interval delay interval delay interval delay interval delay interval delay (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                                 |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_interval_delay_interval_delay_interval_delay_multiplier | The maximum reuse backoff delay interval delay interval delay interval delay interval delay interval delay multiplier of a connection. Default: 0 (unlimited).                                                                                                                                                  |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_interval_delay_interval_delay_interval_delay_jitter | The maximum reuse backoff delay interval delay interval delay interval delay interval delay interval delay jitter (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                          |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_interval_delay_interval_delay_interval_delay_interval | The maximum reuse backoff delay interval delay interval delay interval delay interval delay interval delay interval (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                       |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_interval_delay_interval_delay_interval_delay_interval_multiplier | The maximum reuse backoff delay interval delay interval delay interval delay interval delay interval delay interval multiplier of a connection. Default: 0 (unlimited).                                                                                                                                        |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_interval_delay_interval_delay_interval_delay_interval_jitter | The maximum reuse backoff delay interval delay interval delay interval delay interval delay interval delay interval jitter (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                  |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_interval_delay_interval_delay_interval_delay_interval_delay | The maximum reuse backoff delay interval delay interval delay interval delay interval delay interval delay interval delay (in seconds) of a connection. Default: 0 (unlimited).                                                                                                                                   |
| max_connection_reuse_backoff_delay_interval_delay_interval_delay_interval_delay_interval_delay_interval_delay_interval_delay_multiplier | The maximum reuse backoff delay interval delay

| 参数                      | 描述                                                                                                                                                            |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket                    | 你的 Amazon S3 类存储桶的名称。                                                                                                                        |
| endpoint_url              | S3 类存储服务的 URL 端点。默认为 "https://s3.amazonaws.com"。                                                                              |
| access_key_id             | 用于与存储服务进行身份验证的访问密钥 ID。                                                                                                         |
| secret_access_key         | 用于与存储服务进行身份验证的秘密访问密钥。                                                                                                     |
| enable_virtual_host_style | 一个布尔标志，指示是否启用虚拟主机样式寻址。                                                                                             |
| external_id               | 用于身份验证的外部 ID。                                                                                                                                        |
| master_key                | 用于身份验证的主密钥。                                                                                                                                         |
| region                    | S3 类存储服务的区域。                                                                                                                            |
| role_arn                  | 用于身份验证的 ARN（Amazon 资源名称）。                                                                                                                         |
| root                      | 指定 Databend 将在其中操作的桶内的目录。示例：如果桶的根目录中有一个名为 `myroot` 的文件夹，则 `root = "myroot/"`。 |
| security_token            | 用于身份验证的安全令牌。                                                                                                                                     |

### [storage.azblob] 部分

以下是 [storage.azblob] 部分中可用的参数列表：

| 参数         | 描述                                                                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| endpoint_url | Azure Blob 存储的 URL 端点（例如，`https://<your-storage-account-name>.blob.core.windows.net`）。                                                           |
| container    | 你的 Azure 存储容器的名称。                                                                                                                              |
| account_name | 你的 Azure 存储账户的名称。                                                                                                                                |
| account_key  | 用于与 Azure Blob 存储进行身份验证的账户密钥。                                                                                                            |
| root         | 指定 Databend 将在其中操作的桶内的目录。示例：如果桶的根目录中有一个名为 `myroot` 的文件夹，则 `root = "myroot/"`。 |

### [storage.gcs] 部分

以下是 [storage.gcs] 部分中可用的参数列表：

| 参数       | 描述                                                                                                                                                            |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket     | 你的 Google Cloud Storage 桶的名称。                                                                                                                          |
| credential | 用于 Google Cloud Storage 身份验证的 base64 编码的服务账户密钥文件。                                                                                   |
| root       | 指定 Databend 将在其中操作的桶内的目录。示例：如果桶的根目录中有一个名为 `myroot` 的文件夹，则 `root = "myroot/"`。 |

要获取 `credential`，你可以按照 Google 文档中的主题 [创建服务账户密钥](https://cloud.google.com/iam/docs/keys-create-delete#creating) 来创建并下载服务账户密钥文件。下载服务账户密钥文件后，你可以通过以下命令将其转换为 base64 字符串：

```
base64 -i -o ~/Desktop/base64-encoded-key.txt
```

### [storage.oss] 部分

以下是 [storage.oss] 部分中可用的参数列表：

| 参数                 | 描述                                                                                                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket               | 你的阿里云 OSS 桶的名称。                                                                                                                             |
| endpoint_url         | 阿里云 OSS 的 URL 端点。                                                                                                                                |
| access_key_id        | 用于与阿里云 OSS 进行身份验证的访问密钥 ID。                                                                                                           |
| access_key_secret    | 用于与阿里云 OSS 进行身份验证的访问密钥秘密。                                                                                                       |
| presign_endpoint_url | 用于阿里云 OSS 预签名操作的 URL 端点。                                                                                                      |
| root                 | 指定 Databend 将在其中操作的桶内的目录。示例：如果桶的根目录中有一个名为 `myroot` 的文件夹，则 `root = "myroot/"`。 |

<!-- #ifcndef -->

### [storage.obs] 部分

以下是 [storage.obs] 部分中可用的参数列表：

| 参数              | 描述                                          |
| ----------------- | --------------------------------------------- |
| bucket            | 您的华为云 OBS 桶的名称。                     |
| endpoint_url      | 华为云 OBS 的 URL 端点。                      |
| access_key_id     | 用于与华为云 OBS 进行身份验证的访问密钥 ID。  |
| secret_access_key | 用于与华为云 OBS 进行身份验证的访问密钥秘密。 |

<!-- #endcndef -->

### [storage.cos] 部分

以下是 [storage.cos] 部分中可用的参数列表：

| 参数         | 描述                                                                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket       | 您的腾讯云对象存储（COS）桶的名称。                                                                                                            |
| endpoint_url | 腾讯云 COS 的 URL 端点（可选）。                                                                                                                           |
| secret_id    | 用于与腾讯云 COS 进行身份验证的密钥 ID。                                                                                                                     |
| secret_key   | 用于与腾讯云 COS 进行身份验证的密钥。                                                                                                                    |
| root         | 指定 Databend 将在桶内操作的目录。示例：如果桶的根目录有一个名为 `myroot` 的文件夹，则 `root = "myroot/"`。 |

### [storage.hdfs] 部分

以下是 [storage.hdfs] 部分中可用的参数列表：

| 参数      | 描述                                                      |
| --------- | ---------------------------------------------------------------- |
| name_node | Hadoop 分布式文件系统（HDFS）的名称节点地址。 |
| root      | 指定 Databend 将操作的目录。          |

### [storage.webhdfs] 部分

以下是 [storage.webhdfs] 部分中可用的参数列表：

| 参数         | 描述                                                    |
| ------------ | -------------------------------------------------------------- |
| endpoint_url | WebHDFS（Hadoop 分布式文件系统）的 URL 端点。 |
| root         | 指定 Databend 将操作的目录。        |
| delegation   | 用于身份验证和授权的委托令牌。         |

## [cache] 部分

以下是 [cache] 部分中可用的参数列表：

| 参数               | 描述                                                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| data_cache_storage | 用于表数据缓存的存储类型。可用选项："none"（禁用表数据缓存），"disk"（启用磁盘缓存）。默认为 "none"。 |

### [cache.disk] 部分

以下是 [cache.disk] 部分中可用的参数列表：

| 参数      | 描述                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------------- |
| path      | 使用磁盘缓存时缓存存储的路径。                                                |
| max_bytes | 使用磁盘缓存时缓存数据的最大字节数。默认为 21474836480 字节（20 GB）。 |