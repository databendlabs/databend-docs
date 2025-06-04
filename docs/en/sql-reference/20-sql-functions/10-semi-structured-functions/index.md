---
title: Semi-Structured Functions
---

This section provides reference information for the semi-structured data functions in Databend. These functions allow you to work with JSON and other semi-structured data formats efficiently.

## Parsing and Validation

| Function | Description | Example |
|----------|-------------|--------|
| [PARSE_JSON](parse-json) | Parses a JSON string into a variant value | `PARSE_JSON('{"name":"Databend"}')` |
| [CHECK_JSON](check-json) | Validates if a string is valid JSON | `CHECK_JSON('{"name":"Databend"}')` → `true` |

## Object Access and Extraction

| Function | Description | Example |
|----------|-------------|--------|
| [GET](get) | Gets a value from a JSON object by key | `GET(parse_json('{"name":"Databend"}'), 'name')` → `'Databend'` |
| [GET_PATH](get-path) | Gets a value from a JSON object by path | `GET_PATH(parse_json('{"user":{"name":"Databend"}}'), 'user.name')` → `'Databend'` |
| [GET_IGNORE_CASE](get-ignore-case) | Gets a value with case-insensitive key matching | `GET_IGNORE_CASE(parse_json('{"Name":"Databend"}'), 'name')` → `'Databend'` |
| [OBJECT_KEYS](object-keys) | Returns keys of a JSON object | `OBJECT_KEYS(parse_json('{"a":1,"b":2}'))` → `['a', 'b']` |
| [JSON_OBJECT_KEYS](json-object-keys) | Returns keys of a JSON object as an array | `JSON_OBJECT_KEYS(parse_json('{"a":1,"b":2}'))` → `['a', 'b']` |

## Type Inspection and Conversion

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

## JSON Object Operations

| Function | Description | Example |
|----------|-------------|--------|
| [JSON_OBJECT](json-object) | Creates a JSON object from key-value pairs | `JSON_OBJECT('name', 'Databend', 'version', '1.0')` → `'{"name":"Databend","version":"1.0"}'` |
| [JSON_OBJECT_INSERT](json-object-insert) | Inserts a value into a JSON object | `JSON_OBJECT_INSERT(parse_json('{"a":1}'), 'b', 2)` → `'{"a":1,"b":2}'` |
| [JSON_OBJECT_DELETE](json-object-delete) | Deletes a key from a JSON object | `JSON_OBJECT_DELETE(parse_json('{"a":1,"b":2}'), 'b')` → `'{"a":1}'` |
| [JSON_OBJECT_PICK](json-object-pick) | Creates a new object with selected keys | `JSON_OBJECT_PICK(parse_json('{"a":1,"b":2,"c":3}'), 'a', 'c')` → `'{"a":1,"c":3}'` |
| [JSON_STRIP_NULLS](json-strip-nulls) | Removes null values from a JSON object | `JSON_STRIP_NULLS(parse_json('{"a":1,"b":null}'))` → `'{"a":1}'` |
| [JSON_OBJECT_KEEP_NULL](json-object-keep-null) | Creates a JSON object preserving null values | `JSON_OBJECT_KEEP_NULL('a', 1, 'b', NULL)` → `'{"a":1,"b":null}'` |

## JSON Array Operations

| Function | Description | Example |
|----------|-------------|--------|
| [JSON_ARRAY](json-array) | Creates a JSON array from input values | `JSON_ARRAY(1, 'text', true)` → `'[1,"text",true]'` |
| [JSON_ARRAY_INSERT](json-array-insert) | Inserts a value into a JSON array | `JSON_ARRAY_INSERT(parse_json('[1,3]'), 1, 2)` → `'[1,2,3]'` |
| [JSON_ARRAY_DISTINCT](json-array-distinct) | Returns an array with distinct elements | `JSON_ARRAY_DISTINCT(parse_json('[1,2,1,3,2]'))` → `'[1,2,3]'` |
| [FLATTEN](flatten) | Flattens nested arrays into a single array | `FLATTEN(parse_json('[[1,2],[3,4]]'))` → `'[1,2,3,4]'` |

## Path Queries

| Function | Description | Example |
|----------|-------------|--------|
| [JSON_PATH_EXISTS](json-path-exists) | Checks if a JSON path exists | `JSON_PATH_EXISTS(parse_json('{"a":{"b":1}}'), '$.a.b')` → `true` |
| [JSON_PATH_QUERY](json-path-query) | Queries JSON data using a path expression | `JSON_PATH_QUERY(parse_json('{"a":[1,2,3]}'), '$.a[*]')` → `[1,2,3]` |
| [JSON_PATH_QUERY_FIRST](json-path-query-first) | Returns the first match from a path query | `JSON_PATH_QUERY_FIRST(parse_json('{"a":[1,2,3]}'), '$.a[*]')` → `1` |
| [JSON_PATH_QUERY_ARRAY](json-path-query-array) | Returns query results as a JSON array | `JSON_PATH_QUERY_ARRAY(parse_json('{"a":[1,2,3]}'), '$.a[*]')` → `'[1,2,3]'` |
| [JSON_EXTRACT_PATH_TEXT](json-extract-path-text) | Extracts text from a JSON path | `JSON_EXTRACT_PATH_TEXT(parse_json('{"a":{"b":"text"}}'), 'a', 'b')` → `'text'` |
| [JSON_PATH_MATCH](json-path-match) | Matches JSON data against a path expression | `JSON_PATH_MATCH(parse_json('{"a":1}'), '$.a == 1')` → `true` |
| [JQ](jq) | Provides jq-like JSON processing capabilities | `JQ(parse_json('{"a":{"b":1}}'), '.a.b')` → `1` |

## Array Transformations

| Function | Description | Example |
|----------|-------------|--------|
| [JSON_ARRAY_MAP](json-array-map) | Maps a function over array elements | `JSON_ARRAY_MAP(parse_json('[1,2,3]'), x -> x * 2)` → `'[2,4,6]'` |
| [JSON_ARRAY_FILTER](json-array-filter) | Filters array elements using a condition | `JSON_ARRAY_FILTER(parse_json('[1,2,3,4]'), x -> x > 2)` → `'[3,4]'` |
| [JSON_ARRAY_TRANSFORM](json-array-transform) | Transforms array elements using an expression | `JSON_ARRAY_TRANSFORM(parse_json('[{"a":1},{"a":2}]'), x -> x.a)` → `'[1,2]'` |
| [JSON_ARRAY_APPLY](json-array-apply) | Applies a function to each array element | `JSON_ARRAY_APPLY(parse_json('[1,2,3]'), x -> x * x)` → `'[1,4,9]'` |
| [JSON_ARRAY_REDUCE](json-array-reduce) | Reduces an array to a single value | `JSON_ARRAY_REDUCE(parse_json('[1,2,3]'), 0, (acc, x) -> acc + x)` → `6` |

## Set Operations

| Function | Description | Example |
|----------|-------------|--------|
| [JSON_ARRAY_INTERSECTION](json-array-intersection) | Returns common elements between arrays | `JSON_ARRAY_INTERSECTION(parse_json('[1,2,3]'), parse_json('[2,3,4]'))` → `'[2,3]'` |
| [JSON_ARRAY_EXCEPT](json-array-except) | Returns elements in first array but not in second | `JSON_ARRAY_EXCEPT(parse_json('[1,2,3]'), parse_json('[2,3,4]'))` → `'[1]'` |
| [JSON_ARRAY_OVERLAP](json-array-overlap) | Checks if arrays have common elements | `JSON_ARRAY_OVERLAP(parse_json('[1,2,3]'), parse_json('[3,4,5]'))` → `true` |

## Object Transformations

| Function | Description | Example |
|----------|-------------|--------|
| [JSON_MAP_FILTER](json-map-filter) | Filters key-value pairs in a JSON object | `JSON_MAP_FILTER(parse_json('{"a":1,"b":2}'), (k,v) -> v > 1)` → `'{"b":2}'` |
| [JSON_MAP_TRANSFORM_KEYS](json-map-transform-keys) | Transforms keys in a JSON object | `JSON_MAP_TRANSFORM_KEYS(parse_json('{"a":1,"b":2}'), k -> UPPER(k))` → `'{"A":1,"B":2}'` |
| [JSON_MAP_TRANSFORM_VALUES](json-map-transform-values) | Transforms values in a JSON object | `JSON_MAP_TRANSFORM_VALUES(parse_json('{"a":1,"b":2}'), v -> v * 10)` → `'{"a":10,"b":20}'` |

## Expansion and Formatting

| Function | Description | Example |
|----------|-------------|--------|
| [JSON_ARRAY_ELEMENTS](json-array-elements) | Expands a JSON array to a set of rows | `SELECT * FROM JSON_ARRAY_ELEMENTS(parse_json('[1,2,3]'))` → `3 rows with values 1, 2, 3` |
| [JSON_EACH](json-each) | Expands the outermost JSON object into key-value pairs | `SELECT * FROM JSON_EACH(parse_json('{"a":1,"b":2}'))` → `2 rows with key-value pairs` |
| [JSON_PRETTY](json-pretty) | Formats JSON with indentation for readability | `JSON_PRETTY(parse_json('{"a":1,"b":2}'))` → `'{\n  "a": 1,\n  "b": 2\n}'` |
