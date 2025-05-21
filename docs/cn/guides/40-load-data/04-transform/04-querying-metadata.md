---
title: 使用文件和列元数据
sidebar_label: 元数据
---

本指南介绍如何从已暂存的文件中查询元数据。下表总结了支持元数据查询的文件格式：

| 元数据类型           | 支持的文件格式                               |
|---------------------|------------------------------------------------------|
| 文件级别元数据       | CSV, TSV, Parquet, NDJSON, Avro                      |
| 列级别元数据 (INFER_SCHEMA) | Parquet                                              |

以下文件级别元数据字段适用于支持的文件格式：

| 文件元数据               | 类型      | 描述                                           |
|----------------------------|---------|--------------------------------------------------|
| `metadata$filename`        | VARCHAR | 读取行的文件名                                 |
| `metadata$file_row_number` | INT     | 文件中的行号（从 0 开始）                        |

这些元数据字段在以下位置可用：

- 对 Stage 的 SELECT 查询（例如，`SELECT FROM @stage`）
- `COPY INTO <table>` 语句

### 示例

1. 查询元数据字段

从 Stage 读取时，可以直接选择元数据字段：

```sql
SELECT
  metadata$filename,
  metadata$file_row_number
FROM @my_internal_stage
LIMIT 1;
```

```sql
│ metadata$filename │ metadata$file_row_number  │
├───────────────────┼───────────────────────────┤
│ iris.parquet      │                        10 │
```

2. 在 COPY INTO 中使用元数据

可以使用 COPY INTO 将元数据字段传递到目标表列中：

```sql
COPY INTO iris_with_meta 
FROM (SELECT metadata$filename, metadata$file_row_number, $1, $2, $3, $4, $5 FROM @my_internal_stage/iris.parquet) 
FILE_FORMAT=(TYPE=parquet); 
```

## 从文件推断列元数据

Databend 允许您使用 [INFER_SCHEMA](/sql/sql-functions/table-functions/infer-schema) 函数从已暂存的文件中检索列级别元数据。目前 **Parquet** 文件支持此功能。

| 列元数据    | 类型      | 描述                                           |
|-----------------|---------|--------------------------------------------------|
| `column_name`   | String  | 指示列的名称。                                 |
| `type`          | String  | 指示列的数据类型。                               |
| `nullable`      | Boolean | 指示列是否允许空值。                             |
| `order_id`      | UInt64  | 表示列在表中的位置。                             |

### 示例

以下示例从 `@my_internal_stage` 中暂存的 Parquet 文件检索列元数据：

```sql
SELECT * FROM INFER_SCHEMA(location => '@my_internal_stage/iris.parquet');
```

```sql
┌──────────────────────────────────────────────┐
│  column_name │   type  │ nullable │ order_id │
├──────────────┼─────────┼──────────┼──────────┤
│ id           │ BIGINT  │ true     │        0 │
│ sepal_length │ DOUBLE  │ true     │        1 │
│ sepal_width  │ DOUBLE  │ true     │        2 │
│ petal_length │ DOUBLE  │ true     │        3 │
│ petal_width  │ DOUBLE  │ true     │        4 │
│ species      │ VARCHAR │ true     │        5 │
└──────────────────────────────────────────────┘
```

## 教程

- [查询元数据](/tutorials/load/query-metadata)
