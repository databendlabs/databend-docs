---
title: 输入与输出文件格式
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.216"/>

Databend 支持多种文件格式作为数据加载或卸载的源和目标。本页面解释了支持的文件格式及其可用选项。

## 语法

要在语句中指定文件格式，请使用以下语法：

```sql
-- 指定标准文件格式
... FILE_FORMAT = ( TYPE = { CSV | TSV | NDJSON | PARQUET | XML } [ formatTypeOptions ] )

-- 指定自定义文件格式
... FILE_FORMAT = ( FORMAT_NAME = '<your-custom-format>' )
```

- Databend 目前仅支持将 XML 作为源使用。尚不支持将数据卸载到 XML 文件中。
- 如果在执行 COPY INTO 或从阶段 SELECT 操作时未指定 FILE_FORMAT，Databend 将使用您在创建阶段时为该阶段定义的文件格式。在您未在创建阶段时明确指定文件格式的情况下，Databend 默认使用 PARQUET 格式。如果您指定了与创建阶段时定义的不同的 FILE_FORMAT，Databend 将优先考虑在操作期间指定的 FILE_FORMAT。
- 有关在 Databend 中管理自定义文件格式的信息，请参见 [文件格式](../10-sql-commands/00-ddl/13-file-format/index.md)。

### formatTypeOptions

`formatTypeOptions` 包括一个或多个选项，用于描述有关文件的其他格式细节。这些选项根据文件格式的不同而有所不同。请参阅下面的各个支持的文件格式部分，了解每种格式的可用选项。

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

- 如果字符串包含 [QUOTE](#quote)、[ESCAPE](#escape)、[RECORD_DELIMITER](#record_delimiter) 或 [FIELD_DELIMITER](#field_delimiter) 的字符，则必须加引号。
- 引号字符串中除 [QUOTE](#quote) 外不会转义任何字符。
- [FIELD_DELIMITER](#field_delimiter) 和 [QUOTE](#quote) 之间不应留有空格。
- 如果字符串来自序列化的 Array 或 Struct 字段，则在 CSV 中将被引号。
- 如果您开发程序并从中生成 CSV 文件，Databend 建议使用程序语言中的 CSV 库。
- 除非满足以下条件，否则 Databend 不会将从 MySQL 卸载的文件识别为 CSV 格式：
  - `ESCAPED BY` 为空。
  - `ENCLOSED BY` 不为空。
    :::note
    如果不满足上述条件，文件将被识别为 TSV 格式。有关 `ESCAPED BY` 和 `ENCLOSED BY` 子句的更多信息，请参考 https://dev.mysql.com/doc/refman/8.0/en/load-data.html。
    :::

### RECORD_DELIMITER

在输入文件中分隔记录。

**可用值**：

- `\r\n`
- 非字母数字字符，如 `#` 和 `|`。
- 带转义字符的字符：`\b`, `\f`, `\r`, `\n`, `\t`, `\0`, `\xHH`

**默认值**：`\n`

### FIELD_DELIMITER

在记录中分隔字段。

**可用值**：

- 非字母数字字符，如 `#` 和 `|`。
- 带转义字符的字符：`\b`, `\f`, `\r`, `\n`, `\t`, `\0`, `\xHH`

**默认值**：`,`（逗号）

### QUOTE

在 CSV 文件中引用字符串。对于数据加载，除非字符串包含 [QUOTE](#quote)、[ESCAPE](#escape)、[RECORD_DELIMITER](#record_delimiter) 或 [FIELD_DELIMITER](#field_delimiter) 的字符，否则不需要引号。

:::note
**仅用于数据加载**：卸载数据时不可用此选项。
:::

**可用值**：`\'` 或 `\"`。

**默认值**：`\"`

### ESCAPE

在引号字符串中转义引号。

**可用值**：`\'` 或 `\"` 或 `\\`。

**默认值**：`\"`

### SKIP_HEADER

指定从文件开头跳过多少行。

:::note
**仅用于数据加载**：卸载数据时不可用此选项。
:::

**默认值**：`0`

### NAN_DISPLAY

指定在查询结果中如何显示 "NaN"（非数字）值。

**可用值**：必须是字面值 `'nan'` 或 `'null'`（不区分大小写）

**默认值**：`'NaN'`

### NULL_DISPLAY

指定在查询结果中如何显示 NULL 值。

**默认值**：`'\N'`

### ERROR_ON_COLUMN_COUNT_MISMATCH

ERROR_ON_COLUMN_COUNT_MISMATCH 是一个布尔选项，当设置为 true 时，指定如果数据文件中的列数与目标表中的列数不匹配，则应引发错误。将其设置为 true 有助于确保加载过程中的数据完整性和一致性。

**默认值**：`true`

### COMPRESSION

指定压缩算法。

**可用值**：

| 值              | 描述                                          |
| --------------- | --------------------------------------------- |
| `NONE` (默认值) | 表示文件未压缩。                              |
| `AUTO`          | 通过文件扩展名自动检测压缩                    |
| `GZIP`          |                                               |
| `BZ2`           |                                               |
| `BROTLI`        | 加载/卸载 Brotli 压缩文件时必须指定。         |
| `ZSTD`          | 支持 Zstandard v0.8（及更高版本）。           |
| `DEFLATE`       | Deflate 压缩文件（带有 zlib 头部，RFC1950）。 |
| `RAW_DEFLATE`   | Deflate 压缩文件（无任何头部，RFC1951）。     |
| `XZ`            |                                               |

## TSV 选项

处理 TSV 文件时，Databend 受以下条件限制：

- TSV 文件中的这些字符将被转义：`\b`, `\f`, `\r`, `\n`, `\t`, `\0`, `\\`, `\'`, [RECORD_DELIMITER](#record_delimiter-1), [FIELD_DELIMITER](#field_delimiter-1)。
- 目前不支持引号和封闭。
- 如果字符串来自序列化的 Array 或 Struct 字段，则在 CSV 中将被引号。
- Null 被序列化为 `\N`。

### RECORD_DELIMITER

在输入文件中分隔记录。

**可用值**：

- `\r\n`
- 任意字符，如 `#` 和 `|`。
- 带转义字符的字符：`\b`, `\f`, `\r`, `\n`, `\t`, `\0`, `\xHH`

**默认值**：`\n`

### FIELD_DELIMITER

在记录中分隔字段。

**可用值**：

- 非字母数字字符，如 `#` 和 `|`。
- 带转义字符的字符：`\b`, `\f`, `\r`, `\n`, `\t`, `\0`, `\xHH`

**默认值**：`\t`（TAB）

### COMPRESSION

与 [CSV 的 COMPRESSION 选项](#compression) 相同。

## NDJSON 选项

### NULL_FIELD_AS

指定在数据加载期间如何处理 null 值。请参考下表中的选项了解可能的配置。

| 可用值                   | 描述                                                          |
| ------------------------ | ------------------------------------------------------------- |
| `NULL`                   | 将 null 值解释为可空字段的 NULL。对于不可空字段，将生成错误。 |
| `FIELD_DEFAULT` (默认值) | 对于 null 值使用字段的默认值。                                |
| `TYPE_DEFAULT`           | 对于 null 值使用字段数据类型的默认值。                        |

### MISSING_FIELD_AS

确定在数据加载期间遇到缺失字段时的行为。请参考下表中的选项了解可能的配置。

| 可用值           | 描述                                                   |
| ---------------- | ------------------------------------------------------ |
| `ERROR` (默认值) | 如果遇到缺失字段，则生成错误。                         |
| `NULL`           | 将缺失字段解释为 NULL 值。对于不可空字段，将生成错误。 |
| `FIELD_DEFAULT`  | 对于缺失字段使用字段的默认值。                         |
| `TYPE_DEFAULT`   | 对于缺失字段使用字段数据类型的默认值。                 |

### COMPRESSION

与 [CSV 的 COMPRESSION 选项](#compression) 相同。

## PARQUET 选项

### MISSING_FIELD_AS

确定在数据加载期间遇到缺失字段时的行为。请参考下表中的选项了解可能的配置。

| 可用值           | 描述                           |
| ---------------- | ------------------------------ |
| `ERROR` (默认值) | 如果遇到缺失字段，则生成错误。 |
| `FIELD_DEFAULT`  | 对于缺失字段使用字段的默认值。 |

## XML 选项

### COMPRESSION

与 [CSV 的 COMPRESSION 选项](#compression) 相同。

### ROW_TAG

用于选择要作为记录解码的 XML 元素。

**默认值**：`'row'`
