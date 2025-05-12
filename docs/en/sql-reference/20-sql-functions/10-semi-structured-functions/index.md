---
title: Semi-Structured Functions
---

This section provides reference information for the semi-structured data functions in Databend.

## Basic Operations

### Parsing and Validation
- [PARSE_JSON](parse-json.md): Parses a JSON string into a variant value
- [CHECK_JSON](check-json.md): Validates if a string is valid JSON

### Object Access and Extraction
- [GET](get.md): Gets a value from a JSON object by key
- [GET_PATH](get-path.md): Gets a value from a JSON object by path
- [GET_IGNORE_CASE](get-ignore-case.md): Gets a value with case-insensitive key matching
- [OBJECT_KEYS](object-keys.md): Returns keys of a JSON object
- [JSON_OBJECT_KEYS](json-object-keys.md): Returns keys of a JSON object as an array

### Type Inspection and Conversion
- [JSON_TYPEOF](json-typeof.md): Returns the type of a JSON value
- [AS_TYPE](as-type.md): Converts a JSON value to a specified SQL type
- [JSON_TO_STRING](json-to-string.md): Converts a JSON value to a string
- [IS_OBJECT](is-object.md): Checks if a JSON value is an object
- [IS_ARRAY](is-array.md): Checks if a JSON value is an array
- [IS_STRING](is-string.md): Checks if a JSON value is a string
- [IS_INTEGER](is-integer.md): Checks if a JSON value is an integer
- [IS_FLOAT](is-float.md): Checks if a JSON value is a floating-point number
- [IS_BOOLEAN](is-boolean.md): Checks if a JSON value is a boolean
- [IS_NULL_VALUE](is-null-value.md): Checks if a JSON value is null

## Construction and Modification

### JSON Object Operations
- [JSON_OBJECT](json-object.md): Creates a JSON object from key-value pairs
- [JSON_OBJECT_INSERT](json-object-insert.md): Inserts a value into a JSON object
- [JSON_OBJECT_DELETE](json-object-delete.md): Deletes a key from a JSON object
- [JSON_OBJECT_PICK](json-object-pick.md): Creates a new object with selected keys
- [JSON_STRIP_NULLS](json-strip-nulls.md): Removes null values from a JSON object
- [JSON_OBJECT_KEEP_NULL](json-object-keep-null.md): Creates a JSON object preserving null values

### JSON Array Operations
- [JSON_ARRAY](json-array.md): Creates a JSON array from input values
- [JSON_ARRAY_INSERT](json-array-insert.md): Inserts a value into a JSON array
- [JSON_ARRAY_DISTINCT](json-array-distinct.md): Returns an array with distinct elements
- [FLATTEN](flatten.md): Flattens nested arrays into a single array

## Advanced Query and Transformation

### Path Queries
- [JSON_PATH_EXISTS](json-path-exists.md): Checks if a JSON path exists
- [JSON_PATH_QUERY](json-path-query.md): Queries JSON data using a path expression
- [JSON_PATH_QUERY_FIRST](json-path-query-first.md): Returns the first match from a path query
- [JSON_PATH_QUERY_ARRAY](json-path-query-array.md): Returns query results as a JSON array
- [JSON_EXTRACT_PATH_TEXT](json-extract-path-text.md): Extracts text from a JSON path
- [JSON_PATH_MATCH](json-path-match.md): Matches JSON data against a path expression
- [JQ](jq.md): Provides jq-like JSON processing capabilities

### Array Transformations
- [JSON_ARRAY_MAP](json-array-map.md): Maps a function over array elements
- [JSON_ARRAY_FILTER](json-array-filter.md): Filters array elements using a condition
- [JSON_ARRAY_TRANSFORM](json-array-transform.md): Transforms array elements using an expression
- [JSON_ARRAY_APPLY](json-array-apply.md): Applies a function to each array element
- [JSON_ARRAY_REDUCE](json-array-reduce.md): Reduces an array to a single value

### Set Operations
- [JSON_ARRAY_INTERSECTION](json-array-intersection.md): Returns common elements between arrays
- [JSON_ARRAY_EXCEPT](json-array-except.md): Returns elements in first array but not in second
- [JSON_ARRAY_OVERLAP](json-array-overlap.md): Checks if arrays have common elements

### Object Transformations
- [JSON_MAP_FILTER](json-map-filter.md): Filters key-value pairs in a JSON object
- [JSON_MAP_TRANSFORM_KEYS](json-map-transform-keys.md): Transforms keys in a JSON object
- [JSON_MAP_TRANSFORM_VALUES](json-map-transform-values.md): Transforms values in a JSON object

### Expansion and Formatting
- [JSON_ARRAY_ELEMENTS](json-array-elements.md): Expands a JSON array to a set of rows
- [JSON_EACH](json-each.md): Expands the outermost JSON object into key-value pairs
- [JSON_PRETTY](json-pretty.md): Formats JSON with indentation for readability
