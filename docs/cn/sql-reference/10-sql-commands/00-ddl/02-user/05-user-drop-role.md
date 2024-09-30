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
* 如果一个角色被授予用户，Databend 无法自动从角色中移除这些授权。

## 示例

```sql
DROP ROLE role1;
```