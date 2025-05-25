---
title: JOIN
---

## 支持的连接类型

*连接* (join) 操作将两个或多个表的列组合成单一结果集。Databend 支持以下连接类型：

* [Inner Join](#inner-join)
* [Natural Join](#natural-join)
* [Cross Join](#cross-join)
* [Left Join](#left-join)
* [Right Join](#right-join)
* [Full Outer Join](#full-outer-join)
* [Left / Right Semi-Join](#left--right-semi-join)
* [Left / Right Anti-Join](#left--right-anti-join)

## 示例表

除非特别说明，本页所有连接示例均基于以下表结构：

表 "vip_info"：存储 VIP 客户信息。

| Client_ID 	   | Region    	 |
|---------------|-------------|
| 101         	 | Toronto   	 |
| 102         	 | Quebec         	 | Quebec    	 |
| 103         	 | Vancouver 	 |

表 "purchase_records"：记录所有客户的购买记录。

| Client_ID 	   | Item      	 | QTY 	     |
|---------------|-------------|
||
| 100         	 | Croissant 	 | 2,000   	 |
| 102         	 | Donut     	 | 3,000   	 |
| 103         	 | Coffee    	 | 6,000   	 |
| 106         	 | Soda      	 | 4,000   	 |

表 "gift"：列出 VIP 客户可选的礼品。

| Gift      	 |
|-------------|
| Croissant 	 |
| Donut     	 |
| Coffee    	 |
| Soda      	 |

## Inner Join

*Inner Join* 返回结果集中满足连接条件的行。

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
INNER 关键字可省略。
:::

当使用等值运算符连接两个表的公共列时，可使用 USING 关键字简化语法：

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

示例表定义参见 [示例表](#example-tables)。

输出：

```sql
|102|Donut|3000
|103|Coffee|6000
```

## Natural Join

*Natural Join* 基于两个表中所有同名列自动进行连接。

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

示例表定义参见 [示例表](#example-tables)。

输出：

```sql
|102|Donut|3,000
|103|6|6,000
```

## Cross Join

*Cross Join* 返回第一个表的每一行与第二个表的每一行组合的结果集。

### 语法

```sql    
SELECT select_list
FROM table_a
	CROSS JOIN table_b
```

### 示例

以下示例返回为每位 VIP 客户分配所有礼品选项的结果集：

```sql    
SELECT *
FROM   vip_info
       CROSS JOIN gift; 
```

示例表定义参见 [示例表](#example-tables)。

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

## Left Join

*Left Join* 返回左表的所有记录，以及右表的匹配记录。若无匹配，则右表字段显示为 NULL。

### 语法

```sql    
SELECT select_list
FROM table_a
	LEFT [OUTER] JOIN table_b
		ON join_condition
```
:::tip
OUTER 关键字可省略。
:::

### 示例

以下示例返回所有 VIP 客户的购买记录（若无购买则显示为 NULL）：

```sql    
SELECT vip_info.client_id,
       purchase_records.item,
       purchase_records.qty
FROM   vip_info
       LEFT JOIN purchase_records
              ON vip_info.client_id = purchase_records.client_id; 
```

示例表定义参见 [示例表](#example-tables)。

输出：

```sql
|101|NULL|NULL
|102|Donut|3000
|103|Coffee|6000
```

## Right Join

*Right Join* 返回右表的所有记录，以及左表的匹配记录。若无匹配，则左表字段显示为 NULL。

### 语法

```sql    
SELECT select_list
FROM table_a
	RIGHT [OUTER] JOIN table_b
		ON join_condition
```

:::tip
OUTER 关键字可省略。
:::

### 示例

以下示例返回所有购买记录对应的 VIP 信息（若无 VIP 信息则显示为 NULL）：

```sql    
SELECT vip_info.client_id,
       vip_info.region
FROM   vip_info
       RIGHT JOIN purchase_records
               ON vip_info.client_id = purchase_records.client_id; 
```

示例表定义参见 [示例表](#example-tables)。

输出：

```sql
NULL|NULL
102|Quebec
103|Vancouver
NULL|NULL
```

## Full Outer Join

*Full Outer Join* 返回两表的所有行，匹配成功的行进行组合，无匹配的行则填充 NULL。

### 语法

```sql
SELECT select_list
FROM   table_a
       FULL OUTER JOIN table_b
                    ON join_condition
```

:::tip
OUTER 关键字可省略。
:::

### 示例

以下示例返回两表所有匹配和非匹配的行：

```sql
SELECT vip_info.region,
       purchase_records.item
FROM   vip_info
       FULL OUTER JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

示例表定义参见 [示例表](#example-tables)。

输出：

```sql
Toronto|NULL
Quebec|Donut
Vancouver|Coffee
NULL|Croissant
NULL|Soda
```

## Left / Right Semi Join

*Left / Right Semi Join* 返回左表中与右表匹配的行连接*连接*连接* 返回右表中与左表匹配的行。

### 语法

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

### 示例

以下示例返回有购买记录的 VIP 客户（Client_ID 和 Region）：

```sql
SELECT *
FROM   vip_info
       LEFT SEMI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

示例表定义参见 [示例表](#example-tables)。

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

示例表定义参见 [示例表](#example-tables)。

输出：

```sql
|102|Donut|3000
|103|Coffee|6000
```

## Left / Right Anti Join

*Left / Right Anti Join* 返回左表中不与右表匹配的行。*右反连接* 返回右表中不与左表匹配的行。

### 语法

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

### 示例

以下示例返回没有购买记录的 VIP 客户（Client_ID 和 Region）：

```sql
SELECT *
FROM   vip_info
       LEFT ANTI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

示例表定义参见 [示例表](#example-tables)。

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

示例表定义参见 [示例表](#example-tables)。

输出：

```sql
|100|Croissant|2000
|106|Soda|4000
```
