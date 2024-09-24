---
title: DICT_GET
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.636"/>

Retrieves the value of a specified attribute from a dictionary using a provided key expression.

## Syntax

```sql
DICT_GET([db_name.]<dict_name>, '<attr_name>', <key_expr>)
```

| Parameter | Description                                                                                                                                                       |
|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| dict_name | The name of the dictionary.                                                                                                                                       |
| attr_name | The name of the attribute in the dictionary that you want to retrieve the value for.                                                                              |
| key_expr  | The key expression used to locate a specific entry in the dictionary. It represents the value of the dictionary's primary key to retrieve the corresponding data. |

## Examples

See [Usage Example](/guides/query/dictionary#usage-example).