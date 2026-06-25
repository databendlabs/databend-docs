---
title: SQL Function Reference
---

Databend provides comprehensive SQL functions for all types of data processing. Functions are organized by importance and usage frequency.

:::tip Can't find the function you need?
If none of the built-in functions below cover your logic, you can define your own with [User-Defined Functions (UDFs)](../10-sql-commands/00-ddl/10-udf/index.md). UDFs let you implement custom scalar, aggregate, and table functions using SQL expressions, Python, or JavaScript, then call them just like any built-in function. See [Extending with User-Defined Functions](#extending-with-user-defined-functions) below.
:::

## Core Data Functions

| Category                                                     | Description                              |
| ------------------------------------------------------------ | ---------------------------------------- |
| [Numeric Functions](./04-numeric-functions/index.md)         | Mathematical operations and calculations |
| [String Functions](./06-string-functions/index.md)           | Text manipulation and string processing  |
| [Date & Time Functions](./05-datetime-functions/index.md)    | Date, time, and temporal operations      |
| [Conversion Functions](./02-conversion-functions/index.md)   | Type casting and data format conversions |
| [Conditional Functions](./03-conditional-functions/index.md) | Logic and control flow operations        |

## Analytics Functions

| Category                                                 | Description                                   |
| -------------------------------------------------------- | --------------------------------------------- |
| [Aggregate Functions](./07-aggregate-functions/index.md) | Statistical calculations across multiple rows |
| [Window Functions](./08-window-functions/index.md)       | Advanced analytics with window operations     |

## Structured & Semi-Structured Data

| Category                                                                          | Description                                       |
| --------------------------------------------------------------------------------- | ------------------------------------------------- |
| [Structured & Semi-Structured Functions](./10-semi-structured-functions/index.md) | JSON, arrays, objects, and nested data processing |

## Search Functions

| Category                                                     | Description                            |
| ------------------------------------------------------------ | -------------------------------------- |
| [Full-Text Search Functions](./10-search-functions/index.md) | Full-text search and relevance scoring |

## Vector Functions

| Category                                           | Description                                 |
| -------------------------------------------------- | ------------------------------------------- |
| [Vector Functions](./11-vector-functions/index.md) | Vector similarity and distance calculations |

## Geospatial Functions

| Category                                                   | Description                                  |
| ---------------------------------------------------------- | -------------------------------------------- |
| [Geospatial Functions](./09-geospatial-functions/index.md) | Geometry, GeoHash, and H3 spatial operations |

## Data Management

| Category                                             | Description                                              |
| ---------------------------------------------------- | -------------------------------------------------------- |
| [Table Functions](./17-table-functions/index.md)     | File inspection, data generation, and system information |
| [System Functions](./16-system-functions/index.md)   | System information and management operations             |
| [Context Functions](./15-context-functions/index.md) | Current session, user, and database information          |

## Security & Integrity

| Category                                                   | Description                                      |
| ---------------------------------------------------------- | ------------------------------------------------ |
| [Hash Functions](./12-hash-functions/index.md)             | Data hashing and integrity verification          |
| [Bitmap Functions](./01-bitmap-functions/index.md)         | High-performance bitmap operations and analytics |
| [UUID Functions](./13-uuid-functions/index.md)             | Universally unique identifier generation         |
| [IP Address Functions](./14-ip-address-functions/index.md) | Network address manipulation and validation      |

## Utility Functions

| Category                                                                   | Description                                 |
| -------------------------------------------------------------------------- | ------------------------------------------- |
| [Interval Functions](./05-interval-functions/index.md)                     | Time unit conversion and interval creation  |
| [Sequence Functions](./18-sequence-functions/index.md)                     | Auto-incrementing sequence value generation |
| [Data Anonymization Functions](./19-data-anonymization-functions/index.md) | Data masking and anonymization utilities    |
| [Test Functions](./19-test-functions/index.md)                             | Testing and debugging utilities             |
| [Other Functions](./20-other-functions/index.md)                           | Miscellaneous helpers and utilities         |

## Extending with User-Defined Functions

When the built-in functions above don't cover your specific logic, define your own with [User-Defined Functions (UDFs)](../10-sql-commands/00-ddl/10-udf/index.md). Once created, a UDF is called exactly like a built-in function in your queries.

| Function Type                                                                                 | Use It When                                                                  |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [Scalar Function (SQL)](../10-sql-commands/00-ddl/10-udf/ddl-create-function.md)              | You want to reuse a SQL expression across queries (math, string formatting). |
| [Scalar Function (Python/JavaScript)](../10-sql-commands/00-ddl/10-udf/ddl-create-function.md) | Your logic needs control flow, external libraries, or advanced algorithms.   |
| [Aggregate Function](../10-sql-commands/00-ddl/10-udf/ddl-create-aggregate-function.md)       | You need a custom aggregation that built-in aggregates can't express.        |
| [Table Function](../10-sql-commands/00-ddl/10-udf/ddl-create-table-function.md)               | You want a reusable, parameterized query that returns a result set.          |

For a full comparison of UDF types and syntax, see [User-Defined Function](../10-sql-commands/00-ddl/10-udf/index.md).
