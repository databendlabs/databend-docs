title: CREATE TABLE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.784"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='COMPUTED COLUMN'/>

对许多数据库来说，创建表是最复杂的操作之一，因为你可能需要：

- 手动指定引擎
- 手动指定索引
- 甚至指定数据分区或数据分片

Databend 的设计目标是易于使用，在创建表时不需要进行任何这些操作。此外，CREATE TABLE 语句提供了以下选项，使你在各种场景下创建表变得更加容易：

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

- 有关 Databend 中可用的数据类型，请参阅 [数据类型](../../../00-sql-reference/10-data-types/index.md)。

- Databend 建议在命名列时尽量避免使用特殊字符。但是，如果在某些情况下必须使用特殊字符，别名应使用反引号括起来，例如：CREATE TABLE price(\`$CA\` int);

- Databend 会自动将列名转换为小写。例如，如果你将一列命名为 _Total_，它在结果中将显示为 _total_。
  :::

## CREATE TABLE ... LIKE

创建一个与现有表具有相同列定义的表。现有表的列名、数据类型及其非空约束将被复制到新表中。

语法：

```sql
CREATE TABLE [IF NOT EXISTS] [db.]table_name
LIKE [db.]origin_table_name
```

此命令不包含原始表中的任何数据或属性（例如 `CLUSTER BY`、`TRANSIENT` 和 `COMPRESSION`），而是使用默认系统设置创建一个新表。

:::note 解决方法

- 在使用此命令创建新表时，可以显式指定 `TRANSIENT` 和 `COMPRESSION`。例如，

```sql
create transient table t_new like t_old;

create table t_new compression='lz4' like t_old;
```

:::

## CREATE TABLE ... AS

创建一个表，并用 SELECT 命令计算的数据填充它。

语法：

```sql
CREATE TABLE [IF NOT EXISTS] [db.]table_name
AS SELECT query
```

此命令不包含原始表中的任何属性（例如 CLUSTER BY、TRANSIENT 和 COMPRESSION），而是使用默认系统设置创建一个新表。

:::note 解决方法

- 在使用此命令创建新表时，可以显式指定 `TRANSIENT` 和 `COMPRESSION`。例如，

```sql
create transient table t_new as select * from t_old;

create table t_new compression='lz4' as select * from t_old;
```

:::

## 列的可空性

在 Databend 中，默认情况下**所有列都是可空的（NULL）**。如果需要一个不允许 NULL 值的列，请使用 NOT NULL 约束。更多信息，请参阅 [NULL 值和 NOT NULL 约束](../../../00-sql-reference/10-data-types/index.md)。

## 列默认值

`DEFAULT <expr>` 在未提供显式表达式时为列设置默认值。默认表达式可以是：

- 一个固定常量，例如下面示例中 `department` 列的 `Marketing`。
- 一个没有输入参数并返回标量值的表达式，例如 `1 + 1`、`NOW()` 或 `UUID()`。
- 从序列中动态生成的值，例如下面示例中 `staff_id` 列的 `NEXTVAL(staff_id_seq)`。
  - NEXTVAL 必须作为独立的默认值使用；不支持类似 `NEXTVAL(seq1) + 1` 的表达式。
  - 用户必须遵守其被授予的序列使用权限，包括 [NEXTVAL](/sql/sql-functions/sequence-functions/nextval#access-control-requirements) 等操作。

```sql
CREATE SEQUENCE staff_id_seq;

CREATE TABLE staff (
    staff_id INT DEFAULT NEXTVAL(staff_id_seq), -- 如果未提供值，则从序列 'staff_id_seq' 中分配下一个数字
    name VARCHAR(50),
    department VARCHAR(50) DEFAULT 'Marketing' -- 如果未提供值，则默认为 'Marketing'
);

-- 当 COPY INTO 中不包含 staff_id 时，staff_id 会自动生成
COPY INTO staff(name, department) FROM @stage ...

-- staff_id 从暂存文件中加载
COPY INTO staff FROM @stage ...
COPY INTO staff(staff_id, name, department) FROM @stage ...
```

## 计算列

计算列（Computed Column）是使用标量表达式从表中的其他列生成的列。当用于计算的任何列中的数据更新时，计算列将自动重新计算其值以反映更新。

Databend 支持两种类型的计算列：存储型（Stored）和虚拟型（Virtual）。存储型计算列物理存储在数据库中并占用存储空间，而虚拟型计算列不进行物理存储，其值在访问时动态计算。

Databend 支持两种创建计算列的语法选项：一种使用 `AS (<expr>)`，另一种使用 `GENERATED ALWAYS AS (<expr>)`。两种语法都允许指定计算列是存储型还是虚拟型。

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

以下是创建存储型计算列的示例：每当 "price" 或 "quantity" 列的值更新时，"total_price" 列将自动重新计算并更新其存储值。

```sql
CREATE TABLE IF NOT EXISTS products (
  id INT,
  price FLOAT64,
  quantity INT,
  total_price FLOAT64 AS (price * quantity) STORED
);
```

以下是创建虚拟型计算列的示例："full_name" 列根据 "first_name" 和 "last_name" 列的当前值动态计算。它不占用额外的存储空间。每当访问 "first_name" 或 "last_name" 的值时，将计算并返回 "full_name" 列。

```sql
CREATE TABLE IF NOT EXISTS employees (
  id INT,
  first_name VARCHAR,
  last_name VARCHAR,
  full_name VARCHAR AS (CONCAT(first_name, ' ', last_name)) VIRTUAL
);
```

:::tip STORED 还是 VIRTUAL？
在选择存储型计算列和虚拟型计算列时，请考虑以下因素：

- 存储空间：存储型计算列会占用表中额外的存储空间，因为它们的计算值是物理存储的。如果你的数据库空间有限或希望最小化存储使用，虚拟型计算列可能是更好的选择。

- 实时更新：当依赖的列更新时，存储型计算列会立即更新其计算值。这确保了在查询时始终能获得最新的计算值。而虚拟型计算列在查询期间动态计算其值，这可能会略微增加处理时间。

- 数据完整性和一致性：存储型计算列在写入操作时更新其计算值，从而保持即时的数据一致性。然而，虚拟型计算列在查询时动态计算其值，这意味着在写入操作和后续查询之间可能存在短暂的不一致。
  :::

## MySQL 兼容性

Databend 的语法与 MySQL 的主要区别在于数据类型和一些特定的索引提示。

## 访问控制要求

| 权限 | 对象类型 | 描述 |
|:----------|:--------------|:-----------------------|
| CREATE | Global, Table | 创建表。 |


要创建表，执行操作的用户或 [current_role](/guides/security/access-control/roles) 必须具有 CREATE [权限](/guides/security/access-control/privileges#table-privileges)。


## 示例

### 创建表

创建一个列带有默认值的表（在本例中，`genre` 列的默认值为 'General'）：

```sql
CREATE TABLE books (
    id BIGINT UNSIGNED,
    title VARCHAR,
    genre VARCHAR DEFAULT 'General'
);
```

描述该表以确认其结构和 `genre` 列的默认值：

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

插入一行时不指定 `genre`：

```sql
INSERT INTO books(id, title) VALUES(1, 'Invisible Stars');
```

查询该表，注意 `genre` 列已被设置为默认值 'General'：

```sql
SELECT * FROM books;
+----+----------------+---------+
| id | title          | genre   |
+----+----------------+---------+
|  1 | Invisible Stars| General |
+----+----------------+---------+
```

### 创建表 ... Like

创建一个新表（`books_copy`），其结构与现有表（`books`）相同：

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

向新表中插入一行，注意 `genre` 列的默认值已被复制：

```sql
INSERT INTO books_copy(id, title) VALUES(1, 'Invisible Stars');

SELECT * FROM books_copy;
+----+----------------+---------+
| id | title          | genre   |
+----+----------------+---------+
|  1 | Invisible Stars| General |
+----+----------------+---------+
```

### 创建表 ... As

创建一个新表（`books_backup`），其中包含现有表（`books`）的数据：

```sql
CREATE TABLE books_backup AS SELECT * FROM books;
```

描述新表，注意 `genre` 列的默认值未被复制：

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

查询新表，注意原始表的数据已被复制：

```sql
SELECT * FROM books_backup;
+----+----------------+---------+
| id | title          | genre   |
+----+----------------+---------+
|  1 | Invisible Stars| General |
+----+----------------+---------+
```

### 创建表 ... 列 AS STORED | VIRTUAL

以下示例演示了一个带有存储型计算列的表，该列会根据 "price" 或 "quantity" 列的更新自动重新计算：

```sql
-- 创建带有存储型计算列的表
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

在此示例中，我们创建一个名为 `student_profiles` 的表，其中包含一个名为 `profile` 的 Variant 类型列，用于存储 JSON 数据。我们还添加了一个名为 `age` 的虚拟计算列，它从 `profile` 列中提取 `age` 属性并将其转换为整数。

```sql
-- 创建带有虚拟型计算列的表
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

+--------+------------------------------------------------------------------------------------------------------------+------+
| id     | profile                                                                                                    | age  |
+--------+------------------------------------------------------------------------------------------------------------+------+
| d78236 | `{"age":"16","credits":120,"id":"d78236","name":"Arthur Read","school":"PVPHS","sports":"none"}`            |   16 |
| f98112 | `{"age":"15","clubs":"MUN","credits":67,"id":"f98112","name":"Buster Bunny","school":"TEO"}`                |   15 |
| t63512 | `{"clubs":"Chess","id":"t63512","name":"Ernie Narayan","school":"Brooklyn Tech","sports":"Track and Field"}` | NULL |
+--------+------------------------------------------------------------------------------------------------------------+------+
```