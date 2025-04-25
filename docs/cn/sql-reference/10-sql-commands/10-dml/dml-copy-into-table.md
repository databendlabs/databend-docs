---
title: "COPY INTO <table>"
sidebar_label: "COPY INTO <table>"
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<FunctionDescription description="Introduced or updated: v1.2.704"/>

COPY INTO 允许您从位于以下位置之一的文件中加载数据：

- User / Internal / External stages: 请参阅 [什么是 Stage?](/guides/load-data/stage/what-is-stage) 以了解 Databend 中的 stages。
- 在存储服务中创建的存储桶或容器。
- 可以通过 URL 访问文件的远程服务器（以 "https://..." 开头）。
- [IPFS](https://ipfs.tech) 和 Hugging Face 仓库。

另请参阅：[`COPY INTO <location>`](dml-copy-into-location.md)

## 语法

```sql
/* Standard data load */
COPY INTO [<database_name>.]<table_name> [ ( <col_name> [ , <col_name> ... ] ) ]
     FROM { userStage | internalStage | externalStage | externalLocation }
[ FILES = ( '<file_name>' [ , '<file_name>' ] [ , ... ] ) ]
[ PATTERN = '<regex_pattern>' ]
[ FILE_FORMAT = (
         FORMAT_NAME = '<your-custom-format>'
         | TYPE = { CSV | TSV | NDJSON | PARQUET | ORC | AVRO } [ formatTypeOptions ]
       ) ]
[ copyOptions ]

/* Data load with transformation */
COPY INTO [<database_name>.]<table_name> [ ( <col_name> [ , <col_name> ... ] ) ]
     FROM ( SELECT [<alias>.]$<file_col_num>[.<element>] [ , [<alias>.]$<file_col_num>[.<element>] ... ]
            FROM { userStage | internalStage | externalStage } )
[ FILES = ( '<file_name>' [ , <file_name>' ] [ , ... ] ) ]
[ PATTERN = '<regex_pattern>' ]
[ FILE_FORMAT = (
         FORMAT_NAME = '<your-custom-format>'
         | TYPE = { CSV | TSV | NDJSON | PARQUET | ORC | AVRO } [ formatTypeOptions ]
       ) ]
[ copyOptions ]
```

其中：

```sql
userStage ::= @~[/<path>]

internalStage ::= @<internal_stage_name>[/<path>]

externalStage ::= @<external_stage_name>[/<path>]

externalLocation ::=
  /* Amazon S3-like Storage */
  's3://<bucket>[/<path>]'
  CONNECTION = (
    [ ENDPOINT_URL = '<endpoint-url>' ]
    [ ACCESS_KEY_ID = '<your-access-key-ID>' ]
    [ SECRET_ACCESS_KEY = '<your-secret-access-key>' ]
    [ ENABLE_VIRTUAL_HOST_STYLE = TRUE | FALSE ]
    [ MASTER_KEY = '<your-master-key>' ]
    [ REGION = '<region>' ]
    [ SECURITY_TOKEN = '<security-token>' ]
    [ ROLE_ARN = '<role-arn>' ]
    [ EXTERNAL_ID = '<external-id>' ]
  )
  
  /* Azure Blob Storage */
  | 'azblob://<container>[/<path>]'
    CONNECTION = (
      ENDPOINT_URL = '<endpoint-url>'
      ACCOUNT_NAME = '<account-name>'
      ACCOUNT_KEY = '<account-key>'
    )
  
  /* Google Cloud Storage */
  | 'gcs://<bucket>[/<path>]'
    CONNECTION = (
      CREDENTIAL = '<your-base64-encoded-credential>'
    )
  
  /* Alibaba Cloud OSS */
  | 'oss://<bucket>[/<path>]'
    CONNECTION = (
      ACCESS_KEY_ID = '<your-ak>'
      ACCESS_KEY_SECRET = '<your-sk>'
      ENDPOINT_URL = '<endpoint-url>'
      [ PRESIGN_ENDPOINT_URL = '<presign-endpoint-url>' ]
    )
  
  /* Tencent Cloud Object Storage */
  | 'cos://<bucket>[/<path>]'
    CONNECTION = (
      SECRET_ID = '<your-secret-id>'
      SECRET_KEY = '<your-secret-key>'
      ENDPOINT_URL = '<endpoint-url>'
    )
  
  /* Remote Files */
  | 'https://<url>'
  
  /* IPFS */
  | 'ipfs://<your-ipfs-hash>'
    CONNECTION = (ENDPOINT_URL = 'https://<your-ipfs-gateway>')
  
  /* Hugging Face */
  | 'hf://<repo-id>[/<path>]'
    CONNECTION = (
      [ REPO_TYPE = 'dataset' | 'model' ]
      [ REVISION = '<revision>' ]
      [ TOKEN = '<your-api-token>' ]
    )

formatTypeOptions ::=
  /* Common options for all formats */
  [ COMPRESSION = AUTO | GZIP | BZ2 | BROTLI | ZSTD | DEFLATE | RAW_DEFLATE | XZ | NONE ]
  
  /* CSV specific options */
  [ RECORD_DELIMITER = '<character>' ]
  [ FIELD_DELIMITER = '<character>' ]
  [ SKIP_HEADER = <integer> ]
  [ QUOTE = '<character>' ]
  [ ESCAPE = '<character>' ]
  [ NAN_DISPLAY = '<string>' ]
  [ NULL_DISPLAY = '<string>' ]
  [ ERROR_ON_COLUMN_COUNT_MISMATCH = TRUE | FALSE ]
  [ EMPTY_FIELD_AS = null | string | field_default ]
  [ BINARY_FORMAT = HEX | BASE64 ]
  
  /* TSV specific options */
  [ RECORD_DELIMITER = '<character>' ]
  [ FIELD_DELIMITER = '<character>' ]
  
  /* NDJSON specific options */
  [ NULL_FIELD_AS = NULL | FIELD_DEFAULT ]
  [ MISSING_FIELD_AS = ERROR | NULL | FIELD_DEFAULT ]
  [ ALLOW_DUPLICATE_KEYS = TRUE | FALSE ]
  
  /* PARQUET specific options */
  [ MISSING_FIELD_AS = ERROR | FIELD_DEFAULT ]
  
  /* ORC specific options */
  [ MISSING_FIELD_AS = ERROR | FIELD_DEFAULT ]
  
  /* AVRO specific options */
  [ MISSING_FIELD_AS = ERROR | FIELD_DEFAULT ]

copyOptions ::=
  [ SIZE_LIMIT = <num> ]
  [ PURGE = <bool> ]
  [ FORCE = <bool> ]
  [ DISABLE_VARIANT_CHECK = <bool> ]
  [ ON_ERROR = { continue | abort | abort_N } ]
  [ MAX_FILES = <num> ]
  [ RETURN_FAILED_ONLY = <bool> ]
  [ COLUMN_MATCH_MODE = { case-sensitive | case-insensitive } ]

```

:::note
对于远程文件，您可以使用 glob 模式来指定多个文件。例如：
- `ontime_200{6,7,8}.csv` 表示 `ontime_2006.csv`、`ontime_2007.csv`、`ontime_2008.csv`
- `ontime_200[6-8].csv` 表示相同的文件
:::

## 关键参数

- **FILES**: 指定要加载的一个或多个文件名（以逗号分隔）。

- **PATTERN**: 一个基于 [PCRE2](https://www.pcre.org/current/doc/html/) 的正则表达式模式字符串，用于指定要匹配的文件名。请参阅 [示例 4：使用 Pattern 过滤文件](#example-4-filtering-files-with-pattern)。

## Format Type Options

`FILE_FORMAT` 参数支持不同的文件类型，每种类型都有特定的格式化选项。以下是每种支持的文件格式的可用选项：

### 所有格式的通用选项

| Option | Description | Values | Default |
|--------|-------------|--------|--------|
| COMPRESSION | 数据文件的压缩算法 | AUTO, GZIP, BZ2, BROTLI, ZSTD, DEFLATE, RAW_DEFLATE, XZ, NONE | AUTO |

### TYPE = CSV

| Option | Description | Default |
|--------|-------------|--------|
| RECORD_DELIMITER | 分隔记录的字符 | newline |
| FIELD_DELIMITER | 分隔字段的字符 | 逗号 (,) |
| SKIP_HEADER | 要跳过的标题行数 | 0 |
| QUOTE | 用于引用字段的字符 | 双引号 (") |
| ESCAPE | 用于封闭字段的转义字符 | NONE |
| NAN_DISPLAY | 表示 NaN 值的字符串 | NaN |
| NULL_DISPLAY | 表示 NULL 值的字符串 | \N |
| ERROR_ON_COLUMN_COUNT_MISMATCH | 如果列计数不匹配则报错 | TRUE |
| EMPTY_FIELD_AS | 如何处理空字段 | null |
| BINARY_FORMAT | 二进制数据的编码格式 | HEX |

### TYPE = TSV

| Option | Description | Default |
|--------|-------------|--------|
| RECORD_DELIMITER | 分隔记录的字符 | newline |
| FIELD_DELIMITER | 分隔字段的字符 | tab (\t) |

### TYPE = NDJSON

| Option | Description | Default |
|--------|-------------|--------|
| NULL_FIELD_AS | 如何处理 null 字段 | NULL |
| MISSING_FIELD_AS | 如何处理缺失字段 | ERROR |
| ALLOW_DUPLICATE_KEYS | 允许重复的对象键 | FALSE |

### TYPE = PARQUET

| Option | Description | Default |
|--------|-------------|--------|
| MISSING_FIELD_AS | 如何处理缺失字段 | ERROR |

### TYPE = ORC

| Option | Description | Default |
|--------|-------------|--------|
| MISSING_FIELD_AS | 如何处理缺失字段 | ERROR |

### TYPE = AVRO

| Option | Description | Default |
|--------|-------------|--------|
| MISSING_FIELD_AS | 如何处理缺失字段 | ERROR |

## Copy Options

| Parameter | Description | Default |
|-----------|-------------|----------|
| SIZE_LIMIT | 要加载的最大数据行数 | `0` (无限制) |
| PURGE | 成功加载后清除文件 | `false` |
| FORCE | 允许重新加载重复文件 | `false` (跳过重复文件) |
| DISABLE_VARIANT_CHECK | 用 null 替换无效的 JSON | `false` (在无效的 JSON 上失败) |
| ON_ERROR | 如何处理错误：`continue`、`abort` 或 `abort_N` | `abort` |
| MAX_FILES | 要加载的最大文件数（最多 15,000 个） | - |
| RETURN_FAILED_ONLY | 仅在输出中返回失败的文件 | `false` |
| COLUMN_MATCH_MODE | 对于 Parquet：列名匹配模式 | `case-insensitive` |

:::tip
当导入大量数据（如日志）时，将 `PURGE` 和 `FORCE` 都设置为 `true`，以实现高效的数据导入，而无需与 Meta server 交互。请注意，这可能会导致重复的数据导入。
:::

:::tip
当导入大量数据（例如日志）时，建议将 `PURGE` 和 `FORCE` 都设置为 `true`。这可确保高效的数据导入，而无需与 Meta server 交互（更新 copied-files 集）。但是，重要的是要注意，这可能会导致重复的数据导入。
:::

## 输出

COPY INTO 提供了数据加载结果的摘要，包含以下列：

| Column           | Type    | Nullable | Description                                     |
| ---------------- | ------- | -------- | ----------------------------------------------- |
| FILE             | VARCHAR | NO       | 源文件的相对路径。                              |
| ROWS_LOADED      | INT     | NO       | 从源文件加载的行数。                            |
| ERRORS_SEEN      | INT     | NO       | 源文件中的错误行数                              |
| FIRST_ERROR      | VARCHAR | YES      | 在源文件中找到的第一个错误。                    |
| FIRST_ERROR_LINE | INT     | YES      | 第一个错误的行号。                              |

如果 `RETURN_FAILED_ONLY` 设置为 `true`，则输出将仅包含加载失败的文件。

## 示例

### 示例 1：从 Stages 加载

这些示例展示了从各种类型的 stages 将数据加载到 Databend 中：

<Tabs>
  <TabItem value="user" label="User Stage" default>

```sql
COPY INTO mytable
    FROM @~
    PATTERN = '.*[.]parquet'
    FILE_FORMAT = (TYPE = PARQUET);
```

  </TabItem>
  <TabItem value="internal" label="Internal Stage">

```sql
COPY INTO mytable
    FROM @my_internal_stage
    PATTERN = '.*[.]parquet'
    FILE_FORMAT = (TYPE = PARQUET);
```

  </TabItem>
  <TabItem value="external" label="External Stage">

```sql
COPY INTO mytable
    FROM @my_external_stage
    PATTERN = '.*[.]parquet'
    FILE_FORMAT = (TYPE = PARQUET);
```

  </TabItem>
</Tabs>

### 示例 2：从外部位置加载

这些示例展示了从各种类型的外部源将数据加载到 Databend 中：

<Tabs groupId="external-example">
<TabItem value="Amazon S3" label="Amazon S3">

此示例使用 AWS 访问密钥和密钥建立与 Amazon S3 的连接，并从 CSV 文件加载 10 行：


```sql
-- Authenticated by AWS access keys and secrets.
COPY INTO mytable
    FROM 's3://mybucket/data.csv'
    CONNECTION = (
        ACCESS_KEY_ID = '<your-access-key-ID>',
        SECRET_ACCESS_KEY = '<your-secret-access-key>'
    )
    FILE_FORMAT = (
        TYPE = CSV,
        FIELD_DELIMITER = ',',
        RECORD_DELIMITER = '\n',
        SKIP_HEADER = 1
    )
    SIZE_LIMIT = 10;
```

This example connects to Amazon S3 using AWS IAM role authentication with an external ID and loads CSV files matching the specified pattern from 'mybucket':

```sql
-- Authenticated by AWS IAM role and external ID.
COPY INTO mytable
    FROM 's3://mybucket/'
    CONNECTION = (
        ENDPOINT_URL = 'https://<endpoint-URL>',
        ROLE_ARN = 'arn:aws:iam::123456789012:role/my_iam_role',
        EXTERNAL_ID = '123456'
    )
    PATTERN = '.*[.]csv'
        FILE_FORMAT = (
        TYPE = CSV,
        FIELD_DELIMITER = ',',
        RECORD_DELIMITER = '\n',
        SKIP_HEADER = 1
    );
```

</TabItem>

<TabItem value="Azure Blob Storage" label="Azure Blob Storage">

This example connects to Azure Blob Storage and loads data from 'data.csv' into Databend:

```sql
COPY INTO mytable
    FROM 'azblob://mybucket/data.csv'
    CONNECTION = (
        ENDPOINT_URL = 'https://<account_name>.blob.core.windows.net',
        ACCOUNT_NAME = '<account_name>',
        ACCOUNT_KEY = '<account_key>'
    )
    FILE_FORMAT = (type = CSV);
```

</TabItem>

<TabItem value="Remote Files" label="Remote Files">

This example loads data from three remote CSV files and skips a file in case of errors.

```sql
COPY INTO mytable
    FROM 'https://ci.databend.org/dataset/stateful/ontime_200{6,7,8}_200.csv'
    FILE_FORMAT = (type = CSV)
    ON_ERROR = continue;
```

</TabItem>

<TabItem value="IPFS" label="IPFS">

This example loads data from a CSV file on IPFS:

```sql
COPY INTO mytable
    FROM 'ipfs://<your-ipfs-hash>'
    CONNECTION = (
        ENDPOINT_URL = 'https://<your-ipfs-gateway>'
    )
    FILE_FORMAT = (
        TYPE = CSV,
        FIELD_DELIMITER = ',',
        RECORD_DELIMITER = '\n',
        SKIP_HEADER = 1
    );
```

</TabItem>
</Tabs>

### Example 3: Loading Compressed Data

This example loads a GZIP-compressed CSV file on Amazon S3 into Databend:

```sql
COPY INTO mytable
    FROM 's3://mybucket/data.csv.gz'
    CONNECTION = (
        ENDPOINT_URL = 'https://<endpoint-URL>',
        ACCESS_KEY_ID = '<your-access-key-ID>',
        SECRET_ACCESS_KEY = '<your-secret-access-key>'
    )
    FILE_FORMAT = (
        TYPE = CSV,
        FIELD_DELIMITER = ',',
        RECORD_DELIMITER = '\n',
        SKIP_HEADER = 1,
        COMPRESSION = AUTO
    );
```

### Example 4: Filtering Files with Pattern

This example demonstrates how to load CSV files from Amazon S3 using pattern matching with the PATTERN parameter. It filters files with 'sales' in their names and '.csv' extensions:

```sql
COPY INTO mytable
    FROM 's3://mybucket/'
    PATTERN = '.*sales.*[.]csv'
    FILE_FORMAT = (
        TYPE = CSV,
        FIELD_DELIMITER = ',',
        RECORD_DELIMITER = '\n',
        SKIP_HEADER = 1
    );
```

Where `.*` is interpreted as zero or more occurrences of any character. The square brackets escape the period character `.` that precedes a file extension.

To load from all the CSV files:

```sql
COPY INTO mytable
    FROM 's3://mybucket/'
    PATTERN = '.*[.]csv'
    FILE_FORMAT = (
        TYPE = CSV,
        FIELD_DELIMITER = ',',
        RECORD_DELIMITER = '\n',
        SKIP_HEADER = 1
    );

```

When specifying the pattern for a file path including multiple folders, consider your matching criteria:

- If you want to match a specific subpath following a prefix, include the prefix in the pattern (e.g., 'multi_page/') and then specify the pattern you want to match within that subpath (e.g., '\_page_1').

```sql
-- File path: parquet/multi_page/multi_page_1.parquet
COPY INTO ... FROM @data/parquet/ PATTERN = 'multi_page/.*_page_1.*') ...
```

- If you want to match any part of the file path that contains the desired pattern, use '.*' before and after the pattern (e.g., '.*multi_page_1.\*') to match any occurrences of 'multi_page_1' within the path.

```sql
-- File path: parquet/multi_page/multi_page_1.parquet
COPY INTO ... FROM @data/parquet/ PATTERN ='.*multi_page_1.*') ...
```

### Example 5: Loading to Table with Extra Columns

This section demonstrates data loading into a table with extra columns, using the sample file [books.csv](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv):

```text title='books.csv'
Transaction Processing,Jim Gray,1992
Readings in Database Systems,Michael Stonebraker,2004
```

![Alt text](/img/load/load-extra.png)

By default, COPY INTO loads data into a table by matching the order of fields in the file to the corresponding columns in the table. It's essential to ensure that the data aligns correctly between the file and the table. For example,

```sql
CREATE TABLE books
(
    title VARCHAR,
    author VARCHAR,
    date VARCHAR
);

COPY INTO books
    FROM 'https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv'
    FILE_FORMAT = (TYPE = CSV);
```

If your table has more columns than the file, you can specify the columns into which you want to load data. For example,

```sql
CREATE TABLE books_with_language
(
    title VARCHAR,
    language VARCHAR,
    author VARCHAR,
    date VARCHAR
);

COPY INTO books_with_language (title, author, date)
    FROM 'https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv'
    FILE_FORMAT = (TYPE = CSV);
```

If your table has more columns than the file, and the additional columns are at the end of the table, you can load data using the [FILE_FORMAT](#file_format) option `ERROR_ON_COLUMN_COUNT_MISMATCH`. This allows you to load data without specifying each column individually. Please note that ERROR_ON_COLUMN_COUNT_MISMATCH currently works for the CSV file format.

```sql
CREATE TABLE books_with_extra_columns
(
    title VARCHAR,
    author VARCHAR,
    date VARCHAR,
    language VARCHAR,
    region VARCHAR
);

COPY INTO books_with_extra_columns
    FROM 'https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv'
    FILE_FORMAT = (TYPE = CSV, ERROR_ON_COLUMN_COUNT_MISMATCH = false);
```

:::note
Extra columns in a table can have default values specified by [CREATE TABLE](../00-ddl/01-table/10-ddl-create-table.md) or [ALTER TABLE COLUMN](../00-ddl/01-table/90-alter-table-column.md). If a default value is not explicitly set for an extra column, the default value associated with its data type will be applied. For instance, an integer-type column will default to 0 if no other value is specified.
:::

### Example 6: Loading JSON with Custom Format

This example loads data from a CSV file "data.csv" with the following content:

```json
1,"U00010","{\"carPriceList\":[{\"carTypeId":10,\"distance":5860},{\"carTypeId":11,\"distance\":5861}]}"
2,"U00011","{\"carPriceList\":[{\"carTypeId":12,\"distance":5862},{\"carTypeId":13,\"distance\":5863}]}"
```

Each line contains three columns of data, with the third column being a string containing JSON data. To load CSV data correctly with JSON fields, we need to set the correct escape character. This example uses the backslash \ as the escape character, as the JSON data contains double quotes ".

#### Step 1: Create custom file format.

```sql
-- Define a custom CSV file format with the escape character set to backslash \
CREATE FILE FORMAT my_csv_format
    TYPE = CSV
    ESCAPE = '\\';
```

#### Step 2: Create target table.

```sql
CREATE TABLE t
  (
     id       INT,
     seq      VARCHAR,
     p_detail VARCHAR
  );
```

#### Step 3: Load with custom file format.

```sql
COPY INTO t FROM @t_stage FILES=('data.csv')
FILE_FORMAT=(FORMAT_NAME='my_csv_format');
```

### Example 7: Loading Invalid JSON

When loading data into a Variant column, Databend automatically checks the data's validity and throws an error in case of any invalid data. For example, if you have a Parquet file named `invalid_json_string.parquet` in the user stage that contains invalid JSON data, like this:

```sql
SELECT *
FROM @~/invalid_json_string.parquet;

┌────────────────────────────────────┐
│        a        │         b        │
├─────────────────┼──────────────────┤
│               5 │ {"k":"v"}        │
│               6 │ [1,              │
└────────────────────────────────────┘

DESC t2;

┌──────────────────────────────────────────────┐
│  Field │   Type  │  Null  │ Default │  Extra │
├────────┼─────────┼────────┼─────────┼────────┤
│ a      │ VARCHAR │ YES    │ NULL    │        │
│ b      │ VARIANT │ YES    │ NULL    │        │
└──────────────────────────────────────────────┘
```

An error would occur when attempting to load the data into a table:

```sql
root@localhost:8000/default>  COPY INTO t2 FROM @~/invalid_json_string.parquet FILE_FORMAT = (TYPE = PARQUET) ON_ERROR = CONTINUE;
error: APIError: ResponseError with 1006: EOF while parsing a value, pos 3 while evaluating function `parse_json('[1,')`
```

To load without checking the JSON validity, set the option `DISABLE_VARIANT_CHECK` to `true` in the COPY INTO statement:

```sql
COPY INTO t2 FROM @~/invalid_json_string.parquet
FILE_FORMAT = (TYPE = PARQUET)
DISABLE_VARIANT_CHECK = true
ON_ERROR = CONTINUE;

┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│             File            │ Rows_loaded │ Errors_seen │    First_error   │ First_error_line │
├─────────────────────────────┼─────────────┼─────────────┼──────────────────┼──────────────────┤
│ invalid_json_string.parquet │           2 │           0 │ NULL             │             NULL │
└───────────────────────────────────────────────────────────────────────────────────────────────┘

SELECT * FROM t2;
-- Invalid JSON is stored as null in the Variant column.
┌──────────────────────────────────────┐
│         a        │         b         │
├──────────────────┼───────────────────┤
│ 5                │ {"k":"v"}         │
│ 6                │ null              │
└──────────────────────────────────────┘
```
