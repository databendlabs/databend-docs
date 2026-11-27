---
title: 导出 CSV
---

import FunctionDescription from '@site/src/components/FunctionDescription';

## 导出 CSV

语法：

```sql
COPY INTO { internalStage | externalStage | externalLocation }
FROM { [<database_name>.]<table_name> | ( <query> ) }
FILE_FORMAT = (
    TYPE = CSV,
    RECORD_DELIMITER = '<character>',
    FIELD_DELIMITER = '<character>',
    COMPRESSION = gzip,
    OUTPUT_HEADER = true -- 导出时带表头
)
[MAX_FILE_SIZE = <num>]
[DETAILED_OUTPUT = true | false]
```

- 更多 CSV 选项请参考 [CSV 文件格式选项](/sql/sql-reference/file-format-options#csv-options)
- 导出到多个文件请使用 [MAX_FILE_SIZE Copy 选项](/sql/sql-commands/dml/dml-copy-into-location#copyoptions)
- 更多关于语法的细节可以在 [COPY INTO location](/sql/sql-commands/dml/dml-copy-into-location) 中找到

<h2 id="csv-output-compatibility">CSV 输出兼容性</h2>

<FunctionDescription description="Introduced or updated: Unreleased"/>

默认的 `QUOTE_STYLE = 'QUOTE_NOT_NULL'` 现在会对每个非 NULL 值加引号。此前，数值、BOOLEAN 和非空 BINARY 值不加引号。升级到包含此更改的版本后，CSV 内容、字节数、压缩大小和文件拆分结果可能变化。TSV 输出不变。

如果希望普通整数、浮点数和 DECIMAL 值不加引号，请使用 `QUOTE_STYLE = 'QUOTE_NON_NUMERIC'`。此策略仍会对 BOOLEAN 和 BINARY 值加引号。三种策略见 [QUOTE_STYLE](/sql/sql-reference/file-format-options#csv-quote-style)。

所有策略现在都会对空 STRING、空 BINARY 及等于 `NULL_DISPLAY` 的非 NULL 值加引号。要在回载时保留这些值，请保持 `QUOTED_EMPTY_FIELD_AS = STRING` 和 `ALLOW_QUOTED_NULLS = false`。请匹配导出时的分隔符、引号字符、`NULL_DISPLAY` 和 `BINARY_FORMAT`。其他加载选项（如 `TRIM_SPACE`）仍可能改变值。

## 教程

### Step 1. 创建一个 External Stage

```sql
CREATE STAGE csv_unload_stage
URL = 's3://unload/csv/'
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### Step 2. 创建自定义 CSV 文件格式

```sql
CREATE FILE FORMAT csv_unload_format
    TYPE = CSV,
    RECORD_DELIMITER = '\n',
    FIELD_DELIMITER = ',',
    COMPRESSION = gzip,     -- 导出时使用 gzip 压缩
    OUTPUT_HEADER = true,   -- 导出时带表头
    SKIP_HEADER = 1;        -- 仅用于加载，如果 CSV 文件有表头，查询时跳过第一行
```

### Step 3. 导出到 CSV 文件

```sql
COPY INTO @csv_unload_stage
FROM (
    SELECT *
    FROM generate_series(1, 100)
)
FILE_FORMAT = (FORMAT_NAME = 'csv_unload_format')
DETAILED_OUTPUT = true;
```

结果（历史示例；文件名和大小可能不同，上述引号规则变化也会影响大小）：

```text
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                             file_name                            │ file_size │ row_count │
├──────────────────────────────────────────────────────────────────┼───────────┼───────────┤
│   data_c8382216-0a04-4920-9eca-7b5debe3eed6_0000_00000000.csv.gz │       187 │       100 │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### Step 4. 验证导出的 CSV 文件

```sql
SELECT COUNT($1)
FROM @csv_unload_stage
(
    FILE_FORMAT => 'csv_unload_format',
    PATTERN => '.*[.]csv[.]gz'
);
```

结果：

```text
┌───────────┐
│ count($1) │
├───────────┤
│       100 │
└───────────┘
```