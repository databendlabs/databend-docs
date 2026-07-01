---
title: SQL 标识符
sidebar_label: SQL 标识符
---

SQL 标识符是用于 Databend 中不同元素的名称，例如表、视图和数据库。

## 未引用和双引号标识符

未引用的标识符以字母（A-Z、a-z）或下划线（“_”）开头，可以包含字母、下划线、数字（0-9）或美元符号（“$”）。

```text title='Examples:'
mydatabend
MyDatabend1
My$databend
_my_databend
```

双引号标识符可以包含各种字符，例如数字（0-9）、特殊字符（如句点（.）、单引号（'）、感叹号（!）、at 符号（@）、数字符号（#）、美元符号（$）、百分号（%）、插入符号（^）和 & 符号），扩展 ASCII 和非 ASCII 字符，以及空格。

```text title='Examples:'
"MyDatabend"
"my.databend"
"my databend"
"My 'Databend'"
"1_databend"
"$Databend"
```

请注意，使用双反引号 (``) 或双引号 (") 是等效的：

```text title='Examples:'
`MyDatabend`
`my.databend`
`my databend`
`My 'Databend'`
`1_databend`
`$Databend`
```

## 标识符大小写规则

默认情况下，Databend 以小写形式存储未引用的标识符，并按输入的方式存储双引号标识符。换句话说，Databend 将对象名称（如数据库、表和列）视为不区分大小写。 如果希望 Databend 将它们视为区分大小写，请使用双引号将其引起来。

:::note
默认情况下，Databend 采用 PostgreSQL 风格的标识符大小写规则：未加引号的标识符会被折叠为小写，而双引号标识符则保留原始大小写并区分大小写。这一行为由两个设置控制：

- `unquoted_ident_case_sensitive`：默认值为 `0`，即未引用标识符不区分大小写，并被折叠为小写。将其设置为 `1` 时，保留未引用标识符的大小写，使其区分大小写。

- `quoted_ident_case_sensitive`：默认值为 `1`，即双引号标识符保留字符大小写、区分大小写。将其设置为 `0` 时，双引号标识符不区分大小写。

如果您希望使用 MySQL 风格、无论是否加引号都不区分大小写的行为，可以将 `unquoted_ident_case_sensitive` 和 `quoted_ident_case_sensitive` 都设置为 `0`。
:::

### 为什么 `SELECT *` 能成功，而 `SELECT <列名>` 却失败

一个常见的困惑来自这样的表：它的列是用保留大小写的引号（双引号或反引号）创建的，例如 `"Employee_ID"`。在默认设置下，`SELECT *` 能正常返回数据，但按列名引用时，无论大小写怎么写都会失败：

```sql
-- 创建时保留了列名大小写
CREATE TABLE xxxTable ("Employee_ID" INT, "Department" VARCHAR);
INSERT INTO xxxTable VALUES (1, 'Eng');

-- 成功：没有按名称引用任何列
SELECT * FROM xxxTable;

-- 失败：未引用的列名被折叠为小写（employee_id / department），
-- 与存储的 "Employee_ID" / "Department" 不匹配
SELECT Employee_ID FROM xxxTable;
SELECT employee_id FROM xxxTable;

-- 成功：双引号保留了大小写，与存储的列名匹配
SELECT "Employee_ID" FROM xxxTable;
```

这是因为 `unquoted_ident_case_sensitive` 默认值为 `0`，所以 `Employee_ID` 和 `employee_id` 都会被解析为 `employee_id`，而该列并不存在。要确认列名的实际大小写，可以运行 `DESC xxxTable;` 或 `SHOW CREATE TABLE xxxTable;`。

为避免此问题，您可以用双引号并按创建时的确切大小写引用列名；更推荐的做法是，在创建数据库、表和列时只使用小写字母、数字和下划线（不加引号）。

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

此示例演示了 Databend 如何处理表和列名称的标识符大小写，突出显示了其默认的大小写敏感性以及使用双引号来区分大小写不同的标识符：

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

在 Databend 中，当管理文本和日期等字符串项时，必须按照标准做法将它们括在单引号 (') 中。

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

默认情况下，Databend SQL 方言是 `PostgreSQL`：

```sql
SHOW SETTINGS LIKE '%sql_dialect%';

name       |value     |default   |level  |description                                                                      |type  |
-----------+----------+----------+-------+---------------------------------------------------------------------------------+------+
sql_dialect|PostgreSQL|PostgreSQL|SESSION|Sets the SQL dialect. Available values include "PostgreSQL", "MySQL", and "Hive".|String|
```

您可以将其更改为 `MySQL` 以启用双引号 (`"`)：

```sql
SET sql_dialect='MySQL';

SELECT "demo";
+--------+
| 'demo' |
+--------+
| demo   |
+--------+
```