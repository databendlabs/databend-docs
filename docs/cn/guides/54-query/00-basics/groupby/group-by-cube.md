---
title: GROUP BY CUBE
---

`GROUP BY CUBE` 是 [GROUP BY](index.md) 子句的扩展，与 [GROUP BY ROLLUP](group-by-rollup.md) 类似。除了生成 `GROUP BY ROLLUP` 的所有行之外，`GROUP BY CUBE` 还会添加所有“交叉表”行。小计行是进一步聚合的行，其值通过计算用于生成分组行的相同聚合函数得出。

一个 `CUBE` 分组等价于一连串的 GROUPING SETS（分组集），本质上是一种更简洁的写法。CUBE 规范中的 N 个元素对应 `2^N` 个 `GROUPING SETS`。

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

- `<column_alias>`：查询块 SELECT 列表中出现的列别名。

- `<position>`：SELECT 列表中表达式的位置。

- `<expr>`：当前作用域内表的任意表达式。


## 示例

假设我们有一张名为 sales_data 的表，其结构及示例数据如下：

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

现在，我们使用 `GROUP BY CUBE` 子句获取每个地区与产品的总销售额，以及所有可能的聚合结果：

```sql
SELECT region, product, SUM(sales_amount) AS total_sales
FROM sales_data
GROUP BY CUBE (region, product);
```

结果如下：
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