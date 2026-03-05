---
title: ARRAY_AGG
title_includes: LIST
---

ARRAY_AGG 函数（也称为 LIST）将查询结果中特定列的所有值（包括 NULL）转换为数组。

## 语法

```sql
ARRAY_AGG(<expr>) [ WITHIN GROUP ( <orderby_clause> ) ]

LIST(<expr>)
```

## 参数

| 参数      | 描述         |
|-----------|--------------|
| `<expr>`  | 任何表达式   |

## 可选参数

| 可选参数                            | 描述                                           |
|-------------------------------------|------------------------------------------------|
| WITHIN GROUP [&lt;orderby_clause&gt;](https://docs.databend.com/sql/sql-commands/query-syntax/query-select#order-by-clause) | 定义有序集合聚合中值的顺序                     |

## 返回类型

返回一个 [Array](../../00-sql-reference/10-data-types/array.md)，其元素类型与原始数据类型相同。

## 示例

此示例展示了如何使用 ARRAY_AGG 函数将数据聚合并以方便的数组格式呈现：

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

-- 将 Inception 的所有评分列在数组中
SELECT movie_title, ARRAY_AGG(rating) AS ratings
FROM movie_ratings
WHERE movie_title = 'Inception'
GROUP BY movie_title;

| movie_title |  ratings   |
|-------------|------------|
| Inception   | [5, 4, 5]  |

-- 使用 `WITHIN GROUP` 将 Inception 的所有评分列在数组中
SELECT movie_title, ARRAY_AGG(rating) WITHIN GROUP ( ORDER BY rating DESC ) AS ratings
FROM movie_ratings
WHERE movie_title = 'Inception'
GROUP BY movie_title;

| movie_title |  ratings   |
|-------------|------------|
| Inception   | [5, 5, 4]  |
```