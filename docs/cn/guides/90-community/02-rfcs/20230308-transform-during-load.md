---
title: 加载时转换
---

## 概述

支持从Stage复制到表时进行转换。

## 动机

目前，我们支持Stage表函数，因此可以在从Stage插入表时进行转换。

```sql
insert into table1 from (select c1， c2 from @stage1/path/to/dir);
```

但这仍然缺少`COPY INTO`的一个功能：增量加载（记住已加载的文件）。

`COPY INTO <table>`目前仅支持`FROM <STAGE>`。

## 指南级解释

支持类似以下的复制操作：

```sql
COPY into table1 from (select c1， c2 from @stage1/path/to/dir where c3 > 1);
```

### 子查询部分的限制：

1. 仅包含一个**基表**。
2. 不允许聚合，因为每个插入的记录应属于某个文件。
3. 由于前两个限制，嵌套子查询是不必要的，我们可能会选择禁止它。

### 自动转换

如果子查询的输出表达式满足自动转换规则，则应将其转换为表的模式。

某些转换可以被优化掉。例如：

对于 `COPY into table1 from (select c1::string from @stage1/path/to/dir);`，其中c1是整数，
我们可以直接将c1解析为字符串。
如果c1的目标列也是整数，则可以去掉'::string'。

### 优化

投影和过滤：

1. 对于像Parquet这样的文件格式，列裁剪和过滤下推可以很好地工作。
2. 对于其他格式如CSV/TSV/NDJSON，有机会快速解析未使用的列，例如对于TSV，
   我们可以在解析完投影中的最后一个字段后直接跳到下一个`\n`。

## 参考级解释

```sql
COPY into <table> from (select <expr> from @<stage>/<path>(<options>) <alias> where <expr>);
```

## 理由和替代方案

一些其他功能可以用于“加载时转换”，但仅限于特定情况：

### 自动转换

如果源模式可以自动转换为目标模式，则不需要在SQL中进行显式转换。
现在，一些'cast'是由解析器实现的，只要用户提供了目标类型，如在[RFC: Stage With Schema](./20230308-transform-during-load.md)中所示
例如，时间戳类型解码器可能同时接受数字和字符串。

我们应稍后改进这一点。在此之前，用户可以使用此RFC中的方法来完成相同的功能。

### FileFormatOptions

例如，某些数据库对CSV文件格式有一个`TRIM`选项。但用户可能需要不同的变体

1. 修剪头部或尾部的空格？还是两者都修剪？
2. 在引号内还是引号外？
3. 应用于某些列？空格对某些列可能是有意义的。