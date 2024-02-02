---
title: "COPY INTO <table>"
sidebar_label: "COPY INTO <table>"
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.148"/>

COPY INTO 允许您从以下位置之一的文件中加载数据：

- 用户/内部/外部阶段：请参阅[了解阶段](/guides/load-data/stage/whystage)以学习 Databend 中的阶段。
- 在存储服务中创建的桶或容器。
- 可以通过其 URL（以 "https://..." 开头）访问文件的远程服务器。
- [IPFS](https://ipfs.tech)。

另请参阅：[`COPY INTO <location>`](dml-copy-into-location.md)

## 语法

```sql
COPY INTO [<database>.]<table_name>
     FROM { userStage | internalStage | externalStage | externalLocation }
[ FILES = ( '<file_name>' [ , '<file_name>' ] [ , ... ] ) ]
[ PATTERN = '<regex_pattern>' ]
[ FILE_FORMAT = (
         FORMAT_NAME = '<your-custom-format>'
         | TYPE = { CSV | TSV | NDJSON | PARQUET | XML } [ formatTypeOptions ]
       ) ]
[ copyOptions ]
```

### FROM ...

FROM 子句指定源位置（用户阶段、内部阶段、外部阶段或外部位置），将使用 COPY INTO 命令将数据加载到指定表中。

:::note
当您从阶段文件加载数据且阶段路径包含特殊字符（如空格或括号）时，您可以将整个路径用单引号括起来，如下 SQL 语句所示：

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
有关访问 Amazon S3-like 存储服务的连接参数，请参阅[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Azure Blob Storage" label="Azure Blob Storage">

```sql
externalLocation ::=
  'azblob://<container>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 Azure Blob Storage 的连接参数，请参阅[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Google Cloud Storage" label="Google Cloud Storage">

```sql
externalLocation ::=
  'gcs://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 Google Cloud Storage 的连接参数，请参阅[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Alibaba Cloud OSS" label="Alibaba Cloud OSS">

```sql
externalLocation ::=
  'oss://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 Alibaba Cloud OSS 的连接参数，请参阅[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Tencent Cloud Object Storage" label="Tencent Cloud Object Storage">

```sql
externalLocation ::=
  'cos://<bucket>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 Tencent Cloud Object Storage 的连接参数，请参阅[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="Hadoop Distributed File System (HDFS)" label="HDFS">

```sql
externalLocation ::=
  'hdfs://<endpoint_url>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 HDFS 的连接参数，请参阅[连接参数](/00-sql-reference/51-connect-parameters.md)。
</TabItem>

<TabItem value="WebHDFS" label="WebHDFS">

```sql
externalLocation ::=
  'webhdfs://<endpoint_url>[<path>]'
  CONNECTION = (
        <connection_parameters>
  )
```

有关访问 WebHDFS 的连接参数，请参阅[连接参数](/00-sql-reference/51-connect-parameters.md)。
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

FILES 指定一个或多个文件名（用逗号分隔）以加载。

### PATTERN

一个基于 [PCRE2](https://www.pcre.org/current/doc/html/) 的正则表达式模式字符串，用单引号括起来，指定要匹配的文件名。有关 PCRE2 语法，请参阅 http://www.pcre.org/current/doc/html/pcre2syntax.html。请参阅[示例 4：使用 PATTERN 筛选文件](#example-4-filtering-files-with-pattern)以获取有关使用 PATTERN 参数筛选文件的示例和有用提示。

### FILE_FORMAT

有关详细信息，请参阅[输入和输出文件格式](../../00-sql-reference/50-file-format-options.md)。

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

| 参数                  | 描述                                                                                                                                                                                                                                                                                                                                                                                                            | 必需      |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| SIZE_LIMIT            | 指定给定 COPY 语句要加载的数据的最大行数。默认为 `0`，意味着没有限制。                                                                                                                                                                                                                                                                                                               | 可选     |
| PURGE                 | 如果为 `True`，命令将在数据成功加载到表中后清除阶段中的文件。默认值：`False`。                                                                                                                                                                                                                                                                                                       | 可选     |
| FORCE                 | COPY INTO 通过自动跟踪并防止文件重复加载来确保幂等性，默认期限为7天。可以使用 `load_file_metadata_expire_hours` 设置来自定义文件元数据的过期时间。<br/>此参数默认为 `False`，意味着 COPY INTO 在复制数据时会跳过重复文件。如果为 `True`，则不会跳过重复文件。                                                                                                                       | 可选     |
| DISABLE_VARIANT_CHECK | 如果为 `True`，这将允许 variant 字段插入无效的 JSON 字符串。默认值：`False`。                                                                                                                                                                                                                                                                                                       | 可选     |
| ON_ERROR              | 决定如何处理包含错误的文件：'continue' 表示跳过并继续，'abort' 表示遇到错误时终止，'abort_N' 表示错误 ≥ N 时终止。默认值为 'abort'。注意：'abort_N' 对 Parquet 文件不可用。                                                                                                                                                                                                           | 可选     |
| MAX_FILES             | 设置尚未加载的文件的最大数量。该值可以设置到 15000；任何大于 15000 的值将被视为 15000。                                                                                                                                                                                                                                                                                               | 可选     |
| RETURN_FAILED_ONLY    | 当设置为 'True' 时，只有加载失败的文件才会在输出中返回。默认值：`False`。                                                                                                                                                                                                                                                                                                             | 可选     |

:::tip
当导入大量数据，如日志时，建议将 `PURGE` 和 `FORCE` 都设置为 True。这确保了高效的数据导入，无需与 Meta 服务器交互（更新已复制文件集）。然而，重要的是要意识到这可能会导致数据重复导入。
:::

## 输出

COPY INTO 提供了数据加载结果的摘要，包含以下列：

| 列名              | 类型    | 可空     | 描述                                           |
|------------------|---------|----------|------------------------------------------------|
| FILE             | VARCHAR | NO       | 源文件的相对路径。                             |
| ROWS_LOADED      | INT     | NO       | 从源文件加载的行数。                           |
| ERRORS_SEEN      | INT     | NO       | 源文件中的错误行数                             |
| FIRST_ERROR      | VARCHAR | YES      | 源文件中发现的第一个错误。                     |
| FIRST_ERROR_LINE | INT     | YES      | 第一个错误的行号。                             |

如果设置 RETURN_FAILED_ONLY 为 True，则输出只包含加载失败的文件。

## 分布式 COPY INTO

COPY INTO 支持在集群环境中的分布式执行。您可以通过将 ENABLE_DISTRIBUTED_COPY_INTO 设置为 1 来启用分布式 COPY INTO。这有助于在集群环境中提高数据加载性能和可伸缩性。

```sql
SET enable_distributed_copy_into = 1;
```

## 示例

### 示例 1：从 Stages 加载

这些示例展示了从各种类型的 stages 加载数据到 Databend 的情况：

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

这些示例展示了从各种类型的外部来源加载数据到 Databend 的情况：

<Tabs groupId="external-example">
<TabItem value="Amazon S3" label="Amazon S3">

此示例使用 AWS 访问密钥和密钥建立与 Amazon S3 的连接，并从 CSV 文件中加载 10 行数据：

```sql
-- 通过 AWS 访问密钥和密钥进行认证。
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

此示例使用 AWS IAM 角色认证和外部 ID 连接到 Amazon S3，并从 'mybucket' 加载符合指定模式的 CSV 文件：

```sql
-- 通过 AWS IAM 角色和外部 ID 进行认证。
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

此示例连接到 Azure Blob Storage 并从 'data.csv' 加载数据到 Databend：

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

此示例加载 Amazon S3 上的 GZIP 压缩 CSV 文件到 Databend：



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

### 示例 4：使用模式过滤文件 {/*examples*/}

此示例演示了如何使用 PATTERN 参数通过模式匹配从 Amazon S3 加载 CSV 文件。它过滤出名称中含有 'sales' 并且扩展名为 '.csv' 的文件：

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
其中 `.*` 被解释为任意字符的零次或多次出现。方括号用于转义文件扩展名前的句点字符 `.`。

要从所有 CSV 文件中加载：

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

- 如果您想匹配跟在前缀后的特定子路径，请在模式中包含前缀（例如，'multi_page/'），然后指定您想在该子路径中匹配的模式（例如，'_page_1'）。

```sql
-- 文件路径：parquet/multi_page/multi_page_1.parquet
COPY INTO ... FROM @data/parquet/ PATTERN = 'multi_page/.*_page_1.*') ...
```

- 如果您想匹配文件路径中包含所需模式的任何部分，请在模式前后使用 '.*'（例如，'.*multi_page_1.*'），以匹配路径中任何位置的 'multi_page_1'。

```sql
-- 文件路径：parquet/multi_page/multi_page_1.parquet
COPY INTO ... FROM @data/parquet/ PATTERN ='.*multi_page_1.*') ...
```

### 示例 5：向带有额外列的表中加载数据 {/*examples*/}

本节演示了如何使用示例文件 [books.csv](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv) 将数据加载到带有额外列的表中：

```text title='books.csv'
Transaction Processing,Jim Gray,1992
Readings in Database Systems,Michael Stonebraker,2004
```

![Alt text](@site/docs/public/img/load/load-extra.png)

默认情况下，COPY INTO 通过将文件中的字段顺序与表中相应列的顺序匹配来加载数据到表中。确保文件与表之间的数据正确对齐至关重要。例如，

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

如果您的表比文件中的列多，您可以指定您想要加载数据的列。例如，

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

如果您的表比文件中的列多，并且额外的列位于表的末尾，您可以使用 [FILE_FORMAT](#file_format) 选项 `ERROR_ON_COLUMN_COUNT_MISMATCH` 来加载数据。这允许您在不单独指定每个列的情况下加载数据。请注意，ERROR_ON_COLUMN_COUNT_MISMATCH 当前适用于 CSV 文件格式。

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
表中的额外列可以通过 [CREATE TABLE](../00-ddl/01-table/10-ddl-create-table.md) 或 [ALTER TABLE COLUMN](../00-ddl/01-table/90-alter-table-column.md) 指定默认值。如果没有为额外列显式设置默认值，则会应用与其数据类型关联的默认值。例如，如果没有指定其他值，则整数类型列的默认值将为 0。
:::

### 示例 6：使用自定义格式加载 JSON {/*examples*/}

此示例从包含以下内容的 CSV 文件 "data.csv" 中加载数据：

```json
1,"U00010","{\"carPriceList\":[{\"carTypeId":10,\"distance":5860},{\"carTypeId":11,\"distance\":5861}]}"
2,"U00011","{\"carPriceList\":[{\"carTypeId":12,\"distance":5862},{\"carTypeId":13,\"distance\":5863}]}"
```

每行包含三列数据，第三列是包含 JSON 数据的字符串。为了正确加载带有 JSON 字段的 CSV 数据，我们需要设置正确的转义字符。此示例使用反斜杠 \ 作为转义字符，因为 JSON 数据包含双引号 "。

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