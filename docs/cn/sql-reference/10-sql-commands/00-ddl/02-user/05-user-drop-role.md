---
title: DROP ROLE
sidebar_position: 8
---

从系统中移除指定的角色。

## 语法

```sql
DROP ROLE [ IF EXISTS ] <role_name>
```

## 使用说明
* 如果某个角色已授予用户，Databend 无法自动从该角色中移除授权。

## 示例

```sql
DROP ROLE role1;
```