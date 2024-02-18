---
title: SHOW CREATE TABLE
sidebar_position: 10
---

Shows the CREATE TABLE statement that creates the named table.

## Syntax

```sql
SHOW CREATE TABLE [ <database_name>. ]table_name
```

## Examples

:::tip
numbers(N) – A table for test with the single `number` column (UInt64) that contains integers from 0 to N-1.
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
