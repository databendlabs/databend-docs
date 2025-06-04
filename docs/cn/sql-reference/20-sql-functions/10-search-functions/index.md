---
title: 全文搜索函数（Full-Text Search Functions）
---

本节提供 Databend 中全文搜索函数的参考信息。这些函数可实现与专用搜索引擎类似的强大文本搜索能力。

:::info
Databend 的全文搜索函数设计灵感源自 [Elasticsearch 全文搜索函数](https://www.elastic.co/guide/en/elasticsearch/reference/current/sql-functions-search.html)。
:::

## 搜索函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [MATCH](match) | 在选定列中搜索包含指定关键词的文档 | `MATCH('title, body', 'technology')` |
| [QUERY](query) | 使用高级语法搜索满足指定查询表达式的文档 | `QUERY('title:technology AND society')` |
| [SCORE](score) | 配合 MATCH 或 QUERY 使用时返回搜索结果的相关性评分 | `SELECT title, SCORE() FROM articles WHERE MATCH('title', 'technology')` |

## 使用示例

### 基本文本搜索

```sql
-- 在 title 或 body 列中搜索包含 'technology' 的文档
SELECT * FROM articles 
WHERE MATCH('title, body', 'technology');
```

### 高级查询表达式

```sql
-- 搜索 title 列包含 'technology' 且 body 列包含 'impact' 的文档
SELECT * FROM articles 
WHERE QUERY('title:technology AND body:impact');
```

### 相关性评分

```sql
-- 执行带相关性评分的搜索，并按评分降序排序
SELECT title, body, SCORE() 
FROM articles 
WHERE MATCH('title^2, body', 'technology') 
ORDER BY SCORE() DESC;
```

使用这些函数前，需在目标列上创建倒排索引（Inverted Index）：

```sql
CREATE INVERTED INDEX idx ON articles(title, body);
```