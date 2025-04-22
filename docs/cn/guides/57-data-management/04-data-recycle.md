---
title: 数据清理和回收
sidebar_label: 数据回收
---

## 概述

在 Databend 中，当你运行 `DROP`、`TRUNCATE` 或 `DELETE` 命令时，数据不会立即被删除。这使得 Databend 的时间回溯功能成为可能，允许你访问数据的先前状态。然而，这种方法意味着在这些操作之后，存储空间不会自动释放。

## 需要清理的数据类型

在 Databend 中，主要有四种类型的数据可能需要清理：

1. **已删除表的数据**：使用 DROP TABLE 命令删除的表中的数据文件
2. **表历史数据**：表的历史版本，包括通过 UPDATE、DELETE 和其他操作创建的快照
3. **孤立文件**：不再与任何表关联的快照、段和块
4. **溢出临时文件**：在查询执行期间，当内存使用量超过可用限制时创建的临时文件（用于连接、聚合、排序等）。Databend 在查询正常完成后会自动清理这些文件。只有在 Databend 在查询执行期间崩溃或意外关闭的极少数情况下才需要手动清理。

## 使用 VACUUM 命令

VACUUM 命令系列是在 Databend 中清理数据的主要方法 ([企业版功能](/guides/products/dee/enterprise-features))。根据你需要清理的数据类型，使用不同的 VACUUM 子命令。

### VACUUM DROP TABLE

此命令永久删除已删除表的数据文件，释放存储空间。

```sql
VACUUM DROP TABLE [FROM <database_name>] [DRY RUN [SUMMARY]] [LIMIT <file_count>];
```

**选项：**
- `FROM <database_name>`：限制为特定数据库
- `DRY RUN [SUMMARY]`：预览要删除的文件，而不实际删除它们
- `LIMIT <file_count>`：限制要清理的文件数量

**示例：**

```sql
-- 预览将要删除的文件
VACUUM DROP TABLE DRY RUN;

-- 预览将要删除的文件的摘要
VACUUM DROP TABLE DRY RUN SUMMARY;

-- 从“default”数据库中删除已删除的表
VACUUM DROP TABLE FROM default;

-- 从已删除的表中删除最多 1000 个文件
VACUUM DROP TABLE LIMIT 1000;
```

### VACUUM TABLE

此命令删除指定表的历史数据，清除旧版本并释放存储空间。

```sql
VACUUM TABLE <table_name> [DRY RUN [SUMMARY]];
```

**选项：**
- `DRY RUN [SUMMARY]`：预览要删除的文件，而不实际删除它们

**示例：**

```sql
-- 预览将要删除的文件
VACUUM TABLE my_table DRY RUN;

-- 预览将要删除的文件的摘要
VACUUM TABLE my_table DRY RUN SUMMARY;

-- 从 my_table 中删除历史数据
VACUUM TABLE my_table;
```

### VACUUM TEMPORARY FILES

此命令清除用于连接、聚合和排序的临时溢出文件，释放存储空间。

```sql
VACUUM TEMPORARY FILES;
```

**注意：** 虽然此命令作为手动清理临时文件的方法提供，但在正常操作期间很少需要，因为 Databend 在大多数情况下会自动处理清理。

## 调整数据保留时间

VACUUM 命令删除早于 `DATA_RETENTION_TIME_IN_DAYS` 设置的数据文件。默认情况下，Databend 保留 1 天（24 小时）的历史数据。你可以调整此设置：

```sql
-- 将保留期限更改为 2 天
SET GLOBAL DATA_RETENTION_TIME_IN_DAYS = 2;

-- 检查当前保留设置
SHOW SETTINGS LIKE 'DATA_RETENTION_TIME_IN_DAYS';
```

| 版本                                   | 默认保留时间 | 最长保留时间 |
| ---------------------------------------- | ----------------- | ---------------- |
| Databend Community & Enterprise Editions | 1 天（24 小时）  | 90 天          |
| Databend Cloud (基础版)                | 1 天（24 小时）  | 1 天（24 小时） |
| Databend Cloud (Business)                | 1 天（24 小时）  | 90 天          |
