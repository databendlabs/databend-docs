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

:::note
Databend Cloud 的通知功能支持配置电子邮件或 Slack 等外部服务集成，用于接收数据库事件及操作相关的告警。
:::