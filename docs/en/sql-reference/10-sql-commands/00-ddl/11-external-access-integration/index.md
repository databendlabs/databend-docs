---
title: External Access Integration
---

An external access integration groups network rules and provides an `ENABLED` switch for remote scalar UDF access. Use it with `EXTERNAL_ACCESS_INTEGRATIONS` on a function definition that has `ADDRESS`.

Managing integrations requires global `SUPER`. Referencing one when creating or altering a UDF additionally requires integration `USAGE`. This feature does not provide network access for inline script UDFs.

| Command | Description |
|---|---|
| [CREATE EXTERNAL ACCESS INTEGRATION](ddl-create-external-access-integration.md) | Creates or replaces an integration. |
| [ALTER EXTERNAL ACCESS INTEGRATION](ddl-alter-external-access-integration.md) | Changes its rule list or enabled state. |
| [DROP INTEGRATION](ddl-drop-integration.md) | Removes an integration. |

## Related Topics

- [External Access Integrations](/guides/security/external-access-integration): setup and trust boundary.
- [Network Rule commands](../12-network-rule/index.md).
- [CREATE FUNCTION](../11-external-function/ddl-create-function.md) and [ALTER FUNCTION](../11-external-function/ddl-alter-function.md).
- [GRANT](../02-user/10-grant.md) and [REVOKE](../02-user/11-revoke.md).
