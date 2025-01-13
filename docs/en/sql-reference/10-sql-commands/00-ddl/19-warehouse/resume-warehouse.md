---
title: RESUME WAREHOUSE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.687"/>

Restarts a previously suspended warehouse, bringing it back online and re-allocating its machine resources. If there are no available nodes, the RESUME WAREHOUSE command will fail. When trying to resume a warehouse, ensure that the necessary resources are available for the warehouse to restart successfully. 

## Syntax

```sql
RESUME WAREHOUSE <warehouse_name>
```

## Examples

This example resumes the `test_warehouse` warehouse:

```sql
RESUME WAREHOUSE test_warehouse;
```