---
title: DESCRIBE NOTIFICATION INTEGRATION
sidebar_position: 4
---

显示通知集成的属性信息。

:::note
此命令需要启用 cloud control。
:::

## 语法

```sql
DESCRIBE NOTIFICATION INTEGRATION <name>
```

`DESC NOTIFICATION INTEGRATION <name>` 也可以作为同义写法使用。

## 输出

结果会包含通知的创建时间、名称、标识、类型、启用状态、webhook 选项和备注信息。

## 示例

```sql
DESCRIBE NOTIFICATION INTEGRATION error_notification;
```
