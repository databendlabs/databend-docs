---
title: MERGE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.241"/>

根据语句中指定的条件和匹配标准，使用指定源中的数据对目标表中的行执行 INSERT、UPDATE 或 DELETE 操作。

数据源（可以是子查询）通过 JOIN 表达式链接到目标数据。此表达式评估源中的每一行是否可以在目标表中找到匹配项，然后确定它应该移动到下一个执行步骤中的哪种类型的子句（MATCHED 或 NOT MATCHED）。

![Alt text](/img/sql/merge-into-single-clause.jpeg)

MERGE 语句通常包含 MATCHED 和/或 NOT MATCHED 子句，指示 Databend 如何处理匹配和不匹配的情况。对于 MATCHED 子句，您可以选择对目标表执行 UPDATE 或 DELETE 操作。相反，对于 NOT MATCHED 子句，可用的选择是 INSERT。

## 多个 MATCHED 和 NOT MATCHED 子句

MERGE 语句可以包含多个 MATCHED 和/或 NOT MATCHED 子句，使您可以灵活地根据 MERGE 操作期间满足的条件指定要执行的不同操作。

![Alt text](/img/sql/merge-into-multi-clause.jpeg)

如果 MERGE 语句包含多个 MATCHED 子句，则需要为除最后一个子句之外的每个子句指定一个条件。这些条件确定执行相关操作的标准。Databend 按照指定的顺序评估条件。一旦满足条件，它将触发指定的操作，跳过任何剩余的 MATCHED 子句，然后移动到源中的下一行。如果 MERGE 语句还包含多个 NOT MATCHED 子句，则 Databend 以类似的方式处理它们。

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
| UPDATE \* | 使用源中相应行的值更新目标表中匹配行的所有列。这要求源和目标之间的列名一致（尽管它们的顺序可能不同），因为在更新过程中，匹配是基于列名完成的。 |
| INSERT \* | 使用源行的值将新行插入到目标表中。                                                                                                                                                                                                                                                                     |

## 输出

MERGE 提供了数据合并结果的摘要，其中包含以下列：

| 列                      | 描述                                           |
| ----------------------- | ---------------------------------------------------- |
| number of rows inserted | 添加到目标表的新行数。                             |
| number of rows updated  | 目标表中修改的现有行数。                           |
| number of rows deleted  | 从目标表中删除的行数。                             |

## 示例

### 示例 1：合并具有多个匹配子句

此示例使用 MERGE 将员工数据从“employees”同步到“salaries”，从而可以根据指定的标准插入和更新工资信息。

```sql
-- 创建“employees”表作为合并的源
CREATE TABLE employees (
    employee_id INT,
    employee_name VARCHAR(255),
    department VARCHAR(255)
);

-- 创建“salaries”表作为合并的目标
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

-- 插入初始工资数据
INSERT INTO salaries VALUES
    (1, 50000.00),
    (2, 60000.00);

-- 启用 MERGE INTO

-- 根据“employees”中的员工详细信息将数据合并到“salaries”中
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

-- 合并后从“salaries”表中检索所有记录
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

### 示例 2：合并具有 UPDATE \* 和 INSERT \*

此示例使用 MERGE 在 target_table 和 source_table 之间同步数据，使用源中的值更新匹配的行，并插入不匹配的行。

```sql
-- 创建目标表 target_table
CREATE TABLE target_table (
    ID INT,
    Name VARCHAR(50),
    Age INT,
    City VARCHAR(50)
);

-- 将初始数据插入到 target_table 中
INSERT INTO target_table (ID, Name, Age, City)
VALUES
    (1, 'Alice', 25, 'Toronto'),
    (2, 'Bob', 30, 'Vancouver'),
    (3, 'Carol', 28, 'Montreal');

-- 创建源表 source_table
CREATE TABLE source_table (
    ID INT,
    Name VARCHAR(50),
    Age INT,
    City VARCHAR(50)
);

-- 将初始数据插入到 source_table 中
INSERT INTO source_table (ID, Name, Age, City)
VALUES
    (1, 'David', 27, 'Calgary'),
    (2, 'Emma', 29, 'Ottawa'),
    (4, 'Frank', 32, 'Edmonton');

-- 启用 MERGE INTO

-- 将数据从 source_table 合并到 target_table 中
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

-- 合并后从“target_table”中检索所有记录
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