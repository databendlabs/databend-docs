已理解您的要求，我将严格按照您提供的规则进行翻译。请提供需要翻译的Markdown或JSON内容，我会立即开始翻译工作。

---
title: '窗口函数'
---

## 概述

窗口函数对一组相关的行（“窗口”）进行操作。

对于每个输入行，窗口函数返回一个输出行，该输出行取决于传递给函数的特定行以及窗口中其他行的值。

主要有两种类型的顺序敏感窗口函数：

* `排名相关函数`：排名相关函数根据行的“排名”列出信息。例如，按每年利润降序排列商店，利润最高的商店将排名为1，利润第二高的商店将排名为2，依此类推。

* `窗口框架函数`：窗口框架函数允许您在窗口中的行子集上执行滚动操作，例如计算累计总和或移动平均值。

## 支持窗口的函数列表

下表列出了所有窗口函数。

| 函数名称                                                         | 类别     | 窗口 | 窗口框架 | 备注 |
|-----------------------------------------------------------------------|--------------|--------|--------------|-------|
| [ARRAY_AGG](../07-aggregate-functions/aggregate-array-agg.md)         | 通用      | ✔      |              |       |
| [AVG](../07-aggregate-functions/aggregate-avg.md)                     | 通用      | ✔      | ✔            |       |
| [AVG_IF](../07-aggregate-functions/aggregate-avg-if.md)               | 通用      | ✔      | ✔            |       |
| [COUNT](../07-aggregate-functions/aggregate-count.md)                 | 通用      | ✔      | ✔            |       |
| [COUNT_IF](../07-aggregate-functions/aggregate-count-if.md)           | 通用      | ✔      | ✔            |       |
| [COVAR_POP](../07-aggregate-functions/aggregate-covar-pop.md)         | 通用      | ✔      |              |       |
| [COVAR_SAMP](../07-aggregate-functions/aggregate-covar-samp.md)       | 通用      | ✔      |              |       |
| [MAX](../07-aggregate-functions/aggregate-max.md)                     | 通用      | ✔      | ✔            |       |
| [MAX_IF](../07-aggregate-functions/aggregate-max-if.md)               | 通用      | ✔      | ✔            |       |
| [MIN](../07-aggregate-functions/aggregate-min.md)                     | 通用      | ✔      | ✔            |       |
| [MIN_IF](../07-aggregate-functions/aggregate-min-if.md)               | 通用      | ✔      | ✔            |       |
| [STDDEV_POP](../07-aggregate-functions/aggregate-stddev-pop.md)       | 通用      | ✔      | ✔            |       |
| [STDDEV_SAMP](../07-aggregate-functions/aggregate-stddev-samp.md)     | 通用      | ✔      | ✔            |       |
| [MEDIAN](../07-aggregate-functions/aggregate-median.md)               | 通用      | ✔      | ✔            |       |
| [QUANTILE_CONT](../07-aggregate-functions/aggregate-quantile-cont.md) | 通用      | ✔      | ✔            |       |
| [QUANTILE_DISC](../07-aggregate-functions/aggregate-quantile-disc.md) | 通用      | ✔      | ✔            |       |
| [KURTOSIS](../07-aggregate-functions/aggregate-kurtosis.md)           | 通用      | ✔      | ✔            |       |
| [SKEWNESS](../07-aggregate-functions/aggregate-skewness.md)           | 通用      | ✔      | ✔            |       |
| [SUM](../07-aggregate-functions/aggregate-sum.md)                     | 通用      | ✔      | ✔            |       |
| [SUM_IF](../07-aggregate-functions/aggregate-sum-if.md)               | 通用      | ✔      | ✔            |       |
| [CUME_DIST](cume-dist.md)                                             | 排名相关 | ✔      |              |       |
| [PERCENT_RANK](percent_rank.md)                                       | 排名相关 | ✔      | ✔            |       |
| [DENSE_RANK](dense-rank.md)                                           | 排名相关 | ✔      | ✔            |       |
| [RANK](rank.md)                                                       | 排名相关 | ✔      | ✔            |       |
| [ROW_NUMBER](row-number.md)                                           | 排名相关 | ✔      |              |       |
| [NTILE](ntile.md)                                                     | 排名相关 | ✔      |              |       |
| [FIRST_VALUE](first-value.md)                                         | 排名相关 	| ✔     | ✔            |       |
| [FIRST](first.md)                                                     | 排名相关 	| ✔     | ✔            |       |
| [LAST_VALUE](last-value.md)                                           | 排名相关 	| ✔     | ✔            |       |
| [LAST](last.md)                                                       | 排名相关 	| ✔     | ✔            |       |
| [NTH_VALUE](nth-value.md)                                             | 排名相关 	| ✔     | ✔            |       |
| [LEAD](lead.md)                                                       | 排名相关 	| ✔     |              |       |
| [LAG](lag.md)                                                         | 排名相关 	| ✔     |              |       |

## 窗口语法

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

`<function>` 是（[聚合函数](../07-aggregate-functions/index.md)、排名函数、值函数）之一。

`OVER` 子句指定该函数用作窗口函数。

`PARTITION BY` 子句允许将行分组为子组，例如按城市、按年份等。`PARTITION BY` 子句是可选的。您可以在不将整个行组分解为子组的情况下进行分析。

`ORDER BY` 子句对窗口内的行进行排序。

`window frame` 子句指定窗口框架类型和窗口框架范围。`window frame` 子句是可选的。如果省略 `window frame` 子句，默认的窗口框架类型为 `RANGE`，默认的窗口框架范围为 `UNBOUNDED PRECEDING AND CURRENT ROW`。

## 窗口框架语法

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

## 示例

**创建表**
```sql
CREATE TABLE employees (
  employee_id INT,
  first_name VARCHAR,
  last_name VARCHAR,
  department VARCHAR,
  salary INT
);
```

**插入数据**
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

**示例 1：按工资对员工进行排名**

在此示例中，我们使用 RANK() 函数按工资降序对员工进行排名。工资最高的员工将获得排名1，工资最低的员工将获得最高的排名号。
```sql
SELECT employee_id, first_name, last_name, department, salary, RANK() OVER (ORDER BY salary DESC) AS rank
FROM employees;
```

结果：

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



**示例 2：计算每个部门的总工资**

在此示例中，我们使用 SUM() 函数与 PARTITION BY 来计算每个部门的总工资。每行将显示部门及其总工资。
```sql
SELECT department, SUM(salary) OVER (PARTITION BY department) AS total_salary
FROM employees;
```

结果：

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


**示例 3：计算每个部门的工资累计总和**

在此示例中，我们使用 SUM() 函数与累积窗口框架来计算每个部门内的工资累计总和。累计总和基于按 employee_id 排序的员工的工资。
```sql
SELECT employee_id, first_name, last_name, department, salary, 
       SUM(salary) OVER (PARTITION BY department ORDER BY employee_id
                         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM employees;
```

结果：

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