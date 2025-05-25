---
title: Common Table Expressions (CTE)
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.530"/>

Databend supports common table expressions (CTEs) with a WITH clause, allowing you to define one or multiple named temporary result sets used by the following query. The term "temporary" implies that the result sets are not permanently stored in the database schema. They act as temporary views only accessible to the following query.

When a query with a WITH clause is executed, the CTEs within the WITH clause are evaluated and executed first. This produces one or multiple temporary result sets. Then the query is executed using the temporary result sets that were produced by the WITH clause. 

This is a simple demonstration that helps you understand how CTEs work in a query: The WITH clause defines a CTE and produces a result set that holds all customers who are from the Québec province. The main query filters the customers who live in the Montréal region from the ones in the Québec province.

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

CTEs simplify complex queries that use subqueries and make your code easier to read and maintain. The preceding example would be like this without using a CTE:

```sql
SELECT customername 
FROM   (SELECT customername, 
               city 
        FROM   customers 
        WHERE  province = 'Québec') 
WHERE  city = 'Montréal' 
ORDER  BY customername; 
```

## Inline or Materialized?

When using a CTE in a query, you can control whether the CTE is inline or materialized by using the MATERIALIZED keyword. Inlining means the CTE's definition is directly embedded within the main query, while materializing the CTE means calculating its result once and storing it in memory, reducing repetitive CTE execution.

Suppose we have a table called *orders*, storing customer order information, including order number, customer ID, and order date.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Inline" label="Inline" default>

In this query, the CTE *customer_orders* will be inlined during query execution. Databend will directly embed the definition of *customer_orders* within the main query.

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

In this case, we use the MATERIALIZED keyword, which means the CTE *customer_orders* will not be inlined. Instead, the CTE's result will be calculated and stored in memory during the CTE definition's execution. When executing both instances of the CTE within the main query, Databend will directly retrieve the result from memory, avoiding redundant calculations and potentially improving performance.

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
This can significantly improve performance for situations where the CTE's result is used multiple times. However, as the CTE is no longer inlined, the query optimizer may find it difficult to push the CTE's conditions into the main query or optimize the join order, potentially leading to decreased overall query performance.

  </TabItem>
</Tabs>


## Syntax

```sql    
WITH
        <cte_name1> [ ( <cte_column_list> ) ] AS [MATERIALIZED] ( SELECT ...  )
    [ , <cte_name2> [ ( <cte_column_list> ) ] AS [MATERIALIZED] ( SELECT ...  ) ]
    [ , <cte_nameN> [ ( <cte_column_list> ) ] AS [MATERIALIZED] ( SELECT ...  ) ]
SELECT ... | UPDATE ... | DELETE FROM ...
```

| Parameter               	| Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           	|
|-------------------------	|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| WITH                    	| Initiates the WITH clause.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            	|
| cte_name1 ... cte_nameN 	| The CTE names. When you have multiple CTEs, separate them with commas.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                	|
| cte_column_list         	| The names of the columns in the CTE. A CTE can refer to any CTEs in the same WITH clause that are defined before.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     	|
| MATERIALIZED            	| `Materialized` is an optional keyword used to indicate whether the CTE should be materialized. 	|

## Recursive CTEs

A recursive CTE is a temporary result set that references itself to perform recursive operations, allowing the processing of hierarchical or recursive data structures.

### Syntax

```sql
WITH RECURSIVE <cte_name> AS (
    <initial_query>
    UNION ALL
    <recursive_query> )
SELECT ... 
```

| Parameter         | Description                                                                                                                                                                                                                                                                                 |
|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `cte_name`        | The CTE name.   |
| `initial_query`   | The initial query that is executed once at the start of the recursion. It typically returns a set of rows.                                                                                                                                                                                  |
| `recursive_query` | The query that references the CTE itself and is executed repeatedly until an empty result set is returned. It must include a reference to the CTE's name. The query must NOT include aggregate functions (e.g., MAX, MIN, SUM, AVG, COUNT), window functions, GROUP BY clause, ORDER BY clause, LIMIT clause, or DISTINCT. |

### How it Works

The following describes the detailed execution order of a recursive CTE:

1. **Initial Query Execution**: This query forms the base result set, denoted as R0. This result set provides the starting point for the recursion.

2. **Recursive Query Execution**: This query uses the result set from the previous iteration (starting with R0) as input and produces a new result set (Ri+1).

3. **Iteration and Combination**: The recursive execution continues iteratively. Each new result set (Ri) from the recursive query becomes the input for the next iteration. This process repeats until the recursive query returns an empty result set, indicating that the termination condition has been met.

4. **Final Result Set Formation**: Using the `UNION ALL` operator, the result sets from each iteration (R0 through Rn) are combined into a single result set. The `UNION ALL` operator ensures that all rows from each result set are included in the final combined result.

5. **Final Selection**: The final `SELECT ...` statement retrieves the combined result set from the CTE. This statement can apply additional filtering, sorting, or other operations on the combined result set to produce the final output.

## Usage Examples

### Non-Recursive CTEs

Imagine you manage several bookstores located in different regions of the GTA area, and use a table to hold their store IDs, regions, and the trading volume for the last month.

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

The following code returns the stores with a trading volume lower than the average:

```sql
-- Define a WITH clause including one CTE
WITH avg_all 
     AS (SELECT Avg(amount) AVG_SALES 
         FROM   sales) 
SELECT * 
FROM   sales, 
       avg_all 
WHERE  sales.amount < avg_sales;
```

Output:

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

The following code returns the average and total volume of each region:

```sql
-- Define a WITH clause including two CTEs
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

Output:

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

The following code updates the sales amount to 0 for stores where the sales amount is below the average sales of their respective regions:

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

Let's assume we have another table called "store_details" that contains additional information about each store, such as the store's opening date and owner. 

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

We want to delete all rows from the "store_details" table that correspond to stores with no sales records in the "sales" table:

```sql
WITH stores_with_sales AS (
    SELECT DISTINCT storeid
    FROM sales
)
DELETE FROM store_details
WHERE storeid NOT IN (SELECT storeid FROM stores_with_sales);
```

### Recursive CTEs 

First, we create a table to store employee data, including their ID, name, and manager ID.

```sql
CREATE TABLE Employees (
    EmployeeID INT,
    EmployeeName VARCHAR(100),
    ManagerID INT
);
```

Next, we insert sample data into the table to represent a simple organizational structure.

```sql
INSERT INTO Employees (EmployeeID, EmployeeName, ManagerID) VALUES
(1, 'Alice', NULL),     -- Alice is the CEO
(2, 'Bob', 1),          -- Bob reports to Alice
(3, 'Charlie', 1),      -- Charlie reports to Alice
(4, 'David', 2),        -- David reports to Bob
(5, 'Eve', 2),          -- Eve reports to Bob
(6, 'Frank', 3);        -- Frank reports to Charlie
```

Now, we use a recursive CTE to find the hierarchy of employees under a specific manager, say Alice (EmployeeID = 1).

```sql
WITH RECURSIVE EmployeeHierarchy AS (
    -- Start with Alice (the CEO)
    SELECT EmployeeID, EmployeeName, managerid, EmployeeName as LeaderName
    FROM Employees
    WHERE EmployeeID=1
    UNION ALL
    -- Recursively find employees reporting to the current level
    SELECT e.EmployeeID, e.EmployeeName, e.managerid, eh.EmployeeName
    FROM Employees e
    JOIN EmployeeHierarchy eh ON e.ManagerID = eh.EmployeeID
)
SELECT * FROM  EmployeeHierarchy;
```

The output will list all employees in the hierarchy under Alice:

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