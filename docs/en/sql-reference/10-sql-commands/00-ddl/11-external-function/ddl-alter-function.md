---
title: ALTER FUNCTION
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

Replaces the definition of an existing external function.

## Syntax

```sql
ALTER FUNCTION <function_name>
    ( <input_param_types> ) RETURNS <return_type> LANGUAGE <language_name>
    HANDLER = '<handler_name>' ADDRESS = '<udf_server_address>'
    [ EXTERNAL_ACCESS_INTEGRATIONS = (<integration_name>, ...) ]
    [ DESC = '<description>' ]
```

The statement supplies a complete definition. It is not a partial update. For parameter descriptions, see [CREATE FUNCTION](ddl-create-function.md). `ALTER FUNCTION` does not support `IF EXISTS` or `IF NOT EXISTS`.

## Access Control and Policy

Altering a UDF requires the existing global `ALTER` privilege. When the new definition names integrations, the author also needs `USAGE` on every integration. The statement does not gain a new `SUPER` requirement from the integrations.

Every named integration must exist and be enabled. The address must pass the rules and any nonempty operator `udf_server_allow_list`. Databend checks privileges before integration-bound policy and remote schema validation. Arrow Flight schema requirements remain unchanged.

Omitting `EXTERNAL_ACCESS_INTEGRATIONS` removes the binding from the new definition and uses the legacy config allow-list path. An empty config list rejects that path. To keep the binding, include it again in the replacement definition.

## Example

Assume `gcd` exists, integration `udf_access` allows the destination, and the Flight server exposes a compatible `gcd_new` handler:

```sql
ALTER FUNCTION gcd (INT, INT)
    RETURNS INT NULL
    LANGUAGE python
    HANDLER = 'gcd_new'
    ADDRESS = 'https://udf.example.com'
    EXTERNAL_ACCESS_INTEGRATIONS = (udf_access);
```

For setup and propagation behavior, see [External Access Integrations](/guides/security/external-access-integration).
