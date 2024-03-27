---
title: Ownership
---

Ownership is a specialized privilege that signifies the exclusive rights and responsibilities a role holds over a specific data object (currently including a database, table, UDF, and stage) within Databend. The ownership of an object is automatically granted to the current role of the user who creates it.

## Granting Ownership

The ownership of an object can be granted from one role to another. Once it is granted from one role to another, the ownership is transferred to the new role.

- Granting ownership to the built-in role `public` is not recommended for security reasons. If a user is in the `public` role when creating a object, then all users will have ownership of the object because each Databend user has the `public` role by default. Databend recommends creating and assigning customized roles to users instead of using the `public` role for clarified ownership management.
- If a role that has ownership of an object is deleted, an account_admin can grant ownership of the object to another role.
- Ownership cannot be granted for tables in the `default` database, as it is owned by the built-in role `account_admin`.

Dropping an object will revoke ownership from the owner role. However, restoring (UNDROP, if available) a dropped object will NOT restore ownership. In this case, you will need an `account_admin` to grant ownership to a role again.

## Examples

To grant ownership to a role, use the [GRANT](/sql/sql-commands/ddl/user/grant) command. These examples demonstrate granting ownership of different database objects to the role 'data_owner':

```sql
-- Grant ownership of all tables in the 'finance_data' database to the role 'data_owner'
GRANT OWNERSHIP ON finance_data.* TO ROLE 'data_owner';

-- Grant ownership of the table 'transactions' in the 'finance_data' schema to the role 'data_owner'
GRANT OWNERSHIP ON finance_data.transactions TO ROLE 'data_owner';

-- Grant ownership of the stage 'ingestion_stage' to the role 'data_owner'
GRANT OWNERSHIP ON STAGE ingestion_stage TO ROLE 'data_owner';

-- Grant ownership of the user-defined function 'calculate_profit' to the role 'data_owner'
GRANT OWNERSHIP ON UDF calculate_profit TO ROLE 'data_owner';
```

This example highlights the management of ownership within a database by creating roles and assigning them to users. The roles are granted permissions, and subsequently, users are granted these roles. This setup enables users to own and operate on tables within a specific schema. However, access to tables not owned by the assigned role is restricted.

```sql
-- Admin creates roles and assigns roles to corresponding users
CREATE ROLE role1;
CREATE USER u1 IDENTIFIED BY '123' WITH DEFAULT ROLE 'role1';
GRANT CREATE ON db.* TO ROLE role1;
GRANT ROLE role1 TO u1;

-- After u1 logs into atabend, role1 has been granted to u1, so u1 can create and own tables under db:
u1> CREATE TABLE db.t(id INT);
u1> INSERT INTO db.t VALUES(1);
u1> SELECT * FROM db.t;
u1> SELECT * FROM db.t_old_exists; -- Fails because the owner of this table is not role1
```