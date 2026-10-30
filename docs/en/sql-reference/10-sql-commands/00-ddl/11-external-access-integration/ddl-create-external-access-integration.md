---
title: CREATE EXTERNAL ACCESS INTEGRATION
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

Creates a tenant-level external access integration for remote UDF servers. Requires global `SUPER`.

## Syntax

```sql
CREATE [ OR REPLACE ] EXTERNAL ACCESS INTEGRATION [ IF NOT EXISTS ] <integration_name>
    ALLOWED_NETWORK_RULES = (<rule_name>, ...)
    ENABLED = { TRUE | FALSE }
```

| Parameter | Description |
|---|---|
| `<integration_name>` | A tenant-level identifier. |
| `ALLOWED_NETWORK_RULES` | A nonempty list of existing network rule identifiers, not string literals. |
| `ENABLED` | Required. `FALSE` rejects requests from UDFs that reference the integration. |

Properties can appear in either order. A property cannot appear twice. `OR REPLACE` and `IF NOT EXISTS` cannot be combined. Secrets, OAuth parameters, and `COMMENT` are not supported.

An enabled integration allows a destination that matches any of its rules. If a UDF names multiple integrations, every integration must exist and be enabled; the destination must match at least one rule across them. A nonempty operator `udf_server_allow_list` must also allow the host.

## Example

```sql
CREATE NETWORK RULE udf_service_rule
    TYPE = HOST_PORT MODE = EGRESS
    VALUE_LIST = ('udf.example.com:443');

CREATE EXTERNAL ACCESS INTEGRATION udf_access
    ALLOWED_NETWORK_RULES = (udf_service_rule)
    ENABLED = TRUE;

GRANT USAGE ON INTEGRATION udf_access TO ROLE udf_developer;
```

Assume `udf_developer` exists. Integration `USAGE` permits referencing this object in a UDF definition. UDF creation still requires `SUPER`; alteration still requires global `ALTER`.

`CREATE OR REPLACE` changes policy for existing UDF references after asynchronous propagation. It does not require recreating those UDFs.

For function syntax and setup, see [External Access Integrations](/guides/security/external-access-integration).
