---
title: "COPY INTO <表>"
sidebar_label: "COPY INTO <表>"
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.666"/>

COPY INTO 允许您从以下位置之一的文件中加载数据：

- 用户 / 内部 / 外部阶段: 请参阅 [什么是 Stage?](/guides/load-data/stage/what-is-stage) 以了解 Databend 中的阶段。
- 存储服务中创建的存储桶或容器。
- 远程服务器，您可以通过其 URL（以 "https://..." 开头）访问文件。
- [IPFS](https://ipfs.tech)。

另请参阅: [`COPY INTO <位置>`](dml-copy-into-location.md)

## 语法

```sql
COPY INTO [<数据库名>.]<表名>
     FROM { userStage | internalStage | externalStage | externalLocation |
            ( SELECT [<文件列> ... ]
              FROM { userStage | internalStage | externalStage } ) }
[ FILES = ( '<文件名>' [ , '<文件名>' ] [ , ... ] ) ]
[ PATTERN = '<正则表达式模式>' ]
[ FILE_FORMAT = (
         FORMAT_NAME = '<您的自定义格式>'
         | TYPE = { CSV | TSV | NDJSON | PARQUET | ORC } [ formatTypeOptions ]
       ) ]
[ copyOptions ]
```

### FROM ...

FROM 子句指定数据将通过 COPY INTO 命令加载到指定表中的源位置（用户阶段、内部阶段、外部阶段或外部位置）。您还可以嵌套一个 SELECT ... FROM 子查询来转换您要加载的数据。有关更多信息，请参阅 [加载时转换数据](/guides/load-data/transform/data-load-transform)。

:::note
当您从阶段文件加载数据且阶段路径包含空格或括号等特殊字符时，您可以将整个路径用单引号括起来，如下面的 SQL 语句所示：

COPY INTO mytable FROM 's3://mybucket/dataset(databend)/' ...
COPY INTO mytable FROM 's3://mybucket/dataset databend/' ...
:::

#### userStage

```sql
userStage ::= @~[/<路径>]
```

#### internalStage

```sql
internalStage ::= @<内部阶段名>[/<路径>]
```

#### externalStage

```sql
externalStage ::= @<外部阶段名>[/<路径>]
```

#### externalLocation

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="externallocation">

<TabItem value="Amazon S3-like Storage" label="Amazon S3-like Storage">

```sql
externalLocation ::=
  's3://<存储桶>[<路径>]'
  CONNECTION = (
        <连接参数>
  )
```

有关访问 Amazon S3-like 存储服务的可用连接参数，请参阅 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Azure Blob Storage" label="Azure Blob Storage">

```sql
externalLocation ::=
  'azblob://<容器>[<路径>]'
  CONNECTION = (
        <连接参数>
  )
```

有关访问 Azure Blob Storage 的可用连接参数，请参阅 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Google Cloud Storage" label="Google Cloud Storage">

```sql
externalLocation ::=
  'gcs://<存储桶>[<路径>]'
  CONNECTION = (
        <连接参数>
  )
```

有关访问 Google Cloud Storage 的可用连接参数，请参阅 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Alibaba Cloud OSS" label="Alibaba Cloud OSS">

```sql
externalLocation ::=
  'oss://<存储桶>[<路径>]'
  CONNECTION = (
        <连接参数>
  )
```

有关访问 Alibaba Cloud OSS 的可用连接参数，请参阅 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Tencent Cloud Object Storage" label="Tencent Cloud Object Storage">

```sql
externalLocation ::=
  'cos://<存储桶>[<路径>]'
  CONNECTION = (
        <连接参数>
  )
```

有关访问 Tencent Cloud Object Storage 的可用连接参数，请参阅 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Hadoop Distributed File System (HDFS)" label="HDFS">

```sql
externalLocation ::=
  'hdfs://<端点URL>[<路径>]'
  CONNECTION = (
        <连接参数>
  )
```

有关访问 HDFS 的可用连接参数，请参阅 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="WebHDFS" label="WebHDFS">

```sql
externalLocation ::=
  'webhdfs://<端点URL>[<路径>]'
  CONNECTION = (
        <连接参数>
  )
```

有关访问 WebHDFS 的可用连接参数，请参阅 [连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Remote Files" label="Remote Files">

```sql
externalLocation ::=
  'https://<URL>'
```

您可以使用 glob 模式指定多个文件。例如，使用

- `ontime_200{6,7,8}.csv` 表示 `ontime_2006.csv`,`ontime_2007.csv`,`ontime_2008.csv`。
- `ontime_200[6-8].csv` 表示 `ontime_2006.csv`,`ontime_2007.csv`,`ontime_2008.csv`。

</TabItem>

<TabItem value="IPFS" label="IPFS">

```sql
externalLocation ::=
  'ipfs://<您的IPFS哈希>'
  CONNECTION = (ENDPOINT_URL = 'https://<您的IPFS网关>')
```

</TabItem>
</Tabs>

### FILES

FILES 指定要加载的一个或多个文件名（用逗号分隔）。

### PATTERN

一个基于 [PCRE2](https://www.pcre.org/current/doc/html/) 的正则表达式模式字符串，用单引号括起来，指定要匹配的文件名。有关 PCRE2 语法，请参阅 http://www.pcre.org/current/doc/html/pcre2syntax.html。请参阅 [示例 4: 使用模式过滤文件](#example-4-filtering-files-with-pattern) 以获取示例和有关使用 PATTERN 参数过滤文件的有用提示。

### FILE_FORMAT

有关详细信息，请参阅 [输入 & 输出文件格式](../../00-sql-reference/50-file-format-options.md)。

### copyOptions

```sql
copyOptions ::=
  [ SIZE_LIMIT = <数字> ]
  [ PURGE = <布尔值> ]
  [ FORCE = <布尔值> ]
  [ DISABLE_VARIANT_CHECK = <布尔值> ]
  [ ON_ERROR = { continue | abort | abort_N } ]
  [ MAX_FILES = <数字> ]
  [ RETURN_FAILED_ONLY = <布尔值> ]
  [ COLUMN_MATCH_MODE =  { case-sensitive | case-insensitive } ]
```

| 参数                  | 描述                                                                                                                                                                                                                                                                                                                                                                                                        | 是否必需 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| SIZE_LIMIT            | 指定给定 COPY 语句要加载的最大数据行数。默认为 `0`，表示没有限制。                                                                                                                                                                                                                                                                                                     | 可选     |
| PURGE                 | 如果为 `true`，命令将在文件成功加载到表中后清除阶段中的文件。默认值：`false`。                                                                                                                                                                                                                                                                                      | 可选     |
| FORCE                 | COPY INTO 通过自动跟踪和防止在默认 12 小时期间内重新加载文件来确保幂等性。可以使用 `load_file_metadata_expire_hours` 设置自定义文件元数据过期时间。<br/>此参数默认为 `false`，表示 COPY INTO 在复制数据时会跳过重复文件。如果为 `true`，则不会跳过重复文件。 | 可选     |
| DISABLE_VARIANT_CHECK | 如果为 `true`，在 COPY INTO 期间，无效的 JSON 数据将被替换为 null 值。如果为 `false`（默认），COPY INTO 在遇到无效 JSON 数据时会失败。                                                                                                                                                                                                                                                                            | 可选     |
| ON_ERROR              | 决定如何处理包含错误的文件：`continue` 跳过并继续，`abort`（默认）在错误时终止，`abort_N` 在错误 ≥ N 时终止。注意：`abort_N` 不适用于 Parquet 文件。                                                                                                                                                                                     | 可选     |
| MAX_FILES             | 设置要加载的未加载文件的最大数量。该值可以设置为最多 15,000；任何大于 15,000 的值都将被视为 15,000。                                                                                                                                                                                                                                               | 可选     |
| RETURN_FAILED_ONLY    | 当设置为 `true` 时，输出中仅返回加载失败的文件。默认值：`false`。                                                                                                                                                                                                                                                                                                               | 可选     |
| COLUMN_MATCH_MODE     | （仅适用于 Parquet）确定 COPY INTO 期间列名匹配是 `区分大小写` 还是 `不区分大小写`（默认）。 | 可选 |

:::tip
在导入大量数据（如日志）时，建议将 `PURGE` 和 `FORCE` 都设置为 `true`。这样可以确保高效的数据导入，而无需与 Meta 服务器交互（更新已复制文件集）。但需要注意的是，这可能会导致重复数据导入。
:::

## 输出

COPY INTO 提供数据加载结果的摘要，包含以下列：

| 列名               | 类型    | 可空性 | 描述                                     |
| ---------------- | ------- | -------- | ----------------------------------------------- |
| FILE             | VARCHAR | 否       | 源文件的相对路径。           |
| ROWS_LOADED      | INT     | 否       | 从源文件加载的行数。 |
| ERRORS_SEEN      | INT     | 否       | 源文件中的错误行数         |
| FIRST_ERROR      | VARCHAR | 是       | 源文件中发现的第一个错误。       |
| FIRST_ERROR_LINE | INT     | 是       | 第一个错误的行号。                 |

如果 `RETURN_FAILED_ONLY` 设置为 `true`，输出将仅包含加载失败的文件。

## 分布式 COPY INTO

Databend 中的 COPY INTO 功能在集群环境中自动激活分布式执行，增强数据加载效率和可扩展性。

## 示例

### 示例 1：从阶段加载

这些示例展示了从不同类型的阶段将数据加载到 Databend 中：

<Tabs>
  <TabItem value="user" label="用户阶段" default>

```sql
COPY INTO mytable
    FROM @~
    PATTERN = '.*[.]parquet'
    FILE_FORMAT = (TYPE = PARQUET);
```

  </TabItem>
  <TabItem value="internal" label="内部阶段">

```sql
COPY INTO mytable
    FROM @my_internal_stage
    PATTERN = '.*[.]parquet'
    FILE_FORMAT = (TYPE = PARQUET);
```

  </TabItem>
  <TabItem value="external" label="外部阶段">

```sql
COPY INTO mytable
    FROM @my_external_stage
    PATTERN = '.*[.]parquet'
    FILE_FORMAT = (TYPE = PARQUET);
```

  </TabItem>
</Tabs>

### 示例 2：从外部位置加载

这些示例展示了从不同类型的外部源将数据加载到 Databend 中：

<Tabs groupId="external-example">
<TabItem value="Amazon S3" label="Amazon S3">

此示例使用 AWS 访问密钥和秘密建立与 Amazon S3 的连接，并从 CSV 文件加载 10 行数据：

```sql
-- 通过 AWS 访问密钥和秘密进行身份验证。
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

此示例使用 AWS IAM 角色身份验证和外部 ID 连接到 Amazon S3，并从 'mybucket' 中加载与指定模式匹配的 CSV 文件：

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

此示例连接到 Azure Blob Storage 并将 'data.csv' 中的数据加载到 Databend 中：

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

### 示例 3：加载压缩数据

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

### 示例 4：使用模式过滤文件

此示例演示如何使用 PATTERN 参数从 Amazon S3 加载 CSV 文件。它过滤名称中包含 'sales' 且扩展名为 '.csv' 的文件：

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

其中 `.*` 被解释为零个或多个任意字符的匹配。方括号用于转义紧随文件扩展名之前的句点字符 `.`。

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

在指定包含多个文件夹的文件路径模式时，请考虑您的匹配标准：

- 如果您想匹配前缀后的特定子路径，请在模式中包含前缀（例如，'multi_page/'），然后在子路径中指定您想要匹配的模式（例如，'\_page_1'）。

```sql
-- 文件路径：parquet/multi_page/multi_page_1.parquet
COPY INTO ... FROM @data/parquet/ PATTERN = 'multi_page/.*_page_1.*') ...
```

- 如果您想匹配文件路径中包含所需模式的任何部分，请在模式前后使用 '.*'（例如，'.*multi_page_1.\*'）以匹配路径中任何位置的 'multi_page_1'。

```sql
-- 文件路径：parquet/multi_page/multi_page_1.parquet
COPY INTO ... FROM @data/parquet/ PATTERN ='.*multi_page_1.*') ...
```

### 示例 5：加载到具有额外列的表中

本节演示如何将数据加载到具有额外列的表中，使用示例文件 [books.csv](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv)：

```text title='books.csv'
Transaction Processing,Jim Gray,1992
Readings in Database Systems,Michael Stonebraker,2004
```

![Alt text](/img/load/load-extra.png)

默认情况下，COPY INTO 通过将文件中的字段顺序与表中的相应列匹配来加载数据。确保文件和表之间的数据正确对齐至关重要。例如，

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

如果您的表比文件多列，您可以指定要将数据加载到的列。例如，

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

如果您的表比文件多列，并且额外列位于表的末尾，您可以使用 [FILE_FORMAT](#file_format) 选项 `ERROR_ON_COLUMN_COUNT_MISMATCH` 加载数据。这允许您在不指定每个列的情况下加载数据。请注意，ERROR_ON_COLUMN_COUNT_MISMATCH 目前仅适用于 CSV 文件格式。

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
表中的额外列可以有由 [CREATE TABLE](../00-ddl/01-table/10-ddl-create-table.md) 或 [ALTER TABLE COLUMN](../00-ddl/01-table/90-alter-table-column.md) 指定的默认值。如果未为额外列显式设置默认值，将应用与其数据类型关联的默认值。例如，整数类型列在没有其他值指定时将默认为 0。
:::

### 示例 6：加载具有自定义格式的 JSON

此示例从包含以下内容的 CSV 文件 "data.csv" 加载数据：

```json
1,"U00010","{\"carPriceList\":[{\"carTypeId":10,\"distance":5860},{\"carTypeId":11,\"distance":5861}]}"
2,"U00011","{\"carPriceList\":[{\"carTypeId":12,\"distance":5862},{\"carTypeId":13,\"distance":5863}]}"
```

每行包含三列数据，第三列是一个包含 JSON 数据的字符串。要正确加载带有 JSON 字段的 CSV 数据，我们需要设置正确的转义字符。此示例使用反斜杠 \ 作为转义字符，因为 JSON 数据包含双引号 "。

#### 步骤 1：创建自定义文件格式。

```sql
-- 定义一个自定义 CSV 文件格式，转义字符设置为反斜杠 \
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

### 示例 7：加载无效的 JSON

当将数据加载到 Variant 列时，Databend 会自动检查数据的合法性，并在遇到任何无效数据时抛出错误。例如，如果您在用户阶段有一个包含无效 JSON 数据的 Parquet 文件 `invalid_json_string.parquet`，如下所示：

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

尝试将数据加载到表中时会出现错误：

```sql
root@localhost:8000/default>  COPY INTO t2 FROM @~/invalid_json_string.parquet FILE_FORMAT = (TYPE = PARQUET) ON_ERROR = CONTINUE;
error: APIError: ResponseError with 1006: EOF while parsing a value, pos 3 while evaluating function `parse_json('[1,')`
```

要加载而不检查 JSON 的合法性，请在 COPY INTO 语句中将选项 `DISABLE_VARIANT_CHECK` 设置为 `true`：

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