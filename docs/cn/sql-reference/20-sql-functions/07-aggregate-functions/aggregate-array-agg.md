---
title: ARRAY_AGG
title_includes: LIST
---

ARRAY_AGG 函数（也称为别名 LIST）将查询结果中特定列的所有值（包括 NULL）转换为数组。

## 语法

```sql
ARRAY_AGG(<expr>) [ WITHIN GROUP ( <orderby_clause> ) ]

LIST(<expr>)
```

## 参数

| 参数      | 描述     |
|-----------| -------------- |
| `<expr>`  | 任何表达式 |

## 可选项

| 可选项                            | 描述                                                         |
|-------------------------------------|--------------------------------------------------------------|
| WITHIN GROUP [&lt;orderby_clause&gt;](https://docs.databend.com/sql/sql-commands/query-syntax/query-select#order-by-clause) | 定义有序集合聚合中值的顺序 |

## 返回类型

返回一个 [Array](../../00-sql-reference/10-data-types/array.md)，其元素类型与原始数据类型相同。

## 示例

此示例演示了如何使用 ARRAY_AGG 函数以方便的数组格式聚合和呈现数据：

```sql
-- 创建表并插入示例数据
CREATE TABLE movie_ratings (
  id INT,
  movie_title VARCHAR,
  user_id INT,
  rating INT
);

INSERT INTO movie_ratings (id, movie_title, user_id, rating)
VALUES (1, 'Inception', 1, 5),
       (2, 'Inception', 2, 4),
       (3, 'Inception', 3, 5),
       (4, 'Interstellar', 1, 4),
       (5, 'Interstellar', 2, 3);

-- 在数组中列出 Inception 的所有评分
SELECT movie_title, ARRAY_AGG(rating) AS ratings
FROM movie_ratings
WHERE movie_title = 'Inception'
GROUP BY movie_title;

| movie_title |  ratings   |
|-------------|------------|
| Inception   | [5, 4, 5]  |

-- 使用 `WITHIN GROUP` 在数组中列出 Inception 的所有评分
SELECT movie_title, ARRAY_AGG(rating) WITHIN GROUP ( ORDER BY rating DESC ) AS ratings
FROM movie_ratings
WHERE movie_title = 'Inception'
GROUP BY movie_title;

| movie_title |  ratings   |
|-------------|------------|
| Inception   | [5, 5, 4]  |
```