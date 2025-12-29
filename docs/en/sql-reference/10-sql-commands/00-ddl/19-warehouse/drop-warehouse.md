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

Tip: If `<warehouse_name>` contains `-`, quote it with quotes (for example, `'name-with-hyphen'`, `` `name-with-hyphen` ``, or `"name-with-hyphen"`).

## Examples

This example removes the `testwarehouse` warehouse:

```sql
DROP WAREHOUSE 'testwarehouse';
```
