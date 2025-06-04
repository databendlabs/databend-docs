---
title: SQL Function Reference
---

This page provides a comprehensive reference for all system-defined functions available in Databend. Each function category includes links to detailed documentation with syntax, examples, and usage guidelines.

## Data Type Functions

| Category | Description | Common Use Cases |
|----------|-------------|------------------|
| [Array Functions](./00-array-functions/index.md) | Functions for creating, manipulating, and querying array data | Data transformation, multi-value analysis, batch operations |
| [Map Functions](./10-map-functions/index.md) | Functions for working with key-value pair collections | Attribute-value processing, nested data structures |
| [String Functions](./06-string-functions/index.md) | Text manipulation and pattern matching operations | Text processing, data cleaning, formatting |
| [Numeric Functions](./04-numeric-functions/index.md) | Mathematical operations and numeric calculations | Statistical analysis, financial calculations |
| [Date & Time Functions](./05-datetime-functions/index.md) | Date and time manipulation and formatting | Time series analysis, event scheduling, reporting |
| [Interval Functions](./05-interval-functions/index.md) | Time interval creation and manipulation | Date arithmetic, duration calculations |
| [Semi-structured Functions](./10-semi-structured-functions/index.md) | JSON and other semi-structured data processing | API data integration, flexible schema handling |

## Analytical Functions

| Category | Description | Common Use Cases |
|----------|-------------|------------------|
| [Aggregate Functions](./07-aggregate-functions/index.md) | Functions that perform calculations across rows | Summary statistics, data reduction, reporting |
| [Window Functions](./08-window-functions/index.md) | Functions that operate on a window of rows | Ranking, moving averages, cumulative sums |

## AI and Vector Functions

| Category | Description | Common Use Cases |
|----------|-------------|------------------|
| [AI Functions](./11-ai-functions/index.md) | Natural language processing and AI capabilities | Text generation, language translation, content analysis |
| [Vector Distance Functions](./11-vector-distance-functions/index.md) | Vector similarity calculations | Semantic search, recommendation systems, clustering |

## Geospatial Functions

| Category | Description | Common Use Cases |
|----------|-------------|------------------|
| [Geo Functions](./09-geo-functions/index.md) | Geographic coordinate and region operations | Location-based analysis, mapping, territory management |
| [Geometry Functions](./09-geometry-functions/index.md) | Geometric shape operations and calculations | Spatial analysis, distance calculations, area computations |

## Data Processing Functions

| Category | Description | Common Use Cases |
|----------|-------------|------------------|
| [Conversion Functions](./02-conversion-functions/index.md) | Type conversion and casting operations | Data integration, format standardization |
| [Conditional Functions](./03-conditional-functions/index.md) | Logic-based data transformation | Business rule implementation, data classification |
| [Bitmap Functions](./01-bitmap-functions/index.md) | Bit-level operations and manipulations | Efficient set operations, feature flags, permissions |
| [Search Functions](./10-search-functions/index.md) | Full-text search capabilities | Document retrieval, content search, relevance ranking |

## System and Utility Functions

| Category | Description | Common Use Cases |
|----------|-------------|------------------|
| [System Functions](./16-system-functions/index.md) | System information and management | Storage analysis, performance monitoring |
| [Table Functions](./17-table-functions/index.md) | Functions that return result sets as tables | Data exploration, metadata analysis |
| [Context Functions](./15-context-functions/index.md) | Current session and environment information | Auditing, dynamic SQL, user context |
| [Hash Functions](./12-hash-functions/index.md) | Data hashing and fingerprinting | Data integrity, anonymization, partitioning |
| [UUID Functions](./13-uuid-functions/index.md) | Universally unique identifier generation | Primary key generation, distributed systems |
| [IP Address Functions](./14-ip-address-functions/index.md) | IP address manipulation and conversion | Network analysis, geolocation, security |

## Other Specialized Functions

| Category | Description | Common Use Cases |
|----------|-------------|------------------|
| [Dictionary Functions](./19-dictionary-functions/index.md) | External data source integration | Real-time lookups, reference data access |
| [Sequence Functions](./18-sequence-functions/index.md) | Sequence generation and manipulation | Auto-incrementing values, ordered data |
| [Test Functions](./19-test-functions/index.md) | Functions for testing purposes | Query timing, performance testing |
| [Other Functions](./20-other-functions/index.md) | Additional utility functions | Type handling, formatting, miscellaneous operations |
