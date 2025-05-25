---
title: Query Data in Databend
---

Databend supports standard SQL with ANSI SQL:1999 and SQL:2003 analytic extensions. This section covers query techniques, optimization tools, and advanced features for efficient data processing.

## Core Query Features

| Feature | Description | Key Benefits |
|---------|-------------|--------------|
| [**Common Table Expressions (CTE)**](00-cte.md) | Define named temporary result sets with WITH clause | Improved query readability, reusable subqueries |
| [**JOIN**](02-join.md) | Combine data from multiple tables | Support for Inner, Outer, Cross, Semi, and Anti joins |
| [**GROUP BY Operations**](01-groupby/index.md) | Group and aggregate data with extensions | CUBE, ROLLUP, and GROUPING SETS support |
| [**Sequence**](02-sequences.md) | Generate sequential numeric values | Auto-incrementing identifiers and counters |

## Advanced Query Capabilities

| Feature | Type | Description | Use Cases |
|---------|------|-------------|-----------|
| [**User-Defined Functions**](03-udf.md) | Lambda & Embedded | Custom operations with Python, JavaScript, WebAssembly | Complex data transformations, custom business logic |
| [**External Functions**](04-external-function.md) | Cloud Feature | Custom operations using external servers | Scalable processing, external library integration |
| [**Dictionary**](07-dictionary.md) | Data Integration | In-memory key-value store for external data | Fast lookups from MySQL, Redis sources |
| [**Stored Procedures**](08-stored-procedure.md) | SQL Scripting | Reusable command sets with control flow | Multi-step operations, complex business logic |

## Query Optimization & Analysis

| Tool | Purpose | Access Method | Key Features |
|------|---------|---------------|--------------|
| [**Query Profile**](05-query-profile.md) | Performance analysis | Databend Cloud Monitor | Visual execution plan, performance metrics |
| [**Query Hash**](06-query-hash.md) | Query identification | SQL functions | Unique query fingerprinting, performance tracking |

## GROUP BY Extensions

| Extension | Description | Best For |
|-----------|-------------|----------|
| [**CUBE**](01-groupby/group-by-cube.md) | All possible combinations of grouping columns | Multi-dimensional analysis |
| [**ROLLUP**](01-groupby/group-by-rollup.md) | Hierarchical subtotals and grand totals | Hierarchical reporting |
| [**GROUPING SETS**](01-groupby/group-by-grouping-sets.md) | Custom grouping combinations | Flexible aggregation scenarios |

## Quick Start Guide

1. **Basic Queries**: Start with [JOINs](02-join.md) and [GROUP BY](01-groupby/index.md) for fundamental data operations
2. **Advanced Logic**: Use [CTEs](00-cte.md) for complex query structures
3. **Custom Functions**: Implement [UDFs](03-udf.md) for specialized data processing
4. **Performance**: Leverage [Query Profile](05-query-profile.md) for optimization insights
5. **External Data**: Integrate external sources with [Dictionary](07-dictionary.md)

---
