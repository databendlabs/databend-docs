---
title: 从本地文件加载
---

在将本地数据文件加载到 Databend 之前，上传到 Stage 或 Bucket 可能是不必要的。相反，您可以使用 Databend 原生 CLI 工具 [BendSQL](../../30-sql-clients/00-bendsql/index.md) 直接导入数据。这简化了工作流程，并可以节省存储费用。

请注意，文件必须采用 Databend 支持的格式，否则数据无法导入。有关 Databend 支持的文件格式的更多信息，请参阅 [输入 & 输出文件格式](/sql/sql-reference/file-format-options)。

## 教程 1 - 从本地文件加载

本教程以 CSV 文件为例，演示如何使用 [BendSQL](../../30-sql-clients/00-bendsql/index.md) 从本地源导入数据到 Databend。

### 开始之前

下载并保存示例文件 [books.csv](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv) 到本地文件夹。该文件包含两条记录：

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
确保您能够直接从本地 BendSQL 连接到 Databend 的后端对象存储。
如果不能，则需要指定 `--set presigned_url_disabled=1` 选项以禁用预签名 URL 功能。
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

在 [教程 1](#tutorial-1---load-from-a-csv-file) 中，您创建了一个包含三列的表，这些列与示例文件中的数据完全匹配。您还可以将数据加载到表的指定列中，因此表不需要与要加载的数据具有相同的列，只要指定的列可以匹配即可。本教程展示了如何做到这一点。

### 开始之前

在开始本教程之前，请确保您已完成 [教程 1](#tutorial-1---load-from-a-csv-file)。

### 步骤 1. 创建表

创建一个包含额外列 "comments" 的表，与 "books" 表相比：

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

请注意，上面的 `query` 部分指定了要匹配加载数据的列（title、author 和 date）。

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