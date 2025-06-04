---
title: 'Window Functions'
---

## Overview 

A window function operates on a group ("window") of related rows. For each input row, a window function returns one output row that depends on the specific row passed to the function and the values of the other rows in the window.

There are two main types of order-sensitive window functions:

* **Rank-related functions**: List information based on the "rank" of a row. For example, ranking stores in descending order by profit per year, the store with the most profit will be ranked 1, and the second-most profitable store will be ranked 2, and so on.

* **Window frame functions**: Enable you to perform rolling operations, such as calculating a running total or a moving average, on a subset of the rows in the window.

## Window Function Categories

Databend supports two main categories of window functions:

### 1. Dedicated Window Functions

These functions are specifically designed for window operations and provide ranking, navigation, and value analysis capabilities.

| Function | Description | Example |
|----------|-------------|---------|
| [RANK](rank.md) | Returns rank with gaps | `RANK() OVER (ORDER BY salary DESC)` → `1, 2, 2, 4, ...` |
| [DENSE_RANK](dense-rank.md) | Returns rank without gaps | `DENSE_RANK() OVER (ORDER BY salary DESC)` → `1, 2, 2, 3, ...` |
| [ROW_NUMBER](row-number.md) | Returns sequential row number | `ROW_NUMBER() OVER (ORDER BY hire_date)` → `1, 2, 3, 4, ...` |
| [CUME_DIST](cume-dist.md) | Returns cumulative distribution | `CUME_DIST() OVER (ORDER BY score)` → `0.2, 0.4, 0.8, 1.0, ...` |
| [PERCENT_RANK](percent_rank.md) | Returns relative rank (0-1) | `PERCENT_RANK() OVER (ORDER BY score)` → `0.0, 0.25, 0.75, ...` |
| [NTILE](ntile.md) | Divides rows into N groups | `NTILE(4) OVER (ORDER BY score)` → `1, 1, 2, 2, 3, 3, 4, 4, ...` |
| [FIRST_VALUE](first-value.md) | Returns first value in window | `FIRST_VALUE(product) OVER (PARTITION BY category ORDER BY sales)` |
| [LAST_VALUE](last-value.md) | Returns last value in window | `LAST_VALUE(product) OVER (PARTITION BY category ORDER BY sales)` |
| [NTH_VALUE](nth-value.md) | Returns Nth value in window | `NTH_VALUE(product, 2) OVER (PARTITION BY category ORDER BY sales)` |
| [LEAD](lead.md) | Access value from subsequent row | `LEAD(price, 1) OVER (ORDER BY date)` → next day's price |
| [LAG](lag.md) | Access value from previous row | `LAG(price, 1) OVER (ORDER BY date)` → previous day's price |
| [FIRST](first.md) | Returns first value (alias) | `FIRST(product) OVER (PARTITION BY category ORDER BY sales)` |
| [LAST](last.md) | Returns last value (alias) | `LAST(product) OVER (PARTITION BY category ORDER BY sales)` |

### 2. Aggregate Functions Used as Window Functions

These are standard aggregate functions that can be used with the OVER clause to perform window operations.

| Function | Description | Window Frame Support | Example |
|----------|-------------|---------------------|---------|  
| [SUM](../07-aggregate-functions/aggregate-sum.md) | Calculates sum over window | ✓ | `SUM(sales) OVER (PARTITION BY region ORDER BY date)` |
| [AVG](../07-aggregate-functions/aggregate-avg.md) | Calculates average over window | ✓ | `AVG(score) OVER (ORDER BY id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)` |
| [COUNT](../07-aggregate-functions/aggregate-count.md) | Counts rows over window | ✓ | `COUNT(*) OVER (PARTITION BY department)` |
| [MIN](../07-aggregate-functions/aggregate-min.md) | Returns minimum value in window | ✓ | `MIN(price) OVER (PARTITION BY category)` |
| [MAX](../07-aggregate-functions/aggregate-max.md) | Returns maximum value in window | ✓ | `MAX(price) OVER (PARTITION BY category)` |
| [ARRAY_AGG](../07-aggregate-functions/aggregate-array-agg.md) | Collects values into array | | `ARRAY_AGG(product) OVER (PARTITION BY category)` |
| [STDDEV_POP](../07-aggregate-functions/aggregate-stddev-pop.md) | Population standard deviation | ✓ | `STDDEV_POP(value) OVER (PARTITION BY group)` |
| [STDDEV_SAMP](../07-aggregate-functions/aggregate-stddev-samp.md) | Sample standard deviation | ✓ | `STDDEV_SAMP(value) OVER (PARTITION BY group)` |
| [MEDIAN](../07-aggregate-functions/aggregate-median.md) | Median value | ✓ | `MEDIAN(response_time) OVER (PARTITION BY server)` |

**Conditional Variants**

| Function | Description | Window Frame Support | Example |
|----------|-------------|---------------------|---------|  
| [COUNT_IF](../07-aggregate-functions/aggregate-count-if.md) | Conditional count | ✓ | `COUNT_IF(status = 'complete') OVER (PARTITION BY dept)` |
| [SUM_IF](../07-aggregate-functions/aggregate-sum-if.md) | Conditional sum | ✓ | `SUM_IF(amount, status = 'paid') OVER (PARTITION BY customer)` |
| [AVG_IF](../07-aggregate-functions/aggregate-avg-if.md) | Conditional average | ✓ | `AVG_IF(score, passed = true) OVER (PARTITION BY class)` |
| [MIN_IF](../07-aggregate-functions/aggregate-min-if.md) | Conditional minimum | ✓ | `MIN_IF(temp, location = 'outside') OVER (PARTITION BY day)` |
| [MAX_IF](../07-aggregate-functions/aggregate-max-if.md) | Conditional maximum | ✓ | `MAX_IF(speed, vehicle = 'car') OVER (PARTITION BY test)` |

## Window Function Syntax

```sql
<function> ( [ <arguments> ] ) OVER ( { named_window | inline_window } )
```

Where:

```sql
named_window ::= window_name

inline_window ::=
    [ PARTITION BY <expression_list> ]
    [ ORDER BY <expression_list> ]
    [ window_frame ]
```

### Key Components

| Component | Description | Example |
|-----------|-------------|--------|
| `<function>` | The window function to apply | `SUM()`, `RANK()`, etc. |
| `OVER` | Indicates window function usage | Required for all window functions |
| `PARTITION BY` | Groups rows into partitions | `PARTITION BY department` |
| `ORDER BY` | Orders rows within each partition | `ORDER BY salary DESC` |
| `window_frame` | Defines subset of rows to consider | `ROWS BETWEEN 1 PRECEDING AND CURRENT ROW` |
| `named_window` | References a window defined in WINDOW clause | `SELECT sum(x) OVER w FROM t WINDOW w AS (PARTITION BY y)` |


## Window Frame Syntax

A window frame defines which rows are included in the function calculation for each row. There are two types of window frames:

### 1. Frame Types

| Frame Type | Description | Example |
|------------|-------------|--------|
| `ROWS` | Physical row-based frame | `ROWS BETWEEN 3 PRECEDING AND CURRENT ROW` |
| `RANGE` | Logical value-based frame | `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` |

### 2. Frame Extent

| Frame Extent Pattern | Description | Example |
|----------------------|-------------|--------|
| **Cumulative Frames** | | |
| `BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` | All rows from start to current | Running total |
| `BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING` | Current row to end | Running total from current position |
| **Sliding Frames** | | |
| `BETWEEN N PRECEDING AND CURRENT ROW` | N rows before current + current | 3-day moving average |
| `BETWEEN CURRENT ROW AND N FOLLOWING` | Current + N rows after | Forward-looking calculation |
| `BETWEEN N PRECEDING AND N FOLLOWING` | N rows before + current + N rows after | Centered moving average |
| `BETWEEN UNBOUNDED PRECEDING AND N FOLLOWING` | All rows from start to N after current | Extended cumulative calculation |
| `BETWEEN N PRECEDING AND UNBOUNDED FOLLOWING` | N rows before current to end | Extended backward calculation |


## Window Function Examples

The following examples demonstrate common window function use cases using an employee dataset.

### Sample Data Setup

```sql
-- Create employees table
CREATE TABLE employees (
  employee_id INT,
  first_name VARCHAR,
  last_name VARCHAR,
  department VARCHAR,
  salary INT
);

-- Insert sample data
INSERT INTO employees VALUES
  (1, 'John', 'Doe', 'IT', 75000),
  (2, 'Jane', 'Smith', 'HR', 85000),
  (3, 'Mike', 'Johnson', 'IT', 90000),
  (4, 'Sara', 'Williams', 'Sales', 60000),
  (5, 'Tom', 'Brown', 'HR', 82000),
  (6, 'Ava', 'Davis', 'Sales', 62000),
  (7, 'Olivia', 'Taylor', 'IT', 72000),
  (8, 'Emily', 'Anderson', 'HR', 77000),
  (9, 'Sophia', 'Lee', 'Sales', 58000),
  (10, 'Ella', 'Thomas', 'IT', 67000);
```

### Example 1: Ranking Functions

Ranking employees by salary in descending order:

```sql
SELECT 
  employee_id, 
  first_name, 
  last_name, 
  department, 
  salary,
  RANK() OVER (ORDER BY salary DESC) AS rank,
  DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank,
  ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num
FROM employees
ORDER BY salary DESC;
```

**Result:**

| employee_id | first_name | last_name | department | salary | rank | dense_rank | row_num |
|-------------|------------|-----------|------------|--------|------|------------|--------|
| 3           | Mike       | Johnson   | IT         | 90000  | 1    | 1          | 1      |
| 2           | Jane       | Smith     | HR         | 85000  | 2    | 2          | 2      |
| 5           | Tom        | Brown     | HR         | 82000  | 3    | 3          | 3      |
| 8           | Emily      | Anderson  | HR         | 77000  | 4    | 4          | 4      |
| 1           | John       | Doe       | IT         | 75000  | 5    | 5          | 5      |

### Example 2: Partitioning

Calculating statistics per department:

```sql
SELECT DISTINCT
  department,
  COUNT(*) OVER (PARTITION BY department) AS employee_count,
  SUM(salary) OVER (PARTITION BY department) AS total_salary,
  AVG(salary) OVER (PARTITION BY department) AS avg_salary,
  MIN(salary) OVER (PARTITION BY department) AS min_salary,
  MAX(salary) OVER (PARTITION BY department) AS max_salary
FROM employees
ORDER BY department;
```

**Result:**

| department | employee_count | total_salary | avg_salary | min_salary | max_salary |
|------------|----------------|-------------|------------|------------|------------|
| HR         | 3              | 244000      | 81333.33   | 77000      | 85000      |
| IT         | 4              | 304000      | 76000.00   | 67000      | 90000      |
| Sales      | 3              | 180000      | 60000.00   | 58000      | 62000      |

### Example 3: Running Totals and Moving Averages

Calculating running totals and moving averages within departments:

```sql
SELECT 
  employee_id, 
  first_name,
  department, 
  salary,
  -- Running total (cumulative sum)
  SUM(salary) OVER (
    PARTITION BY department 
    ORDER BY employee_id
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_total,
  -- Moving average of current and previous row
  AVG(salary) OVER (
    PARTITION BY department 
    ORDER BY employee_id
    ROWS BETWEEN 1 PRECEDING AND CURRENT ROW
  ) AS moving_avg
FROM employees
ORDER BY department, employee_id;
```

**Result:**

| employee_id | first_name | department | salary | running_total | moving_avg |
|-------------|------------|------------|--------|---------------|------------|
| 2           | Jane       | HR         | 85000  | 85000         | 85000.00   |
| 5           | Tom        | HR         | 82000  | 167000        | 83500.00   |
| 8           | Emily      | HR         | 77000  | 244000        | 79500.00   |
| 1           | John       | IT         | 75000  | 75000         | 75000.00   |
| 3           | Mike       | IT         | 90000  | 165000        | 82500.00   |
