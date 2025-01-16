---
title: USE WAREHOUSE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.687"/>

Sets the active warehouse for executing queries.

## Syntax

```sql
USE WAREHOUSE <warehouse_name>
```

## Examples

This example sets `test_warehouse` as the active warehouse:

```sql
USE WAREHOUSE test_warehouse;
```