---
title: 带Schema的Stage
---

## 概述

stage 支持 `schema` 选项。

## 动机

目前，在从文件中查询/复制/插入数据时，我们通过以下两种方式获取 schema：

1. 使用目标表的 schema（用于复制/插入）。
2. 使用从数据推断的 schema（用于 stage_table_function）。

为了支持“加载时转换”，第一种方式无法使用。

推断的 schema 虽然方便，但有许多缺点（详见下文“推断 schema 的缺点”部分）。

## 指南级解释

基本形式：

```sql
SELECT c1, c2 + c1, trim(c2) from @my_stage(schema=(c1 int, c2 float, c3 string))
```

它可以用于支持“加载时转换”。

```sql
copy into my_table from (
    SELECT c1, c2 + c1, trim(c2)  FROM @my_stage(schema=(c1 int, c2 float, c3 string))
)
```

如果经常使用相同的 schema，用户可以为其创建表并使用表名。

```sql
SELECT  c1, c2 + c1, trim(c2)  FROM @my_stage(schema='db_name.table_name')
```

用户可以通过 `desc <table>` 了解数据，而不必每次都使用 `infer schema`。

## 参考级解释

```sql
SELECT <exprs> FROM @<stage>/'<uri>'(SCHEMA= (<schema> | "<table_name>"), ..)
```

## 理由和替代方案

### 推断 schema 的缺点

schema 推断依赖于被推断的文件，但数据可能不准确。

只能推断出粗略的 schema。

1. 对于 CSV/TSV，所有列都是 `STRING` 类型。
  - 用户只能使用列名 `$1`, `$2`，这在有很多列时不友好。
2. 对于 ndjson，所有列都是 `VARINT` 类型。
3. 即使对于 parquet，高级别类型的列（如字符串格式的 variant/datetime）也无法直接映射。

这导致转换的开销：在读取时反序列化比先读入 `TYPE1` 再转换为 `TYPE2` 更快。

推断 schema 本身的开销，至少需要两次操作：

1. 列出目录
2. 读取文件的元数据/头部。

限制了文件源：推断 schema 只能用于复制，不能用于流式插入。

### 替代方案

#### WITH_SCHEMA

```sql

SELECT <exprs> FROM @<stage>|'<uri>' WITH_SCHEMA <data_schema> 
```

缺点：与其他表或嵌套查询一起使用时难以阅读和解析，例如：

```sql
select * (SELECT <exprs> FROM @stage1 (format='json')  WITH_SCHEMA <data_schema> t) join my_table2
```

#### WITH_TRANSFORM

```sql
insert into my_table from @my_stage WITH_TRANSFORM  t.c1, t.c2 + 1 FROM t(c1 int, c2 float, c3 string)
```

缺点：仅适用于复制/插入，无法帮助 `stage table function`。

## 未来可能性

使用 `_` 忽略字段。例如：

```sql
SELECT c1,  c3   FROM @my_stage(schema=(c1 int, _ , c3 int))
```