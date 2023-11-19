---
title: Loading from Local File
---

Uploading your local data files to a stage or bucket before loading them into Databend can be unnecessary. Instead, you can use [BendSQL](/13-sql-clients/01-bendsql.md), the Databend native CLI tool, to directly import the data. This simplifies the workflow and can save you storage fees.

Please note that the files must be in a format supported by Databend, otherwise the data cannot be imported. For more information on the file formats supported by Databend, see [Input & Output File Formats](/13-sql-reference/50-file-format-options.md).

## Tutorial 1 - Load from a Local File

This tutorial uses a CSV file as an example to demonstrate how to import data into Databend using [BendSQL](/13-sql-clients/01-bendsql.md) from a local source.

### Before You Begin

Download and save the sample file [books.csv](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv) to a local folder. The file contains two records:

```text title='books.csv'
Transaction Processing,Jim Gray,1992
Readings in Database Systems,Michael Stonebraker,2004
```

### Step 1. Create Database and Table

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

### Step 2. Load Data into Table

Send loading data request with the following command:

```shell
eric@macdeMBP Documents % bendsql --query='INSERT INTO book_db.books VALUES;' --format=csv --data=@books.csv
```

### Step 3. Verify Loaded Data

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

## Tutorial 2 - Load into Specified Columns

In [Tutorial 1](#tutorial-1---load-from-a-csv-file), you created a table containing three columns that exactly match the data in the sample file. You can also load data into specified columns of a table, so the table does not need to have the same columns as the data to be loaded as long as the specified columns can match. This tutorial shows how to do that.

### Before You Begin

Before you start this tutorial, make sure you have completed [Tutorial 1](#tutorial-1---load-from-a-csv-file).

### Step 1. Create Table

Create a table including an extra column named "comments" compared to the table "books":

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

### Step 2. Load Data into Table

Send loading data request with the following command:

```shell
eric@macdeMBP Documents % bendsql --query='INSERT INTO book_db.bookcomments(title,author,date) VALUES;' --format=csv --data=@books.csv
```

Notice that the `query` part above specifies the columns (title, author, and date) to match the loaded data.

### Step 3. Verify Loaded Data

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