---
title: GROUP BY CUBE
---

`GROUP BY CUBE` 是 [GROUP BY](index.md) 子句的扩展，类似于 [GROUP BY ROLLUP](group-by-rollup.md)。除了生成 `GROUP BY ROLLUP` 的所有行之外，`GROUP BY CUBE` 还添加了所有“交叉表”行。子总计行是进一步聚合的行，其值是通过计算用于生成分组行的相同聚合函数得出的。

`CUBE` 分组相当于一系列分组集，本质上是一种更简洁的规范。CUBE 规范的 N 个元素对应于 `2^N` 个分组集。

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

- `<column_alias>`: 查询块 SELECT 列表中出现的列别名

- `<position>`: SELECT 列表中表达式的位置

- `<expr>`: 当前作用域内表上的任何表达式

## 示例

假设我们有一个 sales_data 表，其架构和示例数据如下：

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

现在，让我们使用 `GROUP BY CUBE` 子句来获取每个地区和产品的总销售额，以及所有可能的聚合：

```sql
SELECT region, product, SUM(sales_amount) AS total_sales
FROM sales_data
GROUP BY CUBE (region, product);
```

结果将是：

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
