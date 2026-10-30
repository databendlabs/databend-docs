---
title: ALTER NETWORK RULE
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

Replaces a network rule's destination list. Requires global `SUPER`.

## Syntax

```sql
ALTER NETWORK RULE [ IF EXISTS ] <rule_name>
    SET VALUE_LIST = ('<host>[:<port>]', ...)
```

The new list must be nonempty. It replaces the full list; values are not appended. Values follow the [CREATE NETWORK RULE](ddl-create-network-rule.md) format. `TYPE` and `MODE` cannot be changed.

`IF EXISTS` suppresses the missing-rule error. It does not suppress invalid value or metadata service errors.

## Example

```sql
ALTER NETWORK RULE udf_service_rule
    SET VALUE_LIST = ('udf.example.com:443', 'udf.example.com:8443');
```

Every integration that references this rule uses the updated list after asynchronous propagation. Removing a target can reject later Flight requests from an existing query. This command does not change the UDF's `ADDRESS`.

For timing and operator limits, see [External Access Integrations](/guides/security/external-access-integration).
