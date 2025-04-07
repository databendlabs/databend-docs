---
title: INSERT
---

将一行或多行插入到表中。

:::tip atomic operations
Databend 通过原子操作确保数据完整性。插入、更新、替换和删除要么完全成功，要么完全失败。
:::

另请参阅：[INSERT (multi-table)](dml-insert-multi.md)

## 语法

```sql
INSERT { OVERWRITE | INTO } <table>
    -- Optionally specify the columns to insert into
    ( <column> [ , ... ] )
    -- Insertion options:
    {
        -- Directly insert values or default values
        VALUES ( <value> | DEFAULT ) [ , ... ] |
        -- Insert the result of a query
        SELECT ...
    }
```

| 参数      | 描述                                                                         |
|-----------|------------------------------------------------------------------------------|
| OVERWRITE | 指示在插入之前是否应截断现有数据。                                                 |
| VALUES    | 允许直接插入特定值或列的默认值。                                                   |

## 示例

### 示例-1：使用 OVERWRITE 插入值

在此示例中，INSERT OVERWRITE 语句用于截断 employee 表并插入新数据，从而将所有现有记录替换为 ID 为 100 的 employee 提供的值。

```sql
CREATE TABLE employee (
    employee_id INT,
    employee_name VARCHAR(50)
);

-- 向 employee 表中插入初始数据
INSERT INTO employee(employee_id, employee_name) VALUES
    (101, 'John Doe'),
    (102, 'Jane Smith');

-- 使用 OVERWRITE 插入新数据
INSERT OVERWRITE employee VALUES (100, 'John Johnson');

-- 显示 employee 表的内容
SELECT * FROM employee;

┌────────────────────────────────────┐
│   employee_id   │   employee_name  │
├─────────────────┼──────────────────┤
│             100 │ John Johnson     │
└────────────────────────────────────┘
```

### 示例-2：插入查询结果

当插入 SELECT 语句的结果时，列的映射遵循它们在 SELECT 子句中的位置。因此，SELECT 语句中的列数必须等于或大于 INSERT 表中的列数。如果 SELECT 语句和 INSERT 表中列的数据类型不同，则会根据需要执行类型转换。

```sql
-- 创建一个名为“employee_info”的表，其中包含三列：“employee_id”、“employee_name”和“department”
CREATE TABLE employee_info (
    employee_id INT,
    employee_name VARCHAR(50),
    department VARCHAR(50)
);

-- 向“employee_info”表中插入一条记录
INSERT INTO employee_info VALUES ('101', 'John Doe', 'Marketing');

-- 创建一个名为“employee_data”的表，其中包含三列：“ID”、“Name”和“Dept”
CREATE TABLE employee_data (
    ID INT,
    Name VARCHAR(50),
    Dept VARCHAR(50)
);

-- 将数据从“employee_info”插入到“employee_data”中
INSERT INTO employee_data SELECT * FROM employee_info;

-- 显示“employee_data”表的内容
SELECT * FROM employee_data;

┌───────────────────────────────────────────────────────┐
│        id       │       name       │       dept       │
├─────────────────┼──────────────────┼──────────────────┤
│             101 │ John Doe         │ Marketing        │
└───────────────────────────────────────────────────────┘
```

此示例演示如何创建一个名为“sales_summary”的汇总表，用于存储每个产品的总销量和收入等汇总销售数据，方法是汇总 sales 表中的信息：

```sql
-- 创建一个用于销售数据的表
CREATE TABLE sales (
    product_id INT,
    quantity_sold INT,
    revenue DECIMAL(10, 2)
);

-- 插入一些示例销售数据
INSERT INTO sales (product_id, quantity_sold, revenue) VALUES
    (1, 100, 500.00),
    (2, 150, 750.00),
    (1, 200, 1000.00),
    (3, 50, 250.00);

-- 创建一个汇总表来存储汇总的销售数据
CREATE TABLE sales_summary (
    product_id INT,
    total_quantity_sold INT,
    total_revenue DECIMAL(10, 2)
);

-- 将汇总的销售数据插入到汇总表中
INSERT INTO sales_summary (product_id, total_quantity_sold, total_revenue)
SELECT 
    product_id,
    SUM(quantity_sold) AS total_quantity_sold,
    SUM(revenue) AS total_revenue
FROM 
    sales
GROUP BY 
    product_id;

-- 显示 sales_summary 表的内容
SELECT * FROM sales_summary;

┌──────────────────────────────────────────────────────────────────┐
│    product_id   │ total_quantity_sold │       total_revenue      │
├─────────────────┼─────────────────────┼──────────────────────────┤
│               1 │                 300 │ 1500.00                  │
│               3 │                  50 │ 250.00                   │
│               2 │                 150 │ 750.00                   │
└──────────────────────────────────────────────────────────────────┘
```

### 示例-3：插入默认值

此示例演示如何创建一个名为“staff_records”的表，并为部门和状态等列设置默认值。然后插入数据，展示默认值的使用。

```sql
-- 创建一个“staff_records”表，其中包含“employee_id”、“department”、“salary”和“status”列，并带有默认值
CREATE TABLE staff_records (
    employee_id INT NULL,
    department VARCHAR(50) DEFAULT 'HR',
    salary FLOAT,
    status VARCHAR(10) DEFAULT 'Active'
);

-- 将数据插入到带有默认值的“staff_records”中
INSERT INTO staff_records
VALUES
    (DEFAULT, DEFAULT, DEFAULT, DEFAULT),
    (101, DEFAULT, 50000.00, DEFAULT),
    (102, 'Finance', 60000.00, 'Inactive'),
    (103, 'Marketing', 70000.00, 'Active');

-- 显示“staff_records”表的内容
SELECT * FROM staff_records;

┌───────────────────────────────────────────────────────────────────────────┐
│   employee_id   │    department    │       salary      │      status      │
├─────────────────┼──────────────────┼───────────────────┼──────────────────┤
│            NULL │ HR               │              NULL │ Active           │
│             101 │ HR               │             50000 │ Active           │
│             102 │ Finance          │             60000 │ Inactive         │
│             103 │ Marketing        │             70000 │ Active           │
└───────────────────────────────────────────────────────────────────────────┘
```

### 示例-4：使用 Stage 文件插入

通过 Databend，您可以使用 INSERT INTO 语句从 Stage 文件将数据插入到表中。这是通过 Databend 的[查询 Stage 文件](/guides/load-data/transform/querying-stage)的能力实现的，随后将查询结果合并到表中。

1. 创建一个名为 `sample` 的表：

```sql
CREATE TABLE sample
(
    id      INT,
    city    VARCHAR,
    score   INT,
    country VARCHAR DEFAULT 'China'
);
```

2. 使用示例数据设置内部 Stage

我们将建立一个名为 `mystage` 的内部 Stage，然后使用示例数据填充它。

```sql
CREATE STAGE mystage;
       
COPY INTO @mystage
FROM 
(
    SELECT * 
    FROM 
    (
        VALUES 
        (1, 'Chengdu', 80),
        (3, 'Chongqing', 90),
        (6, 'Hangzhou', 92),
        (9, 'Hong Kong', 88)
    )
)
FILE_FORMAT = (TYPE = PARQUET);
```

3. 使用 `INSERT INTO` 从 Stage Parquet 文件插入数据

:::tip
您可以使用 [COPY INTO](dml-copy-into-table.md) 命令中提供的 FILE_FORMAT 和 COPY_OPTIONS 指定文件格式和各种复制相关设置。当 `purge` 设置为 `true` 时，只有在数据更新成功后才会删除原始文件。
:::

```sql
INSERT INTO sample 
    (id, city, score) 
ON
    (Id)
SELECT
    $1, $2, $3
FROM
    @mystage
    (FILE_FORMAT => 'parquet');
```

4. 验证数据插入

```sql
SELECT * FROM sample;
```

结果应为：
```sql
┌─────────────────────────────────────────────────────────────────────────┐
│        id       │       city       │      score      │      country     │
├─────────────────┼──────────────────┼─────────────────┼──────────────────┤
│               1 │ Chengdu          │              80 │ China            │
│               3 │ Chongqing        │              90 │ China            │
│               6 │ Hangzhou         │              92 │ China            │
│               9 │ Hong Kong        │              88 │ China            │
└─────────────────────────────────────────────────────────────────────────┘
```