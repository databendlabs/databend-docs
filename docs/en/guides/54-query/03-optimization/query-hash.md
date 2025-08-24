---
title: Query Hash
---

A Query Hash is an identifier used to represent a unique SQL query. It converts the structure and content of the query into a fixed-length value, so even if the query text has slight differences, the hash will be the same as long as the logical structure is identical. This helps in identifying similar queries and frequently executed queries.

## Query Hash Types

Databend supports for two types of query hashes: 

- `query_hash`: The query_hash ensures that repeated queries, even with variations in white space or comments, share the same hash. For example, the following queries share the same hash:

    ```sql
    SELECT * FROM t1 WHERE name = 'jim'
    SELECT *  FROM t1 WHERE name  = 'jim'
    ```

- `query_parameterized_hash`: The query_parameterized_hash normalizes queries by handling literals involved in comparison predicates (e.g., `=`, `!=`, `>=`, `<=`), enabling the identification of structurally similar queries regardless of the specific values used. For example, the following queries share the same hash:

    ```sql
    SELECT * FROM t1 WHERE name = 'data'
    SELECT * FROM t1 WHERE name = 'bend'
    ```

## Retrieving Hash Values

Databend stores the hash values of historical queries in the columns named `query_hash` and `query_parameterized_hash` in system table [system.query_log](/sql/sql-reference/system-tables/system-query-log). To retrieve the hash values of a query, you can pull them from the system table using a SELECT statement. For example:

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

## Examples

Suppose we have a table containing the following rows:

```sql
SELECT * FROM books;

┌───────────────────────────────────────────────────────────────┐
│        id        │          title          │       genre      │
├──────────────────┼─────────────────────────┼──────────────────┤
│                1 │ To Kill a Mockingbird   │ Fiction          │
│                2 │ A Brief History of Time │ Science          │
└───────────────────────────────────────────────────────────────┘
```

The following queries would share the same hash values:

```sql
SELECT * FROM books WHERE id = 1;
SELECT *  FROM books WHERE id = 1;
```

To check them out:

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

The following queries share the same `query_parameterized_hash` value:

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