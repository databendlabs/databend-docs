---
title: 加载时转换
---

## 概要

支持从 Stage 复制到表时进行转换。

## 动机

目前，我们支持 Stage 表函数，因此我们可以在从 Stage **插入**到表时进行转换。

```sql
insert into table1 from (select c1， c2 from @stage1/path/to/dir);
```

但这仍然缺少 `COPY INTO` 的一个功能：增量加载（记住已加载的文件）。

`COPY INTO <table>` 现在仅支持 `FROM <STAGE>`。

## 指导性解释

支持像这样的 copy into：

```sql
COPY into table1 from (select c1， c2 from @stage1/path/to/dir where c3 > 1);
```

### 对子查询部分的限制：

1. 仅包含一个**基本表**。
2. 不允许聚合，因为插入的每个记录都应属于某个文件。
3. 由于先前的 2 个限制，可以合理地说不需要嵌套子查询，我们可以选择禁止它。

### 自动转换

如果满足 auto_cast_rule，则子查询的输出表达式应转换为表的 schema。

可以优化掉一些转换。例如：

对于 `COPY into table1 from (select c1::string from @stage1/path/to/dir);`，其中 c1 是 int，
我们可以直接将 c1 解析为字符串。
如果 c1 的目标列也是 int，则可以删除 '::string'。

### 优化

投影和过滤：

1. 对于像 Parquet 这样的文件格式，列剪裁和过滤下推可以很好地工作。
2. 对于其他格式，如 CSV/TSV/NDJSON，有机会快速解析未使用的列，例如对于 TSV，
   我们可以在解析完投影中的最后一个字段后直接跳转到下一个 `\n`。

## 参考级解释

```sql
COPY into <table> from (select <expr> from @<stage>/<path>(<options>) <alias> where <expr>);
```

## 原理和替代方案

一些其他功能可用于“加载时转换”，但仅在有限的情况下：

### 自动转换

如果源 schema 可以自动转换为目标 schema，则不应需要 SQL 中的显式转换。
现在，一些“转换”由解析器实现，只要使用提供目标类型，如 [RFC: Stage With Schema](./20230308-transform-during-load.md) 中所示
例如，Timestamp Type 解码器可以接受数字和字符串。

我们应该稍后改进这一点。在此之前，用户可以使用此 RFC 中的方法来完成相同的功能。

### FileFormatOptions

例如，某些数据库对 CSV 文件格式有一个选项 `TRIM`。但用户可能需要不同的变体

1. 修剪开头或结尾空格？还是两者都修剪？
2. 在引号内还是在引号外？
3. 应用于某些列？空格对于某些列可能是有意义的。
