---
title: SUM
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.697"/>

计算一组值的总和。

- NULL 值会被忽略。
- 支持数值和间隔类型。

## 语法

```sql
SUM(<expr>)
```

## 返回类型

与输入类型相同。

## 示例

此示例演示了如何创建一个包含 INTEGER、DOUBLE 和 INTERVAL 列的表，插入数据，并使用 SUM 计算每列的总和：

```sql
-- 创建一个包含整数、双精度和间隔列的表
CREATE TABLE sum_example (
    id INT,
    int_col INTEGER,
    double_col DOUBLE,
    interval_col INTERVAL
);

-- 插入数据
INSERT INTO sum_example VALUES 
(1, 10, 15.5, INTERVAL '2 days'),
(2, 20, 25.7, INTERVAL '3 days'),
(3, NULL, 5.2, INTERVAL '1 day'),  
(4, 30, 40.1, INTERVAL '4 days');

-- 计算每列的总和
SELECT 
    SUM(int_col) AS total_integer,
    SUM(double_col) AS total_double,
    SUM(interval_col) AS total_interval
FROM sum_example;
```

预期输出：

```sql
-- NULL 值被忽略。
-- SUM(interval_col) 返回 240:00:00（10 天）。

┌──────────────────────────────────────────────────────────┐
│  total_integer  │    total_double   │   total_interval   │
├─────────────────┼───────────────────┼────────────────────┤
│              60 │              86.5 │ 240:00:00          │
└──────────────────────────────────────────────────────────┘
```