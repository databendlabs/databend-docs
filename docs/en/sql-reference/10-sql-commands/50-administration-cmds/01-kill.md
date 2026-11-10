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

- `KILL QUERY` cancels the current query without closing the session.
- `KILL CONNECTION` terminates the session and cancels its current query.

### Process ID

`process_id` is the `id` column returned by `SHOW PROCESSLIST` or `system.processes`. It identifies an internal server session. Earlier documentation calls this value `session_id`. The placeholder name does not change the SQL syntax.

Do not use a query ID, an operating system process ID (PID), or an HTTP client session ID as `process_id`.

The lifetime of this ID depends on the connection protocol:

| Protocol | Lifetime of `system.processes.id` |
|----------|----------------------------------|
| MySQL | The ID stays the same for queries on the same connection. |
| HTTP Query | Each new query submission creates a new internal server session and ID, even when it uses the same HTTP client session. |

For HTTP Query, the client session ID in `X-Databend-Session-Id` or the response `session_id` field is not this internal server session ID. To cancel an HTTP query by its query ID, see [HTTP API: Cancel Query](/developer/apis/http#cancel-query).

## Permissions and Scope

- SQL `KILL` requires the global `SUPER` privilege, including when you cancel your own query.
- You can issue `KILL` from a different session or connection. The target session does not have to belong to the current user.
- The command searches the current warehouse, including nodes in other clusters of that warehouse. It does not search other warehouses. Connect to the warehouse that runs the target query.
- The target session must still exist. If the server cannot find it, the command returns `Not found session id`.

:::caution
`KILL QUERY` targets the query that runs in the specified session when the command executes. It does not check a query ID. If a reused session starts another query before `KILL QUERY` executes, the command can cancel that query instead.
:::

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
