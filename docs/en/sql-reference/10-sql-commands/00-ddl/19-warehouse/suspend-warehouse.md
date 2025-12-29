---
title: SUSPEND WAREHOUSE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.687"/>

Suspends a warehouse, releasing the associated machine resources, but does not delete the warehouse.

## Syntax

```sql
SUSPEND WAREHOUSE <warehouse_name>
```

## Examples

This example suspends the `test_warehouse` warehouse:

```sql
SUSPEND WAREHOUSE test_warehouse;
```
