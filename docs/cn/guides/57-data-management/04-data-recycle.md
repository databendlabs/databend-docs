<think>
好的，我现在需要处理用户提供的关于Databend数据清理和回收的文档翻译任务。首先，我要仔细阅读用户提供的规则，确保翻译过程中严格遵守这些要求。用户特别强调不能改变Markdown结构、代码块内容、链接和URL，同时要保留原有的换行和空白行。此外，还有一些特定术语需要保持不翻译或按指定方式翻译，比如“time travel”要译为“时间回溯”，“warehouse”译为“计算集群”等。

首先，我会通读整个英文文档，理解每个部分的内容和结构。注意到文档分为几个主要部分：Spill Data Storage、Purge Drop Table Data、Purge Table History Data和Purge Temporary Data。每个部分都有子标题和代码示例，需要确保这些部分的结构在翻译后保持一致。

接下来，处理术语翻译。例如，“Self-hosted Databend”需要翻译为“私有化部署的Databend”，而“Databend Cloud”则保持不译。同时，注意“time travel”要译为“时间回溯”，而不是直译为“时间旅行”。对于“warehouse”或“warehouses”，统一翻译为“计算集群”，而“Data Warehouse”则译为“数仓”。这些术语的一致性非常重要，以确保文档的专业性和易读性。

在处理代码块时，确保不进行任何修改，包括注释和命令。例如，在配置spill storage的TOML示例中，所有配置参数和值都应保持原样。同时，注意保留Markdown的语法结构，如代码块的三个反引号和语言标识符。

对于HTML标签如`<Notes>`，用户要求不进行翻译或修改，因此需要保留原样。同样，文档末尾的permalink如`{/*examples*/}`也不能改动，确保链接的正确性。

在翻译过程中，还要注意保持原有的段落和换行符。例如，每个命令后的“See more”链接需要正确指向对应的中文文档页面，同时保留原有的Markdown链接格式。例如，`[VACUUM DROP TABLE](/sql/sql-commands/administration-cmds/vacuum-drop-table)`需要保持链接不变，但翻译链接文本为“详见[VACUUM DROP TABLE](/sql/sql-commands/administration-cmds/vacuum-drop-table)”。

另外，用户提到如果遇到描述“Personal”计划时，应翻译为“基础版”。虽然当前文档中没有出现这个词，但需要保持警惕，以防后续内容中出现。

在处理JSON对象时，如`_category_.json`，确保键名不被翻译，只翻译值部分。但当前文档中没有JSON内容，所以暂时不需要处理这部分。

最后，通读整个翻译后的文档，检查是否符合所有规则，特别是结构是否与原文一致，术语是否正确应用，代码块和链接是否未改动。同时，确保没有遗漏任何部分，如配置示例或命令语法，并验证翻译的准确性和流畅性。

例如，原文中的“Self-hosted Databend supports spilling intermediate query results to disk”翻译为“私有化部署的Databend支持将中间查询结果溢出到磁盘”，这里“Self-hosted”正确译为“私有化部署”，而“spilling”译为“溢出”符合技术术语。同时，配置示例中的TOML代码块保持原样，没有进行任何修改。

通过以上步骤，确保翻译后的文档既准确传达了原文的技术内容，又符合用户的所有格式和术语要求，最终生成高质量的中文技术文档。
</think>

---
title: 数据清理与回收
sidebar_label: 数据回收
---

在 Databend 中，当你执行 `DROP`、`TRUNCATE` 或 `DELETE` 命令时，数据并不会被真正删除，这使得你可以通过时间回溯功能恢复到之前的状态。

数据分为两种类型：

- **历史数据**：由时间回溯功能使用，用于存储历史数据或已删除表的数据。
- **临时数据**：由系统使用，用于存储溢出数据。

如果数据量较大，你可以运行以下命令（[企业版功能](/guides/products/dee/enterprise-features)）来删除这些数据并释放存储空间。

## 溢出数据存储

私有化部署的 Databend 支持在内存使用超过可用限制时将中间查询结果溢出到磁盘。用户可以配置溢出数据的存储位置，选择本地磁盘存储或远程 S3 兼容存储桶。

### 溢出存储选项

Databend 提供以下溢出存储配置：

- **本地磁盘存储**：溢出数据写入查询节点指定的本地目录。请注意，本地磁盘存储仅支持 [窗口函数](/sql/sql-functions/window-functions/)。
- **远程 S3 兼容存储**：溢出数据存储在外部存储桶。
- **默认存储**：如果未配置溢出存储，Databend 会将溢出数据与表数据一起存储到默认存储桶。

### 溢出优先级

如果同时配置了本地和 S3 兼容溢出存储，Databend 按以下顺序处理：

1. 优先溢出到本地磁盘（如果已配置）。
2. 当本地磁盘空间不足时，溢出到远程 S3 兼容存储。
3. 如果未配置本地或外部 S3 兼容存储，则溢出到 Databend 的默认存储桶。

### 配置溢出存储

要配置溢出存储，请更新 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件。

以下示例配置 Databend 使用最多 1 TB 本地磁盘空间进行溢出操作，同时保留 40% 的磁盘空间供系统使用：

```toml
[spill]
spill_local_disk_path = "/data1/databend/databend_spill"
spill_local_disk_reserved_space_percentage = 40
spill_local_disk_max_bytes = 1099511627776
```

以下示例配置 Databend 使用 MinIO 作为 S3 兼容存储服务进行溢出操作：

```toml
[spill]
[spill.storage]
type = "s3"
[spill.storage.s3]
bucket = "databend"
root = "admin"
endpoint_url = "http://127.0.0.1:9900"
access_key_id = "minioadmin"
secret_access_key = "minioadmin"
allow_insecure = true
```

## 清理已删除表数据

删除所有已删除表的数据文件，释放存储空间。

```sql
VACUUM DROP TABLE;
```

详见 [VACUUM DROP TABLE](/sql/sql-commands/administration-cmds/vacuum-drop-table)。

## 清理表历史数据

移除指定表的历史数据，清除旧版本并释放存储空间。

```sql
VACUUM TABLE <table_name>;
```

详见 [VACUUM TABLE](/sql/sql-commands/administration-cmds/vacuum-table)。

## 清理临时数据

清除用于连接、聚合和排序的临时溢出文件，释放存储空间。

```sql
VACUUM TEMPORARY FILES;
```

详见 [VACUUM TEMPORARY FILES](/sql/sql-commands/administration-cmds/vacuum-temp-files)。