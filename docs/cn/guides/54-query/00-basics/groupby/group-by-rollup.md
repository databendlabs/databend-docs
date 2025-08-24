---
title: GROUP BY ROLLUP
---

`GROUP BY ROLLUP` 是 [GROUP BY](index.md) 子句的扩展，它在分组行之外额外生成小计行。小计行通过再次聚合得到，其值由用于生成分组行的相同聚合函数计算得出。

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

- `<column_alias>`：查询块 SELECT 列表中出现的列别名。

- `<position>`：SELECT 列表中表达式的位置。

- `<expr>`：当前作用域内表的任意表达式。


## 示例

首先创建一个名为 sales_data 的示例表并插入数据：
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

接下来，使用 GROUP BY ROLLUP 子句获取每个区域和产品的销售额，以及每个区域的小计：
```sql
SELECT region, product, SUM(sales_amount) AS total_sales
FROM sales_data
GROUP BY ROLLUP (region, product);
```

结果如下：
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

在此示例中，GROUP BY ROLLUP 子句计算了每个区域-产品组合、每个区域以及总计的销售额。