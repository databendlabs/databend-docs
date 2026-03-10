---
title: 用户与角色
---

本页面全面介绍了 Databend 中的用户与角色操作，按功能分类以便查阅。

## 用户管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE USER](01-user-create-user.md) | 创建新用户账户 |
| [ALTER USER](03-user-alter-user.md) | 修改现有用户账户 |
| [DROP USER](02-user-drop-user.md) | 删除用户账户 |
| [DESC USER](01-user-desc-user.md) | 显示用户详细信息 |
| [SHOW USERS](02-user-show-users.md) | 列出系统所有用户 |

## 角色管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE ROLE](04-user-create-role.md) | 创建新角色 |
| [DROP ROLE](05-user-drop-role.md) | 删除角色 |
| [SET ROLE](04-user-set-role.md) | 设置当前会话的活动角色 |
| [SET SECONDARY ROLES](04-user-set-2nd-roles.md) | 设置会话的次要角色 |
| [SHOW ROLES](04-user-show-roles.md) | 列出系统所有角色 |

## 权限管理

| 命令 | 描述 |
|---------|-------------|
| [GRANT](10-grant.md) | 向角色授予权限 |
| [REVOKE](11-revoke.md) | 撤销角色的权限 |
| [SHOW GRANTS](22-show-grants.md) | 显示角色授权与用户角色分配 |

:::note
完善的用户与角色管理是数据库安全的核心。授予权限时请始终遵循最小权限原则。
:::
