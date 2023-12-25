---
title: 从本地文件加载
---

无需先将本地数据文件上传到阶段或存储桶，然后再加载到Databend中。相反，您可以使用 [BendSQL](../../30-sql-clients/00-bendsql/index.md)，Databend的原生CLI工具，直接导入数据。这简化了工作流程，并且可以为您节省存储费用。

请注意，文件必须是Databend支持的格式，否则无法导入数据。有关Databend支持的文件格式的更多信息，请参见 [输入和输出文件格式](/sql/sql-reference/file-format-options)。

## 教程 1 - 从本地文件加载

本教程使用CSV文件作为示例，演示如何使用 [BendSQL](../../30-sql-clients/00-bendsql/index.md) 从本地源导入数据到Databend。

### 开始之前

下载并保存示例文件 [books.csv](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv) 到本地文件夹。该文件包含两条记录：

```text title='books.csv'
Transaction Processing,Jim Gray,1992
Readings in Database Systems,Michael Stonebraker,2004
```

### 步骤 1. 创建数据库和表

```shell
eric@macdeMBP Documents % bendsql
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
eric@macdeMBP Documents % bendsql --query='INSERT INTO book_db.books VALUES;' --format=csv --data=@books.csv
```

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

在[教程 1](#tutorial-1---load-from-a-csv-file)中，您创建了一个表，其中包含三列，这些列与示例文件中的数据完全匹配。您也可以将数据加载到表的指定列中，因此表不需要与要加载的数据具有相同的列，只要指定的列能够匹配即可。本教程将展示如何做到这一点。

### 开始之前

在开始本教程之前，请确保您已完成[教程 1](#tutorial-1---load-from-a-csv-file)。

### 步骤 1. 创建表

创建一个表，与表"books"相比，包含一个额外的名为"comments"的列：

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
eric@macdeMBP Documents % bendsql --query='INSERT INTO book_db.bookcomments(title,author,date) VALUES;' --format=csv --data=@books.csv
```

请注意，上面的`query`部分指定了列（title, author, 和 date）以匹配加载的数据。

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