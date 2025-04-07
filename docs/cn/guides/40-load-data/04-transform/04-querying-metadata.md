---
title: 查询 Stage 文件的元数据
sidebar_label: 元数据
---

## 为什么需要元数据以及什么是元数据？

Databend 允许您使用 [INFER_SCHEMA](/sql/sql-functions/table-functions/infer-schema) 函数从数据文件中检索元数据。这意味着您可以从存储在内部或外部 Stage 中的数据文件中提取列定义。通过 `INFER_SCHEMA` 函数检索元数据可以更好地理解数据结构，确保数据一致性，并实现自动化的数据集成和分析。每列的元数据包括以下信息：

- **column_name**: 表示列的名称。
- **type**: 表示列的数据类型。
- **nullable**: 表示列是否允许空值。
- **order_id**: 表示列在表中的位置。

:::note
此功能目前仅适用于 Parquet 文件格式。
:::

`INFER_SCHEMA` 的语法如下。有关此函数的更多详细信息，请参见 [INFER_SCHEMA](/sql/sql-functions/table-functions/infer-schema)。

```sql
INFER_SCHEMA(
  LOCATION => '{ internalStage | externalStage }'
  [ PATTERN => '<regex_pattern>']
)
```

## 教程：查询列定义

在本教程中，我们将指导您完成将示例文件上传到内部 Stage、查询列定义，并最终基于 Stage 文件创建表的过程。在开始之前，请下载并将示例文件 [books.parquet](https://datafuse-1253727613.cos.ap.hongkong.myqcloud.com/data/books.parquet) 保存到本地文件夹。

1. 创建一个名为 *my_internal_stage* 的内部 Stage：

```sql
CREATE STAGE my_internal_stage;
```

2. 使用 [BendSQL](../../30-sql-clients/00-bendsql/index.md) Stage 示例文件：

```sql
PUT fs:///Users/eric/Documents/books.parquet @my_internal_stage
```

结果：
```
┌───────────────────────────────────────────────┐
│                 file                │  status │
│                String               │  String │
├─────────────────────────────────────┼─────────┤
│ /Users/eric/Documents/books.parquet │ SUCCESS │
└───────────────────────────────────────────────┘
```

3. 从 Stage 的示例文件中查询列定义：

```sql
SELECT * FROM INFER_SCHEMA(location => '@my_internal_stage/books.parquet');
```

结果：
```
┌─────────────┬─────────┬─────────┬─────────┐
│ column_name │ type    │ nullable│ order_id│
├─────────────┼─────────┼─────────┼─────────┤
│ title       │ VARCHAR │       0 │       0 │
│ author      │ VARCHAR │       0 │       1 │
│ date        │ VARCHAR │       0 │       2 │
└─────────────┴─────────┴─────────┴─────────┘
```

4. 基于 Stage 的示例文件创建一个名为 *mybooks* 的表：

```sql
CREATE TABLE mybooks AS SELECT * FROM @my_internal_stage/books.parquet;
```

检查创建的表：

```sql
DESC mybooks;
```

结果：
```
┌─────────┬─────────┬──────┬─────────┬───────┐
│ Field   │ Type    │ Null │ Default │ Extra │
├─────────┼─────────┼──────┼─────────┼───────┤
│ title   │ VARCHAR │ NO   │ ''      │       │
│ author  │ VARCHAR │ NO   │ ''      │       │
│ date    │ VARCHAR │ NO   │ ''      │       │
└─────────┴─────────┴──────┴─────────┴───────┘
```

```sql
SELECT * FROM mybooks;
```

结果：
```
┌───────────────────────────┬───────────────────┬──────┐
│ title                     │ author            │ date │
├───────────────────────────┼───────────────────┼──────┤
│ Transaction Processing    │ Jim Gray          │ 1992 │
│ Readings in Database Systems│ Michael Stonebraker│ 2004│
└───────────────────────────┴───────────────────┴──────┘
```
