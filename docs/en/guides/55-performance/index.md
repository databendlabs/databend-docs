---
title: Performance Optimization
---

Databend provides various optimization features to accelerate query performance across different scenarios.

## Optimization Features

| Feature | Category | Description | Example Use Case |
|---------|----------|-------------|------------------|
| [**Cluster Key**](00-cluster-key.md) | **Storage** | Automatic data organization for large table queries | `CLUSTER BY (date, region)` for time-series data |
| [**Query Result Cache**](query-result-cache.md) | **Caching** | Automatic caching for repeated queries | Dashboard queries, daily reports |
| [**Virtual Column**](01-virtual-column.md) | **Semi-Structured** | Automatic acceleration for VARIANT data queries | JSON data with frequently accessed nested fields |
| [**Aggregating Index**](02-aggregating-index.md) | **Aggregation** | Automatic indexing for aggregation queries | `SUM(sales) GROUP BY region` queries |
| [**Full-Text Index**](03-fulltext-index.md) | **Text Search** | Automatic indexing for text search queries | `WHERE MATCH(content, 'keyword')` searches |
| [**Ngram Index**](ngram-index.md) | **Pattern Matching** | Automatic indexing for wildcard LIKE queries | `WHERE name LIKE '%john%'` searches |

## Feature Availability

| Feature | Community | Enterprise | Cloud |
|---------|-----------|------------|-------|
| Cluster Key | ✅ | ✅ | ✅ |
| Query Result Cache | ✅ | ✅ | ✅ |
| Virtual Column | ❌ | ✅ | ✅ |
| Aggregating Index | ❌ | ✅ | ✅ |
| Full-Text Index | ❌ | ✅ | ✅ |
| Ngram Index | ❌ | ✅ | ✅ |
