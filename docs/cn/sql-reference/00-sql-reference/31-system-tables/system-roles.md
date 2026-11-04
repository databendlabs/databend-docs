---
title: system.roles
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.957"/>

包含当前会话可见的角色元数据。

## 可见性

具有全局 `GRANT` 权限的会话可以读取租户内的所有角色。其他会话只能看到当前用户可用的角色。可用角色包括直接授予的角色、继承的角色和隐式可用的 `public` 角色。

全局 `GRANT` 的例外规则适用于 `system.roles`。即使会话具有全局 `GRANT` 权限，[SHOW ROLES](/sql/sql-commands/ddl/user/user-show-roles) 仍只列出当前用户可用的角色。

## 字段

| 字段 | 类型 | 说明 |
|-------|------|-------------|
| `name` | String | 角色名称。 |
| `inherited_roles` | UInt64 | 直接授予此角色的角色数量。 |
| `inherited_roles_name` | String | 这些角色的名称，按顺序排列并以逗号分隔。 |
| `created_on` | Timestamp | 角色创建时间。 |
| `update_on` | Timestamp | 角色更新时间。 |

## 示例

```sql
SELECT name, inherited_roles, inherited_roles_name
FROM system.roles
ORDER BY name;
```
