---
title: GROUP BY CUBE
---

`GROUP BY CUBE` 是 [GROUP BY](index.md) 子句的扩展，类似于 [GROUP BY ROLLUP](group-by-rollup.md)。除了生成 `GROUP BY ROLLUP` 的所有行之外，`GROUP BY CUBE` 还会添加所有"交叉表"行。小计行代表更高层级的聚合结果，其值通过计算与分组行相同的聚合函数得出。

`CUBE` 分组等价于一系列分组集（Grouping Sets），本质上是更简洁的表示形式。CUBE 规范的 N 个元素对应 `2^N` 个分组集。

## 语法

```sql
SELECT ...
FROM ...
[ ... ]
GROUP BY CUBE ( groupCube [ , groupCube [ , ... ] ] )
[ ... ]
```

其中：
```sql
groupCube ::= { <column_alias> | <position> | <expr> }
```

- `<column_alias>`：出现在查询块 SELECT 列表中的列别名
- `<position>`：表达式在 SELECT 列表中的位置
- `<expr>`：当前范围内表上的任意表达式

## 示例

假设存在以下结构和示例数据的 sales_data 表：

```sql
CREATE TABLE sales_data (
  region VARCHAR(255),
  product VARCHAR(255),
  sales_amount INT
);

INSERT INTO sales_data (region, product, sales_amount) VALUES
  ('North', 'WidgetA', 200),
  ('North', 'WidgetB', 300),
  ('South', 'WidgetA', 400),
  ('South', 'WidgetB', 100),
  ('West', 'WidgetA', 300),
  ('West', 'WidgetB', 200);
```

使用 `GROUP BY CUBE` 子句获取各地区和各产品的总销售额，以及所有可能的聚合结果：

```sql
SELECT region, product, SUM(sales_amount) AS total_sales
FROM sales_data
GROUP BY CUBE (region, product);
```

返回结果：
```sql
+--------+---------+-------------+
| region | product | total_sales |
+--------+---------+-------------+
| South  | NULL    |         500 |
| NULL   | WidgetB |         600 |
| West   | NULL    |         500 |
| North  | NULL    |         500 |
| West   | WidgetB |         200 |
| NULL   | NULL    |        1500 |
| North  | WidgetB |         300 |
| South  | WidgetA |         400 |
| North  | WidgetA |         200 |
| NULL   | WidgetA |         900 |
| West   | WidgetA |         300 |
| South  | WidgetB |         100 |
+--------+---------+-------------+
```