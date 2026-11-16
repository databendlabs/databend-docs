---
title: SHOW CONNECTIONS
sidebar_position: 2
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.965"/>

Displays a list of all available connections.

The command masks credentials in `storage_params`. For the masking rules, see [Masked Values](desc-connection.md#masked-values).

## Syntax

```sql
SHOW CONNECTIONS
```

## Examples

```sql
SHOW CONNECTIONS;

┌────────────┬──────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ name       │ storage_type │ storage_params                                                                                       │
├────────────┼──────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ my_s3_conn │ s3           │ access_key_id=mi***in endpoint_url=http://127.0.0.1:9900/ region=us-east-1 secret_access_key=mi***in │
└────────────┴──────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────┘
```
