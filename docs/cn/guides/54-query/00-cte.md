---
title: 通用表表达式（Common Table Expression，CTE）
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.530"/>

Databend 支持带有 WITH 子句的通用表表达式（CTE），允许您定义一个或多个命名的临时结果集，供后续查询使用。"临时"表示结果集不会永久存储在数据库模式中，它们仅作为临时视图供后续查询访问。

执行带 WITH 子句的查询时，会先评估并执行 WITH 子句中的 CTE，生成一个或多个临时结果集。随后主查询将使用这些临时结果集进行执行。

以下简单示例演示 CTE 在查询中的工作原理：WITH 子句定义 CTE 并生成包含魁北克省所有客户的结果集，主查询则从该结果集中筛选居住在蒙特利尔地区的客户。

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

CTE 可简化使用子查询的复杂查询，提升代码可读性和可维护性。若不使用 CTE，前例将变为：

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

查询中使用 CTE 时，可通过 MATERIALIZED 关键字控制 CTE 为内联或物化。内联表示 CTE 定义直接嵌入主查询，物化则会将 CTE 结果计算一次后存入内存，减少重复执行。

假设存在存储客户订单信息的 *orders* 表，包含订单号、客户 ID 和订单日期。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Inline" label="内联" default>

此查询中 CTE *customer_orders* 将在执行时内联，Databend 会将其定义直接嵌入主查询。

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

使用 MATERIALIZED 关键字时，CTE *customer_orders* 不会内联。其定义执行时会计算结果并存入内存，主查询中执行 CTE 实例时，Databend 直接从内存获取结果，避免冗余计算并可能提升性能。

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
此方式可显著提升多次使用 CTE 结果时的性能。但 CTE 不再内联后，查询优化器可能难以将 CTE 条件推入主查询或优化连接顺序，导致整体查询性能下降。

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

| 参数             | 描述                                                                 |
|------------------|----------------------------------------------------------------------|
| WITH             | 启动 WITH 子句                                                      |
| cte_name1 ... N  | CTE 名称，多个 CTE 需用逗号分隔                                     |
| cte_column_list  | CTE 中的列名，可引用同一 WITH 子句中先前定义的 CTE                  |
| MATERIALIZED     | 可选关键字，指示是否物化 CTE                                        |

## 递归 CTE

递归 CTE 是通过自引用执行递归操作的临时结果集，用于处理层次化或递归数据结构。

### 语法

```sql
WITH RECURSIVE <cte_name> AS (
    <initial_query>
    UNION ALL
    <recursive_query> )
SELECT ... 
```

| 参数             | 描述                                                                 |
|------------------|----------------------------------------------------------------------|
| `cte_name`       | CTE 名称                                                            |
| `initial_query`  | 递归起始时执行一次的初始查询，通常返回行集合                        |
| `recursive_query`| 自引用 CTE 的查询，重复执行直至返回空集，禁止包含聚合函数、窗口函数、GROUP BY、ORDER BY、LIMIT 或 DISTINCT |

### 工作原理

递归 CTE 执行顺序如下：

1. **初始查询执行**：形成基础结果集 R0，作为递归起点
2. **递归查询执行**：使用前次迭代结果集（从 R0 开始）作为输入，生成新结果集 Ri+1
3. **迭代与组合**：递归执行持续迭代，新结果集 Ri 成为下次迭代输入，直至返回空集（终止条件满足）
4. **最终结果集形成**：使用 `UNION ALL` 合并各次迭代结果集（R0 至 Rn）
5. **最终选择**：通过 `SELECT ...` 从 CTE 检索合并结果集，可进行额外过滤、排序等操作

## 使用示例

### 非递归 CTE

假设管理大多伦多地区多家书店，使用表存储店铺 ID、区域和上月交易量：

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

返回交易量低于平均值的店铺：

```sql
-- 含单个 CTE 的 WITH 子句
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

返回各区域平均和总交易量：

```sql
-- 含两个 CTE 的 WITH 子句
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

将低于区域平均销售额的店铺交易量更新为 0：

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

假设存在存储店铺补充信息的 *store_details* 表：

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

删除 *store_details* 中无销售记录的店铺：

```sql
WITH stores_with_sales AS (
    SELECT DISTINCT storeid
    FROM sales
)
DELETE FROM store_details
WHERE storeid NOT IN (SELECT storeid FROM stores_with_sales);
```

### 递归 CTE 

创建存储员工 ID、姓名和经理 ID 的表：

```sql
CREATE TABLE Employees (
    EmployeeID INT,
    EmployeeName VARCHAR(100),
    ManagerID INT
);
```

插入样本数据表示组织结构：

```sql
INSERT INTO Employees (EmployeeID, EmployeeName, ManagerID) VALUES
(1, 'Alice', NULL),     -- Alice 是 CEO
(2, 'Bob', 1),          -- Bob 向 Alice 汇报
(3, 'Charlie', 1),      -- Charlie 向 Alice 汇报
(4, 'David', 2),        -- David 向 Bob 汇报
(5, 'Eve', 2),          -- Eve 向 Bob 汇报
(6, 'Frank', 3);        -- Frank 向 Charlie 汇报
```

使用递归 CTE 查找特定经理（如 Alice）下属的员工层级：

```sql
WITH RECURSIVE EmployeeHierarchy AS (
    -- 从 Alice (CEO) 开始
    SELECT EmployeeID, EmployeeName, managerid, EmployeeName as LeaderName
    FROM Employees
    WHERE EmployeeID=1
    UNION ALL
    -- 递归查找当前层级的汇报员工
    SELECT e.EmployeeID, e.EmployeeName, e.managerid, eh.EmployeeName
    FROM Employees e
    JOIN EmployeeHierarchy eh ON e.ManagerID = eh.EmployeeID
)
SELECT * FROM  EmployeeHierarchy;
```

输出 Alice 下属的所有员工：

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