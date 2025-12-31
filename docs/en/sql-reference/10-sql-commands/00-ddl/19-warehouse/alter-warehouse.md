---
title: ALTER WAREHOUSE
sidebar_position: 4
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.687"/>

Suspends, resumes, or modifies settings of an existing warehouse.

## Syntax

```sql
-- Suspend or resume a warehouse
ALTER WAREHOUSE <warehouse_name> { SUSPEND | RESUME }

-- Modify warehouse settings
ALTER WAREHOUSE <warehouse_name>
    SET [ WITH ] warehouse_size = <size>
    [ WITH ] auto_suspend = <nullable_unsigned_number>
    [ WITH ] auto_resume = <bool>
    [ WITH ] max_cluster_count = <nullable_unsigned_number>
    [ WITH ] min_cluster_count = <nullable_unsigned_number>
    [ WITH ] comment = '<string_literal>'
```

| Parameter | Description |
|-----------|-------------|
| `SUSPEND` | Immediately suspends the warehouse. |
| `RESUME` | Immediately resumes the warehouse. |
| `SET` | Modifies one or more warehouse options. Unspecified fields remain unchanged. |

## Options

The `SET` clause accepts the same options as [CREATE WAREHOUSE](create-warehouse.md):

| Option | Type / Values | Description |
|--------|---------------|-------------|
| `WAREHOUSE_SIZE` | `XSmall`, `Small`, `Medium`, `Large`, `XLarge`, `2XLarge`–`6XLarge` | Changes compute size. |
| `AUTO_SUSPEND` | `NULL`, `0`, or ≥300 seconds | Idle timeout before automatic suspend. `NULL` disables auto-suspend. |
| `AUTO_RESUME` | Boolean | Controls whether incoming queries wake the warehouse automatically. |
| `MAX_CLUSTER_COUNT` | `NULL` or non-negative integer | Upper bound for auto-scaling clusters. |
| `MIN_CLUSTER_COUNT` | `NULL` or non-negative integer | Lower bound for auto-scaling clusters. |
| `COMMENT` | String | Free-form text description. |

- `NULL` is valid for numeric options to reset them to `0`.
- Supplying `SET` with no options raises an error.

## Examples

Suspend a warehouse:

```sql
ALTER WAREHOUSE my_wh SUSPEND;
```

Resume a warehouse:

```sql
ALTER WAREHOUSE my_wh RESUME;
```

Modify warehouse settings:

```sql
ALTER WAREHOUSE my_wh
    SET warehouse_size = Large
    auto_resume = TRUE
    comment = 'Serving tier';
```

Disable auto-suspend:

```sql
ALTER WAREHOUSE my_wh SET auto_suspend = NULL;
```
