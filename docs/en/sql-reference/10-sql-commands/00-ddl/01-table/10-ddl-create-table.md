---
title: CREATE TABLE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.714"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='COMPUTED COLUMN'/>

Creating tables is one of the most complicated operations for many databases because you might need to:

- Manually specify the engine
- Manually specify the indexes
- And even specify the data partitions or data shard

Databend aims to be easy to use by design and does NOT require any of those operations when you create a table. Moreover, the CREATE TABLE statement provides these options to make it much easier for you to create tables in various scenarios:

- [CREATE TABLE](#create-table): Creates a table from scratch.
- [CREATE TABLE ... LIKE](#create-table--like): Creates a table with the same column definitions as an existing one.
- [CREATE TABLE ... AS](#create-table--as): Creates a table and inserts data with the results of a SELECT query.

See also:

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

- For available data types in Databend, see [Data Types](../../../00-sql-reference/10-data-types/index.md).

- Databend suggests avoiding special characters as much as possible when naming columns. However, if special characters are necessary in some cases, the alias should be enclosed in backticks, like this: CREATE TABLE price(\`$CA\` int);

- Databend will automatically convert column names into lowercase. For example, if you name a column as _Total_, it will appear as _total_ in the result.
  :::

## CREATE TABLE ... LIKE

Creates a table with the same column definitions as an existing table. Column names, data types, and their non-NUll constraints of the existing will be copied to the new table.

Syntax:

```sql
CREATE TABLE [IF NOT EXISTS] [db.]table_name
LIKE [db.]origin_table_name
```

This command does not include any data or attributes (such as `CLUSTER BY`, `TRANSIENT`, and `COMPRESSION`) from the original table, and instead creates a new table using the default system settings.

:::note WORKAROUND

- `TRANSIENT` and `COMPRESSION` can be explicitly specified when you create a new table with this command. For example,

```sql
create transient table t_new like t_old;

create table t_new compression='lz4' like t_old;
```

:::

## CREATE TABLE ... AS

Creates a table and fills it with data computed by a SELECT command.

Syntax:

```sql
CREATE TABLE [IF NOT EXISTS] [db.]table_name
AS SELECT query
```

This command does not include any attributes (such as CLUSTER BY, TRANSIENT, and COMPRESSION) from the original table, and instead creates a new table using the default system settings.

:::note WORKAROUND

- `TRANSIENT` and `COMPRESSION` can be explicitly specified when you create a new table with this command. For example,

```sql
create transient table t_new as select * from t_old;

create table t_new compression='lz4' as select * from t_old;
```

:::

## Column Nullable

By default, **all columns are nullable(NULL)** in Databend. If you need a column that does not allow NULL values, use the NOT NULL constraint. For more information, see [NULL Values and NOT NULL Constraint](../../../00-sql-reference/10-data-types/index.md).

## Column Default Values

`DEFAULT <expr>` sets a default value for the column when no explicit expression is provided. The default expression can be:

- A fixed constant, such as `Marketing` for the `department` column in the example below.
- An expression with no input arguments and returns a scalar value, such as `1 + 1`, `NOW()` or `UUID()`.
- A dynamically generated value from a sequence, such as `NEXTVAL(staff_id_seq)` for the `staff_id` column in the example below.
  - NEXTVAL must be used as a standalone default value; expressions like `NEXTVAL(seq1) + 1` are not supported.

```sql
CREATE SEQUENCE staff_id_seq;

CREATE TABLE staff (
    staff_id INT DEFAULT NEXTVAL(staff_id_seq), -- Assigns the next number from the sequence 'staff_id_seq' if no value is provided
    name VARCHAR(50),
    department VARCHAR(50) DEFAULT 'Marketing' -- Defaults to 'Marketing' if no value is provided
);

-- staff_id is auto-generated when not included in COPY INTO  
COPY INTO staff(name, department) FROM @stage ...

-- staff_id is loaded from the staged file  
COPY INTO staff FROM @stage ...
COPY INTO staff(staff_id, name, department) FROM @stage ...
```

## Computed Columns

Computed columns are columns that are generated from other columns in a table using a scalar expression. When data in any of the columns used in the computation is updated, the computed column will automatically recalculate its value to reflect the update.

Databend supports two types of computed columns: stored and virtual. Stored computed columns are physically stored in the database and occupy storage space, while virtual computed columns are not physically stored and their values are calculated on the fly when accessed.

Databend supports two syntax options for creating computed columns: one using `AS (<expr>)` and the other using `GENERATED ALWAYS AS (<expr>)`. Both syntaxes allow specifying whether the computed column is stored or virtual.

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

The following is an example of creating a stored computed column: Whenever the values of the "price" or "quantity" columns are updated, the "total_price" column will automatically recalculate and update its stored value.

```sql
CREATE TABLE IF NOT EXISTS products (
  id INT,
  price FLOAT64,
  quantity INT,
  total_price FLOAT64 AS (price * quantity) STORED
);
```

The following is an example of creating a virtual computed column: The "full_name" column is dynamically calculated based on the current values of the "first_name" and "last_name" columns. It does not occupy additional storage space. Whenever the "first_name" or "last_name" values are accessed, the "full_name" column will be computed and returned.

```sql
CREATE TABLE IF NOT EXISTS employees (
  id INT,
  first_name VARCHAR,
  last_name VARCHAR,
  full_name VARCHAR AS (CONCAT(first_name, ' ', last_name)) VIRTUAL
);
```

:::tip STORED or VIRTUAL?
When choosing between stored computed columns and virtual computed columns, consider the following factors:

- Storage Space: Stored computed columns occupy additional storage space in the table because their computed values are physically stored. If you have limited database space or want to minimize storage usage, virtual computed columns can be a better choice.

- Real-time Updates: Stored computed columns update their computed values immediately when the dependent columns are updated. This ensures that you always have the latest computed values when querying. Virtual computed columns, on the other hand, compute their values dynamically during queries, which may slightly increase the processing time.

- Data Integrity and Consistency: Stored computed columns maintain immediate data consistency since their computed values are updated upon write operations. Virtual computed columns, however, calculate their values on-the-fly during queries, which means there might be a momentary inconsistency between write operations and subsequent queries.
  :::

## MySQL Compatibility

Databend's syntax is difference from MySQL mainly in the data type and some specific index hints.

## Access control requirements

| Privilege | Object Type   | Description            |
|:----------|:--------------|:-----------------------|
| CREATE    | Global, Table | Creates a table.       |


To create a table, the user performing the operation or the [current_role](/guides/security/access-control/roles) must have the CREATE [privilege](/guides/security/access-control/privileges#table-privileges).


## Examples

### Create Table

Create a table with a default value for a column (in this case, the `genre` column has 'General' as the default value):

```sql
CREATE TABLE books (
    id BIGINT UNSIGNED,
    title VARCHAR,
    genre VARCHAR DEFAULT 'General'
);
```

Describe the table to confirm the structure and the default value for the `genre` column:

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

Insert a row without specifying the `genre`:

```sql
INSERT INTO books(id, title) VALUES(1, 'Invisible Stars');
```

Query the table and notice that the default value 'General' has been set for the `genre` column:

```sql
SELECT * FROM books;
+----+----------------+---------+
| id | title          | genre   |
+----+----------------+---------+
|  1 | Invisible Stars| General |
+----+----------------+---------+
```

### Create Table ... Like

Create a new table (`books_copy`) with the same structure as an existing table (`books`):

```sql
CREATE TABLE books_copy LIKE books;
```

Check the structure of the new table:

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

Insert a row into the new table and notice that the default value for the `genre` column has been copied:

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

Create a new table (`books_backup`) that includes data from an existing table (`books`):

```sql
CREATE TABLE books_backup AS SELECT * FROM books;
```

Describe the new table and notice that the default value for the `genre` column has NOT been copied:

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

Query the new table and notice that the data from the original table has been copied:

```sql
SELECT * FROM books_backup;
+----+----------------+---------+
| id | title          | genre   |
+----+----------------+---------+
|  1 | Invisible Stars| General |
+----+----------------+---------+
```

### Create Table ... Column As STORED | VIRTUAL

The following example demonstrates a table with a stored computed column that automatically recalculates based on updates to the "price" or "quantity" columns:

```sql
-- Create the table with a stored computed column
CREATE TABLE IF NOT EXISTS products (
  id INT,
  price FLOAT64,
  quantity INT,
  total_price FLOAT64 AS (price * quantity) STORED
);

-- Insert data into the table
INSERT INTO products (id, price, quantity)
VALUES (1, 10.5, 3),
       (2, 15.2, 5),
       (3, 8.7, 2);

-- Query the table to see the computed column
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

In this example, we create a table called student*profiles with a Variant type column named profile to store JSON data. We also add a virtual computed column named \_age* that extracts the age property from the profile column and casts it to an integer.

```sql
-- Create the table with a virtual computed column
CREATE TABLE student_profiles (
    id STRING,
    profile VARIANT,
    age INT NULL AS (profile['age']::INT) VIRTUAL
);

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
