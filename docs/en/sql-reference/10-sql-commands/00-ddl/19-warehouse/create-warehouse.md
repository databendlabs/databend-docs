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

Tip: If `<warehouse_name>` contains `-`, quote it with backticks or double quotes.

## Examples

This example creates an `XSMALL` warehouse:

```sql
CREATE WAREHOUSE testwarehouse WITH WAREHOUSE_SIZE = XSMALL;
```
