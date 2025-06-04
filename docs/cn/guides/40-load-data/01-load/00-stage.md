---
title: 从暂存区（Stage）加载数据
sidebar_label: 暂存区（Stage）
---

Databend 支持从用户暂存区（User Stage）或内部/外部暂存区（Internal/External Stage）轻松导入文件数据。您可先通过 [BendSQL](../../30-sql-clients/00-bendsql/index.md) 将文件上传至暂存区，再使用 [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table) 命令加载数据。注意：文件必须为 Databend 支持的格式，否则无法导入。完整支持格式详见[输入输出文件格式](/sql/sql-reference/file-format-options)。

![image](/img/load/load-data-from-stage.jpeg)

以下教程将分步指导您完成从暂存区加载数据的完整流程。

## 开始之前

请确保已完成以下准备工作：

- 下载示例文件 [books.parquet](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet) 至本地，该文件包含两条记录：

```text
Transaction Processing,Jim Gray,1992
Readings in Database Systems,Michael Stonebraker,2004
```

- 在 Databend 中执行以下建表语句：

```sql
USE default;
CREATE TABLE books
(
    title VARCHAR,
    author VARCHAR,
    date VARCHAR
);
```

## 教程 1：从用户暂存区加载数据

本教程演示如何将文件上传至用户暂存区（User Stage）并导入数据。

### 步骤 1：上传文件

1. 通过 [BendSQL](../../30-sql-clients/00-bendsql/index.md) 上传文件：

```sql
root@localhost:8000/default> PUT fs:///Users/eric/Documents/books.parquet @~

┌───────────────────────────────────────────────┐
│                 file                │  status │
│                String               │  String │
├─────────────────────────────────────┼─────────┤
│ /Users/eric/Documents/books.parquet │ SUCCESS │
└───────────────────────────────────────────────┘
```

2. 验证上传结果：

```sql
LIST @~;

name         |size|md5                               |last_modified                |creator|
-------------+----+----------------------------------+-----------------------------+-------+
books.parquet| 998|"88432bf90aadb79073682988b39d461c"|2023-06-27 16:03:51.000 +0000|       |
```

### 步骤 2：导入数据

1. 执行 [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table) 导入数据：

```sql
COPY INTO books FROM @~ files=('books.parquet') FILE_FORMAT = (TYPE = PARQUET);
```

2. 验证数据：

```sql
SELECT * FROM books;

---
title                       |author             |date|
----------------------------+-------------------+----+
Transaction Processing      |Jim Gray           |1992|
Readings in Database Systems|Michael Stonebraker|2004|
```

## 教程 2：从内部暂存区加载数据

本教程演示如何将文件上传至内部暂存区（Internal Stage）并导入数据。

### 步骤 1：创建内部暂存区

1. 创建内部暂存区：

```sql
CREATE STAGE my_internal_stage;
```
2. 验证创建结果：

```sql
SHOW STAGES;

name             |stage_type|number_of_files|creator   |comment|
-----------------+----------+---------------+----------+-------+
my_internal_stage|Internal  |              0|'root'@'%'|       |
```

### 步骤 2：上传文件

1. 上传文件至内部暂存区：

```sql
root@localhost:8000/default> CREATE STAGE my_internal_stage;

root@localhost:8000/default> PUT fs:///Users/eric/Documents/books.parquet @my_internal_stage

┌───────────────────────────────────────────────┐
│                 file                │  status │
│                String               │  String │
├─────────────────────────────────────┼─────────┤
│ /Users/eric/Documents/books.parquet │ SUCCESS │
└───────────────────────────────────────────────┘
```

2. 验证上传结果：

```sql
LIST @my_internal_stage;

name                               |size  |md5                               |last_modified                |creator|
-----------------------------------+------+----------------------------------+-----------------------------+-------+
books.parquet                      |   998|"88432bf90aadb79073682988b39d461c"|2023-06-28 02:32:15.000 +0000|       |
```

### 步骤 3：导入数据

1. 执行数据导入命令：

```sql
COPY INTO books 
FROM @my_internal_stage 
FILES = ('books.parquet') 
FILE_FORMAT = (
    TYPE = 'PARQUET'
);
```
2. 验证数据：

```sql
SELECT * FROM books;

---
title                       |author             |date|
----------------------------+-------------------+----+
Transaction Processing      |Jim Gray           |1992|
Readings in Database Systems|Michael Stonebraker|2004|
```

## 教程 3：从外部暂存区加载数据

本教程演示如何将文件上传至外部暂存区（External Stage）并导入数据。

### 步骤 1：创建外部暂存区

1. 创建外部暂存区：

```sql
CREATE STAGE my_external_stage
    URL = 's3://databend'
    CONNECTION = (
        ENDPOINT_URL = 'http://127.0.0.1:9000', 
        AWS_KEY_ID = 'ROOTUSER', 
        AWS_SECRET_KEY = 'CHANGEME123'
    );
```

2. 验证创建结果：

```sql
SHOW STAGES;

name             |stage_type|number_of_files|creator           |comment|
-----------------+----------+---------------+------------------+-------+
my_external_stage|External  |               |'root'@'%'|       |
```

### 步骤 2：上传文件

1. 上传文件至外部暂存区：

```sql
root@localhost:8000/default> PUT fs:///Users/eric/Documents/books.parquet @my_external_stage

┌───────────────────────────────────────────────┐
│                 file                │  status │
│                String               │  String │
├─────────────────────────────────────┼─────────┤
│ /Users/eric/Documents/books.parquet │ SUCCESS │
└───────────────────────────────────────────────┘
```

2. 验证上传结果：

```sql
LIST @my_external_stage;

name         |size|md5                               |last_modified                |creator|
-------------+----+----------------------------------+-----------------------------+-------+
books.parquet| 998|"88432bf90aadb79073682988b39d461c"|2023-06-28 04:13:15.178 +0000|       |
```

### 步骤 3：导入数据

1. 执行数据导入命令：

```sql
COPY INTO books
FROM @my_external_stage
FILES = ('books.parquet')
FILE_FORMAT = (
    TYPE = 'PARQUET'
);
```
2. 验证数据：

```sql
SELECT * FROM books;

---
title                       |author             |date|
----------------------------+-------------------+----+
Transaction Processing      |Jim Gray           |1992|
Readings in Database Systems|Michael Stonebraker|2004|
```