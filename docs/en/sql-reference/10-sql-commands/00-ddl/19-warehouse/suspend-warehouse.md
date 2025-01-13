---
title: SUSPEND WAREHOUSE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.687"/>

Suspends a warehouse, releasing the associated machine resources, but does not delete the warehouse.

When you suspend a warehouse, it releases the machine resources associated with the warehouse. However, this action can cause issues when attempting to interact with the warehouse. Specifically, if you try to use or query a suspended warehouse, you may encounter errors indicating that the warehouse is unavailable. For example, attempting to run SHOW ONLINE NODES or other commands that reference the suspended warehouse will result in an error. To resolve this, you need to exit the current session and reconnect.

```sql title='Example:'
root@(test_warehouse)/default> suspend warehouse test_warehouse;

suspend warehouse test_warehouse

0 row read in 0.036 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)

root@(test_warehouse)/default> show online nodes;
error: APIError: fail to POST http://localhost:8000/v1/query: BadRequest:(400 Bad Request)[400]Some(400) UnknownWarehouse. Code: 2406, Text = Not find the 'test_warehouse' warehouse; it is possible that all nodes of the warehouse have gone offline. Please exit the client and reconnect, or use `use warehouse <new_warehouse>`.

root@(test_warehouse_1)/default> exit
Bye~

root@localhost:8000/default> show online nodes;

show online nodes

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│           id           │      type     │ node_group │ warehouse │ cluster │           version           │
│         String         │     String    │   String   │   String  │  String │            String           │
├────────────────────────┼───────────────┼────────────┼───────────┼─────────┼─────────────────────────────┤
│ 9rabYMxa0ReDyZe6F9igH5 │ SystemManaged │ log_node   │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ CbzfLlTVO29EhkZXdeR625 │ SystemManaged │ log_node   │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ O0kOetbvkFjxrQ2kx4uMI  │ SystemManaged │ dev_node   │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ R2epWlGVd8S0maSTuwbsv4 │ SystemManaged │ dev_node   │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ SoZcaT4gmhVoGKcChlDw93 │ SystemManaged │ infra_node │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ UeNVzwHCXhxJTTB4Xonj07 │ SystemManaged │ dev_node   │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ Zu7rmhVZ2s2HqTUCdFBdu2 │ SystemManaged │ infra_node │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ bRubWZEzIibFgRgFad2MS3 │ SystemManaged │ infra_node │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ ilPer0ps5wWnEDOLIlk821 │ SystemManaged │ infra_node │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ shnWu1TC41sAxVwJMIVQF3 │ SystemManaged │ infra_node │           │         │ v1.2.665-nightly-bcb2c16f67 │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
10 rows read in 0.133 sec. Processed 0 rows, 0 B (0 row/s, 0 B/s)
```

## Syntax

```sql
SUSPEND WAREHOUSE <warehouse_name>
```

## Examples

This example suspends the `test_warehouse` warehouse:

```sql
SUSPEND WAREHOUSE test_warehouse;
```