---
title: REVOKE OWNERSHIP
sidebar_position: 14
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.275"/>

Revokes ownership of a specific database objects, such as tables, stages, or user-defined functions, from a specified role.

See also: [GRANT OWNERSHIP](23-grant-ownership.md)

## Syntax

```sql
-- Revoke ownership of a specific table within a database from a role
REVOKE OWNERSHIP ON <database_name>.<table_name> FROM ROLE '<role_name>'

-- Revoke ownership of a stage from a role
REVOKE OWNERSHIP ON STAGE <stage_name> FROM ROLE '<role_name>'

-- Revoke ownership of a user-defined function (UDF) from a role
REVOKE OWNERSHIP ON UDF <udf_name> FROM ROLE '<role_name>'
```

## Examples

```sql
-- Revoke ownership of all tables in the 'finance_data' database from the role 'data_owner'
REVOKE OWNERSHIP ON finance_data.* FROM ROLE 'data_owner';

-- Revoke ownership of the table 'transactions' in the 'finance_data' schema from the role 'data_owner'
REVOKE OWNERSHIP ON finance_data.transactions FROM ROLE 'data_owner';

-- Revoke ownership of the stage 'ingestion_stage' from the role 'data_owner'
REVOKE OWNERSHIP ON STAGE ingestion_stage FROM ROLE 'data_owner';

-- Revoke ownership of the user-defined function 'calculate_profit' from the role 'data_owner'
REVOKE OWNERSHIP ON UDF calculate_profit FROM ROLE 'data_owner';
```