---
title: SYSTEM$SEND_NOTIFICATION
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.953"/>

Sends a message through an existing notification integration. Databend Cloud accepts the message and queues it for asynchronous delivery. The SQL statement succeeds after Databend Cloud accepts the message. It does not wait for the webhook request.

**NOTICE:** This function is available only in Databend Cloud.

## Syntax

```sql
CALL system$send_notification('<integration_name>', '<message>');
```

You can also call the underlying table function directly:

```sql
SELECT * FROM send_notification('<integration_name>', '<message>');
```

`CALL system$send_notification(...)` is rewritten to the equivalent `SELECT * FROM send_notification(...)` statement.

`CALL` has the following restrictions. Use the `SELECT` form when they apply:

- `CALL` arguments are literal constants. Databend does not evaluate them. An expression such as `CONCAT(...)` or a variable reference such as `:message` causes a syntax error. An identifier or a `$name` session variable is sent as plain text.
- `CALL` is not supported inside `BEGIN ... END` scripts. The script compiler returns the error `CALL in script is not supported yet`.

## Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `integration_name` | Yes | The name of an existing and enabled notification integration. |
| `message` | Yes | The message text. The message must contain between 1 and 262,144 UTF-8 bytes. |

Both parameters must be strings. `NULL`, an empty integration name, and an empty message are rejected.

## Return Value

The function returns one column named `result` of type `STRING` and zero rows. It does not return a delivery ID or a delivery status.

## Required Privileges

The current user must have the global `SUPER` privilege. For a task, the task execution role must have the global `SUPER` privilege.

## Behavior

- The function submits a notification only when the statement executes. `EXPLAIN` and `EXPLAIN PIPELINE` do not send a notification.
- Databend disables the query result cache for statements that use this function. You do not need to change the cache settings.
- One statement submits one notification, even when the query runs on multiple nodes.
- SQL success means that Databend Cloud accepted the message. It does not mean that the webhook delivered the message.
- Databend Cloud retries webhook delivery with a limit. The final result is recorded in `system.notification_history`.
- The enqueue request is not retried automatically. A network error can return an SQL error after Databend Cloud has already accepted the message. A retry can create a duplicate. Check the notification history and allow time for delivery before you retry.
- Delivery can be duplicated. Databend Cloud records the query ID for correlation. The query ID is not an idempotency key.
- The integration must exist and be enabled. Otherwise, the statement fails and no delivery is created.
- Databend Cloud uses the latest integration configuration at delivery time. If you change the URL or template after the message is accepted, the new configuration applies.
- A queued message is bound to the integration ID. If you drop the integration and create a new integration with the same name, queued messages for the old integration fail.
- If you disable an integration, Databend Cloud does not pause queued messages. Pending messages fail after the delivery retries are exhausted.
- If the deployment does not support active notifications, the statement returns an error.

## Examples

### Send a Message

```sql
CALL system$send_notification('feishu_alerts', 'Query errors exceeded the threshold.');
```

### Use the Table Function Form

```sql
SELECT * FROM send_notification('feishu_alerts', 'Daily load completed.');
```

### Send a Notification from a Task

Use the `SELECT` form inside a script. In a SQL statement inside the script, prefix a variable with a colon, such as `:failed_count`. In a script expression, such as an `IF` condition, use the variable name without the colon. Use `IF` to control whether a notification is sent. Do not use `LIMIT`, `WHERE`, or other query optimizations to suppress the call.

```sql
CREATE TASK notify_query_errors
  WAREHOUSE = 'monitoring_wh'
  SCHEDULE = 5 MINUTE
AS
EXECUTE IMMEDIATE $$
BEGIN
    LET failed_count := (
        SELECT count(*)
        FROM system_history.query_history
        WHERE event_time >= now() - INTERVAL 10 MINUTE
          AND log_type = 3
    );

    IF failed_count > 0 THEN
        SELECT * FROM send_notification(
            'feishu_alerts',
            CONCAT('Query errors in the last 10 minutes: ', TO_STRING(:failed_count))
        );
    END IF;
END;
$$;
```

`system_history.query_history` requires the Query History feature. Replace the query with your own condition if this feature is not available.

### Check Delivery Status

```sql
SELECT created_on, processed, integration_name, status, error_message
FROM system.notification_history
WHERE integration_name = 'feishu_alerts'
ORDER BY created_on DESC
LIMIT 10;
```

The `status` column shows `success` or `failure`. A `success` status means that the webhook returned an HTTP status code from 200 to 399. It does not mean that the receiving service accepted the message. For example, Feishu can return HTTP 200 with a business error code.

## Related

- [CREATE NOTIFICATION INTEGRATION](../../10-sql-commands/00-ddl/16-notification/01-ddl-create-notification.md)
- [ALTER NOTIFICATION INTEGRATION](../../10-sql-commands/00-ddl/16-notification/02-ddl-alter-notification.md)
- [Sending Notifications from SQL](/guides/cloud/administration/notifications)
