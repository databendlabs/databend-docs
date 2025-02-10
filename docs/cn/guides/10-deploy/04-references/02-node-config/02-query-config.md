---
title: 查询配置
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import LanguageDocs from '@site/src/components/LanguageDocs';

<FunctionDescription description="引入或更新于：v1.2.344"/>

本文档描述了配置文件 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 中可用的查询节点配置项。

- 下表列出的部分参数可能未包含在 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 中。如需使用这些参数，可手动添加至文件。

- 您可以在 GitHub 上找到为不同部署环境设置的[示例配置文件](https://github.com/databendlabs/databend/tree/main/scripts/ci/deploy/config)。这些文件仅用于内部测试，请勿自行修改。但若您有类似部署需求，可参考这些文件来编辑自己的配置文件。

## [query] 部分

以下是 [query] 部分可用的参数列表：

| 参数                          | 描述                                                                                                 |
| ----------------------------- | --------------------------------------------------------------------------------------------------- |
| max_active_sessions           | 最大活跃会话数。                                                                                   |
| shutdown_wait_timeout_ms      | 等待超时时间（毫秒）。                                                                             |
| flight_api_address            | 监听 Databend-Query 集群数据交换的 IP 地址及端口。                                                 |
| admin_api_address             | 管理 REST API 地址。                                                                               |
| metric_api_address            | 指标 REST API 地址。                                                                               |
| mysql_handler_host            | MySQL 查询处理器主机名。                                                                           |
| mysql_handler_port            | MySQL 查询处理器端口。                                                                             |
| clickhouse_http_handler_host  | ClickHouse HTTP 查询处理器主机名。                                                                 |
| clickhouse_http_handler_port  | ClickHouse HTTP 查询处理器端口。                                                                   |
| http_handler_host             | HTTP API 查询处理器主机名。                                                                        |
| http_handler_port             | HTTP API 查询处理器端口。                                                                          |
| flight_sql_handler_host       | 实验性 Arrow Flight SQL API 查询处理器主机名。                                                     |
| flight_sql_handler_port       | 实验性 Arrow Flight SQL API 查询处理器端口。                                                       |
| tenant_id                     | 默认租户 ID。                                                                                      |
| cluster_id                    | 默认集群 ID。                                                                                      |
| table_engine_memory_enabled   | 是否启用 Memory 表引擎。                                                                           |
| max_running_queries           | 可同时执行的最大查询数，默认 8，0 表示无限制。                                                     |
| data_retention_time_in_days_max | 设置 `data_retention_time_in_days` 参数的上限，默认值 90 天。                                      |

### [query.users] 部分

以下是 [[query.users]] 部分可用的参数列表。关于配置管理员用户的更多信息，请参阅[配置管理员用户](../01-admin-users.md)。

| 参数        | 描述                                                                     |
| ----------- | ----------------------------------------------------------------------- |
| name        | 用户名。                                                                |
| auth_type   | 认证类型（如 no_password、double_sha1_password、sha256_password）。     |
| auth_string | 认证字符串（如密码的 SHA-1 或 SHA-256 哈希值）。                        |

### [query.settings] 部分

以下是 [query.settings] 部分可用的参数列表。

| 参数                             | 描述                                                                                                                                                                                                                   |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| aggregate_spilling_memory_ratio  | 控制聚合操作时数据落盘的阈值。当内存使用超过总可用内存的该百分比时，数据将溢出到对象存储以避免内存耗尽。例如：设置为 60 时，内存使用超过 60% 将触发落盘。                                                             |
| join_spilling_memory_ratio       | 控制连接操作时数据落盘的阈值。当内存使用超过总可用内存的该百分比时，数据将溢出到对象存储以避免内存耗尽。例如：设置为 60 时，内存使用超过 60% 将触发落盘。                                                             |

## [log] 部分

该部分可包含四个子部分：[log.file]、[log.stderr]、[log.query] 和 [log.tracing]。

### [log.file] 部分

以下是 [log.file] 部分可用的参数列表：

| 参数    | 描述                                                                 |
| ------- | ------------------------------------------------------------------- |
| on      | 启用或禁用文件日志记录。默认为 true。                               |
| dir     | 日志文件存储路径。                                                  |
| level   | 日志级别：DEBUG、INFO 或 ERROR。默认为 INFO。                       |
| format  | 日志格式：json 或 text。默认为 json。                               |
| limit   | 最大保留日志文件数。默认为 48。                                     |

### [log.stderr] 部分

以下是 [log.stderr] 部分可用的参数列表：

| 参数    | 描述                                                |
| ------- | -------------------------------------------------- |
| on      | 启用或禁用标准错误日志记录。默认为 false。          |
| level   | 日志级别：DEBUG、INFO 或 ERROR。默认为 DEBUG。      |
| format  | 日志格式：json 或 text。默认为 text。               |

### [log.query] 部分

以下是 [log.query] 部分可用的参数列表：

| 参数    | 描述                                                                                                                             |
| ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| on      | 启用将查询执行详情记录到日志目录的 query-details 文件夹。默认为启用。当存储空间有限时可考虑禁用。                                |

### [log.tracing] 部分

以下是 [log.tracing] 部分可用的参数列表：

<think>
好的，我现在需要处理用户提供的关于Databend配置参数的表格翻译任务。首先，我要仔细阅读用户提供的规则，确保完全理解所有的要求。用户特别强调要保持Markdown结构不变，不添加或删除链接，保留原始换行和空白行，不处理HTML标签如<Notes>，以及保留特定的技术术语不翻译，比如“Databend Cloud”、“Vector”等。此外，还有一些特定的词汇翻译要求，比如“time travel”要翻译为“时间回溯”，“warehouse”翻译为“计算集群”等。

接下来，我会逐一处理每个表格中的参数和描述。首先检查参数名称是否需要翻译，通常参数名保持原样，但描述部分需要准确翻译。例如，“capture_log_level”的参数描述需要翻译成中文，同时保留原有的技术术语，如“DEBUG, TRACE, INFO, WARN, or ERROR”不需要翻译。同时要注意用户提到的“Self-Hosted”要翻译为“私有化部署”，而“基础版”对应“Personal”计划。

在处理每个表格时，要确保不改变Markdown的格式，比如表格的分隔线和结构。例如，第一行的表头“Parameter”和“Description”需要翻译为“参数”和“描述”，但保持表格的对齐和结构不变。同时，注意代码块内的内容如默认值`http://127.0.0.1:4317`不能做任何修改，即使存在可能的错误。

对于[meta]和[storage]部分的各个子节，需要确保每个子节的标题正确翻译，例如“[meta] Section”翻译为“[meta] 部分”，并保持原有的链接结构，如permalink不进行任何改动。在翻译参数描述时，要注意技术细节的准确性，例如“endpoints”参数中的示例IP地址和端口要保持原样，不进行任何修改。

在处理“storage”部分时，特别注意“type”参数的可能值如fs, s3, azblob等不需要翻译，保持原样。同时，“allow_insecure”参数的描述中提到在MinIO部署时需要设置为true，这部分需要准确传达给用户，避免翻译错误导致配置问题。

最后，检查整个翻译后的文档，确保所有Markdown格式正确，没有遗漏任何参数或描述，技术术语处理得当，符合用户的所有要求。特别是要确认没有添加或删除任何内容，保持与原文完全一致的结构和内容，仅进行必要的翻译调整。
</think>

| 参数             | 描述                                                                                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| capture_log_level | 设置执行期间捕获跟踪的日志级别（DEBUG、TRACE、INFO、WARN 或 ERROR）。                                                                                 |
| on                | 控制是否启用跟踪。默认值为 'false' 表示禁用。设置为 'true' 以启用跟踪。                                                                               |
| otlp_endpoint     | 指定 OpenTelemetry Protocol (OTLP) 的跟踪端点。默认为 `http://127.0.0.1:4317`，可替换为所需的 OTLP 端点。                                             |

## [meta] 部分 {/*meta-section*/}

以下是 [meta] 部分可用的参数列表：

| 参数                          | 描述                                                                                                                                                                                                                                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| username                      | 用于连接 Meta 服务的用户名。默认："root"。                                                                                                                                                                                                                                                                    |
| password                      | 用于连接 Meta 服务的密码。Databend 建议使用环境变量 META_PASSWORD 提供密码。默认："root"。                                                                                                                                                                                                                   |
| endpoints                     | 设置此查询服务器可连接的一个或多个元服务器端点。为增强 Meta 连接的健壮性，建议尽可能包含集群内的多个元服务器作为备份。示例：["192.168.0.1:9191", "192.168.0.2:9191"]。默认：["0.0.0.0:9191"]。                                                                                                              |
| client_timeout_in_second      | 设置终止尝试连接元服务器前的等待时间（秒）。默认：60。                                                                                                                                                                                                                                                        |
| auto_sync_interval            | 设置此查询服务器应自动从集群内的元服务器同步端点的频率（秒）。启用后，Databend-query 会定期联系 Databend-meta 服务器以获取 grpc_api_advertise_host:grpc-api-port 列表。要禁用同步，请设置为 0。默认：60。                                                                                                     |
| unhealth_endpoint_evict_time  | 内部时间（秒），用于不查询不健康的元节点端点。默认：120。                                                                                                                                                                                                                                                     |

## [storage] 部分 {/*storage-section*/}

以下是 [storage] 部分可用的参数列表：

| 参数           | 描述                                                                                                                                                                                                                                          |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type           | 使用的存储类型。可选值：fs, s3, azblob, gcs, oss, cos, hdfs, webhdfs。                                                                                                                                                                       |
| allow_insecure | 默认值为 false。在 MinIO 上部署 Databend 或通过 `http://` 前缀的 URL 加载数据时需设置为 true，否则可能遇到错误："copy from insecure storage is not allowed. Please set `allow_insecure=true`"。                                             |

### [storage.fs] 部分 {/*storagefs-section*/}

以下是 [storage.fs] 部分可用的参数列表：

| 参数       | 描述                          |
| ---------- | ---------------------------- |
| data_path  | 数据存储位置的路径。           |

### [storage.s3] 部分 {/*storages3-section*/}

以下是 [storage.s3] 部分可用的参数列表：

<think>
好的，我现在需要处理用户提供的关于Databend存储配置的Markdown表格，并将其翻译成简体中文。首先，我要仔细阅读用户提供的规则，确保翻译过程中严格遵守这些要求。

首先，用户强调不能改变Markdown的结构，包括链接和代码块。因此，我需要确保所有的表格结构、参数名称以及代码示例都保持原样，仅翻译描述部分。例如，参数名称如“bucket”或“endpoint_url”不需要翻译，而描述部分需要准确翻译。

接下来，用户提到特定的术语需要保持不译，比如“时间旅行”要翻译为“时间回溯”，“warehouse”翻译为“计算集群”，“Data Warehouse”翻译为“数仓”，“Self-Hosted”翻译为“私有化部署”，而“Databend Cloud”、“Vector”、“Stage”则保持英文。我需要特别注意这些术语的正确转换，避免误译。

在处理JSON文件时，用户指出键（key）不需要翻译，但值可能需要。不过当前内容中没有涉及JSON部分，但需要留意后续可能的任务。此外，用户提到如果遇到描述“Personal”计划的部分，应翻译为“基础版”，但当前内容中没有相关部分，暂时不需要处理。

在翻译表格中的描述时，要确保技术术语的准确性。例如，“virtual host-style addressing”需要正确翻译为“虚拟主机风格寻址”，同时保持语句通顺。对于代码块，如base64命令示例，必须保留原样，不进行任何修改。

用户还要求保留原有的换行和空白行，因此翻译过程中需要注意不要合并或拆分段落。同时，HTML标签如<Notes>和permalink如{/*examples*/}也不能改动，需保持原样。

在翻译过程中，可能会遇到一些长句，需要拆分以确保可读性，同时保持原意。例如，关于root参数的描述，需要准确说明目录结构，避免歧义。此外，对于Google Cloud Storage的credential获取步骤，需确保翻译后的指令清晰易懂，符合中文用户的阅读习惯。

最后，检查整个翻译结果，确保没有遗漏任何参数，所有术语符合规范，格式与原文一致。特别是注意表格的对齐和代码块的正确保留，避免因格式错误导致渲染问题。完成初稿后，通读一遍，修正可能的语法错误或不通顺之处，确保翻译质量。
</think>

### [storage.azblob] 配置项

以下是 [storage.azblob] 配置项下可用的参数列表：

| 参数          | 描述                                                                                                                                                            |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| endpoint_url  | Azure Blob Storage 的 URL 端点（例如：`https://<your-storage-account-name>.blob.core.windows.net`）。                                                          |
| container     | Azure 存储容器的名称。                                                                                                                                         |
| account_name  | Azure 存储账户的名称。                                                                                                                                         |
| account_key   | 用于 Azure Blob Storage 认证的账户密钥。                                                                                                                       |
| root          | 指定存储桶内 Databend 操作的根目录。例如：若存储桶根目录下存在名为 `myroot` 的文件夹，则设置为 `root = "myroot/"`。                                             |

### [storage.gcs] 配置项

以下是 [storage.gcs] 配置项下可用的参数列表：

| 参数        | 描述                                                                                                                                                            |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket      | Google 云存储桶的名称。                                                                                                                                        |
| credential  | 经过 Base64 编码的 Google 云存储服务账户密钥文件。                                                                                                              |
| root        | 指定存储桶内 Databend 操作的根目录。例如：若存储桶根目录下存在名为 `myroot` 的文件夹，则设置为 `root = "myroot/"`。                                             |

要获取 `credential` 参数值，请参考 Google 文档中的 [创建服务账户密钥](https://cloud.google.com/iam/docs/keys-create-delete#creating) 主题创建并下载服务账户密钥文件。下载完成后，可通过以下命令将其转换为 Base64 字符串：

```
base64 -i -o ~/Desktop/base64-encoded-key.txt
```

### [storage.oss] 配置项

以下是 [storage.oss] 配置项下可用的参数列表：

| 参数                 | 描述                                                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bucket               | 阿里云 OSS 存储桶的名称。                                                                                                                                      |
| endpoint_url         | 阿里云 OSS 的 URL 端点。                                                                                                                                       |
| access_key_id        | 用于阿里云 OSS 认证的访问密钥 ID。                                                                                                                             |
| access_key_secret    | 用于阿里云 OSS 认证的访问密钥。                                                                                                                                |
| presign_endpoint_url | 阿里云 OSS 预签名操作的 URL 端点。                                                                                                                             |
| root                 | 指定存储桶内 Databend 操作的根目录。例如：若存储桶根目录下存在名为 `myroot` 的文件夹，则设置为 `root = "myroot/"`。                                             |

<LanguageDocs
cn=
'

### [storage.obs] 配置项

<think>
好的，我需要将用户提供的关于Databend配置参数的英文文档翻译成简体中文。首先，我要仔细阅读用户提供的规则，确保翻译过程中严格遵守这些要求。

首先，用户强调不能改变Markdown的结构，包括链接和代码块。因此，我需要确保表格的结构、参数名称以及任何URL或格式都保持原样。例如，参数名称如“bucket”或“endpoint_url”不需要翻译，保持英文即可。

接下来，用户提到了特定的术语翻译规则。例如，“time travel”要翻译为“时间回溯”，“warehouse”翻译为“计算集群”，“Self-Hosted”翻译为“私有化部署”，而“Databend Cloud”、“Vector”、“Stage”等则保持不译。我需要特别注意这些术语，在翻译过程中准确应用，避免错误。

另外，用户指出在JSON对象的键（如_category_.json）中不翻译键名。虽然当前内容中没有涉及JSON，但需要留意这一点，以防后续内容中出现相关部分。

在处理每个参数和描述时，我会逐行对照，确保描述部分准确传达原意，同时保持技术术语的正确性。例如，“access_key_id”对应的描述应准确翻译为“用于与华为云OBS进行身份验证的访问密钥ID”，同时保持参数名称不变。

同时，用户要求保留原有的换行和空白行，因此我需要确保在翻译过程中不添加或删除任何换行符，保持文档的格式一致。例如，表格中的每一行参数和描述都需要对应翻译，但表格结构本身不能改变。

对于可能存在的HTML标签或特殊标记（如`{/*examples*/}`），用户要求不要处理，因此我需要确保这些部分原封不动地保留在翻译后的文本中。

最后，用户提到如果发现描述“Personal”计划，应翻译为“基础版”。虽然当前内容中没有出现这个词汇，但需要保持警惕，以防后续翻译任务中出现相关术语。

完成初步翻译后，我会再次检查整个文档，确保所有规则都被正确应用，没有遗漏任何术语或格式要求。例如，确认所有“warehouse”都已翻译为“计算集群”，并且所有参数名称和URL都未作改动。同时，检查表格的对齐和格式是否正确，确保翻译后的文档与原文档在视觉上保持一致。

通过以上步骤，确保翻译结果既准确传达了原文的技术内容，又严格遵守了用户设定的格式和术语规范。
</think>

以下是 [storage.obs] 部分中可用的参数列表：

| 参数              | 描述                                          |
| ----------------- | --------------------------------------------- |
| bucket            | 您的华为云 OBS 桶的 名称。                    |
| endpoint_url      | 华为云 OBS 的 URL 端点。                      |
| access_key_id     | 用于与华为云 OBS 进行身份验证的访问密钥 ID。  |
| secret_access_key | 用于与华为云 OBS 进行身份验证的访问密钥秘密。 |

### [storage.cos] Section {/*storagecos-section*/}

以下是 [storage.cos] 部分中可用的参数列表：

| 参数         | 描述                                                                                                                                      |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| bucket       | 腾讯云对象存储（COS）桶的名称。                                                                                                           |
| endpoint_url | 腾讯云 COS 的 URL 端点（可选）。                                                                                                          |
| secret_id    | 用于与腾讯云 COS 进行身份验证的 Secret ID。                                                                                               |
| secret_key   | 用于与腾讯云 COS 进行身份验证的 Secret Key。                                                                                              |
| root         | 指定 Databend 将在桶内操作的目录。例如：如果桶的根目录有一个名为 `myroot` 的文件夹，则设置为 `root = "myroot/"`。                        |

### [storage.hdfs] Section {/*storagehdfs-section*/}

以下是 [storage.hdfs] 部分中可用的参数列表：

| 参数      | 描述                                      |
| --------- | ----------------------------------------- |
| name_node | Hadoop 分布式文件系统（HDFS）的名称节点地址。 |
| root      | 指定 Databend 将操作的目录。              |

### [storage.webhdfs] Section {/*storagewebhdfs-section*/}

以下是 [storage.webhdfs] 部分中可用的参数列表：

| 参数         | 描述                                      |
| ------------ | ----------------------------------------- |
| endpoint_url | WebHDFS（Hadoop 分布式文件系统）的 URL 端点。 |
| root         | 指定 Databend 将操作的目录。              |
| delegation   | 用于身份验证和授权的委托令牌。            |

## [cache] Section {/*cache-section*/}

以下是 [cache] 部分中可用的参数列表：

| 参数                | 描述                                                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| data_cache_storage  | 表数据缓存使用的存储类型。可用选项："none"（禁用表数据缓存）、"disk"（启用磁盘缓存）。默认为 "none"。                         |

### [cache.disk] Section {/*cachedisk-section*/}

以下是 [cache.disk] 部分中可用的参数列表：

| 参数       | 描述                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------- |
| path       | 使用磁盘缓存时，缓存数据的存储路径。                                                          |
| max_bytes  | 使用磁盘缓存时，缓存数据的最大字节数。默认为 21474836480 字节（20 GB）。                      |

## [spill] Section {/*spill-section*/}

以下是 [spill] 部分中可用的参数列表：

| 参数                                        | 描述                                                                                          |
|--------------------------------------------|-----------------------------------------------------------------------------------------------|
| spill_local_disk_path                      | 指定溢出数据在本地磁盘的存储目录路径。                                                        |
| spill_local_disk_reserved_space_percentage | 定义保留的磁盘空间百分比（不用于溢出）。默认值为 `30`。                                       |
| spill_local_disk_max_bytes                 | 设置本地磁盘溢出数据的最大字节数。默认为无限制。                                              |

### [spill.storage] Section {/*spillstorage-section*/}

以下是 [spill.storage] 部分中可用的参数列表：

| 参数    | 描述                                      |
|---------|-------------------------------------------|
| type    | 指定远程溢出存储类型，例如 `s3`。         |

要指定具体存储类型，请使用 [storage 部分](#storage-section) 中的参数。示例请参阅 [配置溢出存储](/guides/data-management/data-recycle#configuring-spill-storage)。
