---
title: 通用表表达式 (CTEs)
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于: v1.2.530"/>

Databend 支持使用 WITH 子句的通用表表达式 (CTEs)，允许你定义一个或多个命名的临时结果集，供后续查询使用。术语“临时”意味着这些结果集不会永久存储在数据库架构中。它们仅作为临时视图，供后续查询访问。

当执行带有 WITH 子句的查询时，WITH 子句中的 CTEs 首先被评估和执行。这会产生一个或多个临时结果集。然后，查询使用由 WITH 子句产生的临时结果集执行。

这是一个简单的演示，帮助你理解查询中 CTEs 的工作原理：WITH 子句定义了一个 CTE，并生成一个结果集，其中包含所有来自魁北克省的客户。主查询从魁北克省的客户中筛选出居住在蒙特利尔地区的客户。

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

CTEs 简化了使用子查询的复杂查询，并使你的代码更易于阅读和维护。如果不使用 CTE，前面的示例将如下所示：

```sql
SELECT customername
FROM   (SELECT customername,
               city
        FROM   customers
        WHERE  province = 'Québec')
WHERE  city = 'Montréal'
ORDER  BY customername;
```

## 内联或物化？

在使用查询中的 CTE 时，你可以通过使用 MATERIALIZED 关键字来控制 CTE 是内联还是物化。内联意味着 CTE 的定义直接嵌入到主查询中，而物化 CTE 意味着计算其结果一次并将其存储在内存中，减少重复的 CTE 执行。

假设我们有一个名为 _orders_ 的表，存储客户订单信息，包括订单号、客户 ID 和订单日期。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Inline" label="Inline" default>

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
  <TabItem value="Materialized" label="Materialized">

在这种情况下，我们使用 MATERIALIZED 关键字，这意味着 CTE _customer_orders_ 不会被内联。相反，CTE 的结果将在 CTE 定义执行时计算并存储在内存中。当在主查询中执行 CTE 的两个实例时，Databend 将直接从内存中检索结果，避免重复计算，并可能提高性能。

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

这可以显著提高性能，在 CTE 的结果被多次使用的情况下。然而，由于 CTE 不再内联，查询优化器可能难以将 CTE 的条件推入主查询或优化连接顺序，可能导致整体查询性能下降。

  </TabItem>
</Tabs>

## 语法

```sql
WITH
        <cte_name1> [ ( <cte_column_list> ) ] AS [MATERIALIZED] ( SELECT ...  )
    [ , <cte_name2> [ ( <cte_column_list> ) ] AS [MATERIALIZED] ( SELECT ...  ) ]
    [ , <cte_nameN> [ ( <cte_column_list> ) ] AS [MATERIALIZED] ( SELECT ...  ) ]
SELECT ... | UPDATE ... | DELETE FROM ...
```

| 参数                    | 描述                                                                   |
| ----------------------- | ---------------------------------------------------------------------- |
| WITH                    | 启动 WITH 子句。                                                       |
| cte_name1 ... cte_nameN | CTE 的名称。当你有多个 CTE 时，用逗号将它们分开。                      |
| cte_column_list         | CTE 中列的名称。CTE 可以引用在同一 WITH 子句中定义在其之前的任何 CTE。 |
| MATERIALIZED            | `Materialized` 是一个可选关键字，用于指示 CTE 是否应该被物化。         |

## 递归 CTEs

递归 CTE 是一个临时结果集，它引用自身来执行递归操作，允许处理层次或递归数据结构。

### 语法

```sql
WITH RECURSIVE <cte_name> AS (
    <initial_query>
    UNION ALL
    <recursive_query> )
SELECT ...
```

| 参数              | 描述                                                                                                                                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cte_name`        | CTE 的名称。                                                                                                                                                                                            |
| `initial_query`   | 初始查询，在递归开始时执行一次，通常返回一组行。                                                                                                                                                        |
| `recursive_query` | 引用 CTE 本身的查询，重复执行直到返回空结果集。此查询必须包含对 CTE 名称的引用。查询中不得包含聚合函数（如 MAX, MIN, SUM, AVG, COUNT）、窗口函数、GROUP BY 子句、ORDER BY 子句、LIMIT 子句或 DISTINCT。 |

### 工作原理

以下描述了递归 CTE 的详细执行顺序：

1. **初始查询执行**：此查询形成基础结果集，记为 R0。该结果集为递归提供起点。

2. **递归查询执行**：此查询使用前一次迭代的结果集（从 R0 开始）作为输入，并产生新的结果集（Ri+1）。

3. **迭代与组合**：递归执行持续迭代进行。递归查询每次产生的新结果集（Ri）成为下一次迭代的输入。此过程重复直至递归查询返回空结果集，表明终止条件已满足。

4. **最终结果集形成**：使用 `UNION ALL` 操作符，将每次迭代的结果集（R0 至 Rn）合并成单一结果集。`UNION ALL` 操作符确保每个结果集中的所有行均包含在最终合并结果中。

5. **最终选择**：最终的 `SELECT ...` 语句从 CTE 中检索合并结果集。此语句可在合并结果集上应用额外的过滤、排序或其他操作，以产生最终输出。

## 使用示例

### 非递归 CTE

假设您管理着位于 GTA 地区不同区域的多家书店，并使用一张表来记录它们的店铺 ID、区域以及上个月的交易量。

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

以下代码返回交易量低于平均水平的店铺：

```sql
-- 定义包含一个 CTE 的 WITH 子句
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

以下代码返回各区域的平均和总交易量：

```sql
-- 定义包含两个 CTE 的 WITH 子句
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
├──────────────────┼─────────────────────┼─────────────────────┤
│ North York       │                7645 │               15290 │
│ Downtown         │               17035 │               34070 │
│ Markham          │                5535 │               11070 │
│ Mississauga      │                4990 │                4990 │
└──────────────────────────────────────────────────────────────┘
```

以下代码将各店铺的交易量更新为 0，条件是其交易量低于各自区域的平均交易量：

```sql
WITH region_avg_sales_cte AS (
    SELECT region, AVG(amount) AS avg_sales
    FROM sales
    GROUP BY region
)
UPDATE sales
SET amount = 0
WHERE amount < (
    SELECT avg_sales
    FROM region_avg_sales_cte AS cte
    WHERE cte.region = sales.region
);
```

假设我们还有一张名为 "store_details" 的表，其中包含每个店铺的额外信息，如店铺的开业日期和店主。

```sql
CREATE TABLE store_details (
    storeid INTEGER,
    store_name TEXT,
    opening_date DATE,
    owner TEXT
);

INSERT INTO store_details VALUES (1, 'North York Store', '2022-01-01', 'John Doe');
INSERT INTO store_details VALUES (12, 'Downtown Store', '2022-02-15', 'Jane Smith');
INSERT INTO store_details VALUES (3, 'Markham Store', '2021-12-10', 'Michael Johnson');
INSERT INTO store_details VALUES (9, 'Mississauga Store', '2022-03-20', 'Emma Brown');
INSERT INTO store_details VALUES (5, 'Scarborough Store', '2022-04-05', 'David Lee');
```

我们希望删除 "store_details" 表中与 "sales" 表中无销售记录的店铺对应的行：

```sql
WITH stores_with_sales AS (
    SELECT DISTINCT storeid
    FROM sales
)
DELETE FROM store_details
WHERE storeid NOT IN (SELECT storeid FROM stores_with_sales);
```

### 递归 CTE

首先，我们创建一个表来存储员工数据，包括他们的 ID、姓名和经理 ID。

```sql
CREATE TABLE Employees (
    EmployeeID INT,
    EmployeeName VARCHAR(100),
    ManagerID INT
);
```

接下来，我们向表中插入示例数据，以表示一个简单的组织结构。

```sql
INSERT INTO Employees (EmployeeID, EmployeeName, ManagerID) VALUES
(1, 'Alice', NULL),     -- Alice 是 CEO
(2, 'Bob', 1),          -- Bob 向 Alice 报告
(3, 'Charlie', 1),      -- Charlie 向 Alice 报告
(4, 'David', 2),        -- David 向 Bob 报告
(5, 'Eve', 2),          -- Eve 向 Bob 报告
(6, 'Frank', 3);        -- Frank 向 Charlie 报告
```

现在，我们使用递归 CTE 来查找特定经理（例如 Alice，员工 ID = 1）下属的员工层级结构。

```sql
WITH RECURSIVE EmployeeHierarchy AS (
    -- 初始查询：从指定的经理（Alice）开始
    SELECT EmployeeID, EmployeeName, ManagerID
    FROM Employees
    WHERE ManagerID IS NULL  -- Alice，因为她没有经理
    UNION ALL
    -- 递归查询：查找当前级别的下属员工
    SELECT e.EmployeeID, e.EmployeeName, e.ManagerID
    FROM Employees e
    INNER JOIN EmployeeHierarchy eh ON e.ManagerID = eh.EmployeeID
)
SELECT * FROM EmployeeHierarchy;
```

输出将列出 Alice 下属的所有员工：

```sql
┌──────────────────────────────────────────────────────┐
│    employeeid   │   employeename   │    managerid    │
├─────────────────┼──────────────────┼─────────────────┤
│               1 │ Alice            │            NULL │
│               2 │ Bob              │               1 │
│               3 │ Charlie          │               1 │
│               4 │ David            │               2 │
│               5 │ Eve              │               2 │
│               6 │ Frank            │               3 │
└──────────────────────────────────────────────────────┘
```
