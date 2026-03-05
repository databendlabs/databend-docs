---
title: MERGE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于: v1.2.241"/>

在目标表中执行 **INSERT**、**UPDATE** 或 **DELETE** 操作，所有操作都根据语句中指定的条件和匹配条件进行，使用来自指定源的数据。

数据源 (可以是子查询) 通过 JOIN 表达式与目标数据关联。此表达式评估源中的每一行是否能在目标表中找到匹配项，然后确定在下一个执行步骤中应该移动到哪种类型的子句 (MATCHED 或 NOT MATCHED)。

![Alt text](/img/sql/merge-into-single-clause.jpeg)

MERGE 语句通常包含 MATCHED 和/或 NOT MATCHED 子句，指示 Databend 如何处理匹配和不匹配的场景。对于 MATCHED 子句，您可以选择在目标表上执行 **UPDATE** 或 **DELETE** 操作。相反，对于 NOT MATCHED 子句，可用的选择是 **INSERT**。

## 多个 MATCHED 和 NOT MATCHED 子句

MERGE 语句可以包含多个 MATCHED 和/或 NOT MATCHED 子句，为您提供灵活性，可以根据 MERGE 操作期间满足的条件指定要执行的不同操作。

![Alt text](/img/sql/merge-into-multi-clause.jpeg)

如果 MERGE 语句包含多个 MATCHED 子句，除了最后一个子句外，每个子句都需要指定一个条件。这些条件确定执行相关操作的标准。Databend 按指定顺序评估条件。一旦满足条件，它就会触发指定的操作，跳过任何剩余的 MATCHED 子句，然后移动到源中的下一行。如果 MERGE 语句还包含多个 NOT MATCHED 子句，Databend 会以类似的方式处理它们。

## 语法

```sql
MERGE INTO <target_table>
    USING (SELECT ... ) [AS] <alias> ON <join_expr> { matchedClause | notMatchedClause } [ ... ]

matchedClause ::=
  WHEN MATCHED [ AND <condition> ] THEN
  {
    UPDATE SET <col_name> = <expr> [ , <col_name2> = <expr2> ... ] |
    UPDATE * |
    DELETE  /* 从目标表中删除匹配的行 */
  }

notMatchedClause ::=
  WHEN NOT MATCHED [ AND <condition> ] THEN
  { INSERT ( <col_name> [ , <col_name2> ... ] ) VALUES ( <expr> [ , ... ] ) | INSERT * }
```

| 参数 | 描述                                                                                                                                                                                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UPDATE \* | 使用源中相应行的值更新目标表中匹配行的所有列。这要求源和目标之间的列名一致 (尽管它们的顺序可以不同)，因为在更新过程中，匹配是基于列名进行的。 |
| INSERT \* | 使用源行的值向目标表插入新行。                                                                                                                                                                                                                                                                                                                                      |
| DELETE    | 从目标表中删除匹配的行。这是一个强大的操作，可用于数据清理、删除过时记录或基于源数据实现条件删除逻辑。                                                                                                     |

## 输出

MERGE 提供数据合并结果的摘要，包含以下列：

| 列                  | 描述                                          |
| ----------------------- | ---------------------------------------------------- |
| number of rows inserted | 添加到目标表的新行数。         |
| number of rows updated  | 目标表中修改的现有行数。 |
| number of rows deleted  | 从目标表中删除的行数。         |

## 示例

### 示例 1: 使用多个 Matched 子句进行合并

此示例使用 MERGE 将员工数据从 'employees' 同步到 'salaries'，允许根据指定条件插入和更新薪资信息。

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

```sql
-- 基于 'employees' 表中的员工详细信息将数据合并到 'salaries' 表中
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

### 示例 2: 使用 UPDATE * 和 INSERT * 进行合并

此示例使用 MERGE 在 target_table 和 source_table 之间同步数据，使用源表中的值更新匹配的行，并插入不匹配的行。

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

-- Enable MERGE INTO

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

### 示例 3: 使用 DELETE 操作进行合并

此示例演示如何使用 MERGE 根据源表中的特定条件从目标表中删除记录。

```sql
-- 创建 customers 表 (目标表)
CREATE TABLE customers (
    customer_id INT,
    customer_name VARCHAR(50),
    status VARCHAR(20),
    last_purchase_date DATE
);

-- 插入初始客户数据
INSERT INTO customers VALUES
    (101, 'John Smith', 'Active', '2023-01-15'),
    (102, 'Emma Johnson', 'Active', '2023-02-20'),
    (103, 'Michael Brown', 'Inactive', '2022-11-05'),
    (104, 'Sarah Wilson', 'Active', '2023-03-10'),
    (105, 'David Lee', 'Inactive', '2022-09-30');

-- 创建 removals 表 (包含要删除客户的源表)
CREATE TABLE removals (
    customer_id INT,
    removal_reason VARCHAR(50),
    removal_date DATE
);

-- 为要删除的客户插入数据
INSERT INTO removals VALUES
    (103, 'Account Closed', '2023-04-01'),
    (105, 'Customer Request', '2023-04-05');

-- Enable MERGE INTO

-- 使用 MERGE 删除出现在 removals 表中的非活跃客户
MERGE INTO customers AS c
    USING removals AS r
    ON c.customer_id = r.customer_id
    WHEN MATCHED AND c.status = 'Inactive' THEN
        DELETE;

┌────────────────────────┐
│ number of rows deleted │
├────────────────────────┤
│                     2  │
└────────────────────────┘
```