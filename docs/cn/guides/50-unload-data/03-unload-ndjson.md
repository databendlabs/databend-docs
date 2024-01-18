---
title: 卸载 NDJSON 文件
---

## 卸载 TSV 文件

```sql
COPY INTO { internalStage | externalStage | externalLocation }
FROM { [<database_name>.]<table_name> | ( <query> ) }
FILE_FORMAT = (
    TYPE = NDJSON,
    COMPRESSION = gzip,
    OUTPUT_HEADER = true
)
[MAX_FILE_SIZE = <num>]
DETAILED_OUTPUT = true;
```

- 更多 NDJSON 选项请参考 [NDJSON 文件格式选项](/sql/sql-reference/file-format-options#ndjson-options)
- 卸载到多个文件请使用 [MAX_FILE_SIZE 复制选项](/sql/sql-commands/dml/dml-copy-into-location#copyoptions)
- 有关语法的更多细节可以在 [COPY INTO <location\>](/sql/sql-commands/dml/dml-copy-into-location) 中找到

## 教程

### 第 1 步. 创建外部阶段

```sql
CREATE STAGE ndjson_unload_stage 
URL = 's3://unload/ndjson/' 
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### 第 2 步. 创建自定义 NDJSON 文件格式

```
CREATE FILE FORMAT ndjson_unload_format 
    TYPE = NDJSON,
    COMPRESSION = gzip;     -- 使用 gzip 压缩卸载
```

### 第 3 步. 卸载到 NDJSON 文件

```sql
COPY INTO @ndjson_unload_stage 
FROM (
    SELECT * 
    FROM generate_series(1, 100)
) 
FILE_FORMAT = (FORMAT_NAME = 'ndjson_unload_format')
DETAILED_OUTPUT = true;
```

结果:
```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                              file_name                              │ file_size │ row_count │
├─────────────────────────────────────────────────────────────────────┼───────────┼───────────┤
│   data_068976e5-2072-4ad8-9887-16fb9129ed80_0000_00000000.ndjson.gz │       263 │       100 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 第 4 步. 验证卸载的 NDJSON 文件

```sql
SELECT COUNT($1)
FROM @ndjson_unload_stage
(
    FILE_FORMAT => 'ndjson_unload_format',
    PATTERN => '.*[.]ndjson[.]gz'
);
```

结果:
```text
┌───────────┐
│ count($1) │
├───────────┤
│       100 │
└───────────┘
```