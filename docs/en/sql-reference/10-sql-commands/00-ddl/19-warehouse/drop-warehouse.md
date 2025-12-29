---
title: DROP WAREHOUSE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.687"/>

Removes the specified warehouse and frees up the resources associated with it. 

## Syntax

```sql
DROP WAREHOUSE <warehouse_name>
```

Tip: If `<warehouse_name>` contains `-`, quote it with backticks or double quotes.

## Examples

This example removes the `testwarehouse` warehouse:

```sql
DROP WAREHOUSE testwarehouse;
```
