---
title: 导出 CSV
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.957"/>

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

## 输入与输出转义

从 v1.2.957 开始，`ESCAPE` 一致地只用于导入。CSV 导出重复嵌入的引号，并按字面保留反斜杠。判断是否为值或 Header 加引号时，导出会忽略 `ESCAPE`。读取这些输出时，请使用 `ESCAPE = ''` 保留字面反斜杠。

`QUOTE_MINIMAL` 仍可能使空字符串和字面 `NULL_DISPLAY` 字符串与 NULL 无法区分。请选择合适的 NULL 标记和引号模式。共用一个命名格式不保证无损往返。有关输入/输出规则及最小引号行为变化，请参阅 [CSV ESCAPE](/sql/sql-reference/file-format-options#escape)。

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

结果：

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