---
title: ALTER WORKLOAD GROUP
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.743"/>

Update a workload group with specified quota settings.

## Syntax

```sql
ALTER WORKLOAD GROUP <group_name>
[SET cpu_quota = '<percentage>', query_timeout = '<duration>']
```

## Parameters

| Parameter       | Type     | Required | Default      | Description                                                                 |
|-----------------|----------|----------|--------------|-----------------------------------------------------------------------------|
| `cpu_quota`     | string   | No       | (unlimited)  | CPU resource quota as percentage string (e.g. `"20%"`)                      |
| `query_timeout` | duration | No       | (unlimited)  | Query timeout duration (units: `s`/`sec`=seconds, `m`/`min`=minutes, `h`/`hour`=hours, `d`/`day`=days, `ms`=milliseconds, unitless=seconds) |


## Examples

```sql
ALTER WORKLOAD GROUP analytics SET cpu_quota = '20%', query_timeout = '10m';
```

