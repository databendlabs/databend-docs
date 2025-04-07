---
title: JOINs
---

## 支持的 Join 类型

*join* 将来自两个或多个表的列合并到单个结果集中。Databend 支持以下 *join* 类型：

* [Inner Join](#inner-join)
* [Natural Join](#natural-join)
* [Cross Join](#cross-join)
* [Left Join](#left-join)
* [Right Join](#right-join)
* [Full Outer Join](#full-outer-join)
* [Left / Right Semi-Join](#left--right-semi-join)
* [Left / Right Anti-Join](#left--right-anti-join)

## 示例表

除非明确指定，否则此页面上的 join 示例基于以下表创建：

表 "vip_info"：此表存储 VIP 客户端信息。

| Client_ID 	   | Region    	 |
|---------------|-------------|
| 101         	 | Toronto   	 |
| 102         	 | Quebec    	 |
| 103         	 | Vancouver 	 |

表 "purchase_records"：此表列出了所有客户端的购买记录。

| Client_ID 	   | Item      	 | QTY 	     |
|---------------|-------------|-----------|
| 100         	 | Croissant 	 | 2,000   	 |
| 102         	 | Donut     	 | 3,000   	 |
| 103         	 | Coffee    	 | 6,000   	 |
| 106         	 | Soda      	 | 4,000   	 |

表 "gift"：此表列出了 VIP 客户端的礼品选项。

| Gift      	 |
|-------------|
| Croissant 	 |
| Donut     	 |
| Coffee    	 |
| Soda      	 |

## Inner Join

*inner join* 返回结果集中满足 join 条件的行。

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

当您使用等号运算符在公共列上连接两个表时，可以使用关键字 USING 来简化语法。

```sql    
SELECT select_list
FROM table_a
	JOIN table_b
		USING join_column_1
	[JOIN table_c
		USING join_column_2]...
```

### 示例

以下示例返回 VIP 客户端的购买记录：

```sql    
SELECT purchase_records.client_id,
       purchase_records.item,
       purchase_records.qty
FROM   vip_info
       INNER JOIN purchase_records
               ON vip_info.client_id = purchase_records.client_id; 
```

有关示例中表的定义，请参见 [示例表](#example-tables)。

输出：

```sql
|102|Donut|3000
|103|Coffee|6000
```

## Natural Join

*natural join* 基于两个表中所有具有相同名称的列连接两个表。

### 语法

```sql    
SELECT select_list
FROM table_a
	NATURAL JOIN table_b
	[NATURAL JOIN table_c]...
```

### 示例

以下示例返回 VIP 客户端的购买记录：

```sql    
SELECT purchase_records.client_id,
       purchase_records.item,
       purchase_records.qty
FROM   vip_info
       NATURAL JOIN purchase_records; 
```

有关示例中表的定义，请参见 [示例表](#example-tables)。

输出：

```sql
|102|Donut|3,000
|103|Coffee|6,000
```

## Cross Join

*cross join* 返回一个结果集，其中包含第一个表中的每一行与第二个表中的每一行连接。

### 语法

```sql    
SELECT select_list
FROM table_a
	CROSS JOIN table_b
```

### 示例

以下示例返回一个结果集，该结果集将每个礼品选项分配给每个 VIP 客户端：

```sql    
SELECT *
FROM   vip_info
       CROSS JOIN gift; 
```

有关示例中表的定义，请参见 [示例表](#example-tables)。

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

*left join* 返回左表中的所有记录，以及右表中匹配的记录。如果右侧没有匹配项，则结果为 NULL 记录。

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

以下示例返回所有 VIP 客户端的购买记录，如果 VIP 客户端没有购买记录，则购买记录将为 NULL：

```sql    
SELECT vip_info.client_id,
       purchase_records.item,
       purchase_records.qty
FROM   vip_info
       LEFT JOIN purchase_records
              ON vip_info.client_id = purchase_records.client_id; 
```

有关示例中表的定义，请参见 [示例表](#example-tables)。

输出：

```sql
|101|NULL|NULL
|102|Donut|3000
|103|Coffee|6000
```

## Right Join

*right join* 返回右表中的所有记录，以及左表中匹配的记录。如果左侧没有匹配项，则结果为 NULL 记录。

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

假设我们有以下表：

以下示例返回所有 purchase_records 的所有 vip_info，如果 purchase_record 没有相应的 vip_info，则 vip_info 将为 NULL。

```sql    
SELECT vip_info.client_id,
       vip_info.region
FROM   vip_info
       RIGHT JOIN purchase_records
               ON vip_info.client_id = purchase_records.client_id; 
```

有关示例中表的定义，请参见 [示例表](#example-tables)。

输出：

```sql
NULL|NULL
102|Quebec
103|Vancouver
NULL|NULL
```

## Full Outer Join

*full outer join* 返回两个表中的所有行，在可以进行匹配的地方匹配行，并在不存在匹配行的地方放置 NULL。

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

有关示例中表的定义，请参见 [示例表](#example-tables)。

输出：

```sql
Toronto|NULL
Quebec|Donut
Vancouver|Coffee
NULL|Croissant
NULL|Soda
```

## Left / Right Semi Join

*left semi join* 返回左表中在右表中具有匹配行的行。*right semi join* 返回右表中在左表中具有匹配行的行。

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

以下示例返回具有购买记录的 VIP 客户端（Client_ID 和 Region）：

```sql
SELECT *
FROM   vip_info
       LEFT SEMI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关示例中表的定义，请参见 [示例表](#example-tables)。

输出：

```sql
102|Quebec
103|Vancouver
```

以下示例返回 VIP 客户端的购买记录（Client_ID、Item 和 QTY）：

```sql
SELECT *
FROM   vip_info
       RIGHT SEMI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关示例中表的定义，请参见 [示例表](#example-tables)。

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

以下示例返回没有购买记录的 VIP 客户端（Client_ID 和 Region）：

```sql
SELECT *
FROM   vip_info
       LEFT ANTI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关示例中表的定义，请参见 [示例表](#example-tables)。

输出：

```sql
101|Toronto
```

以下示例返回非 VIP 客户端的购买记录（Client_ID、Item 和 QTY）：

```sql
SELECT *
FROM   vip_info
       RIGHT ANTI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关示例中表的定义，请参见 [示例表](#example-tables)。

输出：

```sql
|100|Croissant|2000
|106|Soda|4000
```