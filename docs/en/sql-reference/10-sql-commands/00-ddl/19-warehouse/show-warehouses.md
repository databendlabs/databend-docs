---
title: SHOW WAREHOUSES
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.687"/>

Lists all warehouses in the current tenant.

The result includes columns like `name`, `state`, `size`, `version`, `auto_suspend`, `cache_size`, `spill_size`, and `created_on`.

## Syntax

```sql
SHOW WAREHOUSES
```

## Examples

```sql
SHOW WAREHOUSES;
```
