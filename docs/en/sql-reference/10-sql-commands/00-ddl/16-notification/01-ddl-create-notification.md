---
title: CREATE NOTIFICATION INTEGRATION
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.949"/>

Creates a named notification integration that can send notifications to external messaging services.

**NOTICE:** This functionality works out of the box only in Databend Cloud.

## Syntax

### Webhook Notification

```sql
CREATE NOTIFICATION INTEGRATION [ IF NOT EXISTS ] <name>
  TYPE = WEBHOOK
  ENABLED = <bool>
  [ WEBHOOK = ( URL = '<url>', METHOD = '<method>', AUTHORIZATION_HEADER = '<header>' ) ]
  [ WEBHOOK_BODY_TEMPLATE = '<json_template>' ]
  [ COMMENT = '<string_literal>' ]
```

| Required Parameter | Description |
|--------------------|-------------|
| `name` | The name of the notification integration. |
| `TYPE` | The type of the notification integration. Currently, only `WEBHOOK` is supported. |
| `ENABLED` | Whether the notification integration is enabled. |

| Optional Parameter | Description |
|--------------------|-------------|
| `WEBHOOK` | The webhook connection settings. |
| `URL` | The URL of the webhook. |
| `METHOD` | The HTTP method for the webhook request. The default is `GET`. Use `POST` for Feishu, Slack, and DingTalk bots. |
| `AUTHORIZATION_HEADER` | The authorization header for the webhook request. |
| `WEBHOOK_BODY_TEMPLATE` | A JSON template for the request body. See [Webhook Body Template](#webhook-body-template). |
| `COMMENT` | A comment for the notification integration. |

`URL`, `METHOD`, and `AUTHORIZATION_HEADER` are properties inside `WEBHOOK = (...)`. `WEBHOOK_BODY_TEMPLATE` and `COMMENT` are top-level clauses.

## Webhook Body Template

Many messaging services require a JSON envelope. For example, a Feishu bot rejects a raw text body. Set `WEBHOOK_BODY_TEMPLATE` to wrap the notification message in the JSON body that the service expects.

`WEBHOOK_BODY_TEMPLATE` is a top-level clause. Do not put it inside `WEBHOOK = (...)`.

```sql
CREATE NOTIFICATION INTEGRATION feishu_alerts
  TYPE = WEBHOOK
  ENABLED = TRUE
  WEBHOOK = (
    URL = 'https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    METHOD = 'POST'
  )
  WEBHOOK_BODY_TEMPLATE = '{"msg_type":"text","content":{"text":"[DatabendAlert] DATABEND_WEBHOOK_MESSAGE"}}';
```

Template rules:

- The template must contain exactly one non-empty, valid JSON value. It can contain up to 65,536 bytes.
- `DATABEND_WEBHOOK_MESSAGE` is the message placeholder. It is case-sensitive and must use uppercase letters. It can appear more than once or not at all.
- The placeholder is replaced only inside JSON string values. Do not use it in object keys.
- The message is inserted as text and JSON-escaped. Quotes, newlines, and backslashes in the message do not break the JSON body. If the message contains the placeholder text, Databend does not expand it again.
- If the template does not contain the placeholder, Databend sends the fixed JSON body from the template.
- The rendered body can contain up to 262,144 bytes. If the body is larger, delivery fails and Databend does not send the HTTP request.
- Cloud Control writes object keys in sorted order. Do not depend on the key order in the template.
- Databend sends `Content-Type: application/json` automatically.

If you do not set a template, Databend sends the notification message as the request body. This behavior is unchanged for existing integrations.

`DESC NOTIFICATION INTEGRATION` and `system.notifications` show the template as the `body_template` property in `webhook_options` only when a template is set.

## Examples

### Webhook Notification

```sql
CREATE NOTIFICATION INTEGRATION IF NOT EXISTS SampleNotification
  TYPE = WEBHOOK
  ENABLED = TRUE
  WEBHOOK = (
    URL = 'https://example.com',
    METHOD = 'GET',
    AUTHORIZATION_HEADER = 'bearer auth'
  );
```

This example creates an enabled notification integration named `SampleNotification`. It sends notifications to `https://example.com` with the `GET` method and the `bearer auth` authorization header.

### Feishu Bot

```sql
CREATE NOTIFICATION INTEGRATION feishu_alerts
  TYPE = WEBHOOK
  ENABLED = TRUE
  WEBHOOK = (
    URL = 'https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    METHOD = 'POST'
  )
  WEBHOOK_BODY_TEMPLATE = '{"msg_type":"text","content":{"text":"[DatabendAlert] DATABEND_WEBHOOK_MESSAGE"}}'
  COMMENT = 'Feishu alerts for query errors';
```

### Slack

```sql
CREATE NOTIFICATION INTEGRATION slack_alerts
  TYPE = WEBHOOK
  ENABLED = TRUE
  WEBHOOK = (
    URL = 'https://hooks.slack.com/services/xxx/yyy/zzz',
    METHOD = 'POST'
  )
  WEBHOOK_BODY_TEMPLATE = '{"text":"DATABEND_WEBHOOK_MESSAGE"}';
```

## Related

- [Sending Notifications from SQL](/guides/cloud/administration/notifications)
- [SYSTEM$SEND_NOTIFICATION](/sql/sql-functions/table-functions/send-notification)
