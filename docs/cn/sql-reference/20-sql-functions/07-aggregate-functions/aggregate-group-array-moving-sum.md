---
title: GROUP_ARRAY_MOVING_SUM
---

GROUP_ARRAY_MOVING_SUM 函数用于计算输入值的移动和。该函数可以接受窗口大小作为参数。如果未指定，函数将窗口大小设置为输入值的数量。

## 语法

```sql
GROUP_ARRAY_MOVING_SUM(<expr>)

GROUP_ARRAY_MOVING_SUM(<window_size>)(<expr>)
```

## 参数

| 参数             | 描述               |
|------------------| ------------------ |
| `<window_size>`  | 任何数值表达式     |
| `<expr>`         | 任何数值表达式     |

## 返回类型

返回一个 [Array](../../00-sql-reference/10-data-types/array.md)，其元素与原始数据的类型相同。

## 示例

```sql
-- 创建表并插入示例数据
CREATE TABLE hits (
  user_id INT,
  request_num INT
);

INSERT INTO hits (user_id, request_num)
VALUES (1, 10),
       (2, 15),
       (3, 20),
       (1, 13),
       (2, 21),
       (3, 25),
       (1, 30),
       (2, 41),
       (3, 45);

SELECT user_id, GROUP_ARRAY_MOVING_SUM(2)(request_num) AS request_num
FROM hits
GROUP BY user_id;

| user_id | request_num |
|---------|-------------|
|       1 | [10,23,43]  |
|       2 | [20,45,70]  |
|       3 | [15,36,62]  |
```