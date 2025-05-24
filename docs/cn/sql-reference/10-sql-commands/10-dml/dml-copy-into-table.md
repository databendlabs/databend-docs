---
title: "COPY INTO <table>"
sidebar_label: "COPY INTO <table>"
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<FunctionDescription description="Introduced or updated: v1.2.704"/>

COPY INTO 允许您从以下位置的文件加载数据：

- 用户/内部/外部 Stage：请参阅 [什么是 Stage？](/guides/load-data/stage/what-is-stage) 了解 Databend 中的 Stage。
- 在存储服务中创建的存储桶或容器。
- 可以通过 URL 访问文件的远程服务器（以 "https://..." 开头）。
- [IPFS](https://ipfs.tech) 和 Hugging Face 存储库。

另请参阅：[`COPY INTO <location>`](dml-copy-into-location.md)

## 语法

```sql
/* 标准数据加载 */
COPY INTO [<database_name>.]<table_name> [ ( <col_name> [ , <col_name> ... ] ) ]
     FROM { userStage | internalStage | externalStage | externalLocation }
[ FILES = ( '<file_name>' [ , '<file_name>' ] [ , ... ] ) ]
[ PATTERN = '<regex_pattern>' ]
[ FILE_FORMAT = (
         FORMAT_NAME = '<your-custom-format>'
         | TYPE = { CSV | TSV | NDJSON | PARQUET | ORC | AVRO } [ formatTypeOptions ]
       ) ]
[ copyOptions ]

/* 使用转换的数据加载 */
COPY INTO [<database_name>.]<table_name> [ ( <col_name> [ , <col_name> ... ] ) ]
     FROM ( SELECT [<alias>.]$<file_col_num>[.<element>] [ , [<alias>.]$<file_col_num>[.<element>] ... ]
            FROM { userStage | internalStage | externalStage } )
[ FILES = ( '<file_name>' [ , '<file_name>' ] [ , ... ] ) ]
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
  /* 类似 Amazon S3 的存储 */
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
  
  /* 阿里云 OSS */
  | 'oss://<bucket>[/<path>]'
    CONNECTION = (
      ACCESS_KEY_ID = '<your-ak>'
      ACCESS_KEY_SECRET = '<your-sk>'
      ENDPOINT_URL = '<endpoint-url>'
      [ PRESIGN_ENDPOINT_URL = '<presign-endpoint-url>' ]
    )
  
  /* 腾讯云对象存储 */
  | 'cos://<bucket>[/<path>]'
    CONNECTION = (
      SECRET_ID = '<your-secret-id>'
      SECRET_KEY = '<your-secret-key>'
      ENDPOINT_URL = '<endpoint-url>'
    )
  
  /* 远程文件 */
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
  /* 所有格式的通用选项 */
  [ COMPRESSION = AUTO | GZIP | BZ2 | BROTLI | ZSTD | DEFLATE | RAW_DEFLATE | XZ | NONE ]
  
  /* CSV 特定选项 */
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
  
  /* TSV 特定选项 */
  [ RECORD_DELIMITER = '<character>' ]
  [ FIELD_DELIMITER = '<character>' ]
  
  /* NDJSON 特定选项 */
  [ NULL_FIELD_AS = NULL | FIELD_DEFAULT ]
  [ MISSING_FIELD_AS = ERROR | NULL | FIELD_DEFAULT ]
  [ ALLOW_DUPLICATE_KEYS = TRUE | FALSE ]
  
  /* PARQUET 特定选项 */
  [ MISSING_FIELD_AS = ERROR | FIELD_DEFAULT ]
  
  /* ORC 特定选项 */
  [ MISSING_FIELD_AS = ERROR | FIELD_DEFAULT ]
  
  /* AVRO 特定选项 */
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

## 主要参数

- **FILES**: 指定要加载的一个或多个文件名（以逗号分隔）。

- **PATTERN**: 一个基于 [PCRE2](https://www.pcre.org/current/doc/html/)-based 的正则表达式模式字符串，用于指定要匹配的文件名。请参阅 [示例 4：使用模式过滤文件](#example-4-filtering-files-with-pattern)。

## 格式类型选项

`FILE_FORMAT` 参数支持不同的文件类型，每种类型都有特定的格式化选项。以下是每种支持的文件格式的可用选项：

### 所有格式的通用选项

| 选项 | 描述 | 值 | 默认值 |
|--------|-------------|--------|--------|
| COMPRESSION | 数据文件的压缩算法 | AUTO, GZIP, BZ2, BROTLI, ZSTD, DEFLATE, RAW_DEFLATE, XZ, NONE | AUTO |

### TYPE = CSV

| 选项 | 描述 | 默认值 |
|--------|-------------|--------|
| RECORD_DELIMITER | 分隔记录的字符 | 换行符 |
| FIELD_DELIMITER | 分隔字段的字符 | 逗号 (,) |
| SKIP_HEADER | 要跳过的标题行数 | 0 |
| QUOTE | 用于引用字段的字符 | 双引号 (") |
| ESCAPE | 用于封闭字段的转义字符 | NONE |
| NAN_DISPLAY | 表示 NaN 值的字符串 | NaN |
| NULL_DISPLAY | 表示 NULL 值的字符串 | \N |
| ERROR_ON_COLUMN_COUNT_MISMATCH | 如果列计数不匹配则报错 | TRUE |
| EMPTY_FIELD_AS | 如何处理空字段 | null |
| BINARY_FORMAT | 二进制数据的编码格式（HEX 或 BASE64） | HEX |

### TYPE = TSV

| 选项 | 描述 | 默认值 |
|--------|-------------|--------|
| RECORD_DELIMITER | 分隔记录的字符 | 换行符 |
| FIELD_DELIMITER | 分隔字段的字符 | 制表符 (\t) |

### TYPE = NDJSON

| 选项 | 描述 | 默认值 |
|--------|-------------|--------|
| NULL_FIELD_AS | 如何处理空字段 | NULL |
| MISSING_FIELD_AS | 如何处理缺失字段 | ERROR |
| ALLOW_DUPLICATE_KEYS | 允许重复的对象键 | FALSE |

### TYPE = PARQUET

| 选项 | 描述 | 默认值 |
|--------|-------------|--------|
| MISSING_FIELD_AS | 如何处理缺失字段 | ERROR |

### TYPE = ORC

| 选项 | 描述 | 默认值 |
|--------|-------------|--------|
| MISSING_FIELD_AS | 如何处理缺失字段 | ERROR |

### TYPE = AVRO

| 选项 | 描述 | 默认值 |
|--------|-------------|--------|
| MISSING_FIELD_AS | 如何处理缺失字段 | ERROR |

## Copy 选项

| 参数 | 描述 | 默认值 |
|-----------|-------------|----------|
| SIZE_LIMIT | 要加载的最大数据行数 | `0` (无限制) |
| PURGE | 成功加载后清除文件 | `false` |
| FORCE | 允许重新加载重复文件 | `false` (跳过重复项) |
| DISABLE_VARIANT_CHECK | 将无效 JSON 替换为 null | `false` (在无效 JSON 上失败) |
| ON_ERROR | 如何处理错误：`continue`、`abort` 或 `abort_N` | `abort` |
| MAX_FILES | 要加载的最大文件数（最多 15,000 个） | - |
| RETURN_FAILED_ONLY | 仅在输出中返回失败的文件 | `false` |
| COLUMN_MATCH_MODE | 对于 Parquet：列名匹配模式 | `case-insensitive` |

:::tip
当导入大量数据（如日志）时，将 `PURGE` 和 `FORCE` 都设置为 `true`，以实现高效的数据导入，而无需与 Meta 服务器交互。请注意，这可能会导致重复的数据导入。
:::

:::tip
当导入大量数据（例如日志）时，建议将 `PURGE` 和 `FORCE` 都设置为 `true`。这可确保高效的数据导入，而无需与 Meta 服务器交互（更新复制文件集）。但是，重要的是要注意，这可能会导致重复的数据导入。
:::

## 输出

COPY INTO 提供了数据加载结果的摘要，其中包含以下列：

| 列 | 类型 | 是否可为空 | 描述 |
| ---------------- | ------- | -------- | ----------------------------------------------- |
| FILE | VARCHAR | NO | 源文件的相对路径。 |
| ROWS_LOADED | INT | NO | 从源文件加载的行数。 |
| ERRORS_SEEN | INT | NO | 源文件中的错误行数 |
| FIRST_ERROR | VARCHAR | YES | 在源文件中找到的第一个错误。 |
| FIRST_ERROR_LINE | INT | YES | 第一个错误的行号。 |

如果 `RETURN_FAILED_ONLY` 设置为 `true`，则输出将仅包含加载失败的文件。

## 示例

### 示例 1：从 Stage 加载

这些示例展示了从各种类型的 Stage 将数据加载到 Databend 中：

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
-- 通过 AWS 访问密钥和私钥进行身份验证。
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

<TabItem value="Remote Files" label="Remote Files">

此示例从三个远程 CSV 文件加载数据，并在发生错误时跳过文件。

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

其中 `.*` 被解释为零个或多个任意字符的出现。方括号转义了文件扩展名前面的句点字符 `.`。

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
-- 文件路径：parquet/multi_page/multi_page_1.parquet
COPY INTO ... FROM @data/parquet/ PATTERN = 'multi_page/.*_page_1.*') ...
```

- 如果要匹配包含所需模式的文件路径的任何部分，请在模式前后使用 '.*'（例如，'.*multi_page_1.\*'）以匹配路径中 'multi_page_1' 的任何出现。

```sql
-- 文件路径：parquet/multi_page/multi_page_1.parquet
COPY INTO ... FROM @data/parquet/ PATTERN ='.*multi_page_1.*') ...
```

### 示例 5：加载到具有额外列的表

本节演示了将数据加载到具有额外列的表中，使用示例文件 [books.csv](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv)：

```text title='books.csv'
Transaction Processing,Jim Gray,1992
Readings in Database Systems,Michael Stonebraker,2004
```

![Alt text](/img/load/load-extra.png)

默认情况下，COPY INTO 通过匹配文件中字段的顺序与表中相应列的顺序来将数据加载到表中。 必须确保文件和表之间的数据正确对齐。 例如，

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

如果您的表比文件具有更多的列，并且额外的列位于表的末尾，则可以使用 [FILE_FORMAT](#file_format) 选项 `ERROR_ON_COLUMN_COUNT_MISMATCH` 加载数据。 这允许您加载数据而无需单独指定每个列。 请注意，ERROR_ON_COLUMN_COUNT_MISMATCH 当前适用于 CSV 文件格式。

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

### 示例 6：加载具有自定义格式的 JSON

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

### 示例 7：加载无效 JSON

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