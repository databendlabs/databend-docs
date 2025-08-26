---
title: 数据清理与回收
sidebar_label: 数据回收
---

## 概述

在 Databend 中，当您运行 `DROP`、`TRUNCATE` 或 `DELETE` 命令时，数据不会立即被删除。这使得 Databend 的时间旅行（Time Travel）功能得以实现，允许您访问数据的先前状态。然而，这种方法也意味着在这些操作之后，存储空间不会自动释放。

```
DELETE 前:                    DELETE 后:                     VACUUM 后:
+----------------+           +----------------+           +----------------+
|   当前数据     |           |    新版本      |           |   当前数据     |
|                |           | （DELETE 后）   |           | （DELETE 后）   |
+----------------+           +----------------+           +----------------+
|   历史数据     |           |   历史数据     |           |                |
|  （时间旅行）  |           |  （原始数据）  |           |                |
+----------------+           +----------------+           +----------------+
                             存储未释放                     存储已释放
```

## VACUUM 命令与清理范围

Databend 提供了三种具有**不同清理范围**的 VACUUM 命令。了解每个命令清理的内容对于数据管理至关重要。

```
VACUUM DROP TABLE
├── 目标：已删除的表（执行 DROP TABLE 命令后）
├── S3 存储：✅ 移除所有数据（文件、段、块、索引、统计信息）
├── Meta Service：✅ 移除所有元数据（模式、权限、记录）
└── 结果：彻底移除表 - 无法恢复

VACUUM TABLE
├── 目标：活跃表的历史数据和孤立文件
├── S3 存储：✅ 移除旧快照、孤立的段/块、索引/统计信息
├── Meta Service：❌ 保留表结构和当前元数据
└── 结果：表保持活跃，仅清理历史数据

VACUUM TEMPORARY FILES
├── 目标：查询产生的临时溢出文件（连接、排序、聚合）
├── S3 存储：✅ 移除因查询崩溃/中断产生的临时文件
├── Meta Service：❌ 无元数据（临时文件不含元数据）
└── 结果：仅清理存储，很少需要
```

---

> **🚨 关键**：只有 `VACUUM DROP TABLE` 会影响 Meta Service。其他命令仅清理存储文件。

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
-- 预览将被移除的文件
VACUUM DROP TABLE DRY RUN;

-- 预览将被移除文件的摘要
VACUUM DROP TABLE DRY RUN SUMMARY;

-- 从 "default" 数据库中移除已删除的表
VACUUM DROP TABLE FROM default;

-- 从已删除的表中最多移除 1000 个文件
VACUUM DROP TABLE LIMIT 1000;
```

### VACUUM TABLE

为活跃表移除历史数据和孤立文件（仅清理存储）。

```sql
VACUUM TABLE <table_name> [DRY RUN [SUMMARY]];
```

**选项：**
- `DRY RUN [SUMMARY]`：预览将要移除的文件，而不实际删除它们

**示例：**

```sql
-- 预览将被移除的文件
VACUUM TABLE my_table DRY RUN;

-- 预览将被移除文件的摘要
VACUUM TABLE my_table DRY RUN SUMMARY;

-- 从 my_table 表中移除历史数据
VACUUM TABLE my_table;
```

### VACUUM TEMPORARY FILES

移除查询执行期间创建的临时溢出文件。

```sql
VACUUM TEMPORARY FILES;
```

> **注意**：在正常操作中很少需要，因为 Databend 会自动处理清理工作。通常只有在 Databend 于查询执行期间崩溃时才需要手动清理。

## 调整数据保留时间

VACUUM 命令会移除早于 `DATA_RETENTION_TIME_IN_DAYS` 设置的数据文件。默认情况下，Databend 会保留 1 天（24 小时）的历史数据。您可以调整此设置：

```sql
-- 将保留期更改为 2 天
SET GLOBAL DATA_RETENTION_TIME_IN_DAYS = 2;

-- 检查当前的保留期设置
SHOW SETTINGS LIKE 'DATA_RETENTION_TIME_IN_DAYS';
```

| 版本 | 默认保留期 | 最长保留期 |
| ---------------------------------------- | ----------------- | ---------------- |
| Databend Community & Enterprise Editions | 1 天（24 小时） | 90 天 |
| Databend Cloud（Personal） | 1 天（24 小时） | 1 天（24 小时） |
| Databend Cloud（Business） | 1 天（24 小时） | 90 天 |