---
title: Share
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="Introduced or updated: v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

A Share gives other tenants read-only access to selected FUSE tables. Databend does not copy the data.

For the requirements, the procedures, and the privileges, see the [Data Sharing guide](/guides/data-management/data-sharing).

## Statements

| Statement | Description |
| --- | --- |
| [CREATE SHARE](create-share.md) | Creates a Share. |
| [ALTER SHARE](alter-share.md) | Changes the consumer accounts, the connection, or the comment of a Share. |
| [DROP SHARE](drop-share.md) | Drops a Share. |
| [SHOW SHARES](show-shares.md) | Shows the Shares of the tenant and the Shares that give access to the tenant. |
| [DESCRIBE SHARE](describe-share.md) | Shows the objects that a Share grants. |
| [GRANT TO SHARE](grant-share.md) | Grants a database or a table to a Share. |
| [REVOKE FROM SHARE](revoke-share.md) | Revokes a database or a table from a Share. |
| [CREATE DATABASE ... FROM SHARE](../00-database/ddl-create-database.md#from-share) | Creates a shared database from a Share. |
