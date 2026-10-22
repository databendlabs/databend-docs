---
title: ALTER USER
sidebar_position: 2
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: Unreleased"/>

Modifies a user account, including:

- Changing the user's password and authentication type.
- Setting or unsetting a password policy.
- Setting or unsetting a network policy.
- Setting or modifying the default role. If it is not explicitly set, Databend will default to using the built-in role `public` as the default role.

## Syntax

```sql
-- Modify password / authentication type
ALTER USER <name> IDENTIFIED [ WITH auth_type ] BY '<new_password>' [ WITH MUST_CHANGE_PASSWORD = true | false ]

-- Require user to modify password at next login
ALTER USER <name> WITH MUST_CHANGE_PASSWORD = true

-- Modify password for currently logged-in user
ALTER USER USER() IDENTIFIED BY '<new_password>'

-- Set password policy
ALTER USER <name> WITH SET PASSWORD POLICY = '<policy_name>'

-- Unset password policy
ALTER USER <name> WITH UNSET PASSWORD POLICY

-- Set network policy
ALTER USER <name> WITH SET NETWORK POLICY = '<policy_name>'

-- Unset network policy
ALTER USER <name> WITH UNSET NETWORK POLICY

-- Set default role
ALTER USER <name> WITH DEFAULT_ROLE = '<role_name>'

-- Enable or disable user
ALTER USER <name> WITH DISABLED = true | false

-- Set workload group
ALTER USER <name> WITH SET WORKLOAD GROUP = '<workload_group_name>'

-- Unset workload group
ALTER USER <name> WITH UNSET WORKLOAD GROUP      
```

- *auth_type* can be `double_sha1_password` (default), `sha256_password` or `no_password`.
- When `MUST_CHANGE_PASSWORD` is set to `true`, the user must change their password at the next login. Please note that this takes effect only for users who have never changed their password since their account was created. If a user has ever changed their password themselves, then they do not need to change it again.
- `ALTER USER ... WITH DEFAULT_ROLE` checks that the role exists and is already granted directly to the target user. It does not grant the role. If either check fails, the entire statement fails without changing the user, even if the executing user has the `GRANT` privilege.
- Changing the default role requires the global `ALTER` privilege. It does not require the `GRANT` privilege. Granting a missing role is a separate operation that requires `GRANT`.
- Changing the default role keeps all existing role grants. The built-in role `public` is available to every user and does not require an explicit grant. Selecting it does not add a role grant.
- Reassigning the same default role still checks that the role exists and is granted to the target user. Password changes and other unrelated updates do not restore a revoked default-role grant.
- Unlike `ALTER USER`, [CREATE USER](01-user-create-user.md) grants the specified default role when it creates the user.
- `DISABLED` allows you to enable or disable a user. Disabled users cannot log in to Databend until they are enabled. Click [here](01-user-create-user.md#example-5-creating-user-in-disabled-state) to see an example.


## Examples

### Example 1: Changing Password & Authentication Type

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';

SHOW USERS;
+-----------+----------+----------------------+---------------+
| name      | hostname | auth_type            | is_configured |
+-----------+----------+----------------------+---------------+
| user1     | %        | double_sha1_password | NO            |
+-----------+----------+----------------------+---------------+

ALTER USER user1 IDENTIFIED WITH sha256_password BY '123abc';

SHOW USERS;
+-------+----------+-----------------+---------------+
| name  | hostname | auth_type       | is_configured |
+-------+----------+-----------------+---------------+
| user1 | %        | sha256_password | NO            |
+-------+----------+-----------------+---------------+

ALTER USER 'user1' IDENTIFIED WITH no_password;

show users;
+-------+----------+-------------+---------------+
| name  | hostname | auth_type   | is_configured |
+-------+----------+-------------+---------------+
| user1 | %        | no_password | NO            |
+-------+----------+-------------+---------------+
```

### Example 2: Setting & Unsetting Network Policy

```sql
SHOW NETWORK POLICIES;

Name        |Allowed Ip List          |Blocked Ip List|Comment    |
------------+-------------------------+---------------+-----------+
test_policy |192.168.10.0,192.168.20.0|               |new comment|
test_policy1|192.168.100.0/24         |               |           |

CREATE USER user1 IDENTIFIED BY 'abc123';

ALTER USER user1 WITH SET NETWORK POLICY='test_policy';

ALTER USER user1 WITH SET NETWORK POLICY='test_policy1';

ALTER USER user1 WITH UNSET NETWORK POLICY;
```

### Example 3: Setting Default Role

1. Create the roles and user. Grant both roles to the user before selecting `writer` as the default:

```sql title='Connect as user "root":'
CREATE ROLE developer;
CREATE ROLE writer;
CREATE USER user1 IDENTIFIED BY 'abc123';

GRANT ROLE developer TO USER user1;
GRANT ROLE writer TO USER user1;

ALTER USER user1 WITH DEFAULT_ROLE = 'writer';
```

The user keeps both role grants. Only the default role changes to `writer`. If `writer` has not been granted to `user1`, the `ALTER USER` statement fails.

2. Verify the default role of user "user1" using the [SHOW ROLES](04-user-show-roles.md) command:

Connect again as `user1`:

```bash
bendsql --user user1 --password abc123
```

```sql
SHOW ROLES;
```

The `writer` row has `is_current` and `is_default` set to `true`. The list still includes `developer`.

### Example 2: Setting & Unsetting Workload Group

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';

ALTER USER user1 WITH SET WORKLOAD GROUP='wg';

ALTER USER user1 WITH SET WORKLOAD GROUP='wg1';

ALTER USER user1 WITH UNSET WORKLOAD GROUP;
```
