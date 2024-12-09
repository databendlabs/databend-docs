---
title: FUSE_VACUUM_TEMPORARY_TABLE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.666"/>

Cleans up leftover files from temporary tables that were not automatically removed, such as after query node crashes.

## Syntax

```sql
FUSE_VACUUM_TEMPORARY_TABLE();
```

## Examples

```sql
SELECT * FROM FUSE_VACUUM_TEMPORARY_TABLE();

┌────────┐
│ result │
├────────┤
│ Ok     │
└────────┘
```