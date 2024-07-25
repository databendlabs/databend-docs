---
title: DATE DIFF
---

Databend 目前尚未提供 `date_diff` 函数，但它支持直接对日期和时间进行算术运算。例如，你可以使用表达式 `TO_DATE(NOW())-2` 来获取两天前的日期。

Databend 直接操作日期和时间的灵活性使其在处理日期和时间计算时既方便又多功能。请参见以下示例：

```sql
CREATE TABLE tasks (
  task_name VARCHAR(50),
  start_date DATE,
  end_date DATE
);

INSERT INTO tasks (task_name, start_date, end_date)
VALUES
  ('Task 1', '2023-06-15', '2023-06-20'),
  ('Task 2', '2023-06-18', '2023-06-25'),
  ('Task 3', '2023-06-20', '2023-06-23');

SELECT task_name, end_date - start_date AS duration
FROM tasks;

┌────────────────────────────────────┐
│     task_name    │     duration    │
├──────────────────┼─────────────────┤
│ Task 1           │               5 │
│ Task 2           │               7 │
│ Task 3           │               3 │
└────────────────────────────────────┘
```