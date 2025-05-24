---
title: 查询与转换
slug: querying-stage
---

Databend 支持直接查询 Stage 文件，而无需先将数据加载到表中。您可以从任何 Stage 类型（用户、内部、外部）或直接从对象存储和 HTTPS URL 查询文件。这对于在加载数据之前或之后进行数据检查、验证和转换非常有用。

## 语法

```sql
SELECT [<alias>.]<column> [, <column> ...] | [<alias>.]$<col_position> [, $<col_position> ...]
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]}
[(
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'CSV | TSV | NDJSON | PARQUET | ORC | Avro | <custom_format_name>'],
  [ FILES => ( '<file_name>' [ , '<file_name>' ... ])],
  [ CASE_SENSITIVE => true | false ]
)]
```

## 参数概览

控制数据访问和解析的关键参数：

| 参数 | 描述 |
| --------- | ----------- |
| `FILE_FORMAT` | 文件格式类型 (CSV, TSV, NDJSON, PARQUET, ORC, Avro) |
| `PATTERN` | 用于过滤文件的正则表达式 |
| `FILES` | 要查询的文件的明确列表 |
| `CASE_SENSITIVE` | 列名是否区分大小写 (Parquet) |
| `table_alias` | 引用 Stage 文件的别名 |
| `$col_position` | 按位置选择列（从 1 开始） |
| `connection_parameters` | 外部存储连接详情 |
| `uri` | 远程文件的 URI |

## 支持的文件格式

| 文件格式 | 返回格式 | 访问方法 | 示例 | 指南 |
| ----------- | ------------ | ------------- | ------- | ----- |
| Parquet | 原生数据类型 | 直接列名 | `SELECT id, name FROM` | [查询 Parquet 文件](./00-querying-parquet.md) |
| ORC | 原生数据类型 | 直接列名 | `SELECT id, name FROM` | [查询 ORC 文件](./03-querying-orc.md) |
| CSV | 字符串值 | 位置引用 `$<position>` | `SELECT $1, $2 FROM` | [查询 CSV 文件](./01-querying-csv.md) |
| TSV | 字符串值 | 位置引用 `$<position>` | `SELECT $1, $2 FROM` | [查询 TSV 文件](./02-querying-tsv.md) |
| NDJSON | Variant 对象 | 路径表达式 `$1:<field>` | `SELECT $1:id, $1:name FROM` | [查询 NDJSON 文件](./03-querying-ndjson.md) |
| Avro | Variant 对象 | 路径表达式 `$1:<field>` | `SELECT $1:id, $1:name FROM` | [查询 Avro 文件](./04-querying-avro.md) |
