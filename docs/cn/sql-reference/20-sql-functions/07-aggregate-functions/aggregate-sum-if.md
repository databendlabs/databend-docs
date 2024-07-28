---
title: SUM_IF
---

## SUM_IF

后缀 -If 可以附加到任何聚合函数的名称上。在这种情况下，聚合函数接受一个额外的参数 —— 一个条件。

```
SUM_IF(<列>, <条件>)
```

## 示例

**创建表并插入示例数据**
```sql
CREATE TABLE order_data (
  id INT,
  customer_id INT,
  amount FLOAT,
  status VARCHAR
);

INSERT INTO order_data (id, customer_id, amount, status)
VALUES (1, 1, 100, 'Completed'),
       (2, 2, 50, 'Completed'),
       (3, 3, 80, 'Cancelled'),
       (4, 4, 120, 'Completed'),
       (5, 5, 75, 'Cancelled');
```

**查询演示：计算已完成订单的总金额**
```sql
SELECT SUM_IF(amount, status = 'Completed') AS total_amount_completed
FROM order_data;
```

**结果**
```sql
| total_amount_completed |
|------------------------|
|         270.0          |
```