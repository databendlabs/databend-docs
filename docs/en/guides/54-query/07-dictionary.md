---
title: Dictionary
---

Databend's dictionary feature provides an efficient way to integrate and query data from [Supported External Sources](#supported-external-sources) directly within Databend. By acting as an in-memory key-value store, the dictionary enables rapid access to external data without the need for complex data pipelines or traditional ETL processes.

## How the Dictionary Works

To use a dictionary in Databend, you first create it by defining its structure and specifying an external source. Once the dictionary is created, Databend dynamically loads the data from the source into an in-memory key-value store, making it available for quick access.

After the dictionary is set up, it acts as a real-time data cache. You can efficiently query specific values using the function [DICT_GET](/sql/sql-functions/dictionary-functions/dict-get), which retrieves data from the in-memory store without directly querying the external source each time. If the data in the external source changes, Databend automatically refreshes the dictionary to stay synchronized. This ensures that queries always reflect the latest data, maintaining both performance and real-time accuracy. 

## Supported External Sources

Databend currently supports MySQL and Redis as external sources for dictionaries.

## Tutorials

- [Accessing MySQL and Redis with Dictionaries](/tutorials/integrate/access-mysql-and-redis)

    > In this tutorial, we’ll guide you through accessing MySQL and Redis data using dictionaries in Databend. You’ll learn how to create dictionaries that map to these external data sources, enabling seamless data querying and integration.    

## Usage Example

The following example demonstrates how to integrate MySQL with Databend by using dictionaries, allowing you to query data stored in MySQL directly from Databend. This process involves creating a table in MySQL, setting up a corresponding table in Databend, creating a dictionary to map the data, and using the [DICT_GET](/sql/sql-functions/dictionary-functions/dict-get) function to retrieve values from the dictionary in your queries.

### Step 1: Create a Table in MySQL

First, create a table in your local MySQL database. For this example, we'll create a database named `dict` and a table named `orders`.

```sql
CREATE DATABASE dict;
USE dict;

CREATE TABLE orders (
   order_id INT PRIMARY KEY,
   customer_name VARCHAR(100),
   order_total INT);

INSERT INTO orders (order_id, customer_name, order_total) VALUES
(1, 'John Doe', 250),    
(2, 'Jane Smith', 175),  
(3, 'Alice Johnson', 300);
```

### Step 2: Create a Table in Databend

Next, create a corresponding table in Databend that includes the `order_id` and `customer_name`, but will query the `order_total` from the dictionary.

```sql
CREATE TABLE orders (
    order_id INT,
    customer_name VARCHAR
);

INSERT INTO orders (order_id, customer_name) VALUES
(1, 'John Doe'),
(2, 'Jane Smith'),
(3, 'Alice Johnson');
```

### Step 3: Create a Dictionary in Databend

Now, create a dictionary in Databend that references the MySQL `orders` table.

```sql
CREATE DICTIONARY order_dict
(
    order_id INT,
    customer_name STRING,
    order_total INT
)
PRIMARY KEY order_id
SOURCE(MYSQL(
    host='mysql'
    port='3306'
    username='root'
    password='admin'
    db='dict'
    table='orders'
));
```

### Step 4: Use `DICT_GET` in Queries

Now you can use the [DICT_GET](/sql/sql-functions/dictionary-functions/dict-get) function in combination with a query on the Databend table. Here are a few examples:

To retrieve order total for a specific order ID:

```sql
SELECT DICT_GET(order_dict, 'order_total', 1);

-[ RECORD 1 ]-----------------------------------
dict_get(default.order_dict, 'order_total', 1): 250
```

To retrieve customer name and order total for all orders:

```sql
SELECT
    order_id,
    customer_name,
    dict_get(order_dict, 'order_total', order_id) AS order_total
FROM
    orders;

┌──────────────────────────────────────────────────────┐
│     order_id    │   customer_name  │   order_total   │
│ Nullable(Int32) │ Nullable(String) │ Nullable(Int32) │
├─────────────────┼──────────────────┼─────────────────┤
│               1 │ John Doe         │             250 │
│               2 │ Jane Smith       │             175 │
│               3 │ Alice Johnson    │             300 │
└──────────────────────────────────────────────────────┘
```
