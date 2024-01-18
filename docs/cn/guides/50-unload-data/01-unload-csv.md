---
title: 卸载 CSV 文件
---

## 卸载 CSV 文件 {#unloading-csv-file}

```
COPY INTO { internalStage | externalStage | externalLocation }
FROM { [<database_name>.]<table_name> | ( <query> ) }
FILE_FORMAT = (
    TYPE = CSV,
    RECORD_DELIMITER = '<character>',
    FIELD_DELIMITER = '<character>',
    COMPRESSION = gzip,
    OUTPUT_HEADER = true -- 带表头卸载
)
[MAX_FILE_SIZE = <num>]
DETAILED_OUTPUT = true
```

- 更多 CSV 选项请参考 [CSV 文件格式选项](/sql/sql-reference/file-format-options#csv-options)
- 卸载到多个文件请使用 [MAX_FILE_SIZE 复制选项](/sql/sql-commands/dml/dml-copy-into-location#copyoptions)
- 更多关于语法的细节可以在 [COPY INTO <location\>](/sql/sql-commands/dml/dml-copy-into-location) 中找到

## 教程 {#tutorial}

### 第 1 步. 创建一个外部阶段 {#step-1-create-an-external-stage}

```sql
CREATE STAGE csv_unload_stage 
URL = 's3://unload/csv/' 
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### 第 2 步. 创建自定义 CSV 文件格式 {#step-2-create-custom-csv-file-format}

```sql
CREATE FILE FORMAT csv_unload_format 
    TYPE = CSV,
    RECORD_DELIMITER = '\n',
    FIELD_DELIMITER = ',',
    COMPRESSION = gzip,     -- 带 gzip 压缩卸载
    OUTPUT_HEADER = true,   -- 带表头卸载
    SKIP_HEADER = 1;        -- 加载时跳过表头
```

### 第 3 步. 卸载到 CSV 文件 {#step-3-unload-into-csv-file}

```sql
COPY INTO @csv_unload_stage 
FROM (
    SELECT * 
    FROM generate_series(1, 100)
) 
FILE_FORMAT = (FORMAT_NAME = 'csv_unload_format')
DETAILED_OUTPUT = true;
```

结果:
```text
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                             file_name                            │ file_size │ row_count │
├──────────────────────────────────────────────────────────────────┼───────────┼───────────┤
│   data_c8382216-0a04-4920-9eca-7b5debe3eed6_0000_00000000.csv.gz │       187 │       100 │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### 第 4 步. 验证卸载的 CSV 文件 {#step-4-verify-the-unloaded-csv-files}

```
SELECT COUNT($1)
FROM @csv_unload_stage
(
    FILE_FORMAT => 'csv_unload_format',
    PATTERN => '.*[.]csv[.]gz'
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