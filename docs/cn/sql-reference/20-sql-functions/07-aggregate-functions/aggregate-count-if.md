---
title: COUNT_IF
---

## COUNT_IF

后缀 `_IF` 可以附加到任何聚合函数的名称上。在这种情况下，聚合函数接受一个额外的参数 —— 一个条件。

```sql
COUNT_IF(<列>, <条件>)
```

## 示例

**创建表并插入示例数据**
```sql
CREATE TABLE orders (
  id INT,
  customer_id INT,
  status VARCHAR,
  total FLOAT
);

INSERT INTO orders (id, customer_id, status, total)
VALUES (1, 1, 'completed', 100),
       (2, 2, 'completed', 200),
       (3, 1, 'pending', 150),
       (4, 3, 'completed', 250),
       (5, 2, 'pending', 300);
```

**查询示例：统计已完成订单**
```sql
SELECT COUNT_IF(status, status = 'completed') AS completed_orders
FROM orders;
```

**结果**
```sql
| completed_orders |
|------------------|
|        3         |
```