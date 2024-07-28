---
title: MAX
---

聚合函数。

MAX() 函数返回一组值中的最大值。

## 语法

```
MAX(<expr>)
```

## 参数

| 参数       | 描述       |
|-----------| ----------- |
| `<expr>`  | 任何表达式 |

## 返回类型

最大值，类型与值的类型相同。

## 示例

**创建表并插入示例数据**
```sql
CREATE TABLE temperatures (
  id INT,
  city VARCHAR,
  temperature FLOAT
);

INSERT INTO temperatures (id, city, temperature)
VALUES (1, 'New York', 30),
       (2, 'New York', 28),
       (3, 'New York', 32),
       (4, 'Los Angeles', 25),
       (5, 'Los Angeles', 27);
```

**查询示例：查找纽约市的最高温度**

```sql
SELECT city, MAX(temperature) AS max_temperature
FROM temperatures
WHERE city = 'New York'
GROUP BY city;
```

**结果**
```sql
|    city    | max_temperature |
|------------|-----------------|
| New York   |       32        |
```