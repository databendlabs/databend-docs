---
title: 从本地文件加载
sidebar_label: Local
---

在将本地数据文件加载到 Databend 之前，将其上传到 Stage 或 Bucket 可能没有必要。相反，您可以使用 [BendSQL](../../30-sql-clients/00-bendsql/index.md) ( Databend 的原生 CLI 工具 ) 直接导入数据。这简化了工作流程，并可以节省存储费用。

请注意，文件必须是 Databend 支持的格式，否则无法导入数据。有关 Databend 支持的文件格式的更多信息，请参阅 [输入和输出文件格式](/sql/sql-reference/file-format-options)。

## 教程 1 - 从本地文件加载

本教程以 CSV 文件为例，演示如何使用 [BendSQL](../../30-sql-clients/00-bendsql/index.md) 从本地源将数据导入 Databend。

### 开始之前

下载示例文件 [books.csv](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv) 并将其保存到本地文件夹。该文件包含两条记录：

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

### 步骤 2. 将数据加载到表中

使用以下命令发送加载数据请求：

```shell
❯ bendsql --query='INSERT INTO book_db.books VALUES;' --format=csv --data=@books.csv
```

:::note
请确保您可以直接从本地 BendSQL 连接到 Databend 的后端对象存储。
如果不能，则需要指定 `--set presigned_url_disabled=1` 选项来禁用预签名 URL 功能。
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

## 教程 2 - 加载到指定列

在 [教程 1 - 从 CSV 文件加载](#tutorial-1---load-from-a-csv-file) 中，您创建了一个包含三列的表，这些列与示例数据完全匹配。您还可以将数据加载到表的指定列中，因此只要指定列可以匹配，表就不需要与要加载的数据具有相同的列。本教程将展示如何实现这一点。

### 开始之前

在开始本教程之前，请确保您已完成 [教程 1 - 从 CSV 文件加载](#tutorial-1---load-from-a-csv-file)。

### 步骤 1. 创建表

创建一个表，其中包含一个名为 "comments" 的额外列，与表 "books" 相比：

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

### 步骤 2. 将数据加载到表中

使用以下命令发送加载数据请求：

```shell
❯ bendsql --query='INSERT INTO book_db.bookcomments(title,author,date) VALUES;' --format=csv --data=@books.csv
```

请注意，上面的 `query` 部分指定了要与加载数据匹配的列 ( title、author 和 date )。

### 3. 验证加载的数据

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