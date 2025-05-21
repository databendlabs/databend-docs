---
title: 查询和转换
slug: querying-stage
---

Databend 引入了一种变革性的数据处理方法，即 ELT（提取、加载、转换）模型。这个模型的重要方面是查询暂存文件中的数据。

您可以使用 `SELECT` 语句查询暂存文件中的数据。此功能适用于以下类型的暂存：

- 用户暂存、内部暂存或外部暂存。
- 在对象存储（如 Amazon S3、Google Cloud Storage 和 Microsoft Azure）中创建的存储桶或容器。
- 可通过 HTTPS 访问的远程服务器。

无论是在加载数据之前还是之后，此功能对于检查或查看暂存文件的内容特别有用。

## 语法

```sql
SELECT [<alias>.]<column> [, <column> ...] | [<alias>.]$<col_position> [, $<col_position> ...]
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]}
[(
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'CSV | TSV | NDJSON | PARQUET | ORC | Avro | <custom_format_name>'],
  [ FILES => ( '<file_name>' [ , '<file_name>' ... ])],
  [ CASE_SENSITIVE => true | false ]
)]
```

:::note
当暂存路径包含空格或括号等特殊字符时，请将整个路径用单引号引起来：
```sql
SELECT * FROM 's3://mybucket/dataset(databend)/' ...
SELECT * FROM 's3://mybucket/dataset databend/' ...
```
:::

## 参数概述

用于暂存文件的 `SELECT` 语句支持各种参数来控制数据访问和解析。有关每个参数的详细信息和示例，请参阅其各自的文档部分：

-   **`FILE_FORMAT`**: 指定文件格式（例如，CSV、TSV、NDJSON、PARQUET、ORC、Avro 或自定义格式）。
-   **`PATTERN`**: 使用正则表达式来匹配和筛选文件名。
-   **`FILES`**: 显式列出要查询的特定文件名。
-   **`CASE_SENSITIVE`**: 控制 Parquet 文件中列名的大小写敏感性。
-   **`table_alias`**: 为暂存文件分配别名，以便在查询中更轻松地引用。
-   **`$col_position`**: 按位置索引（从 1 开始）选择列。
-   **`connection_parameters`**: 提供外部存储的连接详细信息。
-   **`uri`**: 指定远程文件的 URI。

## 限制

查询暂存文件时，以下特定于格式的约束适用：

-   仅 Parquet 文件支持使用 `*` 选择所有字段。
-   对于 CSV 或 TSV 文件：
    -   所有字段都解析为字符串。
    -   仅允许使用列位置 (`$N`) 进行选择。
    -   文件中的字段数不得超过 `max.N+1000`。例如，如果语句是 `SELECT $1, $2 FROM @my_stage (FILES=>('sample.csv'))`，则 `sample.csv` 最多可以有 1,002 个字段。

## 教程

### 教程 1：从 Stage 查询数据

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

此示例演示如何查询存储在不同位置的 Parquet 文件中的数据。单击下面的选项卡以查看详细信息。

<Tabs groupId="query2stage">
<TabItem value="Stages" label="Stages">

假设您已将 `books.parquet` ([link](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet)) 上传到您的用户暂存、内部暂存 (`_my_internal_stage_`) 和外部暂存 (`_my_external_stage_`)。使用 [PRESIGN](/sql/sql-commands/ddl/stage/presign) 上传文件。

```sql
-- Query file in user stage
SELECT * FROM @~/books.parquet;

-- Query file in internal stage
SELECT * FROM @my_internal_stage/books.parquet;

-- Query file in external stage
SELECT * FROM @my_external_stage/books.parquet;
```

</TabItem>
<TabItem value="Bucket" label="Bucket">

假设 `books.parquet` ([link](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet)) 位于 Amazon S3 存储桶 (`databend-toronto`，区域 `us-east-2`) 中。通过指定连接参数进行查询：

```sql
SELECT
    *
FROM
    's3://databend-toronto' (
        CONNECTION => (
            ACCESS_KEY_ID = '<your-access-key-id>',
            SECRET_ACCESS_KEY = '<your-secret-access-key>',
            ENDPOINT_URL = 'https://databend-toronto.s3.us-east-2.amazonaws.com'
        ),
        FILES => ('books.parquet')
    );
```

</TabItem>
<TabItem value="Remote" label="Remote">

假设 `books.parquet` ([link](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet)) 位于远程服务器上。通过指定文件 URI 进行查询：

```sql
SELECT * FROM 'https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet';
```

</TabItem>
</Tabs>

### 教程 2：使用 PATTERN 和 FILES 查询数据

假设您在 Amazon S3 存储桶 (`databend-toronto`，区域 `us-east-2`) 中有具有相同 schema 的 Parquet 文件：

```text
databend-toronto/
  ├── books-2023.parquet
  ├── books-2022.parquet
  ├── books-2021.parquet
  ├── books-2020.parquet
  └── books-2019.parquet
```

要使用 `PATTERN` 查询文件夹中的所有 Parquet 文件：

```sql
SELECT
    *
FROM
    's3://databend-toronto' (
        CONNECTION => (
            ACCESS_KEY_ID = '<your-access-key-id>',
            SECRET_ACCESS_KEY = '<your-secret_access_key>',
            ENDPOINT_URL = 'https://databend-toronto.s3.us-east-2.amazonaws.com'
        ),
        PATTERN => '.*parquet'
    );
```

要使用 `FILES` 查询特定的 Parquet 文件（“books-2023.parquet”、“books-2022.parquet”和“books-2021.parquet”）：

```sql
SELECT
    *
FROM
    's3://databend-toronto' (
        CONNECTION => (
            ACCESS_KEY_ID = '<your-access-key-id>',
            SECRET_ACCESS_KEY = '<your-secret_access_key>',
            ENDPOINT_URL = 'https://databend-toronto.s3.us-east-2.amazonaws.com'
        ),
        FILES => (
            'books-2023.parquet',
            'books-2022.parquet',
            'books-2021.parquet'
        )
    );
```