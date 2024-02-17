---
title: VACUUM DROP TABLE
sidebar_position: 18
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.208"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VACUUM DROP TABLE'/>

The VACUUM DROP TABLE command helps save storage space by permanently removing data files of dropped tables, freeing up storage space, and enabling you to manage the process efficiently. It offers optional parameters to target specific databases, set retention times, preview, and limit the number of data files to be vacuumed. To list the dropped tables of a database, use [SHOW DROP TABLES](show-drop-tables.md).

See also: [VACUUM TABLE](91-vacuum-table.md)

### Syntax and Examples

```sql
VACUUM DROP TABLE 
    [ FROM <database_name> ] 
    [ RETAIN <n> HOURS ] 
    [ DRY RUN ] 
    [ LIMIT <file_count> ]
```

- `FROM <database_name>`: This parameter restricts the search for dropped tables to a specific database. If not specified, the command will scan all databases, including those that have been dropped.

    ```sql title="Example:"
    -- Remove dropped tables from the "default" database
    VACUUM DROP TABLE FROM default;

    -- Remove dropped tables from all databases
    VACUUM DROP TABLE;
    ```

- `RETAIN <n> HOURS`: This parameter determines the retention status of data files for dropped tables, removing only those that were created more than *n* hours ago. In the absence of this parameter, the command defaults to the `retention_period` setting (usually set to 12 hours), leading to the removal of data files older than 12 hours during the vacuuming process.

    ```sql title="Example:"
    -- Remove data files older than 24 hours for dropped tables
    VACUUM DROP TABLE RETAIN 24 HOURS;
    ```

- `DRY RUN`: When this parameter is specified, data files will not be removed, instead, a list of up to 100 candidate files will be returned that would have been removed if the parameter was not used. This is useful when you want to preview the potential impact of the VACUUM DROP TABLE command before actually removing any data files. For example:

    ```sql title="Example:"
    -- Preview data files to be removed for dropped tables
    VACUUM DROP TABLE DRY RUN;

    -- Preview data files to be removed for dropped tables in the "default" database
    VACUUM DROP TABLE FROM default DRY RUN;

    -- Preview data files to be removed for dropped tables older than 24 hours
    VACUUM DROP TABLE RETAIN 24 HOURS DRY RUN;
    ```

- `LIMIT <file_count>`: This parameter limits the number of data files to be removed.

    ```sql title="Example:"
    -- Limit the removal to 5 data files and preview them
    VACUUM DROP TABLE DRY RUN LIMIT 5;

    Table    |File                                       |
    ---------+-------------------------------------------+
    employees|ee9cc37505974ea9a4258688c2426aab_v2.parquet|
    employees|f67e87ab51fd4c869717230b1c9a0de4_v2.parquet|
    employees|ee9cc37505974ea9a4258688c2426aab_v4.parquet|
    employees|f67e87ab51fd4c869717230b1c9a0de4_v4.parquet|
    employees|42978ea8ad9b468db5813d2d674d106b_v4.mpk    |
    ```