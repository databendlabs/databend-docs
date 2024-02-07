---
title: Access Control Privileges
sidebar_label: Access Control Privileges
description:
  Databend Access Control Privileges
---

Databend leverages a role-based access control model to secure your data. In Databend, you can control which operations a user can perform on a specific database object (for example, database, table, view, stage, or UDF) by granting privileges to a role and then assigning the role to the user, or granting privileges to the user directly. The privileges granted to a user literally determine which operations the user can perform. To learn about the available commands for managing users and roles, as well as granting or revoking privileges, please refer to the  [Link](/sql/sql-commands/ddl/user/) 

Databend offers a range of privileges that allow you to exercise fine-grained control over your database objects. Databend privileges can be categorized into the following types:

- Global privileges: This set of privileges includes privileges that apply to the entire database management system, rather than specific objects within the system. Global privileges grant actions that affect the overall functionality and administration of the database, such as creating or deleting databases, managing users and roles, and modifying system-level settings. For which privileges are included, see [Global Privileges](#global-privileges).

- Object-specific privileges: Object-specific privileges come with different sets and each one applies to a specific database object. This includes:
  - [Table Privileges](#table-privileges)
  - [View Privileges](#view-privileges)
  - [Database Privileges](#database-privileges)
  - [Session Policy Privileges](#session-policy-privileges)
  - [Stage Privileges](#stage-privileges)
  - [UDF Privileges](#udf-privileges)
  - [Catalog Privileges](#catalog-privileges)
  - [Share Privileges](#share-privileges)

## All Privileges

| Privilege    | Object Type                   | Description                                                                                                                                        |
|:-------------|:------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------|
| ALL          | All                           | Grants all the privileges for the specified object type.                                                                                           |
| ALTER        | Global, Database, Table, View | Alters a database, table, user or UDF.                                                                                                             |
| CREATE       | Global, Database, Table       | Creates a database, table or UDF.                                                                                                                  |
| DELETE       | Table                         | Deletes or truncates rows in a table.                                                                                                              |
| DROP         | Global, Database, Table, View | Drops a database, table, view or UDF. Undrops a table.                                                                                             |
| INSERT       | Table                         | Inserts rows into a table.                                                                                                                         |
| SELECT       | Database, Table               | Selects rows from a table. Shows or uses a database.                                                                                               |
| UPDATE       | Table                         | Updates rows in a table.                                                                                                                           |
| GRANT        | Global                        | Grants / revokes privileges to / from a user or role.                                                                                              |
| SUPER        | Global, Table                 | Kills a query. Sets global configs. Optimizes a table. Analyzes a table. Operates a stage(Lists stages. Creates, Drops a stage), catalog or share. |
| USAGE        | Global                        | Synonym for “no privileges”.                                                                                                                       |
| CREATE ROLE  | Global                        | Creates a role.                                                                                                                                    |
| DROP ROLE    | Global                        | Drops a role.                                                                                                                                      |
| CREATE USER  | Global                        | Creates a SQL user.                                                                                                                                |
| DROP USER    | Global                        | Drops a SQL user.                                                                                                                                  |
| WRITE        | Stage                         | Write into a stage.                                                                                                                                |
| READ         | Stage                         | Read a stage.                                                                                                                                      |
| USAGE        | UDF                           | Use udf.                                                                                                                                           |

## Global Privileges

| Privilege  | Description                                                                                                       |
|:-----------|:------------------------------------------------------------------------------------------------------------------|
| ALL        | Grants all the privileges for the specified object type.                                                          |
| ALTER      | Adds or drops a table column. Alters a cluster key. Re-clusters a table.                                          |
| CREATEROLE | Creates a role.                                                                                                   |
| DROPUSER   | Drops a user.                                                                                                     |
| CREATEUSER | Creates a user.                                                                                                   |
| DROPROLE   | Drops a role.                                                                                                     |
| SUPER      | Kills a query. Sets or unsets a setting. Operates a stage, catalog or share. Calls a function. COPY INTO a stage. |
| USAGE      | Connects to a databend query only.                                                                                |
| CREATE     | Creates a UDF.                                                                                                    |
| DROP       | Drops a UDF.                                                                                                      |
| ALTER      | Alters a UDF. Alters a SQL user.                                                                                  |

## Table Privileges

| Privilege | Description                                                                                                      |
|:----------|:-----------------------------------------------------------------------------------------------------------------|
| ALL       | Grants all the privileges for the specified object type.                                                         |
| ALTER     | Adds or drops a table column. Alters a cluster key. Re-clusters a table.                                         |
| CREATE    | Creates a table.                                                                                                 |
| DELETE    | Deletes rows in a table. Truncates a table.                                                                      |
| DROP      | Drops or undrops a table. Restores the recent version of a dropped table.                                        |
| INSERT    | Inserts rows into a table. COPY INTO a table.                                                                    |
| SELECT    | Selects rows from a table. SHOW CREATE a table. DESCRIBE a table.                                                |
| UPDATE    | Updates rows in a table.                                                                                         |
| SUPER     | Optimizes or analyzes a table.                                                                                   |
| OWNERSHIP | Grants full control over a database.  Only a single role can hold this privilege on a specific object at a time. |

## View Privileges

| Privilege | Description                                                            |
|:----------|:-----------------------------------------------------------------------|
| ALL       | Grants all the privileges for the specified object type                |
| ALTER     | Creates or drops a view. Alters the existing view using another QUERY. |
| DROP      | Drops a view.                                                          |

## Database Privileges

Please note that you can use the [USE DATABASE](../10-sql-commands/00-ddl/00-database/ddl-use-database.md) command to specify a database once you have any of the following privileges to the database or any privilege to a table in the database.

| Privilege | Description                                                                                                      |
|:----------|:-----------------------------------------------------------------------------------------------------------------|
| Alter     | Renames a database.                                                                                              |
| CREATE    | Creates a database.                                                                                              |
| DROP      | Drops or undrops a database. Restores the recent version of a dropped database.                                  |
| SELECT    | SHOW CREATE a database.                                                                                          |
| OWNERSHIP | Grants full control over a database.  Only a single role can hold this privilege on a specific object at a time. |

## Session Policy Privileges

| Privilege | Description |
| :--                 | :--                  |
| SUPER       |    Kills a query. Sets or unsets a setting. |
| ALL   |  Grants all the privileges for the specified object type. |

## Stage Privileges

| Privilege | Description                                                                                                   |
|:----------|:--------------------------------------------------------------------------------------------------------------|
| WRITE     | Write into a stage. For example, copy into a stage, presign upload or removes a stage                         |
| READ      | Read a stage. For example, list stage, query stage, copy into table from stage, presign download              |
| ALL       | Grants READ, WRITE privileges for the specified object type.                                                  |
| OWNERSHIP | Grants full control over a stage.  Only a single role can hold this privilege on a specific object at a time. |

> Note:
>
> 1. Don't check external location auth.

## UDF Privileges

| Privilege | Description                                                                                                 |
|:----------|:------------------------------------------------------------------------------------------------------------|
| USAGE     | Can use UDF. For example, copy into a stage, presign upload                                                 |
| ALL       | Grants READ, WRITE privileges for the specified object type.                                                |
| OWNERSHIP | Grants full control over a UDF.  Only a single role can hold this privilege on a specific object at a time. |

> Note:
> 
> 1. Don't check the udf auth if it's already be constantly folded.
> 2. Don't check the udf auth if it's a value in insert.

## Catalog Privileges

| Privilege | Description                                              |
|:----------|:---------------------------------------------------------|
| SUPER     | SHOW CREATE catalog. Creates or drops a catalog.         |
| ALL       | Grants all the privileges for the specified object type. |

## Share Privileges

| Privilege | Description                                              |
|:----------|:---------------------------------------------------------|
| SUPER     | Creates, drops, or describes a share. Shows shares.      |
| ALL       | Grants all the privileges for the specified object type. |