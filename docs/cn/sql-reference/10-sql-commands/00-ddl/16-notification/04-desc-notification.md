---
title: DESCRIBE NOTIFICATION INTEGRATION
sidebar_position: 4
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.949"/>

显示通知集成的属性信息。

:::note
此命令仅在 Databend Cloud 中可用。
:::

## 语法

```sql
DESCRIBE NOTIFICATION INTEGRATION <name>
```

`DESC NOTIFICATION INTEGRATION <name>` 也可以作为同义写法使用。

## 输出

结果包含一行，列如下：

| 列 | 类型 | 说明 |
|----|------|------|
| `created_on` | Timestamp | 通知集成的创建时间。 |
| `name` | String | 通知集成的名称。 |
| `id` | UInt64 | 通知集成的内部 ID。 |
| `type` | String | 集成类型。目前只有 `webhook`。 |
| `enabled` | Boolean | 通知集成是否已启用。 |
| `webhook_options` | Variant | Webhook 设置。 |
| `comment` | String | 通知集成的备注。 |

`webhook_options` 包含以下属性：

| 属性 | 说明 |
|------|------|
| `url` | Webhook 地址。 |
| `method` | HTTP 方法。 |
| `authorization_header` | 授权头。 |
| `body_template` | JSON 请求体模板。仅在设置了模板时出现。 |

## 示例

```sql
DESCRIBE NOTIFICATION INTEGRATION feishu_alerts;
```

输出：

| created_on | name | id | type | enabled | webhook_options | comment |
|------------|------|----|------|---------|-----------------|---------|
| 2026-10-20 10:00:00.000000 | feishu_alerts | 12 | webhook | true | `{"url":"OPEN_FEISHU_URL","method":"POST","authorization_header":"","body_template":"{\"msg_type\":\"text\",\"content\":{\"text\":\"[DatabendAlert] DATABEND_WEBHOOK_MESSAGE\"}}"}` | 查询错误的飞书告警 |

## 相关文档

- [CREATE NOTIFICATION INTEGRATION](01-ddl-create-notification.md)
- [ALTER NOTIFICATION INTEGRATION](02-ddl-alter-notification.md)
- [通过 SQL 发送通知](/guides/cloud/administration/notifications)
