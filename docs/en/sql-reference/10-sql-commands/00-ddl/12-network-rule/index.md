---
title: Network Rule
---

Network rules define allowed destinations for remote Arrow Flight UDF servers. An external access integration groups these rules. A UDF references the integration through `EXTERNAL_ACCESS_INTEGRATIONS`.

Only `TYPE = HOST_PORT` and `MODE = EGRESS` are supported. Managing rules requires global `SUPER`.

| Command | Description |
|---|---|
| [CREATE NETWORK RULE](ddl-create-network-rule.md) | Creates or replaces a host/port rule. |
| [ALTER NETWORK RULE](ddl-alter-network-rule.md) | Replaces the allowed destination list. |
| [DROP NETWORK RULE](ddl-drop-network-rule.md) | Removes a rule. |

## Related Topics

- [External Access Integrations](/guides/security/external-access-integration): setup, operator limits, privileges, and propagation.
- [External Access Integration commands](../11-external-access-integration/index.md).
- [Network Policy](../12-network-policy/index.md): controls client connections to Databend, not remote UDF destinations.
