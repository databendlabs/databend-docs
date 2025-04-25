---
title: 使用文件和列元数据
sidebar_label: 元数据
---

本指南解释了如何从已暂存的文件中查询元数据。元数据包括文件级别的元数据（例如文件名和行号）和列级别的元数据（例如列名、类型和可空性）。

## 访问文件级别元数据

当读取 CSV、TSV、Parquet 和 NDJSON 格式的已暂存文件时，Databend 支持访问以下文件级别的元数据字段：

| 文件元数据              | 类型    | 描述                                           |
|----------------------------|---------|---------------------------------------------------|
| `metadata$filename`        | VARCHAR | 读取行的文件名                                  |
| `metadata$file_row_number` | INT     | 文件中的行号（从 0 开始）                          |

这些元数据字段在以下位置可用：

- 基于 Stage 的 SELECT 查询（例如，`SELECT FROM @stage`）
- `COPY INTO <table>` 语句

### 示例

1. 查询元数据字段

从 Stage 读取时，您可以直接选择元数据字段：

```sql
SELECT
  metadata$filename,
  metadata$file_row_number,
  *
FROM @my_internal_stage/iris.parquet
LIMIT 5;
```

```sql
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ metadata$filename │ metadata$file_row_number │        id       │    sepal_length   │    sepal_width    │    petal_length   │    petal_width    │      species     │ metadata$filename │ metadata$file_row_number │
├───────────────────┼──────────────────────────┼─────────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────┼──────────────────┼───────────────────┼──────────────────────────┤
│ iris.parquet      │                        0 │               1 │               5.1 │               3.5 │               1.4 │               0.2 │ setosa           │ iris.parquet      │                        0 │
│ iris.parquet      │                        1 │               2 │               4.9 │                 3 │               1.4 │               0.2 │ setosa           │ iris.parquet      │                        1 │
│ iris.parquet      │                        2 │               3 │               4.7 │               3.2 │               1.3 │               0.2 │ setosa           │ iris.parquet      │                        2 │
│ iris.parquet      │                        3 │               4 │               4.6 │               3.1 │               1.5 │               0.2 │ setosa           │ iris.parquet      │                        3 │
│ iris.parquet      │                        4 │               5 │                 5 │               3.6 │               1.4 │               0.2 │ setosa           │ iris.parquet      │                        4 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

2. 在 COPY INTO 中使用元数据

您可以使用 COPY INTO 将元数据字段传递到目标表列中：

```sql
COPY INTO iris_with_meta 
FROM (SELECT metadata$filename, metadata$file_row_number, $1, $2, $3, $4, $5 FROM @my_internal_stage/iris.parquet) 
FILE_FORMAT=(TYPE=parquet); 
```

## 从文件推断列元数据

Databend 允许您使用 [INFER_SCHEMA](/sql/sql-functions/table-functions/infer-schema) 函数从 Parquet 格式的已暂存文件中检索以下列级别的元数据：

| 列元数据 | 类型    | 描述                                           |
|-----------------|---------|---------------------------------------------------|
| `column_name`   | String  | 指示列的名称。                                  |
| `type`          | String  | 指示列的数据类型。                               |
| `nullable`      | Boolean | 指示列是否允许空值。                             |
| `order_id`      | UInt64  | 表示列在表中的位置。                             |

### 示例

以下示例从 `@my_internal_stage` 中暂存的 Parquet 文件中检索列元数据：

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
