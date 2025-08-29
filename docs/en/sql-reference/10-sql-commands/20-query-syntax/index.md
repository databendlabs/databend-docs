---
title: Query Syntax
---

This page provides reference information for the query syntax in Databend. Each component can be used individually or combined to build powerful queries.

## Core Query Components

| Component | Description |
|-----------|-------------|
| **[SELECT](query-select)** | Retrieve data from tables - the foundation of all queries |
| **[FROM / JOIN](query-join)** | Specify data sources and combine multiple tables |
| **[WHERE](query-select#where-clause)** | Filter rows based on conditions |
| **[GROUP BY](query-group-by)** | Group rows and perform aggregations (SUM, COUNT, AVG, etc.) |
| **[HAVING](query-group-by#having-clause)** | Filter grouped results |
| **[ORDER BY](query-select#order-by-clause)** | Sort query results |
| **[LIMIT / TOP](top)** | Restrict the number of rows returned |

## Advanced Features

| Component | Description |
|-----------|-------------|
| **[WITH (CTE)](with-clause)** | Define reusable query blocks for complex logic |
| **[PIVOT](query-pivot)** | Convert rows to columns (wide format) |
| **[UNPIVOT](query-unpivot)** | Convert columns to rows (long format) |
| **[QUALIFY](qualify)** | Filter rows after window function calculations |
| **[VALUES](values)** | Create inline temporary data sets |

## Time Travel & Streaming

| Component | Description |
|-----------|-------------|
| **[AT](query-at)** | Query data at a specific point in time |
| **[CHANGES](changes)** | Track insertions, updates, and deletions |
| **[WITH CONSUME](with-consume)** | Process streaming data with offset management |
| **[WITH STREAM HINTS](with-stream-hints)** | Optimize stream processing behavior |

## Query Execution

| Component | Description |
|-----------|-------------|
| **[Settings](settings)** | Configure query optimization and execution parameters |

## Query Structure

A typical Databend query follows this structure:

```sql
[WITH cte_expressions]
SELECT [TOP n] columns
FROM table
[JOIN other_tables]
[WHERE conditions]
[GROUP BY columns]
[HAVING group_conditions]
[QUALIFY window_conditions]
[ORDER BY columns]
[LIMIT n]
```