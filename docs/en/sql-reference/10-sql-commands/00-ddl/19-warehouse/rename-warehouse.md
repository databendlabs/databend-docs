---
title: RENAME WAREHOUSE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.687"/>

Renames an existing warehouse to a new name.

Note: Existing sessions may still reference the old warehouse name. Reconnect or run `USE WAREHOUSE <new_name>` after renaming.

## Syntax

```sql
RENAME WAREHOUSE <current_name> TO <new_name>
```

## Examples

This example renames `test_warehouse_1` to `test_warehouse`:

```sql
RENAME WAREHOUSE test_warehouse_1 TO test_warehouse;
```
