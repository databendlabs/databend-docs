---
title: 表
---

本页面按功能组织，全面概述了 Databend 中的表操作，方便查阅。

## 创建表

| 命令 | 描述 |
|---------|-------------|
| [CREATE TABLE](10-ddl-create-table.md) | 使用指定的列和选项创建新表 |
| [CREATE TABLE ... LIKE](10-ddl-create-table.md#create-table--like) | 创建与现有表具有相同列定义的表 |
| [CREATE TABLE ... AS](10-ddl-create-table.md#create-table--as) | 根据 SELECT 查询结果创建表并插入数据 |
| [CREATE TRANSIENT TABLE](10-ddl-create-transient-table.md) | 创建不支持 Time Travel 的表 |
| [CREATE EXTERNAL TABLE](10-ddl-create-table-external-location.md) | 创建数据存储在指定外部位置的表 |
| [ATTACH TABLE](92-attach-table.md) | 通过与现有表关联创建表 |

## 修改表

| 命令 | 描述 |
|---------|-------------|
| [ALTER TABLE](90-alter-table.md) | 修改表的列、注释、Fuse 选项、外部连接，或与另一张表交换元数据 |
| [RENAME TABLE](30-ddl-rename-table.md) | 更改表名 |

## 查看表信息

| 命令 | 描述 |
|---------|-------------|
| [DESCRIBE TABLE](50-describe-table.md) / [SHOW FIELDS](show-fields.md) | 显示指定表的列信息 |
| [SHOW FULL COLUMNS](show-full-columns.md) | 检索指定表的列详细信息 |
| [SHOW CREATE TABLE](show-create-table.md) | 显示创建指定表的 CREATE TABLE 语句 |
| [SHOW TABLES](show-tables.md) | 列出当前或指定数据库中的表 |
| [SHOW TABLE STATUS](show-table-status.md) | 显示数据库中表的状态 |
| [SHOW DROP TABLES](show-drop-tables.md) | 列出当前或指定数据库中已删除的表 |

## 删除与恢复表

| 命令 | 描述 | 恢复选项 |
|---------|-------------|----------------|
| [TRUNCATE TABLE](40-ddl-truncate-table.md) | 清空表数据，保留表结构 | [FLASHBACK TABLE](70-flashback-table.md) |
| [DROP TABLE](20-ddl-drop-table.md) | 删除表 | [UNDROP TABLE](21-ddl-undrop-table.md) |
| [VACUUM TABLE](91-vacuum-table.md) | 永久删除表的历史数据文件（企业版） | 不可恢复 |
| [VACUUM DROP TABLE](91-vacuum-drop-table.md) | 永久删除已删除表的数据文件（企业版） | 不可恢复 |

## 优化表

| 命令 | 描述 |
|---------|-------------|
| [OPTIMIZE TABLE](60-optimize-table.md) | 压缩或清理历史数据以节省存储空间并提升查询性能 |
| [SET CLUSTER KEY](../06-clusterkey/dml-set-cluster-key.md) | 配置 Cluster Key 以提升大表查询性能 |

:::note
表优化属于高级操作，执行前请务必仔细阅读文档，避免潜在数据丢失。
:::
