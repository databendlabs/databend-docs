---
title: "COPY INTO <table>"
sidebar_label: "COPY INTO <table>"
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.466"/>

COPY INTO 允许您从以下位置的文件加载数据：

- 用户/内部/外部 Stage：参见 [什么是 Stage？](/guides/load-data/stage/what-is-stage)了解 Databend 中的 Stage。
- 存储服务中创建的桶或容器。
- 远程服务器，您可以通过其 URL（以 "https://..." 开头）访问文件。
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
         | TYPE = { CSV | TSV | NDJSON | PARQUET | ORC } [ formatTypeOptions ]
       ) ]
[ copyOptions ]
```

### FROM ...

FROM 子句指定源位置（用户 Stage、内部 Stage、外部 Stage 或外部位置），使用 COPY INTO 命令将数据加载到指定的表中。您还可以嵌套 SELECT ... FROM 子查询来转换要加载的数据。有关更多信息，请参阅 [加载时数据转换](/guides/load-data/transform/data-load-transform) 。

:::note
当您从已暂存文件加载数据且 Stage 路径包含空格或括号等特殊字符时，可以整个路径用单引号括起来，如下面的 SQL 语句所示：

```sql
COPY INTO mytable FROM 's3://mybucket/dataset(databend)/' ...
COPY INTO mytable FROM 's3://mybucket/dataset databend/' ...
```

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

<TabItem value="Amazon S3 及兼容存储服务" label="Amazon S3 及兼容存储服务">

```sql
externalLocation ::=
  's3://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 Amazon S3 及兼容存储服务的可用连接参数，请参阅 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Azure Blob存储" label="Azure Blob存储">

```sql
externalLocation ::=
  'azblob://<container>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 Azure Blob Storage 的可用连接参数，请参阅 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Google Cloud Storage" label="Google Cloud Storage">

```sql
externalLocation ::=
  'gcs://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 Google Cloud Storage 的可用连接参数，请参阅[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="阿里云OSS" label="阿里云OSS">

```sql
externalLocation ::=
  'oss://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问阿里云 OSS 的可用连接参数，请参阅 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="腾讯云对象存储" label="腾讯云对象存储">

```sql
externalLocation ::=
  'cos://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问腾讯云对象存储的可用连接参数，请参阅 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="HDFS" label="HDFS">

```sql
externalLocation ::=
  'hdfs://<endpoint_url>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 HDFS 的可用连接参数，请参阅 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="WebHDFS" label="WebHDFS">

```sql
externalLocation ::=
  'webhdfs://<endpoint_url>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 WebHDFS 的可用连接参数，请参阅[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="远程文件" label="远程文件">

```sql
externalLocation ::=
  'https://<URL>'
```

您可以使用通配符模式指定多个文件。例如，使用

- `ontime_200{6,7,8}.csv` 表示 `ontime_2006.csv`,`ontime_2007.csv`,`ontime_2008.csv`。
- `ontime_200[6-8].csv` 表示 `ontime_2006.csv`,`ontime_2007.csv`,`ontime_2008.csv`。

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

FILES 指定一个或多个要加载的文件名（用逗号分隔）。

### PATTERN

一个基于[PCRE2](https://www.pcre.org/current/doc/html/pcre2syntax.html)的正则表达式模式字符串，用单引号括起来，指定要匹配的文件名。有关 PCRE2 语法，请参阅http://www.pcre.org/current/doc/html/pcre2syntax.html。有关使用PATTERN参数过滤文件的示例和有用提示，请参阅[示例4：使用模式过滤文件](#示例-4-使用模式过滤文件)。

### FILE_FORMAT

详情请参阅[输入与输出文件格式](../../00-sql-reference/50-file-format-options.md)。

### copyOptions

```sql
copyOptions ::=
  [ SIZE_LIMIT = <num> ]
  [ PURGE = <bool> ]
  [ FORCE = <bool> ]
  [ DISABLE_VARIANT_CHECK = <bool> ]
  [ ON_ERROR = { continue | abort | abort_N } ]
  [ MAX_FILES = <num> ]
```

| 参数                  | 描述                                                                                                                                                                                                                                                                                 | 是否必需 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| SIZE_LIMIT            | 指定单个 COPY 语句可加载的最大数据行数。默认为 `0`，表示无限制。                                                                                                                                                                                                                     | 可选     |
| PURGE                 | 如果设置为 `True`，则在数据成功加载到表中后，将清除 Stage 中的文件。默认值：`False`。                                                                                                                                                                                                | 可选     |
| FORCE                 | COPY INTO 通过自动跟踪并防止文件重复加载来确保幂等性，默认防止重复的时间周期为 12 小时。可以使用 `load_file_metadata_expire_hours` 设置来自定义文件元数据的过期时间。<br/>此参数默认为 `False`，意味着 COPY INTO 在复制数据时会跳过重复文件。如果设置为 `True`，则不会跳过重复文件。 | 可选     |
| DISABLE_VARIANT_CHECK | 如果为 `true`，在 COPY INTO 操作中，无效的 JSON 数据将被替换为 null 值。如果为 `false`（默认值），则 COPY INTO 在遇到无效 JSON 数据时将失败。                                                                                                                                        | 可选     |
| ON_ERROR              | 决定如何处理包含错误的文件：`continue` 继续跳过并处理后续文件，`abort` 遇错即终止，`abort_N` 当错误数 ≥ N 时终止。默认为 `abort`。注意：对于 Parquet 文件，不可使用 `abort_N`。                                                                                                      | 可选     |
| MAX_FILES             | 设置尚未加载的文件的最大数量。该值可以设置最高为 15000；任何大于 15000 的值都将被视为 15000。                                                                                                                                                                                        | 可选     |
| RETURN_FAILED_ONLY    | 当设置为 'True' 时，只有加载失败的文件会在输出中返回。默认值：`False`。                                                                                                                                                                                                              | 可选     |

:::tip
在导入大量数据量，如日志时，建议将 `PURGE` 和 `FORCE` 都设置为 True。这可以确保高效的数据导入，且无需与 Meta 服务器交互（更新已复制文件集）。但是，需要注意的是，这可能会导致数据重复导入。
:::

## 输出

COPY INTO 提供了数据加载结果的总结，包括以下列：

| 列名             | 类型    | 是否可为空 | 描述                       |
| ---------------- | ------- | ---------- | -------------------------- |
| FILE             | VARCHAR | 否         | 源文件的相对路径。         |
| ROWS_LOADED      | INT     | 否         | 从源文件加载的行数。       |
| ERRORS_SEEN      | INT     | 否         | 源文件中的错误行数。       |
| FIRST_ERROR      | VARCHAR | 是         | 源文件中发现的第一个错误。 |
| FIRST_ERROR_LINE | INT     | 是         | 第一个错误的行号。         |

如果设置了 RETURN_FAILED_ONLY 为 True，输出将仅包含加载失败的文件。

## 分布式 COPY INTO

在集群环境中，Databend 的 COPY INTO 功能自动激活分布式执行，提高数据加载效率和可扩展性。

## 示例

### 示例 1：从 Stage 加载

以下示例展示了从各种类型的 Stage 向 Databend 加载数据：

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

以下示例展示了从各种类型的外部来源向 Databend 加载数据：

<Tabs groupId="external-example">
<TabItem value="Amazon S3" label="Amazon S3">

此示例使用 AWS 访问密钥和秘密连接到 Amazon S3，并从 CSV 文件中加载 10 行数据：

```sql
-- 通过 AWS 访问密钥和秘密认证。
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

此示例使用 AWS IAM 角色和外部 ID 认证连接到 Amazon S3，并从 'mybucket' 加载符合指定模式的 CSV 文件：

```sql
-- 通过 AWS IAM 角色和外部 ID 认证。
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

此示例连接到 Azure Blob Storage，并从 'data.csv' 向 Databend 加载数据：

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

此示例从三个远程 CSV 文件加载数据，并在出现错误时跳过文件。

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

本示例演示如何将位于 Amazon S3 上的 GZIP 压缩 CSV 文件加载到 Databend 中：

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

### 示例 4: 使用模式过滤文件

本示例展示如何使用 PATTERN 参数从 Amazon S3 加载 CSV 文件，并通过模式匹配进行文件过滤。它筛选出文件名中包含 'sales' 且扩展名为 '.csv' 的文件：

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

其中 `.*` 被解释为任意字符的零个或多个出现。方括号用于转义紧跟文件扩展名的句点字符 `.`。

要加载所有 CSV 文件：

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

当为包含多个文件夹的文件路径指定模式时，请考虑您的匹配标准：

- 如果您想匹配特定子路径（例如，'multi_page/'），请在模式中包含前缀，然后指定您希望在该子路径内匹配的模式（例如，'\_page_1'）。

```sql
-- 文件路径：parquet/multi_page/multi_page_1.parquet
COPY INTO ... FROM @data/parquet/ PATTERN = 'multi_page/.*_page_1.*') ...
```

- 如果您想匹配文件路径中任何包含所需模式的部分，请在模式前后使用 '.*'（例如，'.*multi_page_1.\*'）以匹配路径中任何出现的 'multi_page_1'。

```sql
-- 文件路径：parquet/multi_page/multi_page_1.parquet
COPY INTO ... FROM @data/parquet/ PATTERN ='.*multi_page_1.*') ...
```

### 示例 5: 加载到具有额外列的表

本节演示如何将数据加载到一个具有额外列的表中，使用示例文件 [books.csv](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv)：

```text title='books.csv'
Transaction Processing,Jim Gray,1992
Readings in Database Systems,Michael Stonebraker,2004
```

![Alt text](@site/docs/public/img/load/load-extra.png)

默认情况下，COPY INTO 通过匹配文件中字段的顺序与表中相应的列来加载数据。确保文件和表之间的数据正确对齐至关重要。例如，

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

如果您的表有比文件更多的列，您可以指定要加载数据的列。例如，

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

如果您的表有比文件更多的列，并且额外的列位于表的末尾，您可以使用 [FILE_FORMAT](#file_format) 选项 `ERROR_ON_COLUMN_COUNT_MISMATCH` 来加载数据，而无需指定每个列。请注意，ERROR_ON_COLUMN_COUNT_MISMATCH 目前仅适用于 CSV 文件格式。

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
表中的额外列可以通过 [CREATE TABLE](../00-ddl/01-table/10-ddl-create-table.md) 或 [ALTER TABLE COLUMN](../00-ddl/01-table/90-alter-table-column.md) 指定默认值。如果没有为额外列显式设置默认值，则将应用与其数据类型关联的默认值。例如，整数类型的列如果没有指定其他值，将默认为 0。
:::

### 示例 6: 加载具有自定义格式的 JSON

本示例加载来自内容如下的 CSV 文件 "data.csv" 的数据：

```json
1,"U00010","{\"carPriceList\":[{\"carTypeId":10,\"distance":5860},{\"carTypeId":11,\"distance":5861}]}"
2,"U00011","{\"carPriceList\":[{\"carTypeId":12,\"distance":5862},{\"carTypeId":13,\"distance":5863}]}"
```

每行包含三个数据列，其中第三列是包含 JSON 数据的字符串。为了正确加载包含 JSON 字段的 CSV 数据，我们需要设置正确的转义字符。本示例使用反斜杠 \ 作为转义字符，因为 JSON 数据包含双引号 "。

#### 步骤 1: 创建自定义文件格式。

```sql
-- 定义一个自定义 CSV 文件格式，将转义字符设置为反斜杠 \
CREATE FILE FORMAT my_csv_format
    TYPE = CSV
    ESCAPE = '\\';
```

#### 步骤 2: 创建目标表。

```sql
CREATE TABLE t
  (
     id       INT,
     seq      VARCHAR,
     p_detail VARCHAR
  );
```

#### 步骤 3: 使用自定义文件格式加载。

```sql
COPY INTO t FROM @t_stage FILES=('data.csv')
FILE_FORMAT=(FORMAT_NAME='my_csv_format');
```

### 示例 7: 加载无效的 JSON

当将数据加载到 Variant 列时，Databend 会自动检查数据的合法性，并在数据无效时抛出错误。例如，如果您在用户 Stage 有一个名为 `invalid_json_string.parquet` 的 Parquet 文件，其中包含无效的 JSON 数据，如下所示：

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

要加载而不检查 JSON 有效性，请在 COPY INTO 语句中将选项 `DISABLE_VARIANT_CHECK` 设置为 `true`：

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
