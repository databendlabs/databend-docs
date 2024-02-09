---
title: CREATE USER
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.339"/>

Creates a SQL user, providing details such as the user's name, authentication type, and password. Optionally, you may set a password policy, network policy, and default role for the user.

See also:

 - [CREATE PASSWORD POLICY](../12-password-policy/create-password-policy.md)
 - [CREATE NETWORK POLICY](../12-network-policy/ddl-create-policy.md)
 - [GRANT](10-grant.md)

## Syntax

```sql
CREATE [ OR REPLACE ] USER <name> IDENTIFIED [ WITH <auth_type> ] BY '<password>' 
[ WITH SET PASSWORD POLICY = '<policy_name>' ] -- Set password policy
[ WITH SET NETWORK POLICY = '<policy_name>' ] -- Set network policy
[ WITH DEFAULT_ROLE = '<role_name>' ] -- Set default role
```

- *auth_type* can be `double_sha1_password` (default), `sha256_password` or `no_password`.
- When you set a default role for a user using CREATE USER or [ALTER USER](03-user-alter-user.md), Databend does not verify the role's existence or automatically grant the role to the user. You must explicitly grant the role to the user for the role to take effect.

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