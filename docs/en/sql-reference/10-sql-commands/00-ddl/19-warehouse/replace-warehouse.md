---
title: REPLACE WAREHOUSE
sidebar_position: 6
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.687"/>

Recreates a warehouse with the specified configuration. This command shares the same semantics as [CREATE WAREHOUSE](create-warehouse.md) and is useful for overwriting existing warehouse configurations.

## Syntax

```sql
REPLACE WAREHOUSE <warehouse_name>
    [ WITH ] warehouse_size = <size>
    [ WITH ] auto_suspend = <nullable_unsigned_number>
    [ WITH ] initially_suspended = <bool>
    [ WITH ] auto_resume = <bool>
    [ WITH ] max_cluster_count = <nullable_unsigned_number>
    [ WITH ] min_cluster_count = <nullable_unsigned_number>
    [ WITH ] comment = '<string_literal>'
```

| Parameter | Description |
|-----------|-------------|
| warehouse_name | 3–63 characters, containing only `A-Z`, `a-z`, `0-9`, and `-`. |

## Options

See [CREATE WAREHOUSE](create-warehouse.md#options) for the complete list of available options.

## Examples

Replace an existing warehouse with new settings:

```sql
REPLACE WAREHOUSE etl_wh
    WITH warehouse_size = Large
    auto_suspend = 300
    auto_resume = TRUE
    comment = 'Updated ETL warehouse';
```
