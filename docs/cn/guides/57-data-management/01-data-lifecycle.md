---
title: Databend 中的数据生命周期
sidebar_label: 数据生命周期
---

Databend 支持常用的数据定义语言 (DDL) 和数据操作语言 (DML) 命令，使您可以轻松管理数据库。 无论是组织、存储、查询、修改还是删除数据，Databend 都遵循您所熟悉的行业标准。

## Databend 对象

Databend 支持以下对象来创建和修改它们：

- Database
- Table
- External Table
- Stream
- View
- Index
- Stage
- File Format
- Connection
- User Defined Function (UDF)
- External Function
- User
- Role
- Grants
- Warehouse
- Pipe
- Task

## 组织数据

在数据库和表中组织您的数据。

主要命令：

- [`CREATE DATABASE`](/sql/sql-commands/ddl/database/ddl-create-database)：用于创建新数据库。
- [`ALTER DATABASE`](/sql/sql-commands/ddl/database/ddl-alter-database)：用于修改现有数据库。
- [`CREATE TABLE`](/sql/sql-commands/ddl/table/ddl-create-table)：用于创建新表。
- [`ALTER TABLE`](/sql/sql-commands/ddl/table/alter-table-column)：用于修改现有表。

## 存储数据

直接将数据添加到您的表中。 Databend 还允许将外部文件中的数据导入到其表中。

主要命令：

- [`INSERT`](/sql/sql-commands/dml/dml-insert)：用于向表中添加数据。
- [`COPY INTO <table>`](/sql/sql-commands/dml/dml-copy-into-table)：用于从外部文件引入数据。

## 查询数据

将数据放入表后，使用 `SELECT` 查看和分析它。

主要命令：

- [`SELECT`](/sql/sql-commands/query-syntax/query-select)：用于从表中获取数据。

## 使用数据

将数据放入 Databend 后，您可以根据需要更新、替换、合并或删除它。

主要命令：

- [`UPDATE`](/sql/sql-commands/dml/dml-update)：用于更改表中的数据。
- [`REPLACE`](/sql/sql-commands/dml/dml-replace)：用于替换现有数据。
- [`MERGE`](/sql/sql-commands/dml/dml-merge)：通过比较主表和源表或子查询之间的数据，无缝地插入、更新和删除。
- [`DELETE`](/sql/sql-commands/dml/dml-delete-from)：用于从表中删除数据。

## 删除数据

Databend 允许您删除特定数据或整个表和数据库。

主要命令：

- [`TRUNCATE TABLE`](/sql/sql-commands/ddl/table/ddl-truncate-table)：用于清除表而不删除其结构。
- [`DROP TABLE`](/sql/sql-commands/ddl/table/ddl-drop-table)：用于删除表。
- [`DROP DATABASE`](/sql/sql-commands/ddl/database/ddl-drop-database)：用于删除数据库。