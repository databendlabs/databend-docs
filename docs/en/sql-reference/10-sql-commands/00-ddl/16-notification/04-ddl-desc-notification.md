---
title: DESCRIBE NOTIFICATION INTEGRATION
sidebar_position: 4
---

Shows the properties of a notification integration.

:::note
This command requires cloud control to be enabled.
:::

## Syntax

```sql
DESCRIBE NOTIFICATION INTEGRATION <name>
```

`DESC NOTIFICATION INTEGRATION <name>` is accepted as a synonym.

## Output

The result includes the notification's creation time, name, identifier, type, enabled state, webhook options, and comment.

## Example

```sql
DESCRIBE NOTIFICATION INTEGRATION error_notification;
```
