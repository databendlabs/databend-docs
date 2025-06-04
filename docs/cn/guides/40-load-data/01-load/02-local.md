---
title: 从本地文件加载
sidebar_label: 本地
---

在将本地数据文件加载到 Databend 前，无需先上传至存储阶段（stage）或存储桶（bucket）。您可直接使用 Databend 原生 CLI 工具 [BendSQL](../../30-sql-clients/00-bendsql/index.md) 导入数据，这能简化工作流程并节省存储费用。

请注意，文件必须是 Databend 支持的格式，否则无法导入数据。关于支持的文件格式，请参阅[输入输出文件格式](/sql/sql-reference/file-format-options)。

## 教程 1 - 从本地文件加载

本教程以 CSV 文件为例，演示如何使用 [BendSQL](../../30-sql-clients/00-bendsql/index.md) 从本地导入数据至 Databend。

### 准备工作

下载示例文件 [books.csv](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv) 并保存至本地文件夹。文件包含两条记录：

```text title='books.csv'
Transaction Processing,Jim Gray,1992
Readings in Database Systems,Michael Stonebraker,2004
```

### 步骤 1. 创建数据库和表

```shell
❯ bendsql
root@localhost:8000/default> CREATE DATABASE book_db;

root@localhost:8000/default> USE book_db;

root@localhost:8000/book_db> CREATE TABLE books
(
    title VARCHAR,
    author VARCHAR,
    date VARCHAR
);

CREATE TABLE books (
  title VARCHAR,
  author VARCHAR,
  date VARCHAR
)
```

### 步骤 2. 加载数据到表

执行以下命令加载数据：

```shell
❯ bendsql --query='INSERT INTO book_db.books VALUES;' --format=csv --data=@books.csv
```

:::note
请确保可通过本地 BendSQL 直连 Databend 的后端对象存储。若无法连接，需添加 `--set presigned_url_disabled=1` 选项禁用预签名 URL 功能。
:::

### 步骤 3. 验证加载数据

```shell
root@localhost:8000/book_db> SELECT * FROM books;

┌───────────────────────────────────────────────────────────────────────┐
│             title            │        author       │       date       │
│       Nullable(String)       │   Nullable(String)  │ Nullable(String) │
├──────────────────────────────┼─────────────────────┼──────────────────┤
│ Transaction Processing       │ Jim Gray            │ 1992             │
│ Readings in Database Systems │ Michael Stonebraker │ 2004             │
└───────────────────────────────────────────────────────────────────────┘
```

## 教程 2 - 加载到指定列

在[教程 1](#tutorial-1---load-from-a-csv-file) 中，您创建了与示例文件完全匹配的三列表。您也可将数据加载到表的指定列，只要列名匹配，表结构无需与数据完全一致。本教程将演示此操作。

### 准备工作

开始前请确保已完成[教程 1](#tutorial-1---load-from-a-csv-file)。

### 步骤 1. 创建表

创建包含额外列 "comments" 的表：

```shell
root@localhost:8000/book_db> CREATE TABLE bookcomments
(
    title VARCHAR,
    author VARCHAR,
    comments VARCHAR,
    date VARCHAR
);

CREATE TABLE bookcomments (
  title VARCHAR,
  author VARCHAR,
  comments VARCHAR,
  date VARCHAR
)

```

### 步骤 2. 加载数据到表

执行以下命令加载数据：

```shell
❯ bendsql --query='INSERT INTO book_db.bookcomments(title,author,date) VALUES;' --format=csv --data=@books.csv
```

注意 `query` 参数显式指定了匹配的列（title、author 和 date）。

### 步骤 3. 验证加载数据

```shell
root@localhost:8000/book_db> SELECT * FROM bookcomments;

┌──────────────────────────────────────────────────────────────────────────────────────────┐
│             title            │        author       │     comments     │       date       │
│       Nullable(String)       │   Nullable(String)  │ Nullable(String) │ Nullable(String) │
├──────────────────────────────┼─────────────────────┼──────────────────┼──────────────────┤
│ Transaction Processing       │ Jim Gray            │ NULL             │ 1992             │
│ Readings in Database Systems │ Michael Stonebraker │ NULL             │ 2004             │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```