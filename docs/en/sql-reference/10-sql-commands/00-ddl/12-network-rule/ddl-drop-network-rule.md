---
title: DROP NETWORK RULE
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

Removes a network rule. Requires global `SUPER`.

## Syntax

```sql
DROP NETWORK RULE [ IF EXISTS ] <rule_name>
```

`IF EXISTS` suppresses the missing-rule error. Metadata service errors still fail the statement.

## Behavior

The rule can be dropped while integrations still reference its name. A missing rule matches no destinations. Other existing rules in the integration can still authorize a request. If no rule matches, the request is rejected.

This command does not drop the referencing integrations or UDFs. Recreating a rule with the same name makes its destinations available to those integrations again. To change an integration's references, use [ALTER EXTERNAL ACCESS INTEGRATION](../11-external-access-integration/ddl-alter-external-access-integration.md).

Policy changes propagate asynchronously. Dropping a rule does not cancel an in-flight Flight request.

## Example

```sql
DROP NETWORK RULE IF EXISTS udf_service_rule;
```
