---
title: 导出 NDJSON
---

## 导出 NDJSON

语法：

```sql
COPY INTO { internalStage | externalStage | externalLocation }
FROM { [<database_name>.]<table_name> | ( <query> ) }
FILE_FORMAT = (
    TYPE = NDJSON,
    COMPRESSION = gzip,
    OUTPUT_HEADER = true
)
[MAX_FILE_SIZE = <num>]
[DETAILED_OUTPUT = true | false]
```

- 更多 NDJSON 选项请参考 [NDJSON File Format Options](/sql/sql-reference/file-format-options#ndjson-options)
- 导出到多个文件请使用 [MAX_FILE_SIZE Copy Option](/sql/sql-commands/dml/dml-copy-into-location#copyoptions)
- 更多关于该语法的细节可以在 [COPY INTO location](/sql/sql-commands/dml/dml-copy-into-location) 中找到。

## 教程

### Step 1. 创建一个 External Stage

```sql
CREATE STAGE ndjson_unload_stage
URL = 's3://unload/ndjson/'
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### Step 2. 创建自定义 NDJSON 文件格式

```
CREATE FILE FORMAT ndjson_unload_format
    TYPE = NDJSON,
    COMPRESSION = gzip;     -- 导出时使用 gzip 压缩
```

### Step 3. 导出为 NDJSON 文件

```sql
COPY INTO @ndjson_unload_stage
FROM (
    SELECT *
    FROM generate_series(1, 100)
)
FILE_FORMAT = (FORMAT_NAME = 'ndjson_unload_format')
DETAILED_OUTPUT = true;
```

结果：

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                              file_name                              │ file_size │ row_count │
├─────────────────────────────────────────────────────────────────────┼───────────┼───────────┤
│   data_068976e5-2072-4ad8-9887-16fb9129ed80_0000_00000000.ndjson.gz │       263 │       100 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Step 4. 验证导出的 NDJSON 文件

```sql
SELECT COUNT($1)
FROM @ndjson_unload_stage
(
    FILE_FORMAT => 'ndjson_unload_format',
    PATTERN => '.*[.]ndjson[.]gz'
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
