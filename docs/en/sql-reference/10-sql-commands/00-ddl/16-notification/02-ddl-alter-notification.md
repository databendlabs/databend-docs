---
title: ALTER NOTIFICATION INTEGRATION
sidebar_position: 2
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.949"/>

Modifies the settings of a named notification integration that can send notifications to external messaging services.

**NOTICE:** This functionality works out of the box only in Databend Cloud.

## Syntax

### Webhook Notification

Each statement changes one option. Other options keep their current values.

```sql
ALTER NOTIFICATION INTEGRATION [ IF EXISTS ] <name> SET ENABLED = <bool>

ALTER NOTIFICATION INTEGRATION [ IF EXISTS ] <name>
  SET WEBHOOK = ( URL = '<url>', METHOD = '<method>', AUTHORIZATION_HEADER = '<header>' )

ALTER NOTIFICATION INTEGRATION [ IF EXISTS ] <name>
  SET WEBHOOK_BODY_TEMPLATE = '<json_template>'

ALTER NOTIFICATION INTEGRATION [ IF EXISTS ] <name>
  UNSET WEBHOOK_BODY_TEMPLATE

ALTER NOTIFICATION INTEGRATION [ IF EXISTS ] <name>
  SET COMMENT = '<string_literal>'
```

| Option | Description |
|--------|-------------|
| `ENABLED` | Enables or disables the notification integration. |
| `WEBHOOK` | Changes the webhook URL, method, or authorization header. Omitted properties keep their current values. |
| `WEBHOOK_BODY_TEMPLATE` | Sets or replaces the JSON body template. |
| `UNSET WEBHOOK_BODY_TEMPLATE` | Removes the template. Later notifications use the original message as the request body. |
| `COMMENT` | Changes the comment. |

## Webhook Body Template

Use `SET WEBHOOK_BODY_TEMPLATE` to add or replace a template:

```sql
ALTER NOTIFICATION INTEGRATION feishu_alerts
  SET WEBHOOK_BODY_TEMPLATE = '{"msg_type":"text","content":{"text":"[DatabendAlert] DATABEND_WEBHOOK_MESSAGE"}}';
```

Use `UNSET WEBHOOK_BODY_TEMPLATE` to remove it:

```sql
ALTER NOTIFICATION INTEGRATION feishu_alerts
  UNSET WEBHOOK_BODY_TEMPLATE;
```

`SET WEBHOOK_BODY_TEMPLATE = ''` is an error. Use `UNSET` to clear the template.

The template rules are the same as for [CREATE NOTIFICATION INTEGRATION](01-ddl-create-notification.md#webhook-body-template):

- The template must contain exactly one non-empty, valid JSON value. It can contain up to 65,536 bytes.
- `DATABEND_WEBHOOK_MESSAGE` is replaced only inside JSON string values.
- The rendered body can contain up to 262,144 bytes.
- Databend sends `Content-Type: application/json` automatically.

Changing another option does not clear the template. For example, this statement changes only the comment:

```sql
ALTER NOTIFICATION INTEGRATION feishu_alerts
  SET COMMENT = 'Feishu alerts for query errors';
```

## Examples

### Enable a Notification Integration

```sql
ALTER NOTIFICATION INTEGRATION SampleNotification
  SET ENABLED = TRUE;
```

### Change the Webhook URL

```sql
ALTER NOTIFICATION INTEGRATION SampleNotification
  SET WEBHOOK = (URL = 'https://example.com/v2', METHOD = 'POST');
```

### Set and Clear a Template

```sql
ALTER NOTIFICATION INTEGRATION feishu_alerts
  SET WEBHOOK_BODY_TEMPLATE = '{"msg_type":"text","content":{"text":"DATABEND_WEBHOOK_MESSAGE"}}';

ALTER NOTIFICATION INTEGRATION feishu_alerts
  UNSET WEBHOOK_BODY_TEMPLATE;
```

## Related

- [CREATE NOTIFICATION INTEGRATION](01-ddl-create-notification.md)
- [DESCRIBE NOTIFICATION INTEGRATION](04-desc-notification.md)
- [Sending Notifications from SQL](/guides/cloud/administration/notifications)
