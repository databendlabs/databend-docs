---
title: "COPY INTO <table>"
sidebar_label: "COPY INTO <table>"
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<FunctionDescription description="引入或更新于：v1.2.704"/>

COPY INTO 允许您从以下任一位置的文件中加载数据：

- 用户 / 内部 / 外部 Stage：了解 Databend 中的 Stage，请参阅 [什么是 Stage？](/guides/load-data/stage/what-is-stage)。
- 在存储服务中创建的 Bucket 或容器。
- 可通过 URL（以 "https://..." 开头）访问文件的远程服务器。
- [IPFS](https://ipfs.tech) 和 Hugging Face 仓库。

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
     FROM (
        SELECT {
            [<alias>.]<column> [, [<alias>.]<column> ...] -- 按名称查询列
            | [<alias>.]$<col_position> [, [<alias>.]$<col_position> ...] -- 按位置查询列
            | [<alias>.]$1[:<column>] [, [<alias>.]$1[:<column>]  ...] -- 将行作为 Variant 查询
            } ]
        FROM {@<stage_name>[/<path>] | '<uri>'} 
    )
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
  /* Amazon S3 类存储 */
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
对于远程文件，您可以使用 glob 模式指定多个文件。例如：
- `ontime_200{6,7,8}.csv` 表示 `ontime_2006.csv`、`ontime_2007.csv`、`ontime_2008.csv`
- `ontime_200[6-8].csv` 表示相同的文件
:::

## 关键参数

- **FILES**：指定要加载的一个或多个文件名（用逗号分隔）。

- **PATTERN**：基于 [PCRE2](https://www.pcre.org/current/doc/html/) 的正则表达式模式字符串，用于指定要匹配的文件名。请参阅[示例 4：使用模式过滤文件](#example-4-filtering-files-with-pattern)。

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
| ERROR_ON_COLUMN_COUNT_MISMATCH | 如果列数不匹配则报错 | TRUE |
| EMPTY_FIELD_AS | 如何处理空字段 | null |
| BINARY_FORMAT | 二进制数据的编码格式（HEX 或 BASE64） | HEX |

### TYPE = TSV

| 选项 | 描述 | 默认值 |
|--------|-------------|--------|
| RECORD_DELIMITER | 分隔记录的字符 | 换行符 |
| FIELD