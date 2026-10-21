---
title: 通知（Notification）
---

本文全面概述了 Databend Cloud 中的通知操作，按功能分类组织以便查阅。

## 通知管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE NOTIFICATION](01-ddl-create-notification.md) | 创建新通知集成用于事件告警 |
| [ALTER NOTIFICATION](02-ddl-alter-notification.md) | 修改现有通知集成 |
| [DROP NOTIFICATION](03-ddl-drop-notification.md) | 删除通知集成 |

## 通知信息

| 命令 | 描述 |
|---------|-------------|
| [DESCRIBE NOTIFICATION](04-desc-notification.md) | 显示通知集成的属性信息 |

## 发送通知

| 命令 | 描述 |
|---------|-------------|
| [SYSTEM$SEND_NOTIFICATION](../../../20-sql-functions/17-table-functions/send-notification.md) | 通过现有通知集成发送消息 |
| [通过 SQL 发送通知](/guides/cloud/administration/notifications) | 配置飞书机器人或其他 Webhook，并从 SQL 发送通知 |

:::note
Databend Cloud 的通知功能支持配置飞书、Slack 或任意 HTTP 端点等外部服务集成，用于接收数据库事件及操作相关的告警。
:::
