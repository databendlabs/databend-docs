---
title: CREATE NETWORK RULE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

Creates a tenant-level rule for remote UDF server destinations. Requires global `SUPER`.

## Syntax

```sql
CREATE [ OR REPLACE ] NETWORK RULE [ IF NOT EXISTS ] <rule_name>
    TYPE = HOST_PORT
    MODE = EGRESS
    VALUE_LIST = ('<host>[:<port>]', ...)
```

All three properties are required. They can appear in any order. A property cannot appear twice. `OR REPLACE` and `IF NOT EXISTS` cannot be combined.

| Parameter | Description |
|---|---|
| `<rule_name>` | A tenant-level identifier. |
| `TYPE` | Only `HOST_PORT` is supported. |
| `MODE` | Only `EGRESS` is supported. |
| `VALUE_LIST` | A nonempty list of host/port values. The default port is `443`. |

Values must not contain URL schemes, paths, credentials, whitespace, or wildcards. CIDR ranges, port ranges, and port `0` are not supported. Use an explicit port for a server that does not listen on `443`.

A rule alone does not authorize a UDF. Add it to an [external access integration](../11-external-access-integration/ddl-create-external-access-integration.md), then reference the integration in the function definition. A nonempty operator `udf_server_allow_list` remains an additional host limit.

## Example

```sql
CREATE NETWORK RULE udf_service_rule
    TYPE = HOST_PORT
    MODE = EGRESS
    VALUE_LIST = ('udf.example.com', 'udf.example.com:8443');
```

The first value means `udf.example.com:443`. `CREATE OR REPLACE` changes the rule for every integration that references its name. Changes propagate asynchronously.

See [External Access Integrations](/guides/security/external-access-integration) for the full setup and trust boundary.
