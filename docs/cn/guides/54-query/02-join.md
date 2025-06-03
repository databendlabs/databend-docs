---
title: 连接（JOIN）
---

## 支持的连接类型

*连接（Join）* 将两个或多个表的列组合为单个结果集。Databend 支持以下连接类型：

* [内连接（Inner Join）](#inner-join)
* [自然连接（Natural Join）](#natural-join)
* [交叉连接（Cross Join）](#cross-join)
* [左连接（Left Join）](#left-join)
* [右连接（Right Join）](#right-join)
* [全外连接（Full Outer Join）](#full-outer-join)
* [左/右半连接（Left / Right Semi-Join）](#left--right-semi-join)
* [左/右反连接（Left / Right Anti-Join）](#left--right-anti-join)

## 示例表

除非明确说明，本页所有连接示例均基于以下表结构：

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

表 "gift"：列出 VIP 客户可选的礼品。

| Gift      	 |
|-------------|
| Croissant 	 |
| Donut     	 |
| Coffee    	 |
| Soda      	 |

## 内连接（Inner Join）

*内连接* 返回满足连接条件的结果行。

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
INNER 关键字可省略
:::

当通过等值条件连接公共列时，可用 USING 简化语法：

```sql    
SELECT select_list
FROM table_a
	JOIN table_b
		USING join_column_1
	[JOIN table_c
		USING join_column_2]...
```

### 示例

获取 VIP 客户的购买记录：

```sql    
SELECT purchase_records.client_id,
       purchase_records.item,
       purchase_records.qty
FROM   vip_info
       INNER JOIN purchase_records
               ON vip_info.client_id = purchase_records.client_id; 
```

表定义详见 [示例表](#示例表)。

输出：

```sql
|102|Donut|3000
|103|Coffee|6000
```

## 自然连接（Natural Join）

*自然连接* 基于两表所有同名列自动匹配连接。

### 语法

```sql    
SELECT select_list
FROM table_a
	NATURAL JOIN table_b
	[NATURAL JOIN table_c]...
```

### 示例

获取 VIP 客户的购买记录：

```sql    
SELECT purchase_records.client_id,
       purchase_records.item,
       purchase_records.qty
FROM   vip_info
       NATURAL JOIN purchase_records; 
```

表定义详见 [示例表](#示例表)。

输出：

```sql
|102|Donut|3,000
|103|Coffee|6,000
```

## 交叉连接（Cross Join）

*交叉连接* 返回左表每行与右表每行的笛卡尔积。

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

表定义详见 [示例表](#示例表)。

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

*左连接* 返回左表全部记录及右表匹配记录。若无匹配项，则右表返回 NULL 值。

### 语法

```sql    
SELECT select_list
FROM table_a
	LEFT [OUTER] JOIN table_b
		ON join_condition
```
:::tip
OUTER 关键字可省略
:::

### 示例

查询所有 VIP 客户的购买记录（无购买者显示 NULL）：

```sql    
SELECT vip_info.client_id,
       purchase_records.item,
       purchase_records.qty
FROM   vip_info
       LEFT JOIN purchase_records
              ON vip_info.client_id = purchase_records.client_id; 
```

表定义详见 [示例表](#示例表)。

输出：

```sql
|101|NULL|NULL
|102|Donut|3000
|103|Coffee|6000
```

## 右连接（Right Join）

*右连接* 返回右表全部记录及左表匹配记录。若无匹配项，则左表返回 NULL 值。

### 语法

```sql    
SELECT select_list
FROM table_a
	RIGHT [OUTER] JOIN table_b
		ON join_condition
```

:::tip
OUTER 关键字可省略
:::

### 示例

查询所有购买记录对应的 VIP 信息（非 VIP 购买记录显示 NULL）：

```sql    
SELECT vip_info.client_id,
       vip_info.region
FROM   vip_info
       RIGHT JOIN purchase_records
               ON vip_info.client_id = purchase_records.client_id; 
```

表定义详见 [示例表](#示例表)。

输出：

```sql
NULL|NULL
102|Quebec
103|Vancouver
NULL|NULL
```

## 全外连接（Full Outer Join）

*全外连接* 返回两表所有记录，在匹配成功的位置组合行，无匹配项则填充 NULL。

### 语法

```sql
SELECT select_list
FROM   table_a
       FULL OUTER JOIN table_b
                    ON join_condition
```

:::tip
OUTER 关键字可省略
:::

### 示例

返回两表所有匹配及未匹配记录：

```sql
SELECT vip_info.region,
       purchase_records.item
FROM   vip_info
       FULL OUTER JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

表定义详见 [示例表](#示例表)。

输出：

```sql
Toronto|NULL
Quebec|Donut
Vancouver|Coffee
NULL|Croissant
NULL|Soda
```

## 左/右半连接（Left / Right Semi Join）

*左半连接* 返回右表存在匹配的左表行。*右半连接* 返回左表存在匹配的右表行。

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

查询有购买记录的 VIP 客户：

```sql
SELECT *
FROM   vip_info
       LEFT SEMI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

表定义详见 [示例表](#示例表)。

输出：

```sql
102|Quebec
103|Vancouver
```

查询 VIP 客户的购买记录：

```sql
SELECT *
FROM   vip_info
       RIGHT SEMI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

表定义详见 [示例表](#示例表)。

输出：

```sql
|102|Donut|3000
|103|Coffee|6000
```

## 左/右反连接（Left / Right Anti Join）

*左反连接* 返回右表无匹配的左表行。*右反连接* 返回左表无匹配的右表行。

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

查询无购买记录的 VIP 客户：

```sql
SELECT *
FROM   vip_info
       LEFT ANTI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

表定义详见 [示例表](#示例表)。

输出：

```sql
101|Toronto
```

查询非 VIP 客户的购买记录：

```sql
SELECT *
FROM   vip_info
       RIGHT ANTI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

表定义详见 [示例表](#示例表)。

输出：

```sql
|100|Croissant|2000
|106|Soda|4000
```