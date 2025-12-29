---
title: CREATE WAREHOUSE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.687"/>

Creates a warehouse with specified size.

## Syntax

```sql
CREATE WAREHOUSE <warehouse_name>
    WITH WAREHOUSE_SIZE = { XSMALL | SMALL | MEDIUM | LARGE | XLARGE | XXLARGE | XXXLARGE }
```

## Examples

This example creates an `XSMALL` warehouse:

```sql
CREATE WAREHOUSE test_warehouse WITH WAREHOUSE_SIZE = XSMALL;
```
