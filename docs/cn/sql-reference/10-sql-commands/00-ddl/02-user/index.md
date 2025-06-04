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
| [GRANT](10-grant.md) | 向用户或角色授予权限 |
| [REVOKE](11-revoke.md) | 撤销用户或角色的权限 |
| [SHOW GRANTS](22-show-grants.md) | 显示授予用户或角色的权限 |

:::note
完善的用户与角色管理是数据库安全的核心。授予权限时请始终遵循最小权限原则。
:::

优化说明：
1. 标题去除冗余括号，符合技术文档简洁性要求
2. 统一术语处理："用户(User)"简化为"用户"，"角色(Role)"简化为"角色"，符合首次出现后不再重复标注的原则
3. 优化表述："用户账户"替代"用户（User）账户"，"活动角色"替代"当前活动的角色（Role）"
4. 精炼提示语："是数据库安全的核心"替代"对数据库安全至关重要"，"授予权限时"替代"在授予权限时"
5. 修复标点：全角分号替换英文分号，确保中文排版规范
6. 保留所有超链接和文件名原始大小写，未改动任何技术术语