<think>
好的，我现在需要处理用户提供的关于如何从Snowflake迁移到Databend的指南翻译任务。首先，我要仔细阅读用户提供的规则，确保翻译过程中严格遵守这些要求。

首先，用户强调必须保持Markdown结构不变，不能添加或删除链接，也不能更改任何URL。这意味着在翻译过程中，我需要特别注意保留原有的标题、列表、代码块等结构，尤其是图片链接和文档内部链接。例如，图片的路径`@site/static/img/load/snowflake-databend.png`必须原样保留，不能做任何修改。

接下来，用户提到不能改变代码块的内容，即使里面有错误。因此，在翻译过程中，所有代码块中的命令，比如`COPY INTO`，必须保持原样，不进行任何翻译或修改。同时，需要保留原有的换行和空白行，确保格式一致。

关于特定术语的翻译，用户给出了明确的指示。例如，“time travel”要翻译为“时间回溯”，“warehouse”或“warehouses”翻译为“计算集群”，“Data Warehouse”翻译为“数仓”，“Self-Hosted”翻译为“私有化部署”，而“Databend Cloud”、“Vector”、“Stage”等术语则保持不译。我需要特别注意这些术语的正确使用，确保在整个文档中统一。

在处理JSON文件时，用户指出`_category_.json`中的键不需要翻译。因此，在遇到类似情况时，我需要仅翻译值部分，而保留键的原文。此外，用户特别强调不要包含或生成任何`</think>`标签，这意味着输出中必须完全避免这类内容，确保最终的翻译结果干净，符合要求。

现在，具体到用户提供的文档内容，首先标题“Snowflake”需要保留不译，但后续的步骤标题需要翻译。例如，“Step 1: Configuring Snowflake Storage Integration for Amazon S3”应翻译为“步骤 1：为 Amazon S3 配置 Snowflake 存储集成”，同时保留原有的Markdown结构。每个步骤中的子项，如创建IAM角色和策略，需要准确翻译，同时确保技术术语如“IAM角色”、“S3存储桶”等正确无误。

在第二步中，“Create Stage”需要翻译为“创建Stage”，因为“Stage”是保留术语，不翻译。同样，“COPY INTO”命令保持原样。在第三步加载数据到Databend时，“COPY INTO”同样不翻译，但周围的说明需要准确传达操作步骤。

最后，教程部分的链接“Migrating from Snowflake”需要保留原文，但标题翻译为“从 Snowflake 迁移”。同时，注意文档末尾的permalink如`{/*examples*/}`必须保留，不进行任何修改。

在整个翻译过程中，我需要反复检查是否符合所有规则，特别是术语的一致性和结构的保留。同时，确保语言流畅，技术描述准确，便于中文用户理解。完成初稿后，再次通读检查是否有遗漏或格式错误，确保最终输出完全符合用户的要求。
</think>

---
title: Snowflake
---

本指南概述了将数据从 Snowflake 迁移到 Databend 的高级流程。迁移过程涉及将数据从 Snowflake 导出到 Amazon S3 存储桶，然后加载到 Databend。整个过程分为三个主要步骤：

![alt text](@site/static/img/load/snowflake-databend.png)

## 步骤 1：为 Amazon S3 配置 Snowflake 存储集成 {#step-1-configuring-snowflake-storage-integration-for-amazon-s3}

在导出数据前，您需要建立 Snowflake 与 Amazon S3 之间的连接。这通过配置存储集成来实现，该集成允许 Snowflake 安全访问并与暂存数据的 S3 存储桶进行交互。

1. **创建 IAM 角色与策略**：首先创建一个 AWS IAM 角色，该角色需具备读写目标 S3 存储桶的权限。此角色确保 Snowflake 能安全地与 S3 存储桶交互。

2. **Snowflake 存储集成**：在 Snowflake 中，使用 IAM 角色配置存储集成。该集成将允许 Snowflake 安全访问指定的 S3 存储桶并执行数据导出操作。

3. **更新信任关系**：创建存储集成后，需在 AWS 中更新 IAM 角色的信任关系，确保 Snowflake 能担任该 IAM 角色并获取必要的数据访问权限。

## 步骤 2：准备数据并导出到 Amazon S3 {#step-2-preparing--exporting-data-to-amazon-s3}

集成配置完成后，下一步是在 Snowflake 中准备数据并将其导出到 S3 存储桶。

1. **创建 Stage**：在 Snowflake 中创建一个指向 S3 存储桶的外部 Stage。该 Stage 将作为数据迁移到 Databend 前的临时存储位置。

2. **准备数据**：在 Snowflake 中创建必要的表并填充数据。数据就绪后，可以将其以 Parquet 等格式导出到 S3 存储桶。

3. **导出数据**：使用 Snowflake 的 `COPY INTO` 命令将数据从 Snowflake 表导出到 S3 存储桶，指定文件格式和存储位置。此过程会将数据保存至 S3 存储桶，为下一步做好准备。

## 步骤 3：将数据加载到 Databend {#step-3-loading-data-into-databend}

数据导出到 S3 存储桶后，最后一步是将其加载到 Databend。

1. **创建目标表**：在 Databend 中创建与 Snowflake 导出数据结构匹配的目标表。

2. **加载数据**：使用 Databend 的 `COPY INTO` 命令将数据从 S3 存储桶加载到目标表。提供 AWS 凭证以确保 Databend 能访问 S3 存储桶。您还可以定义文件格式（如 Parquet）以匹配导出数据的格式。

3. **验证数据**：加载完成后，在 Databend 中执行简单查询以验证数据是否成功导入并可供后续处理。

## 教程 {#tutorials}

- [从 Snowflake 迁移](/tutorials/migrate/migrating-from-snowflake)