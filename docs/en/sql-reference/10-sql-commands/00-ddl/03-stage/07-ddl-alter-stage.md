---
title: ALTER STAGE
sidebar_position: 7
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.867"/>

Changes the properties of an existing internal or external stage. Use `SET` to update properties. Use `UNSET` to reset the file format or clear the comment.

## Syntax

```sql
ALTER STAGE [ IF EXISTS ] <stage_name>
  SET <set_option> [ , <set_option> ... ]

ALTER STAGE [ IF EXISTS ] <stage_name>
  UNSET { FILE_FORMAT | COMMENT } [ , { FILE_FORMAT | COMMENT } ... ]
```

Where:

```sql
set_option ::=
    URL = '<protocol>://<location>' [ CONNECTION = ( <connection_parameters> ) ]
  | FILE_FORMAT = ( { FORMAT_NAME = '<format_name>' | TYPE = <format_type> [ formatTypeOptions ] } )
  | COMMENT = '<string_literal>'
```

## Parameters

| Parameter | Description |
|-----------|-------------|
| `IF EXISTS` | Does not return an unknown-stage error if the stage does not exist. |
| `<stage_name>` | Name of an existing internal or external stage. Do not include the `@` prefix. |
| `URL` | Replaces the storage location and connection configuration of an external stage. Include the connection parameters required for the new location. |
| `CONNECTION` | Specifies storage connection parameters as part of the `URL` option. To use a named connection, specify `CONNECTION = (CONNECTION_NAME = '<connection_name>')`. See [Connection Parameters](../../../00-sql-reference/51-connect-parameters.md). |
| `FILE_FORMAT` | Replaces the stage file format. Specify a named format or a format type and its options. See [Input & Output File Formats](../../../00-sql-reference/50-file-format-options.md). |
| `COMMENT` | Sets the stage comment. Use an empty string to clear it. |

## Usage Notes

- `SET` requires at least one option. You can update multiple properties in one statement.
- Properties not specified in the statement remain unchanged.
- You can set `URL` only for an external stage. This operation changes the stage configuration. It does not move or copy files.
- A `URL` update replaces the storage configuration. It does not merge new connection parameters with the previous configuration. Include all required connection parameters, or reference a named connection.
- You cannot set `CONNECTION` by itself. To update credentials, specify `URL` with the new `CONNECTION` parameters.
- `SET FILE_FORMAT` replaces the file format configuration. It does not merge options with the previous configuration.
- `UNSET FILE_FORMAT` restores the default Parquet file format. It does not restore the format specified when the stage was created.
- `UNSET COMMENT` clears the comment. You cannot unset `URL` or `CONNECTION`.
- You cannot alter the user stage (`~`).

## Access Control Requirements

When `enable_experimental_rbac_check` is enabled, you must have both `READ` and `WRITE` privileges on the stage, or ownership of the stage. When this setting is disabled, the operation requires the global `SUPER` privilege.

For more information, see [Privileges](/guides/security/access-control/privileges).

## Examples

### Update the File Format and Comment

Create an internal stage. Then set its file format and comment:

```sql
CREATE STAGE my_internal_stage;

ALTER STAGE my_internal_stage SET
  FILE_FORMAT = (TYPE = CSV SKIP_HEADER = 1),
  COMMENT = 'CSV files with a header row';

DESC STAGE my_internal_stage;
```

### Reset Properties

Reset the stage from the previous example to the default Parquet file format and clear its comment:

```sql
ALTER STAGE my_internal_stage UNSET FILE_FORMAT, COMMENT;
```

### Change an External Stage Location

This example requires an S3 bucket and a named connection. Replace the placeholders with your storage details:

```sql
CREATE CONNECTION my_s3_connection
  STORAGE_TYPE = 's3'
  ACCESS_KEY_ID = '<your-access-key-id>'
  SECRET_ACCESS_KEY = '<your-secret-access-key>';

CREATE STAGE my_s3_stage
  URL = 's3://<your-bucket>/incoming/'
  CONNECTION = (CONNECTION_NAME = 'my_s3_connection');

ALTER STAGE my_s3_stage SET
  URL = 's3://<your-bucket>/archive/'
  CONNECTION = (CONNECTION_NAME = 'my_s3_connection'),
  COMMENT = 'Archived files';
```

The stage now points to the `archive/` path. Files in `incoming/` remain at their original location.

### Handle a Missing Stage

Use `IF EXISTS` to avoid an unknown-stage error when the stage does not exist:

```sql
ALTER STAGE IF EXISTS missing_stage SET COMMENT = 'Updated comment';
```

## Related Commands

- [CREATE STAGE](01-ddl-create-stage.md)
- [DESC STAGE](03-ddl-desc-stage.md)
- [DROP STAGE](02-ddl-drop-stage.md)
