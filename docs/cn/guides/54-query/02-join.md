---
title: JOIN 连接操作
---

## 支持的连接类型

*连接* (join) 操作将两个或多个表的列合并为单个结果集。Databend 支持以下连接类型：

* [内连接](#inner-join)
* [自然连接](#natural-join)
* [交叉连接](#cross-join)
* [左连接](#left-join)
* [右连接](#right-join)
* [全外连接](#full-outer-join)
* [左/右半连接](#left--right-semi-join)
* [左/右反连接](#left--right-anti-join)

## 示例数据表

除非特别说明，本页所有连接示例均基于以下数据表创建：

表 "vip_info"：存储 VIP 客户信息。

| Client_ID 	   | Region    	 |
|---------------|-------------|
| 101         	 | Toronto   	 |
| 102         	 | Quebec    	 |
| 103         	 | Vancouver 	 |

表 "purchase_records"：记录所有客户的购买记录。

| Client_ID 	   | Item      	 | QTY 	     |
|---------------|-------------|-----------|
| 100         	 | Croissant 	 | 2,000   	 |
| 102         	 | Donut     	 | 3,000   	 |
| 103         	 | Coffee    	 | 6,000   	 |
| 106         	 | Soda      	 | 4,000   	 |

表 "gift"：列出可供 VIP 客户选择的礼品选项。

| Gift      	 |
|-------------|
| Croissant 	 |
| Donut     	 |
| Coffee    	 |
| Soda      	 |

## 内连接

*内连接* 返回结果集中满足连接条件的行。

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

当使用等值运算符连接两个表的公共列时，可以使用 USING 关键字简化语法。

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

示例中使用的表定义请参阅 [示例数据表](#example-tables)。

输出结果：

```sql
|102|Donut|3000
|103|Coffee|6000
```

## 自然连接

*自然连接* 基于两个表中所有同名列自动进行连接。

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

示例中使用的表定义请参阅 [示例数据表](#example-tables)。

输出结果：

```sql
|102|Donut|3,000
|103|Coffee|6,000
```

## 交叉连接

*交叉连接* 返回第一个表的每一行与第二个表的每一行组合的结果集。

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

示例中使用的表定义请参阅 [示例数据表](#example-tables)。

输出结果：

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

*左连接* 返回左表的所有记录，以及右表中匹配的记录。如果右表没有匹配项，则结果中右表字段显示为 NULL。

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

以下示例返回所有 VIP 客户的购买记录，若 VIP 客户无购买记录则对应字段显示为 NULL：

```sql    
SELECT vip_info.client_id,
       purchase_records.item,
       purchase_records.qty
FROM   vip_info
       LEFT JOIN purchase_records
              ON vip_info.client_id = purchase_records.client_id; 
```

示例中使用的表定义请参阅 [示例数据表](#example-tables)。

输出结果：

```sql
|101|NULL|NULL
|102|Donut|3000
|103|Coffee|6000
```

## 右连接

*右连接* 返回右表的所有记录，以及左表中匹配的记录。如果左表没有匹配项，则结果中左表字段显示为 NULL。

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

以下示例返回所有购买记录对应的 VIP 客户信息，若无对应 VIP 信息则显示为 NULL：

```sql    
SELECT vip_info.client_id,
       vip_info.region
FROM   vip_info
       RIGHT JOIN purchase_records
               ON vip_info.client_id = purchase_records.client_id; 
```

示例中使用的表定义请参阅 [示例数据表](#example-tables)。

输出结果：

```sql
NULL|NULL
102|Quebec
103|Vancouver
NULL|NULL
```

## 全外连接

*全外连接* 返回两个表的所有行，匹配的行会合并显示，不匹配的部分用 NULL 填充。

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

示例中使用的表定义请参阅 [示例数据表](#example-tables)。

输出结果：

```sql
Toronto|NULL
Quebec|Donut
Vancouver|Coffee
NULL|Croissant
NULL|Soda
```

## 左/右半连接

*左半连接* 返回左表中与右表匹配的行。*右半连接* 返回右表中与左表匹配的行。

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

以下示例返回有购买记录的 VIP 客户 (Client_ID 和 Region)：

```sql
SELECT *
FROM   vip_info
       LEFT SEMI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

示例中使用的表定义请参阅 [示例数据表](#example-tables)。

输出结果：

```sql
102|Quebec
103|Vancouver
```

以下示例返回 VIP 客户的购买记录 (Client_ID、Item 和 QTY)：

```sql
SELECT *
FROM   vip_info
       RIGHT SEMI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

示例中使用的表定义请参阅 [示例数据表](#example-tables)。

输出结果：

```sql
|102|Donut|3000
|103|Coffee|6000
```

## 左/右反连接

*左反连接* 返回左表中不与右表匹配的行。*右反连接* 返回右表中不与左表匹配的行。

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

以下示例返回没有购买记录的 VIP 客户 (Client_ID 和 Region)：

```sql
SELECT *
FROM   vip_info
       LEFT ANTI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

示例中使用的表定义请参阅 [示例数据表](#example-tables)。

输出结果：

```sql
101|Toronto
```

以下示例返回非 VIP 客户的购买记录 (Client_ID、Item 和 QTY)：

```sql
SELECT *
FROM   vip_info
       RIGHT ANTI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

示例中使用的表定义请参阅 [示例数据表](#example-tables)。

输出结果：

```sql
|100|Croissant|2000
|106|Soda|4000
```