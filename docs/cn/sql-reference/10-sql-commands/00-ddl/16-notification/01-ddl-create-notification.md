---
title: 创建通知集成
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.371"/>

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

| 必填参数 | 描述 |
|---------------------|-------------|
| name                | 通知集成的名称。这是一个必填字段。 |
| type                | 通知集成的类型。目前仅支持 `webhook`。 |
| enabled             | 是否启用通知集成。 |

| 可选参数 [(Webhook)](#webhook-通知) | 描述 |
|---------------------|-------------|
| url                 | Webhook 的 URL。 |
| method              | 发送 Webhook 时使用的 HTTP 方法。默认为 `GET`。|
| authorization_header| 发送 Webhook 时使用的授权头。 |

## 示例

### Webhook 通知

```sql
CREATE NOTIFICATION INTEGRATION IF NOT EXISTS SampleNotification type = webhook enabled = true webhook = (url = 'https://example.com', method = 'GET', authorization_header = 'bearer auth')
```

此示例创建了一个名为 `SampleNotification` 的 `webhook` 类型的通知集成，该集成已启用，并使用 `GET` 方法和 `bearer auth` 授权头向 `https://example.com` URL 发送通知。