---
title: 删除角色
sidebar_position: 8
---

从系统中移除指定的角色。

## 语法

```sql
DROP ROLE [ IF EXISTS ] <role_name>
```

## 使用说明

- 如果角色已被授权给用户，Databend 不会自动从角色中移除这些授权。

## 示例

```sql
DROP ROLE role1;
```
