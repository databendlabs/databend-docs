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
- 卸载到多个文件请使用 [MAX_FILE_SIZE Copy Option](/sql/sql-commands/dml/dml-copy-into-location#copyoptions)
- 更多关于该语法的细节可以在 [COPY INTO location](/sql/sql-commands/dml/dml-copy-into-location) 中找到。

## Tutorial

### Step 1. Create an External Stage

```sql
CREATE STAGE ndjson_unload_stage
URL = 's3://unload/ndjson/'
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### Step 2. Create Custom NDJSON File Format

```
CREATE FILE FORMAT ndjson_unload_format
    TYPE = NDJSON,
    COMPRESSION = gzip;     -- Unload with gzip compression
```

### Step 3. Unload into NDJSON File

```sql
COPY INTO @ndjson_unload_stage
FROM (
    SELECT *
    FROM generate_series(1, 100)
)
FILE_FORMAT = (FORMAT_NAME = 'ndjson_unload_format')
DETAILED_OUTPUT = true;
```

Result:

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                              file_name                              │ file_size │ row_count │
├─────────────────────────────────────────────────────────────────────┼───────────┼───────────┤
│   data_068976e5-2072-4ad8-9887-16fb9129ed80_0000_00000000.ndjson.gz │       263 │       100 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Step 4. Verify the Unloaded NDJSON Files

```sql
SELECT COUNT($1)
FROM @ndjson_unload_stage
(
    FILE_FORMAT => 'ndjson_unload_format',
    PATTERN => '.*[.]ndjson[.]gz'
);
```

Result:

```text
┌───────────┐
│ count($1) │
├───────────┤
│       100 │
└───────────┘
```
