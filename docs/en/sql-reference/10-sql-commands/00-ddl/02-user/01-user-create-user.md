---
title: CREATE USER
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.703"/>

Creates a SQL user.

See also:

 - [CREATE PASSWORD POLICY](../12-password-policy/create-password-policy.md)
 - [CREATE NETWORK POLICY](../12-network-policy/ddl-create-policy.md)
 - [GRANT](10-grant.md)

## Syntax

```sql
CREATE [ OR REPLACE ] USER <name> IDENTIFIED [ WITH <auth_type> ] BY '<password>' 
[ WITH MUST_CHANGE_PASSWORD = true | false ]
[ WITH SET PASSWORD POLICY = '<policy_name>' ] -- Set password policy
[ WITH SET NETWORK POLICY = '<policy_name>' ] -- Set network policy
[ WITH SET WORKLOAD GROUP = '<workload_group_name>' ] -- Set workload group
[ WITH DEFAULT_ROLE = '<role_name>' ] -- Set default role
[ WITH DISABLED = true | false ] -- User created in a disabled state
```

- The `<name>` cannot contain the following illegal characters:
    - Single quote (')
    - Double quote (")
    - Backspace (\b)
    - Form feed (\f)
- *auth_type* can be `double_sha1_password` (default), `sha256_password` or `no_password`.
- When `MUST_CHANGE_PASSWORD` is set to `true`, the new user must change password at first login. Users can change their own password using the [ALTER USER](03-user-alter-user.md) command.
- When you set a default role for a user using CREATE USER or [ALTER USER](03-user-alter-user.md), Databend does not verify the role's existence or automatically grant the role to the user. You must explicitly grant the role to the user for the role to take effect.
- When `DISABLED` is set to `true`, the new user is created in a disabled state. Users in this state cannot log in to Databend until they are enabled. To enable or disable a created user, use the [ALTER USER](03-user-alter-user.md) command.

## Examples

### Example 1: Creating User with Default auth_type

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';

SHOW USERS;
+-----------+----------+----------------------+---------------+
| name      | hostname | auth_type            | is_configured |
+-----------+----------+----------------------+---------------+
| user1     | %        | double_sha1_password | NO            |
+-----------+----------+----------------------+---------------+
```

### Example 2: Creating User with sha256_password auth_type

```sql
CREATE USER user1 IDENTIFIED WITH sha256_password BY 'abc123';

SHOW USERS;
+-----------+----------+----------------------+---------------+
| name      | hostname | auth_type            | is_configured |
+-----------+----------+----------------------+---------------+
| user1     | %        | sha256_password      | NO            |
+-----------+----------+----------------------+---------------+
```

### Example 3: Creating User with Network Policy

```sql
CREATE USER user1 IDENTIFIED BY 'abc123' WITH SET NETWORK POLICY='test_policy';

SHOW USERS;
+-----------+----------+----------------------+---------------+
| name      | hostname | auth_type            | is_configured |
+-----------+----------+----------------------+---------------+
| user1     | %        | double_sha1_password | NO            |
+-----------+----------+----------------------+---------------+
```

### Example 4: Creating User with Default Role

1. Create a user named 'user1' with the default role set to 'manager':

```sql title='Connect as user "root":'
SHOW ROLES;

┌───────────────────────────────────────────────────────────┐
│      name     │ inherited_roles │ is_current │ is_default │
│     String    │      UInt64     │   Boolean  │   Boolean  │
├───────────────┼─────────────────┼────────────┼────────────┤
│ account_admin │               0 │ true       │ true       │
│ developer     │               0 │ false      │ false      │
│ public        │               0 │ false      │ false      │
└───────────────────────────────────────────────────────────┘

CREATE USER user1 IDENTIFIED BY 'abc123' WITH DEFAULT_ROLE = 'manager';

GRANT ROLE developer TO user1;
```

2. Verify the default role of user "user1" using the [SHOW ROLES](04-user-show-roles.md) command:

```sql title='Connect as user "user1":'
eric@Erics-iMac ~ % bendsql --user user1 --password abc123
Welcome to BendSQL 0.9.3-db6b232(2023-10-26T12:36:55.578667000Z).
Connecting to localhost:8000 as user user1.
Connected to DatabendQuery v1.2.271-nightly-0598a77b9c(rust-1.75.0-nightly-2023-12-26T11:29:04.266265000Z)

user1@localhost:8000/default> SHOW ROLES;

SHOW ROLES

┌───────────────────────────────────────────────────────┐
│    name   │ inherited_roles │ is_current │ is_default │
│   String  │      UInt64     │   Boolean  │   Boolean  │
├───────────┼─────────────────┼────────────┼────────────┤
│ developer │               0 │ true       │ true       │
│ public    │               0 │ false      │ false      │
└───────────────────────────────────────────────────────┘
2 rows read in 0.015 sec. Processed 0 rows, 0 B (0 rows/s, 0 B/s)
```

### Example 5: Creating User in Disabled State

This example creates a user named 'u1' in a disabled state, preventing login access. After enabling the user using the [ALTER USER](03-user-alter-user.md) command, login access is restored.

1. Create a user named 'u1' in the disabled state:

```sql
CREATE USER u1 IDENTIFIED BY '123' WITH DISABLED = TRUE;

SHOW USERS;

┌─────────────────────────────────────────────────────────────────────────────────────┐
│  name  │ hostname │       auth_type      │ is_configured │  default_role │ disabled │
├────────┼──────────┼──────────────────────┼───────────────┼───────────────┼──────────┤
│ root   │ %        │ no_password          │ YES           │ account_admin │ false    │
│ u1     │ %        │ double_sha1_password │ NO            │               │ true     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

2. Attempt to connect to Databend using BendSQL as user 'u1', resulting in an authentication error:

```shell
➜  ~ bendsql --user u1 --password 123
Welcome to BendSQL 0.16.0-homebrew.
Connecting to localhost:8000 as user u1.
Error: APIError: RequestError: Start Query failed with status 401 Unauthorized: {"error":{"code":"401","message":"AuthenticateFailure: user u1 is disabled. Not allowed to login"}}
```

3. Enable the user 'u1' with the [ALTER USER](03-user-alter-user.md) command:

```sql
ALTER USER u1 WITH DISABLED = FALSE;
```

4. Re-attempt connection to Databend as user 'u1', confirming successful login access:

```shell
➜  ~ bendsql --user u1 --password 123
Welcome to BendSQL 0.16.0-homebrew.
Connecting to localhost:8000 as user u1.
Connected to Databend Query v1.2.424-nightly-d3a89f708d(rust-1.77.0-nightly-2024-04-17T22:11:59.304509266Z)
```

### Example 6: Creating User with MUST_CHANGE_PASSWORD

In this example, we will create a user with the `MUST_CHANGE_PASSWORD` option. Then, we will connect to Databend with BendSQL as the new user and change the password.

1. Create a new user named 'eric' with the `MUST_CHANGE_PASSWORD` option set to `TRUE`.

```sql
CREATE USER eric IDENTIFIED BY 'abc123' WITH MUST_CHANGE_PASSWORD = TRUE;
```

2. Launch BendSQL and connect to Databend as the new user. Once connected, you'll see a message indicating that a password change is required. 

```bash
MacBook-Air:~ eric$ bendsql -ueric -pabc123
```

3. Change the password with the [ALTER USER](03-user-alter-user.md) command.

```bash
eric@localhost:8000/default> ALTER USER USER() IDENTIFIED BY 'abc456';
```

4. Quit BendSQL then reconnect with the new password.

```bash
MacBook-Air:~ eric$ bendsql -ueric -pabc456
Welcome to BendSQL 0.19.2-1e338e1(2024-07-17T09:02:28.323121000Z).
Connecting to localhost:8000 as user eric.
Connected to Databend Query v1.2.567-nightly-78d41aedc7(rust-1.78.0-nightly-2024-07-14T22:10:13.777450105Z)

eric@localhost:8000/default>
```