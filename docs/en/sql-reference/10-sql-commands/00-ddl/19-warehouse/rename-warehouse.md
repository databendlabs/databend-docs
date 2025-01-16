---
title: RENAME WAREHOUSE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.687"/>

Renames an existing warehouse to a new name.

When you rename a warehouse, the session will encounter an error if trying to USE the renamed warehouse without first exiting and reconnecting. This is because the session still references the old warehouse name. To resolve this issue, exit the current session and then reconnect before attempting to use the renamed warehouse.

```sql title='Example:'
root@(test_warehouse_1)/default> rename warehouse test_warehouse_1 to test_warehouse;

rename warehouse test_warehouse_1 to test_warehouse

0 row read in 0.027 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)

root@(test_warehouse_1)/default> use warehouse test_warehouse;
error: APIError: fail to POST http://localhost:8000/v1/query: BadRequest:(500 Internal Server Error)[500]Some(500) UnknownWarehouse. Code: 2406, Text = Unknown warehouse or self managed warehouse "test_warehouse_1"
(while in warehouse request forward).

root@(test_warehouse_1)/default> exit
Bye~

root@localhost:8000/default> use warehouse test_warehouse;

use warehouse test_warehouse

0 row read in 0.019 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)
```

## Syntax

```sql
RENAME WAREHOUSE <current_name> TO <new_name>
```

## Examples

This example renames `test_warehouse_1` to `test_warehouse`:

```sql
RENAME WAREHOUSE test_warehouse_1 TO test_warehouse;
```

