```markdown
---
title: Querying & Transforming
slug: querying-stage
---

Databend 引入了一种变革性的数据处理方法，即 ELT (Extract, Load, Transform) 模型。这个模型的重要方面是在 staged files 中查询数据。

您可以使用 `SELECT` 语句查询 staged files 中的数据。此功能适用于以下类型的 stage：

- User stage、internal stage 或 external stage。
- 在您的对象存储中创建的 Bucket 或容器，例如 Amazon S3、Google Cloud Storage 和 Microsoft Azure。
- 可通过 HTTPS 访问的远程服务器。

无论是在加载数据之前还是之后，此功能对于检查或查看 staged files 的内容特别有用。

## 语法和参数

```sql
SELECT [<alias>.]<column> [, <column> ...] | [<alias>.]$<col_position> [, $<col_position> ...]
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]}
[(
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'CSV | TSV | NDJSON | PARQUET | ORC | <custom_format_name>'],
  [ FILES => ( '<file_name>' [ , '<file_name>' ... ])],
  [ CASE_SENSITIVE => true | false ]
)]
```

:::note
当 stage 路径包含空格或括号等特殊字符时，您可以将整个路径用单引号括起来，如下面的 SQL 语句所示：

```sql
SELECT * FROM 's3://mybucket/dataset(databend)/' ...

SELECT * FROM 's3://mybucket/dataset databend/' ...
```

:::

### FILE_FORMAT

FILE_FORMAT 参数允许您指定文件的格式，可以是以下选项之一：CSV、TSV、NDJSON、PARQUET，或者您使用 [CREATE FILE FORMAT](/sql/sql-commands/ddl/file-format/ddl-create-file-format) 命令定义的自定义格式。例如，

```sql
CREATE FILE FORMAT my_custom_csv TYPE=CSV FIELD_DELIMITER='\t';

SELECT $1 FROM @my_stage/file (FILE_FORMAT=>'my_custom_csv');
```

请注意，当您需要从 staged file 查询或执行 COPY INTO 操作时，必须在创建 stage 期间显式指定文件格式。否则，将应用默认格式 Parquet。请参见下面的示例：

```sql
CREATE STAGE my_stage FILE_FORMAT = (TYPE = CSV);
```

如果您已将文件以与指定的 stage 格式不同的格式进行暂存，则可以在 SELECT 或 COPY INTO 语句中显式指定文件格式。以下是一些示例：

```sql
SELECT $1 FROM @my_stage (FILE_FORMAT=>'NDJSON');

COPY INTO my_table FROM (SELECT $1 SELECT @my_stage t) FILE_FORMAT = (TYPE = NDJSON);
```

### PATTERN

PATTERN 选项允许您指定一个用单引号括起来的基于 [PCRE2](https://www.pcre.org/current/doc/html/) 的正则表达式模式，以匹配文件名。它用于根据提供的模式过滤和选择文件。例如，您可以使用 '.\*parquet' 这样的模式来匹配所有以 "parquet" 结尾的文件名。有关 PCRE2 语法的详细信息，您可以参考 http://www.pcre.org/current/doc/html/pcre2syntax.html 上的文档。

### FILES

另一方面，FILES 选项允许您显式指定一个或多个以逗号分隔的文件名。此选项允许您直接从文件夹中的特定文件过滤和查询数据。例如，如果您想从 Parquet 文件 "books-2023.parquet"、"books-2022.parquet" 和 "books-2021.parquet" 中查询数据，则可以在 FILES 选项中提供这些文件名。

### CASE_SENSITIVE

CASE_SENSITIVE 参数确定查询的 Parquet 文件中的列名是否区分大小写：

- `CASE_SENSITIVE => false`（默认）：列名被视为不区分大小写，这意味着 `b` 和 `B` 被认为是相同的。
- `CASE_SENSITIVE => true`：列名被视为区分大小写，这意味着只有完全匹配（包括大小写）才有效。例如，如果文件中的列名为 `B`，则查询 `B` 将成功，但如果列名为 `b`，则查询将失败。

例如，如果您的 Parquet 文件中有一个名为 `MinTemp` 的列，则当 `CASE_SENSITIVE` 设置为 `false` 时，您可以使用以下语句之一查询它：

```sql
SELECT MinTemp FROM '@mystage/weather.parquet'(CASE_SENSITIVE=>false);

SELECT MINTEMP FROM '@mystage/weather.parquet'(CASE_SENSITIVE=>false);

SELECT mintemp FROM '@mystage/weather.parquet'(CASE_SENSITIVE=>false);
```

当 `CASE_SENSITIVE` 设置为 `true` 时，您必须使用与文件中显示的完全相同的列名：

```sql
SELECT `MinTemp` FROM '@mystage/weather.parquet'(CASE_SENSITIVE=>true);
```

### table_alias

在 SELECT 语句中使用 staged files 且没有可用的表名时，您可以为文件分配别名。这允许您将文件视为表，其字段用作表中的列。这在 SELECT 语句中使用多个表或选择特定列时非常有用。这是一个例子：

```sql
-- 别名 't1' 表示 staged file，而 't2' 是一个常规表
SELECT t1.$1, t2.$2 FROM @my_stage t1, t2;
```

### $col_position

从 staged file 中选择时，可以使用列位置，这些位置从 1 开始。目前，从 staged files 中使用列位置进行 SELECT 操作的功能仅限于 Parquet、NDJSON、CSV 和 TSV 格式。

```sql
SELECT $2 FROM @my_stage (FILES=>('sample.csv')) ORDER BY $1;
```

重要的是要注意，当使用 NDJSON 时，只允许 $1，它表示整行并且具有 Variant 数据类型。要选择特定字段，请使用 `$1:<field_name>`。

```sql
-- 使用列位置选择整行：
SELECT $1 FROM @my_stage (FILE_FORMAT=>'NDJSON')

--使用列位置选择名为 "a" 的特定字段：
SELECT $1:a FROM @my_stage (FILE_FORMAT=>'NDJSON')
```

当使用 COPY INTO 从 staged file 复制数据时，Databend 会将 NDJSON 文件顶层的字段名称与目标表中的列名称进行匹配，而不是依赖于列位置。在下面的示例中，表 _my_table_ 应具有与 NDJSON 文件中顶层字段名称相同的列定义：

```sql
COPY INTO my_table FROM (SELECT $1 SELECT @my_stage t) FILE_FORMAT = (type = NDJSON)
```

### connection_parameters

要在存储服务上的 Bucket 或容器中查询数据文件，请提供必要的连接参数。有关每个存储服务的可用连接参数，请参阅 [连接参数](/sql/sql-reference/connect-parameters)。

### uri

指定可通过 HTTPS 访问的远程文件的 URI。

## 限制

查询 staged file 时，以下限制适用于格式特定的约束：

- 仅 Parquet 文件支持使用符号 \* 选择所有字段。
- 从 CSV 或 TSV 文件中选择时，所有字段都将解析为字符串，并且 SELECT 语句仅允许使用列位置。此外，文件中的字段数也有限制，不得超过 max.N+1000。例如，如果语句是 `SELECT $1, $2 FROM @my_stage (FILES=>('sample.csv'))`，则 sample.csv 文件最多可以有 1,002 个字段。

## 教程

### 教程 1：从 Stage 查询数据

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

此示例显示如何查询存储在不同位置的 Parquet 文件中的数据。单击下面的选项卡以查看详细信息。

<Tabs groupId="query2stage">
<TabItem value="Stages" label="Stages">

假设您有一个名为 [books.parquet](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet) 的示例文件，并且您已将其上传到您的 user stage、名为 _my_internal_stage_ 的 internal stage 和名为 _my_external_stage_ 的 external stage。要将文件上传到 stage，请使用 [PRESIGN](/sql/sql-commands/ddl/stage/presign) 方法。

```sql
-- 查询 user stage 中的文件
SELECT * FROM @~/books.parquet;

-- 查询 internal stage 中的文件
SELECT * FROM @my_internal_stage/books.parquet;

-- 查询 external stage 中的文件
SELECT * FROM @my_external_stage/books.parquet;
```

</TabItem>
<TabItem value="Bucket" label="Bucket">

假设您有一个名为 [books.parquet](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet) 的示例文件，该文件存储在 Amazon S3 上名为 _databend-toronto_ 的 Bucket 中，区域为 _us-east-2_。您可以通过指定连接参数来查询数据：

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
<TabItem value="Remote" label="Remote">

假设您有一个名为 [books.parquet](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet) 的示例文件，该文件存储在远程服务器中。您可以通过指定文件 URI 来查询数据：

```sql
SELECT * FROM 'https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet';
```

</TabItem>
</Tabs>

### 教程 2：使用 PATTERN 查询数据

假设您有以下具有相同 schema 的 Parquet 文件，以及一些其他格式的文件，存储在 Amazon S3 上名为 _databend-toronto_ 的 Bucket 中，区域为 _us-east-2_。

```text
databend-toronto/
  ├── books-2023.parquet
  ├── books-2022.parquet
  ├── books-2021.parquet
  ├── books-2020.parquet
  └── books-2019.parquet
```

要查询文件夹中所有 Parquet 文件中的数据，可以使用 `PATTERN` 选项：

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

要查询文件夹中 Parquet 文件 "books-2023.parquet"、"books-2022.parquet" 和 "books-2021.parquet" 中的数据，可以使用 FILES 选项：

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
