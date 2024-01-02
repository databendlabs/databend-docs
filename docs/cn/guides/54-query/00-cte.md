---
title: 公共表表达式（CTEs）
---

Databend 支持带有 WITH 子句的公共表表达式（CTEs），允许您定义一个或多个命名的临时结果集，供后续查询使用。"临时"一词意味着结果集不会永久存储在数据库架构中。它们仅作为临时视图，只能被后续查询访问。

当执行带有 WITH 子句的查询时，WITH 子句中的 CTEs 首先被评估和执行。这会产生一个或多个临时结果集。然后使用 WITH 子句产生的临时结果集执行查询。

这是一个简单的演示，帮助您理解 CTEs 在查询中的工作方式：WITH 子句定义了一个 CTE 并产生了一个结果集，该结果集包含所有来自魁北克省的客户。主查询从魁北克省的客户中筛选出居住在蒙特利尔地区的客户。

```sql
WITH customers_in_quebec
     AS (SELECT customername,
                city
         FROM   customers
         WHERE  province = 'Québec')
SELECT customername
FROM   customers_in_quebec
WHERE  city = 'Montréal'
ORDER  BY customername;
```

CTEs 简化了使用子查询的复杂查询，并使您的代码更易于阅读和维护。如果不使用 CTE，前面的示例将会是这样：

```sql
SELECT customername
FROM   (SELECT customername,
               city
        FROM   customers
        WHERE  province = 'Québec')
WHERE  city = 'Montréal'
ORDER  BY customername;
```

## 内联还是物化？

在查询中使用 CTE 时，您可以通过使用 MATERIALIZED 关键字来控制 CTE 是内联还是物化。内联意味着 CTE 的定义直接嵌入到主查询中，而物化 CTE 意味着一次计算其结果并将其存储在内存中，减少重复的 CTE 执行。

假设我们有一个名为 _orders_ 的表，存储客户订单信息，包括订单号、客户 ID 和订单日期。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Inline" label="内联" default>

在这个查询中，CTE _customer_orders_ 将在查询执行期间内联。Databend 将直接将 _customer_orders_ 的定义嵌入到主查询中。

```sql
WITH customer_orders AS (
    SELECT customer_id, COUNT(*) AS order_count
    FROM orders
    GROUP BY customer_id
)
SELECT co1.customer_id, co1.order_count, co2.order_count AS other_order_count
FROM customer_orders co1
JOIN customer_orders co2 ON co1.customer_id = co2.customer_id
WHERE co1.order_count > 2
  AND co2.order_count > 5;
```

  </TabItem>
  <TabItem value="Materialized" label="物化">

在这种情况下，我们使用了 MATERIALIZED 关键字，这意味着 CTE _customer_orders_ 将不会内联。相反，在执行 CTE 定义时，CTE 的结果将被计算并存储在内存中。在主查询中执行 CTE 的两个实例时，Databend 将直接从内存中检索结果，避免了重复的计算，并可能提高性能。

```sql
WITH customer_orders AS MATERIALIZED (
    SELECT customer_id, COUNT(*) AS order_count
    FROM orders
    GROUP BY customer_id
)
SELECT co1.customer_id, co1.order_count, co2.order_count AS other_order_count
FROM customer_orders co1
JOIN customer_orders co2 ON co1.customer_id = co2.customer_id
WHERE co1.order_count > 2
  AND co2.order_count > 5;
```

这可以显著提高性能，特别是在 CTE 的结果被多次使用的情况下。然而，由于 CTE 不再内联，查询优化器可能难以将 CTE 的条件推入主查询或优化连接顺序，可能导致整体查询性能下降。

  </TabItem>
</Tabs>

## 语法

```sql
WITH
        <cte_name1> [ ( <cte_column_list> ) ] AS [MATERIALIZED] ( SELECT ...  )
    [ , <cte_name2> [ ( <cte_column_list> ) ] AS [MATERIALIZED] ( SELECT ...  ) ]
    [ , <cte_nameN> [ ( <cte_column_list> ) ] AS [MATERIALIZED] ( SELECT ...  ) ]
SELECT ...
```

| 参数                    | 描述                                                                  |
| ----------------------- | --------------------------------------------------------------------- |
| WITH                    | 开始 WITH 子句。                                                      |
| cte_name1 ... cte_nameN | CTE 的名称。当您有多个 CTE 时，用逗号分隔它们。                       |
| cte_column_list         | CTE 中的列名。一个 CTE 可以引用同一个 WITH 子句中定义的任何其他 CTE。 |
| MATERIALIZED            | “物化”是在定义 CTE 时使用的可选关键字，用来指示 CTE 是否应该物化。    |
| SELECT ...              | CTE 主要与 SELECT 语句一起使用。                                      |

## 使用示例

假设您管理位于 GTA 地区不同地区的几家书店，并使用一个表来保存它们的店铺 ID、地区和上个月的交易量。

```sql
CREATE TABLE sales
  (
     storeid INTEGER,
     region  TEXT,
     amount  INTEGER
  );

INSERT INTO sales VALUES (1, 'North York', 12800);
INSERT INTO sales VALUES (2, 'Downtown', 28400);
INSERT INTO sales VALUES (3, 'Markham', 6720);
INSERT INTO sales VALUES (4, 'Mississauga', 4990);
INSERT INTO sales VALUES (5, 'Downtown', 5670);
INSERT INTO sales VALUES (6, 'Markham', 4350);
INSERT INTO sales VALUES (7, 'North York', 2490);
```

以下代码返回交易量低于平均值的商店：

```sql
-- 定义一个包含一个CTE的WITH子句
WITH avg_all
     AS (SELECT Avg(amount) AVG_SALES
         FROM   sales)
SELECT *
FROM   sales,
       avg_all
WHERE  sales.amount < avg_sales;
```

输出：

```text
┌──────────────────────────────────────────────────────────────────────────┐
│     storeid     │      region      │      amount     │     avg_sales     │
├─────────────────┼──────────────────┼─────────────────┼───────────────────┤
│               5 │ Downtown         │            5670 │ 9345.714285714286 │
│               4 │ Mississauga      │            4990 │ 9345.714285714286 │
│               7 │ North York       │            2490 │ 9345.714285714286 │
│               3 │ Markham          │            6720 │ 9345.714285714286 │
│               6 │ Markham          │            4350 │ 9345.714285714286 │
└──────────────────────────────────────────────────────────────────────────┘
```

以下代码返回每个地区的平均和总交易量：

```sql
-- 定义一个包含两个CTE的WITH子句
WITH avg_by_region
     AS (SELECT region,
                Avg (amount) avg_by_region_value
         FROM   sales
         GROUP  BY region),
     sum_by_region
     AS (SELECT region,
                Sum(amount) sum_by_region_value
         FROM   sales
         GROUP  BY region)
SELECT avg_by_region.region,
       avg_by_region_value,
       sum_by_region_value
FROM   avg_by_region,
       sum_by_region
WHERE  avg_by_region.region = sum_by_region.region;
```

输出：

```text
┌──────────────────────────────────────────────────────────────┐
│      region      │ avg_by_region_value │ sum_by_region_value │
│ Nullable(String) │  Nullable(Float64)  │   Nullable(Int64)   │
├──────────────────┼─────────────────────┼─────────────────────┤
│ North York       │                7645 │               15290 │
│ Downtown         │               17035 │               34070 │
│ Markham          │                5535 │               11070 │
│ Mississauga      │                4990 │                4990 │
└──────────────────────────────────────────────────────────────┘
```
