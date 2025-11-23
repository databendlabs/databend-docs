---
title: 导出 Parquet
---

## 导出 Parquet

语法：

```sql
COPY INTO {internalStage | externalStage | externalLocation}
FROM { [<database_name>.]<table_name> | ( <query> ) }
FILE_FORMAT = (TYPE = PARQUET)
[MAX_FILE_SIZE = <num>]
[DETAILED_OUTPUT = true | false]
```

- 更多 Parquet 选项请参考 [Parquet File Format Options](/sql/sql-reference/file-format-options#parquet-options)
- 卸载到多个文件请使用 [MAX_FILE_SIZE Copy Option](/sql/sql-commands/dml/dml-copy-into-location#copyoptions)
- 更多关于语法的细节可以在 [COPY INTO location](/sql/sql-commands/dml/dml-copy-into-location) 中找到

## 教程

### Step 1. 创建一个 External Stage

```sql
CREATE STAGE parquet_unload_stage
URL = 's3://unload/parquet/'
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### Step 2. 创建自定义 Parquet 文件格式

```sql
CREATE FILE FORMAT parquet_unload_format
    TYPE = PARQUET
    ;
```

### Step 3. 卸载到 Parquet 文件

```sql
COPY INTO @parquet_unload_stage
FROM (
    SELECT *
    FROM generate_series(1, 100)
)
FILE_FORMAT = (FORMAT_NAME = 'parquet_unload_format')
DETAILED_OUTPUT = true;
```

结果：

```text
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                             file_name                             │ file_size │ row_count │
│                               String                              │   UInt64  │   UInt64  │
├───────────────────────────────────────────────────────────────────┼───────────┼───────────┤
│   data_a3760513-78a8-4a89-8f92-b1a17e0a61b6_0000_00000000.parquet │       445 │       100 │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

### Step 4. 验证卸载的 Parquet 文件

```sql
SELECT COUNT($1)
FROM @parquet_unload_stage
(
    FILE_FORMAT => 'parquet_unload_format',
    PATTERN => '.*[.]parquet'
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
