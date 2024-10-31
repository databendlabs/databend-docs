---
title: 输入与输出文件格式
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.530"/>

Databend 接受多种文件格式作为数据加载或卸载的源和目标。本页解释了支持的文件格式及其可用选项。

## 语法

在语句中指定文件格式时，使用以下语法：

```sql
-- 指定标准文件格式
... FILE_FORMAT = ( TYPE = { CSV | TSV | NDJSON | PARQUET | ORC } [ formatTypeOptions ] )

-- 指定自定义文件格式
... FILE_FORMAT = ( FORMAT_NAME = '<your-custom-format>' )
```

- Databend 目前仅支持 ORC 作为源。不支持将数据卸载到 ORC 文件。
- 如果在执行 COPY INTO 或 SELECT 操作时未指定 FILE_FORMAT，Databend 将使用您在创建阶段时最初为该阶段定义的文件格式。如果在创建阶段时未明确指定文件格式，Databend 默认使用 PARQUET 格式。如果在操作中指定了与创建阶段时定义的不同的 FILE_FORMAT，Databend 将优先使用操作中指定的 FILE_FORMAT。
- 有关在 Databend 中管理自定义文件格式，请参阅 [File Format](../10-sql-commands/00-ddl/13-file-format/index.md)。

### formatTypeOptions

`formatTypeOptions` 包括一个或多个选项，用于描述文件的其他格式细节。选项因文件格式而异。请参阅下面的部分，了解每种支持的文件格式的可用选项。

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

Databend 接受符合 [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180) 的 CVS 文件，并受以下条件限制：

- 如果字符串包含 [QUOTE](#quote)、[ESCAPE](#escape)、[RECORD_DELIMITER](#record_delimiter) 或 [FIELD_DELIMITER](#field_delimiter) 的字符，则必须引用该字符串。
- 在引用字符串中，除了 [QUOTE](#quote) 之外，不会转义任何字符。
- [FIELD_DELIMITER](#field_delimiter) 和 [QUOTE](#quote) 之间不应有空格。
- 如果字符串来自序列化的 Array 或 Struct 字段，则会在 CSV 中引用该字符串。
- 如果您开发一个程序并从中生成 CSV 文件，Databend 建议使用编程语言中的 CSV 库。

### RECORD_DELIMITER

分隔输入文件中的记录。

**可用值**:

- `\r\n`
- 一个单字节、非字母数字字符，如 `#` 和 `|`。
- 带有转义字符的字符：`\b`, `\f`, `\r`, `\n`, `\t`, `\0`, `\xHH`

**默认**: `\n`

### FIELD_DELIMITER

分隔记录中的字段。

**可用值**:

- 一个单字节、非字母数字字符，如 `#` 和 `|`。
- 带有转义字符的字符：`\b`, `\f`, `\r`, `\n`, `\t`, `\0`, `\xHH`

**默认**: `,` (逗号)

### QUOTE

在 CSV 文件中引用字符串。对于数据加载，除非字符串包含 [QUOTE](#quote)、[ESCAPE](#escape)、[RECORD_DELIMITER](#record_delimiter) 或 [FIELD_DELIMITER](#field_delimiter) 的字符，否则不需要引用。

:::note
**仅用于数据加载**: 当您从 Databend 卸载数据时，此选项不可用。
:::

**可用值**: `'`, `"`, 或 `(反引号)

**默认**: `"`

### ESCAPE

在引用字符串中转义引号。

**可用值**: `'\\'` 或 `''`

**默认**: `''`

### SKIP_HEADER

指定从文件开头跳过的行数。

:::note
**仅用于数据加载**: 当您从 Databend 卸载数据时，此选项不可用。
:::

**默认**: `0`

### NAN_DISPLAY

指定在查询结果中如何显示“NaN”（非数字）值。

**可用值**: 必须是字面量 `'nan'` 或 `'null'`（不区分大小写）

**默认**: `'NaN'`

### NULL_DISPLAY

指定在查询结果中如何显示 NULL 值。

**默认**: `'\N'`

### ERROR_ON_COLUMN_COUNT_MISMATCH

ERROR_ON_COLUMN_COUNT_MISMATCH 是一个布尔选项，当设置为 true 时，指定如果数据文件中的列数与目标表中的列数不匹配，则应引发错误。设置为 true 有助于在加载过程中确保数据完整性和一致性。

**默认**: `true`

### EMPTY_FIELD_AS

指定在遇到空字段（包括 `,,` 和 `,"",`）时，应使用的值，这些空字段正在加载到表中。

**可用值**:

| 值               | 描述                                                                       |
|------------------|---------------------------------------------------------------------------|
| `null` (默认)    | 将空字段解释为 NULL 值。仅适用于可为空的列。                              |
| `string`         | 将空字段解释为空字符串（''）。仅适用于 String 列。                        |
| `field_default`  | 使用列的默认值作为空字段。                                                 |

### OUTPUT_HEADER

指定在使用 `COPY INTO <location>` 命令导出数据时，是否在 CSV 文件中包含标题行。默认为 `false`。

### BINARY_FORMAT

控制数据导出和导入操作期间的二进制编码格式，可用值为 `HEX`（默认）和 `BASE64`。

### COMPRESSION

指定压缩算法。

**可用值**:

| 值               | 描述                                                                       |
|------------------|---------------------------------------------------------------------------|
| `NONE` (默认)    | 表示文件未压缩。                                                           |
| `AUTO`           | 通过文件扩展名自动检测压缩。                                               |
| `GZIP`           |                                                                           |
| `BZ2`            |                                                                           |
| `BROTLI`         | 如果加载/卸载 Brotli 压缩文件，则必须指定。                                |
| `ZSTD`           | 支持 Zstandard v0.8（及更高版本）。                                        |
| `DEFLATE`        | 使用 zlib 头部的 Deflate 压缩文件（RFC1950）。                             |
| `RAW_DEFLATE`    | 不带任何头部的 Deflate 压缩文件（RFC1951）。                               |
| `XZ`             |                                                                           |

## TSV 选项

Databend 在处理 TSV 文件时受以下条件限制：

- TSV 文件中的这些字符将被转义：`\b`, `\f`, `\r`, `\n`, `\t`, `\0`, `\\`, `\'`, [RECORD_DELIMITER](#record_delimiter-1), [FIELD_DELIMITER](#field_delimiter-1)。
- 目前不支持引用或封闭。
- 如果字符串来自序列化的 Array 或 Struct 字段，则会在 CSV 中引用该字符串。
- Null 序列化为 `\N`。

:::note
1. 在 Databend 中，TSV 和 CSV 的主要区别不是使用制表符而不是逗号作为字段分隔符（可以通过选项更改），而是使用转义而不是引用来处理 [分隔符冲突](https://en.wikipedia.org/wiki/Delimiter#Delimiter_collision)。
2. 我们建议使用 CSV 作为存储格式，因为它有正式的标准。
3. TSV 可用于加载由以下方式生成的文件：
   1. Clickhouse TSV 文件格式。
   2. MySQL `mysqldump` 命令，带有选项 `--tab`，但不带 `--fields-enclosed-by` 或 `--fields-optinally-enclosed-by`，如果指定了后两者，请使用 CSV。
   3. Snowflake CSV，不带 `ESCAPE_UNENCLOSED_FIELD`。如果指定了 `ESCAPE_UNENCLOSED_FIELD`，请使用 CSV。
:::

### RECORD_DELIMITER

分隔输入文件中的记录。

**可用值**:

- `\r\n`
- 任意字符，如 `#` 和 `|`。
- 带有转义字符的字符：`\b`, `\f`, `\r`, `\n`, `\t`, `\0`, `\xHH`

**默认**: `\n`

### FIELD_DELIMITER

分隔记录中的字段。

**可用值**:

- 非字母数字字符，如 `#` 和 `|`。
- 带有转义字符的字符：`\b`, `\f`, `\r`, `\n`, `\t`, `\0`, `\xHH`

**默认**: `\t` (制表符)

### COMPRESSION

与 [CSV 的 COMPRESSION 选项](#compression) 相同。

## NDJSON 选项

### NULL_FIELD_AS

指定在数据加载期间如何处理 null 值。请参阅下表中的选项以了解可能的配置。

| 可用值               | 描述                                                                                             |
|----------------------|-------------------------------------------------------------------------------------------------|
| `NULL` (默认)        | 将 null 值解释为可为空字段的 NULL。对于不可为空的字段，将生成错误。                             |
| `FIELD_DEFAULT`      | 使用字段的默认值作为 null 值。                                                                  |

### MISSING_FIELD_AS

确定在数据加载期间遇到缺失字段时的行为。请参阅下表中的选项以了解可能的配置。

| 可用值               | 描述                                                                                             |
|----------------------|-------------------------------------------------------------------------------------------------|
| `ERROR` (默认)       | 如果遇到缺失字段，则生成错误。                                                                  |
| `NULL`               | 将缺失字段解释为 NULL 值。对于不可为空的字段，将生成错误。                                      |
| `FIELD_DEFAULT`      | 使用字段的默认值作为缺失字段。                                                                  |
| `TYPE_DEFAULT`       | 使用字段数据类型的默认值作为缺失字段。                                                          |

### COMPRESSION

与 [CSV 的 COMPRESSION 选项](#compression) 相同。

## PARQUET 选项

### MISSING_FIELD_AS

确定在数据加载期间遇到缺失字段时的行为。请参阅下表中的选项以了解可能的配置。

| 可用值               | 描述                                                                                             |
|----------------------|-------------------------------------------------------------------------------------------------|
| `ERROR` (默认)       | 如果遇到缺失字段，则生成错误。                                                                  |
| `FIELD_DEFAULT`      | 使用字段的默认值作为缺失字段。                                                                  |

## ORC 选项

目前 ORC 格式没有可用选项。