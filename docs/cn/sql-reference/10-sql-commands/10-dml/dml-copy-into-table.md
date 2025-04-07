---
title: "COPY INTO <table>"
sidebar_label: "COPY INTO <table>"
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.666"/>

COPY INTO 允许您从以下位置的文件加载数据：

- User / Internal / External stages：请参阅 [什么是 Stage?](/guides/load-data/stage/what-is-stage) 以了解 Databend 中的 stages。
- 在存储服务中创建的 Buckets 或 containers。
- 可以通过 URL 访问文件的远程服务器（以“https://...”开头）。
- [IPFS](https://ipfs.tech).

另请参阅：[`COPY INTO <location>`](dml-copy-into-location.md)

## 语法

```sql
COPY INTO [<database_name>.]<table_name>
     FROM { userStage | internalStage | externalStage | externalLocation |
            ( SELECT [<file_col> ... ]
              FROM { userStage | internalStage | externalStage } ) }
[ FILES = ( '<file_name>' [ , '<file_name>' ] [ , ... ] ) ]
[ PATTERN = '<regex_pattern>' ]
[ FILE_FORMAT = (
         FORMAT_NAME = '<your-custom-format>'
         | TYPE = { CSV | TSV | NDJSON | PARQUET | ORC } [ formatTypeOptions ]
       ) ]
[ copyOptions ]
```

### FROM ...

FROM 子句指定源位置（user stage、internal stage、external stage 或 external location），COPY INTO 命令将使用该位置将数据加载到指定的表中。您还可以嵌套 SELECT ... FROM 子查询来转换要加载的数据。有关更多信息，请参见 [加载时转换数据](/guides/load-data/transform/data-load-transform)。

:::note
当您从 staged file 加载数据并且 stage 路径包含空格或括号等特殊字符时，您可以将整个路径用单引号引起来，如以下 SQL 语句所示：

COPY INTO mytable FROM 's3://mybucket/dataset(databend)/' ...
COPY INTO mytable FROM 's3://mybucket/dataset databend/' ...
:::

#### userStage

```sql
userStage ::= @~[/<path>]
```

#### internalStage

```sql
internalStage ::= @<internal_stage_name>[/<path>]
```

#### externalStage

```sql
externalStage ::= @<external_stage_name>[/<path>]
```

#### externalLocation

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="externallocation">

<TabItem value="Amazon S3-like Storage" label="Amazon S3-like Storage">

```sql
externalLocation ::=
  's3://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问类似 Amazon S3 的存储服务可用的连接参数，请参见 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Azure Blob Storage" label="Azure Blob Storage">

```sql
externalLocation ::=
  'azblob://<container>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 Azure Blob Storage 可用的连接参数，请参见 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Google Cloud Storage" label="Google Cloud Storage">

```sql
externalLocation ::=
  'gcs://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 Google Cloud Storage 可用的连接参数，请参见 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Alibaba Cloud OSS" label="Alibaba Cloud OSS">

```sql
externalLocation ::=
  'oss://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问阿里云 OSS 可用的连接参数，请参见 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Tencent Cloud Object Storage" label="Tencent Cloud Object Storage">

```sql
externalLocation ::=
  'cos://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问腾讯云对象存储可用的连接参数，请参见 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Hadoop Distributed File System (HDFS)" label="HDFS">

```sql
externalLocation ::=
  'hdfs://<endpoint_url>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 HDFS 可用的连接参数，请参见 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="WebHDFS" label="WebHDFS">

```sql
externalLocation ::=
  'webhdfs://<endpoint_url>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 WebHDFS 可用的连接参数，请参见 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Remote Files" label="Remote Files">

```sql
externalLocation ::=
  'https://<url>'
```

您可以使用 glob 模式指定多个文件。例如，使用

- `ontime_200{6,7,8}.csv` 表示 `ontime_2006.csv`、`ontime_2007.csv`、`ontime_2008.csv`。
- `ontime_200[6-8].csv` 表示 `ontime_2006.csv`、`ontime_2007.csv`、`ontime_2008.csv`。

</TabItem>

<TabItem value="IPFS" label="IPFS">

```sql
externalLocation ::=
  'ipfs://<your-ipfs-hash>'
  CONNECTION = (ENDPOINT_URL = 'https://<your-ipfs-gateway>')
```

</TabItem>
</Tabs>

### FILES

FILES 指定要加载的一个或多个文件名（以逗号分隔）。

### PATTERN

一个基于 [PCRE2](https://www.pcre.org/current/doc/html/) 的正则表达式模式字符串，用单引号括起来，用于指定要匹配的文件名。有关 PCRE2 语法，请参见 http://www.pcre.org/current/doc/html/pcre2syntax.html。有关使用 PATTERN 参数过滤文件的示例和有用提示，请参见 [示例 4：使用 Pattern 过滤文件](#example-4-filtering-files-with-pattern)。

### FILE_FORMAT

有关详细信息，请参见 [输入 & 输出文件格式](../../00-sql-reference/50-file-format-options.md)。

### copyOptions

```sql
copyOptions ::=
  [ SIZE_LIMIT = <num> ]
  [ PURGE = <bool> ]
  [ FORCE = <bool> ]
  [ DISABLE_VARIANT_CHECK = <bool> ]
  [ ON_ERROR = { continue | abort | abort_N } ]
  [ MAX_FILES = <num> ]
  [ RETURN_FAILED_ONLY = <bool> ]
  [ COLUMN_MATCH_MODE =  { case-sensitive | case-insensitive } ]
```

| 参数                  | 描述                                                                                                                                                                                                                                                                       | 是否必须 |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| SIZE_LIMIT            | 指定给定 COPY 语句要加载的最大数据行数。默认为 `0`，表示没有限制。                                                                                                                                                                                                         | 可选     |
| PURGE                 | 如果为 `true`，则命令会在文件成功加载到表后清除 Stage 中的文件。默认值：`false`。                                                                                                                                                                                          | 可选     |
| FORCE                 | COPY INTO 通过自动跟踪和防止在默认的 12 小时内重新加载文件来确保幂等性。可以使用 `load_file_metadata_expire_hours` 设置自定义此时间，以控制文件元数据的过期时间。<br/>此参数默认为 `false`，表示 COPY INTO 在复制数据时会跳过重复文件。如果为 `true`，则不会跳过重复文件。 | 可选     |
| DISABLE_VARIANT_CHECK | 如果为 `true`，则在 COPY INTO 期间，无效的 JSON 数据会被替换为 null 值。如果为 `false`（默认值），则 COPY INTO 会在遇到无效的 JSON 数据时失败。                                                                                                                            | 可选     |
| ON_ERROR              | 决定如何处理包含错误的文件：`continue` 跳过并继续，`abort`（默认值）在发生错误时终止，`abort_N` 在错误数 ≥ N 时终止。注意：`abort_N` 不适用于 Parquet 文件。                                                                                                               | 可选     |
| MAX_FILES             | 设置要加载的尚未加载的最大文件数。该值可以设置为最多 15,000；任何大于 15,000 的值都将被视为 15,000。                                                                                                                                                                       | 可选     |
| RETURN_FAILED_ONLY    | 设置为 `true` 时，输出中将仅包含加载失败的文件。默认值：`false`。                                                                                                                                                                                                          | 可选     |
| COLUMN_MATCH_MODE     | （仅适用于 Parquet）确定 COPY INTO 期间的列名匹配是否区分大小写 `case-sensitive` 或不区分大小写 `case-insensitive`（默认值）。                                                                                                                                             | 可选     |

:::tip
当导入大量数据（例如日志）时，建议将 `PURGE` 和 `FORCE` 都设置为 `true`。这可以确保高效的数据导入，而无需与 Meta 服务器交互（更新已复制文件集）。但是，重要的是要注意这可能会导致重复的数据导入。
:::

## 输出

COPY INTO 提供了数据加载结果的摘要，包含以下列：

| 列               | 类型    | 是否可为空 | 描述                         |
| ---------------- | ------- | ---------- | ---------------------------- |
| FILE             | VARCHAR | 否         | 源文件的相对路径。           |
| ROWS_LOADED      | INT     | 否         | 从源文件加载的行数。         |
| ERRORS_SEEN      | INT     | 否         | 源文件中的错误行数。         |
| FIRST_ERROR      | VARCHAR | 是         | 在源文件中找到的第一个错误。 |
| FIRST_ERROR_LINE | INT     | 是         | 第一个错误的行号。           |

如果 `RETURN_FAILED_ONLY` 设置为 `true`，则输出将仅包含加载失败的文件。

## 分布式 COPY INTO

Databend 中的 COPY INTO 功能在集群环境中自动激活分布式执行，从而提高数据加载效率和可扩展性。

## 示例

### 示例 1：从 Stages 加载

这些示例展示了从各种类型的 Stage 将数据加载到 Databend 中：

<Tabs>
  <TabItem value="user" label="用户 Stage" default>

```sql
COPY INTO mytable
    FROM @~
    PATTERN = '.*[.]parquet'
    FILE_FORMAT = (TYPE = PARQUET);
```

  </TabItem>
  <TabItem value="internal" label="内部 Stage">

```sql
COPY INTO mytable
    FROM @my_internal_stage
    PATTERN = '.*[.]parquet'
    FILE_FORMAT = (TYPE = PARQUET);
```

  </TabItem>
  <TabItem value="external" label="外部 Stage">

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

此示例使用 AWS 访问密钥和密钥建立与 Amazon S3 的连接，并从 CSV 文件加载 10 行数据：

```sql
-- 使用 AWS 访问密钥和密钥进行身份验证。
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

此示例使用带有外部 ID 的 AWS IAM 角色身份验证连接到 Amazon S3，并从 'mybucket' 加载与指定模式匹配的 CSV 文件：

```sql
-- 通过 AWS IAM 角色和外部 ID 进行身份验证。
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

此示例连接到 Azure Blob Storage 并将数据从 'data.csv' 加载到 Databend 中：

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

<TabItem value="Remote Files" label="远程文件">

此示例从三个远程 CSV 文件加载数据，并在发生错误时跳过一个文件。

```sql
COPY INTO mytable
    FROM 'https://ci.databend.org/dataset/stateful/ontime_200{6,7,8}_200.csv'
    FILE_FORMAT = (type = CSV)
    ON_ERROR = continue;
```

</TabItem>

<TabItem value="IPFS" label="IPFS">

此示例从 IPFS 上的 CSV 文件加载数据：

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
