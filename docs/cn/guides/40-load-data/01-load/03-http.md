---
title: 从远程文件加载
---

要将数据从远程文件加载到Databend中，可以使用 [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table) 命令。该命令允许您轻松地从各种来源，包括远程文件，将数据复制到Databend中。通过COPY INTO，您可以指定源文件位置、文件格式和其他相关参数，以根据您的需求定制导入过程。请注意，文件必须是Databend支持的格式，否则无法导入数据。有关Databend支持的文件格式的更多信息，请参见 [输入与输出文件格式](/sql/sql-reference/file-format-options)。

## 使用Glob模式加载

Databend通过使用glob模式来促进从远程文件加载数据。这些模式允许从遵循特定命名约定的多个文件中高效灵活地导入数据。Databend支持以下glob模式：

### 设置模式

glob表达式中的设置模式使得能够匹配集合中的任何一个字符。例如，考虑名为 `data_file_a.csv`、`data_file_b.csv` 和 `data_file_c.csv` 的文件。使用设置模式从所有三个文件中加载数据：

```sql
COPY INTO your_table 
FROM 'https://your-remote-location/data_file_{a,b,c}.csv' ...
```

### 范围模式

当处理名为 `data_file_001.csv`、`data_file_002.csv` 和 `data_file_003.csv` 的文件时，范围模式变得有用。使用范围模式从这一系列文件中加载数据，如下所示：

```sql
COPY INTO your_table 
FROM 'https://your-remote-location/data_file_[001-003].csv' ...
```

## 教程 - 从远程文件加载

本教程演示如何从远程CSV文件将数据导入到Databend中。示例文件 [books.csv](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv) 包含两条记录：

```text title='books.csv'
Transaction Processing,Jim Gray,1992
Readings in Database Systems,Michael Stonebraker,2004
```

### 第1步. 创建表

```sql
CREATE TABLE books
(
    title VARCHAR,
    author VARCHAR,
    date VARCHAR
);
```

### 第2步. 将数据加载到表中

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

### 第3步. 验证加载的数据

```sql
SELECT * FROM books;
```

```text title='结果:'
┌──────────────────────────────────┬─────────────────────┬───────┐
│ title                            │ author              │ date  │
├──────────────────────────────────┼─────────────────────┼───────┤
│ Transaction Processing           │ Jim Gray            │ 1992  │
│ Readings in Database Systems     │ Michael Stonebraker │ 2004  │
└──────────────────────────────────┴─────────────────────┴───────┘
```