---
title: system.users
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.957"/>

包含当前会话可见的 SQL 用户元数据。[SHOW USERS](/sql/sql-commands/ddl/user/user-show-users) 从此表读取数据。

## 可见性

可见性过滤于 v1.2.957 引入：

- 具有全局 `GRANT` 权限的会话可以看到租户内的所有用户。
- 其他会话只能看到用户名和 hostname 均与当前用户匹配的账户。
- 配置文件中的用户的 hostname 为 `%`，并遵循相同的过滤规则。

`GRANT` 权限可以来自生效角色的权限或直接授予用户的权限。过滤不会删除或禁用隐藏的账户。

## 示例

```sql
SELECT name, hostname, auth_type, is_configured, default_role, roles
FROM system.users
ORDER BY name, hostname;
```

有关输出字段和用户管理示例，请参阅 [SHOW USERS](/sql/sql-commands/ddl/user/user-show-users)。
