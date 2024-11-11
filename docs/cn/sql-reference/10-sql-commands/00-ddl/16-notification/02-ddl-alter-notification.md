---
title: ALTER NOTIFICATION INTEGRATION
sidebar_position: 2
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.371"/>

修改用于向外部消息服务发送通知的命名通知集成设置。

**注意：** 此功能仅在 Databend Cloud 中开箱即用。

## 语法
### Webhook 通知

```sql
ALTER NOTIFICATION INTEGRATION [ IF NOT EXISTS ] <name> SET
    [ ENABLED = TRUE | FALSE ]
    [ WEBHOOK = ( url = <string_literal>, method = <string_literal>, authorization_header = <string_literal> ) ]
    [ COMMENT = '<string_literal>' ]
```

| 必需参数 | 描述 |
|---------------------|-------------|
| name                | 通知集成的名称。这是一个必填字段。 |


| 可选参数 [(Webhook)](#webhook-notification) | 描述 |
|---------------------|-------------|
| enabled             | 通知集成是否启用。 |
| url                 | Webhook 的 URL。 |
| method              | 发送 Webhook 时使用的 HTTP 方法。默认是 `GET` |
| authorization_header| 发送 Webhook 时使用的授权头。 |
| comment             | 与通知集成关联的注释。 |

## 示例

### Webhook 通知

```sql
ALTER NOTIFICATION INTEGRATION SampleNotification SET enabled = true
```

此示例启用了名为 `SampleNotification` 的通知集成。