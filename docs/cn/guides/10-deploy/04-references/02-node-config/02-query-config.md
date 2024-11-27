---
title: 查询配置
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import LanguageDocs from '@site/src/components/LanguageDocs';

<FunctionDescription description="引入或更新: v1.2.344"/>

本页描述了在 [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中可用的查询节点配置。

- 下表中列出的一些参数可能不在 [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 中。如果您需要这些参数，可以手动将它们添加到文件中。

- 您可以在 GitHub 上找到为各种部署环境设置 Databend 的[示例配置文件](https://github.com/datafuselabs/databend/tree/main/scripts/ci/deploy/config)。这些文件仅供内部测试使用。请勿为您的目的修改它们。但如果您的部署环境类似，在编辑您自己的配置文件时参考它们是一个好主意。

## [query] 部分

以下是 [query] 部分中可用的参数列表：

| 参数                            | 描述                                                            |
| ------------------------------- | --------------------------------------------------------------- |
| max_active_sessions             | 最大活动会话数。                                                |
| shutdown_wait_timeout_ms        | 等待的超时时间，单位为毫秒。                                    |
| flight_api_address              | 监听 Databend-Query 集群 shuffle 数据的 IP 地址和端口。         |
| admin_api_address               | Admin REST API 的地址。                                         |
| metric_api_address              | Metrics REST API 的地址。                                       |
| mysql_handler_host              | MySQL 查询处理程序的主机名。                                    |
| mysql_handler_port              | MySQL 查询处理程序的端口。                                      |
| clickhouse_http_handler_host    | ClickHouse HTTP 查询处理程序的主机名。                          |
| clickhouse_http_handler_port    | ClickHouse HTTP 查询处理程序的端口。                            |
| http_handler_host               | HTTP API 查询处理程序的主机名。                                 |
| http_handler_port               | HTTP API 查询处理程序的端口。                                   |
| flight_sql_handler_host         | 实验性 Arrow Flight SQL API 查询处理程序的主机名。              |
| flight_sql_handler_port         | 实验性 Arrow Flight SQL API 查询处理程序的端口。                |
| tenant_id                       | 默认租户 ID。                                                   |
| cluster_id                      | 默认集群 ID。                                                   |
| table_engine_memory_enabled     | 启用 Memory 表引擎的标志。                                      |
| max_running_queries             | 可以同时执行的最大查询数，默认为 8，0 表示无限制。              |
| data_retention_time_in_days_max | 设置 `data_retention_time_in_days` 设置的上限，默认值为 90 天。 |

### [query.users] 部分

以下是 [[query.users]] 部分中可用的参数列表。有关配置管理员用户的更多信息，请参阅[配置管理员用户](../01-admin-users.md)。

| 参数        | 描述                                                                   |
| ----------- | ---------------------------------------------------------------------- |
| name        | 用户名。                                                               |
| auth_type   | 认证类型（例如，no_password, double_sha1_password, sha256_password）。 |
| auth_string | 认证字符串（例如，密码的 SHA-1 或 SHA-256 哈希）。                     |

### [query.settings] 部分

以下是 [query.settings] 部分中可用的参数列表。

| 参数                            | 描述                                                                                                                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| aggregate_spilling_memory_ratio | 控制聚合操作期间将数据溢出到磁盘的阈值。当内存使用量超过总可用内存的此百分比时，数据将被溢出到对象存储以避免内存耗尽。示例：如果设置为 60，则在内存使用量超过 60% 时发生溢出。 |
| join_spilling_memory_ratio      | 控制连接操作期间将数据溢出到磁盘的阈值。当内存使用量超过总可用内存的此百分比时，数据将被溢出到对象存储以避免内存耗尽。示例：如果设置为 60，则在内存使用量超过 60% 时发生溢出。 |

## [log] 部分

此部分可以包括三个子部分：[log.file]、[log.stderr]、[log.query] 和 [log.tracing]。

### [log.file] 部分

以下是 [log.file] 部分中可用的参数列表：

| 参数   | 描述                                          |
| ------ | --------------------------------------------- |
| on     | 启用或禁用文件日志记录。默认为 true。         |
| dir    | 存储日志文件的路径。                          |
| level  | 日志级别：DEBUG、INFO 或 ERROR。默认为 INFO。 |
| format | 日志格式：json 或 text。默认为 json。         |
| limit  | 确定要保留的最大日志文件数。默认为 48。       |

### [log.stderr] 部分

以下是 [log.stderr] 部分中可用的参数列表：

| 参数   | 描述                                           |
| ------ | ---------------------------------------------- |
| on     | 启用或禁用 stderr 日志记录。默认为 false。     |
| level  | 日志级别：DEBUG、INFO 或 ERROR。默认为 DEBUG。 |
| format | 日志格式：json 或 text。默认为 text。          |

### [log.query] 部分

以下是 [log.query] 部分中可用的参数列表：

| 参数 | 描述                                                                                                 |
| ---- | ---------------------------------------------------------------------------------------------------- |
| on   | 启用将查询执行详细信息记录到日志目录中的 query-details 文件夹。默认为 on。在存储空间有限时考虑禁用。 |

### [log.tracing] 部分

以下是 [log.tracing] 部分中可用的参数列表：

| Parameter                     | Description                                                                                                                                             |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket                        | The name of the S3 bucket used for storage.                                                                                                             |
| region                        | The region where the S3 bucket is located.                                                                                                              |
| endpoint_url                  | The endpoint URL for the S3 service. If you are using a custom S3-compatible service, you can specify the endpoint URL here.                            |
| access_key_id                 | The access key ID for authenticating with the S3 service.                                                                                               |
| secret_access_key             | The secret access key for authenticating with the S3 service.                                                                                           |
| use_aws_sdk_default_behavior  | Defaults to false. Set it to true to use the AWS SDK default behavior for S3 authentication.                                                            |
| use_virtual_addressing        | Defaults to true. Set it to false if you want to use path-style addressing instead of virtual-hosted-style addressing for S3 bucket access.             |
| disable_credential_loader     | Defaults to false. Set it to true to disable the AWS SDK credential loader, which is useful when you want to manage credentials manually.               |
| force_path_style              | Defaults to false. Set it to true to force the use of path-style addressing for S3 bucket access, even if virtual-hosted-style addressing is available. |
| auto_switch_region            | Defaults to false. Set it to true to enable automatic region switching for S3 bucket access.                                                            |
| enable_ssl                    | Defaults to true. Set it to false to disable SSL for S3 bucket access.                                                                                  |
| enable_virtual_host_bucketing | Defaults to true. Set it to false to disable virtual host bucketing for S3 bucket access.                                                               |
| max_read_capacity             | The maximum read capacity for S3 bucket access.                                                                                                         |
| min_read_capacity             | The minimum read capacity for S3 bucket access.                                                                                                         |
| max_write_capacity            | The maximum write capacity for S3 bucket access.                                                                                                        |
| min_write_capacity            | The minimum write capacity for S3 bucket access.                                                                                                        |
| read_replicas                 | The number of read replicas for S3 bucket access.                                                                                                       |
| write_replicas                | The number of write replicas for S3 bucket access.                                                                                                      |
| read_timeout                  | The read timeout for S3 bucket access.                                                                                                                  |
| write_timeout                 | The write timeout for S3 bucket access.                                                                                                                 |
| connect_timeout               | The connect timeout for S3 bucket access.                                                                                                               |
| retry_count                   | The number of retries for S3 bucket access.                                                                                                             |
| retry_backoff_millis          | The backoff time in milliseconds between retries for S3 bucket access.                                                                                  |
| max_retry_backoff_millis      | The maximum backoff time in milliseconds between retries for S3 bucket access.                                                                          |
| enable_md5_checksum           | Defaults to true. Set it to false to disable MD5 checksum for S3 bucket access.                                                                         |
| enable_crc32_checksum         | Defaults to true. Set it to false to disable CRC32 checksum for S3 bucket access.                                                                       |
| enable_sha256_checksum        | Defaults to true. Set it to false to disable SHA256 checksum for S3 bucket access.                                                                      |
| enable_sha512_checksum        | Defaults to true. Set it to false to disable SHA512 checksum for S3 bucket access.                                                                      |
| enable_sha1_checksum          | Defaults to true. Set it to false to disable SHA1 checksum for S3 bucket access.                                                                        |
| enable_sha224_checksum        | Defaults to true. Set it to false to disable SHA224 checksum for S3 bucket access.                                                                      |
| enable_sha384_checksum        | Defaults to true. Set it to false to disable SHA384 checksum for S3 bucket access.                                                                      |
| enable_sha512_224_checksum    | Defaults to true. Set it to false to disable SHA512/224 checksum for S3 bucket access.                                                                  |
| enable_sha512_256_checksum    | Defaults to true. Set it to false to disable SHA512/256 checksum for S3 bucket access.                                                                  |
| enable_sha3_224_checksum      | Defaults to true. Set it to false to disable SHA3-224 checksum for S3 bucket access.                                                                    |
| enable_sha3_256_checksum      | Defaults to true. Set it to false to disable SHA3-256 checksum for S3 bucket access.                                                                    |
| enable_sha3_384_checksum      | Defaults to true. Set it to false to disable SHA3-384 checksum for S3 bucket access.                                                                    |
| enable_sha3_512_checksum      | Defaults to true. Set it to false to disable SHA3-512 checksum for S3 bucket access.                                                                    |
| enable_blake2b_checksum       | Defaults to true. Set it to false to disable BLAKE2b checksum for S3 bucket access.                                                                     |
| enable_blake2s_checksum       | Defaults to true. Set it to false to disable BLAKE2s checksum for S3 bucket access.                                                                     |
| enable_blake3_checksum        | Defaults to true. Set it to false to disable BLAKE3 checksum for S3 bucket access.                                                                      |
| enable_keccak_checksum        | Defaults to true. Set it to false to disable Keccak checksum for S3 bucket access.                                                                      |
| enable_ripemd160_checksum     | Defaults to true. Set it to false to disable RIPEMD-160 checksum for S3 bucket access.                                                                  |
| enable_whirlpool_checksum     | Defaults to true. Set it to false to disable Whirlpool checksum for S3 bucket access.                                                                   |
| enable_tiger_checksum         | Defaults to true. Set it to false to disable Tiger checksum for S3 bucket access.                                                                       |
| enable_snefru_checksum        | Defaults to true. Set it to false to disable Snefru checksum for S3 bucket access.                                                                      |
| enable_gost_checksum          | Defaults to true. Set it to false to disable GOST checksum for S3 bucket access.                                                                        |
| enable_haval_checksum         | Defaults to true. Set it to false to disable HAVAL checksum for S3 bucket access.                                                                       |
| enable_md4_checksum           | Defaults to true. Set it to false to disable MD4 checksum for S3 bucket access.                                                                         |
| enable_md2_checksum           | Defaults to true. Set it to false to disable MD2 checksum for S3 bucket access.                                                                         |
| enable_adler32_checksum       | Defaults to true. Set it to false to disable Adler32 checksum for S3 bucket access.                                                                     |
| enable_crc32c_checksum        | Defaults to true. Set it to false to disable CRC32C checksum for S3 bucket access.                                                                      |
| enable_fnv_checksum           | Defaults to true. Set it to false to disable FNV checksum for S3 bucket access.                                                                         |
| enable_murmur3_checksum       | Defaults to true. Set it to false to disable Murmur3 checksum for S3 bucket access.                                                                     |
| enable_siphash_checksum       | Defaults to true. Set it to false to disable SipHash checksum for S3 bucket access.                                                                     |
| enable_xxhash_checksum        | Defaults to true. Set it to false to disable XXHash checksum for S3 bucket access.                                                                      |
| enable_cityhash_checksum      | Defaults to true. Set it to false to disable CityHash checksum for S3 bucket access.                                                                    |
| enable_farmhash_checksum      | Defaults to true. Set it to false to disable FarmHash checksum for S3 bucket access.                                                                    |
| enable_metrohash_checksum     | Defaults to true. Set it to false to disable MetroHash checksum for S3 bucket access.                                                                   |
| enable_sm3_checksum           | Defaults to true. Set it to false to disable SM3 checksum for S3 bucket access.                                                                         |
| enable_shake128_checksum      | Defaults to true. Set it to false to disable SHAKE128 checksum for S3 bucket access.                                                                    |
| enable_shake256_checksum      | Defaults to true. Set it to false to disable SHAKE256 checksum for S3 bucket access.                                                                    |
| enable_blake2bp_checksum      | Defaults to true. Set it to false to disable BLAKE2bp checksum for S3 bucket access.                                                                    |
| enable_blake2sp_checksum      | Defaults to true. Set it to false to disable BLAKE2sp checksum for S3 bucket access.                                                                    |
| enable_blake2b_160_checksum   | Defaults to true. Set it to false to disable BLAKE2b-160 checksum for S3 bucket access.                                                                 |
| enable_blake2b_256_checksum   | Defaults to true. Set it to false to disable BLAKE2b-256 checksum for S3 bucket access.                                                                 |
| enable_blake2b_384_checksum   | Defaults to true. Set it to false to disable BLAKE2b-384 checksum for S3 bucket access.                                                                 |
| enable_blake2b_512_checksum   | Defaults to true. Set it to false to disable BLAKE2b-512 checksum for S3 bucket access.                                                                 |
| enable_blake2s_128_checksum   | Defaults to true. Set it to false to disable BLAKE2s-128 checksum for S3 bucket access.                                                                 |
| enable_blake2s_160_checksum   | Defaults to true. Set it to false to disable BLAKE2s-160 checksum for S3 bucket access.                                                                 |
| enable_blake2s_224_checksum   | Defaults to true. Set it to false to disable BLAKE2s-224 checksum for S3 bucket access.                                                                 |
| enable_blake2s_256_checksum   | Defaults to true. Set it to false to disable BLAKE2s-256 checksum for S3 bucket access.                                                                 |
| enable_blake2s_384_checksum   | Defaults to true. Set it to false to disable BLAKE2s-384 checksum for S3 bucket access.                                                                 |
| enable_blake2s_512_checksum   | Defaults to true. Set it to false to disable BLAKE2s-512 checksum for S3 bucket access.                                                                 |
| enable_blake3_128_checksum    | Defaults to true. Set it to false to disable BLAKE3-128 checksum for S3 bucket access.                                                                  |
| enable_blake3_160_checksum    | Defaults to true. Set it to false to disable BLAKE3-160 checksum for S3 bucket access.                                                                  |
| enable_blake3_224_checksum    | Defaults to true. Set it to false to disable BLAKE3-224 checksum for S3 bucket access.                                                                  |
| enable_blake3_256_checksum    | Defaults to true. Set it to false to disable BLAKE3-256 checksum for S3 bucket access.                                                                  |
| enable_blake3_384_checksum    | Defaults to true. Set it to false to disable BLAKE3-384 checksum for S3 bucket access.                                                                  |
| enable_blake3_512_checksum    | Defaults to true. Set it to false to disable BLAKE3-512 checksum for S3 bucket access.                                                                  |
| enable_blake3_128_checksum    | Defaults to true. Set it to false to disable BLAKE3-128 checksum for S3 bucket access.                                                                  |
| enable_blake3_160_checksum    | Defaults to true. Set it to false to disable BLAKE3-160 checksum for S3 bucket access.                                                                  |
| enable_blake3_224_checksum    | Defaults to true. Set it to false to disable BLAKE3-224 checksum for S3 bucket access.                                                                  |
| enable_blake3_256_checksum    | Defaults to true. Set it to false to disable BLAKE3-256 checksum for S3 bucket access.                                                                  |
| enable_blake3_384_checksum    | Defaults to true. Set it to false to disable BLAKE3-384 checksum for S3 bucket access.                                                                  |
| enable_blake3_512_checksum    | Defaults to true. Set it to false to disable BLAKE3-512 checksum for S3 bucket access.                                                                  |
| enable_blake3_128_checksum    | Defaults to true. Set it to false to disable BLAKE3-128 checksum for S3 bucket access.                                                                  |
| enable_blake3_160_checksum    | Defaults to true. Set it to false to disable BLAKE3-160 checksum for S3 bucket access.                                                                  |
| enable_blake3_224_checksum    | Defaults to true. Set it to false to disable BLAKE3-224 checksum for S3 bucket access.                                                                  |
| enable_blake3_256_checksum    | Defaults to true. Set it to false to disable BLAKE3-256 checksum for S3 bucket access.                                                                  |
| enable_blake3_384_checksum    | Defaults to true. Set it to false to disable BLAKE3-384 checksum for S3 bucket access.                                                                  |
| enable_blake3_512_checksum    | Defaults to true. Set it to false to disable BLAKE3-512 checksum for S3 bucket access.                                                                  |
| enable_blake3_128_checksum    | Defaults to true. Set it to false to disable BLAKE3-128 checksum for S3 bucket access.                                                                  |
| enable_blake3_160_checksum    | Defaults to true. Set it to false to disable BLAKE3-160 checksum for S3 bucket access.                                                                  |
| enable_blake3_224_checksum    | Defaults to true. Set it to false to disable BLAKE3-224 checksum for S3 bucket access.                                                                  |
| enable_blake3_256_checksum    | Defaults to true. Set it to false to disable BLAKE3-256 checksum for S3 bucket access.                                                                  |
| enable_blake3_384_checksum    | Defaults to true. Set it to false to disable BLAKE3-384 checksum for S3 bucket access.                                                                  |
| enable_blake3_512_checksum    | Defaults to true. Set it to false to disable BLAKE3-512 checksum for S3 bucket access.                                                                  |
| enable_blake3_128_checksum    | Defaults to true. Set it to false to disable BLAKE3-128 checksum for S3 bucket access.                                                                  |
| enable_blake3_160_checksum    | Defaults to true. Set it to false to disable BLAKE3-160 checksum for S3 bucket access.                                                                  |
| enable_blake3_224_checksum    | Defaults to true. Set it to false to disable BLAKE3-224 checksum for S3 bucket access.                                                                  |
| enable_blake3_256_checksum    | Defaults to true. Set it to false to disable BLAKE3-256 checksum for S3 bucket access.                                                                  |
| enable_blake3_384_checksum    | Defaults to true. Set it to false to disable BLAKE3-384 checksum for S3 bucket access.                                                                  |
| enable_blake3_512_checksum    | Defaults to true. Set it to false to disable BLAKE3-512 checksum for S3 bucket access.                                                                  |
| enable_blake3_128_checksum    | Defaults to true. Set it to false to disable BLAKE3-128 checksum for S3 bucket access.                                                                  |
| enable_blake3_160_checksum    | Defaults to true. Set it to false to disable BLAKE3-160 checksum for S3 bucket access.                                                                  |
| enable_blake3_224_checksum    | Defaults to true. Set it to false to disable BLAKE3-224 checksum for S3 bucket access.                                                                  |
| enable_blake3_256_checksum    | Defaults to true. Set it to false to disable BLAKE3-256 checksum for S3 bucket access.                                                                  |
| enable_blake3_384_checksum    | Defaults to true. Set it to false to disable BLAKE3-384 checksum for S3 bucket access.                                                                  |
| enable_blake3_512_checksum    | Defaults to true. Set it to false to disable BLAKE3-512 checksum for S3 bucket access.                                                                  |
| enable_blake3_128_checksum    | Defaults to true. Set it to false to disable BLAKE3-128 checksum for S3 bucket access.                                                                  |
| enable_blake3_160_checksum    | Defaults to true. Set it to false to disable BLAKE3-160 checksum for S3 bucket access.                                                                  |
| enable_blake3_224_checksum    | Defaults to true. Set it to false to disable BLAKE3-224 checksum for S3 bucket access.                                                                  |
| enable_blake3_256_checksum    | Defaults to true. Set it to                                                                                                                             |

| 参数                      | 描述                                                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| bucket                    | 您的 Amazon S3 兼容存储桶的名称。                                                                                         |
| endpoint_url              | S3 兼容存储服务的 URL 端点。默认为 "https://s3.amazonaws.com"。                                                           |
| access_key_id             | 用于与存储服务进行身份验证的访问密钥 ID。                                                                                 |
| secret_access_key         | 用于与存储服务进行身份验证的秘密访问密钥。                                                                                |
| enable_virtual_host_style | 布尔标志，指示是否启用虚拟主机样式寻址。                                                                                  |
| external_id               | 用于身份验证的外部 ID。                                                                                                   |
| master_key                | 用于身份验证的主密钥。                                                                                                    |
| region                    | S3 兼容存储服务的区域。                                                                                                   |
| role_arn                  | 用于身份验证的 ARN（Amazon 资源名称）。                                                                                   |
| root                      | 指定 Databend 将从中操作的存储桶内的目录。示例：如果存储桶的根目录中有一个名为 `myroot` 的文件夹，则 `root = "myroot/"`。 |
| security_token            | 用于身份验证的安全令牌。                                                                                                  |

### [storage.azblob] 部分

以下是 [storage.azblob] 部分中可用的参数列表：

| 参数         | 描述                                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| endpoint_url | Azure Blob 存储的 URL 端点（例如，`https://<your-storage-account-name>.blob.core.windows.net`）。                         |
| container    | 您的 Azure 存储容器的名称。                                                                                               |
| account_name | 您的 Azure 存储账户的名称。                                                                                               |
| account_key  | 用于与 Azure Blob 存储进行身份验证的账户密钥。                                                                            |
| root         | 指定 Databend 将从中操作的存储桶内的目录。示例：如果存储桶的根目录中有一个名为 `myroot` 的文件夹，则 `root = "myroot/"`。 |

### [storage.gcs] 部分

以下是 [storage.gcs] 部分中可用的参数列表：

| 参数       | 描述                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------- |
| bucket     | 您的 Google Cloud Storage 存储桶的名称。                                                                                  |
| credential | 用于 Google Cloud Storage 身份验证的服务账户密钥文件的 base64 编码。                                                      |
| root       | 指定 Databend 将从中操作的存储桶内的目录。示例：如果存储桶的根目录中有一个名为 `myroot` 的文件夹，则 `root = "myroot/"`。 |

要获取 `credential`，您可以按照 Google 文档中的主题 [创建服务账户密钥](https://cloud.google.com/iam/docs/keys-create-delete#creating) 来创建并下载服务账户密钥文件。下载服务账户密钥文件后，您可以通过以下命令将其转换为 base64 字符串：

```
base64 -i -o ~/Desktop/base64-encoded-key.txt
```

### [storage.oss] 部分

以下是 [storage.oss] 部分中可用的参数列表：

| 参数                 | 描述                                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| bucket               | 您的阿里云 OSS 存储桶的名称。                                                                                             |
| endpoint_url         | 阿里云 OSS 的 URL 端点。                                                                                                  |
| access_key_id        | 用于与阿里云 OSS 进行身份验证的访问密钥 ID。                                                                              |
| access_key_secret    | 用于与阿里云 OSS 进行身份验证的访问密钥密钥。                                                                             |
| presign_endpoint_url | 用于阿里云 OSS 预签名操作的 URL 端点。                                                                                    |
| root                 | 指定 Databend 将从中操作的存储桶内的目录。示例：如果存储桶的根目录中有一个名为 `myroot` 的文件夹，则 `root = "myroot/"`。 |

<LanguageDocs
cn=
'

### [storage.obs] 部分

以下是 [storage.obs] 部分中可用的参数列表：

| 参数              | 描述                                          |
| ----------------- | --------------------------------------------- |
| bucket            | 您的华为云 OBS 桶的 名称。                    |
| endpoint_url      | 华为云 OBS 的 URL 端点。                      |
| access_key_id     | 用于与华为云 OBS 进行身份验证的访问密钥 ID。  |
| secret_access_key | 用于与华为云 OBS 进行身份验证的访问密钥秘密。 |

'/>

### [storage.cos] 部分

以下是 [storage.cos] 部分中可用的参数列表：

| 参数         | 描述                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------- |
| bucket       | 您的腾讯云对象存储（COS）桶的名称。                                                                           |
| endpoint_url | 腾讯云 COS 的 URL 端点（可选）。                                                                              |
| secret_id    | 用于与腾讯云 COS 进行身份验证的密钥 ID。                                                                      |
| secret_key   | 用于与腾讯云 COS 进行身份验证的密钥。                                                                         |
| root         | 指定 Databend 将在桶内操作的目录。例如：如果桶的根目录有一个名为 `myroot` 的文件夹，那么 `root = "myroot/"`。 |

### [storage.hdfs] 部分

以下是 [storage.hdfs] 部分中可用的参数列表：

| 参数      | 描述                                          |
| --------- | --------------------------------------------- |
| name_node | Hadoop 分布式文件系统（HDFS）的名称节点地址。 |
| root      | 指定 Databend 将操作的目录。                  |

### [storage.webhdfs] 部分

以下是 [storage.webhdfs] 部分中可用的参数列表：

| 参数         | 描述                                          |
| ------------ | --------------------------------------------- |
| endpoint_url | WebHDFS（Hadoop 分布式文件系统）的 URL 端点。 |
| root         | 指定 Databend 将操作的目录。                  |
| delegation   | 用于身份验证和授权的委托令牌。                |

## [cache] 部分

以下是 [cache] 部分中可用的参数列表：

| 参数               | 描述                                                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| data_cache_storage | 用于表数据缓存的存储类型。可用选项："none"（禁用表数据缓存），"disk"（启用磁盘缓存）。默认为 "none"。 |

### [cache.disk] 部分

以下是 [cache.disk] 部分中可用的参数列表：

| 参数      | 描述                                                                     |
| --------- | ------------------------------------------------------------------------ |
| path      | 使用磁盘缓存时，缓存存储的路径。                                         |
| max_bytes | 使用磁盘缓存时，缓存数据的最大字节数。默认为 21474836480 字节（20 GB）。 |
