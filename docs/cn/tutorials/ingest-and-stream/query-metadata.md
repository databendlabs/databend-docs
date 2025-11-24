---
title: 查询系统元数据
sidebar_label: 查询系统元数据
---

本教程将演示如何把示例 Parquet 文件上传到 Internal Stage、推断其列定义，并创建带有文件级元数据字段的表，以便追踪每行数据来自哪个文件、对应的行号等。

### 开始之前

请先完成以下准备：

- [下载示例数据集](https://datasets.databend.com/iris.parquet) 并保存到本地。
- 在本地安装 BendSQL。参见 [安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。

### 步骤 1：创建 Internal Stage

```sql
CREATE STAGE my_internal_stage;
```

### 步骤 2：通过 BendSQL 上传文件

假设示例文件位于 `/Users/eric/Documents/iris.parquet`，可在 BendSQL 中运行：

```sql
PUT fs:///Users/eric/Documents/iris.parquet @my_internal_stage;
```

```sql
┌───────────────────────────────────────────────────────┐
│                file                │  status │  size  │
├────────────────────────────────────┼─────────┼────────┤
│ /Users/eric/Documents/iris.parquet │ SUCCESS │   6164 │
└───────────────────────────────────────────────────────┘
```

### 步骤 3：从 Stage 文件推断列定义

:::caution
`infer_schema` 目前仅支持 Parquet 文件。
:::

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

### 步骤 4：带元数据字段的预览

可以使用 `metadata$filename`、`metadata$file_row_number` 等字段查看文件级信息：

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

### 步骤 5：创建包含元数据字段的表

```sql
CREATE TABLE iris_with_meta AS
SELECT
  metadata$filename AS iris_file,
  metadata$file_row_number AS row_index,
  sepal_length,
  sepal_width,
  petal_length,
  petal_width,
  species
FROM @my_internal_stage/iris.parquet;
```

### 步骤 6：查询带元数据的数据

```sql
SELECT * FROM iris_with_meta LIMIT 5;
```

```sql
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     iris_file    │     row_index    │    sepal_length   │    sepal_width    │    petal_length   │    petal_width    │      species     │
├──────────────────┼──────────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────┼──────────────────┤
│ iris.parquet     │                0 │               5.1 │               3.5 │               1.4 │               0.2 │ setosa           │
│ iris.parquet     │                1 │               4.9 │                 3 │               1.4 │               0.2 │ setosa           │
│ iris.parquet     │                2 │               4.7 │               3.2 │               1.3 │               0.2 │ setosa           │
│ iris.parquet     │                3 │               4.6 │               3.1 │               1.5 │               0.2 │ setosa           │
│ iris.parquet     │                4 │                 5 │               3.6 │               1.4 │               0.2 │ setosa           │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```
