---
title: 查询元数据
---

在本教程中，我们将引导您完成以下步骤：将示例 Parquet 文件上传到内部 Stage，推断列定义，并创建一个包含文件级别元数据字段的表。当您想要跟踪每一行的来源或在数据集中包含文件名和行号等元数据时，这将非常有用。

### 开始之前

在开始之前，请确保您已准备好以下先决条件：

- [下载示例数据集](https://datasets.databend.com/iris.parquet) 并将其保存到您的本地文件夹。
- BendSQL 已安装在您的本地机器上。有关如何使用各种包管理器安装 BendSQL 的说明，请参阅 [安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。

### 步骤 1：创建一个内部 Stage

```sql
CREATE STAGE my_internal_stage;
```

### 步骤 2：使用 BendSQL 上传示例文件

假设您的示例数据集位于 `/Users/eric/Documents/iris.parquet`，请在 BendSQL 中运行以下命令将其上传到 Stage：

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

### 步骤 3：从暂存文件中查询列定义
:::caution

`infer_schema` 目前仅支持 parquet 文件格式。

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

### 步骤 4：使用元数据字段预览文件内容

您可以使用 `metadata$filename` 和 `metadata$file_row_number` 等元数据字段来检查文件级别的信息：

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

### 步骤 5：创建一个包含元数据字段的表

让我们创建一个表，其中包含推断的列以及文件名和行号等元数据字段：

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

### 步骤 6：查询带有元数据的数据

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