---
title: 表
---

本页面汇集了关于表操作的关键见解，为您在 Databend 中处理表时提供全面的指南。它串联了与表相关的基本命令，以提供对表管理关键考虑因素的连贯理解。

## 表创建要点

在继续创建表之前，建议您熟悉以下主题。

### 1. 理解表类型

Databend 根据其时间回溯支持支持两种类型的表：

- **常规表（默认）**：这些表天生支持时间回溯，允许您追踪和检索历史数据。此功能对于数据分析和审计非常有价值。

- **临时表**：相比之下，临时表不支持时间回溯。它们设计用于不需要历史数据追踪的场景。要创建临时表，您必须在 [CREATE TABLE](10-ddl-create-table.md) 命令中明确指定关键字 TRANSIENT。有关更多信息，请参阅 [CREATE TRANSIENT TABLE](10-ddl-create-table.md#create-transient-table)。

### 2. 选择表存储

Databend 默认将表数据存储在 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中配置的位置。此外，它还提供了将表数据存储在不同存储桶中的灵活性，偏离默认设置。有关更多信息，请参阅 [CREATE TABLE ... EXTERNAL_LOCATION](10-ddl-create-table.md#create-table--external_location)。

### 3. 定义表结构

定义表中列的主要方法是通过 [CREATE TABLE](10-ddl-create-table.md#create-table) 命令，您可以在其中逐一列出列。请注意，计算列作为 Databend 企业版功能支持。有关更多信息，请参阅 [计算列](10-ddl-create-table.md#computed-columns)。

Databend 还提供了通过复制现有表的列结构甚至数据来创建表的便捷方法：

- [CREATE TABLE ... LIKE](10-ddl-create-table.md#create-table--like)：创建一个与现有表具有相同列定义的表。
- [CREATE TABLE ... AS](10-ddl-create-table.md#create-table--as)：创建一个表并基于 SELECT 查询的结果插入数据。
- [ATTACH TABLE](92-attach-table.md)：通过关联现有表来创建表。

### 4. 为大表设置集群键

[集群键](../06-clusterkey/index.md)旨在通过物理上组织数据来提高查询性能。Databend 建议为遇到查询性能缓慢的大表配置集群键。有关在表创建期间设置集群键的语法，请参阅 [SET CLUSTER KEY](../06-clusterkey/dml-set-cluster-key.md)。

## 常规表维护

一旦您的表创建完成，您就获得了有效组织和管理数据的基础。有了这个结构，您可以无缝执行各种命令来增强、修改或从表中提取信息。无论是调整列属性、微调配置还是查询数据，Databend 都提供了一套多功能工具来满足您不断变化的需求。

- [DESCRIBE TABLE](50-describe-table.md), [SHOW FIELDS](show-fields.md)：显示给定表中列的信息。
- [SHOW FULL COLUMNS](show-full-columns.md)：检索给定表中列的详细信息。
- [SHOW CREATE TABLE](show-create-table.md)：显示创建命名表的 CREATE TABLE 语句。
- [SHOW DROP TABLES](show-drop-tables.md)：列出当前或指定数据库中删除的表。
- [SHOW TABLE STATUS](show-table-status.md)：显示数据库中表的状态。
- [SHOW TABLES](show-tables.md)：列出当前或指定数据库中的表。
- [ALTER TABLE COLUMN](90-alter-table-column.md)：通过更改列来修改表的结构。
- [ALTER TABLE OPTION](90-alter-table-option.md)：修改表的 Fuse 引擎 [选项](../../../00-sql-reference/30-table-engines/00-fuse.md#options)。
- [RENAME TABLE](30-ddl-rename-table.md)：更改表的名称。

## 表删除与恢复策略

Databend 提供了多种命令来删除表或清理表数据。下表比较了这些命令，这些命令最初可能看起来很复杂，概述了每个操作的任何相关恢复选项。

| 命令                                      | 企业版？ | 描述                                                        | 恢复                                 |
| -------------------------------------------- | ------------------- | ------------------------------------------------------------------ | ---------------------------------------- |
| [TRUNCATE TABLE](40-ddl-truncate-table.md)   | 否                  | 从表中删除所有数据，同时保留表的架构。 | [FLASHBACK TABLE](70-flashback-table.md) |
| [DROP TABLE](20-ddl-drop-table.md)           | 否                  | 删除表。                                                   | [UNDROP TABLE](21-ddl-undrop-table.md)   |
| [VACUUM TABLE](91-vacuum-table.md)           | 是                 | 永久删除表的历史数据文件。              | 不适用。                          |
| [VACUUM DROP TABLE](91-vacuum-drop-table.md) | 是                 | 永久删除已删除表的数据文件。                  | 不适用。                          |

## 高级表优化技术

Databend 中的表可能随着时间的推移需要优化，以确保高效的性能和存储利用率。在这种情况下，以下命令可以帮助您：

:::note
表优化是一项高级操作。Databend 建议在继续之前仔细阅读以下链接并理解优化过程，以避免潜在的数据丢失。
:::

- [ANALYZE TABLE](80-analyze-table.md)：计算表统计信息。
- [OPTIMIZE TABLE](60-optimize-table.md)：涉及压缩或清除历史数据以节省存储空间并提高查询性能。