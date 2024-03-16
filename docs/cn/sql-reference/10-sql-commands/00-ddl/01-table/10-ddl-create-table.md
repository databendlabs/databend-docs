---
title: 创建表
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.339"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='计算列'/>

创建表是许多数据库中最复杂的操作之一，因为你可能需要：

* 手动指定引擎
* 手动指定索引
* 甚至指定数据分区或数据分片

Databend 旨在设计上易于使用，并且在创建表时不需要任何这些操作。此外，CREATE TABLE 语句提供了这些选项，使您能够在各种场景中更轻松地创建表：

- [CREATE TABLE](#create-table)：从头开始创建一个表。
- [CREATE TABLE ... LIKE](#create-table--like)：创建一个与现有表具有相同列定义的表。
- [CREATE TABLE ... AS](#create-table--as)：创建一个表并插入 SELECT 查询结果的数据。
- [CREATE TRANSIENT TABLE](#create-transient-table)：创建一个不存储其历史数据以供时间旅行的表。
- [CREATE TABLE ... EXTERNAL_LOCATION](#create-table--external_location)：创建一个表并指定一个 S3 桶用于数据存储，而不是使用 FUSE 引擎。

## CREATE TABLE

```sql
CREATE [ OR REPLACE ] [ TRANSIENT ] TABLE [ IF NOT EXISTS ] [ <database_name>. ]table_name
(
    <column_name> <data_type> [ NOT NULL | NULL] [ { DEFAULT <expr> }] [AS (<expr>) STORED | VIRTUAL],
    <column_name> <data_type> [ NOT NULL | NULL] [ { DEFAULT <expr> }] [AS (<expr>) STORED | VIRTUAL],
    ...
)
```
:::note
- 有关 Databend 中可用的数据类型，请参见[数据类型](../../../00-sql-reference/10-data-types/index.md)。

- Databend 建议尽可能避免在命名列时使用特殊字符。然而，如果在某些情况下需要特殊字符，别名应该用反引号括起来，像这样：CREATE TABLE price(\`$CA\` int);

- Databend 会自动将列名转换为小写。例如，如果您将某个列命名为 *Total*，在结果中它将显示为 *total*。
:::


## CREATE TABLE ... LIKE

创建一个与现有表具有相同列定义的表。现有表的列名、数据类型及其非 NULL 约束将被复制到新表中。

语法：
```sql
CREATE TABLE [IF NOT EXISTS] [db.]table_name
LIKE [db.]origin_table_name
```

此命令不包括任何数据或属性（如 `CLUSTER BY`、`TRANSIENT` 和 `COMPRESSION`）从原始表中，而是使用默认系统设置创建一个新表。

:::note 解决方法
- 在使用此命令创建新表时，可以显式指定 `TRANSIENT` 和 `COMPRESSION`。例如，

```sql
create transient table t_new like t_old;

create table t_new compression='lz4' like t_old;
```
:::

## CREATE TABLE ... AS

创建一个表并用 SELECT 命令计算的数据填充它。

语法：
```sql
CREATE TABLE [IF NOT EXISTS] [db.]table_name
AS SELECT query
```

此命令不包括任何属性（如 CLUSTER BY、TRANSIENT 和 COMPRESSION）从原始表中，而是使用默认系统设置创建一个新表。

:::note 解决方法
- 在使用此命令创建新表时，可以显式指定 `TRANSIENT` 和 `COMPRESSION`。例如，

```sql
create transient table t_new as select * from t_old;

create table t_new compression='lz4' as select * from t_old;
```
:::

## CREATE TRANSIENT TABLE

创建一个临时表。

临时表用于保存不需要数据保护或恢复机制的短暂数据。Databend 不会为临时表保留历史数据，因此您将无法使用时间旅行功能查询临时表的先前版本，例如，SELECT 语句中的 [AT](./../../20-query-syntax/03-query-at.md) 子句对临时表不起作用。请注意，您仍然可以[删除](./20-ddl-drop-table.md)和[取消删除](./21-ddl-undrop-table.md)临时表。

临时表有助于节省您的存储费用，因为与非临时表相比，它们不需要额外的空间来存储历史数据。详细说明请参见[示例](#create-transient-table-1)。

语法：
```sql
CREATE TRANSIENT TABLE ...
```

## CREATE TABLE ... EXTERNAL_LOCATION

创建一个表并指定一个 S3 桶用于数据存储，而不是使用 FUSE 引擎。

Databend 默认在 `databend-query.toml` 文件中配置的位置存储表数据。此选项使您能够将数据（以 parquet 格式）存储在另一个桶中的表中，而不是默认的桶。

语法：
```sql
CREATE TABLE [IF NOT EXISTS] [db.]table_name

    <column_name> <data_type> [ NOT NULL | NULL] [ { DEFAULT <expr> }],
    <column_name> <data_type> [ NOT NULL | NULL] [ { DEFAULT <expr> }],
    ...

's3://<bucket>/[<path>]' 
CONNECTION = (
        ENDPOINT_URL = 'https://<endpoint-URL>'
        ACCESS_KEY_ID = '<your-access-key-ID>'
        SECRET_ACCESS_KEY = '<your-secret-access-key>'
        REGION = '<region-name>'
        ENABLE_VIRTUAL_HOST_STYLE = 'true'|'false'
  );
```

| 参数                         | 描述                                                                                                                                                                                                                   | 是否必须   |
|------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------|
| `s3://<bucket>/[<path>]`     | 文件位于指定的外部位置（类似S3的存储桶）                                                                                                                                                                                | 是         |
| ENDPOINT_URL                 | 存储桶端点URL，以 "https://" 开头。要使用以 "http://" 开头的URL，请在文件 `databend-query-node.toml` 的 [storage] 区块中设置 `allow_insecure` 为 `true`。                                                                | 可选       |
| ACCESS_KEY_ID                | 用于连接AWS S3兼容对象存储的访问密钥ID。如果未提供，Databend将匿名访问存储桶。                                                                                                                                            | 可选       |
| SECRET_ACCESS_KEY            | 用于连接AWS S3兼容对象存储的密钥访问密钥。                                                                                                                                                                               | 可选       |
| REGION                       | AWS区域名称。例如，us-east-1。                                                                                                                                                                                          | 可选       |
| ENABLE_VIRTUAL_HOST_STYLE    | 如果您使用虚拟主机来寻址存储桶，请将其设置为 "true"。                                                                                                                                                                    | 可选       |

## 列可为空

默认情况下，**Databend中的所有列都可为空(NULL)**。如果您需要一个不允许NULL值的列，请使用NOT NULL约束。更多信息，请参见 [NULL值和NOT NULL约束](../../../00-sql-reference/10-data-types/index.md)。

## 默认值

```sql
DEFAULT <expr>
```
如果通过 `INSERT` 或 `CREATE TABLE AS SELECT` 语句未指定值，则在列中插入一个默认值。

例如：

```sql
CREATE TABLE t_default_value(a TINYINT UNSIGNED, b VARCHAR DEFAULT 'b');
```

描述 `t_default_value` 表：

```sql
DESC t_default_value;

字段|类型              |空  |默认值 |额外信息|
----+------------------+----+-------+-------+
a   |TINYINT UNSIGNED  |是  |NULL   |       |
b   |VARCHAR           |是  |'b'    |       |
```

插入一个值：

```sql
INSERT INTO t_default_value(a) VALUES(1);
```

检查表的值：

```sql
SELECT * FROM t_default_value;
+------+------+
| a    | b    |
+------+------+
|    1 | b    |
+------+------+
```

## 计算列

计算列是从表中其他列使用标量表达式生成的列。当用于计算的任何列中的数据更新时，计算列将自动重新计算其值以反映更新。

Databend支持两种类型的计算列：存储和虚拟。存储计算列在数据库中物理存储并占用存储空间，而虚拟计算列不会物理存储，其值在访问时即时计算。

Databend支持两种创建计算列的语法选项：一种使用 `AS (<expr>)`，另一种使用 `GENERATED ALWAYS AS (<expr>)`。两种语法都允许指定计算列是存储还是虚拟。

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

以下是创建虚拟计算列的示例：“full_name”列基于“first_name”和“last_name”列的当前值动态计算。它不占用额外的存储空间。每当访问“first_name”或“last_name”值时，将计算并返回“full_name”列。

```sql
CREATE TABLE IF NOT EXISTS employees (
  id INT,
  first_name VARCHAR,
  last_name VARCHAR,
  full_name VARCHAR AS (CONCAT(first_name, ' ', last_name)) VIRTUAL
);
```

:::tip 存储还是虚拟？
在选择存储计算列和虚拟计算列时，考虑以下因素：

- 存储空间：存储计算列在表中占用额外的存储空间，因为它们的计算值是物理存储的。如果您的数据库空间有限或想要最小化存储使用，虚拟计算列可能是更好的选择。

- 实时更新：存储计算列在依赖列更新时立即更新其计算值。这确保您在查询时始终拥有最新的计算值。另一方面，虚拟计算列在查询期间动态计算其值，这可能会略微增加处理时间。

- 数据完整性和一致性：存储计算列由于在写操作时更新其计算值，因此维护即时数据一致性。然而，虚拟计算列在查询期间即时计算其值，这意味着在写操作和随后的查询之间可能存在短暂的不一致。
:::

## MySQL 兼容性

Databend 的语法主要在数据类型和一些特定的索引提示上与 MySQL 不同。

## 示例

### 创建表

创建一个带有默认列值的表（在本例中，`genre`列的默认值为'General'）：

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

查询表并注意`genre`列已设置默认值'General'：

```sql
SELECT * FROM books;
+----+----------------+---------+
| id | title          | genre   |
+----+----------------+---------+
|  1 | Invisible Stars| General |
+----+----------------+---------+
```

### 创建表 ... 像

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

### 创建表 ... 作为

创建一个新表（`books_backup`），其中包含现有表（`books`）的数据：

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

### 创建临时表

创建一个临时表（临时表），在指定的时间段后自动删除数据：

```sql
-- 创建一个临时表
CREATE TRANSIENT TABLE visits (
  visitor_id BIGINT
);

-- 插入值
INSERT INTO visits VALUES(1);
INSERT INTO visits VALUES(2);
INSERT INTO visits VALUES(3);

-- 检查插入的数据
SELECT * FROM visits;
+-----------+
| visitor_id |
+-----------+
|         1 |
|         2 |
|         3 |
+-----------+
```

### 创建表 ... 外部位置

创建一个数据存储在外部位置的表，例如 Amazon S3：

```sql
-- 创建一个名为`mytable`的表，并指定数据存储位置`s3://testbucket/admin/data/`
CREATE TABLE mytable (
  a INT
) 
's3://testbucket/admin/data/' 
CONNECTION=(
  ACCESS_KEY_ID='<your_aws_key_id>' 
  SECRET_ACCESS_KEY='<your_aws_secret_key>' 
  ENDPOINT_URL='https://s3.amazonaws.com'
);
```

### 创建表 ... 列作为存储 | 虚拟

以下示例演示了一个带有存储计算列的表，该列根据对“price”或“quantity”列的更新自动重新计算：

```sql
-- 创建带有存储计算列的表
CREATE TABLE IF NOT EXISTS products (
  id INT,
  price FLOAT64,
  quantity INT,
  total_price FLOAT64 AS (price * quantity) STORED
);



```sql
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

在此示例中，我们创建了一个名为 student_profiles 的表，其中包含一个名为 profile 的 Variant 类型列，用于存储 JSON 数据。我们还添加了一个名为 *age* 的虚拟计算列，该列从 profile 列中提取 age 属性并将其转换为整数。

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

+--------+------------------------------------------------------------------------------------------------------------+------+
| id     | profile                                                                                                    | age  |
+--------+------------------------------------------------------------------------------------------------------------+------+
| d78236 | {"age":"16","credits":120,"id":"d78236","name":"Arthur Read","school":"PVPHS","sports":"none"}             |   16 |
| f98112 | {"age":"15","clubs":"MUN","credits":67,"id":"f98112","name":"Buster Bunny","school":"TEO"}                 |   15 |
| t63512 | {"clubs":"Chess","id":"t63512","name":"Ernie Narayan","school":"Brooklyn Tech","sports":"Track and Field"} | NULL |
+--------+------------------------------------------------------------------------------------------------------------+------+
```