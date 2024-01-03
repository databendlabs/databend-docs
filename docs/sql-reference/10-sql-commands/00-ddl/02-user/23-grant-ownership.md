---
title: GRANT OWNERSHIP
sidebar_position: 13
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.275"/>

Grants ownership of a specific database objects, such as tables, stages, or user-defined functions, to a specified role. 

- Ownership cannot be granted for tables in the `default` database, as it is owned by the built-in role `account_admin`.
- Granting ownership to the built-in role `public` is not supported for security reasons.

See also: [REVOKE OWNERSHIP](24-revoke-ownership.md)

## Syntax

```sql
-- Grant ownership of a specific table within a database to a role
GRANT OWNERSHIP ON <database_name>.<table_name> TO ROLE '<role_name>'

-- Grant ownership of a stage to a role
GRANT OWNERSHIP ON STAGE <stage_name> TO ROLE '<role_name>'

-- Grant ownership of a user-defined function (UDF) to a role
GRANT OWNERSHIP ON UDF <udf_name> TO ROLE '<role_name>'
```

## Examples

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