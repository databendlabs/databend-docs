---
title: 数据清理与回收
sidebar_label: 数据回收
---

## 概述

在 Databend 中，执行 `DROP`、`TRUNCATE` 或 `DELETE` 命令时数据不会立即删除。这使 Databend 能够支持时间回溯功能，让您可以访问数据的历史状态。然而，这种方式意味着执行这些操作后存储空间不会自动释放。

```
Before DELETE:                After DELETE:                 After VACUUM:
+----------------+           +----------------+           +----------------+
| Current Data   |           | New Version    |           | Current Data   |
|                |           | (After DELETE) |           | (After DELETE) |
+----------------+           +----------------+           +----------------+
| Historical Data|           | Historical Data|           |                |
| (Time Travel)  |           | (Original Data)|           |                |
+----------------+           +----------------+           +----------------+
                             Storage not freed            Storage freed
```

## 需要清理的数据类型

Databend 提供了特定命令来清理不同类型的数据。下表总结了数据类型及其对应的清理命令：

| 数据类型 | 描述 | 清理命令 |
|-----------|-------------|-----------------|
| **已删除表数据** | 使用 DROP TABLE 命令删除的表数据文件 | `VACUUM DROP TABLE` |
| **表历史数据** | 表的历史版本，包括通过 UPDATE、DELETE 等操作创建的快照 | `VACUUM TABLE` |
| **孤立文件** | 不再与任何表关联的快照、段和块 | `VACUUM TABLE` |
| **溢出临时文件** | 查询执行期间（如连接、聚合、排序等操作）当内存使用超过可用限制时创建的临时文件 | `VACUUM TEMPORARY FILES` |

> **注意**：溢出临时文件通常由 Databend 自动清理。只有在查询执行期间 Databend 崩溃或意外关闭时才需要手动清理。

## 使用 VACUUM 命令

VACUUM 命令系列是 Databend 中清理数据的主要方法（[企业版功能](/guides/products/dee/enterprise-features)）。根据您需要清理的数据类型，使用不同的 VACUUM 子命令。

```
VACUUM Commands:
+------------------------+    +------------------------+    +------------------------+
| VACUUM DROP TABLE      |    | VACUUM TABLE          |    | VACUUM TEMPORARY FILES |
+------------------------+    +------------------------+    +------------------------+
| Cleans dropped tables  |    | Cleans table history  |    | Cleans spill files     |
| and their data files   |    | and orphan files      |    | (rarely needed)        |
+------------------------+    +------------------------+    +------------------------+
```

### VACUUM DROP TABLE

此命令永久删除已删除表的数据文件，释放存储空间。

```sql
VACUUM DROP TABLE [FROM <database_name>] [DRY RUN [SUMMARY]] [LIMIT <file_count>];
```

**选项：**
- `FROM <database_name>`：限定在特定数据库
- `DRY RUN [SUMMARY]`：预览将被删除的文件而不实际执行删除
- `LIMIT <file_count>`：限制要清理的文件数量

**示例：**

```sql
-- 预览将被移除的文件
VACUUM DROP TABLE DRY RUN;

-- 预览将被移除文件的摘要
VACUUM DROP TABLE DRY RUN SUMMARY;

-- 从 "default" 数据库中移除已删除表
VACUUM DROP TABLE FROM default;

-- 从已删除表中移除最多 1000 个文件
VACUUM DROP TABLE LIMIT 1000;
```

### VACUUM TABLE

此命令移除指定表的历史数据，清除旧版本并释放存储空间。

```sql
VACUUM TABLE <table_name> [DRY RUN [SUMMARY]];
```

**选项：**
- `DRY RUN [SUMMARY]`：预览将被删除的文件而不实际执行删除

**示例：**

```sql
-- 预览将被移除的文件
VACUUM TABLE my_table DRY RUN;

-- 预览将被移除文件的摘要
VACUUM TABLE my_table DRY RUN SUMMARY;

-- 从 my_table 中移除历史数据
VACUUM TABLE my_table;
```

### VACUUM TEMPORARY FILES

此命令清除用于连接、聚合和排序的临时溢出文件，释放存储空间。

```sql
VACUUM TEMPORARY FILES;
```

**注意**：虽然此命令提供了手动清理临时文件的方法，但在正常操作中很少需要，因为 Databend 在大多数情况下会自动处理清理。

## 调整数据保留时间

VACUUM 命令会移除早于 `DATA_RETENTION_TIME_IN_DAYS` 设置的数据文件。默认情况下，Databend 会保留 1 天（24 小时）的历史数据。您可以调整此设置：

```sql
-- 将保留期改为 2 天
SET GLOBAL DATA_RETENTION_TIME_IN_DAYS = 2;

-- 查看当前保留设置
SHOW SETTINGS LIKE 'DATA_RETENTION_TIME_IN_DAYS';
```

| 版本                                   | 默认保留时间       | 最大保留时间      |
| ---------------------------------------- | ----------------- | ---------------- |
| Databend 社区版和企业版 | 1 天（24 小时）   | 90 天           |
| Databend Cloud (基础版)                | 1 天（24 小时）   | 1 天（24 小时） |
| Databend Cloud (商业版)                | 1 天（24 小时）   | 90 天           |