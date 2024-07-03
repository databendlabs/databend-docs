---
title: 新 SQL 逻辑测试框架
description: 新 SQL 逻辑测试框架设计 RFC。
---

## 背景

基本上，所有健壮的数据库系统都需要在以下范围内进行测试。

1. 合理的高级别单元测试覆盖率。
2. 一大套查询逻辑测试。（**主要讨论**）
3. 分布式系统相关行为测试。
4. 性能测试 (https://benchmark.databend.com/clickbench/release/hits.html)

目前，我们的测试框架基于以下设计。

我们主要采用 bendsql 二进制客户端来测试查询逻辑，并覆盖了一些基本的驱动兼容性测试。

然而，当前逻辑测试中存在一些不足之处，应该进行改进。

1. 从二进制输出到结果文件的比较，不能扩展到其他协议。例如 `http_handler` 有 json 输出格式，我们应该有指定的结果来覆盖这种情况。
2. 目前，我们测试的 sql 文件同时覆盖多个语句，结果文件不能显示每个语句的结果。
3. 目前，我们不为 sql 逻辑测试提供错误处理。
4. 我们无法用排序、重试和其他逻辑扩展 sql 逻辑语句。

## 详细设计

测试输入是 sql 逻辑测试的扩展版本(https://www.sqlite.org/sqllogictest/)

该文件用一种称为测试脚本的领域特定语言表示。它支持不生成输出的 sql 语句或故意有错误的语句。

语句规范可以分为以下几个字段

`statement ok`：sql 语句是正确的，输出预期成功。

例如：以下 sql 应该没有输出就可以成功

```text
statement ok
create database if not exists db1;
```

`statement error <error regex>`：sql 语句输出预期为错误。

例如：以下 sql 应该出错，错误消息为 `table db1.tbl1 does not exist`

```text
statement error table db1.tbl1 does not exist
create table db1.tbl1 (id int);
```

`query <desired_query_schema_type> <options> <labels>`：sql 语句输出预期成功并带有预期结果。

`desired_query_schema_type` 代表查询结果的模式类型。这在 https://github.com/gregrahn/sqllogictest/blob/master/about.wiki#test-script-format 中有文档说明

- `I` 代表整数
- `F` 代表浮点数
- `R` 代表小数
- `T` 代表文本或变体（json、时间戳等）。
- `B` 代表布尔值

`options` 是查询的选项列表，如排序、重试等。
`label` 可以允许查询首先匹配给定套件标签结果，解决了结果兼容性问题

例如：以下 sql 应该带有输出表

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

以下 sql 配置优先匹配 mysql 标签，然后是默认标签

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
