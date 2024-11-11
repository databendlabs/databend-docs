---
title: JOINs
---

## 支持的JOIN类型

*join* 将两个或多个表的列组合成一个结果集。Databend支持以下 *join* 类型：

* [Inner Join](#inner-join)
* [Natural Join](#natural-join)
* [Cross Join](#cross-join)
* [Left Join](#left-join)
* [Right Join](#right-join)
* [Full Outer Join](#full-outer-join)
* [Left / Right Semi-Join](#left--right-semi-join)
* [Left / Right Anti-Join](#left--right-anti-join)

## 示例表

除非明确指定，本页上的join示例基于以下表：

表 "vip_info"：此表存储VIP客户信息。

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

表 "gift"：此表列出了VIP客户的礼品选项。

| Gift      	 |
|-------------|
| Croissant 	 |
| Donut     	 |
| Coffee    	 |
| Soda      	 |

## Inner Join

*inner join* 返回满足join条件的结果集中的行。

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

以下示例返回VIP客户的购买记录：

```sql    
SELECT purchase_records.client_id,
       purchase_records.item,
       purchase_records.qty
FROM   vip_info
       INNER JOIN purchase_records
               ON vip_info.client_id = purchase_records.client_id; 
```

有关示例中表的定义，请参见 [示例表](#示例表)。

输出：

```sql
|102|Donut|3000
|103|Coffee|6000
```

## Natural Join

*natural join* 基于两个表中具有相同名称的所有列连接两个表。

### 语法

```sql    
SELECT select_list
FROM table_a
	NATURAL JOIN table_b
	[NATURAL JOIN table_c]...
```

### 示例

以下示例返回VIP客户的购买记录：

```sql    
SELECT purchase_records.client_id,
       purchase_records.item,
       purchase_records.qty
FROM   vip_info
       NATURAL JOIN purchase_records; 
```

有关示例中表的定义，请参见 [示例表](#示例表)。

输出：

```sql
|102|Donut|3,000
|103|Coffee|6,000
```

## Cross Join

*cross join* 返回一个结果集，其中包括第一个表中的每一行与第二个表中的每一行连接。

### 语法

```sql    
SELECT select_list
FROM table_a
	CROSS JOIN table_b
```

### 示例

以下示例返回一个结果集，将每个礼品选项分配给每个VIP客户：

```sql    
SELECT *
FROM   vip_info
       CROSS JOIN gift; 
```

有关示例中表的定义，请参见 [示例表](#示例表)。

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

*left join* 返回左表中的所有记录，以及右表中的匹配记录。如果没有匹配项，则右边的结果为NULL记录。

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

以下示例返回所有VIP客户的购买记录，如果VIP客户没有购买记录，则购买记录将为NULL：

```sql    
SELECT vip_info.client_id,
       purchase_records.item,
       purchase_records.qty
FROM   vip_info
       LEFT JOIN purchase_records
              ON vip_info.client_id = purchase_records.client_id; 
```

有关示例中表的定义，请参见 [示例表](#示例表)。

输出：

```sql
|101|NULL|NULL
|102|Donut|3000
|103|Coffee|6000
```

## Right Join

*right join* 返回右表中的所有记录，以及左表中的匹配记录。如果没有匹配项，则左边的结果为NULL记录。

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

以下示例返回所有购买记录的所有vip_info，如果购买记录没有相应的vip_info，则vip_info将为NULL。

```sql    
SELECT vip_info.client_id,
       vip_info.region
FROM   vip_info
       RIGHT JOIN purchase_records
               ON vip_info.client_id = purchase_records.client_id; 
```

有关示例中表的定义，请参见 [示例表](#示例表)。

输出：

```sql
NULL|NULL
102|Quebec
103|Vancouver
NULL|NULL
```

## Full Outer Join

*full outer join* 返回两个表中的所有行，匹配行无论是否匹配都会显示，如果没有匹配行，则放置NULL。

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

有关示例中表的定义，请参见 [示例表](#示例表)。

输出：

```sql
Toronto|NULL
Quebec|Donut
Vancouver|Coffee
NULL|Croissant
NULL|Soda
```

## Left / Right Semi Join

*left semi join* 返回左表中在右表中有匹配行的行。*right semi join* 返回右表中在左表中有匹配行的行。

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

以下示例返回有购买记录的VIP客户（Client_ID & Region）：

```sql
SELECT *
FROM   vip_info
       LEFT SEMI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关示例中表的定义，请参见 [示例表](#示例表)。

输出：

```sql
102|Quebec
103|Vancouver
```

以下示例返回VIP客户的购买记录（Client_ID, Item, 和 QTY）：

```sql
SELECT *
FROM   vip_info
       RIGHT SEMI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关示例中表的定义，请参见 [示例表](#示例表)。

输出：

```sql
|102|Donut|3000
|103|Coffee|6000
```

## Left / Right Anti Join

*left anti join* 返回左表中在右表中没有匹配行的行。*right anti join* 返回右表中在左表中没有匹配行的行。

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

以下示例返回没有购买记录的VIP客户（Client_ID & Region）：

```sql
SELECT *
FROM   vip_info
       LEFT ANTI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关示例中表的定义，请参见 [示例表](#示例表)。

输出：

```sql
101|Toronto
```

以下示例返回非VIP客户的购买记录（Client_ID, Item, 和 QTY）：

```sql
SELECT *
FROM   vip_info
       RIGHT ANTI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关示例中表的定义，请参见 [示例表](#示例表)。

输出：

```sql
|100|Croissant|2000
|106|Soda|4000
```