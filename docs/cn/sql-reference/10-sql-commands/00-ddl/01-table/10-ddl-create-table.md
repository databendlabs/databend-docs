```markdown
---
title: CREATE TABLE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.714"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='COMPUTED COLUMN'/>

创建表是许多数据库中最复杂的操作之一，因为您可能需要：

- 手动指定引擎
- 手动指定索引
- 甚至指定数据分区或数据分片

Databend 旨在设计上易于使用，并且在创建表时不需要任何这些操作。此外，CREATE TABLE 语句提供了以下选项，使您可以更轻松地在各种场景中创建表：

- [CREATE TABLE](#create-table)：从头开始创建表。
- [CREATE TABLE ... LIKE](#create-table--like)：创建一个与现有表具有相同列定义的表。
- [CREATE TABLE ... AS](#create-table--as)：创建一个表，并使用 SELECT 查询的结果插入数据。

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

- 有关 Databend 中可用的数据类型，请参阅 [Data Types](../../../00-sql-reference/10-data-types/index.md)。

- Databend 建议在命名列时尽可能避免特殊字符。但是，如果在某些情况下必须使用特殊字符，则别名应包含在反引号中，例如：CREATE TABLE price(\`$CA\` int);

- Databend 会自动将列名转换为小写。例如，如果您将列命名为 _Total_，它将在结果中显示为 _total_。
  :::

## CREATE TABLE ... LIKE

创建一个与现有表具有相同列定义的表。现有表的列名、数据类型及其非空约束将复制到新表。

语法：

```sql
CREATE TABLE [IF NOT EXISTS] [db.]table_name
LIKE [db.]origin_table_name
```

此命令不包括原始表中的任何数据或属性（例如 `CLUSTER BY`、`TRANSIENT` 和 `COMPRESSION`），而是使用默认系统设置创建一个新表。

:::note WORKAROUND

- 使用此命令创建新表时，可以显式指定 `TRANSIENT` 和 `COMPRESSION`。例如，

```sql
create transient table t_new like t_old;

create table t_new compression='lz4' like t_old;
```

:::

## CREATE TABLE ... AS

创建一个表，并使用 SELECT 命令计算的数据填充它。

语法：

```sql
CREATE TABLE [IF NOT EXISTS] [db.]table_name
AS SELECT query
```

此命令不包括任何属性（例如 CLUSTER BY、TRANSIENT 和 COMPRESSION）从原始表，而是使用默认系统设置创建一个新表。

:::note WORKAROUND

- 使用此命令创建新表时，可以显式指定 `TRANSIENT` 和 `COMPRESSION`。例如，

```sql
create transient table t_new as select * from t_old;

create table t_new compression='lz4' as select * from t_old;
```

:::

## Column Nullable

默认情况下，Databend 中**所有列都是可空的（NULL）**。如果您需要一个不允许 NULL 值的列，请使用 NOT NULL 约束。有关更多信息，请参阅 [NULL Values and NOT NULL Constraint](../../../00-sql-reference/10-data-types/index.md)。

## Column Default Values

`DEFAULT <expr>` 在未提供显式表达式时，为列设置默认值。默认表达式可以是：

- 一个固定的常量，例如下面示例中 `department` 列的 `Marketing`。
- 一个没有输入参数并返回标量值的表达式，例如 `1 + 1`、`NOW()` 或 `UUID()`。
- 来自序列的动态生成的值，例如下面示例中 `staff_id` 列的 `NEXTVAL(staff_id_seq)`。
  - NEXTVAL 必须用作独立的默认值；不支持 `NEXTVAL(seq1) + 1` 之类的表达式。

```sql
CREATE SEQUENCE staff_id_seq;

CREATE TABLE staff (
    staff_id INT DEFAULT NEXTVAL(staff_id_seq), -- 如果未提供值，则从序列 'staff_id_seq' 分配下一个数字
    name VARCHAR(50),
    department VARCHAR(50) DEFAULT 'Marketing' -- 如果未提供值，则默认为 'Marketing'
);

-- 当 COPY INTO 中未包含 staff_id 时，会自动生成
COPY INTO staff(name, department) FROM @stage ...

-- staff_id 从暂存文件中加载
COPY INTO staff FROM @stage ...
COPY INTO staff(staff_id, name, department) FROM @stage ...
```

## Computed Columns

Computed Columns 是指使用标量表达式从表中的其他列生成的列。当计算中使用的任何列中的数据更新时，Computed Columns 将自动重新计算其值以反映更新。

Databend 支持两种类型的 Computed Columns：存储列和虚拟列。存储的 Computed Columns 物理存储在数据库中并占用存储空间，而虚拟 Computed Columns 不物理存储，其值在访问时动态计算。

Databend 支持两种用于创建 Computed Columns 的语法选项：一种使用 `AS (<expr>)`，另一种使用 `GENERATED ALWAYS AS (<expr>)`。两种语法都允许指定 Computed Columns 是存储的还是虚拟的。

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

以下是创建存储的 Computed Columns 的示例：每当更新 "price" 或 "quantity" 列的值时，"total_price" 列将自动重新计算并更新其存储的值。

```sql
CREATE TABLE IF NOT EXISTS products (
  id INT,
  price FLOAT64,
  quantity INT,
  total_price FLOAT64 AS (price * quantity) STORED
);
```

以下是创建虚拟 Computed Columns 的示例："full_name" 列根据 "first_name" 和 "last_name" 列的当前值动态计算。它不占用额外的存储空间。每当访问 "first_name" 或 "last_name" 值时，将计算并返回 "full_name" 列。

```sql
CREATE TABLE IF NOT EXISTS employees (
  id INT,
  first_name VARCHAR,
  last_name VARCHAR,
  full_name VARCHAR AS (CONCAT(first_name, ' ', last_name)) VIRTUAL
);
```

:::tip STORED or VIRTUAL?
在存储的 Computed Columns 和虚拟 Computed Columns 之间进行选择时，请考虑以下因素：

- 存储空间：存储的 Computed Columns 占用表中额外的存储空间，因为它们的计算值是物理存储的。如果您的数据库空间有限或想要最大限度地减少存储使用量，那么虚拟 Computed Columns 可能是更好的选择。

- 实时更新：当依赖列更新时，存储的 Computed Columns 会立即更新其计算值。这确保了在查询时始终具有最新的计算值。另一方面，虚拟 Computed Columns 在查询期间动态计算其值，这可能会稍微增加处理时间。

- 数据完整性和一致性：存储的 Computed Columns 维护即时数据一致性，因为它们的计算值在写入操作时会更新。但是，虚拟 Computed Columns 在查询期间动态计算其值，这意味着写入操作和后续查询之间可能存在瞬间的不一致。
  :::

## MySQL Compatibility

Databend 的语法与 MySQL 的主要区别在于数据类型和一些特定的索引提示。

## Examples

### Create Table

创建一个表，其中一列具有默认值（在本例中，`genre` 列的默认值为 'General'）：

```sql
CREATE TABLE books (
    id BIGINT UNSIGNED,
    title VARCHAR,
    genre VARCHAR DEFAULT 'General'
);
```

描述该表以确认结构和 `genre` 列的默认值：

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

插入一行，但不指定 `genre`：

```sql
INSERT INTO books(id, title) VALUES(1, 'Invisible Stars');
```

查询该表，并注意 `genre` 列已设置为默认值 'General'：

```sql
SELECT * FROM books;
+----+----------------+---------+
| id | title          | genre   |
+----+----------------+---------+
|  1 | Invisible Stars| General |
+----+----------------+---------+
```

### Create Table ... Like

创建一个新表 (`books_copy`)，其结构与现有表 (`books`) 相同：

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

将一行插入到新表中，并注意 `genre` 列的默认值已被复制：

```sql
INSERT INTO books_copy(id, title) VALUES(1, 'Invisible Stars');

SELECT * FROM books_copy;
+----+----------------+---------+
| id | title          | genre   |
+----+----------------+---------+
|  1 | Invisible Stars| General |
+----+----------------+---------+
```

### Create Table ... As

创建一个新表 (`books_backup`)，其中包含来自现有表 (`books`) 的数据：

```sql
CREATE TABLE books_backup AS SELECT * FROM books;
```

描述新表，并注意 `genre` 列的默认值未被复制：

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

查询新表，并注意原始表中的数据已被复制：

```sql
SELECT * FROM books_backup;
+----+----------------+---------+
| id | title          | genre   |
+----+----------------+---------+
|  1 | Invisible Stars| General |
+----+----------------+---------+
```

### Create Table ... Column As STORED | VIRTUAL

以下示例演示了一个具有存储的 Computed Columns 的表，该列根据对 "price" 或 "quantity" 列的更新自动重新计算：

```sql
-- 创建具有存储的 Computed Columns 的表
CREATE TABLE IF NOT EXISTS products (
  id INT,
  price FLOAT64,
  quantity INT,
  total_price FLOAT64 AS (price * quantity) STORED
);

-- 将数据插入到表中
INSERT INTO products (id, price, quantity)
VALUES (1, 10.5, 3),
       (2, 15.2, 5),
       (3, 8.7, 2);

-- 查询表以查看 Computed Columns
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

在此示例中，我们创建一个名为 student*profiles 的表，其中包含一个名为 profile 的 Variant 类型列，用于存储 JSON 数据。我们还添加了一个名为 \_age* 的虚拟 Computed Columns，该列从 profile 列中提取 age 属性并将其转换为整数。

```sql
-- 创建具有虚拟 Computed Columns 的表
CREATE TABLE student_profiles (
    id STRING,
    profile VARIANT,
    age INT NULL AS (profile['age']::INT) VIRTUAL
);
```


```sql
-- Insert data into the table
INSERT INTO student_profiles (id, profile) VALUES
    ('d78236', '{"id": "d78236", "name": "Arthur Read", "age": "16", "school": "PVPHS", "credits": 120, "sports": "none"}'),
    ('f98112', '{"name": "Buster Bunny", "age": "15", "id": "f98112", "school": "TEO", "credits": 67, "clubs": "MUN"}'),
    ('t63512', '{"name": "Ernie Narayan", "school" : "Brooklyn Tech", "id": "t63512", "sports": "Track and Field", "clubs": "Chess"}');

-- Query the table to see the computed column
SELECT * FROM student_profiles;

+--------+------------------------------------------------------------------------------------------------------------+------+
| id     | profile                                                                                                    | age  |
+--------+------------------------------------------------------------------------------------------------------------+------+
| d78236 | `{"age":"16","credits":120,"id":"d78236","name":"Arthur Read","school":"PVPHS","sports":"none"}`            |   16 |
| f98112 | `{"age":"15","clubs":"MUN","credits":67,"id":"f98112","name":"Buster Bunny","school":"TEO"}`                |   15 |
| t63512 | `{"clubs":"Chess","id":"t63512","name":"Ernie Narayan","school":"Brooklyn Tech","sports":"Track and Field"}` | NULL |
+--------+------------------------------------------------------------------------------------------------------------+------+
```