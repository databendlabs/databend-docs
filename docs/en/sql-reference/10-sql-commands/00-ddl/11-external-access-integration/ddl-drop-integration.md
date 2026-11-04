---
title: DROP INTEGRATION
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

Removes an external access integration. Requires global `SUPER`.

## Syntax

```sql
DROP [ EXTERNAL ACCESS ] INTEGRATION [ IF EXISTS ] <integration_name>
```

`DROP INTEGRATION` and `DROP EXTERNAL ACCESS INTEGRATION` are aliases for this object. `IF EXISTS` suppresses the missing-integration error. Metadata service errors still fail the statement.

Dropping an integration does not drop its rules or UDFs. UDFs that reference the missing integration reject later requests after the policy change propagates. They do not fall back to the config allow list.

:::caution
Integration grants remain after the object is dropped. Recreating the same name can make those grants effective again. Revoke unwanted grants before dropping the integration.
:::

## Example

Assume the role and integration exist:

```sql
REVOKE USAGE ON INTEGRATION udf_access FROM ROLE udf_developer;
DROP INTEGRATION udf_access;
```

Use the long form for an optional cleanup:

```sql
DROP EXTERNAL ACCESS INTEGRATION IF EXISTS udf_access;
```

For propagation and privilege behavior, see [External Access Integrations](/guides/security/external-access-integration).
