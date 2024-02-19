---
title: Databend中的数据生命周期
sidebar_label: 数据生命周期
---

Databend 支持熟悉的数据定义语言（DDL）和数据操作语言（DML）命令，使您能够轻松管理数据库。无论是组织、存储、查询、修改还是删除数据，Databend 都遵循您所习惯的同一行业标准。

## Databend 对象

Databend 支持以下对象并可创建和修改它们：

- 数据库
- 表
- 外部表
- 流
- 视图
- 索引
- Stage
- 文件格式
- 连接（`CONNECTION`）
- 用户定义函数（UDF）
- 外部函数
- 用户
- 角色
- 授权
- 计算集群（`WAREHOUSE`）
- 管道
- 任务

## 组织数据

在数据库和表中组织您的数据。

关键命令：

- [`CREATE DATABASE`](/sql/sql-commands/ddl/database/ddl-create-database)：创建新数据库。
- [`ALTER DATABASE`](/sql/sql-commands/ddl/database/ddl-alter-database)：修改现有数据库。
- [`CREATE TABLE`](/sql/sql-commands/ddl/table/ddl-create-table)：创建新表。
- [`ALTER TABLE`](/sql/sql-commands/ddl/table/alter-table-column)：修改现有表。

## 存储数据

直接向表中添加数据。Databend 还允许将外部文件中的数据导入其表中。

关键命令：

- [`INSERT`](/sql/sql-commands/dml/dml-insert)：向表中添加数据。
- [`COPY INTO <table>`](/sql/sql-commands/dml/dml-copy-into-table)：从外部文件中导入数据。

## 查询数据

数据在表中后，使用`SELECT`来查看和分析它。

关键命令：

- [`SELECT`](/sql/sql-commands/query-syntax/query-select)：从表中获取数据。

## 处理数据

一旦您的数据在 Databend 中，您可以根据需要更新、替换、合并或删除它。

关键命令：

- [`UPDATE`](/sql/sql-commands/dml/dml-update)：更改表中的数据。
- [`REPLACE`](/sql/sql-commands/dml/dml-replace)：替换现有数据。
- [`MERGE`](/sql/sql-commands/dml/dml-merge)：通过比较主表和源表或子查询之间的数据，无缝地插入、更新和删除。
- [`DELETE`](/sql/sql-commands/dml/dml-delete-from)：从表中删除数据。

## 删除数据

Databend 允许您删除特定数据或整个表和数据库。

关键命令：

- [`TRUNCATE TABLE`](/sql/sql-commands/ddl/table/ddl-truncate-table)：清空表而不删除其结构。
- [`DROP TABLE`](/sql/sql-commands/ddl/table/ddl-drop-table)：移除表。
- [`DROP DATABASE`](/sql/sql-commands/ddl/database/ddl-drop-database)：删除数据库。
