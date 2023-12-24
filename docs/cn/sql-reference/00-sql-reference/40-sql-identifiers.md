---
title: SQL 标识符
sidebar_label: SQL 标识符
---

SQL 标识符是 Databend 中用于表示不同元素（如表、视图和数据库）的名称。

## 未引用和双引号标识符

未引用的标识符以字母（A-Z、a-z）或下划线（"\_"）开头，可以由字母、下划线、数字（0-9）或美元符号（“$”）组成。

```text title='示例：'
mydatabend
MyDatabend1
My$databend
_my_databend
```

双引号标识符可以包含各种字符，例如数字（0-9）、特殊字符（如句点（.）、单引号（'）、感叹号（!）、at 符号（@）、井号（#）、美元符号（$）、百分号（%）、插入符（^）和和号（&））、扩展 ASCII 和非 ASCII 字符，以及空格。

```text title='示例：'
"MyDatabend"
"my.databend"
"my databend"
"My 'Databend'"
"1_databend"
"$Databend"
```

请注意，使用双重反引号（``）或双引号（"）是等效的：

```text title='示例:'
`MyDatabend`
`my.databend`
`my databend`
`My 'Databend'`
`1_databend`
`$Databend`
```

## 标识符大小写规则

默认情况下，Databend 将未引用的标识符存储为小写形式，将双引号标识符存储为与输入相同的样子。换句话说，Databend 默认不区分对象名称（如数据库、表和列）的大小写。如果要让 Databend 区分大小写处理它们，请使用双引号引用。

:::note
Databend 允许您对标识符的大小写敏感性进行控制。有两个关键设置可用：
- unquoted_ident_case_sensitive：将此选项设置为 1 时，它将保留未引用标识符中字符的大小写，确保它们区分大小写。如果保持默认值 0，未引用的标识符将保持不区分大小写，转换为小写。
- quoted_ident_case_sensitive：通过将此选项设置为 0，您可以指示不保留双引号标识符中字符的大小写，使其不区分大小写。
:::

此示例演示了 Databend 在创建和列出数据库时如何处理标识符的大小写：

```sql
-- Create a database named "databend"
CREATE DATABASE databend;

-- Attempt to create a database named "Databend"
CREATE DATABASE Databend;

>> SQL Error [1105] [HY000]: DatabaseAlreadyExists. Code: 2301, Text = Database 'databend' already exists.

-- Create a database named "Databend"
CREATE DATABASE "Databend";

-- List all databases
SHOW DATABASES;

databases_in_default|
--------------------+
Databend            |
databend            |
default             |
information_schema  |
system              |
```

此示例演示了 Databend 如何处理表和列名的标识符大小写，突出显示了其默认情况下的区分大小写以及使用双引号来区分大小写不同的标识符：

```sql
-- Create a table named "databend"
CREATE TABLE databend (a INT);
DESC databend;

Field|Type|Null|Default|Extra|
-----+----+----+-------+-----+
a    |INT |YES |NULL   |     |

-- Attempt to create a table named "Databend"
CREATE TABLE Databend (a INT);

>> SQL Error [1105] [HY000]: TableAlreadyExists. Code: 2302, Text = Table 'databend' already exists.

-- Attempt to create a table with one column named "a" and the other one named "A"
CREATE TABLE "Databend" (a INT, A INT);

>> SQL Error [1105] [HY000]: BadArguments. Code: 1006, Text = Duplicated column name: a.

-- Double quote the column names
CREATE TABLE "Databend" ("a" INT, "A" INT);
DESC "Databend";

Field|Type|Null|Default|Extra|
-----+----+----+-------+-----+
a    |INT |YES |NULL   |     |
A    |INT |YES |NULL   |     |
```

## 字符串标识符

在 Databend 中，当处理文本和日期等字符串项时，将其置于单引号（'）中是必要的标准做法。


```sql
INSERT INTO weather VALUES ('San Francisco', 46, 50, 0.25, '1994-11-27');

SELECT 'Databend';

'databend'|
----------+
Databend  |

SELECT "Databend";

>> SQL Error [1105] [HY000]: SemanticError. Code: 1065, Text = error: 
  --> SQL:1:73
  |
1 | /* ApplicationName=DBeaver 23.2.0 - SQLEditor <Script-12.sql> */ SELECT "Databend"
  |                                                                         ^^^^^^^^^^ column Databend doesn't exist, do you mean 'Databend'?
```

默认情况下，Databend 使用的 SQL 方言是`PostgreSQL`：

```sql
SHOW SETTINGS LIKE '%sql_dialect%';

name       |value     |default   |level  |description                                                                      |type  |
-----------+----------+----------+-------+---------------------------------------------------------------------------------+------+
sql_dialect|PostgreSQL|PostgreSQL|SESSION|Sets the SQL dialect. Available values include "PostgreSQL", "MySQL", and "Hive".|String|
```

您可以将其更改为`MySQL`以启用双引号（`"`）：

```sql
SET sql_dialect='MySQL';

SELECT "demo";
+--------+
| 'demo' |
+--------+
| demo   |
+--------+
```