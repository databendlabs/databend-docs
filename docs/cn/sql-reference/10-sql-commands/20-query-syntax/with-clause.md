---
title: WITH 子句
---

WITH 子句是一个可选子句，位于 SELECT 语句主体之前，用于定义一个或多个可在语句后续部分引用的公用表表达式（CTE，Common Table Expression）。

## 语法

### 基本 CTE

```sql
[ WITH
    cte_name1 [ ( cte_column_list ) ] AS ( SELECT ... )
  [ , cte_name2 [ ( cte_column_list ) ] AS ( SELECT ... ) ]
  [ , cte_nameN [ ( cte_column_list ) ] AS ( SELECT ... ) ]
]
SELECT ...
```

### 递归 CTE

```sql
[ WITH [ RECURSIVE ]
    cte_name1 ( cte_column_list ) AS ( anchorClause UNION ALL recursiveClause )
  [ , cte_name2 ( cte_column_list ) AS ( anchorClause UNION ALL recursiveClause ) ]
  [ , cte_nameN ( cte_column_list ) AS ( anchorClause UNION ALL recursiveClause ) ]
]
SELECT ...
```

其中：
- `anchorClause`: `SELECT anchor_column_list FROM ...`
- `recursiveClause`: `SELECT recursive_column_list FROM ... [ JOIN ... ]`

## 参数

| 参数 | 描述 |
|-----------|-------------|
| `cte_name` | CTE 名称必须遵循标准标识符规则 |
| `cte_column_list` | CTE 中的列名 |
| `anchor_column_list` | 递归 CTE 中锚点子句使用的列 |
| `recursive_column_list` | 递归 CTE 中递归子句使用的列 |

## 示例

### 基本 CTE

```sql
WITH high_value_customers AS (
    SELECT customer_id, customer_name, total_spent
    FROM customers 
    WHERE total_spent > 10000
)
SELECT c.customer_name, o.order_date, o.order_amount
FROM high_value_customers c
JOIN orders o ON c.customer_id = o.customer_id
ORDER BY o.order_date DESC;
```

### 多个 CTE

```sql
WITH
  regional_sales AS (
    SELECT region, SUM(sales_amount) as total_sales
    FROM sales_data
    GROUP BY region
  ),
  top_regions AS (
    SELECT region, total_sales
    FROM regional_sales
    WHERE total_sales > 1000000
  )
SELECT r.region, r.total_sales
FROM top_regions r
ORDER BY r.total_sales DESC;
```

### 递归 CTE

```sql
WITH RECURSIVE countdown AS (
    -- 锚点子句：起始点
    SELECT 10 as num
    
    UNION ALL
    
    -- 递归子句：重复执行直到满足条件
    SELECT num - 1
    FROM countdown 
    WHERE num > 1  -- 停止条件
)
SELECT num FROM countdown 
ORDER BY num DESC;
```

## 使用须知

- CTE 是临时的命名结果集，仅在查询期间存在
- 在同一个 WITH 子句中，CTE 名称必须是唯一的
- 一个 CTE 可以引用在同一个 WITH 子句中先前定义的 CTE
- 递归 CTE 需要一个锚点子句和一个递归子句，并通过 UNION ALL 连接
- 使用递归 CTE 时，需要使用 RECURSIVE 关键字