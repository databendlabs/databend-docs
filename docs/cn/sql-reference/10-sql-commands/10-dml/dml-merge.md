---
title: MERGE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.241"/>

根据语句中指定的条件和匹配标准，使用指定源的数据对目标表中的行执行 INSERT、UPDATE 或 DELETE 操作。

数据源可以是子查询，通过 JOIN 表达式与目标数据链接。该表达式评估源中的每一行是否能在目标表中找到匹配项，然后确定在下一步执行中应移动到哪种类型的子句（MATCHED 或 NOT MATCHED）。

![Alt text](/img/sql/merge-into-single-clause.jpeg)

MERGE 语句通常包含一个 MATCHED 和/或一个 NOT MATCHED 子句，指示 Databend 如何处理匹配和不匹配的情况。对于 MATCHED 子句，您可以选择在目标表上执行 UPDATE 或 DELETE 操作。相反，对于 NOT MATCHED 子句，可用的选择是 INSERT。

## 多个 MATCHED & NOT MATCHED 子句

MERGE 语句可以包含多个 MATCHED 和/或 NOT MATCHED 子句，使您能够根据 MERGE 操作期间满足的条件指定不同的操作。

![Alt text](/img/sql/merge-into-multi-clause.jpeg)

如果 MERGE 语句包含多个 MATCHED 子句，则需要为每个子句（最后一个除外）指定条件。这些条件决定了在什么情况下执行相关操作。Databend 按指定顺序评估条件。一旦条件满足，就会触发指定的操作，跳过任何剩余的 MATCHED 子句，然后继续处理源中的下一行。如果 MERGE 语句还包含多个 NOT MATCHED 子句，Databend 会以类似的方式处理它们。

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
| UPDATE \* | 使用源中对应行的值更新目标表中匹配行的所有列。这要求源和目标之间的列名一致（尽管顺序可以不同），因为在更新过程中，匹配是基于列名进行的。 |
| INSERT \* | 使用源行的值向目标表插入新行。                                                                                                                                                                                                                                      |

## 输出

MERGE 提供数据合并结果的摘要，包含以下列：

| 列                  | 描述                                          |
| ----------------------- | ---------------------------------------------------- |
| number of rows inserted | 添加到目标表的新行数。         |
| number of rows updated  | 目标表中修改的现有行数。 |
| number of rows deleted  | 从目标表中删除的行数。         |

## 示例

### 示例 1：使用多个 MATCHED 子句进行合并

此示例使用 MERGE 将 'employees' 中的员工数据同步到 'salaries' 中，允许根据指定条件插入和更新薪资信息。

```sql
-- 创建 'employees' 表作为合并的源
CREATE TABLE employees (
    employee_id INT,
    employee_name VARCHAR(255),
    department VARCHAR(255)
);

-- 创建 'salaries' 表作为合并的目标
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

-- 启用 MERGE INTO

-- 根据 'employees' 中的员工详情将数据合并到 'salaries' 中
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

-- 合并后从 'salaries' 表中检索所有记录
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

### 示例 2：使用 UPDATE \* & INSERT \* 进行合并

此示例使用 MERGE 同步 target_table 和 source_table 之间的数据，使用源中的值更新匹配的行，并插入不匹配的行。

```sql
-- 创建目标表 target_table
CREATE TABLE target_table (
    ID INT,
    Name VARCHAR(50),
    Age INT,
    City VARCHAR(50)
);

-- 向 target_table 插入初始数据
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

-- 向 source_table 插入初始数据
INSERT INTO source_table (ID, Name, Age, City)
VALUES
    (1, 'David', 27, 'Calgary'),
    (2, 'Emma', 29, 'Ottawa'),
    (4, 'Frank', 32, 'Edmonton');

-- 启用 MERGE INTO

-- 将 source_table 中的数据合并到 target_table 中
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

-- 合并后从 'target_table' 中检索所有记录
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