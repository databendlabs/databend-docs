---
title: 表
---

本页汇集了关于表操作的重要见解，为您在 Databend 中处理表的复杂性提供全面的指南。它将基本的表相关命令串联在一起，以提供对表管理中关键考虑因素的统一理解。

## 表创建要点

在继续创建表之前，最好先熟悉以下主题。

### 1. 了解表类型

Databend 支持两种基于时间回溯支持的表类型：

- **普通表（默认）**：这些表本身支持时间回溯，允许您跟踪和检索历史数据。此功能对于数据分析和审计很有价值。

- **临时表**：相比之下，临时表不支持时间回溯。它们专为不需要历史数据跟踪的场景而设计。要创建临时表，您必须在 [CREATE TABLE](10-ddl-create-table.md) 命令中显式指定关键字 TRANSIENT。有关更多信息，请参见 [CREATE TRANSIENT TABLE](10-ddl-create-table.md#create-transient-table)。

### 2. 选择表存储

Databend 默认将表数据存储在 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中配置的位置。此外，它还提供了将表数据存储在与默认设置不同的存储桶中的灵活性。有关更多信息，请参见 [CREATE TABLE ... EXTERNAL_LOCATION](10-ddl-create-table.md#create-table--external_location)。

### 3. 定义表结构

在表中定义列的主要方法是通过 [CREATE TABLE](10-ddl-create-table.md#create-table) 命令，您可以在其中逐个列出您的列。请注意，计算列在 Databend 中作为企业版功能受支持。有关更多信息，请参见 [计算列](10-ddl-create-table.md#computed-columns)。

Databend 还提供了方便的方法来创建表，通过复制列结构甚至来自现有表的数据：

- [CREATE TABLE ... LIKE](10-ddl-create-table.md#create-table--like)：创建一个具有与现有表相同的列定义的表。
- [CREATE TABLE ... AS](10-ddl-create-table.md#create-table--as)：创建一个表并根据 SELECT 查询的结果插入数据。
- [ATTACH TABLE](92-attach-table.md)：通过将表与现有表关联来创建表。

### 4. 为大表设置 Cluster Key

[Cluster Key](../06-clusterkey/index.md) 旨在通过物理上组织邻近的数据来提高查询性能。Databend 建议配置 cluster key，特别是对于遇到查询性能缓慢的大型表。有关在表创建期间设置 cluster key 的语法，请参见 [SET CLUSTER KEY](../06-clusterkey/dml-set-cluster-key.md)。

## 常规表维护

创建表后，您将获得有效组织和管理数据的基础。有了这个结构，您可以无缝地执行各种命令来增强、修改或从表中提取信息。无论是调整列属性、微调配置还是查询数据，Databend 都提供了一套通用的工具来满足您不断变化的需求。

- [DESCRIBE TABLE](50-describe-table.md), [SHOW FIELDS](show-fields.md)：显示有关给定表中列的信息。
- [SHOW FULL COLUMNS](show-full-columns.md)：检索有关给定表中列的全面详细信息。
- [SHOW CREATE TABLE](show-create-table.md)：显示创建指定表的 CREATE TABLE 语句。
- [SHOW DROP TABLES](show-drop-tables.md)：列出当前或指定数据库中已删除的表。
- [SHOW TABLE STATUS](show-table-status.md)：显示数据库中表的状态。
- [SHOW TABLES](show-tables.md)：列出当前或指定数据库中的表。
- [ALTER TABLE COLUMN](90-alter-table-column.md)：通过更改表的列来修改表的结构。
- [ALTER TABLE OPTION](90-alter-table-option.md)：修改表的 Fuse 引擎 [Options](../../../00-sql-reference/30-table-engines/00-fuse.md#options)。
- [RENAME TABLE](30-ddl-rename-table.md)：更改表的名称。

## 表删除和恢复策略

Databend 提供了各种用于删除表或清理表数据的命令。下表比较了这些命令，这些命令最初可能看起来很复杂，概述了每个操作的任何相关恢复选项。

| 命令                                         | Enterprise Edition? | 描述                                                         | 恢复                                  |
| -------------------------------------------- | ------------------- | ------------------------------------------------------------------ | ------------------------------------- |
| [TRUNCATE TABLE](40-ddl-truncate-table.md)   | No                  | 从表中删除所有数据，同时保留表的架构。                             | [FLASHBACK TABLE](70-flashback-table.md) |
| [DROP TABLE](20-ddl-drop-table.md)           | No                  | 删除表。                                                           | [UNDROP TABLE](21-ddl-undrop-table.md)  |
| [VACUUM TABLE](91-vacuum-table.md)           | Yes                 | 永久删除表的历史数据文件。                                         | 不适用。                                |
| [VACUUM DROP TABLE](91-vacuum-drop-table.md) | Yes                 | 永久删除已删除表的数据文件。                                       | 不适用。                                |

## 高级表优化技术

Databend 中的表可能需要随着时间的推移进行优化，以确保高效的性能和存储利用率。在这种情况下，以下命令可以帮助您：

:::note
表优化是一项高级操作。Databend 建议在继续操作之前仔细阅读以下链接并了解优化过程，以避免潜在的数据丢失。
:::

- [ANALYZE TABLE](80-analyze-table.md)：计算表统计信息。
- [OPTIMIZE TABLE](60-optimize-table.md)：涉及压缩或清除历史数据以节省存储空间并提高查询性能。