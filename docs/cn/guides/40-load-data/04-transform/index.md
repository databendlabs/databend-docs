---
title: 查询与转换
slug: querying-stage
---

Databend 通过其 ELT（提取、加载、转换）模型引入了数据处理的创新方法。该模型的一个重要方面是查询暂存文件中的数据。

您可以使用 `SELECT` 语句查询暂存文件中的数据。此功能适用于以下类型的暂存区：

- 用户暂存区、内部暂存区或外部暂存区。
- 在您的对象存储（如 Amazon S3、Google Cloud Storage 和 Microsoft Azure）中创建的存储桶或容器。
- 可通过 HTTPS 访问的远程服务器。

此功能在加载数据之前或之后检查或查看暂存文件内容时特别有用。

## 语法和参数

```sql
SELECT [<alias>.]<column> [, <column> ...] | [<alias>.]$<col_position> [, $<col_position> ...]
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]}
[(
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'CSV | TSV | NDJSON | PARQUET | ORC | <custom_format_name>'],
  [ FILES => ( '<file_name>' [ , '<file_name>' ... ])]
)]
```

:::note
当暂存路径包含空格或括号等特殊字符时，您可以将整个路径用单引号括起来，如下面的 SQL 语句所示：

```sql
SELECT * FROM 's3://mybucket/dataset(databend)/' ...

SELECT * FROM 's3://mybucket/dataset databend/' ...
```

:::

### FILE_FORMAT

FILE_FORMAT 参数允许您指定文件格式，可以是以下选项之一：CSV、TSV、NDJSON、PARQUET 或您使用 [CREATE FILE FORMAT](/sql/sql-commands/ddl/file-format/ddl-create-file-format) 命令定义的自定义格式。例如，

```sql
CREATE FILE FORMAT my_custom_csv TYPE=CSV FIELD_DELIMITER='\t';

SELECT $1 FROM @my_stage/file (FILE_FORMAT=>'my_custom_csv');
```

请注意，当您需要从暂存文件查询或执行 COPY INTO 操作时，必须在创建暂存区时明确指定文件格式。否则，将应用默认格式 Parquet。请参见以下示例：

```sql
CREATE STAGE my_stage FILE_FORMAT = (TYPE = CSV);
```

在您以不同于指定暂存格式的方式暂存文件的情况下，您可以在 SELECT 或 COPY INTO 语句中明确指定文件格式。以下是示例：

```sql
SELECT $1 FROM @my_stage (FILE_FORMAT=>'NDJSON');

COPY INTO my_table FROM (SELECT $1 SELECT @my_stage t) FILE_FORMAT = (TYPE = NDJSON);
```

### PATTERN

PATTERN 选项允许您指定一个基于 [PCRE2](https://www.pcre.org/current/doc/html/) 的正则表达式模式，用单引号括起来，以匹配文件名。它用于根据提供的模式过滤和选择文件。例如，您可以使用类似 '.\*parquet' 的模式来匹配所有以 "parquet" 结尾的文件名。有关 PCRE2 语法的详细信息，请参阅 http://www.pcre.org/current/doc/html/pcre2syntax.html 上的文档。

### FILES

FILES 选项则允许您明确指定一个或多个用逗号分隔的文件名。此选项允许您直接过滤并从文件夹中的特定文件查询数据。例如，如果您想从 Parquet 文件 "books-2023.parquet"、"books-2022.parquet" 和 "books-2021.parquet" 中查询数据，您可以在 FILES 选项中提供这些文件名。

### table_alias

在使用 SELECT 语句处理暂存文件时，如果没有可用的表名，您可以为文件分配一个别名。这允许您将文件视为一个表，其字段作为表中的列。这在 SELECT 语句中处理多个表或选择特定列时非常有用。以下是一个示例：

```sql
-- 别名 't1' 代表暂存文件，而 't2' 是一个常规表
SELECT t1.$1, t2.$2 FROM @my_stage t1, t2;
```

### $col_position

在从暂存文件选择时，您可以使用列位置，这些位置从 1 开始。目前，使用列位置从暂存文件进行 SELECT 操作的功能仅限于 Parquet、NDJSON、CSV 和 TSV 格式。

```sql
SELECT $2 FROM @my_stage (FILES=>('sample.csv')) ORDER BY $1;
```

需要注意的是，在使用 NDJSON 时，只允许 $1，表示整行并具有 Variant 数据类型。要选择特定字段，请使用 `$1:<field_name>`。

```sql
-- 使用列位置选择整行：
SELECT $1 FROM @my_stage (FILE_FORMAT=>'NDJSON')

-- 使用列位置选择名为 "a" 的特定字段：
SELECT $1:a FROM @my_stage (FILE_FORMAT=>'NDJSON')
```

在使用 COPY INTO 从暂存文件复制数据时，Databend 会匹配 NDJSON 文件顶层的字段名与目标表的列名，而不是依赖列位置。在下面的示例中，表 _my_table_ 应具有与 NDJSON 文件顶层字段名相同的列定义：

```sql
COPY INTO my_table FROM (SELECT $1 SELECT @my_stage t) FILE_FORMAT = (type = NDJSON)
```

### connection_parameters

要查询存储服务上存储桶或容器中的数据文件，请提供必要的连接参数。有关每个存储服务的可用连接参数，请参阅 [连接参数](/sql/sql-reference/connect-parameters)。

### uri

指定可通过 HTTPS 访问的远程文件的 URI。

## 限制

在查询暂存文件时，以下限制适用于特定格式的约束：

- 使用符号 \* 选择所有字段仅支持 Parquet 文件。
- 在从 CSV 或 TSV 文件选择时，所有字段都被解析为字符串，并且 SELECT 语句仅允许使用列位置。此外，文件中的字段数量有限制，不得超过 max.N+1000。例如，如果语句是 `SELECT $1, $2 FROM @my_stage (FILES=>('sample.csv'))`，则 sample.csv 文件最多可以有 1,002 个字段。

## 教程

### 教程 1：从暂存区查询数据

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

本示例展示了如何从存储在不同位置的 Parquet 文件中查询数据。点击下面的标签查看详细信息。

<Tabs groupId="query2stage">
<TabItem value="Stages" label="暂存区">

假设您有一个名为 [books.parquet](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet) 的示例文件，并且您已将其上传到用户暂存区、名为 _my_internal_stage_ 的内部暂存区和名为 _my_external_stage_ 的外部暂存区。要上传文件到暂存区，请使用 [PRESIGN](/sql/sql-commands/ddl/stage/presign) 方法。

```sql
-- 查询用户暂存区中的文件
SELECT * FROM @~/books.parquet;

-- 查询内部暂存区中的文件
SELECT * FROM @my_internal_stage/books.parquet;

-- 查询外部暂存区中的文件
SELECT * FROM @my_external_stage/books.parquet;
```

</TabItem>
<TabItem value="Bucket" label="存储桶">

假设您有一个名为 [books.parquet](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet) 的示例文件存储在 Amazon S3 区域 _us-east-2_ 中的名为 _databend-toronto_ 的存储桶中。您可以通过指定连接参数来查询数据：

```sql
SELECT
    *
FROM
    's3://databend-toronto' (
        CONNECTION => (
            ACCESS_KEY_ID = '<your-access-key-id>',
            SECRET_ACCESS_KEY = '<your-secret-access-key>',
            ENDPOINT_URL = 'https://databend-toronto.s3.us-east-2.amazonaws.com',
            REGION = 'us-east-2'
        ),
        FILES => ('books.parquet')
    );
```

</TabItem>
<TabItem value="Remote" label="远程">

假设您有一个名为 [books.parquet](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet) 的示例文件存储在远程服务器中。您可以通过指定文件 URI 来查询数据：

```sql
SELECT * FROM 'https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet';
```

</TabItem>
</Tabs>

### 教程 2：使用 PATTERN 查询数据

假设您有以下具有相同模式的 Parquet 文件，以及一些其他格式的文件，存储在 Amazon S3 区域 _us-east-2_ 中的名为 _databend-toronto_ 的存储桶中。

```text
databend-toronto/
  ├── books-2023.parquet
  ├── books-2022.parquet
  ├── books-2021.parquet
  ├── books-2020.parquet
  └── books-2019.parquet
```

要从文件夹中的所有 Parquet 文件查询数据，您可以使用 `PATTERN` 选项：

```sql
SELECT
    *
FROM
    's3://databend-toronto' (
        CONNECTION => (
            ACCESS_KEY_ID = '<your-access-key-id>',
            SECRET_ACCESS_KEY = '<your-secret_access_key>',
            ENDPOINT_URL = 'https://databend-toronto.s3.us-east-2.amazonaws.com',
            REGION = 'us-east-2'
        ),
        PATTERN => '.*parquet'
    );
```

要从文件夹中的 Parquet 文件 "books-2023.parquet"、"books-2022.parquet" 和 "books-2021.parquet" 查询数据，您可以使用 FILES 选项：

```sql
SELECT
    *
FROM
    's3://databend-toronto' (
        CONNECTION => (
            ACCESS_KEY_ID = '<your-access-key-id>',
            SECRET_ACCESS_KEY = '<your-secret_access_key>',
            ENDPOINT_URL = 'https://databend-toronto.s3.us-east-2.amazonaws.com',
            REGION = 'us-east-2'
        ),
        FILES => (
            'books-2023.parquet',
            'books-2022.parquet',
            'books-2021.parquet'
        )
    );
```