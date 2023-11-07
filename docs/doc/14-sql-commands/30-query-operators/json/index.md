---
title: 'JSON Operators'
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.190"/>

| Operator | Description | Example | Result |
|----------|-------------|---------|--------|
| -> | Retrieves a JSON array or object using an index or key, returning a JSON object. | - **Using a key**:<br/>`PARSE_JSON('{"Databend": "Cloud Native Warehouse"}')->'Databend'`<br/>- **Using an index**:<br/>`PARSE_JSON('["Databend", "Cloud Native Warehouse"]')->1` | Cloud Native Warehouse |
| ->> | Retrieves a JSON array or object using an index or key, returning a string. | - **Using a key**:<br/>`PARSE_JSON('{"Databend": "Cloud Native Warehouse"}')->>'Databend'`<br/>- **Using an index**:<br/>`PARSE_JSON('["Databend", "Cloud Native Warehouse"]')->>1` | Cloud Native Warehouse |
| #> | Retrieves a JSON array or object by specifying a key path, returning a JSON object. | `PARSE_JSON('{"example": {"Databend": "Cloud Native Warehouse"}}')#>'{example, Databend}'` | Cloud Native Warehouse |
| #>> | Retrieves a JSON array or object by specifying a key path, returning a string. | `PARSE_JSON('{"example": {"Databend": "Cloud Native Warehouse"}}')#>>'{example, Databend}'` | Cloud Native Warehouse |
| ? | Checks if the given string exists in a JSON object as a key or array and returns a boolean result (1 for true, 0 for false). | `PARSE_JSON('{"a":1,"b":2,"c":3}') ? 'b'`| 1 |
| ?\| | Checks if any string in the given array exists as a key or array element and returns a boolean result (1 for true, 0 for false). | `PARSE_JSON('{"a":1,"b":2,"c":3}') ?\| ['b','e']` | 1 |
| ?& | Checks if each string in the given array exists as a key or array element and returns a boolean result (1 for true, 0 for false). | `PARSE_JSON('{"a":1,"b":2,"c":3}') ?& ['b','e']` | 0 |