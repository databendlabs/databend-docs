---
title: Query Hash
---

Query Hash 是一种用于表示唯一 SQL 查询的标识符。它将查询的结构和内容转换为固定长度的值，因此即使查询文本略有差异，只要逻辑结构相同，哈希值也将相同。这有助于识别相似的查询和频繁执行的查询。

## Query Hash 类型

Databend 支持两种类型的 query hash：

- `query_hash`: 即使重复查询在空白或注释上有所不同，query_hash 也能确保它们共享相同的哈希值。例如，以下查询共享相同的哈希值：

    ```sql
    SELECT * FROM t1 WHERE name = 'jim'
    SELECT *  FROM t1 WHERE name  = 'jim'
    ```

- `query_parameterized_hash`: query_parameterized_hash 通过处理比较谓词（例如 `=`、`!=`、`>=`、`<=`）中涉及的字面量来规范化查询，从而能够识别结构相似的查询，而不管使用的具体值如何。例如，以下查询共享相同的哈希值：

    ```sql
    SELECT * FROM t1 WHERE name = 'data'
    SELECT * FROM t1 WHERE name = 'bend'
    ```

## 检索哈希值

Databend 将历史查询的哈希值存储在系统表 [system.query_log](/sql/sql-reference/system-tables/system-query-log) 中名为 `query_hash` 和 `query_parameterized_hash` 的列中。要检索查询的哈希值，可以使用 SELECT 语句从系统表中提取它们。例如：

```sql
SELECT * FROM books;

┌───────────────────────────────────────────────────────────────┐
│        id        │          title          │       genre      │
├──────────────────┼─────────────────────────┼──────────────────┤
│                1 │ To Kill a Mockingbird   │ Fiction          │
│                2 │ A Brief History of Time │ Science          │
└───────────────────────────────────────────────────────────────┘

SELECT query_text, query_hash, query_parameterized_hash 
FROM system.query_log
WHERE query_text = 'SELECT * FROM books';

┌───────────────────────────────────────────────────────────────────────────────────────────┐
│      query_text     │            query_hash            │     query_parameterized_hash     │
├─────────────────────┼──────────────────────────────────┼──────────────────────────────────┤
│ SELECT * FROM books │ 7e612be4897104109449c74d3970c9e7 │ 7e612be4897104109449c74d3970c9e7 │
│ SELECT * FROM books │ 7e612be4897104109449c74d3970c9e7 │ 7e612be4897104109449c74d3970c9e7 │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

## 示例

假设我们有一个包含以下行的表：

```sql
SELECT * FROM books;

┌───────────────────────────────────────────────────────────────┐
│        id        │          title          │       genre      │
├──────────────────┼─────────────────────────┼──────────────────┤
│                1 │ To Kill a Mockingbird   │ Fiction          │
│                2 │ A Brief History of Time │ Science          │
└───────────────────────────────────────────────────────────────┘
```

以下查询将共享相同的哈希值：

```sql
SELECT * FROM books WHERE id = 1;
SELECT *  FROM books WHERE id = 1;
```

要检查它们：

```sql
SELECT query_text, query_hash, query_parameterized_hash 
FROM system.query_log
WHERE query_text = 'SELECT * FROM books WHERE id = 1'
   OR query_text = 'SELECT *  FROM books WHERE id = 1';

┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│            query_text            │            query_hash            │     query_parameterized_hash     │
├──────────────────────────────────┼──────────────────────────────────┼──────────────────────────────────┤
│ SELECT * FROM books WHERE id = 1 │ ae040c4b3a9388c75e10be76ba407b17 │ b68f516c17d3c15b2c070e4af528464c │
│ SELECT * FROM books WHERE id = 1 │ ae040c4b3a9388c75e10be76ba407b17 │ b68f516c17d3c15b2c070e4af528464c │
│ SELECT * FROM books WHERE id = 1 │ ae040c4b3a9388c75e10be76ba407b17 │ b68f516c17d3c15b2c070e4af528464c │
│ SELECT * FROM books WHERE id = 1 │ ae040c4b3a9388c75e10be76ba407b17 │ b68f516c17d3c15b2c070e4af528464c │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

以下查询共享相同的 `query_parameterized_hash` 值：

```sql
SELECT * FROM books WHERE id = 1;
SELECT * FROM books WHERE id = 2;

SELECT query_text, query_hash, query_parameterized_hash 
FROM system.query_log
WHERE query_text = 'SELECT * FROM books WHERE id = 1'
   OR query_text = 'SELECT * FROM books WHERE id = 2';

┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│            query_text            │            query_hash            │     query_parameterized_hash     │
├──────────────────────────────────┼──────────────────────────────────┼──────────────────────────────────┤
│ SELECT * FROM books WHERE id = 1 │ ae040c4b3a9388c75e10be76ba407b17 │ b68f516c17d3c15b2c070e4af528464c │
│ SELECT * FROM books WHERE id = 1 │ ae040c4b3a9388c75e10be76ba407b17 │ b68f516c17d3c15b2c070e4af528464c │
│ SELECT * FROM books WHERE id = 1 │ ae040c4b3a9388c75e10be76ba407b17 │ b68f516c17d3c15b2c070e4af528464c │
│ SELECT * FROM books WHERE id = 1 │ ae040c4b3a9388c75e10be76ba407b17 │ b68f516c17d3c15b2c070e4af528464c │
│ SELECT * FROM books WHERE id = 2 │ 26f135b4936d6a21922074861e5180a4 │ b68f516c17d3c15b2c070e4af528464c │
│ SELECT * FROM books WHERE id = 2 │ 26f135b4936d6a21922074861e5180a4 │ b68f516c17d3c15b2c070e4af528464c │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```