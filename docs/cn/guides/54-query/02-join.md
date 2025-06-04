---
title: 连接（JOIN）
---

## 支持的连接类型

*连接（Join）* 将两个或多个表的列组合到单个结果集中。Databend 支持以下 *连接（Join）* 类型：

* [内连接（Inner Join）](#inner-join)
* [自然连接（Natural Join）](#natural-join)
* [交叉连接（Cross Join）](#cross-join)
* [左连接（Left Join）](#left-join)
* [右连接（Right Join）](#right-join)
* [全外连接（Full Outer Join）](#full-outer-join)
* [左/右半连接（Left / Right Semi-Join）](#left--right-semi-join)
* [左/右反连接（Left / Right Anti-Join）](#left--right-anti-join)

## 示例表

除非明确指定，本页面的连接示例基于以下表创建：

表 "vip_info"：存储 VIP 客户信息。

| Client_ID 	   | Region    	 |
|---------------|-------------|
| 101         	 | Toronto   	 |
| 102         	 | Quebec    	 |
| 103         	 | Vancouver 	 |

表 "purchase_records"：记录所有客户的购买信息。

| Client_ID 	   | Item      	 | QTY 	     |
|---------------|-------------|-----------|
| 100         	 | Croissant 	 | 2,000   	 |
| 102         	 | Donut     	 | 3,000   	 |
| 103         	 | Coffee    	 | 6,000   	 |
| 106         	 | Soda      	 | 4,000   	 |

表 "gift"：列出 VIP 客户的礼品选项。

| Gift      	 |
|-------------|
| Croissant 	 |
| Donut     	 |
| Coffee    	 |
| Soda      	 |

## 内连接（Inner Join）

*内连接（Inner Join）* 返回结果集中满足连接条件的行。

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

当基于公共列使用等值连接时，可用 USING 简化语法：

```sql    
SELECT select_list
FROM table_a
	JOIN table_b
		USING join_column_1
	[JOIN table_c
		USING join_column_2]...
```

### 示例

返回 VIP 客户的购买记录：

```sql    
SELECT purchase_records.client_id,
       purchase_records.item,
       purchase_records.qty
FROM   vip_info
       INNER JOIN purchase_records
               ON vip_info.client_id = purchase_records.client_id; 
```

表定义详见 [示例表](#example-tables)。

输出：

```sql
|102|Donut|3000
|103|Coffee|6000
```

## 自然连接（Natural Join）

*自然连接（Natural Join）* 基于两个表所有同名列进行连接。

### 语法

```sql    
SELECT select_list
FROM table_a
	NATURAL JOIN table_b
	[NATURAL JOIN table_c]...
```

### 示例

返回 VIP 客户的购买记录：

```sql    
SELECT purchase_records.client_id,
       purchase_records.item,
       purchase_records.qty
FROM   vip_info
       NATURAL JOIN purchase_records; 
```

表定义详见 [示例表](#example-tables)。

输出：

```sql
|102|Donut|3,000
|103|Coffee|6,000
```

## 交叉连接（Cross Join）

*交叉连接（Cross Join）* 返回第一个表每行与第二个表每行的组合结果。

### 语法

```sql    
SELECT select_list
FROM table_a
	CROSS JOIN table_b
```

### 示例

为每位 VIP 客户分配所有礼品选项：

```sql    
SELECT *
FROM   vip_info
       CROSS JOIN gift; 
```

表定义详见 [示例表](#example-tables)。

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

*左连接（Left Join）* 返回左表所有记录及右表匹配记录。若无匹配，右表字段返回 NULL。

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

返回所有 VIP 客户的购买记录（无购买记录时显示 NULL）：

```sql    
SELECT vip_info.client_id,
       purchase_records.item,
       purchase_records.qty
FROM   vip_info
       LEFT JOIN purchase_records
              ON vip_info.client_id = purchase_records.client_id; 
```

表定义详见 [示例表](#example-tables)。

输出：

```sql
|101|NULL|NULL
|102|Donut|3000
|103|Coffee|6000
```

## 右连接（Right Join）

*右连接（Right Join）* 返回右表所有记录及左表匹配记录。若无匹配，左表字段返回 NULL。

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

返回所有购买记录对应的 VIP 信息（无 VIP 信息时显示 NULL）：

```sql    
SELECT vip_info.client_id,
       vip_info.region
FROM   vip_info
       RIGHT JOIN purchase_records
               ON vip_info.client_id = purchase_records.client_id; 
```

表定义详见 [示例表](#example-tables)。

输出：

```sql
NULL|NULL
102|Quebec
103|Vancouver
NULL|NULL
```

## 全外连接（Full Outer Join）

*全外连接（Full Outer Join）* 返回两表所有行，匹配行合并显示，无匹配行处填充 NULL。

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

返回两表所有匹配及未匹配的行：

```sql
SELECT vip_info.region,
       purchase_records.item
FROM   vip_info
       FULL OUTER JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

表定义详见 [示例表](#example-tables)。

输出：

```sql
Toronto|NULL
Quebec|Donut
Vancouver|Coffee
NULL|Croissant
NULL|Soda
```

## 左/右半连接（Left / Right Semi Join）

*左半连接（Left Semi Join）* 返回左表中与右表匹配的行。*右半连接（Right Semi Join）* 返回右表中与左表匹配的行。

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

返回有购买记录的 VIP 客户（Client_ID 和 Region）：

```sql
SELECT *
FROM   vip_info
       LEFT SEMI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

表定义详见 [示例表](#example-tables)。

输出：

```sql
102|Quebec
103|Vancouver
```

返回 VIP 客户的购买记录（Client_ID、Item 和 QTY）：

```sql
SELECT *
FROM   vip_info
       RIGHT SEMI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

表定义详见 [示例表](#example-tables)。

输出：

```sql
|102|Donut|3000
|103|Coffee|6000
```

## 左/右反连接（Left / Right Anti Join）

*左反连接（Left Anti Join）* 返回左表中与右表不匹配的行。*右反连接（Right Anti Join）* 返回右表中与左表不匹配的行。

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

返回无购买记录的 VIP 客户（Client_ID 和 Region）：

```sql
SELECT *
FROM   vip_info
       LEFT ANTI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

表定义详见 [示例表](#example-tables)。

输出：

```sql
101|Toronto
```

返回非 VIP 客户的购买记录（Client_ID、Item 和 QTY）：

```sql
SELECT *
FROM   vip_info
       RIGHT ANTI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

表定义详见 [示例表](#example-tables)。

输出：

```sql
|100|Croissant|2000
|106|Soda|4000
```