---
title: ARRAY_DISTINCT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.762"/>

Flattens nested arrays into a single array .


## Syntax

```sql
ARRAY_FLATTEN(<json_array>)
```

## Return Type

JSON array.

## Examples

```sql
SELECT ARRAY_FLATTEN([[1,2],[3,4]]);
-- [1,2,3,4]
```
