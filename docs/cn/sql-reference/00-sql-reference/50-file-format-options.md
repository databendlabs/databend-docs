---
title: 输入与输出文件格式
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.530"/>

Databend 支持多种文件格式作为数据加载或卸载的源和目标。本页介绍支持的文件格式及其可用选项。

## 语法

在语句中指定文件格式时，使用以下语法：

```sql
-- 指定标准文件格式
... FILE_FORMAT = ( TYPE = { CSV | TSV | NDJSON | PARQUET | ORC } [ formatTypeOptions ] )

-- 指定自定义文件格式
... FILE_FORMAT = ( FORMAT_NAME = '<your-custom-format>' )
```

- Databend 目前仅支持 ORC 作为数据源。暂不支持将数据卸载为 ORC 文件。
- 如果在执行 COPY INTO 或从 Stage 执行 SELECT 操作时未指定 FILE_FORMAT，Databend 将使用创建 Stage 时初始定义的文件格式。若创建 Stage 时未显式指定文件格式，Databend 默认使用 PARQUET 格式。如果指定的 FILE_FORMAT 与创建 Stage 时定义的不同，Databend 将优先采用操作中指定的 FILE_FORMAT。
- 关于在 Databend 中管理自定义文件格式，请参阅[文件格式](../10-sql-commands/00-ddl/13-file-format/index.md)。

### formatTypeOptions

`formatTypeOptions` 包含一个或多个选项，用于描述文件的其他格式细节。选项因文件格式而异。请参阅以下部分了解每种支持的文件格式的可用选项。

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

Databend 接受符合 [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180) 的 CSV 文件，并遵循以下条件：

- 若字符串包含 [QUOTE](#quote)、[ESCAPE](#escape)、[RECORD_DELIMITER](#record_delimiter) 或 [FIELD_DELIMITER](#field_delimiter) 字符，则必须加引号。
- 在引号字符串中，除 [QUOTE](#quote) 外，不会转义任何字符。
- [FIELD_DELIMITER](#field_delimiter) 和 [QUOTE](#quote) 之间不应有空格。
- 若字符串来自序列化的 Array 或 Struct 字段，将在 CSV 中加引号。
- 若您开发程序并从中生成 CSV 文件，Databend 建议使用编程语言的 CSV 库。

### RECORD_DELIMITER

分隔输入文件中的记录。

**可用值**：

- `\r\n`
- 一个非字母数字的单字节字符，如 `#` 和 `|`。
- 带有转义字符的字符：`\b`、`\f`、`\r`、`\n`、`\t`、`\0`、`\xHH`

**默认值**：`\n`

### FIELD_DELIMITER

分隔记录中的字段。

**可用值**：

- 一个非字母数字的单字节字符，如 `#` 和 `|`。
- 带有转义字符的字符：`\b`、`\f`、`\r`、`\n`、`\t`、`\0`、`\xHH`

**默认值**：`,`（逗号）

### QUOTE

在 CSV 文件中为字符串加引号。对于数据加载，除非字符串包含 [QUOTE](#quote)、[ESCAPE](#escape)、[RECORD_DELIMITER](#record_delimiter) 或 [FIELD_DELIMITER](#field_delimiter) 字符，否则不需要引号。

:::note
**仅用于数据加载**：此选项在从 Databend 卸载数据时不可用。
:::

**可用值**：`'`、`"` 或 `（反引号）

**默认值**：`"`

### ESCAPE

在引号字符串中转义引号。

**可用值**：`'\\'` 或 `''`

**默认值**：`''`

### SKIP_HEADER

指定从文件开头跳过多少行。

:::note
**仅