---
title: DESCRIBE NOTIFICATION INTEGRATION
sidebar_position: 4
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.949"/>

Shows the properties of a notification integration.

:::note
This command requires Cloud Control to be enabled.
:::

## Syntax

```sql
DESCRIBE NOTIFICATION INTEGRATION <name>
```

`DESC NOTIFICATION INTEGRATION <name>` is accepted as a synonym.

## Output

The result contains one row with these columns:

| Column | Type | Description |
|--------|------|-------------|
| `created_on` | Timestamp | The creation time of the integration. |
| `name` | String | The name of the integration. |
| `id` | UInt64 | The internal ID of the integration. |
| `type` | String | The integration type. Currently, `webhook` is the only value. |
| `enabled` | Boolean | Whether the integration is enabled. |
| `webhook_options` | Variant | The webhook settings. |
| `comment` | String | The comment on the integration. |

`webhook_options` contains these properties:

| Property | Description |
|----------|-------------|
| `url` | The webhook URL. |
| `method` | The HTTP method. |
| `authorization_header` | The authorization header. |
| `body_template` | The JSON body template. This property appears only when a template is set. |

## Example

```sql
DESCRIBE NOTIFICATION INTEGRATION feishu_alerts;
```

Output:

| created_on | name | id | type | enabled | webhook_options | comment |
|------------|------|----|------|---------|-----------------|---------|
| 2026-10-20 10:00:00.000000 | feishu_alerts | 12 | webhook | true | `{"url":"https://open.feishu.cn/open-apis/bot/v2/hook/...","method":"POST","authorization_header":"","body_template":"{\"msg_type\":\"text\",\"content\":{\"text\":\"[DatabendAlert] DATABEND_WEBHOOK_MESSAGE\"}}"}` | Feishu alerts for query errors |

## Related

- [CREATE NOTIFICATION INTEGRATION](01-ddl-create-notification.md)
- [ALTER NOTIFICATION INTEGRATION](02-ddl-alter-notification.md)
- [Sending Notifications from SQL](/guides/cloud/administration/notifications)
