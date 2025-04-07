---
title: GROUP BY ROLLUP
---

`GROUP BY ROLLUP` 是 [GROUP BY](index.md) 子句的扩展，用于生成小计行（除了分组行之外）。小计行是通过计算用于生成分组行的相同聚合函数来进一步聚合其值的行。

## 语法

```sql
SELECT ...
FROM ...
[ ... ]
GROUP BY ROLLUP ( groupRollup [ , groupRollup [ , ... ] ] )
[ ... ]
```

其中：

```sql
groupRollup ::= { <column_alias> | <position> | <expr> }
```

- `<column_alias>`: 查询块的 SELECT 列表中出现的列别名

- `<position>`: SELECT 列表中表达式的位置

- `<expr>`: 当前作用域中表的任何表达式

## 示例

让我们创建一个名为 sales_data 的示例表并插入一些数据：

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

现在，让我们使用 GROUP BY ROLLUP 子句来获取每个地区和产品的总销售额，以及每个地区的小计：

```sql
SELECT region, product, SUM(sales_amount) AS total_sales
FROM sales_data
GROUP BY ROLLUP (region, product);
```

结果将是：

```sql
+--------+---------+-------------+
| region | product | total_sales |
+--------+---------+-------------+
| South  | NULL    |         500 |
| West   | NULL    |         500 |
| North  | NULL    |         500 |
| West   | WidgetB |         200 |
| NULL   | NULL    |        1500 |
| North  | WidgetB |         300 |
| South  | WidgetA |         400 |
| North  | WidgetA |         200 |
| West   | WidgetA |         300 |
| South  | WidgetB |         100 |
+--------+---------+-------------+
```

在此示例中，GROUP BY ROLLUP 子句计算每个地区 - 产品组合、每个地区和总计的销售总额。
