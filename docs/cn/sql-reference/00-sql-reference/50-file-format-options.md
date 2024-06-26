---
title: 输入与输出文件格式
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本: v1.2.530"/>

Databend 支持多种文件格式作为数据加载或卸载的源和目标。本页介绍支持的文件格式及其可用选项。

## 语法

在语句中指定文件格式，使用以下语法：

```sql
-- 指定标准文件格式
... FILE_FORMAT = ( TYPE = { CSV | TSV | NDJSON | PARQUET | ORC } [ formatTypeOptions ] )

-- 指定自定义文件格式
... FILE_FORMAT = ( FORMAT_NAME = '<your-custom-format>' )
```

- Databend 目前仅支持 ORC 作为源。将数据卸载到 ORC 文件尚不支持。
- 如果在执行 COPY INTO 或 SELECT 操作时未指定 FILE_FORMAT，Databend 将使用创建 Stage 时为 Stage 定义的文件格式。如果在创建 Stage 时未明确指定文件格式，Databend 默认使用 PARQUET 格式。如果指定的 FILE_FORMAT 与创建 Stage 时定义的不同，Databend 将优先使用操作中指定的 FILE_FORMAT。
- 有关在 Databend 中管理自定义文件格式的信息，请参阅 [文件格式](../10-sql-commands/00-ddl/13-file-format/index.md)。

### formatTypeOptions

`formatTypeOptions` 包含一个或多个描述文件其他格式细节的选项。选项因文件格式而异。请参阅以下各节，了解每种支持的文件格式的可用选项。

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

Databend 接受符合 [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180) 的 CVS 文件，并受以下条件约束：

- 如果字符串包含 [QUOTE](#quote)、[ESCAPE](#escape)、[RECORD_DELIMITER](#record_delimiter) 或 [FIELD_DELIMITER](#field_delimiter) 字符，则必须用引号括起来。
- 引号字符串中除 [QUOTE](#quote) 外不会转义任何字符。
- [FIELD_DELIMITER](#field_delimiter) 和 [QUOTE](#quote) 之间不应留有空格。
- 如果字符串来自序列化的数组或结构体字段，则会在 CSV 中用引号括起来。
- 如果开发程序并从中生成 CSV 文件，Databend 建议使用编程语言的 CSV 库。

### RECORD_DELIMITER

在输入文件中分隔记录。

**可用值**:

- `\r\n`
- 一个字节，非字母数字字符，如 `#` 和 `|`。
- 带转义字符的字符：`\b`、`\f`、`\r`、`\n`、`\t`、`\0`、`\xHH`

**默认值**: `\n`

### FIELD_DELIMITER

在记录中分隔字段。

**可用值**:

- 一个字节，非字母数字字符，如 `#` 和 `|`。
- 带转义字符的字符：`\b`、`\f`、`\r`、`\n`、`\t`、`\0`、`\xHH`

**默认值**: `,` (逗号)

### QUOTE

在 CSV 文件中引用字符串。对于数据加载，除非字符串包含 [QUOTE](#quote)、[ESCAPE](#escape)、[RECORD_DELIMITER](#record_delimiter) 或 [FIELD_DELIMITER](#field_delimiter) 字符，否则不需要引用。

:::note
**仅用于数据加载**: 此选项在从 Databend 卸载数据时不适用。
:::

**可用值**: `'`、`"` 或 `(反引号)

**默认值**: `"`

### ESCAPE

在引用的字符串中转义引号。

**可用值**: `'\\'` 或 `''`

**默认值**: `''`

### SKIP_HEADER

指定从文件开头跳过的行数。

:::note
**仅用于数据加载**: 此选项在从 Databend 卸载数据时不适用。
:::

**默认值**: `0`

### NAN_DISPLAY

指定查询结果中如何显示 "NaN"（非数字）值。

**可用值**: 必须是文字 `'nan'` 或 `'null'`（不区分大小写）

**默认值**: `'NaN'`

### NULL_DISPLAY

指定查询结果中如何显示 NULL 值。

**默认值**: `'\N'`

### ERROR_ON_COLUMN_COUNT_MISMATCH

ERROR_ON_COLUMN_COUNT_MISMATCH 是一个布尔选项，当设置为 true 时，指定如果数据文件中的列数与目标表中的列数不匹配，则应引发错误。设置为 true 有助于确保加载过程中的数据完整性和一致性。

**默认值**: `true`

### EMPTY_FIELD_AS

指定在遇到空字段（包括 `,,` 和 `,"",`）时，应使用什么值将 CSV 数据加载到表中。

**可用值**:

| 值              | 描述                                            |
| --------------- | ----------------------------------------------- |
| `null` (默认)   | 将空字段解释为 NULL 值。仅适用于可空列。        |
| `string`        | 将空字段解释为空字符串 (''). 仅适用于字符串列。 |
| `field_default` | 使用列的默认值填充空字段。                      |

### OUTPUT_HEADER

指定在使用 `COPY INTO <location>` 命令导出数据时是否包含标题行。默认为 `false`。

### BINARY_FORMAT

控制数据导出和导入操作期间的二进制编码格式，可用值为 `HEX`（默认）和 `BASE64`。

### COMPRESSION

指定压缩算法。

**可用值**:

| 值            | 描述                                      |
| ------------- | ----------------------------------------- |
| `NONE` (默认) | 表示文件未压缩。                          |
| `AUTO`        | 通过文件扩展名自动检测压缩                |
| `GZIP`        |                                           |
| `BZ2`         |                                           |
| `BROTLI`      | 如果加载/卸载 Brotli 压缩文件，必须指定。 |
| `ZSTD`        | 支持 Zstandard v0.8（及更高版本）。       |
| `DEFLATE`     | 压缩文件（带 zlib 头，RFC1950）。         |
| `RAW_DEFLATE` | 压缩文件（无任何头，RFC1951）。           |
| `XZ`          |                                           |

## TSV 选项

处理 TSV 文件时，Databend 受以下条件约束：

- TSV 文件中的这些字符将被转义：`\b`、`\f`、`\r`、`\n`、`\t`、`\0`、`\\`、`\'`、[RECORD_DELIMITER](#record_delimiter-1)、[FIELD_DELIMITER](#field_delimiter-1)。
- 目前不支持引用或包围。
- 如果字符串来自序列化的数组或结构体字段，则会在 CSV 中用引号括起来。
- Null 序列化为 `\N`。

:::note
1. 在 Databend 中，TSV 和 CSV 的主要区别不是使用制表符而不是逗号作为字段分隔符（这可以通过选项更改），而是使用转义而不是引用处理 [分隔符冲突](https://en.wikipedia.org/wiki/Delimiter#Delimiter_collision)
2. 我们建议使用 CSV 而不是 TSV 作为存储格式，因为它有正式标准。
3. TSV 可用于加载由以下生成的文件：
   1. Clickhouse TSV 文件格式。
   2. MySQL `mysqldump` 命令，选项 `--tab` 不带 `--fields-enclosed-by` 或 `--fields-optinally-enclosed-by`，如果后两者指定，请使用 CSV。
   3. Snowflake CSV 不带 `ESCAPE_UNENCLOSED_FIELD`。如果指定 `ESCAPE_UNENCLOSED_FIELD`，请使用 CSV。
:::

### RECORD_DELIMITER

在输入文件中分隔记录。

**可用值**:

- `\r\n`
- 任意字符，如 `#` 和 `|`。
- 带转义字符的字符：`\b`、`\f`、`\r`、`\n`、`\t`、`\0`、`\xHH`

**默认值**: `\n`

### FIELD_DELIMITER

在记录中分隔字段。

**可用值**:

- 非字母数字字符，如 `#` 和 `|`。
- 带转义字符的字符：`\b`、`\f`、`\r`、`\n`、`\t`、`\0`、`\xHH`

**默认值**: `\t` (制表符)

### COMPRESSION

与 [CSV 的 COMPRESSION 选项](#compression) 相同。

## NDJSON 选项

### NULL_FIELD_AS

指定在数据加载期间如何处理空值。请参阅下表中的可用配置选项。

| 可用值          | 描述                                                      |
| --------------- | --------------------------------------------------------- |
| `NULL` (默认)   | 将空值解释为可空字段的 NULL。对于不可空字段，将生成错误。 |
| `FIELD_DEFAULT` | 使用字段的默认值填充空值。                                |

### MISSING_FIELD_AS

确定在数据加载期间遇到缺失字段时的行为。请参阅下表中的可用配置选项。

| 可用值          | 描述                                                   |
| --------------- | ------------------------------------------------------ |
| `ERROR` (默认)  | 如果遇到缺失字段，则生成错误。                         |
| `NULL`          | 将缺失字段解释为 NULL 值。对于不可空字段，将生成错误。 |
| `FIELD_DEFAULT` | 使用字段的默认值填充缺失字段。                         |
| `TYPE_DEFAULT`  | 使用字段数据类型的默认值填充缺失字段。                 |

### COMPRESSION

与 [CSV 的 COMPRESSION 选项](#compression) 相同。

## PARQUET 选项

### MISSING_FIELD_AS

确定在数据加载期间遇到缺失字段时的行为。请参阅下表中的可用配置选项。

| 可用值          | 描述                           |
| --------------- | ------------------------------ |
| `ERROR` (默认)  | 如果遇到缺失字段，则生成错误。 |
| `FIELD_DEFAULT` | 使用字段的默认值填充缺失字段。 |

## ORC 选项

ORC 格式尚无可用选项。
