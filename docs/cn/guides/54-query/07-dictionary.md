---
title: 字典（Dictionary）
---

Databend 的字典功能提供了一种高效方式，可直接在 Databend 内集成并查询[支持的外部数据源](#supported-external-sources)的数据。作为内存键值存储，字典能快速访问外部数据，无需复杂数据管道或传统 ETL 流程。

## 字典工作原理

在 Databend 中，通过定义字典结构并指定外部数据源来创建字典。查询时，Databend 会从外部源获取所需数据。您可使用 [DICT_GET](/sql/sql-functions/dictionary-functions/dict-get) 函数高效检索值，确保查询始终反映最新数据。

## 支持的外部数据源

Databend 当前支持 MySQL 和 Redis 作为字典的外部数据源。

## 教程

- [使用字典访问 MySQL 和 Redis](/tutorials/integrate/access-mysql-and-redis)

    > 本教程将指导您使用 Databend 字典访问 MySQL 和 Redis 数据。您将学习如何创建映射这些外部源的字典，实现无缝数据查询与集成。

## 使用示例

以下示例演示如何通过字典将 MySQL 与 Databend 集成，直接从 Databend 查询 MySQL 存储的数据。流程包括：在 MySQL 建表、在 Databend 创建对应表、建立数据映射字典，以及在查询中使用 [DICT_GET](/sql/sql-functions/dictionary-functions/dict-get) 函数从字典检索值。

### 步骤 1：在 MySQL 中创建表

首先在本地 MySQL 数据库创建表。本例将创建 `dict` 数据库和 `orders` 表：

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

在 Databend 创建包含 `order_id` 和 `customer_name` 的表，`order_total` 将通过字典查询：

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

### 步骤 3：在 Databend 中创建字典

创建引用 MySQL `orders` 表的字典：

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

结合 Databend 表查询使用 [DICT_GET](/sql/sql-functions/dictionary-functions/dict-get) 函数：

检索特定订单 ID 的总额：

```sql
SELECT DICT_GET(order_dict, 'order_total', 1);

-[ RECORD 1 ]-----------------------------------
dict_get(default.order_dict, 'order_total', 1): 250
```

检索所有订单的客户名与总额：

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