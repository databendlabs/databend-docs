---
title: "COPY INTO <table>"
sidebar_label: "COPY INTO <table>"
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<FunctionDescription description="Introduced or updated: v1.2.704"/>

COPY INTO 允许您从以下任一位置的文件加载数据：

- 用户/内部/外部暂存区（Stage）：请参阅 [什么是暂存区（Stage）？](https://docs.databend.cn/guides/load-data/stage/what-is-stage) 了解 Databend 中的暂存区（Stage）。
- 存储服务中创建的存储桶或容器
- 可通过 URL（以 "https://..." 开头）访问文件的远程服务器
- [IPFS](https://ipfs.tech) 和 Hugging Face 存储库

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

/* 带转换的数据加载 */
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
  /* 类 Amazon S3 存储 */
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
  
  /* Azure Blob 存储 */
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
  /* 所有格式通用选项 */
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
对于远程文件，您可使用 glob 模式指定多个文件。例如：
- `ontime_200{6,7,8}.csv` 表示 `ontime_2006.csv`、`ontime_2007.csv` 和 `ontime_2008.csv`
- `ontime_200[6-8].csv` 表示相同文件集
:::

## 关键参数

- **FILES**：指定要加载的文件名列表（逗号分隔）

- **PATTERN**：基于 [PCRE2](https://www.pcre.org/current/doc/html/) 的正则表达式模式，用于筛选文件名。详见[示例 4：使用模式过滤文件](#example-4-filtering-files-with-pattern)

## 文件格式选项

`FILE_FORMAT` 参数支持不同文件类型，每种类型有特定格式选项。各文件格式可用选项如下：

### 所有格式通用选项

| 选项 | 描述 | 可选值 | 默认值 |
|------|------|--------|--------|
| COMPRESSION | 数据文件压缩算法 | AUTO, GZIP, BZ2, BROTLI, ZSTD, DEFLATE, RAW_DEFLATE, XZ, NONE | AUTO |

### TYPE = CSV

| 选项 | 描述 | 默认值 |
|------|------|--------|
| RECORD_DELIMITER | 记录分隔符 | 换行符 |
| FIELD_DELIMITER | 字段分隔符 | 逗号 (,) |
| SKIP_HEADER | 跳过的标题行数 | 0 |
| QUOTE | 字段引用符 | 双引号 (") |
| ESCAPE | 转义字符 | NONE |
| NAN_DISPLAY | NaN 值表示字符串 | NaN |
| NULL_DISPLAY | NULL 值表示字符串 | \N |
| ERROR_ON_COLUMN_COUNT_MISMATCH | 列数不匹配时报错 | TRUE |
| EMPTY_FIELD_AS | 空字段处理方式 | null |
| BINARY_FORMAT | 二进制数据编码格式 | HEX |

### TYPE = TSV

| 选项 | 描述 | 默认值 |
|------|------|--------|
| RECORD_DELIMITER | 记录分隔符 | 换行符 |
| FIELD_DELIMITER | 字段分隔符 | 制表符 (\t) |

### TYPE = NDJSON

| 选项 | 描述 | 默认值 |
|------|------|--------|
| NULL_FIELD_AS | null 字段处理方式 | NULL |
| MISSING_FIELD_AS | 缺失字段处理方式 | ERROR |
| ALLOW_DUPLICATE_KEYS | 是否允许重复键 | FALSE |

### TYPE = PARQUET

| 选项 | 描述 | 默认值 |
|------|------|--------|
| MISSING_FIELD_AS | 缺失字段处理方式 | ERROR |

### TYPE = ORC

| 选项 | 描述 | 默认值 |
|------|------|--------|
| MISSING_FIELD_AS | 缺失字段处理方式 | ERROR |

### TYPE = AVRO

| 选项 | 描述 | 默认值 |
|------|------|--------|
| MISSING_FIELD_AS | 缺失字段处理方式 | ERROR |

## 复制选项

| 参数 | 描述 | 默认值 |
|------|------|--------|
| SIZE_LIMIT | 最大加载行数 | `0`（无限制） |
| PURGE | 加载成功后清除源文件 | `false` |
| FORCE | 允许重新加载重复文件 | `false`（跳过重复文件） |
| DISABLE_VARIANT_CHECK | 无效 JSON 替换为 NULL | `false`（遇到无效 JSON 报错） |
| ON_ERROR | 错误处理方式：`continue`、`abort` 或 `abort_N` | `abort` |
| MAX_FILES | 最大加载文件数（上限 15,000） | - |
| RETURN_FAILED_ONLY | 仅返回加载失败的文件 | `false` |
| COLUMN_MATCH_MODE | Parquet 列名匹配模式 | `case-insensitive` |

:::tip
导入海量数据（如日志）时，建议将 `PURGE` 和 `FORCE` 同时设为 `true`。此配置可高效导入数据且无需与元服务器交互（更新已复制文件集），但需注意可能导致重复数据导入。
:::

## 输出

COPY INTO 返回数据加载结果摘要，包含以下列：

| 列 | 类型 | 是否可为空 | 描述 |
|----|------|------------|------|
| FILE | VARCHAR | NO | 源文件相对路径 |
| ROWS_LOADED | INT | NO | 从文件加载的行数 |
| ERRORS_SEEN | INT | NO | 文件中的错误行数 |
| FIRST_ERROR | VARCHAR | YES | 首个错误信息 |
| FIRST_ERROR_LINE | INT | YES | 首个错误所在行号 |

若 `RETURN_FAILED_ONLY` 设为 `true`，输出仅包含加载失败的文件。

## 示例

### 示例 1：从暂存区加载

以下示例展示从各类暂存区（Stage）加载数据到 Databend：

<Tabs>
  <TabItem value="user" label="用户暂存区" default>

```sql
COPY INTO mytable
    FROM @~
    PATTERN = '.*[.]parquet'
    FILE_FORMAT = (TYPE = PARQUET);
```

  </TabItem>
  <TabItem value="internal" label="内部暂存区">

```sql
COPY INTO mytable
    FROM @my_internal_stage
    PATTERN = '.*[.]parquet'
    FILE_FORMAT = (TYPE = PARQUET);
```

  </TabItem>
  <TabItem value="external" label="外部暂存区">

```sql
COPY INTO mytable
    FROM @my_external_stage
    PATTERN = '.*[.]parquet'
    FILE_FORMAT = (TYPE = PARQUET);
```

  </TabItem>
</Tabs>

### 示例 2：从外部位置加载

以下示例展示从各类外部源加载数据到 Databend：

<Tabs groupId="external-example">
<TabItem value="Amazon S3" label="Amazon S3">

此示例使用 AWS 访问密钥和秘密访问密钥连接 Amazon S3，从 CSV 文件加载 10 行数据：

```sql
-- 通过 AWS 访问密钥和秘密访问密钥认证
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

此示例通过 AWS IAM 角色和外部 ID 认证连接 Amazon S3，加载 'mybucket' 中匹配指定模式的 CSV 文件：

```sql
-- 通过 AWS IAM 角色和外部 ID 认证
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

<TabItem value="Azure Blob Storage" label="Azure Blob 存储">

此示例连接 Azure Blob 存储，将 'data.csv' 数据加载到 Databend：

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

此示例从三个远程 CSV 文件加载数据，出错时跳过文件：

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

此示例将 Amazon S3 上的 GZIP 压缩 CSV 文件加载到 Databend：

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

此示例演示如何使用 PATTERN 参数通过模式匹配从 Amazon S3 加载 CSV 文件，筛选文件名含 'sales' 且扩展名为 '.csv' 的文件：

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

其中 `.*` 表示任意字符的零次或多次出现，方括号转义文件扩展名前的点号 `.`。

加载所有 CSV 文件：

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

指定含多级目录的文件路径时，需考虑匹配策略：

- 若需匹配前缀后的特定子路径，在模式中包含前缀（如 'multi_page/'）后指定子路径模式（如 '\_page_1'）

```sql
-- 文件路径：parquet/multi_page/multi_page_1.parquet
COPY INTO ... FROM @data/parquet/ PATTERN = 'multi_page/.*_page_1.*') ...
```

- 若需匹配路径中任意位置的模式，在模式前后添加 `.*`（如 `.*multi_page_1.*`）

```sql
-- 文件路径：parquet/multi_page/multi_page_1.parquet
COPY INTO ... FROM @data/parquet/ PATTERN ='.*multi_page_1.*') ...
```

### 示例 5：加载到含额外列的表

此示例使用示例文件 [books.csv](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv) 演示如何将数据加载到含额外列的表中：

```text title='books.csv'
Transaction Processing,Jim Gray,1992
Readings in Database Systems,Michael Stonebraker,2004
```

![Alt text](/img/load/load-extra.png)

默认情况下，COPY INTO 按文件字段顺序匹配表列加载数据。需确保文件数据与表结构对齐，例如：

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

若表的列数多于文件，可指定目标加载列：

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

若表的末尾存在额外列，可使用 [FILE_FORMAT](#file_format) 选项 `ERROR_ON_COLUMN_COUNT_MISMATCH` 加载数据（当前仅支持 CSV 格式）：

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
表内额外列可通过 [CREATE TABLE](../00-ddl/01-table/10-ddl-create-table.md) 或 [ALTER TABLE COLUMN](../00-ddl/01-table/90-alter-table-column.md) 设置默认值。未显式设置时，将应用数据类型默认值（如整型列默认为 0）。
:::

### 示例 6：使用自定义格式加载 JSON

此示例从内容如下的 CSV 文件 "data.csv" 加载数据：

```json
1,"U00010","{\"carPriceList\":[{\"carTypeId":10,\"distance":5860},{\"carTypeId":11,\"distance\":5861}]}"
2,"U00011","{\"carPriceList\":[{\"carTypeId":12,\"distance":5862},{\"carTypeId":13,\"distance\":5863}]}"
```

每行含三列数据，第三列为包含 JSON 的字符串。因 JSON 含双引号，需设置反斜杠 `\` 为转义字符以正确加载：

#### 步骤 1：创建自定义文件格式

```sql
-- 创建转义符为反斜杠 \ 的自定义 CSV 格式
CREATE FILE FORMAT my_csv_format
    TYPE = CSV
    ESCAPE = '\\';
```

#### 步骤 2：创建目标表

```sql
CREATE TABLE t
  (
     id       INT,
     seq      VARCHAR,
     p_detail VARCHAR
  );
```

#### 步骤 3：使用自定义格式加载

```sql
COPY INTO t FROM @t_stage FILES=('data.csv')
FILE_FORMAT=(FORMAT_NAME='my_csv_format');
```

### 示例 7：加载无效 JSON

向 Variant 列加载数据时，Databend 会自动校验 JSON 有效性并在无效时报错。例如用户暂存区中 `invalid_json_string.parquet` 文件含无效 JSON 数据时：

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

加载数据时将报错：

```sql
root@localhost:8000/default>  COPY INTO t2 FROM @~/invalid_json_string.parquet FILE_FORMAT = (TYPE = PARQUET) ON_ERROR = CONTINUE;
error: APIError: ResponseError with 1006: EOF while parsing a value, pos 3 while evaluating function `parse_json('[1,')`
```

通过设置 `DISABLE_VARIANT_CHECK = true` 可跳过 JSON 有效性检查：

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
-- 无效 JSON 在 Variant 列中存储为 NULL
┌──────────────────────────────────────┐
│         a        │         b         │
├──────────────────┼───────────────────┤
│ 5                │ {"k":"v"}         │
│ 6                │ null              │
└──────────────────────────────────────┘
```