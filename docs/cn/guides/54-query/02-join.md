---
title: 连接
---

## 支持的连接类型

*连接*将两个或多个表的列组合成一个结果集。Databend 支持以下*连接*类型：

* [内连接](#inner-join)
* [自然连接](#natural-join)
* [交叉连接](#cross-join)
* [左连接](#left-join)
* [右连接](#right-join)
* [全外连接](#full-outer-join)
* [左/右半连接](#left--right-semi-join)
* [左/右反连接](#left--right-anti-join)

## 示例表

除非明确指定，本页上的连接示例基于以下表：

表 "vip_info"：此表存储 VIP 客户信息。

| Client_ID 	   | Region    	 |
|---------------|-------------|
| 101         	 | Toronto   	 |
| 102         	 | Quebec    	 |
| 103         	 | Vancouver 	 |

表 "purchase_records"：此表列出了所有客户的购买记录。

| Client_ID 	   | Item      	 | QTY 	     |
|---------------|-------------|-----------|
| 100         	 | Croissant 	 | 2,000   	 |
| 102         	 | Donut     	 | 3,000   	 |
| 103         	 | Coffee    	 | 6,000   	 |
| 106         	 | Soda      	 | 4,000   	 |

表 "gift"：此表列出了 VIP 客户的礼品选项。

| Gift      	 |
|-------------|
| Croissant 	 |
| Donut     	 |
| Coffee    	 |
| Soda      	 |

## 内连接

*内连接*返回满足连接条件的结果集中的行。

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

当您在具有相等运算符的公共列上连接两个表时，可以使用关键字 USING 来简化语法。

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

## 自然连接

*自然连接*基于两个表中具有相同名称的所有列连接两个表。

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

## 交叉连接

*交叉连接*返回一个结果集，其中包括第一个表中的每一行与第二个表中的每一行连接。

### 语法

```sql    
SELECT select_list
FROM table_a
	CROSS JOIN table_b
```

### 示例

以下示例返回一个结果集，将每个礼品选项分配给每个 VIP 客户：

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

## 左连接

*左连接*返回左表中的所有记录，以及右表中的匹配记录。如果没有匹配项，则右边的结果为 NULL 记录。

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

## 右连接

*右连接*返回右表中的所有记录，以及左表中的匹配记录。如果没有匹配项，则左边的结果为 NULL 记录。

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

想象我们有以下表：

以下示例返回所有购买记录的所有 vip_info，如果购买记录没有相应的 vip_info，则 vip_info 将为 NULL。

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

## 全外连接

*全外连接*返回两个表中的所有行，匹配行在匹配的地方，并在没有匹配行的地方放置 NULL。

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

以下示例返回两个表中的所有匹配和不匹配行：

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

## 左/右半连接

*左半连接*返回左表中在右表中有匹配行的行。*右半连接*返回右表中在左表中有匹配行的行。

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

## 左/右反连接

*左反连接*返回左表中在右表中没有匹配行的行。*右反连接*返回右表中在左表中没有匹配行的行。

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