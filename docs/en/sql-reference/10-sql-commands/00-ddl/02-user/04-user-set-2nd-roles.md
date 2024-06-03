---
title: SET SECONDARY ROLES
sidebar_position: 6
---

Activates all secondary roles for the current session. This means that all secondary roles granted to the user will be active, extending the user's privileges. For more information about the active role and secondary roles, see [Active Role & Secondary Roles](/guides/security/access-control/roles#active-role--secondary-roles).

Seel also: [SET ROLE](04-user-set-role.md)

## Syntax

```sql
SET SECONDARY ROLES { ALL | NONE }
```

| Parameter | Default | Description                                                                                                                                                                                     |
|-----------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ALL       | Yes     | Activates all secondary roles granted to the user for the current session, in addition to the active role. This enables the user to utilize the privileges associated with all secondary roles. |
| NONE      | No      | Deactivates all secondary roles for the current session, meaning only the active role's privileges are active. This restricts the user's privileges to those granted by the active role alone.  |

## Examples

This example shows how secondary roles work and how to active/deactivate them.

1. Creating roles as user root.

First, let's create two roles, `admin` and `analyst`:

```bash
root@localhost:8000/default> CREATE ROLE admin;

CREATE ROLE admin

0 row written in 0.017 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)

root@localhost:8000/default> CREATE ROLE analyst;

CREATE ROLE analyst

0 row written in 0.014 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)
```

2. Granting privileges.

Next, let's grant some privileges to each role. For example, we'll grant the `admin` role the ability to create databases, and the `analyst` role the ability to select from tables:

```bash
root@localhost:8000/default> GRANT CREATE DATABASE ON *.* TO ROLE admin;

GRANT CREATE DATABASE ON *.* TO ROLE admin

0 row read in 0.022 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)

root@localhost:8000/default> GRANT SELECT ON *.* TO ROLE analyst;

GRANT
SELECT
  ON *.* TO ROLE analyst

0 row read in 0.018 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)
```

3. Creating a user.

Now, let's create a user:

```bash
root@localhost:8000/default> CREATE USER 'user1' IDENTIFIED BY 'password';

CREATE USER 'user1' IDENTIFIED BY 'password'

0 row written in 0.017 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)
```

4. Assigning roles.

Assign both roles to the user:

```bash
root@localhost:8000/default> GRANT ROLE admin TO 'user1';

GRANT role admin TO 'user1'

0 row read in 0.018 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)

root@localhost:8000/default> GRANT ROLE analyst TO 'user1';

GRANT role analyst TO 'user1'

0 row read in 0.017 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)
```

5. Setting active role. 

Now, let's log in to Databend as `user1`, the set the active role to `analyst`.

```bash
MacBook-Air:~ eric$ bendsql -uuser1 -ppassword
Welcome to BendSQL 0.12.5-61a19d7(2024-01-25T02:44:25.884223000Z).
Connecting to localhost:8000 as user user1.
Connected to Databend Query v1.2.473-nightly-8d6ebafcbb(rust-1.78.0-nightly-2024-05-17T22:14:28.630843178Z)

user1@localhost:8000/default> SET ROLE analyst;

SET
  ROLE analyst

0 row read in 0.014 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)
```

All secondary roles are activated by default, so we can create a new database:

```bash
user1@localhost:8000/default> CREATE DATABASE my_db;

CREATE DATABASE my_db

0 row written in 0.033 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)
```

6. Deactivate secondary roles.

The active role `analyst` does not have the CREATE DATABASE privilege. When all secondary roles are deactivated, creating a new database will fail.

```bash
user1@localhost:8000/default> SET SECONDARY ROLES NONE;

SET
  SECONDARY ROLES NONE

0 row read in 0.018 sec. Processed 0 row, 0 B (0 row/s, 0 B/s)

user1@localhost:8000/default> CREATE DATABASE my_db2;
error: APIError: ResponseError with 1063: Permission denied: privilege [CreateDatabase] is required on *.* for user 'user1'@'%' with roles [analyst,public]
```