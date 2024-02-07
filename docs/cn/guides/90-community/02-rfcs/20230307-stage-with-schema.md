---
title: 支持带有模式的阶段
---

## 摘要

阶段支持 `schema` 选项。

## 动机

当前，当从文件中查询/复制/插入数据时，我们通过两种方式获取模式：

1. 使用目标表的模式（在复制/插入中使用）。
2. 使用从数据中推断出的模式（在 stage_table_function 中使用）。

为了支持“加载时转换”，第一种方式不能使用。

推断模式虽然方便，但有许多缺点（在下面的“推断模式的缺点”部分详细说明）。

## 指南级解释

基本形式：

```sql
SELECT c1, c2 + c1, trim(c2) from @my_stage(schema=(c1 int, c2 float, c3 string))
```

它可以用来支持“加载时转换”。

```sql
copy into my_table from (
    SELECT c1, c2 + c1, trim(c2)  FROM @my_stage(schema=(c1 int, c2 float, c3 string))
)
```

如果同一个模式经常被使用，用户可以为其创建表并使用表名。

```sql
SELECT  c1, c2 + c1, trim(c2)  FROM @my_stage(schema='db_name.table_name')
```

并且用户可以通过 `desc <table>` 而不是每次都 `infer schema` 来了解数据。

## 参考级解释

```sql
SELECT <exprs> FROM @<stage>/'<uri>'(SCHEMA= (<schema> | "<table_name>"), ..)
```

## 理由和替代方案

### 推断模式的缺点

错误模式的风险：模式推断依赖于选择进行推断的文件，但数据可能是错误的。

只能推断出大致的模式。

1. 对于 CSV/TSV，所有列都是 `STRING` 类型。
  - 当有很多列时，用户只能使用列名 `$1`、`$2`，这不够友好。
2. 对于 ndjson，所有列都是 `VARINT` 类型。
3. 即使对于 parquet，像 variant/datetime 这样的高级类型列以字符串格式也不能直接映射。

这导致了转换的开销：读取时反序列化比读入 `TYPE1` 然后转换为 `TYPE2` 更快。

推断模式本身的开销，至少有两个操作：

1. 列出目录
2. 读取文件的元数据/头部。

限制到文件源：推断模式只能在复制中使用，不能在流式插入中使用。

### 替代方案

#### WITH_SCHEMA 

```sql

SELECT <exprs> FROM @<stage>|'<uri>' WITH_SCHEMA <data_schema> 
```

缺点：当与其他表或嵌套查询一起使用时，阅读和解析困难，例如：

```sql
select * (SELECT <exprs> FROM @stage1 (format='json')  WITH_SCHEMA <data_schema> t) join my_table2
```

#### WITH_TRANSFORM

```sql
insert into my_table from @my_stage WITH_TRANSFORM  t.c1, t.c2 + 1 FROM t(c1 int, c2 float, c3 string)
```

缺点：只能在复制/插入中应用，不能帮助 `stage table function`。

## 未来可能性

忽略带有 `_` 的字段。例如：

```sql
SELECT c1,  c3   FROM @my_stage(schema=(c1 int, _ , c3 int))
```