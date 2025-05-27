---
title: CREATE WORKLOAD GROUP
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.743"/>

Creates a workload group with specified quota settings.

## Syntax

```sql
CREATE WORKLOAD GROUP [IF NOT EXISTS] <group_name>
[WITH cpu_quota = '<percentage>', query_timeout = '<duration>']
```

## Parameters

| Parameter       | Type     | Required | Default      | Description                                                                 |
|-----------------|----------|----------|--------------|-----------------------------------------------------------------------------|
| `cpu_quota`     | string   | No       | (unlimited)  | CPU resource quota as percentage string (e.g. `"20%"`)                      |
| `query_timeout` | duration | No       | (unlimited)  | Query timeout duration (units: `s`/`sec`=seconds, `m`/`min`=minutes, `h`/`hour`=hours, `d`/`day`=days, `ms`=milliseconds, unitless=seconds) |


## Examples

```sql
CREATE WORKLOAD GROUP analytics WITH cpu_quota = '20%', query_timeout = '10m';
```

