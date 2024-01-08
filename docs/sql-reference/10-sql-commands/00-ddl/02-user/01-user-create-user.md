---
title: CREATE USER
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.30"/>

Creates a SQL user, providing details such as the user's name, authentication type, and password. Optionally, you may specify a [network policy](../12-network-policy/index.md) and set a [default role](/guides/security/access-control#setting-default-role) for the user.

See also:
 - [CREATE NETWORK POLICY](../12-network-policy/ddl-create-policy.md)
 - [GRANT PRIVILEGES TO USER](./10-grant-privileges.md)
 - [GRANT ROLE TO USER](./20-grant-role.md)

## Syntax

```sql
CREATE USER <name> IDENTIFIED [WITH <auth_type> ] BY '<password>' 
[WITH SET NETWORK POLICY='<network_policy>'] -- Set network policy
[WITH DEFAULT_ROLE='<role_name>'] -- Set default role
```

*auth_type* can be `double_sha1_password` (default), `sha256_password` or `no_password`.

:::tip

In order to make MySQL client/drivers existing tools easy to connect to Databend, we support two authentication plugins which is same as MySQL server did:
* double_sha1_password
   * mysql_native_password is one of MySQL authentication plugin(long time ago), this plugin uses double_sha1_password to store the password(SHA1(SHA1(password)).
    
* sha256_password
  * caching_sha2_password is a new default authentication plugin starting with MySQL-8.0.4, it uses sha256 to transform the password.

For more information about MySQL authentication plugins, see [A Tale of Two Password Authentication Plugins](https://dev.mysql.com/blog-archive/a-tale-of-two-password-authentication-plugins/).
:::

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

This example creates a user named 'user1' with the default role set to 'manager':

```sql
SHOW ROLES;

┌───────────────────────────────────────────────────────────┐
│      name     │ inherited_roles │ is_current │ is_default │
├───────────────┼─────────────────┼────────────┼────────────┤
│ account_admin │               0 │ true       │ true       │
│ manager       │               0 │ false      │ false      │
│ public        │               0 │ false      │ false      │
└───────────────────────────────────────────────────────────┘

CREATE USER user1 IDENTIFIED BY 'abc123' WITH DEFAULT_ROLE = 'manager';
```