---
title: Access Control
---

Databend incorporates both [Role-Based Access Control (RBAC)](https://en.wikipedia.org/wiki/Role-based_access_control) and [Discretionary Access Control (DAC)](https://en.wikipedia.org/wiki/Discretionary_access_control) models for its access control functionality. This guide describes the related concepts and provides instructions on how to manage access control in Databend.

## Basic Concepts

When a user accesses a data object in Databend, they must be granted appropriate privileges or roles, or they need to have ownership of the data object. A data object can refer to various elements, such as a database, table, view, stage, or UDF.

![Alt text](/img/guides/access-control-1.png)

**Privileges** play a crucial role when interacting with data objects in Databend. These permissions, such as read, write, and execute, provide precise control over user actions, ensuring alignment with user requirements and maintaining data security.

**Roles** simplify access control. Roles are predefined sets of privileges assigned to users, streamlining permission management. Administrators can categorize users based on responsibilities, granting permissions efficiently without individual configurations.

**Ownership** in Databend is a specialized privilege for controlling data access. When a user owns a data object, they have the highest control level, dictating access permissions. This straightforward ownership model empowers users to manage their data, controlling who can access or modify it within the Databend environment.

## Managing Privileges

Users need specific privileges to perform particular actions in Databend. For example, to query a table, a user requires SELECT privileges, and to read a dataset in a Stage, READ privileges are necessary. 

![Alt text](/img/guides/access-control-2.png)

Databend offers varying levels of privileges for different types of data objects, allowing users to be granted appropriate permissions based on their specific needs. For more information, see [Access Control Privileges](/sql/sql-reference/access-control-privileges). Databend recommends exercising caution and granting the minimum necessary privileges for security considerations. Please carefully assess and configure user permissions based on their actual requirements. 

To manage privileges for a user or a role, use the following commands:

- [GRANT](/sql/sql-commands/ddl/user/grant)
- [REVOKE](/sql/sql-commands/ddl/user/revoke)
- [SHOW GRANTS](/sql/sql-commands/ddl/user/show-grants)

## Managing Roles

Roles in Databend play a pivotal role in simplifying the management of permissions. When multiple users require the same set of privileges, granting privileges individually can be cumbersome. Roles provide a solution by allowing the assignment of a set of privileges to a role, which can then be easily assigned to multiple users.

![Alt text](/img/guides/access-control-3.png)

When working with Databend, create user roles as needed. To manage user roles, use the following commands:

- [CREATE ROLE](/sql/sql-commands/ddl/user/user-create-role)
- [SET ROLE](/sql/sql-commands/ddl/user/user-set-role)
- [SHOW ROLES](/sql/sql-commands/ddl/user/user-show-roles)
- [GRANT](/sql/sql-commands/ddl/user/grant)
- [REVOKE](/sql/sql-commands/ddl/user/revoke)

### Inheriting Roles & Establishing Hierarchy

Databend roles introduce a potent mechanism through role granting, enabling one role to inherit permissions and responsibilities from another. This contributes to the creation of a flexible hierarchy, similar to the organizational structure, where two [Built-in Roles](#built-in-roles) exist: the highest being `account-admin` and the lowest being `public`.

Consider the scenario where three roles are created: *manager*, *engineer*, and *intern*. In this example, the role of *intern* is granted to the engineer *role*. Consequently, the *engineer* not only possesses their own set of privileges but also inherits those associated with the *intern* role. Extending this hierarchy further, if the *engineer* role is granted to the *manager*, the *manager* now acquires both the inherent privileges of the *engineer* and the *intern* roles.

![Alt text](/img/guides/access-control-4.png)

### Built-in Roles

Databend introduces two built-in roles:

- `account-admin`: Possesses all privileges, serves as the parent role for all other roles, and enables seamless switching to any role within the tenant.
- `public`: Inherits no permissions, considers all roles as its parent roles, and allows any role to switch to the public role. 

To assign the `account-admin` role to a user in Databend Cloud, select the role when inviting the user. You can also assign the role to a user after they join. If you're using Databend Community Edition or Enterprise Edition, configure an `account-admin` user during deployment first, and then assign the role to other users if needed. For more information about configuring admin users, see [Configuring Admin Users](/guides/deploy/admin-users).

### Setting Default Role

When a user is granted multiple roles, you can use the [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) or [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) commands to set a default role for that user. The default role determines the role automatically assigned to the user at the beginning of a session:

- Users have the flexibility to switch to other roles within a session using the [SET ROLE](/sql/sql-commands/ddl/user/user-set-role) command.
- A user can examine their current role and view all the roles granted to them by using the [SHOW ROLES](/sql/sql-commands/ddl/user/user-show-roles) command.
- If you don't explicitly set a default role for a user, Databend will default to using the built-in role `public` as the default role.

## Managing Ownership

Ownership is a specialized privilege that signifies the exclusive rights and responsibilities a role holds over a specific data object (currently including a database, table, UDF, and stage) within Databend. The ownership of an object is automatically granted to the current role of the user who creates it. Users who share the same role also have ownership of the object and can subsequently grant this ownership to other roles. To grant ownership to a role, use the [GRANT](/sql/sql-commands/ddl/user/grant) command.

- Ownership can only be granted to a role, and granting ownership to a user is not supported yet. Once granted from one role to another, the ownership is transferred to the new role.
- If a role that has ownership of an object is deleted, an account_admin can grant ownership of the object to another role.
- Ownership cannot be granted for tables in the `default` database, as it is owned by the built-in role `account_admin`.

Granting ownership to the built-in role `public` is not recommended for security reasons. If a user is in the `public` role when creating a object, then all users will have ownership of the object because each Databend user has the `public` role by default. Databend recommends creating and assigning customized roles to users instead of using the `public` role for clarified ownership management. The following example assigns the `account-admin` role to a new user and an existing user:

```sql
-- Grant the default role account_admin to an existing user as root
root> ALTER USER u1 WITH DEFAULT_ROLE = 'account_admin';
root> grant role u1 to writer;

-- Create a new user with the default role account_admin as root
root> create user u2 identified by '123' with DEFAULT_ROLE='account_admin';
root> grant role account_admin to u2;    
```

The ownership of an object can be revoked by an `account_admin` using the [REVOKE](/sql/sql-commands/ddl/user/revoke) command. Dropping an object will also revoke ownership. However, restoring (UNDROP, if available) a dropped object will NOT restore ownership. In this case, you will need an `account_admin` to grant ownership to a role again.