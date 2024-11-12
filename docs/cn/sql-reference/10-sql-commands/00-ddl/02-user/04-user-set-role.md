---
title: SET ROLE
sidebar_position: 5
---

切换会话的当前活动角色，可以使用 [SHOW ROLES](04-user-show-roles.md) 命令查看当前活动角色，`is_current` 字段表示当前活动角色。有关活动角色和次要角色的更多信息，请参阅 [Active Role & Secondary Roles](/guides/security/access-control/roles#active-role--secondary-roles)。

另请参阅：[SET SECONDARY ROLES](04-user-set-2nd-roles.md)

## 语法

```sql
SET ROLE <role_name>
```

## 示例

```sql
SHOW ROLES;

┌───────────────────────────────────────────────────────┐
│    name   │ inherited_roles │ is_current │ is_default │
├───────────┼─────────────────┼────────────┼────────────┤
│ developer │               0 │ false      │ false      │
│ public    │               0 │ false      │ false      │
│ writer    │               0 │ true       │ true       │
└───────────────────────────────────────────────────────┘

SET ROLE developer;

SHOW ROLES;

┌───────────────────────────────────────────────────────┐
│    name   │ inherited_roles │ is_current │ is_default │
├───────────┼─────────────────┼────────────┼────────────┤
│ developer │               0 │ true       │ false      │
│ public    │               0 │ false      │ false      │
│ writer    │               0 │ false      │ true       │
└───────────────────────────────────────────────────────┘
```