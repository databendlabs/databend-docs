---
title: "COPY INTO <table>"
sidebar_label: "COPY INTO <table>"
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.704"/>

COPY INTO 允许您从位于以下位置之一的文件加载数据：

- 用户/内部/外部 Stage：请参阅 [什么是 Stage?](/guides/load-data/stage/what-is-stage) 以了解 Databend 中的 Stage。
- 在存储服务中创建的存储桶或容器。
- 可以通过 URL 访问文件的远程服务器（以“https://...”开头）。
- [IPFS](https://ipfs.tech)。

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
         | TYPE = { CSV | TSV | NDJSON | PARQUET | ORC | AVRO } [ formatTypeOptions ]
       ) ]
[ copyOptions ]
```

### FROM ...

FROM 子句指定源位置（用户 Stage、内部 Stage、外部 Stage 或外部位置），COPY INTO 命令将使用该位置将数据加载到指定的表中。您还可以嵌套 SELECT ... FROM 子查询来转换要加载的数据。有关更多信息，请参见 [加载时转换数据](/guides/load-data/transform/data-load-transform)。

:::note
当您从暂存文件加载数据，并且 Stage 路径包含空格或括号等特殊字符时，您可以将整个路径用单引号引起来，如以下 SQL 语句所示：

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

您可以使用 glob 模式来指定多个文件。例如，使用

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

一个基于 [PCRE2](https://www.pcre.org/current/doc/html/) 的正则表达式模式字符串，用单引号引起来，用于指定要匹配的文件名。有关 PCRE2 语法，请参见 http://www.pcre.org/current/doc/html/pcre2syntax.html。有关使用 PATTERN 参数过滤文件的示例和有用提示，请参见 [示例 4：使用 Pattern 过滤文件](#example-4-filtering-files-with-pattern)。

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

| 参数                | 描述                                                                                                                                                                                                                                                                                                                                                                                                        | 是否必须 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| SIZE_LIMIT            | 指定给定 COPY 语句要加载的最大数据行数。默认为 `0`，表示没有限制。                                                                                                                                                                                                                                                                                                                                                                   | 可选     |
| PURGE                 | 如果为 `true`，则命令会在成功将文件加载到表后，清除 Stage 中的文件。默认值：`false`。                                                                                                                                                                                                                                                                                                                                                    | 可选     |
| FORCE                 | COPY INTO 通过自动跟踪和阻止在默认的 12 小时内重新加载文件来确保幂等性。可以使用 `load_file_metadata_expire_hours` 设置自定义此时间，以控制文件元数据的过期时间。<br/>此参数默认为 `false`，表示 COPY INTO 在复制数据时会跳过重复文件。如果为 `true`，则不会跳过重复文件。 | 可选     |
| DISABLE_VARIANT_CHECK | 如果为 `true`，则在 COPY INTO 期间，无效的 JSON 数据会被替换为 null 值。如果为 `false`（默认值），则 COPY INTO 在遇到无效的 JSON 数据时会失败。                                                                                                                                                                                                                                                                            | 可选     |
| ON_ERROR              | 决定如何处理包含错误的文件：`continue` 跳过并继续，`abort`（默认值）在出错时终止，`abort_N` 在错误数 ≥ N 时终止。注意：`abort_N` 不适用于 Parquet 文件。                                                                                                                                                                                                                    | 可选     |
| MAX_FILES             | 设置要加载的尚未加载的文件的最大数量。该值可以设置为最多 15,000；任何大于 15,000 的值都将被视为 15,000。                                                                                                                                                                                                                                                                                                             | 可选     |
| RETURN_FAILED_ONLY    | 设置为 `true` 时，输出中将仅返回加载失败的文件。默认值：`false`。                                                                                                                                                                                                                                                                                                               | 可选     |
| COLUMN_MATCH_MODE     | （仅适用于 Parquet）确定 COPY INTO 期间的列名匹配是否区分大小写 `case-sensitive` 或不区分大小写 `case-insensitive`（默认）。 | 可选     |

:::tip
当导入大量数据（例如日志）时，建议将 `PURGE` 和 `FORCE` 都设置为 `true`。这可以确保高效的数据导入，而无需与 Meta 服务器交互（更新复制文件集）。但是，请务必注意，这可能会导致重复的数据导入。
:::

## 输出

COPY INTO 提供了数据加载结果的摘要，包含以下列：

| 列               | 类型    | 是否允许为空 | 描述                                          |
| ---------------- | ------- | -------- | --------------------------------------------- |
| FILE             | VARCHAR | 否       | 源文件的相对路径。                              |
| ROWS_LOADED      | INT     | 否       | 从源文件加载的行数。                            |
| ERRORS_SEEN      | INT     | 否       | 源文件中的错误行数。                            |
| FIRST_ERROR      | VARCHAR | 是      | 在源文件中找到的第一个错误。                        |
| FIRST_ERROR_LINE | INT     | 是      | 第一个错误的行号。                              |

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
-- 通过 AWS 访问密钥和密钥进行身份验证。
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

此示例从三个远程 CSV 文件加载数据，并在出现错误时跳过一个文件。

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

### 示例 3: 加载压缩数据

此示例将 Amazon S3 上的 GZIP 压缩 CSV 文件加载到 Databend 中：

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

### 示例 4: 使用 Pattern 过滤文件

此示例演示如何使用带有 PATTERN 参数的模式匹配从 Amazon S3 加载 CSV 文件。它会过滤名称中包含 'sales' 且扩展名为 '.csv' 的文件：

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

其中 `.*` 被解释为任何字符的零次或多次出现。方括号转义了文件扩展名前面的句点字符 `.`。

要从所有 CSV 文件加载：

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

在指定包含多个文件夹的文件路径的模式时，请考虑您的匹配标准：

- 如果要匹配前缀后面的特定子路径，请在模式中包含前缀（例如，'multi_page/'），然后指定要在该子路径中匹配的模式（例如，'\_page_1'）。

```sql
-- 文件路径: parquet/multi_page/multi_page_1.parquet
COPY INTO ... FROM @data/parquet/ PATTERN = 'multi_page/.*_page_1.*') ...
```

- 如果要匹配包含所需模式的文件路径的任何部分，请在模式前后使用 '.*'（例如，'.*multi_page_1.\*'）以匹配路径中 'multi_page_1' 的任何出现。

```sql
-- 文件路径: parquet/multi_page/multi_page_1.parquet
COPY INTO ... FROM @data/parquet/ PATTERN ='.*multi_page_1.*') ...
```

### 示例 5: 加载到具有额外列的表

本节演示了将数据加载到具有额外列的表中，使用示例文件 [books.csv](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv)：

```text title='books.csv'
Transaction Processing,Jim Gray,1992
Readings in Database Systems,Michael Stonebraker,2004
```

![Alt text](/img/load/load-extra.png)

默认情况下，COPY INTO 通过将文件中字段的顺序与表中相应列的顺序进行匹配，将数据加载到表中。 必须确保文件和表之间的数据正确对齐。 例如，

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

如果您的表比文件具有更多的列，则可以指定要将数据加载到其中的列。 例如，

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

如果您的表比文件具有更多的列，并且额外的列位于表的末尾，则可以使用 [FILE_FORMAT](#file_format) 选项 `ERROR_ON_COLUMN_COUNT_MISMATCH` 加载数据。 这允许您加载数据而无需单独指定每一列。 请注意，ERROR_ON_COLUMN_COUNT_MISMATCH 当前适用于 CSV 文件格式。

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
表中的额外列可以具有由 [CREATE TABLE](../00-ddl/01-table/10-ddl-create-table.md) 或 [ALTER TABLE COLUMN](../00-ddl/01-table/90-alter-table-column.md) 指定的默认值。 如果未显式为额外列设置默认值，则将应用与其数据类型关联的默认值。 例如，如果未指定其他值，则整数类型列将默认为 0。
:::

### 示例 6: 加载具有自定义格式的 JSON

此示例从 CSV 文件 "data.csv" 加载数据，其内容如下：

```json
1,"U00010","{\"carPriceList\":[{\"carTypeId":10,\"distance":5860},{\"carTypeId":11,\"distance\":5861}]}"
2,"U00011","{\"carPriceList\":[{\"carTypeId":12,\"distance":5862},{\"carTypeId":13,\"distance\":5863}]}"
```

每行包含三列数据，其中第三列是包含 JSON 数据的字符串。 要使用 JSON 字段正确加载 CSV 数据，我们需要设置正确的转义字符。 此示例使用反斜杠 \ 作为转义字符，因为 JSON 数据包含双引号 "。

#### 步骤 1：创建自定义文件格式。

```sql
-- 定义一个自定义 CSV 文件格式，并将转义字符设置为反斜杠 \
CREATE FILE FORMAT my_csv_format
    TYPE = CSV
    ESCAPE = '\\';
```

#### 步骤 2：创建目标表。

```sql
CREATE TABLE t
  (
     id       INT,
     seq      VARCHAR,
     p_detail VARCHAR
  );
```

#### 步骤 3：使用自定义文件格式加载。

```sql
COPY INTO t FROM @t_stage FILES=('data.csv')
FILE_FORMAT=(FORMAT_NAME='my_csv_format');
```

### 示例 7: 加载无效 JSON

将数据加载到 Variant 列时，Databend 会自动检查数据的有效性，并在出现任何无效数据时抛出错误。 例如，如果您的用户 Stage 中有一个名为 `invalid_json_string.parquet` 的 Parquet 文件，其中包含无效的 JSON 数据，如下所示：

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

尝试将数据加载到表中时会发生错误：

```sql
root@localhost:8000/default>  COPY INTO t2 FROM @~/invalid_json_string.parquet FILE_FORMAT = (TYPE = PARQUET) ON_ERROR = CONTINUE;
error: APIError: ResponseError with 1006: EOF while parsing a value, pos 3 while evaluating function `parse_json('[1,')`
```

要在不检查 JSON 有效性的情况下加载，请在 COPY INTO 语句中将选项 `DISABLE_VARIANT_CHECK` 设置为 `true`：

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
-- 无效的 JSON 在 Variant 列中存储为 null。
┌──────────────────────────────────────┐
│         a        │         b         │
├──────────────────┼───────────────────┤
│ 5                │ {"k":"v"}         │
│ 6                │ null              │
└──────────────────────────────────────┘
```