---
title: 字典
---

Databend的字典功能提供了一种高效的方式，可以直接在Databend中集成和查询来自[支持的外部源](#supported-external-sources)的数据。通过作为内存中的键值存储，字典使得快速访问外部数据成为可能，而无需复杂的数据管道或传统的ETL流程。

## 字典的工作原理

在Databend中，您通过定义其结构并指定外部源来创建字典。当查询时，Databend从外部源获取所需的数据。您可以使用[DICT_GET](/sql/sql-functions/dictionary-functions/dict-get)函数高效地检索值，确保查询始终反映最新的数据。

## 支持的外部源

Databend目前支持MySQL和Redis作为字典的外部源。

## 教程

- [使用字典访问MySQL和Redis](/tutorials/integrate/access-mysql-and-redis)

    > 在本教程中，我们将指导您使用Databend中的字典访问MySQL和Redis数据。您将学习如何创建映射到这些外部数据源的字典，实现无缝的数据查询和集成。

## 使用示例

以下示例演示了如何通过使用字典将MySQL与Databend集成，从而允许您直接从Databend查询存储在MySQL中的数据。此过程涉及在MySQL中创建表，在Databend中设置相应的表，创建字典以映射数据，并使用[DICT_GET](/sql/sql-functions/dictionary-functions/dict-get)函数在查询中从字典中检索值。

### 步骤1：在MySQL中创建表

首先，在本地MySQL数据库中创建一个表。在此示例中，我们将创建一个名为`dict`的数据库和一个名为`orders`的表。

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

### 步骤2：在Databend中创建表

接下来，在Databend中创建一个相应的表，该表包括`order_id`和`customer_name`，但将从字典中查询`order_total`。

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

### 步骤3：在Databend中创建字典

现在，在Databend中创建一个字典，该字典引用MySQL中的`orders`表。

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

### 步骤4：在查询中使用`DICT_GET`

现在，您可以在Databend表的查询中结合使用[DICT_GET](/sql/sql-functions/dictionary-functions/dict-get)函数。以下是几个示例：

检索特定订单ID的订单总额：

```sql
SELECT DICT_GET(order_dict, 'order_total', 1);

-[ RECORD 1 ]-----------------------------------
dict_get(default.order_dict, 'order_total', 1): 250
```

检索所有订单的客户名称和订单总额：

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