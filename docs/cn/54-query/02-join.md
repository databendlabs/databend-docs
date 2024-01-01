---
title: JOINs
---

## 支持的连接类型 {#supported-join-types}

*join* 将两个或多个表中的列组合成单个结果集。Databend 支持以下 *join* 类型：

* [内连接（Inner Join）](#inner-join)
* [自然连接（Natural Join）](#natural-join)
* [交叉连接（Cross Join）](#cross-join)
* [左连接（Left Join）](#left-join)
* [右连接（Right Join）](#right-join)
* [全外连接（Full Outer Join）](#full-outer-join)
* [左/右半连接（Left / Right Semi-Join）](#left--right-semi-join)
* [左/右反连接（Left / Right Anti-Join）](#left--right-anti-join)

## 示例表格 {#example-tables}

除非特别指定，本页上的连接示例都是基于以下表格创建的：

表 "vip_info"：该表存储 VIP 客户信息。

| Client_ID     | Region       |
|---------------|-------------|
| 101           | Toronto     |
| 102           | Quebec      |
| 103           | Vancouver   |

表 "purchase_records"：该表列出了所有客户的购买记录。

| Client_ID     | Item         | QTY       |
|---------------|-------------|-----------|
| 100           | Croissant   | 2,000     |
| 102           | Donut       | 3,000     |
| 103           | Coffee      | 6,000     |
| 106           | Soda        | 4,000     |

表 "gift"：该表列出了 VIP 客户的礼物选项。

| Gift          |
|-------------|
| Croissant   |
| Donut       |
| Coffee      |
| Soda        |

## 内连接（Inner Join） {#inner-join}

*内连接* 返回满足连接条件的行到结果集中。

### 语法 {#syntax}

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

当您在一个公共列上使用等号操作符连接两个表时，可以使用关键字 USING 来简化语法。

```sql    
SELECT select_list
FROM table_a
	JOIN table_b
		USING join_column_1
	[JOIN table_c
		USING join_column_2]...
```

### 示例 {#examples}

以下示例返回 VIP 客户的购买记录：

```sql    
SELECT purchase_records.client_id,
       purchase_records.item,
       purchase_records.qty
FROM   vip_info
       INNER JOIN purchase_records
               ON vip_info.client_id = purchase_records.client_id; 
```

有关示例中表的定义，请参见[示例表格](#example-tables)。

输出：

```sql
|102|Donut|3000
|103|Coffee|6000
```

## 自然连接（Natural Join） {#natural-join}

*自然连接* 基于两个表中所有具有相同名称的列来连接两个表。

### 语法 {#syntax}

```sql    
SELECT select_list
FROM table_a
	NATURAL JOIN table_b
	[NATURAL JOIN table_c]...
```

### 示例 {#examples}

以下示例返回 VIP 客户的购买记录：

```sql    
SELECT purchase_records.client_id,
       purchase_records.item,
       purchase_records.qty
FROM   vip_info
       NATURAL JOIN purchase_records; 
```

有关示例中表的定义，请参见[示例表格](#example-tables)。

输出：

```sql
|102|Donut|3,000
|103|Coffee|6,000
```

## 交叉连接（Cross Join） {#cross-join}

*交叉连接* 返回一个结果集，其中包括第一个表中的每一行与第二个表中的每一行相连接。

### 语法 {#syntax}

```sql    
SELECT select_list
FROM table_a
	CROSS JOIN table_b
```

### 示例 {#examples}

以下示例返回一个结果集，为每个 VIP 客户分配每个礼物选项：

```sql    
SELECT *
FROM   vip_info
       CROSS JOIN gift; 
```

有关示例中表的定义，请参见[示例表格](#example-tables)。

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

## 左连接（Left Join） {#left-join}

*左连接* 返回左表中的所有记录，以及右表中的匹配记录。如果没有匹配，结果中右侧的记录将为 NULL。

### 语法 {#syntax}

```sql    
SELECT select_list
FROM table_a
	LEFT [OUTER] JOIN table_b
		ON join_condition
```
:::tip
关键字 OUTER 是可选的。
:::

### 示例 {#examples}

以下示例返回所有 VIP 客户的购买记录，如果 VIP 客户没有购买记录，则购买记录将为 NULL：

```sql    
SELECT vip_info.client_id,
       purchase_records.item,
       purchase_records.qty
FROM   vip_info
       LEFT JOIN purchase_records
              ON vip_info.client_id = purchase_records.client_id; 
```

有关示例中表的定义，请参见[示例表格](#example-tables)。

输出：

```sql
|101|NULL|NULL
|102|Donut|3000
|103|Coffee|6000
```

## 右连接（Right Join） {#right-join}

*右连接* 返回右表中的所有记录，以及左表中的匹配记录。如果没有匹配，结果中左侧的记录将为 NULL。

### 语法 {#syntax}

```sql    
SELECT select_list
FROM table_a
	RIGHT [OUTER] JOIN table_b
		ON join_condition
```

:::tip
关键字 OUTER 是可选的。
:::

### 示例 {#examples}

想象我们有以下表格：

以下示例返回所有 purchase_records 的 vip_info，如果 purchase_record 没有对应的 vip_info，则 vip_info 将为 NULL。

```sql    
SELECT vip_info.client_id,
       vip_info.region
FROM   vip_info
       RIGHT JOIN purchase_records
               ON vip_info.client_id = purchase_records.client_id; 
```

有关示例中表的定义，请参见[示例表格](#example-tables)。

输出：

```sql
NULL|NULL
102|Quebec
103|Vancouver
NULL|NULL
```

## 全外连接（Full Outer Join） {#full-outer-join}

*全外连接* 返回两个表中的所有行，无论何处都可以匹配行，并在没有匹配行的地方放置 NULL。

### 语法 {#syntax}

```sql
SELECT select_list
FROM   table_a
       FULL OUTER JOIN table_b
                    ON join_condition
```

:::tip
关键字 OUTER 是可选的。
:::

### 示例 {#examples}

以下示例返回两个表中所有匹配和不匹配的行：

```sql
SELECT vip_info.region,
       purchase_records.item
FROM   vip_info
       FULL OUTER JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关示例中表的定义，请参见[示例表格](#example-tables)。

输出：

```sql
Toronto|NULL
Quebec|Donut
Vancouver|Coffee
NULL|Croissant
NULL|Soda
```

## 左/右半连接（Left / Right Semi Join） {#left--right-semi-join}

*左半连接* 返回左表中有匹配行的右表的行。*右半连接* 返回右表中有匹配行的左表的行。

### 语法 {#syntax}

```sql
-- Left Semi Join

SELECT select_list
FROM   table_a
       LEFT SEMI JOIN table_b
                    ON join_condition

-- Right Semi Join

SELECT select_list
FROM   table_a
       RIGHT SEMI JOIN table_b
                    ON join_condition
```

### 示例 {#examples}

以下示例返回有购买记录的 VIP 客户（Client_ID & Region）：

```sql
SELECT *
FROM   vip_info
       LEFT SEMI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关示例中表的定义，请参见[示例表格](#example-tables)。

输出：

```sql
102|Quebec
103|Vancouver
```

以下示例返回 VIP 客户的购买记录（Client_ID, Item, 和 QTY）：

```sql
SELECT *
FROM   vip_info
       RIGHT SEMI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关示例中表的定义，请参见[示例表格](#example-tables)。

输出：

```sql
|102|Donut|3000
|103|Coffee|6000
```

## 左/右反连接（Left / Right Anti Join） {#left--right-anti-join}

*左反连接* 返回左表中没有匹配行的右表的行。*右反连接* 返回右表中没有匹配行的左表的行。

### 语法 {#syntax}

```sql
-- Left Anti Join

SELECT select_list
FROM   table_a
       LEFT ANTI JOIN table_b
                    ON join_condition

-- Right Anti Join

SELECT select_list
FROM   table_a
       RIGHT ANTI JOIN table_b
                    ON join_condition
```

### 示例 {#examples}

以下示例返回没有购买记录的 VIP 客户（Client_ID & Region）：

```sql
SELECT *
FROM   vip_info
       LEFT ANTI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关示例中表的定义，请参见[示例表格](#example-tables)。

输出：

```sql
101|Toronto
```

以下示例返回非 VIP 客户的购买记录（Client_ID, Item, 和 QTY）：

```sql
SELECT *
FROM   vip_info
       RIGHT ANTI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关示例中表的定义，请参见[示例表格](#example-tables)。

输出：

```sql
|100|Croissant|2000
|106|Soda|4000
```