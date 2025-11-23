---
title: 文件格式选项
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.713"/>

Databend 支持多种文件格式用于数据导入与导出。本页介绍支持的文件格式及其相关选项。

## 语法

在语句中指定文件格式的语法如下：

```sql
-- 指定标准文件格式
... FILE_FORMAT = ( TYPE = { CSV | TSV | NDJSON | PARQUET | ORC | AVRO } [ formatTypeOptions ] )

-- 指定自定义文件格式
... FILE_FORMAT = ( FORMAT_NAME = '<your-custom-format>' )
```

- Databend 目前仅支持 ORC 和 AVRO 作为数据源。尚不支持将数据导出到 ORC 或 AVRO 文件中。
- 如果在执行 COPY INTO 或 SELECT 操作时未指定 FILE_FORMAT，Databend 将使用您在最初创建 Stage 时为该 Stage 定义的文件格式。如果您在创建 Stage 期间未显式指定文件格式，Databend 默认使用 PARQUET 格式。如果您指定的 FILE_FORMAT 与创建 Stage 时定义的 FILE_FORMAT 不同，Databend 将优先使用操作期间指定的 FILE_FORMAT。
- 有关在 Databend 中管理自定义文件格式的信息，请参阅 [文件格式](../10-sql-commands/00-ddl/13-file-format/index.md)。

### formatTypeOptions

`formatTypeOptions` 包括一个或多个选项，用于描述文件的其他格式详细信息。这些选项因文件格式而异。请参阅下面的部分，了解每种支持的文件格式的可用选项。

```sql
formatTypeOptions ::=
  RECORD_DELIMITER = '<character>'
  FIELD_DELIMITER = '<character>'
  SKIP_HEADER = <integer>
  QUOTE = '<character>'
  ESCAPE = '<character>'
  NAN_DISPLAY = '<string>'
  ROW_TAG = '<string>'
  COMPRESSION = AUTO | GZIP | BZ2 | BROTLI | ZSTD | DEFLATE | RAW_DEFLATE | XZ | NONE
```

## CSV 选项

Databend 支持符合 [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180) 标准的 CSV 文件，并遵循以下规则：

- 如果字符串包含 [QUOTE](#quote)、[ESCAPE](#escape)、[RECORD_DELIMITER](#record_delimiter) 或 [FIELD_DELIMITER](#field_delimiter) 的字符，则必须引用该字符串。
- 除了 [QUOTE](#quote) 之外，在带引号的字符串中不会转义任何字符。
- [FIELD_DELIMITER](#field_delimiter) 和 [QUOTE](#quote) 之间不应留有空格。
- 如果字符串来自序列化的 Array 或 Struct 字段，则将在 CSV 中引用该字符串。
- 如果您开发了一个程序并从中生成 CSV 文件，Databend 建议使用该编程语言中的 CSV 库。

### RECORD_DELIMITER

分隔输入文件中的记录。

**可用值**:

- `\r\n`
- 一个字节的非字母数字字符，例如 `#` 和 `|`。
- 带有转义字符的字符：`\b`、`\f`、`\r`、`\n`、`\t`、`\0`、`\xHH`

**默认值**: `\n`

### FIELD_DELIMITER

分隔记录中的字段。

**可用值**:

- 一个字节的非字母数字字符，例如 `#` 和 `|`。
- 带有转义字符的字符：`\b`、`\f`、`\r`、`\n`、`\t`、`\0`、`\xHH`

**默认值**: `,` (逗号)

### QUOTE (仅导入)

引用 CSV 文件中的字符串。对于数据导入，除非字符串包含 [QUOTE](#quote)、[ESCAPE](#escape)、[RECORD_DELIMITER](#record_delimiter) 或 [FIELD_DELIMITER](#field_delimiter) 的字符，否则不需要引号。

**可用值**: `'`、`"` 或 `(反引号)

**默认值**: `"`

### ESCAPE

转义带引号的字符串中的引号。

**可用值**: `'\\'` 或 `''`

**默认值**: `''`

### SKIP_HEADER (仅导入)

指定从文件开头跳过的行数。

**默认值**: `0`

### NAN_DISPLAY (仅导入)

指定如何在查询结果中显示 "NaN"（非数字）值。

**可用值**: 必须是文字 `'nan'` 或 `'null'`（不区分大小写）

**默认值**: `'NaN'`

### NULL_DISPLAY (仅导入)

指定如何在查询结果中显示 NULL 值。

**默认值**: `'\N'`

### ERROR_ON_COLUMN_COUNT_MISMATCH (仅导入)

ERROR_ON_COLUMN_COUNT_MISMATCH 是一个布尔选项，当设置为 true 时，指定如果数据文件中的列数与目标表中的列数不匹配，则应引发错误。将其设置为 true 有助于确保加载过程中的数据完整性和一致性。

**默认值**: `true`

### EMPTY_FIELD_AS (仅导入)

指定在 CSV 数据导入到表中时，遇到空字段（包括 `,,` 和 `,"",`）时应使用的值。

| 可用值           | 描述                                                                              |
|------------------|-----------------------------------------------------------------------------------|
| `null` (默认)    | 将空字段解释为 NULL 值。仅适用于可为空的列。                                          |
| `string`         | 将空字段解释为空字符串 ('')。仅适用于 String 列。                                 |
| `field_default`  | 对空字段使用列的默认值。                                                          |

### OUTPUT_HEADER (仅导出)

指定在使用 `COPY INTO <location>` 命令导出数据时，是否在 CSV 文件中包含标题行。默认为 `false`。

### BINARY_FORMAT

控制数据导出和导入操作期间的二进制编码格式，可用值为 `HEX`（默认）和 `BASE64`。

### COMPRESSION

指定压缩算法。

| 可用值           | 描述                                                                  |
|------------------|-----------------------------------------------------------------------|
| `NONE` (默认)    | 表示文件未压缩。                                                      |
| `AUTO`           | 通过文件扩展名自动检测压缩                                              |
| `GZIP`           |                                                                       |
| `BZ2`            |                                                                       |
| `BROTLI`         | 如果导入/导出 Brotli 压缩文件，则必须指定。                            |
| `ZSTD`           | 支持 Zstandard v0.8（及更高版本）。                                      |
| `DEFLATE`        | Deflate 压缩文件（带有 zlib 标头，RFC1950）。                           |
| `RAW_DEFLATE`    | Deflate 压缩文件（没有任何标头，RFC1951）。                            |
| `XZ`             |                                                                       |

## TSV 选项

Databend 处理 TSV 文件时遵循以下规则：

- TSV 文件中的这些字符将被转义：`\b`、`\f`、`\r`、`\n`、`\t`、`\0`、`\\`、`\'`、[RECORD_DELIMITER](#record_delimiter-1)、[FIELD_DELIMITER](#field_delimiter-1)。
- 目前不支持引用或封闭。
- 如果字符串来自序列化的 Array 或 Struct 字段，则将在 CSV 中引用该字符串。
- Null 被序列化为 `\N`。

:::note
1. 在 Databend 中，TSV 和 CSV 之间的主要区别是不使用制表符代替逗号作为字段分隔符（可以通过选项更改），而是使用转义而不是引用来解决[分隔符冲突](https://en.wikipedia.org/wiki/Delimiter#Delimiter_collision)
2. 我们建议使用 CSV 作为存储格式，因为它具有正式标准。
3. TSV 可用于加载以下文件生成的文件
   1. Clickhouse TSV 文件格式。
   2. MySQL `mysqldump` 命令，带有选项 `--tab`，但不带 `--fields-enclosed-by` 或 `--fields-optinally-enclosed-by`，如果指定了后两个选项，请改用 CSV。
   3. Snowflake CSV，不带 `ESCAPE_UNENCLOSED_FIELD`。如果指定了 `ESCAPE_UNENCLOSED_FIELD`，请改用 CSV。
:::

### RECORD_DELIMITER

分隔输入文件中的记录。

**可用值**:

- `\r\n`
- 任意字符，例如 `#` 和 `|`。
- 带有转义字符的字符：`\b`、`\f`、`\r`、`\n`、`\t`、`\0`、`\xHH`

**默认值**: `\n`

### FIELD_DELIMITER

分隔记录中的字段。

**可用值**:

- 非字母数字字符，例如 `#` 和 `|`。
- 带有转义字符的字符：`\b`、`\f`、`\r`、`\n`、`\t`、`\0`、`\xHH`

**默认值**: `\t` (TAB)

### COMPRESSION

与 [CSV 的 COMPRESSION 选项](#compression) 相同。

## NDJSON 选项

### NULL_FIELD_AS (仅导入)

指定在数据导入期间如何处理 null 值。有关可能的配置，请参阅下表中的选项。

| 可用值                | 描述                                                                                              |
|-----------------------|---------------------------------------------------------------------------------------------------|
| `NULL` (默认)         | 将 null 值解释为可为空字段的 NULL。将为不可为空字段生成错误。                                        |
| `FIELD_DEFAULT`       | 对 null 值使用字段的默认值。                                                                     |

### MISSING_FIELD_AS (仅导入)

确定在数据导入期间遇到缺失字段时的行为。有关可能的配置，请参阅下表中的选项。

| 可用值          | 描述                                                                                      |
|-----------------|-------------------------------------------------------------------------------------------|
| `ERROR` (默认)   | 如果遇到缺失字段，则生成错误。                                                              |
| `NULL`          | 将缺失字段解释为 NULL 值。将为不可为空字段生成错误。                                              |
| `FIELD_DEFAULT` | 对缺失字段使用字段的默认值。                                                                |

### COMPRESSION

与 [CSV 的 COMPRESSION 选项](#compression) 相同。

## PARQUET 选项

### MISSING_FIELD_AS (仅导入)

确定在数据导入期间遇到缺失字段时的行为。有关可能的配置，请参阅下表中的选项。

| 可用值          | 描述                                                                                      |
|-----------------|-------------------------------------------------------------------------------------------|
| `ERROR` (默认)  | 如果遇到缺失字段，则生成错误。                                                              |
| `FIELD_DEFAULT` | 对缺失字段使用字段的默认值。                                                                |

### COMPRESSION ### OUTPUT_HEADER (仅导出)

指定压缩算法，该算法用于压缩文件的内部块，而不是整个文件，因此输出仍为 Parquet 格式。

| 可用值           | 描述                                                                  |
|------------------|-----------------------------------------------------------------------|
| `ZSTD` (默认)    | 支持 Zstandard v0.8（及更高版本）。                                      |
| `SNAPPY`         | Snappy 是一种流行的快速压缩算法，通常与 Parquet 一起使用。                |

## ORC 选项

### MISSING_FIELD_AS (仅导入)

确定在数据导入期间遇到缺失字段时的行为。有关可能的配置，请参阅下表中的选项。

| 可选值          | 描述                                                                                              |
|------------------|----------------------------------------------------------------------------------------------------|
| `ERROR` (默认)   | 如果遇到缺失字段，则会生成错误。                                                                         |
| `FIELD_DEFAULT`  | 对于缺失的字段，使用该字段的默认值。                                                                       |

## AVRO 选项

### MISSING_FIELD_AS (仅导入)

确定在数据导入期间遇到缺失字段时的行为。请参考下表中的选项以获取可能的配置。

| 可选值          | 描述                                                                                              |
|------------------|----------------------------------------------------------------------------------------------------|
| `ERROR` (默认)   | 如果遇到缺失字段，则会生成错误。                                                                         |
| `FIELD_DEFAULT`  | 对于缺失的字段，使用该字段的默认值。                                                                       |