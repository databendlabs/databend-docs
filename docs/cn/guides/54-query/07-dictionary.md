---
title: Dictionary
---

Databend 的 dictionary 功能提供了一种有效的方式来集成和查询来自 [支持的外部数据源](#supported-external-sources) 的数据，直接在 Databend 内部进行。通过充当内存中的键值存储，dictionary 能够快速访问外部数据，而无需复杂的数据管道或传统的 ETL 流程。

## Dictionary 的工作原理

在 Databend 中，您可以通过定义 dictionary 的结构并指定外部数据源来创建它。查询时，Databend 从外部数据源获取所需的数据。您可以使用 [DICT_GET](/sql/sql-functions/dictionary-functions/dict-get) 函数高效地检索值，确保查询始终反映最新的数据。

## 支持的外部数据源

Databend 目前支持 MySQL 和 Redis 作为 dictionary 的外部数据源。

## 教程

- [使用 Dictionary 访问 MySQL 和 Redis](/tutorials/integrate/access-mysql-and-redis)

    > 在本教程中，我们将指导您使用 Databend 中的 dictionary 访问 MySQL 和 Redis 数据。您将学习如何创建映射到这些外部数据源的 dictionary，从而实现无缝的数据查询和集成。

## 使用示例

以下示例演示了如何通过使用 dictionary 将 MySQL 与 Databend 集成，从而允许您直接从 Databend 查询存储在 MySQL 中的数据。此过程包括在 MySQL 中创建表，在 Databend 中设置相应的表，创建 dictionary 以映射数据，以及使用 [DICT_GET](/sql/sql-functions/dictionary-functions/dict-get) 函数在查询中从 dictionary 检索值。

### 步骤 1：在 MySQL 中创建表

首先，在您的本地 MySQL 数据库中创建一个表。在此示例中，我们将创建一个名为 `dict` 的数据库和一个名为 `orders` 的表。

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

### 步骤 2：在 Databend 中创建表

接下来，在 Databend 中创建一个对应的表，其中包括 `order_id` 和 `customer_name`，但将从 dictionary 查询 `order_total`。

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

### 步骤 3：在 Databend 中创建 Dictionary

现在，在 Databend 中创建一个引用 MySQL `orders` 表的 dictionary。

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

### 步骤 4：在查询中使用 `DICT_GET`

现在，您可以将 [DICT_GET](/sql/sql-functions/dictionary-functions/dict-get) 函数与 Databend 表上的查询结合使用。以下是一些示例：

要检索特定订单 ID 的订单总额：

```sql
SELECT DICT_GET(order_dict, 'order_total', 1);

-[ RECORD 1 ]-----------------------------------
dict_get(default.order_dict, 'order_total', 1): 250
```

要检索所有订单的客户名称和订单总额：

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