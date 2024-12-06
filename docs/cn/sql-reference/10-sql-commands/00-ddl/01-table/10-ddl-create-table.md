---
title: 创建表
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.666"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='COMPUTED COLUMN'/>

创建表是许多数据库中最复杂的操作之一，因为您可能需要：

* 手动指定引擎
* 手动指定索引
* 甚至指定数据分区或数据分片

Databend旨在通过设计变得易于使用，并且在创建表时不需要任何这些操作。此外，CREATE TABLE语句提供了这些选项，使您在各种场景中创建表变得更加容易：

- [CREATE TABLE](#create-table): 从头开始创建一个表。
- [CREATE TABLE ... LIKE](#create-table--like): 创建一个与现有表具有相同列定义的表。
- [CREATE TABLE ... AS](#create-table--as): 创建一个表并使用SELECT查询的结果插入数据。

另请参阅：

- [CREATE TEMP TABLE](10-ddl-create-temp-table.md)
- [CREATE TRANSIENT TABLE](10-ddl-create-transient-table.md)
- [CREATE EXTERNAL TABLE](10-ddl-create-table-external-location.md)

## CREATE TABLE

```sql
CREATE [ OR REPLACE ] TABLE [ IF NOT EXISTS ] [ <database_name>. ]<table_name>
(
    <column_name> <data_type> [ NOT NULL | NULL ] 
                              [ { DEFAULT <expr> } ] 
                              [ AS (<expr>) STORED | VIRTUAL ]
                              [ COMMENT '<comment>' ],
    <column_name> <data_type> ...
    ...
)
```
:::note
- 有关Databend中可用的数据类型，请参阅[数据类型](../../../00-sql-reference/10-data-types/index.md)。

- Databend建议在命名列时尽量避免使用特殊字符。然而，在某些情况下如果需要特殊字符，别名应使用反引号括起来，例如：CREATE TABLE price(\`$CA\` int);

- Databend会自动将列名转换为小写。例如，如果您将列命名为*Total*，它将在结果中显示为*total*。
:::


## CREATE TABLE ... LIKE

创建一个与现有表具有相同列定义的表。现有表的列名、数据类型及其非空约束将被复制到新表中。

语法：
```sql
CREATE TABLE [IF NOT EXISTS] [db.]table_name
LIKE [db.]origin_table_name
```

此命令不包括原始表中的任何数据或属性（如`CLUSTER BY`、`TRANSIENT`和`COMPRESSION`），而是使用默认系统设置创建一个新表。

:::note 解决方法
- 在使用此命令创建新表时，可以显式指定`TRANSIENT`和`COMPRESSION`。例如，

```sql
create transient table t_new like t_old;

create table t_new compression='lz4' like t_old;
```
:::

## CREATE TABLE ... AS

创建一个表并使用SELECT命令计算的数据填充它。

语法：
```sql
CREATE TABLE [IF NOT EXISTS] [db.]table_name
AS SELECT query
```

此命令不包括原始表中的任何属性（如CLUSTER BY、TRANSIENT和COMPRESSION），而是使用默认系统设置创建一个新表。

:::note 解决方法
- 在使用此命令创建新表时，可以显式指定`TRANSIENT`和`COMPRESSION`。例如，

```sql
create transient table t_new as select * from t_old;

create table t_new compression='lz4' as select * from t_old;
```
:::

## 列可空性

默认情况下，**Databend中的所有列都是可空的(NULL)**。如果您需要一个不允许NULL值的列，请使用NOT NULL约束。有关更多信息，请参阅[NULL值和NOT NULL约束](../../../00-sql-reference/10-data-types/index.md)。

## 默认值

```sql
DEFAULT <expr>
```
指定在通过`INSERT`或`CREATE TABLE AS SELECT`语句未指定值时插入到列中的默认值。

例如：

```sql
CREATE TABLE t_default_value(a TINYINT UNSIGNED, b VARCHAR DEFAULT 'b');
```

描述`t_default_value`表：

```sql
DESC t_default_value;

Field|Type            |Null|Default|Extra|
-----+----------------+----+-------+-----+
a    |TINYINT UNSIGNED|YES |NULL   |     |
b    |VARCHAR         |YES |'b'    |     |
```

插入一个值：

```sql
INSERT INTO T_default_value(a) VALUES(1);
```

检查表值：

```sql
SELECT * FROM t_default_value;
+------+------+
| a    | b    |
+------+------+
|    1 | b    |
+------+------+
```

## 计算列

计算列是使用表中其他列的标量表达式生成的列。当计算中使用的任何列中的数据更新时，计算列将自动重新计算其值以反映更新。

Databend支持两种类型的计算列：存储和虚拟。存储计算列在数据库中物理存储，并占用存储空间，而虚拟计算列不物理存储，其值在访问时动态计算。

Databend支持两种创建计算列的语法选项：一种使用`AS (<expr>)`，另一种使用`GENERATED ALWAYS AS (<expr>)`。两种语法都允许指定计算列是存储还是虚拟。

```sql
CREATE TABLE [IF NOT EXISTS] [db.]table_name
(
    <column_name> <data_type> [ NOT NULL | NULL] AS (<expr>) STORED | VIRTUAL,
    <column_name> <data_type> [ NOT NULL | NULL] AS (<expr>) STORED | VIRTUAL,
    ...
)

CREATE TABLE [IF NOT EXISTS] [db.]table_name
(
    <column_name> <data_type> [NOT NULL | NULL] GENERATED ALWAYS AS (<expr>) STORED | VIRTUAL,
    <column_name> <data_type> [NOT NULL | NULL] GENERATED ALWAYS AS (<expr>) STORED | VIRTUAL,
    ...
)
```

以下是创建存储计算列的示例：每当“price”或“quantity”列的值更新时，“total_price”列将自动重新计算并更新其存储值。

```sql
CREATE TABLE IF NOT EXISTS products (
  id INT,
  price FLOAT64,
  quantity INT,
  total_price FLOAT64 AS (price * quantity) STORED
);
```

以下是创建虚拟计算列的示例：“full_name”列根据“first_name”和“last_name”列的当前值动态计算。它不占用额外的存储空间。每当访问“first_name”或“last_name”值时，“full_name”列将被计算并返回。

```sql
CREATE TABLE IF NOT EXISTS employees (
  id INT,
  first_name VARCHAR,
  last_name VARCHAR,
  full_name VARCHAR AS (CONCAT(first_name, ' ', last_name)) VIRTUAL
);
```

:::tip 存储还是虚拟？
在选择存储计算列和虚拟计算列时，请考虑以下因素：

- 存储空间：存储计算列占用表中的额外存储空间，因为它们的计算值是物理存储的。如果您有有限的数仓空间或希望最小化存储使用，虚拟计算列可能是一个更好的选择。

- 实时更新：存储计算列在依赖列更新时立即更新其计算值。这确保了在查询时始终拥有最新的计算值。虚拟计算列则在查询时动态计算其值，这可能会稍微增加处理时间。

- 数据完整性和一致性：存储计算列在写操作时立即维护数据一致性，因为它们的计算值在写操作时更新。虚拟计算列则在查询时动态计算其值，这意味着在写操作和后续查询之间可能会有短暂的差异。
:::

## MySQL兼容性

Databend的语法与MySQL的主要区别在于数据类型和一些特定的索引提示。

## 示例

### 创建表

创建一个表并为列指定默认值（在本例中，`genre`列的默认值为'General'）：

```sql
CREATE TABLE books (
    id BIGINT UNSIGNED,
    title VARCHAR,
    genre VARCHAR DEFAULT 'General'
);
```

描述表以确认结构和`genre`列的默认值：

```sql
DESC books;
+-------+-----------------+------+---------+-------+
| Field | Type            | Null | Default | Extra |
+-------+-----------------+------+---------+-------+
| id    | BIGINT UNSIGNED | YES  | 0       |       |
| title | VARCHAR         | YES  | ""      |       |
| genre | VARCHAR         | YES  | 'General'|       |
+-------+-----------------+------+---------+-------+
```

插入一行而不指定`genre`：

```sql
INSERT INTO books(id, title) VALUES(1, 'Invisible Stars');
```

查询表并注意`genre`列已设置为默认值'General'：

```sql
SELECT * FROM books;
+----+----------------+---------+
| id | title          | genre   |
+----+----------------+---------+
|  1 | Invisible Stars| General |
+----+----------------+---------+
```

### 创建表 ... LIKE

创建一个新表(`books_copy`)，其结构与现有表(`books`)相同：

```sql
CREATE TABLE books_copy LIKE books;
```

检查新表的结构：

```sql
DESC books_copy;
+-------+-----------------+------+---------+-------+
| Field | Type            | Null | Default | Extra |
+-------+-----------------+------+---------+-------+
| id    | BIGINT UNSIGNED | YES  | 0       |       |
| title | VARCHAR         | YES  | ""      |       |
| genre | VARCHAR         | YES  | 'General'|       |
+-------+-----------------+------+---------+-------+
```

向新表插入一行并注意`genre`列的默认值已被复制：

```sql
INSERT INTO books_copy(id, title) VALUES(1, 'Invisible Stars');

SELECT * FROM books_copy;
+----+----------------+---------+
| id | title          | genre   |
+----+----------------+---------+
|  1 | Invisible Stars| General |
+----+----------------+---------+
```

### 创建表 ... AS

创建一个新表(`books_backup`)，其中包含现有表(`books`)的数据：

```sql
CREATE TABLE books_backup AS SELECT * FROM books;
```

描述新表并注意`genre`列的默认值未被复制：

```sql
DESC books_backup;
+-------+-----------------+------+---------+-------+
| Field | Type            | Null | Default | Extra |
+-------+-----------------+------+---------+-------+
| id    | BIGINT UNSIGNED | NO   | 0       |       |
| title | VARCHAR         | NO   | ""      |       |
| genre | VARCHAR         | NO   | NULL    |       |
+-------+-----------------+------+---------+-------+
```

查询新表并注意原始表的数据已被复制：

```sql
SELECT * FROM books_backup;
+----+----------------+---------+
| id | title          | genre   |
+----+----------------+---------+
|  1 | Invisible Stars| General |
+----+----------------+---------+
```

### 创建表 ... 列 AS STORED | VIRTUAL

以下示例演示了一个带有存储计算列的表，该列根据“price”或“quantity”列的更新自动重新计算：

```sql
-- 创建带有存储计算列的表
CREATE TABLE IF NOT EXISTS products (
  id INT,
  price FLOAT64,
  quantity INT,
  total_price FLOAT64 AS (price * quantity) STORED
);

-- 向表中插入数据
INSERT INTO products (id, price, quantity)
VALUES (1, 10.5, 3),
       (2, 15.2, 5),
       (3, 8.7, 2);

-- 查询表以查看计算列
SELECT id, price, quantity, total_price
FROM products;

---
+------+-------+----------+-------------+
| id   | price | quantity | total_price |
+------+-------+----------+-------------+
|    1 |  10.5 |        3 |        31.5 |
|    2 |  15.2 |        5 |        76.0 |
|    3 |   8.7 |        2 |        17.4 |
+------+-------+----------+-------------+
```

在这个示例中，我们创建了一个名为student_profiles的表，其中包含一个名为profile的Variant类型列来存储JSON数据。我们还添加了一个名为*age*的虚拟计算列，该列从profile列中提取age属性并将其转换为整数。

```sql
-- 创建带有虚拟计算列的表
CREATE TABLE student_profiles (
    id STRING,
    profile VARIANT,
    age INT NULL AS (profile['age']::INT) VIRTUAL
);

-- 向表中插入数据
INSERT INTO student_profiles (id, profile) VALUES
    ('d78236', '{"id": "d78236", "name": "Arthur Read", "age": "16", "school": "PVPHS", "credits": 120, "sports": "none"}'),
    ('f98112', '{"name": "Buster Bunny", "age": "15", "id": "f98112", "school": "TEO", "credits": 67, "clubs": "MUN"}'),
    ('t63512', '{"name": "Ernie Narayan", "school" : "Brooklyn Tech", "id": "t63512", "sports": "Track and Field", "clubs": "Chess"}');

-- 查询表以查看计算列
SELECT * FROM student_profiles;
```

+--------+------------------------------------------------------------------------------------------------------------+------+
| id     | profile                                                                                                    | age  |
+--------+------------------------------------------------------------------------------------------------------------+------+
| d78236 | {"age":"16","credits":120,"id":"d78236","name":"Arthur Read","school":"PVPHS","sports":"none"}             |   16 |
| f98112 | {"age":"15","clubs":"MUN","credits":67,"id":"f98112","name":"Buster Bunny","school":"TEO"}                 |   15 |
| t63512 | {"clubs":"Chess","id":"t63512","name":"Ernie Narayan","school":"Brooklyn Tech","sports":"Track and Field"} | NULL |
+--------+------------------------------------------------------------------------------------------------------------+------+
```