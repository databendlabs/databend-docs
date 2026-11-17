---
title: KILL
---

import FunctionDescription from '@site/src/components/FunctionDescription';

Forcibly terminates the currently running queries.

See also: [SHOW PROCESSLIST](07-show-processlist.md)

## Syntax

```sql
KILL QUERY|CONNECTION <session_id>
```

## Cancel your own work

<FunctionDescription description="Introduced or updated: Unreleased"/>

`KILL QUERY` accepts a query ID or session ID. For example, use `KILL QUERY '<query_id>'` to cancel one statement from another session. `KILL CONNECTION` requires a session ID or local MySQL connection ID. It also closes the connection. A query-only match is not a valid connection target.

You can cancel your own work across sessions and warehouse nodes without `SUPER`. The target must have the same tenant and full user identity, including username and hostname. Other users' work in the same tenant requires global `SUPER`, including a role grant. `SUPER` does not allow cancellation in another tenant.

Internal session IDs from `CONNECTION_ID()` and `system.processes.id` use `p-<UUID>`. Numeric IDs remain local MySQL connection IDs. HTTP login and client-session IDs do not change. Missing targets and targets in another tenant return `UnknownSession`. An unauthorized target in the same tenant returns `PermissionDenied`.

During a rolling upgrade, older nodes cannot resolve query-ID cancellation. Use the actual session ID when targeting an older node, subject to that node's privilege rules. Non-`SUPER` cancellation does not fall back to an older, less restrictive protocol. Complete the node upgrades before relying on the new isolation rules throughout the warehouse.

## Examples

The following output shows the session ID format used by older releases.

```sql
SHOW PROCESSLIST;
+--------------------------------------+-------+-----------------+------+-------+----------+--------------------------------------------------------------------------------------+--------------+------------------------+-------------------------+-------------------------+--------------------------+
| id                                   | type  | host            | user | state | database | extra_info                                                                           | memory_usage | dal_metrics_read_bytes | dal_metrics_write_bytes | scan_progress_read_rows | scan_progress_read_bytes |
+--------------------------------------+-------+-----------------+------+-------+----------+--------------------------------------------------------------------------------------+--------------+------------------------+-------------------------+-------------------------+--------------------------+
| e04dd121-88f4-4290-85be-2b45c6e3b011 | MySQL | 127.0.0.1:65291 | root | Query | default  | SELECT sum(number) from numbers_mt(10000000000) group by number%3, number%4,number%5 |            0 |                      0 |                       0 |              2391200000 |              19129600000 |
| 179c99d5-1894-4d4c-a89e-4b293d404c88 | MySQL | 127.0.0.1:64597 | root | Query | default  | show processlist                                                                     |            0 |                      0 |                       0 |                       0 |                        0 |
+--------------------------------------+-------+-----------------+------+-------+----------+--------------------------------------------------------------------------------------+--------------+------------------------+-------------------------+-------------------------+--------------------------+

KILL QUERY 'e04dd121-88f4-4290-85be-2b45c6e3b011';
```