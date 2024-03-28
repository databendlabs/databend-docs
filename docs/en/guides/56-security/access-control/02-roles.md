---
title: Roles
---

Roles in Databend play a pivotal role in simplifying the management of permissions. When multiple users require the same set of privileges, granting privileges individually can be cumbersome. Roles provide a solution by allowing the assignment of a set of privileges to a role, which can then be easily assigned to multiple users.

:::note
At present, Databend does not enforce Role-Based Access Control (RBAC) checks by default for User Defined Functions (UDFs) and stages. However, if you require RBAC for these objects, you have the option to enable it globally by manually setting `SET GLOBAL enable_experimental_rbac_check=1`.

If `enable_experimental_rbac_check` is not manually set to `1`, UDFs and Stages will operate without RBAC restrictions. In other words, users will have unrestricted access to execute UDFs and access data within stages without undergoing RBAC permission checks.
:::

![Alt text](/img/guides/access-control-3.png)

## Inheriting Roles & Establishing Hierarchy

Databend roles introduce a potent mechanism through role granting, enabling one role to inherit permissions and responsibilities from another. This contributes to the creation of a flexible hierarchy, similar to the organizational structure, where two [Built-in Roles](#built-in-roles) exist: the highest being `account-admin` and the lowest being `public`.

Consider the scenario where three roles are created: *manager*, *engineer*, and *intern*. In this example, the role of *intern* is granted to the engineer *role*. Consequently, the *engineer* not only possesses their own set of privileges but also inherits those associated with the *intern* role. Extending this hierarchy further, if the *engineer* role is granted to the *manager*, the *manager* now acquires both the inherent privileges of the *engineer* and the *intern* roles.

![Alt text](/img/guides/access-control-4.png)

## Built-in Roles

Databend comes with the following built-in roles:

| Built-in Role | Description                                                                                                                            |
|---------------|----------------------------------------------------------------------------------------------------------------------------------------|
| account-admin | Possesses all privileges, serves as the parent role for all other roles, and enables seamless switching to any role within the tenant. |
| public        | Inherits no permissions, considers all roles as its parent roles, and allows any role to switch to the public role.                    |

To assign the `account-admin` role to a user in Databend Cloud, select the role when inviting the user. You can also assign the role to a user after they join. If you're using Databend Community Edition or Enterprise Edition, configure an `account-admin` user during deployment first, and then assign the role to other users if needed. For more information about configuring admin users, see [Configuring Admin Users](../../10-deploy/04-references/01-admin-users.md).

## Setting Default Role

When a user is granted multiple roles, you can use the [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) or [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) commands to set a default role for that user. The default role determines the role automatically assigned to the user at the beginning of a session:

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

- Users have the flexibility to switch to other roles within a session using the [SET ROLE](/sql/sql-commands/ddl/user/user-set-role) command.
- A user can examine their current role and view all the roles granted to them by using the [SHOW ROLES](/sql/sql-commands/ddl/user/user-show-roles) command.
- If you don't explicitly set a default role for a user, Databend will default to using the built-in role `public` as the default role.

## Working with Roles

When working with Databend, create user roles as needed. To manage user roles, use the following commands:

- [CREATE ROLE](/sql/sql-commands/ddl/user/user-create-role)
- [SET ROLE](/sql/sql-commands/ddl/user/user-set-role)
- [SHOW ROLES](/sql/sql-commands/ddl/user/user-show-roles)
- [GRANT](/sql/sql-commands/ddl/user/grant)
- [REVOKE](/sql/sql-commands/ddl/user/revoke)

This example showcases role-based permission management. Initially, a 'writer' role is created and granted privileges. Subsequently, these privileges are assigned to the user 'eric', who inherits them. Lastly, the permissions are revoked from the role, demonstrating their impact on the user's privileges.

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