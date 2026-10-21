---
title: CREATE NOTIFICATION INTEGRATION
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.949"/>

创建一个命名的通知集成，用于向外部消息服务发送通知。

**注意：** 此功能仅在 Databend Cloud 中开箱即用。

## 语法

### Webhook 通知

```sql
CREATE NOTIFICATION INTEGRATION [ IF NOT EXISTS ] <name>
  TYPE = WEBHOOK
  ENABLED = <bool>
  [ WEBHOOK = ( URL = '<url>', METHOD = '<method>', AUTHORIZATION_HEADER = '<header>' ) ]
  [ WEBHOOK_BODY_TEMPLATE = '<json_template>' ]
  [ COMMENT = '<string_literal>' ]
```

| 必需参数 | 说明 |
|----------|------|
| `name` | 通知集成的名称。 |
| `TYPE` | 通知集成的类型。目前仅支持 `WEBHOOK`。 |
| `ENABLED` | 是否启用通知集成。 |

| 可选参数 | 说明 |
|----------|------|
| `WEBHOOK` | Webhook 连接设置。 |
| `URL` | Webhook 的 URL。 |
| `METHOD` | Webhook 请求使用的 HTTP 方法。默认为 `GET`。飞书、Slack 和钉钉机器人请使用 `POST`。 |
| `AUTHORIZATION_HEADER` | Webhook 请求使用的授权头。 |
| `WEBHOOK_BODY_TEMPLATE` | 请求体的 JSON 模板。参见本文的 Webhook 请求体模板一节。 |
| `COMMENT` | 通知集成的备注。 |

`URL`、`METHOD` 和 `AUTHORIZATION_HEADER` 是 `WEBHOOK = (...)` 中的属性。`WEBHOOK_BODY_TEMPLATE` 和 `COMMENT` 是顶层子句。

## Webhook 请求体模板

许多消息服务要求特定的 JSON 请求体。例如，飞书机器人不接受原始文本请求体。设置 `WEBHOOK_BODY_TEMPLATE`，将通知消息包装为服务要求的 JSON 请求体。

`WEBHOOK_BODY_TEMPLATE` 是顶层子句。不要将它放入 `WEBHOOK = (...)` 中。

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

模板规则：

- 模板必须包含且仅包含一个非空、合法的 JSON 值，最大为 65,536 字节。
- `DATABEND_WEBHOOK_MESSAGE` 是消息占位符。它区分大小写，必须使用大写字母。它可以出现多次，也可以不出现。
- 占位符仅在 JSON 字符串值中替换。不要在对象键中使用占位符。
- 消息作为文本插入，并进行 JSON 转义。消息中的引号、换行和反斜杠不会破坏 JSON 请求体。如果消息本身包含占位符文本，Databend 不会再次展开它。
- 如果模板不包含占位符，Databend 发送模板定义的固定 JSON 请求体。
- 渲染后的请求体最大为 262,144 字节。超过限制时投递失败，Databend 不发送 HTTP 请求。
- Cloud Control 按排序后的顺序输出对象键。不要依赖模板中的键顺序。
- Databend 会自动发送 `Content-Type: application/json`。

如果未设置模板，Databend 将通知消息作为请求体直接发送。现有集成的行为保持不变。

仅在设置了模板时，`DESC NOTIFICATION INTEGRATION` 和 `system.notifications` 才会在 `webhook_options` 中显示 `body_template` 属性。

## 示例

### Webhook 通知

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

此示例创建一个名为 `SampleNotification` 的已启用通知集成。它使用 `GET` 方法和 `bearer auth` 授权头，将通知发送到 `https://example.com`。

### 飞书机器人

```sql
CREATE NOTIFICATION INTEGRATION feishu_alerts
  TYPE = WEBHOOK
  ENABLED = TRUE
  WEBHOOK = (
    URL = 'https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    METHOD = 'POST'
  )
  WEBHOOK_BODY_TEMPLATE = '{"msg_type":"text","content":{"text":"[DatabendAlert] DATABEND_WEBHOOK_MESSAGE"}}'
  COMMENT = '查询错误的飞书告警';
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

## 相关文档

- [通过 SQL 发送通知](/guides/cloud/administration/notifications)
- [SYSTEM$SEND_NOTIFICATION](/sql/sql-functions/table-functions/send-notification)
