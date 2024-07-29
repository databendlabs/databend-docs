---
title: COUNT
---

COUNT() 函数返回由 SELECT 查询返回的记录数。

:::caution
NULL 值不会被计数。
:::

## 语法

```sql
COUNT(<expr>)
```

## 参数

| 参数      | 描述                                                                                                                      |
|-----------|---------------------------------------------------------------------------------------------------------------------------|
| `<expr>`  | 任何表达式。<br />这可以是列名、另一个函数的结果或数学运算。<br />`*` 也是允许的，表示纯粹的行计数。 |

## 返回类型

整数。

## 示例

**创建表并插入示例数据**
```sql
CREATE TABLE students (
  id INT,
  name VARCHAR,
  age INT,
  grade FLOAT NULL
);

INSERT INTO students (id, name, age, grade)
VALUES (1, 'John', 21, 85),
       (2, 'Emma', 22, NULL),
       (3, 'Alice', 23, 90),
       (4, 'Michael', 21, 88),
       (5, 'Sophie', 22, 92);

```

**查询示例：统计有有效成绩的学生**
```sql
SELECT COUNT(grade) AS count_valid_grades
FROM students;
```

**结果**
```sql
| count_valid_grades |
|--------------------|
|          4         |
```