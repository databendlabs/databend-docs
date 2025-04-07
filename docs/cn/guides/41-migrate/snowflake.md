---
title: Snowflake
---

本指南概述了将数据从 Snowflake 迁移到 Databend 的过程。迁移包括将数据从 Snowflake 导出到 Amazon S3 bucket，然后将其加载到 Databend 中。该过程分为三个主要步骤：

![alt text](@site/static/img/load/snowflake-databend.png)

## 步骤 1：配置 Snowflake Storage Integration 以连接 Amazon S3

在导出数据之前，您需要在 Snowflake 和 Amazon S3 之间建立连接。这可以通过配置 storage integration 来实现，该 integration 允许 Snowflake 安全地访问 S3 bucket 并与之交互，您的数据将暂存于此。

1. 创建 IAM 角色和策略：首先创建一个 AWS IAM 角色，该角色具有从 S3 bucket 读取和写入的权限。此角色确保 Snowflake 可以安全地与 S3 bucket 交互。

2. Snowflake Storage Integration：在 Snowflake 中，您将使用 IAM 角色配置 storage integration。此 integration 将允许 Snowflake 安全地访问指定的 S3 bucket 并执行数据导出操作。

3. 更新信任关系：创建 storage integration 后，您将更新 AWS 中 IAM 角色的信任关系，以确保 Snowflake 可以代入 IAM 角色并获得数据访问所需的权限。

## 步骤 2：准备数据并将其导出到 Amazon S3

设置好 integration 后，下一步是准备 Snowflake 中的数据并将其导出到 S3 bucket。

1. 创建 Stage：您需要在 Snowflake 中创建一个指向 S3 bucket 的外部 Stage。在将数据传输到 Databend 之前，此 Stage 将用作数据的临时位置。

2. 准备数据：创建必要的表并在 Snowflake 中填充数据。数据准备就绪后，您可以将其以所需的格式（例如 Parquet）导出到 S3 bucket。

3. 导出数据：使用 Snowflake 的 COPY INTO 命令将数据从 Snowflake 表导出到 S3 bucket 中，指定文件格式和位置。此过程会将数据保存在 S3 bucket 中，使其可以进行下一步操作。

## 步骤 3：将数据加载到 Databend

现在您的数据已导出到 S3 bucket，最后一步是将其加载到 Databend 中。

1. 创建目标表：在 Databend 中，创建一个与从 Snowflake 导出的数据结构匹配的目标表。

2. 加载数据：使用 Databend 中的 COPY INTO 命令将数据从 S3 bucket 加载到目标表中。提供您的 AWS 凭证，以确保 Databend 可以访问 S3 bucket。您还可以定义文件格式（例如 Parquet）以匹配导出数据的格式。

3. 验证数据：加载数据后，在 Databend 中执行一个简单的查询，以验证数据是否已成功导入并且可用于进一步处理。

## 教程

- [从 Snowflake 迁移](/tutorials/migrate/migrating-from-snowflake)
