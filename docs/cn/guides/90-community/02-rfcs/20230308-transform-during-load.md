---
title: 在加载时转换
---

## 摘要

支持在从阶段复制到表时进行转换。

## 动机

目前，我们支持阶段表功能，因此我们可以在从阶段到表**插入**时进行转换。

```sql
insert into table1 from (select c1， c2 from @stage1/path/to/dir);
```

但这仍然缺少`COPY INTO`的一个功能：增量加载（记住已加载的文件）。

`COPY INTO <table>`现在只支持`FROM <STAGE>`。

## 指南级解释

支持像这样的复制进入：

```sql
COPY into table1 from (select c1， c2 from @stage1/path/to/dir where c3 > 1);
```

### 子查询部分的限制：

1. 只包含一个**基表**。
2. 不允许聚合，因为每条插入的记录应该属于某个文件。
3. 由于前两个限制，可以合理地认为不需要嵌套子查询，我们可能选择禁止它。

### 自动转换

子查询的输出表达式应该转换为表的模式，如果它满足auto_cast_rule。

一些转换可以被优化掉。例如：

对于`COPY into table1 from (select c1::string from @stage1/path/to/dir);`其中c1是int，
我们可以直接将c1解析为字符串。
如果c1的目标列也是int，'::string'可以被删除。

### 优化

投影和过滤：

1. 对于像parquet这样的文件格式，列剪裁和过滤下推可以很好地工作。
2. 对于其他格式如CSV/TSV/NDJSON，有机会快速解析未使用的列，例如对于TSV，
在解析完投影中的最后一个字段后，我们可以直接跳到下一个`\n`。

## 参考级解释

```sql
COPY into <table> from (select <expr> from @<stage>/<path>(<options>) <alias> where <expr>);
```

## 理由和替代方案

一些其他功能可以用于“加载时转换”，但只在有限的情况下：

### 自动转换

如果源模式可以自动转换为目标模式，则不应要求在SQL中明确进行转换。
现在，一些'转换'是由解析器实现的，只要用户提供了目标类型，就像在[RFC: 带模式的阶段](./20230308-transform-during-load.md)中一样
例如，时间戳类型解码器可能接受数字和字符串。

我们应该以后改进这一点。在此之前，用户可以使用本RFC中的方法完成相同的功能。

### FileFormatOptions

例如，一些数据库对CSV文件格式有一个`TRIM`选项。但用户可能需要它的不同变体

1. 剪裁开头或尾部空格？还是两者都有？
2. 引号内还是引号外？
3. 应用于某些列？对于某些列，空白可能是有意义的。