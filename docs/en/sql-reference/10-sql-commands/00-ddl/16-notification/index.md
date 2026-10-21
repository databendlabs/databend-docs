---
title: Notification
---

This page provides a comprehensive overview of Notification operations in Databend Cloud, organized by functionality for easy reference.

## Notification Management

| Command | Description |
|---------|-------------|
| [CREATE NOTIFICATION](01-ddl-create-notification.md) | Creates a new notification integration for event alerts |
| [ALTER NOTIFICATION](02-ddl-alter-notification.md) | Modifies an existing notification integration |
| [DROP NOTIFICATION](03-ddl-drop-notification.md) | Removes a notification integration |

## Notification Information

| Command | Description |
|---------|-------------|
| [DESCRIBE NOTIFICATION](04-desc-notification.md) | Shows the properties of a notification integration |

## Sending Notifications

| Command | Description |
|---------|-------------|
| [SYSTEM$SEND_NOTIFICATION](../../../20-sql-functions/17-table-functions/send-notification.md) | Sends a message through an existing notification integration |
| [Sending Notifications from SQL](/guides/cloud/administration/notifications) | Configures a Feishu bot and sends notifications from SQL |

:::note
Notifications in Databend Cloud allow you to configure webhook integrations, such as a Feishu custom bot, to receive alerts about database events and operations.
:::
