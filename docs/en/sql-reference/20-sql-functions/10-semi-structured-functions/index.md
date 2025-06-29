---
title: Semi-Structured Functions
---

Semi-structured functions in Databend enable efficient processing of JSON and other semi-structured data formats. These functions provide comprehensive capabilities for parsing, querying, transforming, and manipulating JSON data.

## JSON Parsing & Validation

| Function | Description | Example |
|----------|-------------|--------|
| [PARSE_JSON](parse-json) | Parses a JSON string into a variant value | `PARSE_JSON('{"name":"Databend"}')` |
| [CHECK_JSON](check-json) | Validates if a string is valid JSON | `CHECK_JSON('{"name":"Databend"}')` → `true` |

## Type Checking & Conversion

| Function | Description | Example |
|----------|-------------|--------|
| [JSON_TYPEOF](json-typeof) | Returns the type of a JSON value | `JSON_TYPEOF(parse_json('123'))` → `'number'` |
| [AS_TYPE](as-type) | Converts a JSON value to a specified SQL type | `AS_TYPE(parse_json('123'), 'INT')` → `123` |
| [JSON_TO_STRING](json-to-string) | Converts a JSON value to a string | `JSON_TO_STRING(parse_json('{"a":1}'))` → `'{"a":1}'` |
| [IS_OBJECT](is-object) | Checks if a JSON value is an object | `IS_OBJECT(parse_json('{"a":1}'))` → `true` |
| [IS_ARRAY](is-array) | Checks if a JSON value is an array | `IS_ARRAY(parse_json('[1,2,3]'))` → `true` |
| [IS_STRING](is-string) | Checks if a JSON value is a string | `IS_STRING(parse_json('"hello"'))` → `true` |
| [IS_INTEGER](is-integer) | Checks if a JSON value is an integer | `IS_INTEGER(parse_json('123'))` → `true` |
| [IS_FLOAT](is-float) | Checks if a JSON value is a floating-point number | `IS_FLOAT(parse_json('123.45'))` → `true` |
| [IS_BOOLEAN](is-boolean) | Checks if a JSON value is a boolean | `IS_BOOLEAN(parse_json('true'))` → `true` |
| [IS_NULL_VALUE](is-null-value) | Checks if a JSON value is null | `IS_NULL_VALUE(parse_json('null'))` → `true` |

## Data Access & Extraction

| Function | Description | Example |
|----------|-------------|--------|
| [GET](get) | Gets a value from a JSON object by key | `GET(parse_json('{"name":"Databend"}'), 'name')` → `'Databend'` |
| [GET_PATH](get-path) | Gets a value from a JSON object by path | `GET_PATH(parse_json('{"user":{"name":"Databend"}}'), 'user.name')` → `'Databend'` |
| [GET_IGNORE_CASE](get-ignore-case) | Gets a value with case-insensitive key matching | `GET_IGNORE_CASE(parse_json('{"Name":"Databend"}'), 'name')` → `'Databend'` |
| [OBJECT_KEYS](object-keys) | Returns all keys of a JSON object | `OBJECT_KEYS(parse_json('{"a":1,"b":2}'))` → `['a', 'b']` |

## Object Construction & Manipulation

| Function | Description | Example |
|----------|-------------|--------|
| [OBJECT_CONSTRUCT](object-construct) | Creates a JSON object from key-value pairs | `OBJECT_CONSTRUCT('name', 'Databend')` → `'{"name":"Databend"}'` |
| [OBJECT_CONSTRUCT_KEEP_NULL](object-construct-keep-null) | Creates a JSON object preserving null values | `OBJECT_CONSTRUCT_KEEP_NULL('a', 1, 'b', NULL)` → `'{"a":1,"b":null}'` |
| [OBJECT_INSERT](object-insert) | Inserts a key-value pair into a JSON object | `OBJECT_INSERT(parse_json('{"a":1}'), 'b', 2)` → `'{"a":1,"b":2}'` |
| [OBJECT_DELETE](object-delete) | Deletes a key from a JSON object | `OBJECT_DELETE(parse_json('{"a":1,"b":2}'), 'b')` → `'{"a":1}'` |
| [OBJECT_PICK](object-pick) | Creates a new object with selected keys | `OBJECT_PICK(parse_json('{"a":1,"b":2,"c":3}'), 'a', 'c')` → `'{"a":1,"c":3}'` |
| [STRIP_NULL_VALUE](strip-null-value) | Removes null values from a JSON object | `STRIP_NULL_VALUE(parse_json('{"a":1,"b":null}'))` → `'{"a":1}'` |

## Object Transformations

| Function | Description | Example |
|----------|-------------|--------|
| [MAP_FILTER](map-filter) | Filters key-value pairs using a lambda expression | `MAP_FILTER(parse_json('{"a":1,"b":2}'), (k,v) -> v > 1)` → `'{"b":2}'` |
| [MAP_TRANSFORM_KEYS](map-transform-keys) | Transforms keys using a lambda expression | `MAP_TRANSFORM_KEYS(parse_json('{"a":1}'), k -> UPPER(k))` → `'{"A":1}'` |
| [MAP_TRANSFORM_VALUES](map-transform-values) | Transforms values using a lambda expression | `MAP_TRANSFORM_VALUES(parse_json('{"a":1}'), v -> v * 10)` → `'{"a":10}'` |

## Array Construction & Operations

| Function | Description | Example |
|----------|-------------|--------|
| [ARRAY_CONSTRUCT](array-construct) | Creates a JSON array from input values | `ARRAY_CONSTRUCT(1, 'text', true)` → `'[1,"text",true]'` |
| [ARRAY_INSERT](array-insert) | Inserts a value into a JSON array | `ARRAY_INSERT([1,3]::VARIANT, 1, 2::VARIANT)` → `[1,2,3]` |
| [ARRAY_DISTINCT](array-distinct) | Returns an array with distinct elements | `ARRAY_DISTINCT([1,2,1,3,2])` → `[1,2,3]` |
| [ARRAY_FLATTEN](array-flatten) | Flattens nested arrays into a single array | `ARRAY_FLATTEN([[1,2],[3,4]])` → `[1,2,3,4]` |
| [ARRAY_INTERSECTION](array-intersection) | Returns common elements between arrays | `ARRAY_INTERSECTION([1,2,3], [2,3,4])` → `[2,3]` |
| [ARRAY_EXCEPT](array-except) | Returns elements in first array but not in second | `ARRAY_EXCEPT([1,2,3], [2,3,4])` → `[1]` |
| [ARRAY_OVERLAP](array-overlap) | Checks if arrays have common elements | `ARRAY_OVERLAP([1,2,3], [3,4,5])` → `true` |

## Array Transformations

| Function | Description | Example |
|----------|-------------|--------|
| [ARRAY_FILTER](array-filter) | Filters array elements using a lambda expression | `ARRAY_FILTER([1,2,3,4], x -> x > 2)` → `[3,4]` |
| [ARRAY_TRANSFORM](array-transform) | Transforms array elements using a lambda expression | `ARRAY_TRANSFORM([1,2,3], x -> x * 2)` → `[2,4,6]` |
| [ARRAY_REDUCE](array-reduce) | Reduces an array to a single value using a lambda expression | `ARRAY_REDUCE([1,2,3], 0, (acc, x) -> acc + x)` → `6` |

## JSONPath & Advanced Queries

| Function | Description | Example |
|----------|-------------|--------|
| [JSON_PATH_EXISTS](json-path-exists) | Checks if a JSON path exists | `JSON_PATH_EXISTS(parse_json('{"a":{"b":1}}'), '$.a.b')` → `true` |
| [JSON_PATH_QUERY](json-path-query) | Queries JSON data using a path expression | `JSON_PATH_QUERY(parse_json('{"a":[1,2,3]}'), '$.a[*]')` → `[1,2,3]` |
| [JSON_PATH_QUERY_FIRST](json-path-query-first) | Returns the first match from a path query | `JSON_PATH_QUERY_FIRST(parse_json('{"a":[1,2,3]}'), '$.a[*]')` → `1` |
| [JSON_PATH_QUERY_ARRAY](json-path-query-array) | Returns query results as a JSON array | `JSON_PATH_QUERY_ARRAY(parse_json('{"a":[1,2,3]}'), '$.a[*]')` → `'[1,2,3]'` |
| [JSON_EXTRACT_PATH_TEXT](json-extract-path-text) | Extracts text from a JSON path | `JSON_EXTRACT_PATH_TEXT(parse_json('{"a":{"b":"text"}}'), 'a', 'b')` → `'text'` |
| [JSON_PATH_MATCH](json-path-match) | Matches JSON data against a path expression | `JSON_PATH_MATCH(parse_json('{"a":1}'), '$.a == 1')` → `true` |
| [JQ](jq) | Provides jq-like JSON processing capabilities | `JQ(parse_json('{"a":{"b":1}}'), '.a.b')` → `1` |

## Data Expansion & Formatting

| Function | Description | Example |
|----------|-------------|--------|
| [JSON_ARRAY_ELEMENTS](json-array-elements) | Expands a JSON array to a set of rows | `JSON_ARRAY_ELEMENTS(parse_json('[1,2,3]'))` |
| [JSON_EACH](json-each) | Expands a JSON object into key-value pairs | `JSON_EACH(parse_json('{"a":1,"b":2}'))` |
| [JSON_PRETTY](json-pretty) | Formats JSON with indentation for readability | `JSON_PRETTY(parse_json('{"a":1,"b":2}'))` |
