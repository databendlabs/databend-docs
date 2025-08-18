---
title: JOIN
---

## 支持的连接类型

*连接（Join）* 操作将两个或多个表的列组合成一个结果集。Databend 支持以下 *连接（Join）* 类型：

* [内连接（Inner Join）](#inner-join)
* [自然连接（Natural Join）](#natural-join)
* [交叉连接（Cross Join）](#cross-join)
* [左连接（Left Join）](#left-join)
* [右连接（Right Join）](#right-join)
* [全外连接（Full Outer Join）](#full-outer-join)
* [左/右半连接（Left / Right Semi-Join）](#left--right-semi-join)
* [左/右反连接（Left / Right Anti-Join）](#left--right-anti-join)
* [AsOf 连接（AsOf Join）](#asof-join)

## 示例表

除非另有说明，本页上的连接示例均基于以下表创建：

表 "vip_info"：此表存储 VIP 客户信息。

| Client_ID | Region    |
|-----------|-----------|
| 101       | Toronto   |
| 102       | Quebec    |
| 103       | Vancouver |

表 "purchase_records"：此表列出所有客户的购买记录。

| Client_ID | Item      | QTY   |
|-----------|-----------|-------|
| 100       | Croissant | 2,000 |
| 102       | Donut     | 3,000 |
| 103       | Coffee    | 6,000 |
| 106       | Soda      | 4,000 |

表 "gift"：此表列出 VIP 客户的礼品选项。

| Gift      |
|-----------|
| Croissant |
| Donut     |
| Coffee    |
| Soda      |

表 trades：此表记录各股票代码的交易事务。

| Symbol | Time   | Price |
|--------|--------|-------|
| AAPL   | 100003 | 101   |
| AAPL   | 100007 | 103   |
| MSFT   | 100002 | 99    |
| TSLA   | 100010 | 200   |

表 quotes：此表提供各股票代码在不同时间戳的报价快照（买入价/卖出价）。

| Symbol | Time   | Bid | Ask |
|--------|--------|-----|-----|
| AAPL   | 100000 | 99  | 102 |
| AAPL   | 100005 | 100 | 104 |
| MSFT   | 100001 | 98  | 101 |
| NVDA   | 100006 | 150 | 155 |

## 内连接（Inner Join）

*内连接（Inner Join）* 返回满足连接条件的行。

### 语法

```sql    
SELECT select_list
FROM table_a
	[INNER] JOIN table_b
		ON join_condition_1
	[[INNER] JOIN table_c
		ON join_condition_2]...
```

:::tip
关键字 INNER 可选。
:::

当使用等号连接两表的公共列时，可用 USING 简化语法：

```sql    
SELECT select_list
FROM table_a
	JOIN table_b
		USING join_column_1
	[JOIN table_c
		USING join_column_2]...
```

### 示例

以下示例返回 VIP 客户的购买记录：

```sql    
SELECT purchase_records.client_id,
       purchase_records.item,
       purchase_records.qty
FROM   vip_info
       INNER JOIN purchase_records
               ON vip_info.client_id = purchase_records.client_id; 
```

有关表定义，请参见 [示例表](#example-tables)。

输出：

```sql
|102|Donut|3000
|103|Coffee|6000
```

## 自然连接（Natural Join）

*自然连接（Natural Join）* 基于两表中所有同名列进行连接。

### 语法

```sql    
SELECT select_list
FROM table_a
	NATURAL JOIN table_b
	[NATURAL JOIN table_c]...
```

### 示例

以下示例返回 VIP 客户的购买记录：

```sql    
SELECT purchase_records.client_id,
       purchase_records.item,
       purchase_records.qty
FROM   vip_info
       NATURAL JOIN purchase_records; 
```

有关表定义，请参见 [示例表](#example-tables)。

输出：

```sql
|102|Donut|3,000
|103|Coffee|6,000
```

## 交叉连接（Cross Join）

*交叉连接（Cross Join）* 返回第一个表的每一行与第二个表的每一行的组合。

### 语法

```sql    
SELECT select_list
FROM table_a
	CROSS JOIN table_b
```

### 示例

以下示例为每个 VIP 客户分配每个礼品选项：

```sql    
SELECT *
FROM   vip_info
       CROSS JOIN gift; 
```

有关表定义，请参见 [示例表](#example-tables)。

输出：

```sql
101|Toronto|Croissant
101|Toronto|Donut
101|Toronto|Coffee
101|Toronto|Soda
102|Quebec|Croissant
102|Quebec|Donut
102|Quebec|Coffee
102|Quebec|Soda
103|Vancouver|Croissant
103|Vancouver|Donut
103|Vancouver|Coffee
103|Vancouver|Soda
```

## 左连接（Left Join）

*左连接（Left Join）* 返回左表所有记录及右表匹配记录；无匹配时右侧为 NULL。

### 语法

```sql    
SELECT select_list
FROM table_a
	LEFT [OUTER] JOIN table_b
		ON join_condition
```
:::tip
关键字 OUTER 可选。
:::

### 示例

以下示例返回所有 VIP 客户的购买记录，无购买记录时置 NULL：

```sql    
SELECT vip_info.client_id,
       purchase_records.item,
       purchase_records.qty
FROM   vip_info
       LEFT JOIN purchase_records
              ON vip_info.client_id = purchase_records.client_id; 
```

有关表定义，请参见 [示例表](#example-tables)。

输出：

```sql
|101|NULL|NULL
|102|Donut|3000
|103|Coffee|6000
```

## 右连接（Right Join）

*右连接（Right Join）* 返回右表所有记录及左表匹配记录；无匹配时左侧为 NULL。

### 语法

```sql    
SELECT select_list
FROM table_a
	RIGHT [OUTER] JOIN table_b
		ON join_condition
```

:::tip
关键字 OUTER 可选。
:::

### 示例

以下示例返回所有购买记录对应的 vip_info，无对应 vip_info 时置 NULL：

```sql    
SELECT vip_info.client_id,
       vip_info.region
FROM   vip_info
       RIGHT JOIN purchase_records
               ON vip_info.client_id = purchase_records.client_id; 
```

有关表定义，请参见 [示例表](#example-tables)。

输出：

```sql
NULL|NULL
102|Quebec
103|Vancouver
NULL|NULL
```

## 全外连接（Full Outer Join）

*全外连接（Full Outer Join）* 返回两表所有行，匹配处合并，无匹配处填 NULL。

### 语法

```sql
SELECT select_list
FROM   table_a
       FULL OUTER JOIN table_b
                    ON join_condition
```

:::tip
关键字 OUTER 可选。
:::

### 示例

以下示例返回两表所有匹配与不匹配行：

```sql
SELECT vip_info.region,
       purchase_records.item
FROM   vip_info
       FULL OUTER JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关表定义，请参见 [示例表](#example-tables)。

输出：

```sql
Toronto|NULL
Quebec|Donut
Vancouver|Coffee
NULL|Croissant
NULL|Soda
```

## 左/右半连接（Left / Right Semi Join）

*左半连接（Left Semi Join）* 返回左表中与右表匹配的行；*右半连接（Right Semi Join）* 反之。

### 语法

```sql
-- 左半连接
SELECT select_list
FROM   table_a
       LEFT SEMI JOIN table_b
                    ON join_condition

-- 右半连接
SELECT select_list
FROM   table_a
       RIGHT SEMI JOIN table_b
                    ON join_condition
```

### 示例

以下示例返回有购买记录的 VIP 客户：

```sql
SELECT *
FROM   vip_info
       LEFT SEMI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关表定义，请参见 [示例表](#example-tables)。

输出：

```sql
102|Quebec
103|Vancouver
```

以下示例返回 VIP 客户的购买记录：

```sql
SELECT *
FROM   vip_info
       RIGHT SEMI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关表定义，请参见 [示例表](#example-tables)。

输出：

```sql
|102|Donut|3000
|103|Coffee|6000
```

## 左/右反连接（Left / Right Anti Join）

*左反连接（Left Anti Join）* 返回左表中在右表无匹配的行；*右反连接（Right Anti Join）* 反之。

### 语法

```sql
-- 左反连接
SELECT select_list
FROM   table_a
       LEFT ANTI JOIN table_b
                    ON join_condition

-- 右反连接
SELECT select_list
FROM   table_a
       RIGHT ANTI JOIN table_b
                    ON join_condition
```

### 示例

以下示例返回无购买记录的 VIP 客户：

```sql
SELECT *
FROM   vip_info
       LEFT ANTI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关表定义，请参见 [示例表](#example-tables)。

输出：

```sql
101|Toronto
```

以下示例返回非 VIP 客户的购买记录：

```sql
SELECT *
FROM   vip_info
       RIGHT ANTI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关表定义，请参见 [示例表](#example-tables)。

输出：

```sql
|100|Croissant|2000
|106|Soda|4000
```

## AsOf 连接（AsOf Join）

AsOf 连接（AsOf Join，近似排序合并连接）将左表行与右表中时间戳小于或等于左表时间戳的最新行匹配，常用于时间序列数据附加最新上下文信息。

### 语法

```sql
SELECT select_list
FROM table_a ASOF
         JOIN table_b
              ON table_a.time >= table_b.time
                  [ AND table_a.key = table_b.key]
```

### 示例

以下示例将交易记录与同一股票代码在交易时间或之前的最新报价连接：

```sql
SELECT *
FROM trades
    ASOF JOIN quotes
              ON trades.symbol = quotes.symbol
                  AND trades.time >= quotes.time;
```

有关表定义，请参见 [示例表](#example-tables)。

输出：

```sql
│ AAPL             │          100003 │             101 │ AAPL             │          100000 │              99 │             102 │
│ AAPL             │          100007 │             103 │ AAPL             │          100005 │             100 │             104 │
│ MSFT             │          100002 │              99 │ MSFT             │          100001 │              98 │             101 │
```

以下示例执行 ASOF LEFT JOIN，返回所有交易记录及同一股票代码在交易时间或之前的最新报价（如有），无匹配时报价字段为 NULL：

```sql
SELECT *
FROM trades
    ASOF LEFT JOIN quotes
              ON trades.symbol = quotes.symbol
                  AND trades.time >= quotes.time;
```

有关表定义，请参见 [示例表](#example-tables)。

输出：

```sql
│ AAPL             │          100003 │             101 │ AAPL             │          100000 │              99 │             102 │
│ MSFT             │          100002 │              99 │ MSFT             │          100001 │              98 │             101 │
│ AAPL             │          100007 │             103 │ AAPL             │          100005 │             100 │             104 │
│ TSLA             │          100010 │             200 │ NULL             │            NULL │            NULL │            NULL │
```

以下示例执行 ASOF RIGHT JOIN，返回所有报价记录及同一股票代码在报价时间或之后的最新交易（如有），无匹配时交易字段为 NULL：

```sql
SELECT *
FROM trades
    ASOF RIGHT JOIN quotes
              ON trades.symbol = quotes.symbol
                  AND trades.time >= quotes.time;
```

有关表定义，请参见 [示例表](#example-tables)。

输出：

```sql
│ AAPL             │          100003 │             101 │ AAPL             │          100000 │              99 │             102 │
│ AAPL             │          100007 │             103 │ AAPL             │          100005 │             100 │             104 │
│ MSFT             │          100002 │              99 │ MSFT             │          100001 │              98 │             101 │
│ NULL             │            NULL │            NULL │ NVDA             │          100006 │             150 │             155 │
```