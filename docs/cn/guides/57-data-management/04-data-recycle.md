---
title: 数据清理与回收
sidebar_label: 数据回收
---

## 概述

在 Databend 中，当您运行 `DROP`、`TRUNCATE` 或 `DELETE` 命令时，数据不会立即被删除。这使得 Databend 的 Time Travel（时间回溯）功能得以实现，允许您访问数据的先前状态。然而，这种方法也意味着在这些操作之后，存储空间不会自动释放。

```
DELETE 前:                    DELETE 后:                   VACUUM 后:
+----------------+           +----------------+           +----------------+
| 当前数据       |           | 新版本         |           | 当前数据       |
|                |           | （DELETE 后）  |           | （DELETE 后）  |
+----------------+           +----------------+           +----------------+
| 历史数据       |           | 历史数据       |           |                |
| （时间回溯）   |           | （原始数据）   |           |                |
+----------------+           +----------------+           +----------------+
                             存储未释放                     存储已释放
```

## VACUUM 命令与清理范围

Databend 提供了三个 VACUUM 命令来清理不同类型的数据。**理解每个命令清理的内容至关重要**——有些命令只清理存储数据，而另一些则同时清理存储和元数据。

| 命令 | 目标数据 | S3 存储 | Meta Service（元数据服务） | 详情 |
|---|---|---|---|---|
| **VACUUM DROP TABLE** | `DROP TABLE` 后的已删除表 | ✅ **移除**：所有数据文件、段、块、索引、统计信息 | ✅ **移除**：表结构、权限、元数据记录 | **彻底清除** - 表无法恢复 |
| **VACUUM TABLE** | 表历史和孤立文件 | ✅ **移除**：历史快照、孤立的段/块、旧的索引/统计信息 | ❌ **保留**：表结构和当前元数据 | **仅清理存储** - 表保持活动状态 |
| **VACUUM TEMPORARY FILES** | 查询产生的溢出文件（连接、聚合、排序） | ✅ **移除**：因查询崩溃/中断产生的临时溢出文件 | ❌ **无元数据**：临时文件没有关联的元数据 | **仅清理存储** - 很少需要，通常会自动清理 |

> **关键**：只有 `VACUUM DROP TABLE` 会从 Meta Service 中移除元数据。其他命令仅清理存储文件。

## 使用 VACUUM 命令

VACUUM 命令系列是 Databend 中清理数据的主要方法（[企业版功能](/guides/products/dee/enterprise-features)）。

### VACUUM DROP TABLE

从存储和元数据中永久移除已删除的表。

```sql
VACUUM DROP TABLE [FROM <database_name>] [DRY RUN [SUMMARY]] [LIMIT <file_count>];
```

**选项：**
- `FROM <database_name>`：限制在特定数据库内
- `DRY RUN [SUMMARY]`：预览将要移除的文件，而不实际删除它们
- `LIMIT <file_count>`：限制要清理的文件数量

**示例：**

```sql
-- 预览将要被移除的文件
VACUUM DROP TABLE DRY RUN;

-- 预览将要被移除的文件的摘要信息
VACUUM DROP TABLE DRY RUN SUMMARY;

-- 从 "default" 数据库中移除已删除的表
VACUUM DROP TABLE FROM default;

-- 从已删除的表中最多移除 1000 个文件
VACUUM DROP TABLE LIMIT 1000;
```

### VACUUM TABLE

为活动表移除历史数据和孤立文件（仅清理存储）。

```sql
VACUUM TABLE <table_name> [DRY RUN [SUMMARY]];
```

**选项：**
- `DRY RUN [SUMMARY]`：预览将要移除的文件，而不实际删除它们

**示例：**

```sql
-- 预览将要被移除的文件
VACUUM TABLE my_table DRY RUN;

-- 预览将要被移除的文件的摘要信息
VACUUM TABLE my_table DRY RUN SUMMARY;

-- 从 my_table 表中移除历史数据
VACUUM TABLE my_table;
```

### VACUUM TEMPORARY FILES

移除查询执行期间创建的临时溢出文件。

```sql
VACUUM TEMPORARY FILES;
```

> **注意**：在正常操作中很少需要，因为 Databend 会自动处理清理工作。通常只有在 Databend 查询执行期间崩溃时才需要手动清理。

## 调整数据保留时间

VACUUM 命令会移除早于 `DATA_RETENTION_TIME_IN_DAYS` 设置的数据文件。默认情况下，Databend 保留历史数据 1 天（24 小时）。您可以调整此设置：

```sql
-- 将保留期更改为 2 天
SET GLOBAL DATA_RETENTION_TIME_IN_DAYS = 2;

-- 检查当前的保留期设置
SHOW SETTINGS LIKE 'DATA_RETENTION_TIME_IN_DAYS';
```

| 版本 | 默认保留期 | 最大保留期 |
| --- | --- | --- |
| Databend Community & Enterprise Editions | 1 天（24 小时） | 90 天 |
| Databend Cloud（Personal） | 1 天（24 小时） | 1 天（24 小时） |
| Databend Cloud（Business） | 1 天（24 小时） | 90 天 |