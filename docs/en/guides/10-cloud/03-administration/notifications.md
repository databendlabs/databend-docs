---
title: Sending Notifications from SQL
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.953"/>

Databend Cloud can send messages from SQL to a Feishu group through a custom bot. You store the webhook and the message format in a notification integration, then call [`system$send_notification`](/sql/sql-functions/table-functions/send-notification) from a query or a task.

This guide and its examples are verified with Feishu custom bots.

Use this feature for query error alerts, data quality checks, task results, or any message that a SQL statement can generate.

## Before You Begin

Confirm the following:

- Your role has the global `SUPER` privilege. If your role does not have it, ask an `account_admin` to run:

  ```sql
  GRANT SUPER ON *.* TO ROLE <role_name>;
  SYSTEM FLUSH PRIVILEGES;
  ```

  A task uses the privileges of its execution role.
- For the task example, you have an existing warehouse. The example uses `monitoring_wh`.
- You can add a custom bot to the target Feishu group.

## Values Used in This Guide

The examples use the following values. Replace them with your own values as you follow the steps.

| Value | In the examples | Replace with |
|-------|-----------------|--------------|
| Integration name | `feishu_alerts` | A name for your integration |
| Feishu webhook URL | `OPEN_FEISHU_URL` | The URL from Step 1 |
| Feishu keyword | `DatabendAlert` | The keyword from Step 1 |
| Warehouse | `monitoring_wh` | An existing warehouse |
| Message | `Query errors exceeded the threshold.` | Your alert text |

## Step 1: Configure the Feishu Bot

A Feishu custom bot can verify requests with a custom keyword, an IP allowlist, or a signature. Databend does not calculate a Feishu signature and cannot set arbitrary HTTP headers. Use the custom keyword method. If you want to use an IP allowlist, confirm the egress IP addresses with support first.

1. Open the target group in Feishu.
2. Open **Settings** > **Bots** > **Add Bot** > **Custom Bot**.
3. Enter a name and copy the webhook URL.
4. Open the security settings and select **Custom Keyword**.
5. Enter a keyword, for example `DatabendAlert`.
6. Save the bot.

You will use this keyword in Step 2. If you choose a different keyword, replace `DatabendAlert` in the template with your keyword.

The keyword must appear in the message text that Feishu receives.

Treat the webhook URL as a secret. Anyone who has the URL can post messages to the group.

### Optional: Test the Bot

If you have a terminal, confirm that the webhook URL and the keyword work before you configure Databend. Replace `OPEN_FEISHU_URL` and `DatabendAlert` before you run the command:

```bash
curl -X POST 'OPEN_FEISHU_URL' \
  -H 'Content-Type: application/json' \
  -d '{"msg_type":"text","content":{"text":"[DatabendAlert] test"}}'
```

Feishu should show `test` in the group. If it does not, correct the bot settings before you continue. The webhook URL is a secret. Do not run this command on a shared machine.

:::warning
With keyword verification, Feishu does not identify the sender of a message. The keyword is the only filter. If several systems post to the same bot, use a keyword that only Databend messages contain. If several Databend integrations use the same bot, they share the same keyword. Use different bots or add the integration name to the message when you need to tell them apart.
:::

## Step 2: Create the Notification Integration

Open a worksheet in the Databend Cloud console, select a warehouse, and run the following statement:

```sql
CREATE NOTIFICATION INTEGRATION feishu_alerts
  TYPE = WEBHOOK
  ENABLED = TRUE
  WEBHOOK = (
    URL = 'OPEN_FEISHU_URL',
    METHOD = 'POST'
  )
  WEBHOOK_BODY_TEMPLATE = '{"msg_type":"text","content":{"text":"[DatabendAlert] DATABEND_WEBHOOK_MESSAGE"}}';
```

Replace `OPEN_FEISHU_URL` with the webhook URL from Step 1. Replace `DatabendAlert` with your keyword. The template must contain the keyword you set in the bot.

The example does the following:

- `METHOD = 'POST'` is required for Feishu bot webhooks. The default method is `GET`.
- `WEBHOOK_BODY_TEMPLATE` defines the JSON body that Feishu expects. It is a top-level clause, not a property inside `WEBHOOK`.
- `DATABEND_WEBHOOK_MESSAGE` is replaced with the message text at delivery time.
- `[DatabendAlert]` is the Feishu keyword from Step 1. The template adds it to every message, so callers do not need to include it.
- Databend sends `Content-Type: application/json` automatically.

Feishu rejects a raw text body. If you do not set a template, Databend sends the message as the request body and Feishu does not accept it.

Verify the integration:

```sql
DESC NOTIFICATION INTEGRATION feishu_alerts;
```

Check that `enabled` is `true` and that `webhook_options` contains `body_template`. If `body_template` is missing, contact support.

`webhook_options` includes `body_template` only when a template is set:

```json
{"url":"OPEN_FEISHU_URL","method":"POST","authorization_header":"","body_template":"{\"msg_type\":\"text\",\"content\":{\"text\":\"[DatabendAlert] DATABEND_WEBHOOK_MESSAGE\"}}"}
```

The template also applies when you use this integration as a task's `ERROR_INTEGRATION`. In that case, the message is the task error payload described in [TASK ERROR INTEGRATION PAYLOAD](/sql/sql-commands/ddl/task/task-error-integration-payload). The payload is inserted as text and JSON-escaped by the template.

## Step 3: Send a Notification

```sql
CALL system$send_notification('feishu_alerts', 'Query errors exceeded the threshold.');
```

The statement returns a `result` column with zero rows. It does not return a delivery ID. A successful statement confirms that Databend Cloud accepted the message. It does not confirm delivery. Continue with Step 4 to check the delivery status.

`CALL` is a convenient form of:

```sql
SELECT * FROM send_notification('feishu_alerts', 'Query errors exceeded the threshold.');
```

Use the `SELECT` form inside `BEGIN ... END` scripts. `CALL` does not work there for two reasons:

- The script compiler rejects `CALL` statements with the error `CALL in script is not supported yet`.
- `CALL` arguments are literal constants. Databend does not evaluate them. An expression such as `CONCAT(...)` or a variable reference such as `:message` causes a syntax error. An identifier or a `$name` session variable is sent as plain text.

The `SELECT` form accepts any expression, including script variables.

## Step 4: Check Delivery Status

Query the notification history:

```sql
SELECT created_on, processed, integration_name, status, error_message
FROM system.notification_history
WHERE integration_name = 'feishu_alerts'
ORDER BY created_on DESC
LIMIT 10;
```

The row appears after Databend Cloud completes the delivery attempt. It is not written when Databend Cloud accepts the message. A new delivery can take a few seconds to appear. If the row is missing, wait and query again.

The `status` column shows `success` or `failure`. Databend Cloud records `success` when the webhook returns an HTTP status code from 200 to 399. It does not parse the response body.

:::warning
Feishu returns HTTP 200 with a business error when it rejects a message. Databend records this response as `success` because the HTTP request succeeded. Check the message and the bot keyword when Feishu does not show the message. Contact support with the query ID and time window if you need the webhook response.
:::

The history stores the original message, not the rendered request body. The current history view does not show a delivery ID or a query ID. Keep the query ID and the time window when you contact support. You can find the query ID in `system_history.query_history` or with `LAST_QUERY_ID()`.

## Send Notifications from a Task

Use `IF` to decide whether to send a message. Use the `SELECT` form inside the script. Replace `monitoring_wh` with an existing warehouse. Replace the query and the message with your own condition.

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

The script uses the variable in two ways:

- In a script expression, such as the `IF` condition, use the variable name: `failed_count`.
- In a SQL statement, such as the `SELECT`, prefix the variable with a colon: `:failed_count`. Without the colon, Databend treats the name as a column and returns `column failed_count doesn't exist`.

`system_history.query_history` requires the Query History feature. Replace the query with your own condition if this feature is not available.

Do not rely on `LIMIT 0`, `WHERE`, or other query optimizations to prevent a notification. The function has a side effect when the statement executes. Use `IF` in the script instead.

## Limitations

- **Asynchronous delivery:** SQL success means that Databend Cloud accepted the message. Delivery can fail later.
- **At-least-once delivery:** A lost response, an HTTP timeout, or a retry can produce duplicate messages. The query ID is not an idempotency key.
- **Business errors are not delivery failures:** Databend checks the HTTP status, not the service-specific response code. Feishu keyword errors can appear as `success`.
- **Feishu verification:** The integration does not support Feishu signature verification or arbitrary headers. Use the custom keyword method.
- **Global `SUPER` required:** Notification integrations do not have per-integration grants.
- **Size limits:** The message can contain 1 to 262,144 UTF-8 bytes. The template can contain up to 64 KiB. The rendered body can contain up to 256 KiB.
- **No delivery ID in SQL:** The function returns zero rows. Use the notification history for the final status.
- **Configuration changes:** Databend Cloud uses the latest URL and template at delivery time. Dropping and recreating an integration with the same name does not redirect queued messages to the new integration.
- **Disabling does not pause the queue:** Pending messages fail after the delivery retries are exhausted.

## Related

- [CREATE NOTIFICATION INTEGRATION](/sql/sql-commands/ddl/notification/ddl-create-notification)
- [ALTER NOTIFICATION INTEGRATION](/sql/sql-commands/ddl/notification/ddl-alter-notification)
- [DESCRIBE NOTIFICATION INTEGRATION](/sql/sql-commands/ddl/notification/desc-notification)
- [SYSTEM$SEND_NOTIFICATION](/sql/sql-functions/table-functions/send-notification)
