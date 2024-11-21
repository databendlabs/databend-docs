---
title: SQL标识符
sidebar_label: SQL标识符
---

SQL标识符是用于Databend中不同元素的名称，例如表、视图和数据库。

## 未引用的 & 双引号标识符

未引用的标识符以字母（A-Z，a-z）或下划线（“_”）开头，可以由字母、下划线、数字（0-9）或美元符号（“$”）组成。

```text title='示例:'
mydatabend
MyDatabend1
My$databend
_my_databend
```

双引号标识符可以包含广泛的字符，例如数字（0-9）、特殊字符（如句号（.）、单引号（'）、感叹号（!）、@符号（@）、井号（#）、美元符号（$）、百分号（%）、插入符号（^）和与号（&））、扩展ASCII和非ASCII字符，以及空白字符。

```text title='示例:'
"MyDatabend"
"my.databend"
"my databend"
"My 'Databend'"
"1_databend"
"$Databend"
```

请注意，使用双反引号（``）或双引号（"）是等效的：

```text title='示例:'
`MyDatabend`
`my.databend`
`my databend`
`My 'Databend'`
`1_databend`
`$Databend`
```

## 标识符大小写规则

Databend默认将未引用的标识符存储为小写，并将双引号标识符按输入存储。换句话说，Databend处理对象名称（如数据库、表和列）时，默认情况下不区分大小写。如果您希望Databend区分大小写，请使用双引号。

:::note
Databend允许您控制标识符的大小写敏感性。有两个关键设置可用：

- unquoted_ident_case_sensitive: 当设置为1时，此选项保留未引用标识符的字符大小写，确保它们区分大小写。如果保留默认值0，未引用的标识符将保持不区分大小写，转换为小写。

- quoted_ident_case_sensitive: 通过将此选项设置为0，您可以指示双引号标识符不应保留字符大小写，使其不区分大小写。
:::

此示例演示了Databend在创建和列出数据库时如何处理标识符的大小写：

```sql
-- 创建名为 "databend" 的数据库
CREATE DATABASE databend;

-- 尝试创建名为 "Databend" 的数据库
CREATE DATABASE Databend;

>> SQL Error [1105] [HY000]: DatabaseAlreadyExists. Code: 2301, Text = Database 'databend' already exists.

-- 创建名为 "Databend" 的数据库
CREATE DATABASE "Databend";

-- 列出所有数据库
SHOW DATABASES;

databases_in_default|
--------------------+
Databend            |
databend            |
default             |
information_schema  |
system              |
```

此示例演示了Databend如何处理表和列名称的标识符大小写，默认情况下区分大小写，并使用双引号来区分大小写不同的标识符：

```sql
-- 创建名为 "databend" 的表
CREATE TABLE databend (a INT);
DESC databend;

Field|Type|Null|Default|Extra|
-----+----+----+-------+-----+
a    |INT |YES |NULL   |     |

-- 尝试创建名为 "Databend" 的表
CREATE TABLE Databend (a INT);

>> SQL Error [1105] [HY000]: TableAlreadyExists. Code: 2302, Text = Table 'databend' already exists.

-- 尝试创建一个表，其中一列名为 "a"，另一列名为 "A"
CREATE TABLE "Databend" (a INT, A INT);

>> SQL Error [1105] [HY000]: BadArguments. Code: 1006, Text = Duplicated column name: a.

-- 双引号列名
CREATE TABLE "Databend" ("a" INT, "A" INT);
DESC "Databend";

Field|Type|Null|Default|Extra|
-----+----+----+-------+-----+
a    |INT |YES |NULL   |     |
A    |INT |YES |NULL   |     |
```

## 字符串标识符

在Databend中，当管理字符串项（如文本和日期）时，必须将它们用单引号（'）括起来，这是标准做法。

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

默认情况下，Databend SQL方言为 `PostgreSQL`：

```sql
SHOW SETTINGS LIKE '%sql_dialect%';

name       |value     |default   |level  |description                                                                      |type  |
-----------+----------+----------+-------+---------------------------------------------------------------------------------+------+
sql_dialect|PostgreSQL|PostgreSQL|SESSION|Sets the SQL dialect. Available values include "PostgreSQL", "MySQL", and "Hive".|String|
```

您可以将其更改为 `MySQL` 以启用双引号（`"`）：

```sql
SET sql_dialect='MySQL';

SELECT "demo";
+--------+
| 'demo' |
+--------+
| demo   |
+--------+
```