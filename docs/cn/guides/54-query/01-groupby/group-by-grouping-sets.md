---
title: GROUP BY GROUPING SETS
---

`GROUP BY GROUPING SETS` 是 [GROUP BY](index.md) 子句的一个强大扩展，它允许在单个语句中计算多个 group-by 子句。分组集是一组维度列。

`GROUP BY GROUPING SETS` 相当于同一结果集中两个或多个 GROUP BY 操作的 UNION：

- `GROUP BY GROUPING SETS((a))` 相当于单个分组集操作 `GROUP BY a`。

- `GROUP BY GROUPING SETS((a),(b))` 相当于 `GROUP BY a UNION ALL GROUP BY b`。

## 语法

```sql
SELECT ...
FROM ...
[ ... ]
GROUP BY GROUPING SETS ( groupSet [ , groupSet [ , ... ] ] )
[ ... ]
```

其中：

```sql
groupSet ::= { <column_alias> | <position> | <expr> }
```

- `<column_alias>`：查询块 SELECT 列表中出现的列别名

- `<position>`：SELECT 列表中表达式的位置

- `<expr>`：当前作用域中表中的任何表达式

## 示例

示例数据设置：

```sql
-- 创建一个示例销售表
CREATE TABLE sales (
    id INT,
    sale_date DATE,
    product_id INT,
    store_id INT,
    quantity INT
);

-- 将示例数据插入销售表
INSERT INTO sales (id, sale_date, product_id, store_id, quantity)
VALUES (1, '2021-01-01', 101, 1, 5),
       (2, '2021-01-01', 102, 1, 10),
       (3, '2021-01-01', 101, 2, 15),
       (4, '2021-01-02', 102, 1, 8),
       (5, '2021-01-02', 101, 2, 12),
       (6, '2021-01-02', 103, 2, 20);
```

### 使用列别名的 GROUP BY GROUPING SETS

```sql
SELECT product_id AS pid,
       store_id AS sid,
       SUM(quantity) AS total_quantity
FROM sales
GROUP BY GROUPING SETS((pid), (sid));
```

此查询等价于：

```sql
SELECT product_id AS pid,
       NULL AS sid,
       SUM(quantity) AS total_quantity
FROM sales
GROUP BY pid
UNION ALL
SELECT NULL AS pid,
       store_id AS sid,
       SUM(quantity) AS total_quantity
FROM sales
GROUP BY sid;
```

输出：

```sql
+------+------+----------------+
| pid  | sid  | total_quantity |
+------+------+----------------+
|  102 | NULL |             18 |
| NULL |    2 |             47 |
|  101 | NULL |             32 |
|  103 | NULL |             20 |
| NULL |    1 |             23 |
+------+------+----------------+
```

### 使用位置的 GROUP BY GROUPING SETS

```sql
SELECT product_id,
       store_id,
       SUM(quantity) AS total_quantity
FROM sales
GROUP BY GROUPING SETS((1), (2));
```

此查询等价于：

```sql
SELECT product_id,
       NULL AS store_id,
       SUM(quantity) AS total_quantity
FROM sales
GROUP BY product_id
UNION ALL
SELECT NULL AS product_id,
       store_id,
       SUM(quantity) AS total_quantity
FROM sales
GROUP BY store_id;
```

输出：

```sql
+------------+----------+----------------+
| product_id | store_id | total_quantity |
+------------+----------+----------------+
|        102 |     NULL |             18 |
|       NULL |        2 |             47 |
|        101 |     NULL |             32 |
|        103 |     NULL |             20 |
|       NULL |        1 |             23 |
+------------+----------+----------------+
```
