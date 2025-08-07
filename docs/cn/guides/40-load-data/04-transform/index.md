---
title: 查询与转换
slug: querying-stage
---

Databend 支持直接查询暂存区（Stage）中的文件，无需先将数据加载到表中。你可以查询任何类型的暂存区（用户、内部、外部）中的文件，也可以直接从对象存储和 HTTPS URL 查询。这非常适合在加载数据前后进行数据检查、验证和转换。

## 语法

仅查询

```sql
SELECT {
    [<alias>.]<column> [, [<alias>.]<column> ...] -- 按名称查询列
  | [<alias>.]$<col_position> [, [<alias>.]$<col_position> ...] -- 按位置查询列
  | [<alias>.]$1[:<column>] [, [<alias>.]$1[:<column>]  ...] -- 将行作为 Variant 查询
}
FROM {@<stage_name>[/<path>] | '<uri>'}  -- 暂存区表函数
  [( -- 暂存区表函数参数
    [<connection_parameters>],
    [ PATTERN => '<regex_pattern>'],
    [ FILE_FORMAT => 'CSV | TSV | NDJSON | PARQUET | ORC | Avro | <custom_format_name>'],
    [ FILES => ( '<file_name>' [ , '<file_name>' ... ])],
    [ CASE_SENSITIVE => true | false ]
  )]
  [<alias>]
```

转换并复制

```sql
COPY INTO [<database_name>.]<table_name> [ ( <col_name> [ , <col_name> ... ] ) ]
     FROM (
        SELECT {
            [<alias>.]<column> [, [<alias>.]<column> ...] -- 按名称查询列
            | [<alias>.]$<col_position> [, [<alias>.]$<col_position> ...] -- 按位置查询列
            | [<alias>.]$1[:<column>] [, [<alias>.]$1[:<column>]  ...] -- 将行作为 Variant 查询
            } ]
        FROM {@<stage_name>[/<path>] | '<uri>'} 
    )
[ FILES = ( '<file_name>' [ , '<file_name>' ] [ , ... ] ) ]
[ PATTERN = '<regex_pattern>' ]
[ FILE_FORMAT = (
         FORMAT_NAME = '<your-custom-format>'
         | TYPE = { CSV | TSV | NDJSON | PARQUET | ORC | AVRO } [ formatTypeOptions ]
       ) ]
[ copyOptions ]
```
:::info 注意

对比两种语法
- 相同的 `Select List` 
- 相同的 ` FROM {@<stage_name>[/<path>] | '<uri>'}`
- 不同的参数：
  - 查询使用 `表函数参数`，即 `(<key> => <value>, ...)` 
  - 转换使用 [Copy into table](/sql/sql-commands/dml/dml-copy-into-table) 末尾的选项

:::


## FROM 子句

`FROM` 子句使用与 `表函数` 类似的语法。与普通表一样，当与其他表连接时，可以使用表 `别名`。

表函数参数：

| 参数 | 描述 |
|-------------------------|---------------------------------------------------------|
| `FILE_FORMAT` | 文件格式类型（CSV、TSV、NDJSON、PARQUET、ORC、Avro） |
| `PATTERN` | 用于筛选文件的正则表达式模式 |
| `FILES` | 要查询的文件的明确列表 |
| `CASE_SENSITIVE` | 列名大小写敏感（仅限 Parquet） |
| `connection_parameters` | 外部存储连接详情 |

## 查询文件数据

select 列表支持三种语法；只能使用其中一种，不能混合使用。

### 将行作为 Variant 查询

- 支持的文件格式：NDJSON、AVRO、Parquet、ORC

:::info 注意

目前对于 Parquet 和 ORC，`将行作为 Variant 查询` 比 `按名称查询列` 慢，并且这两种方法不能混合使用。

:::

语法：

```sql
SELECT [<alias>.]$1[:<column>] [, [<alias>.]$1[:<column>]  ...] <FROM Clause>
```

- 示例：`SELECT $1:id, $1:name FROM ...`
- 表结构：($1: Variant)。即，具有 Variant 对象类型的单列，每个 Variant 代表一整行
- 注意：
  - 像 `$1:column` 这样的路径表达式的类型也是 Variant，当在表达式中使用或加载到目标表列时，它可以自动转换为原生类型。有时你可能希望为了特定类型的操作（例如，`CAST($1:id AS INT)`）而手动进行转换，以使语义更加明确。


### 按名称查询列
- 支持的文件格式：NDJSON、AVRO、Parquet、ORC

```sql
SELECT [<alias>.]<column> [, [<alias>.]<column>  ...] <FROM Clause>
```

- 示例：`SELECT id, name FROM ...`
- 表结构：从 Parquet 或 ORC 文件模式映射的列
- 注意：
  - 所有文件都必须具有相同的 Parquet/ORC 模式；否则将返回错误


### 按位置查询列
- 支持的文件格式：CSV、TSV

```sql
SELECT [<alias>.]$<col_position>[, [<alias>.]$<col_position>,  ...] <FROM Clause>
```
- 示例：`SELECT $1, $2 FROM ...`
- 表结构：类型为 `VARCHAR NULL` 的列
- 注意
  - `<col_position>` 从 1 开始

## 查询元数据

你还可以在查询中包含文件元数据，这对于跟踪数据血缘和调试非常有用：

```sql
SELECT METADATA$FILENAME, METADATA$FILE_ROW_NUMBER, $1, <FROM Clause>
(
    FILE_FORMAT => 'ndjson_query_format',
    PATTERN => '.*[.]ndjson'
);
```

对于支持的文件格式，可以使用以下文件级元数据字段：

| 文件元数据 | 类型 | 描述 |
| -------------------------- | ------- |--------------------------------------------------|
| `METADATA$FILENAME` | VARCHAR | 读取行的文件路径 |
| `METADATA$FILE_ROW_NUMBER` | INT | 文件内的行号（从 0 开始） |


**使用场景：**
- **数据血缘**：跟踪每条记录来自哪个源文件
- **调试**：按文件和行号识别有问题的记录
- **增量处理**：仅处理特定文件或文件内的范围

## 按文件格式分类的教程
- [查询 Parquet 文件](./00-querying-parquet.md) 
- [查询 ORC 文件](./05-querying-orc.md)
- [查询 NDJSON 文件](./03-querying-ndjson.md)
- [查询 Avro 文件](./04-querying-avro.md)
- [查询 CSV 文件](./01-querying-csv.md)
- [查询 TSV 文件](./02-querying-tsv.md)