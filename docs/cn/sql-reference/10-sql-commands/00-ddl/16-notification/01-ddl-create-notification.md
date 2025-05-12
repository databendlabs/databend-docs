---
title: CREATE NOTIFICATION INTEGRATION
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.371"/>

创建一个命名的通知集成，可用于向外部消息服务发送通知。

**注意：** 此功能仅在 Databend Cloud 中开箱即用。

## 语法
### Webhook 通知

```sql
CREATE NOTIFICATION INTEGRATION [ IF NOT EXISTS ] <name>
TYPE = <type>
ENABLED = <bool>
[ WEBHOOK = ( url = <string_literal>, method = <string_literal>, authorization_header = <string_literal> ) ]
[ COMMENT = '<string_literal>' ]
```

| 必需参数 | 描述 |
|---------------------|-------------|
| name                | 通知集成的名称。这是一个必填字段。 |
| type                | 通知集成的类型。目前，仅支持 `webhook`。 |
| enabled             | 是否启用通知集成。 |

| 可选参数 [(Webhook)](#webhook-notification) | 描述 |
|---------------------|-------------|
| url                 | Webhook 的 URL。 |
| method              | 发送 webhook 时使用的 HTTP 方法。默认为 `GET` |
| authorization_header| 发送 webhook 时使用的授权标头。 |

## 示例

### Webhook 通知

```sql
CREATE NOTIFICATION INTEGRATION IF NOT EXISTS SampleNotification type = webhook enabled = true webhook = (url = 'https://example.com', method = 'GET', authorization_header = 'bearer auth')
```

此示例创建一个名为 `SampleNotification` 的 `webhook` 类型通知集成，该集成已启用，并使用 `GET` 方法和 `bearer auth` 授权标头将通知发送到 `https://example.com` URL。