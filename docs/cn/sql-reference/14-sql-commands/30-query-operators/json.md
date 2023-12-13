---
title: JSON Operators
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.241"/>

| Operator | Description | Example | Result |
|----------|-------------|---------|--------|
| -> | Retrieves a JSON array or object using an index or key, returning a JSON object. | - **Using a key**:<br/>`PARSE_JSON('{"Databend": "Cloud Native Warehouse"}')->'Databend'`<br/>- **Using an index**:<br/>`PARSE_JSON('["Databend", "Cloud Native Warehouse"]')->1` | Cloud Native Warehouse |
| ->> | Retrieves a JSON array or object using an index or key, returning a string. | - **Using a key**:<br/>`PARSE_JSON('{"Databend": "Cloud Native Warehouse"}')->>'Databend'`<br/>- **Using an index**:<br/>`PARSE_JSON('["Databend", "Cloud Native Warehouse"]')->>1` | Cloud Native Warehouse |
| #> | Retrieves a JSON array or object by specifying a key path, returning a JSON object. | `PARSE_JSON('{"example": {"Databend": "Cloud Native Warehouse"}}')#>'{example, Databend}'` | Cloud Native Warehouse |
| #>> | Retrieves a JSON array or object by specifying a key path, returning a string. | `PARSE_JSON('{"example": {"Databend": "Cloud Native Warehouse"}}')#>>'{example, Databend}'` | Cloud Native Warehouse |
| ? | Checks if the given string exists in a JSON object as a key or array, returning 1 for true and 0 for false. | `PARSE_JSON('{"a":1,"b":2,"c":3}') ? 'b'`| 1 |
| ?\| | Checks if any string in the given array exists as a key or array element, returning 1 for true and 0 for false. | PARSE_JSON('{"a":1,"b":2,"c":3}') ?\| ['b','e'] | 1 |
| ?& | Checks if each string in the given array exists as a key or array element, returning 1 for true and 0 for false. | `PARSE_JSON('{"a":1,"b":2,"c":3}') ?& ['b','e']` | 0 |
| @> | Checks if the left JSON expression contains all key-value pairs of the right JSON expression, returning 1 for true and 0 for false. | `PARSE_JSON('{"name":"Alice","age":30}') @> PARSE_JSON('{"name":"Alice"}')` | 1 |
| <@ | Checks if the left JSON expression is a subset of the right JSON expression, returning 1 for true and 0 for false. | `PARSE_JSON('{"name":"Alice"}') <@ PARSE_JSON('{"name":"Bob"}')` | 0 |
| @@ | Checks whether a specified JSON path expression matches certain conditions within a JSON data, returning 1 for true and 0 for false. | `PARSE_JSON('{"a":1,"b":[1,2,3]}') @@ '$.a == 1'` | 1 |
| @? | Checks whether any item is returned by the JSON path expression for the specified JSON value, returning 1 for true and 0 for false. | `PARSE_JSON('{"a":1,"b":[1,2,3]}') @? '$.b[3]'` | 0 |