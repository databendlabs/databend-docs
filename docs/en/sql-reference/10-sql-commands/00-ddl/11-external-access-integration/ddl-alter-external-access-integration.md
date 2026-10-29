---
title: ALTER EXTERNAL ACCESS INTEGRATION
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

Changes an integration's rules or enabled state. Requires global `SUPER`.

## Syntax

```sql
ALTER EXTERNAL ACCESS INTEGRATION [ IF EXISTS ] <integration_name> SET
    [ ALLOWED_NETWORK_RULES = (<rule_name>, ...) ]
    [ ENABLED = { TRUE | FALSE } ]
```

Specify at least one property. Properties can appear in either order but cannot be repeated. Unspecified properties keep their current values.

`ALLOWED_NETWORK_RULES` replaces the full list. The list must be nonempty, and every named rule must exist. `ENABLED = FALSE` rejects later requests from any UDF that references this integration. It does not remove the UDF or its grants.

`IF EXISTS` makes a missing integration a no-op. Metadata service errors still fail the statement. `UNSET`, secrets, OAuth parameters, and `COMMENT` are not supported.

## Examples

Disable and re-enable an integration:

```sql
ALTER EXTERNAL ACCESS INTEGRATION udf_access SET ENABLED = FALSE;
ALTER EXTERNAL ACCESS INTEGRATION udf_access SET ENABLED = TRUE;
```

Replace its rules and enable it in one statement. Assume both rules exist:

```sql
ALTER EXTERNAL ACCESS INTEGRATION udf_access SET
    ALLOWED_NETWORK_RULES = (udf_service_rule, backup_service_rule)
    ENABLED = TRUE;
```

Policy changes propagate asynchronously to Query nodes. Existing pipelines check policy before later Flight data requests, but an update does not cancel in-flight requests. See [External Access Integrations](/guides/security/external-access-integration) for the trust boundary and timing limits.
