---
title: Structured & Semi-Structured Functions
---

Structured and semi-structured functions in Databend enable efficient processing of arrays, objects, maps, JSON, and other structured data formats. These functions provide comprehensive capabilities for creating, parsing, querying, transforming, and manipulating structured and semi-structured data.

## JSON Functions

| Function | Description | Example |
|----------|-------------|--------|
| [PARSE_JSON](0-json/parse-json) | Parses a JSON string into a variant value | `PARSE_JSON('[1,2,3]')` |
| [CHECK_JSON](0-json/check-json) | Validates if a string is valid JSON | `CHECK_JSON('{"a":1}')` |
| [JSON_TYPEOF](0-json/json-typeof) | Returns the type of a JSON value | `JSON_TYPEOF(PARSE_JSON('[1,2,3]'))` |
| [JSON_TO_STRING](0-json/json-to-string) | Converts a JSON value to a string | `JSON_TO_STRING(PARSE_JSON('{"a":1}'))` |
| [JSON_PATH_EXISTS](0-json/json-path-exists) | Checks if a JSON path exists | `JSON_PATH_EXISTS(json_obj, '$.name')` |
| [JSON_PATH_MATCH](0-json/json-path-match) | Matches JSON values against a path pattern | `JSON_PATH_MATCH(json_obj, '$.age')` |
| [JSON_PATH_QUERY](0-json/json-path-query) | Queries JSON data using JSONPath | `JSON_PATH_QUERY(json_obj, '$.items[*]')` |
| [JSON_PATH_QUERY_ARRAY](0-json/json-path-query-array) | Queries JSON data and returns results as an array | `JSON_PATH_QUERY_ARRAY(json_obj, '$.items')` |
| [JSON_PATH_QUERY_FIRST](0-json/json-path-query-first) | Returns the first result from a JSON path query | `JSON_PATH_QUERY_FIRST(json_obj, '$.items[*]')` |
| [JSON_EXTRACT_PATH_TEXT](0-json/json-extract-path-text) | Extracts text value from JSON using path | `JSON_EXTRACT_PATH_TEXT(json_obj, 'name')` |
| [GET](0-json/get) | Gets a value from a JSON object by key or array by index | `GET(PARSE_JSON('[1,2,3]'), 0)` |
| [GET_PATH](0-json/get-path) | Gets a value from a JSON object using a path expression | `GET_PATH(json_obj, 'user.name')` |
| [GET_IGNORE_CASE](0-json/get-ignore-case) | Gets a value with case-insensitive key matching | `GET_IGNORE_CASE(json_obj, 'NAME')` |
| [JSON_EACH](0-json/json-each) | Expands JSON object into key-value pairs | `JSON_EACH(PARSE_JSON('{"a":1,"b":2}'))` |
| [JSON_ARRAY_ELEMENTS](0-json/json-array-elements) | Expands JSON array into individual elements | `JSON_ARRAY_ELEMENTS(PARSE_JSON('[1,2,3]'))` |
| [JSON_PRETTY](0-json/json-pretty) | Formats JSON with proper indentation | `JSON_PRETTY(PARSE_JSON('{"a":1}'))` |
| [STRIP_NULL_VALUE](0-json/strip-null-value) | Removes null values from JSON | `STRIP_NULL_VALUE(PARSE_JSON('{"a":1,"b":null}'))` |

## Array Functions

| Function | Description | Example |
|----------|-------------|--------|
| [ARRAY_CONSTRUCT](1-array/array-construct) | Creates an array from individual values | `ARRAY_CONSTRUCT(1, 2, 3)` |
| [RANGE](1-array/range) | Generates an array of sequential numbers | `RANGE(1, 5)` |
| [GET](1-array/get) | Gets an element from an array by index | `GET(PARSE_JSON('[1,2,3]'), 0)` |
| [ARRAY_GET](1-array/array-get) | Alias for GET function | `ARRAY_GET([1,2,3], 1)` |
| [CONTAINS](1-array/contains) | Checks if an array contains a specific value | `CONTAINS([1,2,3], 2)` |
| [ARRAY_CONTAINS](1-array/array-contains) | Checks if an array contains a specific value | `ARRAY_CONTAINS([1,2,3], 2)` |
| [ARRAY_APPEND](1-array/array-append) | Appends an element to the end of an array | `ARRAY_APPEND([1,2], 3)` |
| [ARRAY_PREPEND](1-array/array-prepend) | Prepends an element to the beginning of an array | `ARRAY_PREPEND([2,3], 1)` |
| [ARRAY_INSERT](1-array/array-insert) | Inserts an element at a specific position | `ARRAY_INSERT([1,3], 1, 2)` |
| [ARRAY_REMOVE](1-array/array-remove) | Removes all occurrences of a specified element | `ARRAY_REMOVE([1,2,2,3], 2)` |
| [ARRAY_REMOVE_FIRST](1-array/array-remove-first) | Removes the first element from an array | `ARRAY_REMOVE_FIRST([1,2,3])` |
| [ARRAY_REMOVE_LAST](1-array/array-remove-last) | Removes the last element from an array | `ARRAY_REMOVE_LAST([1,2,3])` |
| [ARRAY_CONCAT](1-array/array-concat) | Concatenates multiple arrays | `ARRAY_CONCAT([1,2], [3,4])` |
| [ARRAY_SLICE](1-array/array-slice) | Extracts a portion of an array | `ARRAY_SLICE([1,2,3,4], 1, 2)` |
| [SLICE](1-array/slice) | Alias for ARRAY_SLICE function | `SLICE([1,2,3,4], 1, 2)` |
| [ARRAYS_ZIP](1-array/arrays-zip) | Combines multiple arrays element-wise | `ARRAYS_ZIP([1,2], ['a','b'])` |
| [ARRAY_DISTINCT](1-array/array-distinct) | Returns unique elements from an array | `ARRAY_DISTINCT([1,2,2,3])` |
| [ARRAY_UNIQUE](1-array/array-unique) | Alias for ARRAY_DISTINCT function | `ARRAY_UNIQUE([1,2,2,3])` |
| [ARRAY_INTERSECTION](1-array/array-intersection) | Returns common elements between arrays | `ARRAY_INTERSECTION([1,2,3], [2,3,4])` |
| [ARRAY_EXCEPT](1-array/array-except) | Returns elements in first array but not in second | `ARRAY_EXCEPT([1,2,3], [2,3])` |
| [ARRAY_OVERLAP](1-array/array-overlap) | Checks if arrays have common elements | `ARRAY_OVERLAP([1,2], [2,3])` |
| [ARRAY_TRANSFORM](1-array/array-transform) | Applies a function to each array element | `ARRAY_TRANSFORM([1,2,3], x -> x * 2)` |
| [ARRAY_FILTER](1-array/array-filter) | Filters array elements based on a condition | `ARRAY_FILTER([1,2,3,4], x -> x > 2)` |
| [ARRAY_REDUCE](1-array/array-reduce) | Reduces array to a single value using aggregation | `ARRAY_REDUCE([1,2,3], 0, (acc, x) -> acc + x)` |
| [ARRAY_AGGREGATE](1-array/array-aggregate) | Aggregates array elements using a function | `ARRAY_AGGREGATE([1,2,3], 'sum')` |
| [ARRAY_COMPACT](1-array/array-compact) | Removes null values from an array | `ARRAY_COMPACT([1, NULL, 2, NULL, 3])` |
| [ARRAY_FLATTEN](1-array/array-flatten) | Flattens nested arrays into a single array | `ARRAY_FLATTEN([[1,2], [3,4]])` |
| [ARRAY_REVERSE](1-array/array-reverse) | Reverses the order of array elements | `ARRAY_REVERSE([1,2,3])` |
| [ARRAY_INDEXOF](1-array/array-indexof) | Returns the index of first occurrence of an element | `ARRAY_INDEXOF([1,2,3,2], 2)` |
| [UNNEST](1-array/unnest) | Expands an array into individual rows | `UNNEST([1,2,3])` |

## Object Functions

| Function | Description | Example |
|----------|-------------|--------|
| [OBJECT_CONSTRUCT](2-object/object-construct) | Creates a JSON object from key-value pairs | `OBJECT_CONSTRUCT('name', 'John', 'age', 30)` |
| [OBJECT_CONSTRUCT_KEEP_NULL](2-object/object-construct-keep-null) | Creates a JSON object keeping null values | `OBJECT_CONSTRUCT_KEEP_NULL('a', 1, 'b', NULL)` |
| [OBJECT_KEYS](2-object/object-keys) | Returns all keys from a JSON object as an array | `OBJECT_KEYS(PARSE_JSON('{"a":1,"b":2}'))` |
| [OBJECT_INSERT](2-object/object-insert) | Inserts or updates a key-value pair in a JSON object | `OBJECT_INSERT(json_obj, 'new_key', 'value')` |
| [OBJECT_DELETE](2-object/object-delete) | Removes a key-value pair from a JSON object | `OBJECT_DELETE(json_obj, 'key_to_remove')` |
| [OBJECT_PICK](2-object/object-pick) | Creates a new object with only specified keys | `OBJECT_PICK(json_obj, 'name', 'age')` |

## Map Functions

| Function | Description | Example |
|----------|-------------|--------|
| [MAP_CAT](3-map/map-cat) | Combines multiple maps into a single map | `MAP_CAT({'a':1}, {'b':2})` |
| [MAP_KEYS](3-map/map-keys) | Returns all keys from a map as an array | `MAP_KEYS({'a':1, 'b':2})` |
| [MAP_VALUES](3-map/map-values) | Returns all values from a map as an array | `MAP_VALUES({'a':1, 'b':2})` |
| [MAP_SIZE](3-map/map-size) | Returns the number of key-value pairs in a map | `MAP_SIZE({'a':1, 'b':2})` |
| [MAP_CONTAINS_KEY](3-map/map-contains-key) | Checks if a map contains a specific key | `MAP_CONTAINS_KEY({'a':1}, 'a')` |
| [MAP_INSERT](3-map/map-insert) | Inserts a key-value pair into a map | `MAP_INSERT({'a':1}, 'b', 2)` |
| [MAP_DELETE](3-map/map-delete) | Removes a key-value pair from a map | `MAP_DELETE({'a':1, 'b':2}, 'b')` |
| [MAP_TRANSFORM_KEYS](3-map/map-transform-keys) | Applies a function to each key in a map | `MAP_TRANSFORM_KEYS(map, k -> UPPER(k))` |
| [MAP_TRANSFORM_VALUES](3-map/map-transform-values) | Applies a function to each value in a map | `MAP_TRANSFORM_VALUES(map, v -> v * 2)` |
| [MAP_FILTER](3-map/map-filter) | Filters key-value pairs based on a predicate | `MAP_FILTER(map, (k, v) -> v > 10)` |
| [MAP_PICK](3-map/map-pick) | Creates a new map with only specified keys | `MAP_PICK({'a':1, 'b':2, 'c':3}, 'a', 'c')` |

## Type Conversion Functions

| Function | Description | Example |
|----------|-------------|---------|
| [AS_BOOLEAN](4-conversion/as-boolean) | Converts a VARIANT value to BOOLEAN | `AS_BOOLEAN(PARSE_JSON('true'))` |
| [AS_INTEGER](4-conversion/as-integer) | Converts a VARIANT value to BIGINT | `AS_INTEGER(PARSE_JSON('42'))` |
| [AS_FLOAT](4-conversion/as-float) | Converts a VARIANT value to DOUBLE | `AS_FLOAT(PARSE_JSON('3.14'))` |
| [AS_DECIMAL](4-conversion/as-decimal) | Converts a VARIANT value to DECIMAL | `AS_DECIMAL(PARSE_JSON('12.34'))` |
| [AS_STRING](4-conversion/as-string) | Converts a VARIANT value to STRING | `AS_STRING(PARSE_JSON('"hello"'))` |
| [AS_BINARY](4-conversion/as-binary) | Converts a VARIANT value to BINARY | `AS_BINARY(TO_BINARY('abcd')::VARIANT)` |
| [AS_DATE](4-conversion/as-date) | Converts a VARIANT value to DATE | `AS_DATE(TO_DATE('2025-10-11')::VARIANT)` |
| [AS_ARRAY](4-conversion/as-array) | Converts a VARIANT value to ARRAY | `AS_ARRAY(PARSE_JSON('[1,2,3]'))` |
| [AS_OBJECT](4-conversion/as-object) | Converts a VARIANT value to OBJECT | `AS_OBJECT(PARSE_JSON('{"a":1}'))` |

## Type Predicate Functions

| Function | Description | Example |
|----------|-------------|--------|
| [IS_ARRAY](5-type-predicate/is-array) | Checks if a JSON value is an array | `IS_ARRAY(PARSE_JSON('[1,2,3]'))` |
| [IS_OBJECT](5-type-predicate/is-object) | Checks if a JSON value is an object | `IS_OBJECT(PARSE_JSON('{"a":1}'))` |
| [IS_STRING](5-type-predicate/is-string) | Checks if a JSON value is a string | `IS_STRING(PARSE_JSON('"hello"'))` |
| [IS_INTEGER](5-type-predicate/is-integer) | Checks if a JSON value is an integer | `IS_INTEGER(PARSE_JSON('42'))` |
| [IS_FLOAT](5-type-predicate/is-float) | Checks if a JSON value is a floating-point number | `IS_FLOAT(PARSE_JSON('3.14'))` |
| [IS_BOOLEAN](5-type-predicate/is-boolean) | Checks if a JSON value is a boolean | `IS_BOOLEAN(PARSE_JSON('true'))` |
| [IS_NULL_VALUE](5-type-predicate/is-null-value) | Checks if a JSON value is null | `IS_NULL_VALUE(PARSE_JSON('null'))` |
