---
title: GROUP_ARRAY_MOVING_AVG
---

GROUP_ARRAY_MOVING_AVG 函数用于计算输入值的移动平均值。该函数可以接受窗口大小作为参数。如果未指定，函数将窗口大小设置为输入值的数量。

## 语法

```sql
GROUP_ARRAY_MOVING_AVG(<expr>)

GROUP_ARRAY_MOVING_AVG(<window_size>)(<expr>)
```

## 参数

| 参数             | 描述               |
|------------------| ------------------ |
| `<window_size>`  | 任何数值表达式     |
| `<expr>`         | 任何数值表达式     |

## 返回类型

返回一个包含双精度或十进制元素的 [数组](../../00-sql-reference/10-data-types/40-data-type-array-types.md)，具体取决于源数据类型。

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

SELECT user_id, GROUP_ARRAY_MOVING_AVG(2)(request_num) AS avg_request_num
FROM hits
GROUP BY user_id;

| user_id | avg_request_num  |
|---------|------------------|
|       1 | [5.0,11.5,21.5]  |
|       3 | [10.0,22.5,35.0] |
|       2 | [7.5,18.0,31.0]  |
```