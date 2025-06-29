---
title: "How Databend JSON (Variant) Works"
sidebar_label: "How Databend JSON Works"
---

See also:

- [Variant Data Type](/sql/sql-reference/data-types/variant)
- [Semi-Structured Functions](/sql/sql-functions/semi-structured-functions/)

## Core Concepts

Databend's Variant type is a flexible data type designed to handle semi-structured data like JSON. It provides Snowflake-compatible syntax and functions while delivering high performance through an efficient storage format and optimized access mechanisms. Most Variant-related functions in Databend are directly compatible with their Snowflake counterparts, making migration seamless for users familiar with Snowflake's JSON handling capabilities.

```
┌─────────────────────────────────────────────────────────────────┐
│ Variant Type Core Components                                    │
├─────────────────┬───────────────────────────────────────────────┤
│ Storage Format  │ JSONB-based binary storage                    │
│ Virtual Columns │ Automatic extraction of JSON paths            │
│ Access Methods  │ Multiple syntax options for path navigation   │
│ Functions       │ Rich set of JSON manipulation functions       │
└─────────────────┴───────────────────────────────────────────────┘
```

## Writing Variant Data

```
┌─────────────────────────────────────────────────────────────────┐
│                     Variant Write Process                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  JSON Input:                                                    │
│  {                                                              │
│    "customer_id": 123,                                          │
│    "order_id": 1001,                                            │
│    "items": [                                                   │
│      {"name": "Shoes", "price": 59.99},                         │
│      {"name": "T-shirt", "price": 19.99}                        │
│    ]                                                            │
│  }                                                              │
│                                                                 │
│         ▼                                                       │
│                                                                 │
│  JSONB Encoding:                                                │
│  [Binary format with type information and optimized structure]  │
│                                                                 │
│         ▼                                                       │
│                                                                 │
│  Virtual Column Extraction:                                     │
│  - ['customer_id'] → Int64 column                               │
│  - ['order_id'] → Int64 column                                  │
│  - ['items'][0]['name'] → String column                         │
│  - ['items'][0]['price'] → Float64 column                       │
│  - ['items'][1]['name'] → String column                         │
│  - ['items'][1]['price'] → Float64 column                       │
│                                                                 │
│         ▼                                                       │
│                                                                 │
│  Storage:                                                       │
│  - Main JSONB column (complete document)                        │
│  - Virtual columns (extracted paths)                            │
│  - Metadata updates                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### JSONB Storage Format

Databend uses the [JSONB binary format](https://github.com/databendlabs/jsonb) for efficient storage of JSON data. This custom format provides:

- **Type Preservation**: Maintains data types (numbers, strings, booleans)
- **Structure Optimization**: Preserves nested structures with efficient indexing
- **Space Efficiency**: More compact than text JSON
- **Direct Binary Operations**: Enables operations without full parsing

The [databendlabs/jsonb](https://github.com/databendlabs/jsonb) library implements this binary format, providing high-performance JSON operations with minimal overhead.

### Virtual Column Generation

During data ingestion, Databend automatically analyzes the JSON structure and creates virtual columns:

```
┌─────────────────────────────────────────────────────────────────┐
│                 Virtual Column Process                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Nested JSON:                                                   │
│  {                                                              │
│    "user": {                                                    │
│      "id": 123,                                                 │
│      "profile": {                                               │
│        "name": "Alice",                                         │
│        "email": "alice@example.com"                             │
│      },                                                         │
│      "orders": [                                                │
│        {"id": 1001, "total": 79.98},                            │
│        {"id": 1002, "total": 129.99}                            │
│      ]                                                          │
│    }                                                            │
│  }                                                              │
│                                                                 │
│         ▼                                                       │
│                                                                 │
│  Path Extraction:                                               │
│  ┌─────────────────────────┬─────────────────┐                  │
│  │ JSON Path               │ Inferred Type   │                  │
│  ├─────────────────────────┼─────────────────┤                  │
│  │ ['user']['id']          │ Int64           │                  │
│  │ ['user']['profile']['name'] │ String      │                  │
│  │ ['user']['profile']['email'] │ String     │                  │
│  │ ['user']['orders'][0]['id'] │ Int64       │                  │
│  │ ['user']['orders'][0]['total'] │ Float64  │                  │
│  │ ['user']['orders'][1]['id'] │ Int64       │                  │
│  │ ['user']['orders'][1]['total'] │ Float64  │                  │
│  └─────────────────────────┴─────────────────┘                  │
│                                                                 │
│         ▼                                                       │
│                                                                 │
│  Virtual Columns Created                                        │
│  [Each path becomes a separate column with native type]         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Reading Variant Data

```
┌─────────────────────────────────────────────────────────────────┐
│                     Variant Read Process                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SQL Query:                                                     │
│  SELECT data['user']['profile']['name'],                        │
│         data['user']['orders'][0]['total']                      │
│  FROM customer_data                                             │
│  WHERE data['user']['id'] = 123                                 │
│                                                                 │
│         ▼                                                       │
│                                                                 │
│  Path Analysis:                                                 │
│  ┌─────────────────────────┬─────────────────┐                  │
│  │ JSON Path               │ Virtual Column? │                  │
│  ├─────────────────────────┼─────────────────┤                  │
│  │ ['user']['id']          │ Yes (Int64)     │                  │
│  │ ['user']['profile']['name'] │ Yes (String) │                 │
│  │ ['user']['orders'][0]['total'] │ Yes (Float64) │             │
│  └─────────────────────────┴─────────────────┘                  │
│                                                                 │
│         ▼                                                       │
│                                                                 │
│  Optimized Execution:                                           │
│  1. Apply filter on ['user']['id'] virtual column               │
│  2. Read only required virtual columns:                         │
│     - ['user']['profile']['name']                               │
│     - ['user']['orders'][0]['total']                            │
│  3. Skip reading main JSONB column                              │
│  4. Return results directly from virtual columns                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Multiple Access Patterns

Databend supports multiple syntax options for accessing and manipulating JSON data, including Snowflake-compatible and PostgreSQL-compatible patterns:

```
┌─────────────────────────────────────────────────────────────────┐
│                 JSON Access Syntax Options                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Original JSON:                                                 │
│  {                                                              │
│    "user": {                                                    │
│      "profile": {                                               │
│        "name": "Alice",                                         │
│        "settings": {                                            │
│          "theme": "dark"                                        │
│        }                                                        │
│      }                                                          │
│    }                                                            │
│  }                                                              │
│                                                                 │
│  Snowflake-Compatible Access:                                   │
│  ┌──────────────────────────────────────────────────────┐       │
│  │ 1. Square Bracket Notation:                          │       │
│  │    data['user']['profile']['settings']['theme']      │       │
│  │                                                      │       │
│  │ 2. Colon Notation:                                   │       │
│  │    data:user:profile:settings:theme                  │       │
│  │                                                      │       │
│  │ 3. Mixed Notation with Dots:                         │       │
│  │    data['user']['profile'].settings.theme            │       │
│  │    data:user:profile.settings.theme                  │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                 │
│  PostgreSQL-Compatible Operators:                               │
│  ┌──────────────────────────────────────────────────────┐       │
│  │ 1. Arrow Operators:                                  │       │
│  │    data->'user'->'profile'->'settings'->'theme'      │       │
│  │    data->>'user'  (returns text instead of JSON)     │       │
│  │                                                      │       │
│  │ 2. Path Operators:                                   │       │
│  │    data#>'{user,profile,settings,theme}'             │       │
│  │    data#>>'{user,profile,settings,theme}'            │       │
│  │                                                      │       │
│  │ 3. Containment Operators:                            │       │
│  │    data @> '{"user":{"profile":{"name":"Alice"}}}'   │       │
│  │    data ? 'user'  (checks if key exists)             │       │
│  │                                                      │       │
│  │ 4. Modification Operators:                           │       │
│  │    data - 'user'  (removes key)                      │       │
│  │    data || '{"new_field":123}'  (concatenates)       │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

For more details on access syntax, see the [Variant documentation](/sql/sql-reference/data-types/variant#accessing-elements-in-json) and [JSON Operators documentation](/sql/sql-commands/query-operators/json).

### Rich Function Support

Databend provides a comprehensive set of functions for working with JSON data, organized by their purpose:

```
┌─────────────────────────────────────────────────────────────────┐
│                 JSON Function Categories                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Basic Operations:                                           │
│     • Parsing and Validation:                                   │
│       - PARSE_JSON, CHECK_JSON                                  │
│     • Object Access and Extraction:                             │
│       - GET, GET_PATH, GET_IGNORE_CASE, OBJECT_KEYS             │
│     • Type Inspection and Conversion:                           │
│       - JSON_TYPEOF, AS_TYPE, IS_ARRAY, IS_OBJECT, IS_STRING    │
│                                                                 │
│  2. Construction and Modification:                              │
│     • JSON Object Operations:                                   │
│       - OBJECT_CONSTRUCT, OBJECT_INSERT, OBJECT_DELETE          │
│     • JSON Array Operations:                                    │
│       - ARRAY_CONSTRUCT, ARRAY_INSERT, ARRAY_DISTINCT           │
│       - FLATTEN                                                 │
│                                                                 │
│  3. Advanced Query and Transformation:                          │
│     • Path Queries:                                             │
│       - JSON_PATH_EXISTS, JSON_PATH_QUERY, JSON_PATH_QUERY_ARRAY│
│       - JSON_EXTRACT_PATH_TEXT, JQ                              │
│     • Array Transformations:                                    │
│       - JSON_ARRAY_MAP, JSON_ARRAY_FILTER, JSON_ARRAY_TRANSFORM │
│       - JSON_ARRAY_APPLY, JSON_ARRAY_REDUCE                     │
│     • Set Operations:                                           │
│       - ARRAY_INTERSECTION, ARRAY_EXCEPT                        │
│       - ARRAY_OVERLAP                                           │
│     • Object Transformations:                                   │
│       - JSON_MAP_FILTER, JSON_MAP_TRANSFORM_KEYS/VALUES         │
│     • Expansion and Formatting:                                 │
│       - JSON_ARRAY_ELEMENTS, JSON_EACH, JSON_PRETTY             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

The full list of JSON functions is available in the [Semi-Structured Functions documentation](/sql/sql-functions/semi-structured-functions/).


## Performance Comparison

Databend's virtual column technology provides significant performance advantages:

```
┌─────────────────────────────────────────────────────────────────┐
│                 Performance Comparison                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Query: SELECT data['account_balance'],                         │
│         data['address']['city'], data['phone']                  │
│         FROM user_activity_logs                                 │
│                                                                 │
│  Without Virtual Columns:                                       │
│  - 3.763 seconds                                                │
│  - 11.90 GiB processed                                          │
│                                                                 │
│  With Virtual Columns:                                          │
│  - 1.316 seconds (3x faster)                                    │
│  - 461.34 MiB processed (26x less data)                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

For complex nested structures, the benefits are still substantial:

```
┌─────────────────────────────────────────────────────────────────┐
│  Query: SELECT data['purchase_history'],                        │
│         data['wishlist'], data['last_purchase']['item']         │
│         FROM user_activity_logs                                 │
│                                                                 │
│  Without Virtual Columns:                                       │
│  - 5.509 seconds                                                │
│  - 11.90 GiB processed                                          │
│                                                                 │
│  With Virtual Columns:                                          │
│  - 3.924 seconds (1.4x faster)                                  │
│  - 2.15 GiB processed (5.5x less data)                         │
└─────────────────────────────────────────────────────────────────┘
```

## Databend Advantages for Variant Data

Databend's Variant type delivers four key advantages:

1. **Snowflake Compatibility**
   - Compatible syntax and functions
   - Familiar access patterns: `data['field']`, `data:field`, `data.field`
   - Seamless migration path

2. **Superior Performance**
   - 3x faster query execution
   - 26x less data scanning
   - Automatic virtual columns for common paths

3. **Advanced JSON Capabilities**
   - Rich function set for complex operations
   - PostgreSQL-compatible path queries
   - Powerful array and object transformations

4. **Cost Efficiency**
   - Optimized JSONB binary storage
   - No schema definition required
   - Reduced storage and compute costs

Databend combines the familiarity of Snowflake with enhanced performance and cost efficiency, making it ideal for modern data analytics workloads.
