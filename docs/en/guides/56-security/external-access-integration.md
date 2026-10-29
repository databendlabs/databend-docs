---
title: External Access Integrations
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

Use network rules and external access integrations to manage remote UDF destinations with SQL, within the operator's host limit. You can change allowed destinations or disable an integration without editing each UDF or restarting Query nodes. Use a feature-supporting version on every Query node.

This feature controls connections **from Databend Query nodes to remote Apache Arrow Flight UDF servers**. It does not grant network access to inline Python, JavaScript, or WASM code. It does not control requests that the remote handler makes to other services.

## How It Works

1. A **network rule** defines allowed host/port pairs. Only `TYPE = HOST_PORT` and `MODE = EGRESS` are supported.
2. An **external access integration** groups network rules and has an `ENABLED` switch.
3. A remote UDF names one or more integrations in `EXTERNAL_ACCESS_INTEGRATIONS` after its `ADDRESS` clause.

The destination must match at least one rule across the named integrations. **Every named integration must exist and be enabled**, even if another integration has a matching rule.

Network rules differ from [network policies](/sql/sql-commands/ddl/network-policy): network policies restrict client connections to Databend. Network rules restrict remote UDF destinations.

## Operator Configuration and Trust Boundary

SQL policies do not override the Query node configuration. Configure every Query node to enable remote UDFs. Use HTTPS unless the operator explicitly permits insecure HTTP:

```toml
[query]
enable_udf_server = true
udf_server_allow_insecure = false
udf_server_allow_list = ["https://udf.example.com"]
```

`enable_udf_server` and `udf_server_allow_insecure` both default to `false`. The allow list defaults to `[]`.

| Config allow list | UDF without integrations | UDF with explicit integrations |
|---|---|---|
| Nonempty | The host must pass the config allow list. | The host must pass the config allow list **and** the destination must match the SQL rules. |
| Empty | Rejected by the legacy allow-list check. | The SQL rules authorize the destination. |

The config allow list keeps its existing **host-only** comparison. Network rules compare **host and port**. A nonempty config list is an operator limit that tenant `SUPER` users cannot bypass with SQL.

:::caution
If the operator enables remote UDFs and leaves the config list empty, the operator delegates destination control for integration-bound UDFs to tenant SQL policy administrators. To retain an operator host limit, use a nonempty list. To disable remote UDFs, set `enable_udf_server = false`.
:::

In Databend Cloud, the service operator manages these settings. Use an HTTPS endpoint with gRPC/HTTP2 support. Contact Support if remote UDFs are disabled or a destination is outside the operator limit. An integration does not bypass that limit.

See [Query Configurations](/guides/self-hosted/references/node-config/query-config#remote-udf-servers).

## Set Up SQL-Managed Access

The example uses an existing role named `udf_developer`. The server at `https://udf.example.com` must expose a `gcd` handler that accepts two `INT` arguments and returns `INT NULL`. For a server example, see [CREATE FUNCTION](/sql/sql-commands/ddl/external-function/ddl-create-function).

### 1. Create a Rule and Integration

Run these statements with `SUPER`:

```sql
CREATE NETWORK RULE udf_service_rule
    TYPE = HOST_PORT
    MODE = EGRESS
    VALUE_LIST = ('udf.example.com:443');

CREATE EXTERNAL ACCESS INTEGRATION udf_access
    ALLOWED_NETWORK_RULES = (udf_service_rule)
    ENABLED = TRUE;
```

Rule values contain no URL scheme. An omitted port means `443`. Wildcards, CIDR ranges, port ranges, port `0`, URL paths, and credentials are not supported.

### 2. Authorize a Function Author

An administrator grants the required privileges to the role:

```sql
GRANT SUPER ON *.* TO ROLE udf_developer;
GRANT USAGE ON INTEGRATION udf_access TO ROLE udf_developer;
```

`USAGE` is additional to `SUPER`. It does not allow a role with only ordinary `CREATE` to create a UDF. To alter a UDF, a role needs the existing global `ALTER` privilege and `USAGE` on every integration in the new definition.

### 3. Create and Call the Function

Run as a user with the authorized role:

```sql
CREATE FUNCTION gcd (INT, INT)
    RETURNS INT NULL
    LANGUAGE python
    HANDLER = 'gcd'
    ADDRESS = 'https://udf.example.com'
    EXTERNAL_ACCESS_INTEGRATIONS = (udf_access);

SELECT gcd(48, 18);
-- 6
```

Databend checks privileges and policy before the remote Flight schema check. The schema must still match the declared argument and return types. The integration does not replace the Flight protocol with REST or change the server schema requirements.

Calling an existing UDF uses the existing UDF invocation permissions. Callers do not need integration `USAGE` just to invoke it. For example, where UDF access checks apply, grant UDF access to an existing role `udf_reader`:

```sql
GRANT USAGE ON UDF gcd TO ROLE udf_reader;
```

## Change or Disable Access

Change the destinations in a rule:

```sql
ALTER NETWORK RULE udf_service_rule
    SET VALUE_LIST = ('udf.example.com:443', 'udf.example.com:8443');
```

This replaces the full list. It does not change a UDF's `ADDRESS`; use `ALTER FUNCTION` to change that address.

Disable or re-enable an integration:

```sql
ALTER EXTERNAL ACCESS INTEGRATION udf_access SET ENABLED = FALSE;
ALTER EXTERNAL ACCESS INTEGRATION udf_access SET ENABLED = TRUE;
```

Databend checks policy before each Flight data request, including requests from already-built query pipelines. A disabled or missing integration rejects the request. An explicit integration never falls back to the config allow list when its rules do not match.

:::note
Policy changes propagate asynchronously through node-local metadata watches. Nodes can observe a change at different times. An update does not cancel a request that is already in flight. Do not rely on these SQL statements for instantaneous cross-node revocation.
:::

A dropped rule matches no destinations. Other existing rules can still authorize a request. All rules named in a new or replacement `ALLOWED_NETWORK_RULES` list must exist. Errors reading or decoding policy metadata do not authorize access.

## Privileges and Object Lifecycle

| Operation | Required privileges |
|---|---|
| Create, alter, or drop a network rule or integration | Global `SUPER` |
| Create a UDF with integrations | Global `SUPER` and `USAGE` on every named integration |
| Alter a UDF with integrations | Global `ALTER` and `USAGE` on every integration in the new definition |
| Invoke an existing UDF | Existing UDF invocation permissions; no additional integration `USAGE` |

To remove an author's ability to reference an integration in future definitions:

```sql
REVOKE USAGE ON INTEGRATION udf_access FROM ROLE udf_developer;
```

This does not disable UDFs that already reference it. Disable the integration or change its rules to block those calls.

Integration grants are name-based and remain after `DROP INTEGRATION`. Recreating the same name can make those grants effective again. Revoke unwanted grants **before** dropping the integration.

## Supported SQL

- [Network Rule commands](/sql/sql-commands/ddl/network-rule)
- [External Access Integration commands](/sql/sql-commands/ddl/external-access-integration)
- [CREATE FUNCTION](/sql/sql-commands/ddl/external-function/ddl-create-function)
- [ALTER FUNCTION](/sql/sql-commands/ddl/external-function/ddl-alter-function)
- [GRANT](/sql/sql-commands/ddl/user/grant) and [REVOKE](/sql/sql-commands/ddl/user/revoke)

The current subset does not support secrets, OAuth parameters, `COMMENT`, or `UNSET` for rules and integrations. `EXTERNAL_ACCESS_INTEGRATIONS` is supported only on remote scalar UDF definitions with `ADDRESS`.
