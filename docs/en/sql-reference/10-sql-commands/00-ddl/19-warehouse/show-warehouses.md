---
title: SHOW WAREHOUSES
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.687"/>

Returns a list of all existing warehouses along with their type and status.

## Syntax

```sql
SHOW WAREHOUSES
```

## Examples

```sql
SHOW WAREHOUSES;

┌───────────────────────────────────────────┐
│    warehouse   │      type      │  status │
├────────────────┼────────────────┼─────────┤
│ test_warehouse │ System-Managed │ Running │
└───────────────────────────────────────────┘
```