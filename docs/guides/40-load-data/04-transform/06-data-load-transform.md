---
title: Transforming Data on Load
---

Databend offers a powerful feature that enables data transformation during the loading process using the [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table) command, with this syntax:

```sql
COPY INTO [<database>.]<table_name> [ ( <col_name> [ , <col_name> ... ] ) ]
     FROM ( SELECT [<file_col> ... ]
            FROM { userStage | internalStage | externalStage } )
[ FILES = ( '<file_name>' [ , '<file_name>' ] [ , ... ] ) ]
[ PATTERN = '<regex_pattern>' ]
[ FILE_FORMAT = (
         FORMAT_NAME = '<your-custom-format>'
         | TYPE = { CSV | TSV | NDJSON | PARQUET | XML } [ formatTypeOptions ]
       ) ]
[ copyOptions ]
```

This functionality simplifies your ETL pipeline by incorporating basic transformations, eliminating the need for temporary tables. By transforming data during loading, you can streamline your ETL process effectively. Here are practical ways to enhance data loading with this feature:

- **Loading a subset of data columns**: Allows you to selectively import specific columns from a dataset, focusing on the data that is relevant to your analysis or application.

- **Reordering columns during load**: Enables you to change the order of columns while loading data, ensuring the desired column arrangement for better data organization or alignment with specific requirements.

- **Converting datatypes during load**: Provides the ability to convert datatypes of certain columns during the data loading process, allowing you to ensure consistency and compatibility with the desired data formats or analysis techniques.

- **Performing arithmetic operations during load**: Allows you to perform mathematical calculations and operations on specific columns as the data is being loaded, facilitating advanced data transformations or generating new derived data.

- **Loading data to a table with additional columns**: Enables you to load data into a table that already contains additional columns, accommodating the existing structure while mapping and inserting the data into the corresponding columns efficiently.

## Tutorials

This section provides several brief tutorials that offer practical guidance on how to transform data while loading it. Each tutorial will walk you through the data loading process in two ways: loading directly from a remote file and loading from a staged file. Please note that these tutorials are independent of each other, and you don't need to complete them in order. Feel free to follow along based on your needs.

### Before You Begin

Before you begin, you need to create a stage and generate a sample file; here is a Parquet file as an example:

```sql
CREATE STAGE my_parquet_stage;
COPY INTO @my_parquet_stage 
FROM (
    SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS id, -- Generates a sequential id
           'Name_' || CAST(number AS VARCHAR) AS name,       -- Generates a unique name for each row
           20 + MOD(number, 23) AS age,                      -- Generates an age between 20 and 42
           DATE_ADD('day', MOD(number, 60), '2022-01-01') AS onboarded -- Generates onboarded dates starting from 2022-01-01
    FROM numbers(10) -- Generating 10 rows
) 
FILE_FORMAT = (TYPE = PARQUET);
```

Query staged sample file:
```
SELECT * FROM @my_parquet_stage;
```

Result:
```
┌───────────────────────────────────────┐
│   id   │  name  │   age  │  onboarded │
├────────┼────────┼────────┼────────────┤
│      1 │ Name_0 │     20 │ 2022-01-01 │
│      2 │ Name_5 │     25 │ 2022-01-06 │
│      3 │ Name_1 │     21 │ 2022-01-02 │
│      4 │ Name_6 │     26 │ 2022-01-07 │
│      5 │ Name_7 │     27 │ 2022-01-08 │
│      6 │ Name_2 │     22 │ 2022-01-03 │
│      7 │ Name_8 │     28 │ 2022-01-09 │
│      8 │ Name_3 │     23 │ 2022-01-04 │
│      9 │ Name_4 │     24 │ 2022-01-05 │
│     10 │ Name_9 │     29 │ 2022-01-10 │
└───────────────────────────────────────┘
```

### Tutorial 1 - Loading a Subset of Data Columns

In this tutorial, you will create a table that has fewer columns than the sample file, and then populate it with the corresponding data extracted from the sample file.

1. Create a table without the 'age' column.

```sql
CREATE TABLE employees_no_age (
  id INT,
  name VARCHAR,
  onboarded timestamp
);
```

2. Load data from the staged sample file, except for the 'age' column.

```
-- Load from staged file
COPY INTO employees_no_age
FROM (
    SELECT t.id, 
           t.name, 
           t.onboarded 
    FROM @my_parquet_stage t
)
FILE_FORMAT = (TYPE = PARQUET)
PATTERN = '.*parquet';
```


3. Check the loaded data:

```sql
SELECT * FROM employees_no_age;
```

Result:
```
┌──────────────────────────────────────────────────────────┐
│        id       │       name       │      onboarded      │
├─────────────────┼──────────────────┼─────────────────────┤
│               1 │ Name_0           │ 2022-01-01 00:00:00 │
│               2 │ Name_5           │ 2022-01-06 00:00:00 │
│               3 │ Name_1           │ 2022-01-02 00:00:00 │
│               4 │ Name_6           │ 2022-01-07 00:00:00 │
│               5 │ Name_7           │ 2022-01-08 00:00:00 │
│               6 │ Name_2           │ 2022-01-03 00:00:00 │
│               7 │ Name_8           │ 2022-01-09 00:00:00 │
│               8 │ Name_3           │ 2022-01-04 00:00:00 │
│               9 │ Name_4           │ 2022-01-05 00:00:00 │
│              10 │ Name_9           │ 2022-01-10 00:00:00 │
└──────────────────────────────────────────────────────────┘
```

### Tutorial 2 - Reordering Columns During Load

In this tutorial, you will create a table that has the same columns as the sample file but in a different order, and then populate it with the corresponding data extracted from the sample file.

1. Create a table where the 'name' and 'age' columns are swapped.

```sql
CREATE TABLE employees_new_order (
  id INT,
  age INT,
  name VARCHAR,
  onboarded timestamp
);
```

2. Load data from the staged sample file in the new order.

```sql
-- Load from staged file
COPY INTO employees_new_order
FROM (
    SELECT 
        t.id, 
        t.age, 
        t.name, 
        t.onboarded 
    FROM @my_parquet_stage t
)
FILE_FORMAT = (TYPE = PARQUET)
PATTERN = '.*parquet';
```

3. Check the loaded data:

```sql
SELECT * FROM employees_new_order;
```
Result:
```
┌────────────────────────────────────────────────────────────────────────────┐
│        id       │       age       │       name       │      onboarded      │
├─────────────────┼─────────────────┼──────────────────┼─────────────────────┤
│               1 │              20 │ Name_0           │ 2022-01-01 00:00:00 │
│               2 │              25 │ Name_5           │ 2022-01-06 00:00:00 │
│               3 │              21 │ Name_1           │ 2022-01-02 00:00:00 │
│               4 │              26 │ Name_6           │ 2022-01-07 00:00:00 │
│               5 │              27 │ Name_7           │ 2022-01-08 00:00:00 │
│               6 │              22 │ Name_2           │ 2022-01-03 00:00:00 │
│               7 │              28 │ Name_8           │ 2022-01-09 00:00:00 │
│               8 │              23 │ Name_3           │ 2022-01-04 00:00:00 │
│               9 │              24 │ Name_4           │ 2022-01-05 00:00:00 │
│              10 │              29 │ Name_9           │ 2022-01-10 00:00:00 │
└────────────────────────────────────────────────────────────────────────────┘
```

### Tutorial 3 - Converting Datatypes During Load

In this tutorial, you will create a table that has the same columns as the sample file, except for one which will have a different data type, and then populate it with the data extracted and converted from the sample file.

1. Create a table with the 'onboarded' column of Date type.

```sql
CREATE TABLE employees_date (
  id INT,
  name VARCHAR,
  age INT,
  onboarded date
);
```

2. Load data from the staged sample file and convert the 'onboarded' column to a Date type.

```sql
-- Load from staged file
COPY INTO employees_date
FROM (
    SELECT 
        t.id, 
        t.name, 
        t.age, 
        to_date(t.onboarded) 
    FROM @my_parquet_stage t
)
FILE_FORMAT = (TYPE = PARQUET)
PATTERN = '.*parquet';
```

3. Check the loaded data:

```sql
SELECT * FROM employees_date;
```
Result:
```
┌───────────────────────────────────────────────────────────────────────┐
│        id       │       name       │       age       │    onboarded   │
│ Nullable(Int32) │ Nullable(String) │ Nullable(Int32) │ Nullable(Date) │
├─────────────────┼──────────────────┼─────────────────┼────────────────┤
│               1 │ Name_0           │              20 │ 2022-01-01     │
│               2 │ Name_5           │              25 │ 2022-01-06     │
│               3 │ Name_1           │              21 │ 2022-01-02     │
│               4 │ Name_6           │              26 │ 2022-01-07     │
│               5 │ Name_7           │              27 │ 2022-01-08     │
│               6 │ Name_2           │              22 │ 2022-01-03     │
│               7 │ Name_8           │              28 │ 2022-01-09     │
│               8 │ Name_3           │              23 │ 2022-01-04     │
│               9 │ Name_4           │              24 │ 2022-01-05     │
│              10 │ Name_9           │              29 │ 2022-01-10     │
└───────────────────────────────────────────────────────────────────────┘
```

### Tutorial 4 - Performing Arithmetic Operations During Load

In this tutorial, you will create a table with the same columns as the sample file. You will then extract and convert data from the sample file, perform arithmetic operations on the extracted data, and populate the table with the results.

1. Create a table containing exactly the same columns with the sample file:

```sql
CREATE TABLE employees_new_age (
  id INT,
  name VARCHAR,
  age INT,
  onboarded timestamp
);
```

2. Load data from the staged sample file and perform an arithmetic operation on the 'age' column to increment its values by 1 before inserting it into the target table.

```sql
-- Load from staged file
COPY INTO employees_new_age
FROM (
    SELECT 
        t.id, 
        t.name, 
        t.age + 1, 
        t.onboarded 
    FROM @my_parquet_stage t
)
FILE_FORMAT = (TYPE = PARQUET)
PATTERN = '.*parquet';
```

3. Check the loaded data:

```sql
SELECT * FROM employees_new_age
```    
Result:
```
┌────────────────────────────────────────────────────────────────────────────┐
│        id       │       name       │       age       │      onboarded      │
│ Nullable(Int32) │ Nullable(String) │ Nullable(Int32) │ Nullable(Timestamp) │
├─────────────────┼──────────────────┼─────────────────┼─────────────────────┤
│               1 │ Name_0           │              21 │ 2022-01-01 00:00:00 │
│               2 │ Name_5           │              26 │ 2022-01-06 00:00:00 │
│               3 │ Name_1           │              22 │ 2022-01-02 00:00:00 │
│               4 │ Name_6           │              27 │ 2022-01-07 00:00:00 │
│               5 │ Name_7           │              28 │ 2022-01-08 00:00:00 │
│               6 │ Name_2           │              23 │ 2022-01-03 00:00:00 │
│               7 │ Name_8           │              29 │ 2022-01-09 00:00:00 │
│               8 │ Name_3           │              24 │ 2022-01-04 00:00:00 │
│               9 │ Name_4           │              25 │ 2022-01-05 00:00:00 │
│              10 │ Name_9           │              30 │ 2022-01-10 00:00:00 │
└────────────────────────────────────────────────────────────────────────────┘
```

### Tutorial 5 - Loading to a Table with Additional Columns

In this tutorial, you will a new table that includes additional columns compared to the sample file. You'll then extract data from the sample file, and finally populate the new table with the transformed data.

1. Create a table containing more columns than the sample file:

```sql
CREATE TABLE employees_plus (
  id INT,
  name VARCHAR,
  age INT,
  onboarded timestamp,
  lastday timestamp
);
```

2. Load data from the staged sample file:

```sql
-- Load from staged file
COPY INTO employees_plus (id, name, age, onboarded)
FROM (
    SELECT 
        t.id, 
        t.name, 
        t.age, 
        t.onboarded 
    FROM @my_parquet_stage t
)
FILE_FORMAT = (TYPE = PARQUET)
PATTERN = '.*parquet';
```

3. Check the loaded data:

```sql
SELECT * FROM employees_plus;
```

Result:
```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│        id       │       name       │       age       │      onboarded      │       lastday       │
│ Nullable(Int32) │ Nullable(String) │ Nullable(Int32) │ Nullable(Timestamp) │ Nullable(Timestamp) │
├─────────────────┼──────────────────┼─────────────────┼─────────────────────┼─────────────────────┤
│               1 │ Name_0           │              20 │ 2022-01-01 00:00:00 │ NULL                │
│               2 │ Name_5           │              25 │ 2022-01-06 00:00:00 │ NULL                │
│               3 │ Name_1           │              21 │ 2022-01-02 00:00:00 │ NULL                │
│               4 │ Name_6           │              26 │ 2022-01-07 00:00:00 │ NULL                │
│               5 │ Name_7           │              27 │ 2022-01-08 00:00:00 │ NULL                │
│               6 │ Name_2           │              22 │ 2022-01-03 00:00:00 │ NULL                │
│               7 │ Name_8           │              28 │ 2022-01-09 00:00:00 │ NULL                │
│               8 │ Name_3           │              23 │ 2022-01-04 00:00:00 │ NULL                │
│               9 │ Name_4           │              24 │ 2022-01-05 00:00:00 │ NULL                │
│              10 │ Name_9           │              29 │ 2022-01-10 00:00:00 │ NULL                │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```
