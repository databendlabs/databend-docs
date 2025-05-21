---
title: COVAR_POP
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.738"/>

返回一组数字对的总体协方差。

## 语法

```sql
COVAR_POP(<expr1>, <expr2>)
```

## 参数

| 参数      |        描述       |
|-----------| ------------------------ |
| `<expr1>` | 任何数值表达式 |
| `<expr2>` | 任何数值表达式 |

## 别名

- [VAR_POP](aggregate-var-pop.md)
- [VARIANCE_POP](aggregate-variance-pop.md)

## 返回类型

float64

## 示例

**创建表并插入示例数据**
```sql
CREATE TABLE product_sales (
  id INT,
  product_id INT,
  units_sold INT,
  revenue FLOAT
);

INSERT INTO product_sales (id, product_id, units_sold, revenue)
VALUES (1, 1, 10, 1000),
       (2, 2, 20, 2000),
       (3, 3, 30, 3000),
       (4, 4, 40, 4000),
       (5, 5, 50, 5000);
```

**查询演示：计算销量和收入之间的总体协方差**

```sql
SELECT COVAR_POP(units_sold, revenue) AS covar_pop_units_revenue
FROM product_sales;
```

**结果**
```sql
| covar_pop_units_revenue |
|-------------------------|
|        20000.0          |
```