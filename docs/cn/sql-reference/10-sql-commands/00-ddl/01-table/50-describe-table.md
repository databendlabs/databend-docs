---
title: 描述表
sidebar_position: 2
---

显示给定表中列的信息。等同于 [显示字段](show-fields.md)。

:::tip
[显示列](show-full-columns.md) 提供了类似但更多关于表列的信息。
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