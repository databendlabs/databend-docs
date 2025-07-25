---
title: JOIN
---

## 支持的连接类型

连接（Join）操作可以将两个或多个表中的列组合成一个结果集。Databend 支持以下连接（Join）类型：

* [内连接（Inner Join）](#inner-join)
* [自然连接（Natural Join）](#natural-join)
* [交叉连接（Cross Join）](#cross-join)
* [左连接（Left Join）](#left-join)
* [右连接（Right Join）](#right-join)
* [全外连接（Full Outer Join）](#full-outer-join)
* [左/右半连接（Left / Right Semi-Join）](#left--right-semi-join)
* [左/右反连接（Left / Right Anti-Join）](#left--right-anti-join)

## 示例表

除非另有说明，本页上的连接示例均基于以下表格创建：

表 "vip_info"：此表存储 VIP 客户信息。

| 客户_ID     | 地区        |
|-------------|-------------|
| 101         | Toronto     |
| 102         | Quebec      |
| 103         | Vancouver   |

表 "purchase_records"：此表列出了所有客户的购买记录。

| 客户_ID     | 商品        | 数量      |
|-------------|-------------|-----------|
| 100         | Croissant   | 2,000     |
| 102         | Donut       | 3,000     |
| 103         | Coffee      | 6,000     |
| 106         | Soda        | 4,000     |

表 "gift"：此表列出了 VIP 客户的礼品选项。

| 礼物        |
|-------------|
| Croissant   |
| Donut       |
| Coffee      |
| Soda        |

表 trades：此表记录了各种股票代码的交易事务。

| 代码   | 时间   | 价格   |
| ------ |--------|--------|
| AAPL   | 100003 | 101    |
| AAPL   | 100007 | 103    |
| MSFT   | 100002 | 99     |
| TSLA   | 100010 | 200    |


表 quotes：此表提供各种股票代码在不同时间戳的报价快照（买入价/卖出价）。

| 代码   | 时间   | 买入价 | 卖出价 |
| ------ |--------|--------|--------|
| AAPL   | 100000 | 99     | 102    |
| AAPL   | 100005 | 100    | 104    |
| MSFT   | 100001 | 98     | 101    |
| NVDA   | 100006 | 150    | 155    |


## 内连接（Inner Join）

`内连接（Inner Join）` 会在结果集中返回满足连接条件的行。

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
关键字 INNER 是可选的。
:::

当使用相等运算符连接两个表的公共列时，可以使用关键字 USING 来简化语法。

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

有关示例中表的定义，请参见[示例表](#example-tables)。

输出：

```sql
|102|Donut|3000
|103|Coffee|6000
```

## 自然连接（Natural Join）

`自然连接（Natural Join）` 会根据两个表中所有同名的列来连接这两个表。

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

有关示例中表的定义，请参见[示例表](#example-tables)。

输出：

```sql
|102|Donut|3,000
|103|Coffee|6,000
```

## 交叉连接（Cross Join）

`交叉连接（Cross Join）` 返回一个结果集，该结果集包含第一个表中的每一行与第二个表中的每一行连接后的组合。

### 语法

```sql    
SELECT select_list
FROM table_a
	CROSS JOIN table_b
```

### 示例

以下示例返回一个结果集，为每个 VIP 客户分配每个礼品选项：

```sql    
SELECT *
FROM   vip_info
       CROSS JOIN gift; 
```

有关示例中表的定义，请参见[示例表](#example-tables)。

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

`左连接（Left Join）` 返回左表中的所有记录，以及右表中的匹配记录。如果没有匹配项，则右侧的结果为 NULL 记录。

### 语法

```sql    
SELECT select_list
FROM table_a
	LEFT [OUTER] JOIN table_b
		ON join_condition
```
:::tip
关键字 OUTER 是可选的。
:::

### 示例

以下示例返回所有 VIP 客户的购买记录，如果 VIP 客户没有购买记录，则购买记录将为 NULL：

```sql    
SELECT vip_info.client_id,
       purchase_records.item,
       purchase_records.qty
FROM   vip_info
       LEFT JOIN purchase_records
              ON vip_info.client_id = purchase_records.client_id; 
```

有关示例中表的定义，请参见[示例表](#example-tables)。

输出：

```sql
|101|NULL|NULL
|102|Donut|3000
|103|Coffee|6000
```

## 右连接（Right Join）

`右连接（Right Join）` 返回右表中的所有记录，以及左表中的匹配记录。如果没有匹配项，则左侧的结果为 NULL 记录。

### 语法

```sql    
SELECT select_list
FROM table_a
	RIGHT [OUTER] JOIN table_b
		ON join_condition
```

:::tip
关键字 OUTER 是可选的。
:::

### 示例

以下示例返回所有 purchase_records 对应的 vip_info，如果 purchase_record 没有相应的 vip_info，则 vip_info 将为 NULL。

```sql    
SELECT vip_info.client_id,
       vip_info.region
FROM   vip_info
       RIGHT JOIN purchase_records
               ON vip_info.client_id = purchase_records.client_id; 
```

有关示例中表的定义，请参见[示例表](#example-tables)。

输出：

```sql
NULL|NULL
102|Quebec
103|Vancouver
NULL|NULL
```

## 全外连接（Full Outer Join）

`全外连接（Full Outer Join）` 返回两个表中的所有行，在可以匹配的地方将行匹配起来，在没有匹配行的地方则放置 NULL。

### 语法

```sql
SELECT select_list
FROM   table_a
       FULL OUTER JOIN table_b
                    ON join_condition
```

:::tip
关键字 OUTER 是可选的。
:::

### 示例

以下示例返回两个表中所有匹配和不匹配的行：

```sql
SELECT vip_info.region,
       purchase_records.item
FROM   vip_info
       FULL OUTER JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关示例中表的定义，请参见[示例表](#example-tables)。

输出：

```sql
Toronto|NULL
Quebec|Donut
Vancouver|Coffee
NULL|Croissant
NULL|Soda
```

## 左/右半连接（Left / Right Semi Join）

`左半连接（Left Semi Join）` 返回左表中在右表有匹配行的行。`右半连接（Right Semi Join）` 返回右表中在左表有匹配行的行。

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

以下示例返回有购买记录的 VIP 客户（Client_ID 和 Region）：

```sql
SELECT *
FROM   vip_info
       LEFT SEMI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关示例中表的定义，请参见[示例表](#example-tables)。

输出：

```sql
102|Quebec
103|Vancouver
```

以下示例返回 VIP 客户的购买记录（Client_ID、Item 和 QTY）：

```sql
SELECT *
FROM   vip_info
       RIGHT SEMI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关示例中表的定义，请参见[示例表](#example-tables)。

输出：

```sql
|102|Donut|3000
|103|Coffee|6000
```

## 左/右反连接（Left / Right Anti Join）

`左反连接（Left Anti Join）` 返回左表中在右表没有匹配行的行。`右反连接（Right Anti Join）` 返回右表中在左表没有匹配行的行。

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

以下示例返回没有购买记录的 VIP 客户（Client_ID 和 Region）：

```sql
SELECT *
FROM   vip_info
       LEFT ANTI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关示例中表的定义，请参见[示例表](#example-tables)。

输出：

```sql
101|Toronto
```

以下示例返回非 VIP 客户的购买记录（Client_ID、Item 和 QTY）：

```sql
SELECT *
FROM   vip_info
       RIGHT ANTI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关示例中表的定义，请参见[示例表](#example-tables)。

输出：

```sql
|100|Croissant|2000
|106|Soda|4000
```

## Asof 连接（Asof Join）

Asof 连接（Asof Join）（近似排序合并连接 (Approximate Sort-Merge Join)）会返回左表中的行，并与右表中时间戳小于或等于左表时间戳的最新行进行匹配。它通常用于时间序列数据，以附加最新的上下文信息，例如报价、状态或传感器读数。

与典型的等值连接不同，其连接条件基于不等式（通常是 `<=`），并且可以选择性地包含额外的等值条件。

### 语法

```sql
SELECT select_list
FROM table_a ASOF
         JOIN table_b
              ON table_a.time >= table_b.time
                  [ AND table_a.key = table_b.key]
```

### 示例

以下示例将交易记录与相同代码在交易时间或之前最新的报价进行连接：

```sql
SELECT *
FROM trades
    ASOF JOIN quotes
              ON trades.symbol = quotes.symbol
                  AND trades.time >= quotes.time;
```

有关示例中表的定义，请参见[示例表](#example-tables)。

输出：

```sql
│ AAPL             │          100003 │             101 │ AAPL             │          100000 │              99 │             102 │
│ AAPL             │          100007 │             103 │ AAPL             │          100005 │             100 │             104 │
│ MSFT             │          100002 │              99 │ MSFT             │          100001 │              98 │             101 │

```

以下示例执行 ASOF LEFT JOIN，返回所有交易记录以及相同代码在交易时间或之前的最新报价（如果存在）。如果不存在匹配的报价，则报价字段将为 NULL。

```sql
SELECT *
FROM trades
    ASOF LEFT JOIN quotes
              ON trades.symbol = quotes.symbol
                  AND trades.time >= quotes.time;
```

有关示例中表的定义，请参见[示例表](#example-tables)。

输出：

```sql
│ AAPL             │          100003 │             101 │ AAPL             │          100000 │              99 │             102 │
│ MSFT             │          100002 │              99 │ MSFT             │          100001 │              98 │             101 │
│ AAPL             │          100007 │             103 │ AAPL             │          100005 │             100 │             104 │
│ TSLA             │          100010 │             200 │ NULL             │            NULL │            NULL │            NULL │
```

以下示例执行 ASOF RIGHT JOIN，返回所有报价记录以及相同代码在报价时间或之后最新的交易（如果存在）。如果不存在匹配的交易，则交易字段将为 NULL。

```sql
SELECT *
FROM trades
    ASOF RIGHT JOIN quotes
              ON trades.symbol = quotes.symbol
                  AND trades.time >= quotes.time;
```

有关示例中表的定义，请参见[示例表](#example-tables)。

输出：

```sql
│ AAPL             │          100003 │             101 │ AAPL             │          100000 │              99 │             102 │
│ AAPL             │          100007 │             103 │ AAPL             │          100005 │             100 │             104 │
│ MSFT             │          100002 │              99 │ MSFT             │          100001 │              98 │             101 │
│ NULL             │            NULL │            NULL │ NVDA             │          100006 │             150 │             155 │
```