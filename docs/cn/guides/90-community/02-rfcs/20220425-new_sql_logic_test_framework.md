```markdown
---
title: New SQL Logic Test Framework
description: New sql logic test framework design RFC.
---

## Background

基本上，所有健壮的数据库系统都需要在以下范围内进行测试。

1. 合理的高水平单元测试覆盖率。
2. 大量的查询逻辑测试。（**主要讨论**）
3. 分布式系统相关行为测试。
4. 性能测试 [https://benchmark.databend.com/clickbench/release/hits.html](https://benchmark.databend.com/clickbench/release/hits.html)

目前，我们的测试框架基于以下设计。

我们主要采用 bendsql 二进制客户端来测试查询逻辑，并覆盖驱动程序兼容性部分的一些基本测试。

但是，当前的逻辑测试存在一些应该改进的缺点。

1. 将二进制文件的输出与结果文件进行比较不能扩展到其他协议。例如，`http_handler` 具有 json 输出格式，我们应该指定结果来覆盖这种情况。
2. 目前，我们测试 sql 文件同时覆盖多个语句，并且结果文件无法显示每个语句的结果
3. 目前，我们不为 sql 逻辑测试提供错误处理
4. 我们无法使用排序、重试和其他逻辑来扩展 sql 逻辑语句。

## Detailed design

测试输入是 sql 逻辑测试的扩展版本 [https://www.sqlite.org/sqllogictest/](https://www.sqlite.org/sqllogictest/)

该文件以一种特定领域的语言（称为测试脚本）表示。它支持生成无输出的 sql 语句或有意出错的语句

语句规范可以分为以下字段

`statement ok`：sql 语句正确，并且输出预期成功。

例如：以下 sql 语句可以正常执行，没有输出

```text
statement ok
create database if not exists db1;
```

`statement error <error regex>`：sql 语句输出预期错误。

例如：以下 sql 语句会出错，错误消息为 `table db1.tbl1 does not exist`

```text
statement error table db1.tbl1 does not exist
create table db1.tbl1 (id int);
```

`query <desired_query_schema_type> <options> <labels>`：sql 语句输出预期成功，并具有所需的结果。

`desired_query_schema_type` 表示查询结果的模式类型。 详细信息请参考 https://github.com/gregrahn/sqllogictest/blob/master/about.wiki#test-script-format

- `I` 表示整数
- `F` 表示浮点数
- `R` 表示小数
- `T` 表示文本或变体（json、时间戳等）。
- `B` 表示布尔值

`options` 是查询的选项列表，例如 sort、retry 等。
`label` 允许查询首先匹配给定的套件标签结果，从而解决结果兼容性问题

例如：以下 sql 语句可以正常执行，并输出表

```text
query III
select number, number + 1, number + 999 from numbers(10);
----
     0     1   999
     1     2  1000
     2     3  1001
     3     4  1002
     4     5  1003
     5     6  1004
     6     7  1005
     7     8  1006
     8     9  1007
     9    10  1008
```

以下 sql 配置首先匹配 mysql 标签，然后匹配默认标签

```text
query III label(mysql)
select number, number + 1, number + 999 from numbers(10);
----
     0     1   999
     1     2  1000
     2     3  1001
     3     4  1002
     4     5  1003
     5     6  1004
     6     7  1005
     7     8  1006
     8     9  1007
     9    10  1008.0

----  mysql
     0     1   999
     1     2  1000
     2     3  1001
     3     4  1002
     4     5  1003
     5     6  1004
     6     7  1005
     7     8  1006
     8     9  1007
     9    10  1008
```
