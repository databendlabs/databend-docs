---
title: Databend 中的数据生命周期
sidebar_label: 数据生命周期
---

Databend 支持熟悉的数据定义语言（DDL）和数据操纵语言（DML）命令，使您能够轻松管理数据库。无论您是在组织、存储、查询、修改还是删除数据，Databend 都遵循您所习惯的同一行业标准。

## 组织数据 {/*organizing-data*/}

在数据库和表中安排您的数据。

关键命令：

- [`CREATE DATABASE`](/sql/sql-commands/ddl/database/ddl-create-database)：创建一个新数据库。
- [`ALTER DATABASE`](/sql/sql-commands/ddl/database/ddl-alter-database)：修改现有数据库。
- [`CREATE TABLE`](/sql/sql-commands/ddl/table/ddl-create-table)：创建一个新表。
- [`ALTER TABLE`](/sql/sql-commands/ddl/table/alter-table-column)：修改现有表。

## 存储数据 {/*storing-data*/}

直接向您的表中添加数据。Databend 还允许将外部文件中的数据导入其表中。

关键命令：

- [`INSERT`](/sql/sql-commands/dml/dml-insert)：向表中添加数据。
- [`COPY INTO <table>`](/sql/sql-commands/dml/dml-copy-into-table)：将外部文件中的数据导入。

## 查询数据 {/*querying-data*/}

数据进入表中后，使用 `SELECT` 来查看和分析它。

关键命令：

- [`SELECT`](/sql/sql-commands/query-syntax/query-select)：从表中获取数据。

## 处理数据 {/*working-with-data*/}

一旦您的数据进入 Databend，您可以根据需要更新、替换、合并或删除它。

关键命令：

- [`UPDATE`](/sql/sql-commands/dml/dml-update)：更改表中的数据。
- [`REPLACE`](/sql/sql-commands/dml/dml-replace)：替换现有数据。
- [`MERGE`](/sql/sql-commands/dml/dml-merge)：通过比较主表和源表或子查询之间的数据，无缝地插入、更新和删除。
- [`DELETE`](/sql/sql-commands/dml/dml-delete-from)：从表中移除数据。

## 移除数据 {/*removing-data*/}

Databend 允许您删除特定数据或整个表和数据库。

关键命令：

- [`TRUNCATE TABLE`](/sql/sql-commands/ddl/table/ddl-truncate-table)：清空表中的数据，但不删除其结构。
- [`DROP TABLE`](/sql/sql-commands/ddl/table/ddl-drop-table)：移除一个表。
- [`DROP DATABASE`](/sql/sql-commands/ddl/database/ddl-drop-database)：删除一个数据库。