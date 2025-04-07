Okay, I understand. Please provide the Markdown or JSON content you want me to translate into Chinese, keeping in mind all the rules you've outlined. I will do my best to provide an accurate and consistent translation.


```markdown
---
title: 'Window Functions'
---

## Overview 

窗口函数作用于一组（“窗口”）相关的行。

对于每个输入行，窗口函数返回一个输出行，该输出行取决于传递给函数的特定行以及窗口中其他行的值。

有两种主要的顺序敏感窗口函数：

* `Rank-related functions`: 排名相关函数根据行的“排名”列出信息。例如，按每年利润降序排列商店，利润最高的商店排名为 1，利润第二高的商店排名为 2，依此类推。

* `Window frame functions`: 窗口帧函数使您能够对窗口中的行子集执行滚动操作，例如计算运行总计或移动平均值。

## List of Functions that Support Windows

下表显示了所有窗口函数。

| Function Name                                                         | Category     | Window | Window Frame | Notes |
|-----------------------------------------------------------------------|--------------|--------|--------------|-------|
| [ARRAY_AGG](../07-aggregate-functions/aggregate-array-agg.md)         | General      | ✔      |              |       |
| [AVG](../07-aggregate-functions/aggregate-avg.md)                     | General      | ✔      | ✔            |       |
| [AVG_IF](../07-aggregate-functions/aggregate-avg-if.md)               | General      | ✔      | ✔            |       |
| [COUNT](../07-aggregate-functions/aggregate-count.md)                 | General      | ✔      | ✔            |       |
| [COUNT_IF](../07-aggregate-functions/aggregate-count-if.md)           | General      | ✔      | ✔            |       |
| [COVAR_POP](../07-aggregate-functions/aggregate-covar-pop.md)         | General      | ✔      |              |       |
| [COVAR_SAMP](../07-aggregate-functions/aggregate-covar-samp.md)       | General      | ✔      |              |       |
| [MAX](../07-aggregate-functions/aggregate-max.md)                     | General      | ✔      | ✔            |       |
| [MAX_IF](../07-aggregate-functions/aggregate-max-if.md)               | General      | ✔      | ✔            |       |
| [MIN](../07-aggregate-functions/aggregate-min.md)                     | General      | ✔      | ✔            |       |
| [MIN_IF](../07-aggregate-functions/aggregate-min-if.md)               | General      | ✔      | ✔            |       |
| [STDDEV_POP](../07-aggregate-functions/aggregate-stddev-pop.md)       | General      | ✔      | ✔            |       |
| [STDDEV_SAMP](../07-aggregate-functions/aggregate-stddev-samp.md)     | General      | ✔      | ✔            |       |
| [MEDIAN](../07-aggregate-functions/aggregate-median.md)               | General      | ✔      | ✔            |       |
| [QUANTILE_CONT](../07-aggregate-functions/aggregate-quantile-cont.md) | General      | ✔      | ✔            |       |
| [QUANTILE_DISC](../07-aggregate-functions/aggregate-quantile-disc.md) | General      | ✔      | ✔            |       |
| [KURTOSIS](../07-aggregate-functions/aggregate-kurtosis.md)           | General      | ✔      | ✔            |       |
| [SKEWNESS](../07-aggregate-functions/aggregate-skewness.md)           | General      | ✔      | ✔            |       |
| [SUM](../07-aggregate-functions/aggregate-sum.md)                     | General      | ✔      | ✔            |       |
| [SUM_IF](../07-aggregate-functions/aggregate-sum-if.md)               | General      | ✔      | ✔            |       |
| [CUME_DIST](cume-dist.md)                                             | Rank-related | ✔      |              |       |
| [PERCENT_RANK](percent_rank.md)                                       | Rank-related | ✔      | ✔            |       |
| [DENSE_RANK](dense-rank.md)                                           | Rank-related | ✔      | ✔            |       |
| [RANK](rank.md)                                                       | Rank-related | ✔      | ✔            |       |
| [ROW_NUMBER](row-number.md)                                           | Rank-related | ✔      |              |       |
| [NTILE](ntile.md)                                                     | Rank-related | ✔      |              |       |
| [FIRST_VALUE](first-value.md)                                         | Rank-related 	| ✔     | ✔            |       |
| [FIRST](first.md)                                                     | Rank-related 	| ✔     | ✔            |       |
| [LAST_VALUE](last-value.md)                                           | Rank-related 	| ✔     | ✔            |       |
| [LAST](last.md)                                                     | Rank-related 	| ✔     | ✔            |       |
| [NTH_VALUE](nth-value.md)                                             | Rank-related 	| ✔     | ✔            |       |
| [LEAD](lead.md)                                                       | Rank-related 	| ✔     |              |       |
| [LAG](lag.md)                                                         | Rank-related 	| ✔     |              |       |

## Window Syntax

```sql
<function> ( [ <arguments> ] ) OVER ( { named window | inline window } )

named window ::=
    { window_name | ( window_name ) }

inline window ::=
    [ PARTITION BY <expression_list> ]
    [ ORDER BY <expression_list> ]
    [ window frame ]
```
`named window` 是在 `SELECT` 语句的 `WINDOW` 子句中定义的窗口，例如：`SELECT a, SUM(a) OVER w FROM t WINDOW w AS ( inline window )`。

`<function>` 是其中之一（[聚合函数](../07-aggregate-functions/index.md)，排名函数，值函数）。

`OVER` 子句指定该函数用作窗口函数。

`PARTITION BY` 子句允许将行分组为子组，例如按城市、按年份等。`PARTITION BY` 子句是可选的。您可以分析整组行，而无需将其分解为子组。

`ORDER BY` 子句对窗口中的行进行排序。

`window frame` 子句指定窗口帧类型和窗口帧范围。`window frame` 子句是可选的。如果省略 `window frame` 子句，则默认窗口帧类型为 `RANGE`，默认窗口帧范围为 `UNBOUNDED PRECEDING AND CURRENT ROW`。


## Window Frame Syntax

`window frame` 可以是以下类型之一：

```sql
cumulativeFrame ::=
    {
       { ROWS | RANGE } BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
     | { ROWS | RANGE } BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING
    }
```

```sql
slidingFrame ::=
    {
       ROWS BETWEEN <N> { PRECEDING | FOLLOWING } AND <N> { PRECEDING | FOLLOWING }
     | ROWS BETWEEN UNBOUNDED PRECEDING AND <N> { PRECEDING | FOLLOWING }
     | ROWS BETWEEN <N> { PRECEDING | FOLLOWING } AND UNBOUNDED FOLLOWING
    }
```


## Examples

**Create the table**
```sql
CREATE TABLE employees (
  employee_id INT,
  first_name VARCHAR,
  last_name VARCHAR,
  department VARCHAR,
  salary INT
);
```

**Insert data**
```sql
INSERT INTO employees (employee_id, first_name, last_name, department, salary) VALUES
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

**Example 1: Ranking employees by salary**

在此示例中，我们使用 RANK() 函数根据员工的薪水降序对员工进行排名。最高薪水将获得 1 的排名，最低薪水将获得最高的排名。
```sql
SELECT employee_id, first_name, last_name, department, salary, RANK() OVER (ORDER BY salary DESC) AS rank
FROM employees;
```

Result:

| employee_id | first_name | last_name | department | salary | rank |
|-------------|------------|-----------|------------|--------|------|
| 3           | Mike       | Johnson   | IT         | 90000  | 1    |
| 2           | Jane       | Smith     | HR         | 85000  | 2    |
| 5           | Tom        | Brown     | HR         | 82000  | 3    |
| 8           | Emily      | Anderson  | HR         | 77000  | 4    |
| 1           | John       | Doe       | IT         | 75000  | 5    |
| 7           | Olivia     | Taylor    | IT         | 72000  | 6    |
| 10          | Ella       | Thomas    | IT         | 67000  | 7    |
| 6           | Ava        | Davis     | Sales      | 62000  | 8    |
| 4           | Sara       | Williams  | Sales      | 60000  | 9    |
| 9           | Sophia     | Lee       | Sales      | 58000  | 10   |



**Example 2: Calculating the total salary per department**

在此示例中，我们使用带有 PARTITION BY 的 SUM() 函数来计算每个部门支付的总薪水。每行将显示部门和该部门的总薪水。
```sql
SELECT department, SUM(salary) OVER (PARTITION BY department) AS total_salary
FROM employees;
```

Result:

| department | total_salary |
|------------|--------------|
| HR         | 244000       |
| HR         | 244000       |
| HR         | 244000       |
| IT         | 304000       |
| IT         | 304000       |
| IT         | 304000       |
| IT         | 304000       |
| Sales      | 180000       |
| Sales      | 180000       |
| Sales      | 180000       |


**Example 3: Calculating a running total of salaries per department**

在此示例中，我们使用带有累积窗口帧的 SUM() 函数来计算每个部门内薪水的运行总计。运行总计是根据员工的 employee_id 排序的薪水计算的。
```sql
SELECT employee_id, first_name, last_name, department, salary, 
       SUM(salary) OVER (PARTITION BY department ORDER BY employee_id
                         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM employees;
```

Result:

| employee_id | first_name | last_name | department | salary | running_total |
|-------------|------------|-----------|------------|--------|---------------|
| 2           | Jane       | Smith     | HR         | 85000  | 85000         |
| 5           | Tom        | Brown     | HR         | 82000  | 167000        |
| 8           | Emily      | Anderson  | HR         | 77000  | 244000        |
| 1           | John       | Doe       | IT         | 75000  | 75000         |
| 3           | Mike       | Johnson   | IT         | 90000  | 165000        |
| 7           | Olivia     | Taylor    | IT         | 72000  | 237000        |
| 10          | Ella       | Thomas    | IT         | 67000  | 304000        |
| 4           | Sara       | Williams  | Sales      | 60000  | 60000         |
| 6           | Ava        | Davis     | Sales      | 62000  | 122000        |
| 9           | Sophia     | Lee       | Sales      | 58000  | 180000        |
```