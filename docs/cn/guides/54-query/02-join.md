---
title: 连接操作
---

## 支持的连接类型

*连接*操作将两个或多个表的列合并成一个结果集。Databend 支持以下*连接*类型：

- [内连接](#内连接)
- [自然连接](#自然连接)
- [交叉连接](#交叉连接)
- [左连接](#左连接)
- [右连接](#右连接)
- [全外连接](#全外连接)
- [左/右半连接](#左右半连接)
- [左/右反连接](#左右反连接)

## 示例表

除非另有说明，本页上的连接示例基于以下表格：

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

*内连接*返回结果集中满足连接条件的行。

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
INNER 关键字是可选的。
:::

当您使用等号运算符在两个表的公共列上进行连接时，可以使用 USING 关键字简化语法。

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

有关示例中表格的定义，请参见 [示例表](#示例表)。

输出：

```sql
|102|Donut|3000
|103|Coffee|6000
```

## 自然连接

*自然连接*基于两个表中具有相同名称的所有列来连接两个表。

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

有关示例中表格的定义，请参见 [示例表](#示例表)。

输出：

```sql
|102|Donut|3,000
|103|Coffee|6,000
```

## 交叉连接

*交叉连接*返回一个结果集，其中包含第一个表的每一行与第二个表的每一行连接的结果。

### 语法

```sql
SELECT select_list
FROM table_a
	CROSS JOIN table_b
```

### 示例

以下示例返回一个结果集，为每个 VIP 客户分配每种礼品选项：

```sql
SELECT *
FROM   vip_info
       CROSS JOIN gift;
```

有关示例中表格的定义，请参见 [示例表](#示例表)。

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

*左连接*返回左表中的所有记录，以及右表中的匹配记录。如果没有匹配，则结果来自右侧的记录为 NULL。

### 语法

```sql
SELECT select_list
FROM table_a
	LEFT [OUTER] JOIN table_b
		ON join_condition
```

:::tip
OUTER 关键字是可选的。
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

有关示例中表格的定义，请参见 [示例表](#示例表)。

输出：

```sql
|101|NULL|NULL
|102|Donut|3000
|103|Coffee|6000
```

## 右连接

*右连接*返回右表中的所有记录，以及左表中的匹配记录。如果没有匹配，则结果来自左侧的记录为 NULL。

### 语法

```sql
SELECT select_list
FROM table_a
	RIGHT [OUTER] JOIN table_b
		ON join_condition
```

:::tip
OUTER 关键字是可选的。
:::

### 示例

假设我们有以下表格：

以下示例返回所有购买记录的 vip_info，如果购买记录没有对应的 vip_info，则 vip_info 将为 NULL。

```sql
SELECT vip_info.client_id,
       vip_info.region
FROM   vip_info
       RIGHT JOIN purchase_records
               ON vip_info.client_id = purchase_records.client_id;
```

有关示例中表格的定义，请参见 [示例表](#示例表)。

输出：

```sql
NULL|NULL
102|Quebec
103|Vancouver
NULL|NULL
```

## 全外连接

*全外连接*返回来自两个表的所有行，匹配可以匹配的行，并在没有匹配行的地方放置 NULL。

### 语法

```sql
SELECT select_list
FROM   table_a
       FULL OUTER JOIN table_b
                    ON join_condition
```

:::tip
OUTER 关键字是可选的。
:::

### 示例

以下示例返回两个表中的所有匹配和不匹配的行：

```sql
SELECT vip_info.region,
       purchase_records.item
FROM   vip_info
       FULL OUTER JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关示例中表格的定义，请参见 [示例表](#示例表)。

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

以下示例返回有购买记录的 VIP 客户（客户 ID & 地区）：

```sql
SELECT *
FROM   vip_info
       LEFT SEMI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关示例中表格的定义，请参见 [示例表](#示例表)。

输出：

```sql
102|Quebec
103|Vancouver
```

以下示例返回 VIP 客户的购买记录（客户 ID，商品，数量）：

```sql
SELECT *
FROM   vip_info
       RIGHT SEMI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关示例中表格的定义，请参见 [示例表](#示例表)。

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

以下示例返回没有购买记录的 VIP 客户（客户 ID & 地区）：

```sql
SELECT *
FROM   vip_info
       LEFT ANTI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关示例中表格的定义，请参见 [示例表](#示例表)。

输出：

```sql
101|Toronto
```

以下示例返回非 VIP 客户的购买记录（客户 ID，商品，数量）：

```sql
SELECT *
FROM   vip_info
       RIGHT ANTI JOIN purchase_records
                    ON vip_info.client_id = purchase_records.client_id;
```

有关示例中表格的定义，请参见 [示例表](#示例表)。

输出：

```sql
|100|Croissant|2000
|106|Soda|4000
```
