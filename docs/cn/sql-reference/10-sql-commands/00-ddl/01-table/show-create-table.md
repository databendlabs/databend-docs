---
title: 显示创建表
sidebar_position: 10
---

显示创建指定表的 CREATE TABLE 语句。

## 语法

```sql
SHOW CREATE TABLE [ <database_name>. ]table_name
```

## 示例

:::tip
numbers(N) - 一个用于测试的表，包含单个 `number` 列（UInt64），其中包含从 0 到 N-1 的整数。
:::

```sql
SHOW CREATE TABLE system.numbers;
+---------+--------------------------------------------------------------------+
| Table   | Create Table                                                       |
+---------+--------------------------------------------------------------------+
| numbers | CREATE TABLE `numbers` (
  `number` UInt64,
) ENGINE=SystemNumbers |
+---------+--------------------------------------------------------------------+
```