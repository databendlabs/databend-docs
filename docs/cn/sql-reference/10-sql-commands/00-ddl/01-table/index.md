---
title: 表（Table）
---

本页面提供 Databend 中表操作的全面概述，按功能分类便于查阅。

## 表创建

| 命令 | 描述 |
|---------|-------------|
| [CREATE TABLE](10-ddl-create-table.md) | 创建具有指定列和选项的新表 |
| [CREATE TABLE ... LIKE](10-ddl-create-table.md#create-table--like) | 创建与现有表列定义相同的新表 |
| [CREATE TABLE ... AS](10-ddl-create-table.md#create-table--as) | 基于 SELECT 查询结果创建表并插入数据 |
| [CREATE TRANSIENT TABLE](10-ddl-create-transient-table.md) | 创建不支持时间回溯（Time Travel）的表 |
| [CREATE EXTERNAL TABLE](10-ddl-create-table-external-location.md) | 创建数据存储在指定外部位置的表 |
| [ATTACH TABLE](92-attach-table.md) | 通过关联现有表创建新表 |

## 表修改

| 命令 | 描述 |
|---------|-------------|
| [ALTER TABLE COLUMN](90-alter-table-column.md) | 修改表的列结构 |
| [ALTER TABLE CONNECTION](91-alter-table-connection.md) | 更新外部表的连接设置 |
| [ALTER TABLE OPTION](90-alter-table-option.md) | 修改表的 Fuse 引擎选项 |
| [ALTER TABLE COMMENT](90-alter-table-comment.md) | 更新表的注释 |
| [RENAME TABLE](30-ddl-rename-table.md) | 更改表名称 |

## 表信息

| 命令 | 描述 |
|---------|-------------|
| [DESCRIBE TABLE](50-describe-table.md) / [SHOW FIELDS](show-fields.md) | 显示指定表的列信息 |
| [SHOW FULL COLUMNS](show-full-columns.md) | 获取指定表的列详细信息 |
| [SHOW CREATE TABLE](show-create-table.md) | 显示创建指定表的 CREATE TABLE 语句 |
| [SHOW TABLES](show-tables.md) | 列出当前或指定数据库中的表 |
| [SHOW TABLE STATUS](show-table-status.md) | 显示数据库中的表状态 |
| [SHOW DROP TABLES](show-drop-tables.md) | 列出当前或指定数据库中已删除的表 |

## 表删除与恢复

| 命令 | 描述 | 恢复选项 |
|---------|-------------|----------------|
| [TRUNCATE TABLE](40-ddl-truncate-table.md) | 清空表数据但保留表结构 | [FLASHBACK TABLE](70-flashback-table.md) |
| [DROP TABLE](20-ddl-drop-table.md) | 删除表 | [UNDROP TABLE](21-ddl-undrop-table.md) |
| [VACUUM TABLE](91-vacuum-table.md) | 永久删除表的历史数据文件（企业版 (Enterprise Edition)） | 不可恢复 |
| [VACUUM DROP TABLE](91-vacuum-drop-table.md) | 永久删除已删除表的数据文件（企业版 (Enterprise Edition)） | 不可恢复 |

## 表优化

| 命令 | 描述 |
|---------|-------------|
| [ANALYZE TABLE](80-analyze-table.md) | 计算表统计信息以提升查询性能 |
| [OPTIMIZE TABLE](60-optimize-table.md) | 压缩或清理历史数据以节省存储空间并提升查询性能 |
| [SET CLUSTER KEY](../06-clusterkey/dml-set-cluster-key.md) | 配置聚簇键以提升大表查询性能 |

:::note
表优化属于高级操作，执行前请仔细阅读文档以避免数据丢失风险。
:::