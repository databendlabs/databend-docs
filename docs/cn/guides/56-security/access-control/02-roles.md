---
title: 角色
---

角色在 Databend 中发挥着至关重要的作用，简化了权限管理。当多个用户需要相同的一组权限时，单独授予权限可能会很麻烦。角色为这种场景提供了一个有效解决方案：允许将一组权限分配给某个角色，然后再将这个角色轻松地分配给多个用户。

![Alt text](/img/guides/access-control-3.png)

## 继承角色 & 建立层级

Databend 角色通过角色授权引入了一种强大的机制，使一个角色能够继承另一个角色的权限和责任。这有助于创建一个灵活的层级结构，类似于组织结构，其中存在两个 [内置角色](#built-in-roles) ：最高级别的角色是 `account-admin`，最低级别的角色是 `public`。

考虑这样一个场景，现在我们创建了三个角色：manager、engineer 和 intern ，并且将 intern 角色授予给 engineer 角色。此时，engineer 不仅拥有自己的一组权限，还继承了与 intern 角色相关的权限。进一步扩展这个层级结构，如果 engineer 角色被授予给 manager，那么 manager 就同时获得了 engineer 和 intern 角色的固有权限。

![Alt text](/img/guides/access-control-4.png)

## 内置角色 {#built-in-roles}

Databend 引入了两个内置角色：

| 内置角色      | 描述                                                                       |
| ------------- | -------------------------------------------------------------------------- |
| account-admin | 拥有所有权限，作为所有其他角色的父角色，并允许在租户内无缝切换到任何角色。 |
| public        | 不继承任何权限，将所有角色视为其父角色，并允许任何角色切换到 public 角色。 |

要在 Databend Cloud 中将 `account-admin` 角色分配给用户，请在邀请用户时选择该角色。您也可以在用户加入后分配角色。如果您使用的是 Databend 社区版或企业版，请在部署时预先配置一个 `account-admin` 用户，然后根据需要将角色分配给其他用户。有关配置管理员用户的更多信息，请参见[配置管理员用户](../../10-deploy/04-references/01-admin-users.md)。

## 设置默认角色

当用户被授予多个角色时，您可以使用 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 或 [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) 命令为该用户设置默认角色。默认角色决定了用户在会话开始时自动被分配的角色：

```sql title='Example:'
-- Show existing roles in the system
SHOW ROLES;

┌───────────────────────────────────────────────────────────┐
│      name     │ inherited_roles │ is_current │ is_default │
├───────────────┼─────────────────┼────────────┼────────────┤
│ account_admin │               0 │ true       │ true       │
│ public        │               0 │ false      │ false      │
│ writer        │               0 │ false      │ false      │
└───────────────────────────────────────────────────────────┘

-- Create a user 'eric' with the password 'abc123' and set 'writer' as the default role
CREATE USER eric IDENTIFIED BY 'abc123' WITH DEFAULT_ROLE = 'writer';

-- Grant the 'account_admin' role to the user 'eric'
GRANT ROLE account_admin TO eric;

-- Set 'account_admin' as the default role for user 'eric'
ALTER USER eric WITH DEFAULT_ROLE = 'account_admin';
```

- 用户可以在会话中使用 [SET ROLE](/sql/sql-commands/ddl/user/user-set-role) 命令切换到其他角色。
- 用户可以使用 [SHOW ROLES](/sql/sql-commands/ddl/user/user-show-roles) 命令检查他们当前的角色并查看授予他们的所有角色。
- 如果您没有为用户明确设置默认角色，Databend 将默认使用内置角色 `public` 作为默认角色。

## 管理角色

在使用 Databend 时，根据需要创建用户角色。要管理用户角色，请使用以下命令：

- [CREATE ROLE](/sql/sql-commands/ddl/user/user-create-role)
- [SET ROLE](/sql/sql-commands/ddl/user/user-set-role)
- [SHOW ROLES](/sql/sql-commands/ddl/user/user-show-roles)
- [GRANT](/sql/sql-commands/ddl/user/grant)
- [REVOKE](/sql/sql-commands/ddl/user/revoke)

这个示例展示了基于角色的权限管理。首先，创建角色 'writer' 并为其授予需要的权限。随后，将这个角色分配给用户 'eric'，他会继承角色对应的权限。最后，撤销此前授予 'writer' 角色的所有权限，以展示角色对用户权限的影响。

```sql title='Example:'
-- Create a new role named 'writer'
CREATE ROLE writer;

-- Grant all privileges on all objects in the 'default' schema to the role 'writer'
GRANT ALL ON default.* TO ROLE writer;

-- Create a new user named 'eric' with the password 'abc123'
CREATE USER eric IDENTIFIED BY 'abc123';

-- Grant the role 'writer' to the user 'eric'
GRANT ROLE writer TO eric;

-- Show the granted privileges for the user 'eric'
SHOW GRANTS FOR eric;

┌──────────────────────────────────────────────────┐
│                      Grants                      │
├──────────────────────────────────────────────────┤
│ GRANT ALL ON 'default'.'default'.* TO 'eric'@'%' │
└──────────────────────────────────────────────────┘

-- Revoke all privileges on all objects in the 'default' schema from role 'writer'
REVOKE ALL ON default.* FROM ROLE writer;

-- Show the granted privileges for the user 'eric'
-- No privileges are displayed as they have been revoked from the role
SHOW GRANTS FOR eric;
```
