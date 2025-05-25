---
title: 公共表表达式 (CTE)
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.530"/>

Databend 支持使用 WITH 子句的公共表表达式 (CTE)，允许您定义一个或多个命名临时结果集供后续查询使用。"临时"意味着这些结果集不会永久存储在数据库模式中，它们仅作为临时视图供后续查询访问。

当执行带有 WITH 子句的查询时，WITH 子句中的 CTE 会首先被评估和执行，生成一个或多个临时结果集。然后查询会使用这些由 WITH 子句生成的临时结果集来执行。

以下是一个简单示例，帮助您理解 CTE 在查询中的工作原理：WITH 子句定义了一个 CTE，生成包含魁北克省所有客户的结果集。主查询则从魁北克省的客户中筛选出居住在蒙特利尔地区的客户。

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

CTE 可以简化使用子查询的复杂查询，使代码更易于阅读和维护。如果不使用 CTE，上述示例将如下所示：

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

在查询中使用 CTE 时，您可以通过 MATERIALIZED 关键字控制 CTE 是内联还是物化。内联意味着 CTE 的定义直接嵌入主查询中，而物化 CTE 意味着计算其结果并存储在内存中，减少重复执行 CTE 的开销。

假设我们有一个名为 *orders* 的表，存储客户订单信息，包括订单号、客户 ID 和订单日期。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Inline" label="内联" default>

在此查询中，CTE *customer_orders* 将在查询执行时内联。Databend 会直接将 *customer_orders* 的定义嵌入主查询中。

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

在这种情况下，我们使用 MATERIALIZED 关键字，意味着 CTE *customer_orders* 不会被内联。相反，CTE 的结果将在 CTE 定义执行时计算并存储在内存中。当在主查询中使用 CTE 的两个实例时，Databend 会直接从内存中获取结果，避免冗余计算，可能提高性能。

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
当 CTE 结果被多次使用时，这可以显著提高性能。但由于 CTE 不再内联，查询优化器可能难以将 CTE 的条件推入主查询或优化连接顺序，可能导致整体查询性能下降。

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

| 参数               	| 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           	|
|-------------------------	|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| WITH                    	| 开始 WITH 子句。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            	|
| cte_name1 ... cte_nameN 	| CTE 名称。当有多个 CTE 时，用逗号分隔。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                	|
| cte_column_list         	| CTE 中的列名。一个 CTE 可以引用同一 WITH 子句中之前定义的其他 CTE。                                                                                                                                                                                                                                                                                                                                                                                                                                                                     	|
| MATERIALIZED            	| `Materialized` 是一个可选关键字，用于指示是否应将 CTE 物化。	|

## 递归 CTE

递归 CTE 是一种通过自我引用来执行递归操作的临时结果集，允许处理层次结构或递归数据结构。

### 语法

```sql
WITH RECURSIVE <cte_name> AS (
    <initial_query>
    UNION ALL
    <recursive_query> )
SELECT ... 
```

| 参数              | 描述                                                                                                                                                                                                                                                                                 |
|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `cte_name`        | CTE 名称。   |
| `initial_query`   | 递归开始时执行一次的初始查询，通常返回一组行数据。                                                                                                                                                                                  |
| `recursive_query` | 引用 CTE 自身并重复执行的查询，直到返回空结果集为止。必须包含对 CTE 名称的引用。该查询不得包含聚合函数（如 MAX、MIN、SUM、AVG、COUNT）、窗口函数、GROUP BY 子句、ORDER BY 子句、LIMIT 子句或 DISTINCT。 |

### 工作原理

递归 CTE 的详细执行顺序如下：

1. **初始查询执行**：该查询形成基础结果集 R0，为递归提供起点。

2. **递归查询执行**：该查询使用前一次迭代的结果集（从 R0 开始）作为输入，生成新的结果集 Ri+1。

3. **迭代与合并**：递归执行持续进行迭代。每个新结果集 Ri 成为下一次迭代的输入。此过程重复进行，直到递归查询返回空结果集，表示终止条件已满足。

4. **最终结果集形成**：使用 `UNION ALL` 操作符将每次迭代的结果集（R0 到 Rn）合并为单一结果集。`UNION ALL` 确保所有迭代结果集中的行都被包含在最终合并结果中。

5. **最终选择**：最后的 `SELECT ...` 语句从 CTE 中检索合并后的结果集。该语句可对合并结果集应用额外的过滤、排序或其他操作以生成最终输出。

## 使用示例

### 非递归 CTE

假设您管理位于 GTA 地区不同区域的几家书店，并使用一个表存储它们的店铺 ID、区域和上月的交易额。

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

以下代码返回交易额低于平均值的店铺：

```sql
-- 定义一个包含单个 CTE 的 WITH 子句
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

以下代码返回每个区域的平均交易额和总交易额：

```sql
-- 定义一个包含两个 CTE 的 WITH 子句
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

以下代码将销售额低于所在区域平均值的店铺销售额更新为 0：

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

假设我们有另一个名为 "store_details" 的表，包含每家店铺的额外信息，如开业日期和所有者。

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

我们想从 "store_details" 表中删除那些在 "sales" 表中没有销售记录的店铺：

```sql
WITH stores_with_sales AS (
    SELECT DISTINCT storeid
    FROM sales
)
DELETE FROM store_details
WHERE storeid NOT IN (SELECT storeid FROM stores_with_sales);
```

### 递归 CTE 

首先创建一个表存储员工数据，包括他们的 ID、姓名和上级 ID。

```sql
CREATE TABLE Employees (
    EmployeeID INT,
    EmployeeName VARCHAR(100),
    ManagerID INT
);
```

然后插入示例数据以表示简单的组织结构。

```sql
INSERT INTO Employees (EmployeeID, EmployeeName, ManagerID) VALUES
(1, 'Alice', NULL),     -- Alice 是 CEO
(2, 'Bob', 1),          -- Bob 向 Alice 汇报
(3, 'Charlie', 1),      -- Charlie 向 Alice 汇报
(4, 'David', 2),        -- David 向 Bob 汇报
(5, 'Eve', 2),          -- Eve 向 Bob 汇报
(6, 'Frank', 3);        -- Frank 向 Charlie 汇报
```

现在使用递归 CTE 查找特定管理者（如 Alice，EmployeeID = 1）下属的员工层级关系。

```sql
WITH RECURSIVE EmployeeHierarchy AS (
    -- 从 Alice（CEO）开始
    SELECT EmployeeID, EmployeeName, managerid, EmployeeName as LeaderName
    FROM Employees
    WHERE EmployeeID=1
    UNION ALL
    -- 递归查找向当前层级汇报的员工
    SELECT e.EmployeeID, e.EmployeeName, e.managerid, eh.EmployeeName
    FROM Employees e
    JOIN EmployeeHierarchy eh ON e.ManagerID = eh.EmployeeID
)
SELECT * FROM  EmployeeHierarchy;
```

输出将列出 Alice 下属的所有员工层级关系：

```sql
┌─────────────────────────────────────────────────────────────────────────┐
│    employeeid   │   employeename   │    managerid    │    leadername    │
├─────────────────┼──────────────────┼─────────────────┼──────────────────┤
│               1 │ Alice            │            NULL │ Alice            │
│               2 │ Bob              │               1 │ Alice            │
│               3 │ Charlie          │               1 │ Alice            │
│               4 │ David            │               2 │ Bob              │
│               5 │ Eve              │               2 │ Bob              │
│               6 │ Frank            │               3 │ Charlie          │
└─────────────────────────────────────────────────────────────────────────┘
```