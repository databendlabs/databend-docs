---
title: INFER_SCHEMA
---

自动检测文件元数据模式并获取列定义。

:::caution

`infer_schema` 目前仅支持 Parquet 文件格式。

:::

## 语法

```sql
INFER_SCHEMA(
  LOCATION => '{ internalStage | externalStage }'
  [ PATTERN => '<regex_pattern>']
)
```

其中：

### internalStage

```sql
internalStage ::= @<internal_stage_name>[/<path>]
```

### externalStage

```sql
externalStage ::= @<external_stage_name>[/<path>]
```

### PATTERN = 'regex_pattern'

一个基于 [PCRE2](https://www.pcre.org/current/doc/html/) 的正则表达式模式字符串，用单引号括起来，指定要匹配的文件名。点击[这里](#loading-data-with-pattern-matching)查看示例。关于 PCRE2 语法，请参见 http://www.pcre.org/current/doc/html/pcre2syntax.html。

## 示例

在 stage 中生成一个 Parquet 文件：

```sql
CREATE STAGE infer_parquet FILE_FORMAT = (TYPE = PARQUET);
COPY INTO @infer_parquet FROM (SELECT * FROM numbers(10)) FILE_FORMAT = (TYPE = PARQUET);
```

```sql
LIST @infer_parquet;
+-------------------------------------------------------+------+------------------------------------+-------------------------------+---------+
| name                                                  | size | md5                                | last_modified                 | creator |
+-------------------------------------------------------+------+------------------------------------+-------------------------------+---------+
| data_e0fd9cba-f45c-4c43-aa07-d6d87d134378_0_0.parquet |  258 | "7DCC9FFE04EA1F6882AED2CF9640D3D4" | 2023-02-09 05:21:52.000 +0000 | NULL    |
+-------------------------------------------------------+------+------------------------------------+-------------------------------+---------+
```

### `infer_schema`

```sql
SELECT * FROM INFER_SCHEMA(location => '@infer_parquet/data_e0fd9cba-f45c-4c43-aa07-d6d87d134378_0_0.parquet');
+-------------+-----------------+----------+----------+
| column_name | type            | nullable | order_id |
+-------------+-----------------+----------+----------+
| number      | BIGINT UNSIGNED |        0 |        0 |
+-------------+-----------------+----------+----------+
```

### `infer_schema` 带模式匹配

```sql
SELECT * FROM infer_schema(location => '@infer_parquet/', pattern => '.*parquet');
+-------------+-----------------+----------+----------+
| column_name | type            | nullable | order_id |
+-------------+-----------------+----------+----------+
| number      | BIGINT UNSIGNED |        0 |        0 |
+-------------+-----------------+----------+----------+
```

### 从 Parquet 文件创建表

`infer_schema` 只能显示 Parquet 文件的模式，不能从它创建表。

要从 Parquet 文件创建表：

```sql
CREATE TABLE mytable AS SELECT * FROM @infer_parquet/ (pattern=>'.*parquet') LIMIT 0;

DESC mytable;
+--------+-----------------+------+---------+-------+
| Field  | Type            | Null | Default | Extra |
+--------+-----------------+------+---------+-------+
| number | BIGINT UNSIGNED | NO   | 0       |       |
+--------+-----------------+------+---------+-------+
```