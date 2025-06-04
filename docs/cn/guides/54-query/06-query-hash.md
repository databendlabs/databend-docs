---
title: 查询哈希（Query Hash）
---

查询哈希是用于标识唯一 SQL 查询的编码值。它将查询的结构和内容转换为固定长度的哈希值，即使查询文本存在细微差异（如空格或注释），只要逻辑结构相同，哈希值就保持一致。这有助于识别相似查询和高频执行查询。

## 查询哈希类型

Databend 支持两种查询哈希类型：

- `query_hash`：该哈希值确保重复查询（即使存在空格或注释差异）具有相同哈希值。例如以下查询共享相同哈希值：

    ```sql
    SELECT * FROM t1 WHERE name = 'jim'
    SELECT *  FROM t1 WHERE name  = 'jim'
    ```

- `query_parameterized_hash`：该哈希值通过标准化比较谓词（如 `=`、`!=`、`>=`、`<=`）中的字面量，实现结构相似查询的识别，无论具体取值如何。例如以下查询共享相同哈希值：

    ```sql
    SELECT * FROM t1 WHERE name = 'data'
    SELECT * FROM t1 WHERE name = 'bend'
    ```

## 检索哈希值

Databend 在系统表 [system.query_log](/sql/sql-reference/system-tables/system-query-log) 的 `query_hash` 和 `query_parameterized_hash` 列中存储历史查询的哈希值。可通过 SELECT 语句从系统表检索哈希值，例如：

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

假设存在包含以下数据的表：

```sql
SELECT * FROM books;

┌───────────────────────────────────────────────────────────────┐
│        id        │          title          │       genre      │
├──────────────────┼─────────────────────────┼──────────────────┤
│                1 │ To Kill a Mockingbird   │ Fiction          │
│                2 │ A Brief History of Time │ Science          │
└───────────────────────────────────────────────────────────────┘
```

以下查询共享相同哈希值：

```sql
SELECT * FROM books WHERE id = 1;
SELECT *  FROM books WHERE id = 1;
```

验证如下：

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

以下查询共享相同 `query_parameterized_hash` 值：

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