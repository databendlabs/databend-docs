---
title: KILL
---

Cancels the query that runs in a specified server session, or terminates that session.

See also: [SHOW PROCESSLIST](07-show-processlist.md)

## Syntax

```sql
KILL QUERY '<process_id>'
KILL CONNECTION '<process_id>'
```

- `KILL QUERY` cancels the target session's current query.
- `KILL CONNECTION` also marks the target server session as aborted. The effect depends on the protocol, as shown below.

### Process ID

`process_id` is the `id` column returned by `SHOW PROCESSLIST` or `system.processes`. It identifies an internal server session.

Do not use a query ID, an operating system process ID (PID), or an HTTP client session ID as `process_id`.

The session lifetime and the effect of cancellation depend on the protocol:

| Protocol | Lifetime of `process_id` | Cancellation behavior |
|----------|-------------------------|-----------------------|
| MySQL | One ID per connection, shared by its queries. | `KILL QUERY` keeps the connection usable. `KILL CONNECTION` ends it. |
| HTTP Query | A new internal session and ID for each query submission. | Both cancel the target query. `KILL CONNECTION` does not end the HTTP client session or prevent new submissions. |

You can also get the current internal session ID with [CONNECTION_ID](../../20-sql-functions/15-context-functions/connection-id.md):

```sql
SELECT CONNECTION_ID();
```

For MySQL, you can obtain this ID before you run the target query on the same connection. For HTTP Query, a separate `SELECT CONNECTION_ID()` returns its own ID, not the ID of a later query. Use `system.processes` to find another running query's ID.

## Permissions and Scope

- SQL `KILL` requires the global `SUPER` privilege, including when you cancel your own query.
- You can issue `KILL` from a different session or connection. The target session does not have to belong to the current user.
- The command searches the current warehouse, including nodes in other clusters of that warehouse. It does not search other warehouses. Connect to the warehouse that runs the target query.
- The target session must still exist. If the server cannot find it, the command returns `Not found session id`.

## Examples

### Cancel a Query from the Process List

Find the target process:

```sql
SHOW PROCESSLIST;
```

Copy its `id` value, then cancel the query:

```sql
KILL QUERY 'e04dd121-88f4-4290-85be-2b45c6e3b011';
```

To terminate the session instead, use:

```sql
KILL CONNECTION 'e04dd121-88f4-4290-85be-2b45c6e3b011';
```

### Find the Process ID for a Query ID

From another connection to the same warehouse, find the running query:

```sql
SELECT id, current_query_id, user
FROM system.processes
WHERE current_query_id = '<query_id>';
```

Use the returned `id`, not `current_query_id`, in the cancel command:

```sql
KILL QUERY '<id_from_system_processes>';
```

If the query has finished or its internal session has closed, the lookup can return no rows. The lookup and cancel command are separate operations.
