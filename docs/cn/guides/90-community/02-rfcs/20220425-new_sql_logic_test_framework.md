---
title: 新SQL逻辑测试框架
description: 新SQL逻辑测试框架设计RFC。
---

## 背景

基本上所有健壮的数据库系统都需要在以下范围内进行测试：

1. 合理的单元测试高覆盖率。
2. 大量查询逻辑测试（**主要讨论**）。
3. 分布式系统相关行为测试。
4. 性能测试（ https://benchmark.databend.com/clickbench/release/hits.html ）

目前，我们的测试框架基于以下设计：

我们主要采用bendsql二进制客户端来测试查询逻辑，并在驱动兼容性部分覆盖了一些基本测试。

然而，当前的逻辑测试存在一些不足之处，需要改进：

1. 将二进制输出与结果文件进行比较无法扩展到其他协议。例如，`http_handler`有JSON输出格式，我们应该有指定的结果来覆盖这种情况。
2. 目前，我们测试的SQL文件同时覆盖多个语句，结果文件无法显示每个语句的结果。
3. 目前，我们没有为SQL逻辑测试提供错误处理。
4. 我们无法扩展SQL逻辑语句以包含排序、重试和其他逻辑。

## 详细设计

测试输入是SQL逻辑测试（ https://www.sqlite.org/sqllogictest/ ）的扩展版本。

该文件以称为测试脚本的领域特定语言表示，并支持不产生输出的SQL语句或故意产生错误的语句。

语句规范可以分为以下字段：

`statement ok`：SQL语句正确且预期输出成功。

例如：以下SQL将成功且无输出

```text
statement ok
create database if not exists db1;
```

`statement error <错误正则表达式>`：SQL语句输出预期为错误。

例如：以下SQL将产生错误消息`table db1.tbl1 does not exist`

```text
statement error table db1.tbl1 does not exist
create table db1.tbl1 (id int);
```

`query <期望的查询模式类型> <选项> <标签>`：SQL语句输出预期为成功且带有期望的结果。

`期望的查询模式类型`表示查询结果的模式类型。文档见https://github.com/gregrahn/sqllogictest/blob/master/about.wiki#test-script-format

- `I` 表示整数
- `F` 表示浮点数
- `R` 表示十进制
- `T` 表示文本或变体（JSON、时间戳等）。
- `B` 表示布尔值

`选项`是查询的选项列表，如排序、重试等。
`标签`允许查询首先匹配给定套件标签的结果，从而解决结果兼容性问题

例如：以下SQL将成功且输出表格

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

以下SQL配置首先匹配mysql标签，然后是默认标签

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