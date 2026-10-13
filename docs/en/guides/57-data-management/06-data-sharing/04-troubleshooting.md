---
title: Troubleshoot Data Sharing
sidebar_label: Troubleshooting
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="Introduced or updated: v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

Find the error message in the tables. In the messages, `...` is a value from your environment.

## Provider Errors

| Message | Cause | Action |
| --- | --- | --- |
| `requires Databend Enterprise Edition license` | The license does not include the necessary feature. | Install a license with the `DataSharing` feature. For streams, the license must also include the stream feature. |
| `Share '...' has no connection` | The Share does not have a connection. | Set a connection before you grant tables or add accounts. |
| `Connection '...' does not exist` | The connection name is incorrect, or the connection was dropped. | Create the connection, or use the correct name. |
| `Connection storage type '...' does not match provider table storage type '...'` | The storage types are different. | Use a connection with the same storage type as the tables. |
| `Data sharing connection credential override is not supported for storage type '...'` | This storage type cannot get credentials from a connection. | Use S3, Azure Blob, GCS, or `fs` storage. |
| `Grant USAGE on a database to share '...' before granting tables` | The Share does not grant a database. | Grant `USAGE` on the database first. |
| `Share '...' already has USAGE on another database` | The Share grants a different database. | Use a different Share, or revoke the current database grant. |
| `Cannot grant table '...' from a different database to share '...'` | The table is not in the granted database. | Grant a table from the granted database. |
| `Shared table only supports Fuse provider tables` | The table is not a FUSE table. | Share FUSE tables only. |
| `Shared tables do not support provider row access or masking policies` | The table has a row access policy or a masking policy. | Remove the policy, or share a different table. |
| `Cannot grant a shared database to a share` | The database is a shared database. | Grant a local database. |
| `Only USAGE ON DATABASE and SELECT ON TABLE can be granted to a share` | The grant type is not supported. | Use `USAGE ON DATABASE` or `SELECT ON TABLE`. |
| `ALTER SHARE SET requires ACCOUNTS, CONNECTION or COMMENT` | The `SET` clause is empty. | Add one or more properties. |
| `SHOW SHARES only supports LIKE and LIMIT` | The statement contains `WHERE`. | Use `LIKE` or `LIMIT`. |

## Consumer Errors

| Message | Cause | Action |
| --- | --- | --- |
| `CREATE DATABASE ... FROM SHARE requires <provider_tenant>.<share>` | The provider tenant ID is missing. | Use `<provider_tenant>.<share>`. |
| `CREATE DATABASE ... FROM SHARE is only supported in the default catalog` | The statement uses a different catalog. | Use the default catalog. |
| `CREATE DATABASE ... FROM SHARE cannot specify ENGINE or OPTIONS` | The statement contains `ENGINE` or `OPTIONS`. | Remove `ENGINE` and `OPTIONS`. |
| `Unknown share '...'` | The Share does not exist, or the tenant ID or the Share name is incorrect. | Run `SHOW SHARES` and use the values from the result. |
| `Account '...' is not authorized for share` | The consumer tenant is not a consumer account of the Share. | Get the ID with `CURRENT_TENANT_ID()`. Ask the provider to add this ID. |
| `Table '...' is not granted by share '...'` | The provider did not grant the table, or the table name changed. | Ask the provider to grant the table. Use the current table name. |
| `Share '...' does not grant a database` | The Share does not have a database grant. | Ask the provider to grant the database and the tables. |
| `Share '...' no longer grants a database` | The provider revoked `USAGE` on the database. | Ask the provider to grant the database and the tables again. |
| `Shared database binding is no longer valid` | The provider dropped and created the Share or the database again. | [Create the shared database again](03-manage-shares.md#lifecycle-and-recovery). |
| `Shared table binding is stale` | The provider dropped and created the table again. | Ask the provider to grant the new table. |
| `Cannot resolve connection '...' for data sharing` | The provider connection does not exist or is not valid. | Ask the provider to create the connection again or set a different connection. |
| `Cannot modify shared table ...: table is READ ONLY` | The statement tries to change a shared table. | Write the data to a local table. |

If a query fails with a storage error, examine the network access and the permissions of the provider connection.

## Concurrent Changes

| Message | Cause | Action |
| --- | --- | --- |
| `retry ALTER SHARE` | A different operation changed the Share at the same time. | Run the statement again. |
| `retry GRANT` | A different operation changed the Share or the table at the same time. | Run the statement again. |

## Stream Errors

| Message | Cause | Action |
| --- | --- | --- |
| `Change tracking is not enabled on shared table ...` | The provider did not enable change tracking. | Ask the provider to set `change_tracking = true` on the source table. |
| `Create the stream in a local database, not in a shared database` | The stream is in the shared database. | Create the stream in a local database. |
| `Change tracking has been missing for the time range requested on table ...` | Change tracking stopped for a period. | Create the stream again. |
| `Cannot get base table '...' from stream ...` | The source table or the shared database was dropped. | Create the stream again. |

For the stream procedure, see [Streams on Shared Tables](02-consumers.md#streams-on-shared-tables).
