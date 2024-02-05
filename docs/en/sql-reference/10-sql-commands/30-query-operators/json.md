---
title: JSON Operators
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.332"/>

| Operator | Description | Example | Result |
|----------|-------------|---------|--------|
| `->` | Retrieves a JSON array or object using an index or key, returning a JSON object. | - **Using a key**:<br/>`SELECT '{"Databend": "Cloud Native Warehouse"}'::JSON -> 'Databend'`<br/>- **Using an index**:<br/>`SELECT '["Databend", "Cloud Native Warehouse"]'::JSON -> 1` | `"Cloud Native Warehouse"` |
| `->>` | Retrieves a JSON array or object using an index or key, returning a string. | - **Using a key**:<br/>`SELECT '{"Databend": "Cloud Native Warehouse"}'::JSON ->> 'Databend'`<br/>- **Using an index**:<br/>`SELECT '["Databend", "Cloud Native Warehouse"]'::JSON ->> 1` | `Cloud Native Warehouse` |
| `#>` | Retrieves a JSON array or object by specifying a key path, returning a JSON object. | `SELECT '{"example": {"Databend": "Cloud Native Warehouse"}}'::JSON #> '{example, Databend}'` | `"Cloud Native Warehouse"` |
| `#>>` | Retrieves a JSON array or object by specifying a key path, returning a string. | `SELECT '{"example": {"Databend": "Cloud Native Warehouse"}}'::JSON #>> '{example, Databend}'` | `Cloud Native Warehouse` |
| `?` | Checks if the given string exists in a JSON object as a key or array, returning 1 for true and 0 for false. | `SELECT '{"a":1,"b":2,"c":3}'::JSON ? 'b'`| `true` |
| ?\| | Checks if any string in the given array exists as a key or array element, returning 1 for true and 0 for false. | SELECT '{"a":1,"b":2,"c":3}'::JSON ?\| ['b','e'] | `true` |
| `?&` | Checks if each string in the given array exists as a key or array element, returning 1 for true and 0 for false. | `SELECT '{"a":1,"b":2,"c":3}'::JSON ?& ['b','e']` | `false` |
| `@>` | Checks if the left JSON expression contains all key-value pairs of the right JSON expression, returning 1 for true and 0 for false. | `SELECT '{"name":"Alice","age":30}'::JSON @> '{"name":"Alice"}'::JSON` | `true` |
| `<@` | Checks if the left JSON expression is a subset of the right JSON expression, returning 1 for true and 0 for false. | `SELECT '{"name":"Alice"}'::JSON <@ '{"name":"Bob"}'::JSON` | `false` |
| `@@` | Checks whether a specified JSON path expression matches certain conditions within a JSON data, returning 1 for true and 0 for false. | `SELECT '{"a":1,"b":[1,2,3]}'::JSON @@ '$.a == 1'` | `true` |
| `@?` | Checks whether any item is returned by the JSON path expression for the specified JSON value, returning 1 for true and 0 for false. | `SELECT '{"a":1,"b":[1,2,3]}'::JSON @? '$.b[3]'` | `false` |
| `- '<key>'` | Deletes a key-value pair from a JSON object. | `SELECT '{"a":1,"b":2}'::JSON - 'a'` |  `{"b":2}`  |
| `- <index>` | Deletes an element at the specified index (negative integers counting from the end) from an array. | `SELECT '[1,2,3]'::JSON - 2` |   `[1,2]`  |
| `#-`        | Deletes a key-value pair or an array element by key and/or index. | `SELECT '{"a":1,"b":[1,2,3]}'::JSON #- '{b,2}'` |  `{"a":1,"b":[1,2]}`  |