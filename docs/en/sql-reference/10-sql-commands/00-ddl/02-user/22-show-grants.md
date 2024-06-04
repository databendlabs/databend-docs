---
title: SHOW GRANTS
sidebar_position: 10
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.487"/>

Lists privileges explicitly granted to a user, to a role, or on a specific object.

See also:

- [SHOW_GRANTS](/sql/sql-functions/table-functions/show-grants)
- [GRANT](10-grant.md)
- [REVOKE](11-revoke.md)

## Syntax

```sql
-- List privileges granted to a user
SHOW GRANTS FOR <user_name> [ LIKE '<pattern>' | WHERE <expr> | LIMIT <limit> ]

-- List privileges granted to a role
SHOW GRANTS FOR ROLE <role_name> [ LIKE '<pattern>' | WHERE <expr> | LIMIT <limit> ]

-- List privileges granted on an object
SHOW GRANTS ON { STAGE | TABLE | DATABASE | UDF } <object_name> [ LIKE '<pattern>' | WHERE <expr> | LIMIT <limit> ]
```

## Examples

This example illustrates how to list privileges granted to a user, a role, and on a specific object.

```sql
-- Create a new user
CREATE USER 'user1' IDENTIFIED BY 'password';

-- Create a new role
CREATE ROLE analyst;

-- Grant the analyst role to the user
GRANT ROLE analyst TO 'user1';

-- Create a database
CREATE DATABASE my_db;

-- Grant privileges on the database to the role
GRANT OWNERSHIP ON my_db.* TO ROLE analyst;

-- List privileges granted to the user
SHOW GRANTS FOR user1;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ privileges │ object_name │     object_id    │ grant_to │  name  │                         grants                        │
├────────────┼─────────────┼──────────────────┼──────────┼────────┼───────────────────────────────────────────────────────┤
│ OWNERSHIP  │ my_db       │               16 │ USER     │ user1  │ GRANT OWNERSHIP ON 'default'.'my_db'.* TO 'user1'@'%' │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- List privileges granted to the role
SHOW GRANTS FOR ROLE analyst;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ privileges │ object_name │     object_id    │ grant_to │   name  │                          grants                          │
├────────────┼─────────────┼──────────────────┼──────────┼─────────┼──────────────────────────────────────────────────────────┤
│ OWNERSHIP  │ my_db       │               16 │ ROLE     │ analyst │ GRANT OWNERSHIP ON 'default'.'my_db'.* TO ROLE `analyst` │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
-- List privileges granted on the database
SHOW GRANTS ON DATABASE my_db;

┌─────────────────────────────────────────────────────────────────────────────────────┐
│ privileges │ object_name │     object_id    │ grant_to │   name  │      grants      ├────────────┼─────────────┼──────────────────┼──────────┼─────────┼──────────────────┤
│ OWNERSHIP  │ my_db       │               16 │ ROLE     │ analyst │                  │
└─────────────────────────────────────────────────────────────────────────────────────┘
```