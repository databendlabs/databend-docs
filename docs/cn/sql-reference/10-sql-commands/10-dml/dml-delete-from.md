---
title: 删除
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.174"/>

从表中删除一行或多行。

:::tip 原子操作
Databend 通过原子操作确保数据完整性。插入、更新、替换和删除操作要么完全成功，要么完全失败。
:::

## 语法

```sql
DELETE FROM <table_name> [AS <table_alias>] 
[WHERE <condition>]
```
- `AS <table_alias>`：允许您为表设置别名，使得在查询中引用表更加方便。这有助于简化和缩短 SQL 代码，特别是在处理涉及多个表的复杂查询时。参见 [使用 EXISTS / NOT EXISTS 子句进行子查询删除](#deleting-with-subquery-using-exists--not-exists-clause) 中的示例。

- DELETE 目前不支持 USING 子句。如果您需要使用子查询来标识要删除的行，请直接在 WHERE 子句中包含它。参见 [基于子查询的删除](#subquery-based-deletions) 中的示例。

## 示例

### 示例 1：直接删除行

此示例演示了如何使用 DELETE 命令从 "bookstore" 表中直接删除 ID 为 103 的书籍记录。

```sql
-- 创建表并插入 5 条书籍记录
CREATE TABLE bookstore (
  book_id INT,
  book_name VARCHAR
);

INSERT INTO bookstore VALUES (101, 'After the death of Don Juan');
INSERT INTO bookstore VALUES (102, 'Grown ups');
INSERT INTO bookstore VALUES (103, 'The long answer');
INSERT INTO bookstore VALUES (104, 'Wartime friends');
INSERT INTO bookstore VALUES (105, 'Deconstructed');

-- 删除一本书（Id: 103）
DELETE FROM bookstore WHERE book_id = 103;

-- 显示删除后的所有记录
SELECT * FROM bookstore;

101|After the death of Don Juan
102|Grown ups
104|Wartime friends
105|Deconstructed
```

### 示例 2：基于子查询的删除

当使用子查询来标识要删除的行时，可以使用 [子查询操作符](../30-query-operators/subquery.md) 和 [比较操作符](../30-query-operators/comparison.md) 来实现所需的删除。

本节中的示例基于以下两个表：

```sql
-- 创建 'employees' 表
CREATE TABLE employees (
  id INT,
  name VARCHAR,
  department VARCHAR
);

-- 向 'employees' 表插入值
INSERT INTO employees VALUES (1, 'John', 'HR');
INSERT INTO employees VALUES (2, 'Mary', 'Sales');
INSERT INTO employees VALUES (3, 'David', 'IT');
INSERT INTO employees VALUES (4, 'Jessica', 'Finance');

-- 创建 'departments' 表
CREATE TABLE departments (
  id INT,
  department VARCHAR
);

-- 向 'departments' 表插入值
INSERT INTO departments VALUES (1, 'Sales');
INSERT INTO departments VALUES (2, 'IT');
```

#### 使用 IN / NOT IN 子句进行子查询删除

```sql
DELETE FROM EMPLOYEES
WHERE DEPARTMENT IN (
    SELECT DEPARTMENT
    FROM DEPARTMENTS
);
```
这将删除部门与 departments 表中任何部门匹配的员工。它将删除 ID 为 2 和 3 的员工。

#### 使用 EXISTS / NOT EXISTS 子句进行子查询删除

```sql
DELETE FROM EMPLOYEES
WHERE EXISTS (
    SELECT *
    FROM DEPARTMENTS
    WHERE EMPLOYEES.DEPARTMENT = DEPARTMENTS.DEPARTMENT
);

-- 或者，您可以使用别名 'e' 表示 'EMPLOYEES' 表，'d' 表示 'DEPARTMENTS' 表，当它们的部门匹配时删除员工。
DELETE FROM EMPLOYEES AS e
WHERE EXISTS (
    SELECT *
    FROM DEPARTMENTS AS d
    WHERE e.DEPARTMENT = d.DEPARTMENT
);
```
这将删除属于 departments 表中存在的部门的员工。在这种情况下，它将删除 ID 为 2 和 3 的员工。

#### 使用 ALL 子句进行子查询删除

```sql
DELETE FROM EMPLOYEES
WHERE DEPARTMENT = ALL (
    SELECT DEPARTMENT
    FROM DEPARTMENTS
);
```
这将删除部门与 departments 表中所有部门匹配的员工。在这种情况下，不会删除任何员工。

#### 使用 ANY 子句进行子查询删除

```sql
DELETE FROM EMPLOYEES
WHERE DEPARTMENT = ANY (
    SELECT DEPARTMENT
    FROM DEPARTMENTS
);
```
这将删除部门与 departments 表中任何部门匹配的员工。在这种情况下，它将删除 ID 为 2 和 3 的员工。

#### 结合多个条件进行子查询删除

```sql
DELETE FROM EMPLOYEES
WHERE DEPARTMENT = ANY (
    SELECT DEPARTMENT
    FROM DEPARTMENTS
    WHERE EMPLOYEES.DEPARTMENT = DEPARTMENTS.DEPARTMENT
)
   OR ID > 2;
```

这将从 employees 表中删除部门列的值与 departments 表中部门列的任何值匹配或 id 列的值大于 2 的员工。在这种情况下，它将删除 id 为 2、3 和 4 的行，因为 Mary 的部门是 "Sales"，该部门存在于 departments 表中，且 ID 3 和 4 大于 2。