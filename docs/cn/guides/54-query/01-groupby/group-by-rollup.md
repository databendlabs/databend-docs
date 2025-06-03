---
title: GROUP BY ROLLUP
---

`GROUP BY ROLLUP`（分组汇总）是 [GROUP BY](index.md) 子句的扩展，它除了生成分组行之外，还会生成小计行。小计行是进一步聚合的结果行，其值通过计算用于生成分组行的相同聚合函数得出。

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

- `<column_alias>`：出现在查询块 SELECT 列表中的列别名  
- `<position>`：表达式在 SELECT 列表中的位置  
- `<expr>`：当前作用域内表上的任何表达式  

## 示例

创建示例表 `sales_data` 并插入数据：
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

使用 `GROUP BY ROLLUP` 子句获取各地区-产品的总销售额及各地区小计：
```sql
SELECT region, product, SUM(sales_amount) AS total_sales
FROM sales_data
GROUP BY ROLLUP (region, product);
```

执行结果：
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

此示例中，`GROUP BY ROLLUP` 子句计算了每个地区-产品组合的总销售额、各地区的总销售额以及总计。