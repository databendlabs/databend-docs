---
title: SHOW FIELDS
sidebar_position: 12
---

显示给定表中关于列的信息。等同于 [DESCRIBE TABLE](50-describe-table.md)。

:::tip
[SHOW COLUMNS](show-full-columns.md) 提供了类似但更全面的表列信息。
:::

## 语法

```sql
SHOW FIELDS FROM [ <database_name>. ]<table_name>
```

## 示例

```sql
CREATE TABLE books
  (
     price  FLOAT Default 0.00,
     pub_time DATETIME Default '1900-01-01',
     author VARCHAR
  );

SHOW FIELDS FROM books; 

Field   |Type     |Null|Default                     |Extra|
--------+---------+----+----------------------------+-----+
price   |FLOAT    |YES |0                           |     |
pub_time|TIMESTAMP|YES |'1900-01-01 00:00:00.000000'|     |
author  |VARCHAR  |YES |NULL                        |     |
```