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

Tip: If `<warehouse_name>` contains `-`, quote it with backticks or double quotes.

## Examples

This example sets `testwarehouse` as the active warehouse:

```sql
USE WAREHOUSE testwarehouse;
```
