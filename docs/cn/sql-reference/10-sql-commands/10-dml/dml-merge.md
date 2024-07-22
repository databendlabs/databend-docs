---
title: MERGE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新：v1.2.241"/>

根据语句中指定的条件和匹配标准，对目标表中的行执行INSERT、UPDATE或DELETE操作，使用指定源中的数据。

数据源（可以是子查询）通过JOIN表达式与目标数据关联。该表达式评估源中的每一行是否能在目标表中找到匹配，然后确定在下一步执行中应进入哪种类型（MATCHED或NOT MATCHED）的子句。

![Alt text](/img/sql/merge-into-single-clause.jpeg)

MERGE语句通常包含一个MATCHED和/或NOT MATCHED子句，指示Databend如何处理匹配和不匹配的情况。对于MATCHED子句，您可以选择对目标表执行UPDATE或DELETE操作。相反，在NOT MATCHED子句的情况下，可用的选择是INSERT。

## 多个MATCHED与NOT MATCHED子句

MERGE语句可以包含多个MATCHED和/或NOT MATCHED子句，使您能够根据MERGE操作中满足的条件指定不同的操作。

![Alt text](/img/sql/merge-into-multi-clause.jpeg)

如果MERGE语句包含多个MATCHED子句，则需要为每个子句（最后一个子句除外）指定条件。这些条件决定了相关操作的执行标准。Databend按指定顺序评估这些条件。一旦满足某个条件，它将触发指定的操作，跳过任何剩余的MATCHED子句，然后继续处理源中的下一行。如果MERGE语句还包含多个NOT MATCHED子句，Databend以类似的方式处理它们。

## 语法

```sql
MERGE INTO <target_table>
    USING (SELECT ... ) [AS] <alias> ON <join_expr> { matchedClause | notMatchedClause } [ ... ]

matchedClause ::=
  WHEN MATCHED [ AND <condition> ] THEN
  { UPDATE SET <col_name> = <expr> [ , <col_name2> = <expr2> ... ] | UPDATE * | DELETE }

notMatchedClause ::=
  WHEN NOT MATCHED [ AND <condition> ] THEN
  { INSERT ( <col_name> [ , <col_name2> ... ] ) VALUES ( <expr> [ , ... ] ) | INSERT * }
```

| 参数      | 描述                                                                                                                                                                                                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UPDATE \* | 使用源中相应行的值更新目标表中匹配行的所有列。这要求源和目标之间的列名一致（尽管它们的顺序可以不同），因为在更新过程中，匹配是基于列名进行的。 |
| INSERT \* | 使用源行的值插入目标表中的新行。                                                                                                                                                                                                                                      |

## 输出

MERGE提供数据合并结果的摘要，包含以下列：

| 列                        | 描述                                          |
| ----------------------- | ---------------------------------------------------- |
| number of rows inserted | 添加到目标表的新行数。         |
| number of rows updated  | 目标表中修改的现有行数。 |
| number of rows deleted  | 从目标表中删除的行数。         |

## 示例

### 示例1：包含多个MATCHED子句的MERGE

此示例使用MERGE将员工数据从'employees'同步到'salaries'，根据指定条件插入和更新薪资信息。

```sql
-- 创建作为合并源的'employees'表
CREATE TABLE employees (
    employee_id INT,
    employee_name VARCHAR(255),
    department VARCHAR(255)
);

-- 创建作为合并目标的'salaries'表
CREATE TABLE salaries (
    employee_id INT,
    salary DECIMAL(10, 2)
);

-- 插入初始员工数据
INSERT INTO employees VALUES
    (1, 'Alice', 'HR'),
    (2, 'Bob', 'IT'),
    (3, 'Charlie', 'Finance'),
    (4, 'David', 'HR');

-- 插入初始薪资数据
INSERT INTO salaries VALUES
    (1, 50000.00),
    (2, 60000.00);

-- 启用MERGE INTO

-- 根据'employees'中的员工详情将数据合并到'salaries'
MERGE INTO salaries
    USING (SELECT * FROM employees) AS employees
    ON salaries.employee_id = employees.employee_id
    WHEN MATCHED AND employees.department = 'HR' THEN
        UPDATE SET
            salaries.salary = salaries.salary + 1000.00
    WHEN MATCHED THEN
        UPDATE SET
            salaries.salary = salaries.salary + 500.00
    WHEN NOT MATCHED THEN
        INSERT (employee_id, salary)
            VALUES (employees.employee_id, 55000.00);

┌──────────────────────────────────────────────────┐
│ number of rows inserted │ number of rows updated │
├─────────────────────────┼────────────────────────┤
│                      2  │                      2 │
└──────────────────────────────────────────────────┘

-- 合并后从'salaries'表检索所有记录
SELECT * FROM salaries;

┌────────────────────────────────────────────┐
│   employee_id   │          salary          │
├─────────────────┼──────────────────────────┤
│               3 │ 55000.00                 │
│               4 │ 55000.00                 │
│               1 │ 51000.00                 │
│               2 │ 60500.00                 │
└────────────────────────────────────────────┘
```

### 示例2：包含UPDATE \*与INSERT \*的MERGE

此示例使用MERGE在target_table和source_table之间同步数据，使用源中的值更新匹配行并插入不匹配行。

```sql
-- 创建目标表target_table
CREATE TABLE target_table (
    ID INT,
    Name VARCHAR(50),
    Age INT,
    City VARCHAR(50)
);

-- 向target_table插入初始数据
INSERT INTO target_table (ID, Name, Age, City)
VALUES
    (1, 'Alice', 25, 'Toronto'),
    (2, 'Bob', 30, 'Vancouver'),
    (3, 'Carol', 28, 'Montreal');

-- 创建源表source_table
CREATE TABLE source_table (
    ID INT,
    Name VARCHAR(50),
    Age INT,
    City VARCHAR(50)
);

-- 向source_table插入初始数据
INSERT INTO source_table (ID, Name, Age, City)
VALUES
    (1, 'David', 27, 'Calgary'),
    (2, 'Emma', 29, 'Ottawa'),
    (4, 'Frank', 32, 'Edmonton');

-- 启用MERGE INTO

-- 从source_table合并数据到target_table
MERGE INTO target_table AS T
    USING (SELECT * FROM source_table) AS S
    ON T.ID = S.ID
    WHEN MATCHED THEN
        UPDATE *
    WHEN NOT MATCHED THEN
    INSERT *;

┌──────────────────────────────────────────────────┐
│ number of rows inserted │ number of rows updated │
├─────────────────────────┼────────────────────────┤
│                      1  │                      2 │
└──────────────────────────────────────────────────┘

-- 合并后从'target_table'检索所有记录
SELECT * FROM target_table order by ID;

┌─────────────────────────────────────────────────────────────────────────┐
│        id       │       name       │       age       │       city       │
├─────────────────┼──────────────────┼─────────────────┼──────────────────┤
│               1 │ David            │              27 │ Calgary          │
│               2 │ Emma             │              29 │ Ottawa           │
│               3 │ Carol            │              28 │ Montreal         │
│               4 │ Frank            │              32 │ Edmonton         │
└─────────────────────────────────────────────────────────────────────────┘
```