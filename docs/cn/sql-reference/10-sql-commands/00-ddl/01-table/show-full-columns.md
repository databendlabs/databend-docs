---
title: SHOW COLUMNS
sidebar_position: 13
---

显示指定表中的列信息。

:::tip
[DESCRIBE TABLE](50-describe-table.md) 提供了类似但信息较少的表列信息。
:::

## 语法

```sql
SHOW  [ FULL ] COLUMNS
    {FROM | IN} tbl_name
    [ {FROM | IN} db_name ]
    [ LIKE '<pattern>' | WHERE <expr> ]
```

当包含可选关键字 FULL 时，Databend 会将表中每一列的排序规则、权限和注释信息添加到结果中。

## 示例

```sql
CREATE TABLE books
  (
     price  FLOAT Default 0.00,
     pub_time DATETIME Default '1900-01-01',
     author VARCHAR
  ); 

SHOW COLUMNS FROM books FROM default;

Field   |Type     |Null|Default     |Extra|Key|
--------+---------+----+------------+-----+---+
author  |VARCHAR  |NO  |            |     |   |
price   |FLOAT    |NO  |0.00        |     |   |
pub_time|TIMESTAMP|NO  |'1900-01-01'|     |   |

SHOW FULL COLUMNS FROM books;

Field   |Type     |Null|Default     |Extra|Key|Collation|Privileges|Comment|
--------+---------+----+------------+-----+---+---------+----------+-------+
author  |VARCHAR  |NO  |            |     |   |         |          |       |
price   |FLOAT    |NO  |0.00        |     |   |         |          |       |
pub_time|TIMESTAMP|NO  |'1900-01-01'|     |   |         |          |       | 

SHOW FULL COLUMNS FROM books LIKE 'a%'

Field |Type   |Null|Default|Extra|Key|Collation|Privileges|Comment|
------+-------+----+-------+-----+---+---------+----------+-------+
author|VARCHAR|NO  |       |     |   |         |          |       |
```