---
title: MIN
---

Aggregate function.

MIN() 函数返回一组值中的最小值。

## 语法

```
MIN(<expr>)
```

## 参数

| 参数   | 描述   |
| ----------- | ----------- |
| `<expr>`  | 任意表达式 |

## 返回类型

最小值，值的类型。

## 示例

---
title: MIN
---

Aggregate function.

MIN() 函数返回一组值中的最小值。

## 语法

```
MIN(expression)
```

## 参数

| 参数   | 描述   |
| ----------- | ----------- |
| expression  | 任意表达式 |

## 返回类型

最小值，值的类型。

## 示例

**创建表并插入示例数据**
```sql
CREATE TABLE gas_prices (
  id INT,
  station_id INT,
  price FLOAT
);

INSERT INTO gas_prices (id, station_id, price)
VALUES (1, 1, 3.50),
       (2, 1, 3.45),
       (3, 1, 3.55),
       (4, 2, 3.40),
       (5, 2, 3.35);
```

**查询示例：查找 1 号加油站的最低油价**
```sql
SELECT station_id, MIN(price) AS min_price
FROM gas_prices
WHERE station_id = 1
GROUP BY station_id;
```

**结果**
```sql
| station_id | min_price |
|------------|-----------|
|     1      |   3.45    |
```