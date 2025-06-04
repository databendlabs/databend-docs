---
title: 从远程文件加载
sidebar_label: 远程
---

若需将远程文件数据加载至 Databend，可使用 [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table) 命令。该命令支持从多种数据源（包括远程文件）轻松导入数据至 Databend。通过 COPY INTO 命令，您可指定源文件位置、文件格式及其他相关参数，从而按需定制导入过程。请注意，文件必须为 Databend 支持的格式，否则将无法导入数据。有关支持的文件格式详情，请参阅[输入输出文件格式](/sql/sql-reference/file-format-options)。

## 使用通配符模式加载

Databend 支持通过通配符模式从远程文件加载数据。这些模式可高效灵活地导入符合特定命名规则的多个文件数据。Databend 支持以下通配符模式：

### 集合模式

通配符表达式中的集合模式可匹配方括号内任意字符。例如对于文件 `data_file_a.csv`、`data_file_b.csv` 和 `data_file_c.csv`，可通过集合模式同时加载三者数据：

```sql
COPY INTO your_table 
FROM 'https://your-remote-location/data_file_{a,b,c}.csv' ...
```

### 范围模式

当处理序列化命名的文件（如 `data_file_001.csv`、`data_file_002.csv`、`data_file_003.csv`）时，范围模式尤为实用。加载该系列文件示例如下：

```sql
COPY INTO your_table 
FROM 'https://your-remote-location/data_file_[001-003].csv' ...
```

## 教程 - 从远程文件加载

本教程演示如何将远程 CSV 文件数据导入 Databend。示例文件 [books.csv](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv) 包含两条记录：

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

### 步骤 2. 导入数据至表

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

### 步骤 3. 验证数据

```sql
SELECT * FROM books;
```

```text title='结果：'
┌──────────────────────────────────┬─────────────────────┬───────┐
│ title                            │ author              │ date  │
├──────────────────────────────────┼─────────────────────┼───────┤
│ Transaction Processing           │ Jim Gray            │ 1992  │
│ Readings in Database Systems     │ Michael Stonebraker │ 2004  │
└──────────────────────────────────┴─────────────────────┴───────┘
```