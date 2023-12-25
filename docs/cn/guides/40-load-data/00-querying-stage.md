---
title: 查询阶段文件中的数据
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新：v1.2.177"/>

Databend允许您直接查询存储在以下位置之一的文件中的数据，而无需将它们加载到表中：

- 用户阶段、内部阶段或外部阶段。
- 在您的对象存储中创建的存储桶或容器，例如Amazon S3、Google Cloud Storage和Microsoft Azure。
- 通过HTTPS访问的远程服务器。

此功能对于检查或查看阶段文件的内容特别有用，无论是在加载数据之前还是之后。

## 语法和参数

```sql
SELECT [<alias>.]<column> [, <column> ...] | [<alias>.]$<col_position> [, $<col_position> ...] 
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]} 
[( 
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'CSV | TSV | NDJSON | PARQUET | XML | <custom_format_name>'],
  [ FILES => ( '<file_name>' [ , '<file_name>' ... ])]
)]
```

:::note
当阶段路径包含特殊字符，如空格或括号时，您可以将整个路径用单引号括起来，如下面的SQL语句所示：
```sql
SELECT * FROM 's3://mybucket/dataset(databend)/' ...

SELECT * FROM 's3://mybucket/dataset databend/' ...
```
:::

### FILE_FORMAT

FILE_FORMAT参数允许您指定文件的格式，可以是以下选项之一：CSV、TSV、NDJSON、PARQUET、XML或您使用[CREATE FILE FORMAT](/sql/sql-commands/ddl/file-format/ddl-create-file-format)命令定义的自定义格式。例如，

```sql
CREATE FILE FORMAT my_custom_csv TYPE=CSV FIELD_DELIMITER='\t';

SELECT $1 FROM @my_stage/file (FILE_FORMAT=>'my_custom_csv');
```

请注意，当您需要从阶段文件中查询或执行COPY INTO操作时，必须在创建阶段时明确指定文件格式。否则，将应用默认格式Parquet。请参见下面的示例：

```sql
CREATE STAGE my_stage FILE_FORMAT = (TYPE = CSV);
```
在您已经以与指定的阶段格式不同的格式阶段化文件的情况下，您可以在SELECT或COPY INTO语句中明确指定文件格式。这里有例子：

```sql
SELECT $1 FROM @my_stage (FILE_FORMAT=>'NDJSON');

COPY INTO my_table FROM (SELECT $1 SELECT @my_stage t) FILE_FORMAT = (TYPE = NDJSON);
```

### PATTERN

PATTERN选项允许您指定一个用单引号括起来的基于[PCRE2](https://www.pcre.org/current/doc/html/)的正则表达式模式来匹配文件名。它用于根据提供的模式过滤和选择文件。例如，您可以使用类似'.*parquet'的模式来匹配所有以"parquet"结尾的文件名。有关PCRE2语法的详细信息，您可以参考http://www.pcre.org/current/doc/html/pcre2syntax.html上的文档。

### FILES

另一方面，FILES选项使您能够明确指定一个或多个用逗号分隔的文件名。此选项允许您直接从文件夹中的特定文件过滤和查询数据。例如，如果您想从Parquet文件"books-2023.parquet"、"books-2022.parquet"和"books-2021.parquet"中查询数据，您可以在FILES选项中提供这些文件名。

### table_alias

在SELECT语句中处理阶段文件时，如果没有可用的表名，您可以为文件分配一个别名。这允许您将文件视为一个表，其字段作为表中的列。这在SELECT语句中处理多个表或选择特定列时非常有用。这里有一个例子：

```sql
-- 别名't1'代表阶段文件，而't2'是一个常规表
SELECT t1.$1, t2.$2 FROM @my_stage t1, t2;
```

### $<col_position>

从阶段文件中选择时，您可以使用列位置，这些位置从1开始。目前，使用列位置进行阶段文件的SELECT操作的功能仅限于Parquet、NDJSON、CSV和TSV格式。

```sql
SELECT $2 FROM @my_stage (FILES=>('sample.csv')) ORDER BY $1;
```

需要注意的是，当处理NDJSON时，只允许使用$1，代表整行并具有数据类型Variant。要选择特定字段，请使用`$1:<field_name>`。

```sql
-- 使用列位置选择整行：
SELECT $1 FROM @my_stage (FILE_FORMAT=>'NDJSON')

-- 使用列位置选择名为"a"的特定字段：
SELECT $1:a FROM @my_stage (FILE_FORMAT=>'NDJSON')
```

使用COPY INTO从阶段文件复制数据时，Databend会将NDJSON文件顶层的字段名与目标表中的列名进行匹配，而不是依赖于列位置。在下面的示例中，表*my_table*应该具有与NDJSON文件顶层字段名相同的列定义：

```sql
COPY INTO my_table FROM (SELECT $1 SELECT @my_stage t) FILE_FORMAT = (type = NDJSON)
```

### connection_parameters

要查询存储服务上的存储桶或容器中的数据文件，请提供必要的连接参数。有关每个存储服务的可用连接参数，请参考[连接参数](/sql/sql-reference/connect-parameters)。

### uri

指定通过HTTPS访问的远程文件的URI。

## 限制

在查询阶段文件时，以下限制适用于特定格式的约束：

- 使用符号*选择所有字段仅支持Parquet文件。
- 从CSV或TSV文件中选择时，所有字段都被解析为字符串，并且SELECT语句只允许使用列位置。此外，文件中的字段数量有限制，不得超过max.N+1000。例如，如果语句是`SELECT $1, $2 FROM @my_stage (FILES=>('sample.csv'))`，则sample.csv文件最多可以有1,002个字段。

## 教程

### 教程1：从Parquet文件中查询数据

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

此示例展示了如何查询存储在不同位置的Parquet文件中的数据。点击下面的标签查看详细信息。

<Tabs groupId="query2stage">
<TabItem value="Stages" label="阶段">

假设您有一个名为[books.parquet](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet)的示例文件，并且您已将其上传到您的用户阶段、名为*my_internal_stage*的内部阶段和名为*my_external_stage*的外部阶段。要将文件上传到阶段，请使用[PRESIGN](/sql/sql-commands/ddl/stage/presign)方法。

```sql
-- 查询用户阶段中的文件
SELECT * FROM @~/books.parquet;

-- 查询内部阶段中的文件
SELECT * FROM @my_internal_stage/books.parquet;

-- 查询外部阶段中的文件
SELECT * FROM @my_external_stage/books.parquet;
```
</TabItem>
<TabItem value="Bucket" label="存储桶">



```markdown
<Tabs>
<TabItem value="S3" label="S3">

假设您在Amazon S3的*us-east-2*区域中的名为*databend-toronto*的存储桶中有一个名为[books.parquet](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet)的样本文件。您可以通过指定连接参数来查询数据：

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

假设您在远程服务器上有一个名为[books.parquet](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet)的样本文件。您可以通过指定文件URI来查询数据：

```sql
SELECT * FROM 'https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet';
```
</TabItem>
</Tabs>

### 教程 2：使用PATTERN查询数据

假设您在Amazon S3的*us-east-2*区域中的名为*databend-toronto*的存储桶中有以下具有相同模式的Parquet文件，以及一些其他格式的文件：

```text
databend-toronto/
  ├── books-2023.parquet
  ├── books-2022.parquet
  ├── books-2021.parquet
  ├── books-2020.parquet
  └── books-2019.parquet
```

要从文件夹中的所有Parquet文件查询数据，您可以使用`PATTERN`选项：

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

要从文件夹中的"books-2023.parquet"、"books-2022.parquet"和"books-2021.parquet" Parquet文件查询数据，您可以使用FILES选项：

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
```