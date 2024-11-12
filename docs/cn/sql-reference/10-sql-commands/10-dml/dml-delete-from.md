---
title: DELETE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.174"/>

从表中删除一行或多行。

:::tip 原子操作
Databend通过原子操作确保数据完整性。插入、更新、替换和删除要么完全成功，要么完全失败。
:::

## 语法

```sql
DELETE FROM <table_name> [AS <table_alias>] 
[WHERE <condition>]
```
- `AS <table_alias>`: 允许您为表设置别名，使在查询中引用表更加方便。这有助于简化并缩短SQL代码，尤其是在处理涉及多个表的复杂查询时。请参见[使用EXISTS / NOT EXISTS子句删除子查询](#deleting-with-subquery-using-exists--not-exists-clause)中的示例。

- DELETE目前不支持USING子句。如果您需要使用子查询来标识要删除的行，请直接在WHERE子句中包含它。请参见[基于子查询的删除](#subquery-based-deletions)中的示例。

## 示例

### 示例1: 直接删除行

此示例展示了使用DELETE命令直接从"bookstore"表中删除ID为103的图书记录。

```sql
-- 创建表并插入5条图书记录
CREATE TABLE bookstore (
  book_id INT,
  book_name VARCHAR
);

INSERT INTO bookstore VALUES (101, 'After the death of Don Juan');
INSERT INTO bookstore VALUES (102, 'Grown ups');
INSERT INTO bookstore VALUES (103, 'The long answer');
INSERT INTO bookstore VALUES (104, 'Wartime friends');
INSERT INTO bookstore VALUES (105, 'Deconstructed');

-- 删除图书 (Id: 103)
DELETE FROM bookstore WHERE book_id = 103;

-- 删除后显示所有记录
SELECT * FROM bookstore;

101|After the death of Don Juan
102|Grown ups
104|Wartime friends
105|Deconstructed
```

### 示例2: 基于子查询的删除

当使用子查询来标识要删除的行时，可以使用[子查询运算符](../30-query-operators/subquery.md)和[比较运算符](../30-query-operators/comparison.md)来实现所需的删除。

本节中的示例基于以下两个表：

```sql
-- 创建'employees'表
CREATE TABLE employees (
  id INT,
  name VARCHAR,
  department VARCHAR
);

-- 向'employees'表插入值
INSERT INTO employees VALUES (1, 'John', 'HR');
INSERT INTO employees VALUES (2, 'Mary', 'Sales');
INSERT INTO employees VALUES (3, 'David', 'IT');
INSERT INTO employees VALUES (4, 'Jessica', 'Finance');

-- 创建'departments'表
CREATE TABLE departments (
  id INT,
  department VARCHAR
);

-- 向'departments'表插入值
INSERT INTO departments VALUES (1, 'Sales');
INSERT INTO departments VALUES (2, 'IT');
```

#### 使用IN / NOT IN子句删除子查询

```sql
DELETE FROM EMPLOYEES
WHERE DEPARTMENT IN (
    SELECT DEPARTMENT
    FROM DEPARTMENTS
);
```
这将删除部门与departments表中任何部门匹配的员工。它将删除ID为2和3的员工。

#### 使用EXISTS / NOT EXISTS子句删除子查询

```sql
DELETE FROM EMPLOYEES
WHERE EXISTS (
    SELECT *
    FROM DEPARTMENTS
    WHERE EMPLOYEES.DEPARTMENT = DEPARTMENTS.DEPARTMENT
);

-- 或者，当他们的部门匹配时，可以使用'EMPLOYEES'表的别名'e'和'DEPARTMENTS'表的别名'd'删除员工。
DELETE FROM EMPLOYEES AS e
WHERE EXISTS (
    SELECT *
    FROM DEPARTMENTS AS d
    WHERE e.DEPARTMENT = d.DEPARTMENT
);
```
这将删除属于departments表中存在的部门的员工。在这种情况下，它将删除ID为2和3的员工。

#### 使用ALL子句删除子查询

```sql
DELETE FROM EMPLOYEES
WHERE DEPARTMENT = ALL (
    SELECT DEPARTMENT
    FROM DEPARTMENTS
);
```
这将删除部门与department表中所有部门匹配的员工。在这种情况下，不会删除任何员工。

#### 使用ANY子句删除子查询

```sql
DELETE FROM EMPLOYEES
WHERE DEPARTMENT = ANY (
    SELECT DEPARTMENT
    FROM DEPARTMENTS
);
```
这将删除部门与departments表中任何部门匹配的员工。在这种情况下，它将删除ID为2和3的员工。

#### 使用子查询结合多个条件删除

```sql
DELETE FROM EMPLOYEES
WHERE DEPARTMENT = ANY (
    SELECT DEPARTMENT
    FROM DEPARTMENTS
    WHERE EMPLOYEES.DEPARTMENT = DEPARTMENTS.DEPARTMENT
)
   OR ID > 2;
```

这将删除employees表中的员工，如果department列的值与departments表的department列中的任何值匹配，或者id列的值大于2。在这种情况下，它将删除ID为2、3和4的行，因为Mary的部门是"Sales"，存在于departments表中，并且ID 3和4大于2。