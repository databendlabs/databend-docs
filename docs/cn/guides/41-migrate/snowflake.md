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
