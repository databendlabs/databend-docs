---
title: SHOW CREATE TABLE
sidebar_position: 10
---

显示创建指定表的CREATE TABLE语句。

## 语法

```sql
SHOW CREATE TABLE [ <database_name>. ]table_name
```

## 示例

:::tip
numbers(N) – 一个用于测试的表，包含单个 `number` 列（UInt64），包含从0到N-1的整数。
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