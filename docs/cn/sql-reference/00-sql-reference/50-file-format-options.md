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
... FILE_FORMAT = ( TYPE = { CSV | TSV | NDJSON | PARQUET | LANCE | ORC | AVRO } [ formatTypeOptions ] )

-- 指定自定义文件格式
... FILE_FORMAT = ( FORMAT_NAME = '<your-custom-format>' )
```

:::note
- 从 Databend `v1.2.891-nightly` 开始，`TEXT` 可作为 `TSV` 的别名使用。
- 较旧版本的 Server 可能不支持 `TYPE = TEXT`，因此本页在语法和示例中仍以 `TSV` 为主，以兼容不同版本。
- 如果你的环境只面向 Databend `v1.2.891-nightly` 及之后版本，新的配置更推荐使用 `TYPE = TEXT`。
:::

Databend 按如下优先级确定 COPY 或 Select 语句使用的文件格式：
1. 首先，检查语句中是否显式指定了 FILE_FORMAT。
2. 如果语句中未指定 FILE_FORMAT，则使用创建 Stage 时为其定义的文件格式。
3. 如果创建 Stage 时也未定义文件格式，Databend 默认使用 PARQUET 格式。

:::note
- Databend 目前仅支持 ORC 和 AVRO 作为数据源。尚不支持将数据导出到 ORC 或 AVRO 文件中。
- Databend 目前仅支持将 LANCE 用作导出目标。`COPY INTO <location>` 写出的不是单个文件，而是一个 Lance 数据集目录，因此更适合由 Lance 工具链消费，而不是在 Databend 中直接作为 Stage 文件查询或通过 `COPY INTO <table>` 重新加载。
- 有关在 Databend 中管理自定义文件格式的信息，请参阅 [文件格式](../10-sql-commands/00-ddl/13-file-format/index.md)。
:::

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

Databend CSV 符合 [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180) 标准，并遵循以下规则：

- 如果字符串包含 [QUOTE](#quote)、[ESCAPE](#escape)、[RECORD_DELIMITER](#record_delimiter) 或 [FIELD_DELIMITER](#field_delimiter) 的字符，则必须加引号。
- 在带引号的字符串中，除了 [QUOTE](#quote) 之外不会转义任何字符。
- [FIELD_DELIMITER](#field_delimiter) 和 [QUOTE](#quote) 之间不应留有空格。

### RECORD_DELIMITER

分隔文件中记录的分隔字符。

**可用值**:

- `\r\n`
- 一个字节的非字母数字字符，例如 `#` 和 `|`。
- 带有转义字符的字符：`\b`、`\f`、`\r`、`\n`、`\t`、`\0`、`\xHH`

**默认值**: `\n`

### FIELD_DELIMITER

分隔记录中字段的分隔字符。

**可用值**:

- 一个字节的非字母数字字符，例如 `#` 和 `|`。
- 带有转义字符的字符：`\b`、`\f`、`\r`、`\n`、`\t`、`\0`、`\xHH`

**默认值**: `,`（逗号）

### QUOTE（仅导入）

用于引用值的字符。

对于数据导入，除非字符串包含 [QUOTE](#quote仅导入)、[ESCAPE](#escape)、[RECORD_DELIMITER](#record_delimiter) 或 [FIELD_DELIMITER](#field_delimiter) 的字符，否则不需要引号。

**可用值**: `'\''`、`'"'` 或 ``'`'``（反引号）

**默认值**: `'"'`

### ESCAPE

用于在带引号的值中转义引号字符的字符，除了 [QUOTE](#quote仅导入) 自身（双引号转义）之外的额外转义方式。

在某些 CSV 变体中，引号使用特殊转义字符（如 `\`）来转义，而不是通过重复引号。

**可用值**: `'\\'` 或 `''`（空，表示仅使用双引号转义）

**默认值**: `''`

### SKIP_HEADER（仅导入）

从文件开头跳过的行数。

**默认值**: `0`

### TRIM_SPACE（仅导入）

在类型转换之前，去除每个字段值的前导和尾随 ASCII 空白字符。

去除的字符集固定为 ASCII 空白：空格、制表符、LF、CR、VT、FF。

对于 CSV，去除发生在 csv-core 提取字段之后，因此带引号字段的内容也会被去除。

**默认值**: `false`

### OUTPUT_HEADER（仅导出）

在导出数据时包含列名标题行。

**默认值**: `false`

### QUOTE_STYLE（仅导出）

控制 CSV 输出时字段的引号策略。

| 可用值                     | 描述                                                         |
|---------------------------|--------------------------------------------------------------|
| `QUOTE_NOT_NULL`（默认）   | 对每个非 NULL 字段加引号。                                    |
| `QUOTE_MINIMAL`           | 仅在 CSV 格式需要时才对字段加引号。                            |

**默认值**: `QUOTE_NOT_NULL`

### NAN_DISPLAY

表示 "NaN"（非数字）的字符串。

**可用值**: 必须是文字 `'nan'` 或 `'null'`（不区分大小写）

**默认值**: `'NaN'`

### NULL_DISPLAY

表示 NULL 值的字符串。

导入数据时，未加引号的匹配值始终转为 NULL；加引号的匹配值仅在 `ALLOW_QUOTED_NULLS=true` 时转为 NULL。

**默认值**: `'\N'`

### ALLOW_QUOTED_NULLS（仅导入）

允许将带引号的字符串转换为 NULL 值。

仅当此选项为 true 时，匹配 `NULL_DISPLAY` 的带引号字符串才会被转为 NULL。未加引号的匹配值无论此选项如何都会转为 NULL。

**默认值**: `false`

### ERROR_ON_COLUMN_COUNT_MISMATCH（仅导入）

如果数据文件中的列数与目标表的列数不匹配，则返回错误。

**默认值**: `true`

### EMPTY_FIELD_AS（仅导入）

未加引号的空字段（即 `,,`）被转换为的值。

| 可用值           | 转换为                                                                |
|------------------|-----------------------------------------------------------------------|
| `NULL`           | `NULL`。如果列不可为空则报错。                                         |
| `STRING`         | 对于 String 列：`''`。<br/> 对于其他列：`NULL`。如果不可为空则报错。    |
| `FIELD_DEFAULT`  | 列的默认值。                                                          |

**默认值**: `NULL`

### QUOTED_EMPTY_FIELD_AS（仅导入）

带引号的空字段（即 `,"",`）被转换为的值。

**可用值**: 与 [EMPTY_FIELD_AS](#empty_field_as仅导入) 相同

**默认值**: `STRING`

### BINARY_FORMAT

`Binary` 列的编码格式。

**可用值**: `HEX` 或 `BASE64`

**默认值**: `HEX`

### GEOMETRY_FORMAT

`Geometry` 列的编码格式。

**可用值**: `EWKT`、`WKB`、`WKB`、`EWKB`、`GEOJSON`

**默认值**: `EWKT`

### ENCODING（仅导入）

源文件的字符集编码。设置为非 UTF-8 编码时，文件内容会在字段解析之前先转码为 UTF-8。

支持 [Encoding Standard](https://encoding.spec.whatwg.org/) 识别的任何标签（如 `UTF-8`、`GBK`、`SHIFT_JIS`、`EUC-KR`、`ISO-8859-1`）。标签在创建文件格式 / Stage 时即进行验证。

**默认值**: `UTF-8`

### ENCODING_ERROR_MODE（仅导入）

遇到声明编码中的无效字节（或 encoding 为 `UTF-8` 时的无效 UTF-8 字节）时的处理方式。

| 可用值              | 描述                                                             |
|--------------------|------------------------------------------------------------------|
| `STRICT`（默认）    | 遇到第一个格式错误的字节序列时中止并报错。                             |
| `REPLACE`          | 将每个格式错误的字节序列替换为 U+FFFD 并继续处理。                     |

**默认值**: `STRICT`

### COMPRESSION

压缩算法。

| 可用值           | 描述                                                                  |
|------------------|-----------------------------------------------------------------------|
| `NONE`           | 表示文件未压缩。                                                      |
| `AUTO`           | 通过文件扩展名自动检测压缩                                              |
| `GZIP`           |                                                                       |
| `BZ2`            |                                                                       |
| `BROTLI`         | 如果导入/导出 Brotli 压缩文件，则必须指定。                            |
| `ZSTD`           | 支持 Zstandard v0.8（及更高版本）。                                      |
| `DEFLATE`        | Deflate 压缩文件（带有 zlib 标头，RFC1950）。                           |
| `RAW_DEFLATE`    | Deflate 压缩文件（没有任何标头，RFC1951）。                            |
| `XZ`             |                                                                       |

**默认值**: `NONE`

## TSV 选项

Databend TSV（在 `v1.2.891-nightly` 及之后版本中也称为 `TEXT`）在两种名称下使用相同的格式和选项。为了兼容旧版本 Server，本页仍以 `TSV` 作为主要术语。

Databend TSV 遵循以下规则：

- [RECORD_DELIMITER](#record_delimiter-1)、[FIELD_DELIMITER](#field_delimiter-1) 通过 `\` 进行转义以解决[分隔符冲突](https://en.wikipedia.org/wiki/Delimiter#Delimiter_collision)
- 除了分隔符之外，以下字符也会被转义：`\b`、`\f`、`\r`、`\n`、`\t`、`\0`、`\\`、`\'`。
- [QUOTE](#quote仅导入) 不属于此格式。
- NULL 表示为 `\N`。

:::note
1. 在 Databend 中，TSV 和 CSV 之间的主要区别不是使用制表符代替逗号作为字段分隔符（可以通过选项更改），而是使用转义而不是引用来解决[分隔符冲突](https://en.wikipedia.org/wiki/Delimiter#Delimiter_collision)
2. 我们建议使用 CSV 作为存储格式，因为它具有正式标准。
3. TSV 可用于加载以下工具生成的文件
   1. [Postgresql TEXT](https://www.postgresql.org/docs/current/sql-copy.html)。
   2. [Clickhouse TSV](https://clickhouse.com/docs/integrations/data-formats/csv-tsv#tsv-tab-separated-files)
   3. [MySQL TabSeperated](https://dev.mysql.com/doc/refman/8.4/en/mysqldump.html) MySQL `mysqldump --tab`。如果使用了 `--fields-enclosed-by` 或 `--fields-optinally-enclosed-by`，请改用 CSV。
   4. [Snowflake CSV](https://docs.snowflake.com/en/sql-reference/sql/create-file-format#type-csv) 默认选项。如果指定了 `ESCAPE_UNENCLOSED_FIELD`，请改用 CSV。
   5. Hive Textfile。
:::

### RECORD_DELIMITER

分隔文件中记录的分隔字符。

**可用值**:

- `\r\n`
- 任意字符，例如 `#` 和 `|`。
- 带有转义字符的字符：`\b`、`\f`、`\r`、`\n`、`\t`、`\0`、`\xHH`

**默认值**: `\n`

### FIELD_DELIMITER

分隔记录中字段的分隔字符。

**可用值**:

- 非字母数字字符，例如 `#` 和 `|`。
- 带有转义字符的字符：`\b`、`\f`、`\r`、`\n`、`\t`、`\0`、`\xHH`

**默认值**: `\t`（TAB）

### SKIP_HEADER（仅导入）

与 [CSV 的 SKIP_HEADER 选项](#skip_header仅导入) 相同。

### TRIM_SPACE（仅导入）

与 [CSV 的 TRIM_SPACE 选项](#trim_space仅导入) 相同。

### OUTPUT_HEADER（仅导出）

与 [CSV 的 OUTPUT_HEADER 选项](#output_header仅导出) 相同。

### NAN_DISPLAY

与 [CSV 的 NAN_DISPLAY 选项](#nan_display) 相同。

### NULL_DISPLAY

与 [CSV 的 NULL_DISPLAY 选项](#null_display) 相同。

### EMPTY_FIELD_AS（仅导入）

与 [CSV 的 EMPTY_FIELD_AS 选项](#empty_field_as仅导入) 相同。

注意：TSV 的默认值为 `FIELD_DEFAULT`（与 CSV 默认的 `NULL` 不同）。

**默认值**: `FIELD_DEFAULT`

### ERROR_ON_COLUMN_COUNT_MISMATCH（仅导入）

与 [CSV 的 ERROR_ON_COLUMN_COUNT_MISMATCH 选项](#error_on_column_count_mismatch仅导入) 相同。

### ENCODING（仅导入）

与 [CSV 的 ENCODING 选项](#encoding仅导入) 相同。

### ENCODING_ERROR_MODE（仅导入）

与 [CSV 的 ENCODING_ERROR_MODE 选项](#encoding_error_mode仅导入) 相同。

### COMPRESSION

与 [CSV 的 COMPRESSION 选项](#compression) 相同。

## NDJSON 选项

### NULL_FIELD_AS（仅导入）

`null` 值被转换为的目标值。

| 可用值                | 转换为                                                   |
|-------------------------|----------------------------------------------------------|
| `NULL`（默认）          | 可为空字段转为 NULL。不可为空字段则报错。                    |
| `FIELD_DEFAULT`         | 字段的默认值。                                              |

### MISSING_FIELD_AS（仅导入）

缺失字段被转换为的目标值。

| 可用值          | 转换为                                                   |
|------------------|----------------------------------------------------------|
| `ERROR`（默认）  | 报错。                                                       |
| `NULL`           | 可为空字段转为 NULL。不可为空字段则报错。                    |
| `FIELD_DEFAULT`  | 字段的默认值。                                              |

### NULL_IF（仅导入）

一组字符串。当源文件中的字段值与列表中的某个字符串完全匹配时，该值被加载为 NULL。匹配为精确匹配且区分大小写。

**语法**: `NULL_IF = ('value1', 'value2', ...)`

**默认值**: 空（无额外 NULL 标记）

### COMPRESSION

与 [CSV 的 COMPRESSION 选项](#compression) 相同。

## PARQUET 选项

### MISSING_FIELD_AS（仅导入）

缺失字段被转换为的目标值。

| 可用值          | 转换为                                                   |
|------------------|----------------------------------------------------------|
| `ERROR`（默认）  | 报错。                                                       |
| `FIELD_DEFAULT`  | 字段的默认值。                                              |

### NULL_IF（仅导入）

与 [NDJSON 的 NULL_IF 选项](#null_if仅导入) 相同。

### USE_LOGIC_TYPE（仅导入）

启用时，使用 Parquet 逻辑类型（如 DATE、TIMESTAMP、DECIMAL 注解）来确定导入时的目标列类型。禁用时，仅考虑物理存储类型。

**默认值**: `true`

### COMPRESSION（仅导出）

Parquet 文件内部块的压缩算法。

| 可用值           | 描述                                                                  |
|------------------|-----------------------------------------------------------------------|
| `ZSTD`（默认）    | 支持 Zstandard v0.8（及更高版本）。                                      |
| `SNAPPY`         | Snappy 是一种常与 Parquet 配合使用的快速压缩算法。                |

## LANCE 选项

`LANCE` 仅支持用于 `COPY INTO <location>` 导出。

与 CSV、TSV、NDJSON 和 PARQUET 不同，Lance 导出不会生成一个或多个 Databend 可直接回读的独立文件，而是生成一个数据集目录，其中包含 `.lance` 数据文件以及 `_versions/` 等元数据。

因此，Lance 更适合下游机器学习、向量检索或 Arrow/Lance 工具链消费，例如 Python `lance`（安装命令为 `pip install pylance`）。

### 格式专属选项

Lance 没有额外的格式专属选项，直接使用：

```sql
FILE_FORMAT = (TYPE = LANCE)
```

### 与其他格式的显著区别

| 项目 | LANCE 的行为 |
|------|---------------|
| 支持方向 | 仅导出 |
| 在 Databend 中直接查询 Stage 文件 | 不支持 |
| `COPY INTO <table>` | 不支持 |
| 输出形态 | 包含 `.lance` 文件和元数据的数据集目录 |
| `SINGLE` Copy 选项 | 不支持 |
| `PARTITION BY` | 不支持 |


## ORC 选项

### MISSING_FIELD_AS（仅导入）

缺失字段被转换为的目标值。

| 可用值          | 转换为                                                   |
|------------------|----------------------------------------------------------|
| `ERROR`（默认）  | 报错。                                                       |
| `FIELD_DEFAULT`  | 字段的默认值。                                              |


## AVRO 选项

### MISSING_FIELD_AS（仅导入）

缺失字段被转换为的目标值。

| 可用值          | 转换为                                                   |
|------------------|----------------------------------------------------------|
| `ERROR`（默认）  | 报错。                                                       |
| `FIELD_DEFAULT`  | 字段的默认值。                                              |

### NULL_IF（仅导入）

与 [NDJSON 的 NULL_IF 选项](#null_if仅导入) 相同。

### USE_LOGIC_TYPE（仅导入）

启用时，使用 Avro 逻辑类型（如 date、timestamp-millis、decimal）来确定导入时的目标列类型。禁用时，仅考虑底层 Avro 类型。

**默认值**: `true`
