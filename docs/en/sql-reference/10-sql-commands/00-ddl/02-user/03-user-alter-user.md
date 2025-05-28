---
title: ALTER USER
sidebar_position: 2
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.566"/>

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
- When you set a default role for a user using [CREATE USER](01-user-create-user.md) or ALTER USER, Databend does not verify the role's existence or automatically grant the role to the user. You must explicitly grant the role to the user for the role to take effect.
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

1. Create a user named "user1" and set the default role as "writer":

```sql title='Connect as user "root":'

root@localhost:8000/default> CREATE USER user1 IDENTIFIED BY 'abc123';

CREATE USER user1 IDENTIFIED BY 'abc123'

0 row written in 0.074 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)

root@localhost:8000/default> GRANT ROLE developer TO user1;

GRANT ROLE developer TO user1

0 row read in 0.018 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)

root@localhost:8000/default> GRANT ROLE writer TO user1;

GRANT ROLE writer TO user1

0 row read in 0.013 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)

root@localhost:8000/default> ALTER USER user1 WITH DEFAULT_ROLE = 'writer';

ALTER user user1 WITH DEFAULT_ROLE = 'writer'

0 row written in 0.019 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)
```

2. Verify the default role of user "user1" using the [SHOW ROLES](04-user-show-roles.md) command:

```sql title='Connect as user "user1":'
eric@Erics-iMac ~ % bendsql --user user1 --password abc123
Welcome to BendSQL 0.9.3-db6b232(2023-10-26T12:36:55.578667000Z).
Connecting to localhost:8000 as user user1.
Connected to DatabendQuery v1.2.271-nightly-0598a77b9c(rust-1.75.0-nightly-2023-12-26T11:29:04.266265000Z)

user1@localhost:8000/default> show roles;

SHOW roles

┌───────────────────────────────────────────────────────┐
│    name   │ inherited_roles │ is_current │ is_default │
│   String  │      UInt64     │   Boolean  │   Boolean  │
├───────────┼─────────────────┼────────────┼────────────┤
│ developer │               0 │ false      │ false      │
│ public    │               0 │ false      │ false      │
│ writer    │               0 │ true       │ true       │
└───────────────────────────────────────────────────────┘
3 rows read in 0.010 sec. Processed 0 rows, 0 B (0 rows/s, 0 B/s)
```

### Example 2: Setting & Unsetting Workload Group

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';

ALTER USER user1 WITH SET WORKLOAD GROUP='wg';

ALTER USER user1 WITH SET WORKLOAD GROUP='wg1';

ALTER USER user1 WITH UNSET WORKLOAD GROUP;
```