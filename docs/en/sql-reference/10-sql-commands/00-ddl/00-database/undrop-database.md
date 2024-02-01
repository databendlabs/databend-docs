---
title: UNDROP DATABASE
---

Restores the most recent version of a dropped database. This leverages the Databend Time Travel feature; a dropped object can be restored only within a retention period (defaults to 24 hours).

See also: [DROP DATABASE](ddl-drop-database.md)

## Syntax

```sql
UNDROP DATABASE <database_name>
```

If a database with the same name already exists, an error is returned.

## Examples

This example creates, drops, and then restores a database named "orders_2024":

```sql
root@localhost:8000/default> CREATE DATABASE orders_2024;

CREATE DATABASE orders_2024

0 row written in 0.014 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)

root@localhost:8000/default> DROP DATABASE orders_2024;

DROP DATABASE orders_2024

0 row written in 0.012 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)

root@localhost:8000/default> UNDROP DATABASE orders_2024;

UNDROP DATABASE orders_2024

0 row read in 0.011 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)
```