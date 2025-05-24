---
title: 从 Stage 加载数据
sidebar_label: Stage
---

Databend 允许您轻松地从上传到用户 Stage 或内部/外部 Stage 的文件中导入数据。为此，您可以首先使用 [BendSQL](../../30-sql-clients/00-bendsql/index.md) 将文件上传到 Stage，然后使用 [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table) 命令从 Stage 文件中加载数据。请注意，文件必须是 Databend 支持的格式，否则无法导入数据。有关 Databend 支持的文件格式的更多信息，请参阅 [输入和输出文件格式](/sql/sql-reference/file-format-options)。

![image](/img/load/load-data-from-stage.jpeg)

以下教程提供了详细的分步指南，可帮助您有效地完成从 Stage 文件加载数据的过程。

## 开始之前

在开始之前，请确保您已完成以下任务：

- 下载并将示例文件 [books.parquet](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet) 保存到本地文件夹。该文件包含两条记录：

```text
Transaction Processing,Jim Gray,1992
Readings in Database Systems,Michael Stonebraker,2004
```

- 使用以下 SQL 语句在 Databend 中创建表：

```sql
USE default;
CREATE TABLE books
(
    title VARCHAR,
    author VARCHAR,
    date VARCHAR
);
```

## 教程 1：从用户 Stage 加载数据

按照本教程将示例文件上传到用户 Stage 并将数据从 Stage 文件加载到 Databend 中。

### 步骤 1：上传示例文件

1. 使用 [BendSQL](../../30-sql-clients/00-bendsql/index.md) 上传示例文件：

```sql
root@localhost:8000/default> PUT fs:///Users/eric/Documents/books.parquet @~

┌───────────────────────────────────────────────┐
│                 file                │  status │
│                String               │  String │
├─────────────────────────────────────┼─────────┤
│ /Users/eric/Documents/books.parquet │ SUCCESS │
└───────────────────────────────────────────────┘
```

2. 验证 Stage 文件：

```sql
LIST @~;

name         |size|md5                               |last_modified                |creator|
-------------+----+----------------------------------+-----------------------------+-------+
books.parquet| 998|"88432bf90aadb79073682988b39d461c"|2023-06-27 16:03:51.000 +0000|       |
```

### 步骤 2：将数据复制到表中

1. 使用 [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table) 命令将数据加载到目标表中：

```sql
COPY INTO books FROM @~ files=('books.parquet') FILE_FORMAT = (TYPE = PARQUET);
```

2. 验证加载的数据：

```sql
SELECT * FROM books;

---
title                       |author             |date|
----------------------------+-------------------+----+
Transaction Processing      |Jim Gray           |1992|
Readings in Database Systems|Michael Stonebraker|2004|
```

## 教程 2：从内部 Stage 加载数据

按照本教程将示例文件上传到内部 Stage 并将数据从 Stage 文件加载到 Databend 中。

### 步骤 1：创建内部 Stage

1. 使用 [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) 命令创建内部 Stage：

```sql
CREATE STAGE my_internal_stage;
```
2. 验证创建的 Stage：

```sql
SHOW STAGES;

name             |stage_type|number_of_files|creator   |comment|
-----------------+----------+---------------+----------+-------+
my_internal_stage|Internal  |              0|'root'@'%'|       |
```

### 步骤 2：上传示例文件

1. 使用 [BendSQL](../../30-sql-clients/00-bendsql/index.md) 上传示例文件：

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

2. 验证 Stage 文件：

```sql
LIST @my_internal_stage;

name                               |size  |md5                               |last_modified                |creator|
-----------------------------------+------+----------------------------------+-----------------------------+-------+
books.parquet                      |   998|"88432bf90aadb79073682988b39d461c"|2023-06-28 02:32:15.000 +0000|       |
```

### 步骤 3：将数据复制到表中

1. 使用 [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table) 命令将数据加载到目标表中：

```sql
COPY INTO books 
FROM @my_internal_stage 
FILES = ('books.parquet') 
FILE_FORMAT = (
    TYPE = 'PARQUET'
);
```
2. 验证加载的数据：

```sql
SELECT * FROM books;

---
title                       |author             |date|
----------------------------+-------------------+----+
Transaction Processing      |Jim Gray           |1992|
Readings in Database Systems|Michael Stonebraker|2004|
```

## 教程 3：从外部 Stage 加载数据

按照本教程将示例文件上传到外部 Stage 并将数据从 Stage 文件加载到 Databend 中。

### 步骤 1：创建外部 Stage

1. 使用 [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) 命令创建外部 Stage：

```sql
CREATE STAGE my_external_stage
    URL = 's3://databend'
    CONNECTION = (
        ENDPOINT_URL = 'http://127.0.0.1:9000', 
        AWS_KEY_ID = 'ROOTUSER', 
        AWS_SECRET_KEY = 'CHANGEME123'
    );
```

2. 验证创建的 Stage：

```sql
SHOW STAGES;

name             |stage_type|number_of_files|creator           |comment|
-----------------+----------+---------------+------------------+-------+
my_external_stage|External  |               |'root'@'%'|       |
```

### 步骤 2：上传示例文件

1. 使用 [BendSQL](../../30-sql-clients/00-bendsql/index.md) 上传示例文件：

```sql
root@localhost:8000/default> PUT fs:///Users/eric/Documents/books.parquet @my_external_stage

┌───────────────────────────────────────────────┐
│                 file                │  status │
│                String               │  String │
├─────────────────────────────────────┼─────────┤
│ /Users/eric/Documents/books.parquet │ SUCCESS │
└───────────────────────────────────────────────┘
```

2. 验证 Stage 文件：

```sql
LIST @my_external_stage;

name         |size|md5                               |last_modified                |creator|
-------------+----+----------------------------------+-----------------------------+-------+
books.parquet| 998|"88432bf90aadb79073682988b39d461c"|2023-06-28 04:13:15.178 +0000|       |
```

### 步骤 3：将数据复制到表中

1. 使用 [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table) 命令将数据加载到目标表中：

```sql
COPY INTO books
FROM @my_external_stage
FILES = ('books.parquet')
FILE_FORMAT = (
    TYPE = 'PARQUET'
);
```
2. 验证加载的数据：

```sql
SELECT * FROM books;

---
title                       |author             |date|
----------------------------+-------------------+----+
Transaction Processing      |Jim Gray           |1992|
Readings in Database Systems|Michael Stonebraker|2004|
```