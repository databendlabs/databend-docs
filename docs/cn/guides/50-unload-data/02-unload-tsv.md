---
title: 卸载 TSV 文件
---

## 卸载 TSV 文件 {#examples}

```sql
COPY INTO { internalStage | externalStage | externalLocation }
FROM { [<database_name>.]<table_name> | ( <query> ) }
FILE_FORMAT = (
    TYPE = TSV,
    RECORD_DELIMITER = '<character>', 
    FIELD_DELIMITER = '<character>',
    COMPRESSION = gzip,
    OUTPUT_HEADER = true -- 带有表头的卸载
)
[MAX_FILE_SIZE = <num>]
DETAILED_OUTPUT = true;
```

- 更多 TSV 选项请参考 [TSV 文件格式选项](/sql/sql-reference/file-format-options#tsv-options)
- 卸载到多个文件请使用 [MAX_FILE_SIZE 复制选项](/sql/sql-commands/dml/dml-copy-into-location#copyoptions)
- 更多关于语法的细节可以在 [COPY INTO <location\>](/sql/sql-commands/dml/dml-copy-into-location) 中找到

## 教程

### 第 1 步. 创建一个外部阶段

```sql
CREATE STAGE tsv_unload_stage 
URL = 's3://unload/tsv/' 
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### 第 2 步. 创建自定义 TSV 文件格式

```sql
CREATE FILE FORMAT tsv_unload_format 
    TYPE = TSV,
    RECORD_DELIMITER = '\n',
    FIELD_DELIMITER = ',',
    COMPRESSION = gzip;     -- 卸载时使用 gzip 压缩
```

### 第 3 步. 卸载到 TSV 文件

```sql
COPY INTO @tsv_unload_stage 
FROM (
    SELECT * 
    FROM generate_series(1, 100)
) 
FILE_FORMAT = (FORMAT_NAME = 'tsv_unload_format')
DETAILED_OUTPUT = true;
```

结果:
```text
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                             file_name                            │ file_size │ row_count │
├──────────────────────────────────────────────────────────────────┼───────────┼───────────┤
│   data_99e8f5c8-79d6-43d8-80d7-13e3f4c91dd5_0002_00000000.tsv.gz │       160 │       100 │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### 第 4 步. 验证卸载的 TSV 文件

```
SELECT COUNT($1)
FROM @tsv_unload_stage
(
    FILE_FORMAT => 'tsv_unload_format',
    PATTERN => '.*[.]tsv[.]gz'
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