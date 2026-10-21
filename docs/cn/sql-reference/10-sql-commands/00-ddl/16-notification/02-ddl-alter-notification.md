---
title: ALTER NOTIFICATION INTEGRATION
sidebar_position: 2
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.949"/>

修改命名通知集成的设置，该集成用于向 Webhook 端点发送通知。

**注意：** 此功能仅在 Databend Cloud 中开箱即用。

## 语法

### Webhook 通知

每条语句只修改一个选项。其他选项保持当前值。

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

| 选项 | 说明 |
|------|------|
| `ENABLED` | 启用或禁用通知集成。 |
| `WEBHOOK` | 修改 Webhook 地址、方法或授权头。未指定的属性保持当前值。 |
| `WEBHOOK_BODY_TEMPLATE` | 设置或替换 JSON 请求体模板。 |
| `UNSET WEBHOOK_BODY_TEMPLATE` | 删除模板。之后的通知使用原始消息作为请求体。 |
| `COMMENT` | 修改备注。 |

## Webhook 请求体模板

使用 `SET WEBHOOK_BODY_TEMPLATE` 添加或替换模板：

```sql
ALTER NOTIFICATION INTEGRATION feishu_alerts
  SET WEBHOOK_BODY_TEMPLATE = '{"msg_type":"text","content":{"text":"[DatabendAlert] DATABEND_WEBHOOK_MESSAGE"}}';
```

使用 `UNSET WEBHOOK_BODY_TEMPLATE` 删除模板：

```sql
ALTER NOTIFICATION INTEGRATION feishu_alerts
  UNSET WEBHOOK_BODY_TEMPLATE;
```

`SET WEBHOOK_BODY_TEMPLATE = ''` 会报错。请使用 `UNSET` 清除模板。

模板规则与 [CREATE NOTIFICATION INTEGRATION](01-ddl-create-notification.md) 相同：

- 模板必须包含且仅包含一个非空、合法的 JSON 值，最大为 65,536 字节。
- `DATABEND_WEBHOOK_MESSAGE` 仅在 JSON 字符串值中替换。
- 渲染后的请求体最大为 262,144 字节。
- Databend 会自动发送 `Content-Type: application/json`。

修改其他选项不会清除模板。例如，以下语句只修改备注：

```sql
ALTER NOTIFICATION INTEGRATION feishu_alerts
  SET COMMENT = '查询错误的飞书告警';
```

## 示例

### 启用通知集成

```sql
ALTER NOTIFICATION INTEGRATION SampleNotification
  SET ENABLED = TRUE;
```

### 修改 Webhook 地址

```sql
ALTER NOTIFICATION INTEGRATION SampleNotification
  SET WEBHOOK = (URL = 'https://example.com/v2', METHOD = 'POST');
```

### 设置和清除模板

```sql
ALTER NOTIFICATION INTEGRATION feishu_alerts
  SET WEBHOOK_BODY_TEMPLATE = '{"msg_type":"text","content":{"text":"DATABEND_WEBHOOK_MESSAGE"}}';

ALTER NOTIFICATION INTEGRATION feishu_alerts
  UNSET WEBHOOK_BODY_TEMPLATE;
```

## 相关文档

- [CREATE NOTIFICATION INTEGRATION](01-ddl-create-notification.md)
- [DESCRIBE NOTIFICATION INTEGRATION](04-desc-notification.md)
- [通过 SQL 发送通知](/guides/cloud/administration/notifications)
