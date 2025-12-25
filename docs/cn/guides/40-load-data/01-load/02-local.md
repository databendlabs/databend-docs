---
title: 从本地文件导入数据
sidebar_label: 本地文件
---

在将本地数据文件加载到 Databend 之前，无需先上传到 stage 或存储桶。您可以直接使用 Databend 原生 CLI 工具 [BendSQL](../../35-connect/00-sql-clients/bendsql.md) 导入数据，这简化了工作流程并可能节省存储费用。

请注意，文件必须是 Databend 支持的格式，否则无法导入数据。有关 Databend 支持的文件格式的更多信息，请参阅 [输入输出文件格式](/sql/sql-reference/file-format-options)。

## 教程 1 - 从本地文件导入

本教程以 CSV 文件为例，演示如何使用 [BendSQL](../../35-connect/00-sql-clients/bendsql.md) 从本地源将数据导入 Databend。

### 准备工作

下载示例文件 [books.csv](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv) 并保存到本地文件夹。该文件包含两条记录：

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

使用以下命令发送数据加载请求：

```shell
❯ bendsql --query='INSERT INTO book_db.books VALUES;' --format=csv --data=@books.csv
```

:::note
请确保本地 BendSQL 能直接连接到 Databend 的后端对象存储。
如果无法连接，则需要指定 `--set presigned_url_disabled=1` 选项来禁用预签名 URL 功能。
:::

### 步骤 3. 验证加载的数据

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

## 教程 2 - 导入到指定列

在 [教程 1](#tutorial-1---load-from-a-csv-file) 中，您创建了一个包含三列的表，这些列与示例文件中的数据完全匹配。您也可以将数据加载到表的指定列中，这样只要指定列能匹配，表就不需要具有与要导入数据相同的列。本教程展示如何实现这一点。

### 准备工作

开始本教程前，请确保已完成 [教程 1](#tutorial-1---load-from-a-csv-file)。

### 步骤 1. 创建表

创建一个比 "books" 表多一个名为 "comments" 列的表：

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

使用以下命令发送数据加载请求：

```shell
❯ bendsql --query='INSERT INTO book_db.bookcomments(title,author,date) VALUES;' --format=csv --data=@books.csv
```

注意上面的 `query` 部分指定了列 (title、author 和 date) 以匹配加载的数据。

### 步骤 3. 验证加载的数据

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