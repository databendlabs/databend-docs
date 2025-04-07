---
title: DESCRIBE TABLE
sidebar_position: 2
---

显示给定表中列的信息。等效于 [SHOW FIELDS](show-fields.md)。

:::tip
[SHOW COLUMNS](show-full-columns.md) 提供了关于表列的类似但更全面的信息。
:::

## 语法

```sql
DESC|DESCRIBE [TABLE] [ <database_name>. ]<table_name>
```

## 示例

```sql
CREATE TABLE books
  (
     price  FLOAT Default 0.00,
     pub_time DATETIME Default '1900-01-01',
     author VARCHAR
  );

DESC books; 

Field   |Type     |Null|Default                     |Extra|
--------+---------+----+----------------------------+-----+
price   |FLOAT    |YES |0                           |     |
pub_time|TIMESTAMP|YES |'1900-01-01 00:00:00.000000'|     |
author  |VARCHAR  |YES |NULL                        |     |
```