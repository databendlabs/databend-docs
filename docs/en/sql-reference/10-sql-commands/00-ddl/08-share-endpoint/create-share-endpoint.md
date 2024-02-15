---
title: CREATE SHARE ENDPOINT
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.339"/>

Creates a share endpoint.

## Syntax

```sql
CREATE [ OR REPLACE ] SHARE ENDPOINT [ IF NOT EXISTS ] <share_endpoint_name>
    URL = '<share_endpoint_url>'
    TENANT = <shared_tenant_name>
    [COMMENT = <comment_string>]
```

## Examples

The following example creates a share endpoint named "to_share" that defines the URL to access the shared Databend tenant "toronto":

```sql
CREATE SHARE ENDPOINT to_share URL = 'http://127.0.0.1:23003' TENANT = toronto;
```