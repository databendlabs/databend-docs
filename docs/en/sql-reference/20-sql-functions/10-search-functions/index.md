---
title: Full-Text Search Functions
---

This section provides reference information for the full-text search functions in Databend. These functions enable powerful text search capabilities similar to those found in dedicated search engines.

:::info
Databend's full-text search functions are inspired by [Elasticsearch Full-Text Search Functions](https://www.elastic.co/guide/en/elasticsearch/reference/current/sql-functions-search.html).
:::

## Search Functions

| Function | Description | Example |
|----------|-------------|--------|
| [MATCH](match) | Searches for documents containing specified keywords in selected columns | `MATCH('title, body', 'technology')` |
| [QUERY](query) | Searches for documents satisfying a specified query expression with advanced syntax | `QUERY('title:technology AND society')` |
| [SCORE](score) | Returns the relevance score of search results when used with MATCH or QUERY | `SELECT title, SCORE() FROM articles WHERE MATCH('title', 'technology')` |

## Usage Examples

### Basic Text Search

```sql
-- Search for documents with 'technology' in title or body columns
SELECT * FROM articles 
WHERE MATCH('title, body', 'technology');
```

### Advanced Query Expressions

```sql
-- Search for documents with 'technology' in title and 'impact' in body
SELECT * FROM articles 
WHERE QUERY('title:technology AND body:impact');
```

### Relevance Scoring

```sql
-- Search with relevance scoring and sorting by relevance
SELECT title, body, SCORE() 
FROM articles 
WHERE MATCH('title^2, body', 'technology') 
ORDER BY SCORE() DESC;
```

Before using these functions, you need to create an inverted index on the columns you want to search:

```sql
CREATE INVERTED INDEX idx ON articles(title, body);
```