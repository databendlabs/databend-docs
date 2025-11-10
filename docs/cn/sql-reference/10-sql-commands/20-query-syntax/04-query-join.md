---
title: JOIN（连接）
---

## 概述

JOIN 用于将多个表的列合并到同一个结果集中。Databend 在实现 ANSI SQL 标准 JOIN 的基础上，还扩展了语法支持，让开发者能够用统一的方式处理维度数据、缓慢变化维度（SCD）以及时间序列等复杂场景。

## 支持的类型

* [Inner Join](#inner-join)
* [Natural Join](#natural-join)
* [Cross Join](#cross-join)
* [Left Join](#left-join)
* [Right Join](#right-join)
* [Full Outer Join](#full-outer-join)
* [Left / Right Semi Join](#left--right-semi-join)
* [Left / Right Anti Join](#left--right-anti-join)
* [ASOF Join](#asof-join)

## 示例数据

### 准备表数据

先运行下面的 SQL，创建并填充本页所用到的所有表：

```sql
-- VIP 资料
CREATE OR REPLACE TABLE vip_info (client_id INT, region VARCHAR);
INSERT INTO vip_info VALUES
    (101, 'Toronto'),
    (102, 'Quebec'),
    (103, 'Vancouver');

CREATE OR REPLACE TABLE purchase_records (client_id INT, item VARCHAR, qty INT);
INSERT INTO purchase_records VALUES
    (100, 'Croissant', 2000),
    (102, 'Donut',     3000),
    (103, 'Coffee',    6000),
    (106, 'Soda',      4000);

CREATE OR REPLACE TABLE gift (gift VARCHAR);
INSERT INTO gift VALUES
    ('Croissant'), ('Donut'), ('Coffee'), ('Soda');

-- 行情 & 交易样例
CREATE OR REPLACE TABLE trades (symbol VARCHAR, time INT, price INT);
INSERT INTO trades VALUES
    ('AAPL', 100003, 101),
    ('AAPL', 100007, 103),
    ('MSFT', 100002,  99),
    ('TSLA', 100010, 200);

CREATE OR REPLACE TABLE quotes (symbol VARCHAR, time INT, bid INT, ask INT);
INSERT INTO quotes VALUES
    ('AAPL', 100000,  99, 102),
    ('AAPL', 100005, 100, 104),
    ('MSFT', 100001,  98, 101),
    ('NVDA', 100006, 150, 155);

-- ASOF 示例的物联网数据
CREATE OR REPLACE TABLE sensor_readings (
    room VARCHAR,
    reading_time TIMESTAMP,
    temperature DOUBLE
);
INSERT INTO sensor_readings VALUES
    ('LivingRoom', '2024-01-01 09:55:00', 22.8),
    ('LivingRoom', '2024-01-01 10:00:00', 23.1),
    ('LivingRoom', '2024-01-01 10:05:00', 23.3),
    ('LivingRoom', '2024-01-01 10:10:00', 23.8),
    ('LivingRoom', '2024-01-01 10:15:00', 24.0);

CREATE OR REPLACE TABLE hvac_mode (
    room VARCHAR,
    mode_time TIMESTAMP,
    mode VARCHAR
);
INSERT INTO hvac_mode VALUES
    ('LivingRoom', '2024-01-01 09:58:00', 'Cooling'),
    ('LivingRoom', '2024-01-01 10:06:00', 'Fan'),
    ('LivingRoom', '2024-01-01 10:30:00', 'Heating');
```

### 预览数据

如无特别说明，下文所有示例均基于这些表数据进行演示，便于直观对比各种 JOIN 类型的差异。

```text
vip_info
+-----------+-----------+
| client_id | region    |
+-----------+-----------+
| 101       | Toronto   |
| 102       | Quebec    |
| 103       | Vancouver |
+-----------+-----------+

purchase_records
+-----------+-----------+------+
| client_id | item      | qty  |
+-----------+-----------+------+
| 100       | Croissant | 2000 |
| 102       | Donut     | 3000 |
| 103       | Coffee    | 6000 |
| 106       | Soda      | 4000 |
+-----------+-----------+------+

gift
+-----------+
| gift      |
+-----------+
| Croissant |
| Donut     |
| Coffee    |
| Soda      |
+-----------+
```

时间序列示例使用如下行情快照：

```text
trades
+--------+--------+-------+
| symbol | time   | price |
+--------+--------+-------+
| AAPL   | 100003 |   101 |
| AAPL   | 100007 |   103 |
| MSFT   | 100002 |    99 |
| TSLA   | 100010 |   200 |
+--------+--------+-------+

quotes
+--------+--------+-----+-----+
| symbol | time   | bid | ask |
+--------+--------+-----+-----+
| AAPL   | 100000 |  99 | 102 |
| AAPL   | 100005 | 100 | 104 |
| MSFT   | 100001 |  98 | 101 |
| NVDA   | 100006 | 150 | 155 |
+--------+--------+-----+-----+

sensor_readings
+-----------+---------------------+-------------+
| room      | reading_time        | temperature |
+-----------+---------------------+-------------+
| LivingRoom| 2024-01-01 09:55:00 | 22.8        |
| LivingRoom| 2024-01-01 10:00:00 | 23.1        |
| LivingRoom| 2024-01-01 10:05:00 | 23.3        |
| LivingRoom| 2024-01-01 10:10:00 | 23.8        |
| LivingRoom| 2024-01-01 10:15:00 | 24.0        |
+-----------+---------------------+-------------+

hvac_mode
+-----------+---------------------+----------+
| room      | mode_time           | mode     |
+-----------+---------------------+----------+
| LivingRoom| 2024-01-01 09:58:00 | Cooling  |
| LivingRoom| 2024-01-01 10:06:00 | Fan      |
| LivingRoom| 2024-01-01 10:30:00 | Heating  |
+-----------+---------------------+----------+
```

## Inner Join

内连接仅返回满足连接条件的记录。

### 可视化

```text
┌──────────────────────────────┐
│ vip_info (left)              │
├──────────────────────────────┤
│ client_id | region           │
│ 101       | Toronto          │
│ 102       | Quebec           │
│ 103       | Vancouver        │
└──────────────────────────────┘
           │ client_id = client_id
           ▼
┌──────────────────────────────┐
│ purchase_records (right)     │
├──────────────────────────────┤
│ client_id | item     | qty   │
│ 100       | Croissant | 2000 │
│ 102       | Donut     | 3000 │
│ 103       | Coffee    | 6000 │
│ 106       | Soda      | 4000 │
└──────────────────────────────┘
           │ 只保留匹配
           ▼
┌──────────────────────────────┐
│ INNER JOIN RESULT            │
├──────────────────────────────┤
│ 102 | Donut  | 3000          │
│ 103 | Coffee | 6000          │
└──────────────────────────────┘
```

### 语法

```sql
SELECT select_list
FROM table_a
     [INNER] JOIN table_b
              ON join_condition
```

:::tip
`INNER` 关键字可以省略；当连接列名称相同时，可以使用 `USING(column_name)` 语法。
:::

### 示例

```sql
SELECT p.client_id, p.item, p.qty
FROM vip_info AS v
INNER JOIN purchase_records AS p
        ON v.client_id = p.client_id;
```

结果：

```text
+-----------+--------+------+
| client_id | item   | qty  |
+-----------+--------+------+
| 102       | Donut  | 3000 |
| 103       | Coffee | 6000 |
+-----------+--------+------+
```

## Natural Join

自然连接会自动匹配两个表中所有同名列，并在结果集中只保留一份同名列。

### 可视化

```text
┌──────────────────────────────┐
│ vip_info                     │
├──────────────────────────────┤
│ client_id | region           │
│ 101       | Toronto          │
│ 102       | Quebec           │
│ 103       | Vancouver        │
└──────────────────────────────┘
           │ 自动匹配所有同名列
           ▼
┌──────────────────────────────┐
│ purchase_records             │
├──────────────────────────────┤
│ client_id | item     | qty   │
│ 100       | Croissant | 2000 │
│ 102       | Donut     | 3000 │
│ 103       | Coffee    | 6000 │
│ 106       | Soda      | 4000 │
└──────────────────────────────┘
           │ 同名列只输出一次
           ▼
┌──────────────────────────────┐
│ NATURAL JOIN RESULT          │
├──────────────────────────────┤
│ 102: Quebec + Donut + 3000   │
│ 103: Vanc. + Coffee + 6000   │
└──────────────────────────────┘
```

### 语法

```sql
SELECT select_list
FROM table_a
NATURAL JOIN table_b;
```

### 示例

```sql
SELECT client_id, item, qty
FROM vip_info
NATURAL JOIN purchase_records;
```

结果：

```text
+-----------+--------+------+
| client_id | item   | qty  |
+-----------+--------+------+
| 102       | Donut  | 3000 |
| 103       | Coffee | 6000 |
+-----------+--------+------+
```

## Cross Join

交叉连接（笛卡尔积）会返回所有可能的表组合。

### 可视化

```text
┌──────────────────────────────┐
│ vip_info (3 行)              │
├──────────────────────────────┤
│ 101 | Toronto                │
│ 102 | Quebec                 │
│ 103 | Vancouver              │
└──────────────────────────────┘
           │ 与所有礼品组合
           ▼
┌──────────────────────────────┐
│ gift (4 行)                  │
├──────────────────────────────┤
│ Croissant                    │
│ Donut                        │
│ Coffee                       │
│ Soda                         │
└──────────────────────────────┘
           │ 3 × 4 = 12
           ▼
┌──────────────────────────────┐
│ CROSS JOIN RESULT（节选）    │
├──────────────────────────────┤
│ 101 | Toronto | Croissant    │
│ 101 | Toronto | Donut        │
│ 101 | Toronto | Coffee       │
│ ... | ...     | ...          │
└──────────────────────────────┘
```

### 语法

```sql
SELECT select_list
FROM table_a
CROSS JOIN table_b;
```

### 示例

```sql
SELECT v.client_id, v.region, g.gift
FROM vip_info AS v
CROSS JOIN gift AS g;
```

结果（部分）：

```text
+-----------+----------+-----------+
| client_id | region   | gift      |
+-----------+----------+-----------+
| 101       | Toronto  | Croissant |
| 101       | Toronto  | Donut     |
| 101       | Toronto  | Coffee    |
| 101       | Toronto  | Soda      |
| ...       | ...      | ...       |
+-----------+----------+-----------+
```

## Left Join

左连接会保留左表的所有记录，右表只显示匹配的记录；对于未匹配的记录，右表列值为 `NULL`。

### 可视化

```text
┌──────────────────────────────┐
│ vip_info（左表保留）         │
├──────────────────────────────┤
│ 101 | Toronto                │
│ 102 | Quebec                 │
│ 103 | Vancouver              │
└──────────────────────────────┘
           │ 按 client_id 连接
           ▼
┌──────────────────────────────┐
│ purchase_records             │
├──────────────────────────────┤
│ 100 | Croissant | 2000       │
│ 102 | Donut     | 3000       │
│ 103 | Coffee    | 6000       │
│ 106 | Soda      | 4000       │
└──────────────────────────────┘
           │ 未匹配行填 NULL
           ▼
┌──────────────────────────────┐
│ LEFT JOIN RESULT             │
├──────────────────────────────┤
│ 101 | Toronto | NULL | NULL  │
│ 102 | Quebec  | Donut | 3000 │
│ 103 | Vanc.   | Coffee| 6000 │
└──────────────────────────────┘
```

### 语法

```sql
SELECT select_list
FROM table_a
LEFT [OUTER] JOIN table_b
             ON join_condition;
```

:::tip
`OUTER` 关键字是可选的。
:::

### 示例

```sql
SELECT v.client_id, p.item, p.qty
FROM vip_info AS v
LEFT JOIN purchase_records AS p
       ON v.client_id = p.client_id;
```

结果：

```text
+-----------+--------+------+
| client_id | item   | qty  |
+-----------+--------+------+
| 101       | NULL   | NULL |
| 102       | Donut  | 3000 |
| 103       | Coffee | 6000 |
+-----------+--------+------+
```

## Right Join

右连接是左连接的镜像：右表记录全部保留，左表未匹配的记录列值为 `NULL`。

### 可视化

```text
┌──────────────────────────────┐
│ purchase_records（右表）     │
├──────────────────────────────┤
│ 100 | Croissant | 2000       │
│ 102 | Donut     | 3000       │
│ 103 | Coffee    | 6000       │
│ 106 | Soda      | 4000       │
└──────────────────────────────┘
           ▲ 右表全部保留
           │ client_id 匹配
┌──────────────────────────────┐
│ vip_info                     │
├──────────────────────────────┤
│ 101 | Toronto                │
│ 102 | Quebec                 │
│ 103 | Vancouver              │
└──────────────────────────────┘
           ▼ 左侧缺失填 NULL
┌──────────────────────────────┐
│ RIGHT JOIN RESULT            │
├──────────────────────────────┤
│ 100 | Croissant | vip=NULL   │
│ 102 | Donut     | region=QC  │
│ 103 | Coffee    | region=VAN │
│ 106 | Soda      | vip=NULL   │
└──────────────────────────────┘
```

### 语法

```sql
SELECT select_list
FROM table_a
RIGHT [OUTER] JOIN table_b
              ON join_condition;
```

### 示例

```sql
SELECT v.client_id, v.region
FROM vip_info AS v
RIGHT JOIN purchase_records AS p
       ON v.client_id = p.client_id;
```

结果：

```text
+-----------+-----------+
| client_id | region    |
+-----------+-----------+
| NULL      | NULL      |
| 102       | Quebec    |
| 103       | Vancouver |
| NULL      | NULL      |
+-----------+-----------+
```

## Full Outer Join

全外连接相当于左连接和右连接的并集：两个表的所有记录都会出现在结果中，未匹配的列显示为 `NULL`。

### 可视化

```text
┌──────────────────────────────┐
│ vip_info                     │
├──────────────────────────────┤
│ 101 | Toronto                │
│ 102 | Quebec                 │
│ 103 | Vancouver              │
└──────────────────────────────┘
┌──────────────────────────────┐
│ purchase_records             │
├──────────────────────────────┤
│ 100 | Croissant | 2000       │
│ 102 | Donut     | 3000       │
│ 103 | Coffee    | 6000       │
│ 106 | Soda      | 4000       │
└──────────────────────────────┘
           │ 左匹配 + 左独有 + 右独有
           ▼
┌──────────────────────────────┐
│ FULL OUTER JOIN RESULT       │
├──────────────────────────────┤
│ Toronto  | NULL              │
│ Quebec   | Donut             │
│ Vanc.    | Coffee            │
│ NULL     | Croissant         │
│ NULL     | Soda              │
└──────────────────────────────┘
```

### 语法

```sql
SELECT select_list
FROM table_a
FULL [OUTER] JOIN table_b
             ON join_condition;
```

### 示例

```sql
SELECT v.region, p.item
FROM vip_info AS v
FULL OUTER JOIN purchase_records AS p
            ON v.client_id = p.client_id;
```

结果：

```text
+-----------+-----------+
| region    | item      |
+-----------+-----------+
| Toronto   | NULL      |
| Quebec    | Donut     |
| Vancouver | Coffee    |
| NULL      | Croissant |
| NULL      | Soda      |
+-----------+-----------+
```

## Left / Right Semi Join

半连接只返回保留侧（左侧或右侧）的列，主要用于存在性过滤：左半连接返回左表中存在匹配的记录，右半连接则返回右表中存在匹配的记录。

### 可视化

```text
LEFT SEMI JOIN
┌──────────────────────────────┐
│ vip_info                     │
├──────────────────────────────┤
│ 101 | Toronto                │
│ 102 | Quebec                 │
│ 103 | Vancouver              │
└──────────────────────────────┘
           │ 仅保留找到匹配的行
           ▼
┌──────────────────────────────┐
│ purchase_records             │
├──────────────────────────────┤
│ 100 | Croissant | 2000       │
│ 102 | Donut     | 3000       │
│ 103 | Coffee    | 6000       │
│ 106 | Soda      | 4000       │
└──────────────────────────────┘
           ▼
┌──────────────────────────────┐
│ LEFT SEMI RESULT             │
├──────────────────────────────┤
│ 102 | Quebec                 │
│ 103 | Vanc.                  │
└──────────────────────────────┘

RIGHT SEMI JOIN
┌──────────────────────────────┐
│ purchase_records             │
├──────────────────────────────┤
│ 100 | Croissant | 2000       │
│ 102 | Donut     | 3000       │
│ 103 | Coffee    | 6000       │
│ 106 | Soda      | 4000       │
└──────────────────────────────┘
           │ 只保留能匹配 VIP 的行
           ▼
┌──────────────────────────────┐
│ vip_info                     │
├──────────────────────────────┤
│ 101 | Toronto                │
│ 102 | Quebec                 │
│ 103 | Vancouver              │
└──────────────────────────────┘
           ▼
┌──────────────────────────────┐
│ RIGHT SEMI RESULT            │
├──────────────────────────────┤
│ 102 | Donut | 3000           │
│ 103 | Coffee | 6000          │
└──────────────────────────────┘
```

### 语法

```sql
-- Left Semi Join
SELECT select_list
FROM table_a
LEFT SEMI JOIN table_b
           ON join_condition;

-- Right Semi Join
SELECT select_list
FROM table_a
RIGHT SEMI JOIN table_b
            ON join_condition;
```

### 示例

左半连接：筛选出有购买记录的 VIP 客户：

```sql
SELECT *
FROM vip_info
LEFT SEMI JOIN purchase_records
           ON vip_info.client_id = purchase_records.client_id;
```

右半连接：筛选出 VIP 客户的购买记录：

```sql
SELECT *
FROM vip_info
RIGHT SEMI JOIN purchase_records
            ON vip_info.client_id = purchase_records.client_id;
```

## Left / Right Anti Join

反连接与半连接正好相反：左反连接返回左表中无法匹配右表的记录，右反连接则返回右表中无法匹配左表的记录。

### 可视化

```text
LEFT ANTI JOIN
┌──────────────────────────────┐
│ vip_info                     │
├──────────────────────────────┤
│ 101 | Toronto                │
│ 102 | Quebec                 │
│ 103 | Vancouver              │
└──────────────────────────────┘
           │ 去掉所有匹配行
           ▼
┌──────────────────────────────┐
│ purchase_records             │
├──────────────────────────────┤
│ 100 | Croissant | 2000       │
│ 102 | Donut     | 3000       │
│ 103 | Coffee    | 6000       │
│ 106 | Soda      | 4000       │
└──────────────────────────────┘
           ▼
┌──────────────────────────────┐
│ LEFT ANTI RESULT             │
├──────────────────────────────┤
│ 101 | Toronto                │
└──────────────────────────────┘

RIGHT ANTI JOIN
┌──────────────────────────────┐
│ purchase_records             │
├──────────────────────────────┤
│ 100 | Croissant | 2000       │
│ 102 | Donut     | 3000       │
│ 103 | Coffee    | 6000       │
│ 106 | Soda      | 4000       │
└──────────────────────────────┘
           │ 去掉能匹配 VIP 的行
           ▼
┌──────────────────────────────┐
│ vip_info                     │
├──────────────────────────────┤
│ 101 | Toronto                │
│ 102 | Quebec                 │
│ 103 | Vancouver              │
└──────────────────────────────┘
           ▼
┌──────────────────────────────┐
│ RIGHT ANTI RESULT            │
├──────────────────────────────┤
│ 100 | Croissant | 2000       │
│ 106 | Soda      | 4000       │
└──────────────────────────────┘
```

### 语法

```sql
-- Left Anti Join
SELECT select_list
FROM table_a
LEFT ANTI JOIN table_b
           ON join_condition;

-- Right Anti Join
SELECT select_list
FROM table_a
RIGHT ANTI JOIN table_b
            ON join_condition;
```

### 示例

左反连接：找出没有任何购买记录的 VIP 客户：

```sql
SELECT *
FROM vip_info
LEFT ANTI JOIN purchase_records
           ON vip_info.client_id = purchase_records.client_id;
```

右反连接：找出非 VIP 客户的购买记录：

```sql
SELECT *
FROM vip_info
RIGHT ANTI JOIN purchase_records
            ON vip_info.client_id = purchase_records.client_id;
```

## ASOF Join

ASOF（近似排序合并）连接会将左表的每一行与右表中"时间不晚于当前行"的最新记录进行匹配。简单来说，就是为每个事件找到"发生前最新的上下文"。这种连接方式常用于将最新报价关联到交易记录，或将最新的 HVAC 模式关联到温度采样数据等场景。

### 匹配规则

1. 首先按照等值列（如 `room`、`symbol`）对两个表进行分组
2. 在每个分组内按时间列排序
3. 遍历左表记录时，找到右表中时间 `<=` 当前记录时间的最新记录；若不存在则填充 `NULL`

### 快速示例：温度读数 VS HVAC 模式

```text
┌──────────────────────────────┐
│ sensor_readings (left table) │
├──────────────────────────────┤
│ room | time  | temperature   │
│ LR   | 09:55 | 22.8C         │
│ LR   | 10:00 | 23.1C         │
│ LR   | 10:05 | 23.3C         │
│ LR   | 10:10 | 23.8C         │
│ LR   | 10:15 | 24.0C         │
└──────────────────────────────┘

┌──────────────────────────────┐
│ hvac_mode (right table)      │
├──────────────────────────────┤
│ room | time  | mode          │
│ LR   | 09:58 | Cooling       │
│ LR   | 10:06 | Fan           │
│ LR   | 10:30 | Heating       │
└──────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ Result of ASOF JOIN                                         │
│   ON r.room = m.room                                        │
│  AND r.reading_time >= m.mode_time                          │
├────────────────────────────────────────────────────────────┤
│ 10:00 reading -> latest mode 09:58 (<= 10:00)               │
│ 10:05 reading -> still mode 09:58 (no change yet)           │
│ 10:10 reading -> mode 10:06                                 │
│ 10:15 reading -> still mode 10:06                           │
│ 09:55 reading -> no match (behaves like INNER JOIN)         │
└────────────────────────────────────────────────────────────┘

上表演示了 ASOF 在 HVAC 场景中的匹配：每条温度读数都会拿到“时间不晚于自身”的最新模式；如果某条读数发生在第一条模式之前（09:55），普通 ASOF JOIN 会将其过滤掉。
```

左 ASOF 连接会保留所有的传感器读数（比如 09:55 的记录仍会保留，只是模式为 `NULL`）；右 ASOF 连接会保留所有的 HVAC 模式（即使暂时没有任何读数与之匹配）。

### 语法

```sql
SELECT select_list
FROM table_a
ASOF [LEFT | RIGHT] JOIN table_b
       ON table_a.time >= table_b.time
      [AND table_a.key = table_b.key];
```

### 示例数据

如果只想重现 HVAC 场景，可以单独执行以下语句：

```sql
CREATE OR REPLACE TABLE sensor_readings (
    reading_time TIMESTAMP,
    temperature  DOUBLE
);
INSERT INTO sensor_readings VALUES
    ('2024-01-01 10:00:00', 23.1),
    ('2024-01-01 10:05:00', 23.3),
    ('2024-01-01 10:10:00', 23.8),
    ('2024-01-01 10:15:00', 24.0);

CREATE OR REPLACE TABLE hvac_mode (
    mode_time TIMESTAMP,
    mode      VARCHAR
);
INSERT INTO hvac_mode VALUES
    ('2024-01-01 09:58:00', 'Cooling'),
    ('2024-01-01 10:06:00', 'Fan'),
    ('2024-01-01 10:30:00', 'Heating');
```

### 示例

将每条温度读数与其之前最新的 HVAC 模式进行关联：

```sql
SELECT r.reading_time, r.temperature, m.mode
FROM sensor_readings AS r
ASOF JOIN hvac_mode AS m
       ON r.room = m.room
      AND r.reading_time >= m.mode_time
ORDER BY r.reading_time;
```

结果：

```text
┌─────────────────────┬─────────────┬────────────┐
│ reading_time        │ temperature │ mode       │
├─────────────────────┼─────────────┼────────────┤
│ 2024-01-01 10:00:00 │ 23.1C       │ Cooling    │
│ 2024-01-01 10:05:00 │ 23.3C       │ Cooling    │
│ 2024-01-01 10:10:00 │ 23.8C       │ Fan        │
│ 2024-01-01 10:15:00 │ 24.0C       │ Fan        │
└─────────────────────┴─────────────┴────────────┘
```

ASOF 左连接：即使当时还没有 HVAC 模式记录，也会保留所有的温度读数：

```sql
SELECT r.reading_time, r.temperature, m.mode
FROM sensor_readings AS r
ASOF LEFT JOIN hvac_mode AS m
       ON r.room = m.room
      AND r.reading_time >= m.mode_time
ORDER BY r.reading_time;
```

结果：

```text
┌─────────────────────┬─────────────┬────────────┐
│ reading_time        │ temperature │ mode       │
├─────────────────────┼─────────────┼────────────┤
│ 2024-01-01 09:55:00 │ 22.8C       │ NULL       │ ← 在第一条 HVAC 模式之前
│ 2024-01-01 10:00:00 │ 23.1C       │ Cooling    │
│ 2024-01-01 10:05:00 │ 23.3C       │ Cooling    │
│ 2024-01-01 10:10:00 │ 23.8C       │ Fan        │
│ 2024-01-01 10:15:00 │ 24.0C       │ Fan        │
└─────────────────────┴─────────────┴────────────┘
```

ASOF 右连接：所有的 HVAC 模式都会出现在结果中，即使暂时没有被任何读数引用：

```sql
SELECT r.reading_time, r.temperature, m.mode_time, m.mode
FROM sensor_readings AS r
ASOF RIGHT JOIN hvac_mode AS m
        ON r.room = m.room
       AND r.reading_time >= m.mode_time
ORDER BY m.mode_time, r.reading_time;
```

结果：

```text
┌─────────────────────┬─────────────┬─────────────────────┬────────────┐
│ reading_time        │ temperature │ mode_time           │ mode       │
├─────────────────────┼─────────────┼─────────────────────┼────────────┤
│ 2024-01-01 10:00:00 │ 23.1C       │ 2024-01-01 09:58:00 │ Cooling    │
│ 2024-01-01 10:05:00 │ 23.3C       │ 2024-01-01 09:58:00 │ Cooling    │
│ 2024-01-01 10:10:00 │ 23.8C       │ 2024-01-01 10:06:00 │ Fan        │
│ 2024-01-01 10:15:00 │ 24.0C       │ 2024-01-01 10:06:00 │ Fan        │
│ NULL                │ NULL        │ 2024-01-01 10:30:00 │ Heating    │ ← 等待新的读数
└─────────────────────┴─────────────┴─────────────────────┴────────────┘
```

在同一个 HVAC 区间内可能包含多条读数，因此右 ASOF 连接可能会对同一个 `mode_time` 输出多行记录；最后的 `NULL` 行表示该模式暂时还没有匹配的读数。
