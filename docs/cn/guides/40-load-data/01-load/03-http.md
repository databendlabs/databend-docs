---
title: 从远程文件加载
sidebar_label: 远程
---

要将数据从远程文件加载到 Databend，可以使用 [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table) 命令。此命令允许您轻松地将数据从各种来源（包括远程文件）复制到 Databend 中。使用 COPY INTO，您可以指定源文件位置、文件格式和其他相关参数，以根据您的需求定制导入过程。请注意，文件必须是 Databend 支持的格式，否则无法导入数据。有关 Databend 支持的文件格式的更多信息，请参见 [输入 & 输出文件格式](/sql/sql-reference/file-format-options)。

## 使用 Glob 模式加载

Databend 通过使用 glob 模式，可以方便地从远程文件加载数据。这些模式允许从遵循特定命名约定的多个文件中高效且灵活地导入数据。Databend 支持以下 glob 模式：

### 集合模式

glob 表达式中的集合模式允许匹配集合中的任何一个字符。例如，假设文件名为 `data_file_a.csv`、`data_file_b.csv` 和 `data_file_c.csv`。使用集合模式从所有三个文件加载数据：

```sql
COPY INTO your_table 
FROM 'https://your-remote-location/data_file_{a,b,c}.csv' ...
```

### 范围模式

当处理名为 `data_file_001.csv`、`data_file_002.csv` 和 `data_file_003.csv` 的文件时，范围模式非常有用。使用如下范围模式从此系列文件加载数据：

```sql
COPY INTO your_table 
FROM 'https://your-remote-location/data_file_[001-003].csv' ...
```

## 教程 - 从远程文件加载

本教程演示如何从远程 CSV 文件将数据导入到 Databend 中。示例文件 [books.csv](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv) 包含两条记录：

```text title='books.csv'
Transaction Processing,Jim Gray,1992
Readings in Database Systems,Michael Stonebraker,2004
```

### Step 1. 创建表

```sql
CREATE TABLE books
(
    title VARCHAR,
    author VARCHAR,
    date VARCHAR
);
```

### Step 2. 将数据加载到表中

```sql
COPY INTO books
FROM 'https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv'
FILE_FORMAT = (
    TYPE = 'CSV',
    FIELD_DELIMITER = ',',
    RECORD_DELIMITER = '\n',
    SKIP_HEADER = 0
);
```

### Step 3. 验证加载的数据

```sql
SELECT * FROM books;
```

```text title='Result:'
┌──────────────────────────────────┬─────────────────────┬───────┐
│ title                            │ author              │ date  │
├──────────────────────────────────┼─────────────────────┼───────┤
│ Transaction Processing           │ Jim Gray            │ 1992  │
│ Readings in Database Systems     │ Michael Stonebraker │ 2004  │
└──────────────────────────────────┴─────────────────────┴───────┘
```