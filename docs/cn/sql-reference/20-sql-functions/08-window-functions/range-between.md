---
title: RANGE BETWEEN
---

基于值范围为窗口函数定义窗口帧。

## 概述

`RANGE BETWEEN` 子句按逻辑值范围（而非物理行数）来确定窗口帧的范围，特别适合处理基于时间的滑动窗口、按值分组以及重复值等场景。

## 语法

```sql
FUNCTION() OVER (
    [ PARTITION BY partition_expression ]
    [ ORDER BY sort_expression ]
    RANGE BETWEEN frame_start AND frame_end
)
```

### 帧边界

| 边界 | 说明 | 示例 |
|------|------|------|
| `UNBOUNDED PRECEDING` | 分区起始行 | `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` |
| `value PRECEDING` | 当前行值往前偏移指定范围 | `RANGE BETWEEN INTERVAL '7' DAY PRECEDING AND CURRENT ROW` |
| `CURRENT ROW` | 当前行的值 | `RANGE BETWEEN CURRENT ROW AND CURRENT ROW` |
| `value FOLLOWING` | 当前行值往后偏移指定范围 | `RANGE BETWEEN CURRENT ROW AND INTERVAL '7' DAY FOLLOWING` |
| `UNBOUNDED FOLLOWING` | 分区末尾行 | `RANGE BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING` |

## RANGE 与 ROWS 的区别

| 维度 | RANGE | ROWS |
|------|-------|------|
| **定义方式** | 逻辑值范围 | 物理行数 |
| **边界依据** | 基于值的位置 | 基于行的位置 |
| **重复值处理** | 相同值共享同一窗口帧 | 每行独立计算 |
| **性能** | 重复值多时较慢 | 通常更快 |
| **适用场景** | 时间窗口、百分位计算 | 移动平均、累计汇总 |

## RANGE 支持的值类型

### 1. 数值
```sql
-- 包含当前值前后 ±10 范围内的行
RANGE BETWEEN 10 PRECEDING AND 10 FOLLOWING

-- 包含值不低于当前值 50 的所有行
RANGE BETWEEN 50 PRECEDING AND CURRENT ROW
```

### 2. 时间间隔（适用于 DATE/TIMESTAMP）
```sql
-- 7 天滚动窗口
RANGE BETWEEN INTERVAL '7' DAY PRECEDING AND CURRENT ROW

-- 1 小时窗口
RANGE BETWEEN INTERVAL '1' HOUR PRECEDING AND CURRENT ROW

-- 前后各 15 分钟的居中窗口
RANGE BETWEEN INTERVAL '15' MINUTE PRECEDING AND INTERVAL '15' MINUTE FOLLOWING
```

### 3. 不指定值（默认行为）
`PRECEDING` 或 `FOLLOWING` 不带值时，默认等同于 `CURRENT ROW`：
```sql
RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW  -- 默认行为
```

## 示例

### 示例数据

```sql
CREATE TABLE temperature_readings (
    reading_time TIMESTAMP,
    sensor_id VARCHAR(10),
    temperature DECIMAL(5,2)
);

INSERT INTO temperature_readings VALUES
    ('2024-01-01 00:00:00', 'S1', 20.5),
    ('2024-01-01 01:00:00', 'S1', 21.0),
    ('2024-01-01 02:00:00', 'S1', 20.8),
    ('2024-01-01 03:00:00', 'S1', 22.1),
    ('2024-01-01 04:00:00', 'S1', 21.5),
    ('2024-01-01 00:00:00', 'S2', 19.8),
    ('2024-01-01 01:00:00', 'S2', 20.2),
    ('2024-01-01 02:00:00', 'S2', 19.9),
    ('2024-01-01 03:00:00', 'S2', 21.0),
    ('2024-01-01 04:00:00', 'S2', 20.5);
```

### 1. 24 小时滚动平均

```sql
SELECT reading_time, sensor_id, temperature,
       AVG(temperature) OVER (
           PARTITION BY sensor_id
           ORDER BY reading_time
           RANGE BETWEEN INTERVAL '24' HOUR PRECEDING AND CURRENT ROW
       ) AS avg_24h
FROM temperature_readings
ORDER BY sensor_id, reading_time;
```

### 2. 基于值的窗口（±0.5 度范围内）

```sql
SELECT reading_time, sensor_id, temperature,
       COUNT(*) OVER (
           PARTITION BY sensor_id
           ORDER BY temperature
           RANGE BETWEEN 0.5 PRECEDING AND 0.5 FOLLOWING
       ) AS similar_readings_count
FROM temperature_readings
ORDER BY sensor_id, temperature;
```

### 3. 重复值处理

```sql
CREATE TABLE sales_duplicates (
    sale_date DATE,
    amount DECIMAL(10,2)
);

INSERT INTO sales_duplicates VALUES
    ('2024-01-01', 100.00),
    ('2024-01-01', 100.00),  -- 重复日期
    ('2024-01-02', 150.00),
    ('2024-01-03', 200.00),
    ('2024-01-03', 200.00);  -- 重复日期

-- RANGE 将相同日期视为同一"行"参与窗口计算
SELECT sale_date, amount,
       SUM(amount) OVER (
           ORDER BY sale_date
           RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_total_range,
       SUM(amount) OVER (
           ORDER BY sale_date
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_total_rows
FROM sales_duplicates
ORDER BY sale_date;
```

**结果对比：**
```
sale_date   | amount | running_total_range | running_total_rows
------------+--------+---------------------+--------------------
2024-01-01  | 100.00 | 200.00              | 100.00
2024-01-01  | 100.00 | 200.00              | 200.00  -- ROWS: 逐行累加
2024-01-02  | 150.00 | 350.00              | 350.00
2024-01-03  | 200.00 | 750.00              | 550.00
2024-01-03  | 200.00 | 750.00              | 750.00  -- ROWS: 逐行累加
```

### 4. 居中时间窗口

```sql
SELECT reading_time, sensor_id, temperature,
       AVG(temperature) OVER (
           PARTITION BY sensor_id
           ORDER BY reading_time
           RANGE BETWEEN INTERVAL '30' MINUTE PRECEDING
                     AND INTERVAL '30' MINUTE FOLLOWING
       ) AS avg_hour_centered
FROM temperature_readings
ORDER BY sensor_id, reading_time;
```

## 常用模式

### 时间窗口
**语法示例：**
```sql
-- 7 天滚动窗口
RANGE BETWEEN INTERVAL '7' DAY PRECEDING AND CURRENT ROW

-- 前后各 30 分钟的居中窗口
RANGE BETWEEN INTERVAL '30' MINUTE PRECEDING AND INTERVAL '30' MINUTE FOLLOWING

-- 月初至今（ORDER BY 为日期时）
RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
```

**完整示例：**
```sql
-- 7 天滚动平均
SELECT sale_date, amount,
       AVG(amount) OVER (
           ORDER BY sale_date
           RANGE BETWEEN INTERVAL '7' DAY PRECEDING AND CURRENT ROW
       ) AS avg_7day
FROM sales
ORDER BY sale_date;
```

### 基于值的窗口
**语法示例：**
```sql
-- ±10 单位范围内
RANGE BETWEEN 10 PRECEDING AND 10 FOLLOWING

-- 不低于当前值 100 的所有行
RANGE BETWEEN 100 PRECEDING AND CURRENT ROW

-- 注意：不支持复杂表达式（如 current * 0.05），请使用固定值
```

**完整示例：**
```sql
-- ±0.5 单位范围内的行
SELECT temperature, reading_time,
       COUNT(*) OVER (
           ORDER BY temperature
           RANGE BETWEEN 0.5 PRECEDING AND 0.5 FOLLOWING
       ) AS similar_readings
FROM temperature_readings
ORDER BY temperature;
```

### 重复值处理
**语法示例：**
```sql
-- 将所有重复值纳入同一窗口
RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW

-- 按值分组（相同值归为一组）
RANGE BETWEEN 0 PRECEDING AND 0 FOLLOWING
```

**完整示例：**
```sql
-- RANGE 将相同日期视为同一窗口
SELECT sale_date, amount,
       SUM(amount) OVER (
           ORDER BY sale_date
           RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_total_range
FROM sales_duplicates
ORDER BY sale_date;
```

## 最佳实践

1. **值范围场景优先选 RANGE** — 关注逻辑值范围而非行数时使用
2. **搭配 DATE/TIMESTAMP 使用** — 非常适合时间序列计算
3. **有意识地处理重复值** — RANGE 会将 ORDER BY 值相同的行归入同一窗口
4. **关注性能** — 重复值较多时，RANGE 可能比 ROWS 慢
5. **明确指定时间间隔** — 日期/时间窗口请使用显式的 INTERVAL 语法

## 限制

1. **ORDER BY 列须为数值或时间类型** — RANGE 要求可排序的值
2. **仅支持单列 ORDER BY** — RANGE 只能按一列排序
3. **值表达式有限制** — 仅支持简单数值或 interval，不支持复杂表达式
4. **重复值较多时性能较差** — 可考虑改用 ROWS
5. **帧边界类型须一致** — PRECEDING 与 FOLLOWING 须使用相同单位

## 参考

- [窗口函数概览](index.md)
- [ROWS BETWEEN](rows-between.md) — 基于行数的窗口帧
- [聚合函数](../07-aggregate-functions/index.md) — 可与窗口帧配合使用的函数
- [日期与时间函数](../05-datetime-functions/index.md) — 与 RANGE interval 配合使用
