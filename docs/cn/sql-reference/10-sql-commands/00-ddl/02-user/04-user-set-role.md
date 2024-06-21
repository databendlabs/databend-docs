---
title: SET ROLE
sidebar_position: 5
---

切换当前会话的活动角色，当前活动角色可通过[SHOW ROLES](04-user-show-roles.md)命令查看，其中`is_current`字段指示当前活动角色。关于活动角色和辅助角色的更多信息，请参阅[活动角色与辅助角色](/guides/security/access-control/roles#活动角色--辅助角色)。

另请参见：[SET SECONDARY ROLES](04-user-set-2nd-roles.md)

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