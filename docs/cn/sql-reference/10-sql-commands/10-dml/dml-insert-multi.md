---
title: INSERT (多表)
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.396"/>

在单个事务中将行插入多个表中，可以选择插入依赖于某些条件（有条件地）或无论任何条件如何都发生（无条件地）。

:::tip 原子操作
Databend通过原子操作确保数据完整性。插入、更新、替换和删除要么完全成功，要么完全失败。
:::

另请参阅: [INSERT](dml-insert.md)

## 语法

```sql
-- 无条件 INSERT ALL: 将每一行插入多个表中，没有任何条件或限制。
INSERT [ OVERWRITE ] ALL
    INTO <target_table> [ ( <target_col_name> [ , ... ] ) ] [ VALUES ( <source_col_name> [ , ... ] ) ]
    ...
SELECT ...


-- 有条件 INSERT ALL: 将每一行插入多个表中，但仅在满足某些条件时插入。
INSERT [ OVERWRITE ] ALL
    WHEN <condition> THEN
        INTO <target_table> [ ( <target_col_name> [ , ... ] ) ] [ VALUES ( <source_col_name> [ , ... ] ) ]
      [ INTO ... ]

  [ WHEN ... ]

  [ ELSE INTO ... ]
SELECT ...


-- 有条件 INSERT FIRST: 将每一行插入多个表中，但在第一次成功插入后停止。
INSERT [ OVERWRITE ] FIRST
    WHEN <condition> THEN
        INTO <target_table> [ ( <target_col_name> [ , ... ] ) ] [ VALUES ( <source_col_name> [ , ... ] ) ]
      [ INTO ... ]

  [ WHEN ... ]

  [ ELSE INTO ... ]
SELECT ...
```

| 参数                                     | 描述                                                                                                                                                                                                                                                                                                                                           |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OVERWRITE                                | 指示在插入之前是否应截断现有数据。                                                                                                                                                                                                                                                                                 |
| `( <target_col_name> [ , ... ] )`        | 指定目标表中数据将被插入的列名。<br/>- 如果省略，数据将被插入目标表中的所有列。                                                                                                                                                                                             |
| VALUES `( <source_col_name> [ , ... ] )` | 指定源列名，数据将从这些列插入到目标表中。<br/>- 如果省略，子查询返回的所有列将被插入到目标表中。<br/>- `<source_col_name>`中列出的列的数据类型必须与`<target_col_name>`中指定的列的数据类型匹配或兼容。                   |
| SELECT ...                               | 提供要插入到目标表中的数据的子查询。<br/>- 您可以选择在子查询中显式为列分配别名。这允许您在WHEN子句和VALUES子句中通过别名引用这些列。                                                                                   |
| WHEN                                     | 条件语句，用于确定何时将数据插入特定的目标表。<br/>- 条件多表插入至少需要一个WHEN子句。<br/>- 一个WHEN子句可以包含多个INTO子句，这些INTO子句可以指向同一个表。<br/>- 要无条件执行WHEN子句，可以使用`WHEN 1 THEN ...`。 |
| ELSE                                     | 指定在WHEN子句中指定的条件均未满足时要采取的操作。                                                                                                                                                                                                                                                         |

## 示例

### 示例-1: 无条件 INSERT ALL

此示例演示了无条件 INSERT ALL 操作，将 `employee_data_source` 表中的每一行插入到 `employees` 和 `employee_history` 表中。

1. 创建用于管理员工数据的表，包括员工详细信息及其雇佣历史，然后使用示例员工信息填充源表。

```sql
-- 创建 employees 表
CREATE TABLE employees (
    employee_id INT,
    employee_name VARCHAR(100),
    hire_date DATE
);

-- 创建 employee_history 表
CREATE TABLE employee_history (
    employee_id INT,
    hire_date DATE,
    termination_date DATE
);

-- 创建 employee_data_source 表
CREATE TABLE employee_data_source (
    employee_id INT,
    employee_name VARCHAR(100),
    hire_date DATE
);

-- 将数据插入 employee_data_source 表
INSERT INTO employee_data_source (employee_id, employee_name, hire_date)
VALUES
    (1, 'Alice', '2023-01-15'),
    (2, 'Bob', '2023-02-20'),
    (3, 'Charlie', '2023-03-25');
```

2. 使用无条件 INSERT ALL 操作将 `employee_data_source` 表中的数据转移到 `employees` 和 `employee_history` 表中。

```sql
-- 无条件 INSERT ALL: 将数据插入 employees 和 employee_history 表
INSERT ALL
    INTO employees (employee_id, employee_name, hire_date) VALUES (employee_id, employee_name, hire_date)
    INTO employee_history (employee_id, hire_date) VALUES (employee_id, hire_date)
SELECT employee_id, employee_name, hire_date FROM employee_data_source;

-- 查询 employees 表
SELECT * FROM employees;

┌─────────────────────────────────────────────────────┐
│   employee_id   │   employee_name  │    hire_date   │
├─────────────────┼──────────────────┼────────────────┤
│               1 │ Alice            │ 2023-01-15     │
│               2 │ Bob              │ 2023-02-20     │
│               3 │ Charlie          │ 2023-03-25     │
└─────────────────────────────────────────────────────┘

-- 查询 employee_history 表
SELECT * FROM employee_history;

┌─────────────────────────────────────────────────────┐
│   employee_id   │    hire_date   │ termination_date │
├─────────────────┼────────────────┼──────────────────┤
│               1 │ 2023-01-15     │ NULL             │
│               2 │ 2023-02-20     │ NULL             │
│               3 │ 2023-03-25     │ NULL             │
└─────────────────────────────────────────────────────┘
```

### 示例-2: 有条件 INSERT ALL & FIRST

此示例演示了有条件 INSERT ALL，根据特定条件将销售数据插入不同的表中，满足多个条件的记录将被插入到所有相应的表中。

1. 创建三个表：products、`high_quantity_sales`、`high_price_sales` 和 `sales_data_source`。然后，将三条销售记录插入 `sales_data_source` 表中。

```sql
-- 创建 high_quantity_sales 表
CREATE TABLE high_quantity_sales (
    sale_id INT,
    product_id INT,
    sale_date DATE,
    quantity INT,
    total_price DECIMAL(10, 2)
);

-- 创建 high_price_sales 表
CREATE TABLE high_price_sales (
    sale_id INT,
    product_id INT,
    sale_date DATE,
    quantity INT,
    total_price DECIMAL(10, 2)
);

-- 创建 sales_data_source 表
CREATE TABLE sales_data_source (
    sale_id INT,
    product_id INT,
    sale_date DATE,
    quantity INT,
    total_price DECIMAL(10, 2)
);

-- 将数据插入 sales_data_source 表
INSERT INTO sales_data_source (sale_id, product_id, sale_date, quantity, total_price)
VALUES
    (1, 101, '2023-01-15', 5, 100.00),
    (2, 102, '2023-02-20', 3, 75.00),
    (3, 103, '2023-03-25', 10, 200.00);
```

2. 使用有条件 INSERT ALL 根据特定条件将行插入多个表中。数量大于 4 的记录插入到 `high_quantity_sales` 表中，总价超过 50 的记录插入到 `high_price_sales` 表中。

```sql
-- 有条件 INSERT ALL: 将每一行插入多个表中，但仅在满足某些条件时插入。
INSERT ALL
    WHEN quantity > 4 THEN INTO high_quantity_sales
    WHEN total_price > 50 THEN INTO high_price_sales
SELECT * FROM sales_data_source;

SELECT * FROM high_quantity_sales;

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│     sale_id     │    product_id   │    sale_date   │     quantity    │        total_price       │
├─────────────────┼─────────────────┼────────────────┼─────────────────┼──────────────────────────┤
│               1 │             101 │ 2023-01-15     │               5 │ 100.00                   │
│               3 │             103 │ 2023-03-25     │              10 │ 200.00                   │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

SELECT * FROM high_price_sales;

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│     sale_id     │    product_id   │    sale_date   │     quantity    │        total_price       │
├─────────────────┼─────────────────┼────────────────┼─────────────────┼──────────────────────────┤
│               1 │             101 │ 2023-01-15     │               5 │ 100.00                   │
│               3 │             103 │ 2023-03-25     │              10 │ 200.00                   │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│     sale_id     │    product_id   │    sale_date   │     quantity    │        total_price       │
├─────────────────┼─────────────────┼────────────────┼─────────────────┼──────────────────────────┤
│               1 │             101 │ 2023-01-15     │               5 │ 100.00                   │
│               2 │             102 │ 2023-02-20     │               3 │ 75.00                    │
│               3 │             103 │ 2023-03-25     │              10 │ 200.00                   │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

3. 清空 `high_quantity_sales` 和 `high_price_sales` 表中的数据。

```sql
TRUNCATE TABLE high_quantity_sales;

TRUNCATE TABLE high_price_sales;
```

4. 使用条件性 INSERT FIRST 根据特定条件将行插入多个表中。对于每一行，在第一次成功插入后停止，因此，与步骤 2 中的条件性 INSERT ALL 结果相比，销售记录 ID 为 1 和 3 的记录仅插入到 `high_quantity_sales` 表中。

```sql
-- 条件性 INSERT FIRST：将每一行插入多个表中，但在第一次成功插入后停止。
INSERT FIRST
    WHEN quantity > 4 THEN INTO high_quantity_sales
    WHEN total_price > 50 THEN INTO high_price_sales
SELECT * FROM sales_data_source;


SELECT * FROM high_quantity_sales;

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│     sale_id     │    product_id   │    sale_date   │     quantity    │        total_price       │
├─────────────────┼─────────────────┼────────────────┼─────────────────┼──────────────────────────┤
│               1 │             101 │ 2023-01-15     │               5 │ 100.00                   │
│               3 │             103 │ 2023-03-25     │              10 │ 200.00                   │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

SELECT * FROM high_price_sales;

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│     sale_id     │    product_id   │    sale_date   │     quantity    │        total_price       │
├─────────────────┼─────────────────┼────────────────┼─────────────────┼──────────────────────────┤
│               2 │             102 │ 2023-02-20     │               3 │ 75.00                    │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 示例-3：使用显式别名插入

此示例演示了在 VALUES 子句中使用别名，根据雇佣日期在 '2023-02-01' 之后，将 employees 表中的行有条件地插入到 `employee_history` 表中。

1. 创建两个表，`employees` 和 `employee_history`，并将示例员工数据插入到 `employees` 表中。

```sql
-- 创建表
CREATE TABLE employees (
    employee_id INT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    hire_date DATE
);

CREATE TABLE employee_history (
    employee_id INT,
    full_name VARCHAR(100),
    hire_date DATE
);

INSERT INTO employees (employee_id, first_name, last_name, hire_date)
VALUES
    (1, 'John', 'Doe', '2023-01-01'),
    (2, 'Jane', 'Smith', '2023-02-01'),
    (3, 'Michael', 'Johnson', '2023-03-01');
```

2. 使用带有别名的条件性插入，将 employees 表中的记录转移到 `employee_history` 表中，过滤雇佣日期在 '2023-02-01' 之后的记录。

```sql
INSERT ALL
    WHEN hire_date >= '2023-02-01' THEN INTO employee_history
        VALUES (employee_id, full_name, hire_date) -- 使用别名 'full_name' 插入
SELECT employee_id, CONCAT(first_name, ' ', last_name) AS full_name, hire_date -- 将连接的全名别名为 'full_name'
FROM employees;

SELECT * FROM employee_history;

┌─────────────────────────────────────────────────────┐
│   employee_id   │     full_name    │    hire_date   │
│ Nullable(Int32) │ Nullable(String) │ Nullable(Date) │
├─────────────────┼──────────────────┼────────────────┤
│               2 │ Jane Smith       │ 2023-02-01     │
│               3 │ Michael Johnson  │ 2023-03-01     │
└─────────────────────────────────────────────────────┘
```