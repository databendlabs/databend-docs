title: 从远程文件导入数据
sidebar_label: 远程文件

要将远程文件数据加载到 Databend 中，可以使用 [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table) 命令。该命令支持从多种数据源（包括远程文件）轻松地将数据复制到 Databend。通过 COPY INTO 命令，您可以指定源文件位置、文件格式等相关参数来定制导入过程。请注意，文件必须是 Databend 支持的格式，否则无法导入数据。有关 Databend 支持的文件格式的更多信息，请参阅 [输入输出文件格式](/sql/sql-reference/file-format-options)。

## 使用通配模式导入数据

Databend 通过通配模式简化了从远程文件加载数据的过程。这些模式可以高效灵活地从符合特定命名规则的多个文件中导入数据。Databend 支持以下通配模式：

### 集合模式

通配表达式中的集合模式可以匹配集合中的任意一个字符。例如，对于名为 `data_file_a.csv`、`data_file_b.csv` 和 `data_file_c.csv` 的文件，可以使用集合模式导入这三个文件的数据：

```sql
COPY INTO your_table 
FROM 'https://your-remote-location/data_file_{a,b,c}.csv' ...
```

### 范围模式

当处理诸如 `data_file_001.csv`、`data_file_002.csv` 和 `data_file_003.csv` 等按序号命名的文件时，范围模式非常有用。使用范围模式导入这一系列文件数据的示例如下：

```sql
COPY INTO your_table 
FROM 'https://your-remote-location/data_file_[001-003].csv' ...
```

## 教程 - 从远程文件加载数据

本教程演示如何从远程 CSV 文件将数据导入到 Databend。示例文件 [books.csv](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv) 包含两条记录：

```text title='books.csv'
Transaction Processing,Jim Gray,1992
Readings in Database Systems,Michael Stonebraker,2004
```

### 步骤 1. 创建表

```sql
CREATE TABLE books
(
    title VARCHAR,
    author VARCHAR,
    date VARCHAR
);
```

### 步骤 2. 导入数据到表

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

### 步骤 3. 验证导入的数据

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
