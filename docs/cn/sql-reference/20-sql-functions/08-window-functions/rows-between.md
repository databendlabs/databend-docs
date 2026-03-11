---
title: ROWS BETWEEN
---

基于行数为窗口函数定义窗口帧。

## 概述

`ROWS BETWEEN` 子句按物理行数来确定窗口帧的范围，支持滑动窗口、累计计算等多种基于行的聚合场景。

## 语法

```sql
FUNCTION() OVER (
    [ PARTITION BY partition_expression ]
    [ ORDER BY sort_expression ]
    ROWS BETWEEN frame_start AND frame_end
)
```

### 帧边界

| 边界 | 说明 | 示例 |
|------|------|------|
| `UNBOUNDED PRECEDING` | 分区起始行 | `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` |
| `n PRECEDING` | 当前行往前 n 行 | `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` |
| `CURRENT ROW` | 当前行 | `ROWS BETWEEN CURRENT ROW AND CURRENT ROW` |
| `n FOLLOWING` | 当前行往后 n 行 | `ROWS BETWEEN CURRENT ROW AND 2 FOLLOWING` |
| `UNBOUNDED FOLLOWING` | 分区末尾行 | `ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING` |

## ROWS 与 RANGE 的区别

| 维度 | ROWS | RANGE |
|------|------|-------|
| **定义方式** | 物理行数 | 逻辑值范围 |
| **边界依据** | 基于行的位置 | 基于值的位置 |
| **重复值处理** | 每行独立计算 | 相同值共享同一窗口帧 |
| **性能** | 通常更快 | 重复值多时较慢 |
| **适用场景** | 移动平均、累计汇总 | 时间窗口、百分位计算 |

## 示例

### 示例数据

```sql
CREATE OR REPLACE TABLE sales (
    sale_date DATE,
    product VARCHAR(20),
    amount DECIMAL(10,2)
);

INSERT INTO sales VALUES
    ('2024-01-01', 'A', 100.00),
    ('2024-01-02', 'A', 150.00),
    ('2024-01-03', 'A', 200.00),
    ('2024-01-04', 'A', 250.00),
    ('2024-01-05', 'A', 300.00),
    ('2024-01-01', 'B', 50.00),
    ('2024-01-02', 'B', 75.00),
    ('2024-01-03', 'B', 100.00),
    ('2024-01-04', 'B', 125.00),
    ('2024-01-05', 'B', 150.00);
```

### 1. 累计求和

```sql
SELECT sale_date, product, amount,
       SUM(amount) OVER (
           PARTITION BY product
           ORDER BY sale_date
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_total
FROM sales
ORDER BY product, sale_date;
```

结果：
```
sale_date   | product | amount | running_total
------------+---------+--------+--------------
2024-01-01  | A       | 100.00 | 100.00
2024-01-02  | A       | 150.00 | 250.00
2024-01-03  | A       | 200.00 | 450.00
2024-01-04  | A       | 250.00 | 700.00
2024-01-05  | A       | 300.00 | 1000.00
2024-01-01  | B       | 50.00  | 50.00
2024-01-02  | B       | 75.00  | 125.00
2024-01-03  | B       | 100.00 | 225.00
2024-01-04  | B       | 125.00 | 350.00
2024-01-05  | B       | 150.00 | 500.00
```

### 2. 移动平均（3 日窗口）

```sql
SELECT sale_date, product, amount,
       AVG(amount) OVER (
           PARTITION BY product
           ORDER BY sale_date
           ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
       ) AS moving_avg_3day
FROM sales
ORDER BY product, sale_date;
```

结果：
```
sale_date   | product | amount | moving_avg_3day
------------+---------+--------+----------------
2024-01-01  | A       | 100.00 | 100.00
2024-01-02  | A       | 150.00 | 125.00  -- (100+150)/2
2024-01-03  | A       | 200.00 | 150.00  -- (100+150+200)/3
2024-01-04  | A       | 250.00 | 200.00  -- (150+200+250)/3
2024-01-05  | A       | 300.00 | 250.00  -- (200+250+300)/3
```

### 3. 居中窗口（前 1 行 + 当前行 + 后 1 行）

```sql
SELECT sale_date, product, amount,
       SUM(amount) OVER (
           PARTITION BY product
           ORDER BY sale_date
           ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
       ) AS centered_sum
FROM sales
ORDER BY product, sale_date;
```

结果：
```
sale_date   | product | amount | centered_sum
------------+---------+--------+-------------
2024-01-01  | A       | 100.00 | 250.00  -- (100+150)
2024-01-02  | A       | 150.00 | 450.00  -- (100+150+200)
2024-01-03  | A       | 200.00 | 600.00  -- (150+200+250)
2024-01-04  | A       | 250.00 | 750.00  -- (200+250+300)
2024-01-05  | A       | 300.00 | 550.00  -- (250+300)
```

### 4. 向后看窗口

```sql
SELECT sale_date, product, amount,
       MIN(amount) OVER (
           PARTITION BY product
           ORDER BY sale_date
           ROWS BETWEEN CURRENT ROW AND 2 FOLLOWING
       ) AS min_next_3days
FROM sales
ORDER BY product, sale_date;
```

结果：
```
sale_date   | product | amount | min_next_3days
------------+---------+--------+---------------
2024-01-01  | A       | 100.00 | 100.00  -- min(100,150,200)
2024-01-02  | A       | 150.00 | 150.00  -- min(150,200,250)
2024-01-03  | A       | 200.00 | 200.00  -- min(200,250,300)
2024-01-04  | A       | 250.00 | 250.00  -- min(250,300)
2024-01-05  | A       | 300.00 | 300.00  -- min(300)
```

### 5. 全分区窗口

```sql
SELECT sale_date, product, amount,
       MAX(amount) OVER (
           PARTITION BY product
           ORDER BY sale_date
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS max_in_partition,
       MIN(amount) OVER (
           PARTITION BY product
           ORDER BY sale_date
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS min_in_partition
FROM sales
ORDER BY product, sale_date;
```

结果：
```
sale_date   | product | amount | max_in_partition | min_in_partition
------------+---------+--------+------------------+-----------------
2024-01-01  | A       | 100.00 | 300.00           | 100.00
2024-01-02  | A       | 150.00 | 300.00           | 100.00
2024-01-03  | A       | 200.00 | 300.00           | 100.00
2024-01-04  | A       | 250.00 | 300.00           | 100.00
2024-01-05  | A       | 300.00 | 300.00           | 100.00
```

## 常用模式

### 累计计算
**语法示例：**
```sql
-- 累计求和
SUM(column) OVER (ORDER BY sort_col ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)

-- 累计平均
AVG(column) OVER (ORDER BY sort_col ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)

-- 累计计数
COUNT(*) OVER (ORDER BY sort_col ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
```

**完整示例：**
```sql
SELECT sale_date, product, amount,
       SUM(amount) OVER (
           ORDER BY sale_date
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_total
FROM sales
ORDER BY sale_date;
```

### 滑动窗口
**语法示例：**
```sql
-- 3 期移动平均
AVG(column) OVER (ORDER BY sort_col ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)

-- 5 期移动求和
SUM(column) OVER (ORDER BY sort_col ROWS BETWEEN 4 PRECEDING AND CURRENT ROW)

-- 居中 3 期窗口
AVG(column) OVER (ORDER BY sort_col ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING)
```

**完整示例：**
```sql
SELECT sale_date, amount,
       AVG(amount) OVER (
           ORDER BY sale_date
           ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
       ) AS moving_avg_3day
FROM sales
ORDER BY sale_date;
```

### 固定范围窗口
**语法示例：**
```sql
-- 分区前 3 行
SUM(column) OVER (ORDER BY sort_col ROWS BETWEEN UNBOUNDED PRECEDING AND 2 FOLLOWING)

-- 分区后 3 行
SUM(column) OVER (ORDER BY sort_col ROWS BETWEEN 2 PRECEDING AND UNBOUNDED FOLLOWING)

-- 固定 5 行窗口
AVG(column) OVER (ORDER BY sort_col ROWS BETWEEN 2 PRECEDING AND 2 FOLLOWING)
```

**完整示例：**
```sql
SELECT sale_date, amount,
       AVG(amount) OVER (
           ORDER BY sale_date
           ROWS BETWEEN 2 PRECEDING AND 2 FOLLOWING
       ) AS avg_5row_window
FROM sales
ORDER BY sale_date;
```

## 最佳实践

1. **需要精确行数时选 ROWS** — 明确基于物理行位置的窗口场景
2. **使用 ROWS BETWEEN 时务必加 ORDER BY** — 全分区窗口（UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING）除外
3. **注意大窗口的性能** — 窗口越小，计算越高效
4. **处理边界行为** — 分区边缘处窗口会自动收缩
5. **搭配 PARTITION BY** — 实现分组内的独立计算
6. **理解边界收缩行为** — 分区边缘处窗口帧会变小

### 边界行为示例

**分区边缘的居中窗口：**
```sql
-- 第 1 行：ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
-- 实际窗口：CURRENT ROW AND 1 FOLLOWING（前面没有行）

-- 最后一行：ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
-- 实际窗口：1 PRECEDING AND CURRENT ROW（后面没有行）
```

**起始处的移动平均：**
```sql
-- 第 1 行：ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
-- 实际窗口：仅 CURRENT ROW（前面没有行）

-- 第 2 行：ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
-- 实际窗口：1 PRECEDING AND CURRENT ROW（只有 1 行在前）
```

这是正常行为——窗口帧会根据分区边界自动调整可用行数。

## 限制

1. **n 必须为非负整数** — 不支持负数或表达式
2. **大多数窗口帧需要 ORDER BY** — 全分区窗口除外
3. **帧边界须有序** — start_bound 须 ≤ end_bound
4. **PRECEDING 与 FOLLOWING 须构成合法窗口** — 不能任意组合

## 参考

- [窗口函数概览](index.md)
- [RANGE BETWEEN](range-between.md) — 基于值范围的窗口帧
- [聚合函数](../07-aggregate-functions/index.md) — 可与窗口帧配合使用的函数
- [FIRST_VALUE](first-value.md) — 带窗口帧的函数示例
