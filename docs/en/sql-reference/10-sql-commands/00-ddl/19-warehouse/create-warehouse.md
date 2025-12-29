---
title: CREATE WAREHOUSE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.687"/>

Creates a warehouse.

## Syntax

```sql
CREATE WAREHOUSE '<warehouse_name>'
    WITH WAREHOUSE_SIZE = '<warehouse_size>'
```

Where:

- `<warehouse_name>` must contain only English letters, digits, and `-`. We recommend always using single quotes.
- `<warehouse_size>` is case-insensitive and can be one of: `XSMALL`, `SMALL`, `MEDIUM`, `LARGE`, `XLARGE`, `XXLARGE`, `XXXLARGE`. We recommend using single quotes.

## Examples

This example creates an `XSMALL` warehouse:

```sql
CREATE WAREHOUSE 'testwarehouse' WITH WAREHOUSE_SIZE = 'XSMALL';
```
