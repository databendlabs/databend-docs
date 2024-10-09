---
title: ARG_MIN
---

计算最小 `val` 值对应的 `arg` 值。如果有多个不同的 `arg` 值对应于最小 `val` 值，则返回最先遇到的这些值中的一个。

## 语法

```sql
ARG_MIN(<arg>, <val>)
```

## 参数

| 参数      | 描述                                                                                               |
|-----------|----------------------------------------------------------------------------------------------------|
| `<arg>`   | 参数，[Databend 支持的任意数据类型](../../00-sql-reference/10-data-types/index.md)                |
| `<val>`   | 值，[Databend 支持的任意数据类型](../../00-sql-reference/10-data-types/index.md)                   |

## 返回类型

对应于最小 `val` 值的 `arg` 值。

匹配 `arg` 类型。

## 示例

让我们创建一个包含 id、name 和 score 列的学生表，并插入一些数据：
```sql
CREATE TABLE students (
  id INT,
  name VARCHAR,
  score INT
);

INSERT INTO students (id, name, score) VALUES
  (1, 'Alice', 80),
  (2, 'Bob', 75),
  (3, 'Charlie', 90),
  (4, 'Dave', 80);
```

现在，我们可以使用 ARG_MIN 来查找得分最低的学生的姓名：
```sql
SELECT ARG_MIN(name, score) AS student_name
FROM students;
```

结果：
```sql
| student_name |
|--------------|
| Bob      |
```
