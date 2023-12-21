---
title: Aggregating Index
---

## What is Aggregating Index

An Aggregating Index is a specialized type of index designed to accelerate aggregation queries in Databend. It works by pre-computing and storing aggregate values like sums, averages, and counts. This index is particularly effective for queries that use the `GROUP BY` clause, as it allows for faster retrieval of aggregated data.


## Why Use Aggregating Index

The primary advantage of using an Aggregating Index is its ability to significantly speed up query performance, especially in databases with large volumes of data. This efficiency is achieved by reducing the need for full table scans and instead utilizing the pre-aggregated values in the index. This makes Aggregating Indexes ideal for analytical and reporting queries where aggregate data is frequently accessed.

:::info
Databend Aggregating Index will automatically update itself when the underlying data changes.
This means that you don't have to manually update the index every time you make changes to the data.
:::

## How to Use Aggregating Index

### Create Table

```sql
CREATE TABLE sales_data (
    id INT,
    category VARCHAR(50),
    value INT,
    timestamp DATE
);

-- Inserting a diverse set of data
INSERT INTO sales_data (id, category, value, timestamp) VALUES
    (1, 'Electronics', 100, '2023-01-01'),
    (2, 'Books', 50, '2023-01-02'),
    (3, 'Electronics', 80, '2023-01-03'),
    -- Additional rows with varying categories and values...
    (100, 'Clothing', 60, '2023-04-10');
```

### Create Aggregating Index

```sql
CREATE AGGREGATING INDEX sales_agg_index AS
SELECT
    MIN(value),
    MAX(value),
    COUNT(*)
FROM
    sales_data
GROUP BY
    category;
```

### Check Aggregating Index

```sql
EXPLAIN SELECT
    MIN(value),
    MAX(value),
FROM
    sales_data
GROUP BY
    category;
```

```sql
-[ EXPLAIN ]-----------------------------------
AggregateFinal
├── output columns: [MIN(value) (#4), MAX(value) (#5), sales_data.category (#1)]
├── group by: [category]
├── aggregate functions: [min(value), max(value)]
├── estimated rows: 4.00
└── AggregatePartial
    ├── output columns: [MIN(value) (#4), MAX(value) (#5), #_group_by_key]
    ├── group by: [category]
    ├── aggregate functions: [min(value), max(value)]
    ├── estimated rows: 4.00
    └── TableScan
        ├── table: default.docs_test.sales_data
        ├── output columns: [category (#1), value (#2)]
        ├── read rows: 4
        ├── read bytes: 125
        ├── partitions total: 1
        ├── partitions scanned: 1
        ├── pruning stats: [segments: <range pruning: 1 to 1>, blocks: <range pruning: 1 to 1, bloom pruning: 0 to 0>]
        ├── push downs: [filters: [], limit: NONE]
        ├── aggregating index: [SELECT COUNT(), MAX(value), MIN(value), category FROM docs_test.sales_data GROUP BY category] -- Aggregating index is used
        ├── rewritten query: [selection: [index_col_0 (#0), index_col_3 (#3), index_col_2 (#2)]]
        └── estimated rows: 4.00
```

Now, these queries can be accelerated by the aggregating index, which includes `MIN(value)`, `MAX(value)`, `COUNT(*)` with `GROUP BY category` clause, like:
```sql
SELECT MIN(value) FROM sales_data GROUP BY category;
SELECT MAX(value) FROM sales_data GROUP BY category;
SELECT COUNT(*) FROM sales_data GROUP BY category;
```

### Drop Aggregating Index

```sql
DROP AGGREGATING INDEX sales_agg_index;
```