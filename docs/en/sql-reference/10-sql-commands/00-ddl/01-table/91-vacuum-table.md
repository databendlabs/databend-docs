---
title: VACUUM TABLE
sidebar_position: 17
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.39"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VACUUM TABLE'/>

The VACUUM TABLE command helps optimize system performance by freeing up storage space through the permanent removal of historical data files from a table. This includes:

- Snapshots associated with the table, as well as their relevant segments and blocks.

- Orphan files. Orphan files in Databend refer to snapshots, segments, and blocks that are no longer associated with the table. Orphan files might be generated from various operations and errors, such as during data backups and restores, and can take up valuable disk space and degrade the system performance over time.

See also: [VACUUM DROP TABLE](91-vacuum-drop-table.md)

### Syntax and Examples

```sql
VACUUM TABLE <table_name> [ DRY RUN ]
```

- **DRY RUN**: When this option is specified, candidate orphan files will not be removed, instead, a list of up to 1,000 candidate files will be returned that would have been removed if the option was not used. This is useful when you want to preview the potential impact of the VACUUM TABLE command on the table before actually removing any data files. For example:

    ```sql
    VACUUM TABLE t DRY RUN;

    +-----------------------------------------------------+
    | Files                                               |
    +-----------------------------------------------------+
    | 1/8/_sg/932addea38c64393b82cb4b8fb7a2177_v3.bincode |
    | 1/8/_b/b68cbe5fe015474d85a92d5f7d1b5d99_v2.parquet  |
    +-----------------------------------------------------+
    ```

### Output

The VACUUM TABLE command returns a table summarizing vital statistics of the vacuumed files, containing the following columns:

| Column         | Description                               |
|----------------|-------------------------------------------|
| snapshot_files | Number of snapshot files                  |
| snapshot_bytes | Total size of snapshot files in bytes     |
| segments_files | Number of segment files                   |
| segments_size  | Total size of segment files in bytes      |
| block_files    | Number of block files                     |
| block_size     | Total size of block files in bytes        |
| index_files    | Number of index files                     |
| index_size     | Total size of index files in bytes        |
| total_files    | Total number of all types of files        |
| total_size     | Total size of all types of files in bytes |

```sql title='Example:'
VACUUM TABLE books;

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ snapshot_files │ snapshot_bytes │ segments_files │ segments_size │ block_files │ block_size │ index_files │ index_size │ total_files │ total_size │
├────────────────┼────────────────┼────────────────┼───────────────┼─────────────┼────────────┼─────────────┼────────────┼─────────────┼────────────┤
│              1 │            548 │              1 │           661 │           1 │        494 │           1 │        713 │           4 │       2416 │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Adjusting Data Retention Time

The `VACUUM TABLE` command removes data files older than the `DATA_RETENTION_TIME_IN_DAYS` setting. This retention period can be adjusted as needed, for example, to 2 days:

```sql
SET GLOBAL DATA_RETENTION_TIME_IN_DAYS = 2;
```

The default `DATA_RETENTION_TIME_IN_DAYS` varies by environment:

- Databend Edition: 90 days
- Databend Cloud Standard Edition: 7 days
- Databend Cloud Enterprise Edition: 90 days

To check the current setting, use:

```sql
SHOW SETTINGS LIKE 'DATA_RETENTION_TIME_IN_DAYS';
```

### VACUUM TABLE vs. OPTIMIZE TABLE

Databend provides two commands for removing historical data files from a table: VACUUM TABLE and [OPTIMIZE TABLE](60-optimize-table.md) (with the PURGE option). Although both commands are capable of permanently deleting data files, they differ in how they handle orphan files: OPTIMIZE TABLE is able to remove orphan snapshots, as well as the corresponding segments and blocks. However, there is a possibility of orphan segments and blocks existing without any associated snapshots. In such a scenario, only VACUUM TABLE can help clean them up.

Both VACUUM TABLE and OPTIMIZE TABLE allow you to specify a period to determine which historical data files to remove. However, OPTIMIZE TABLE requires you to obtain the snapshot ID or timestamp from a query beforehand, whereas VACUUM TABLE allows you to specify the number of hours to retain the data files directly. VACUUM TABLE provides enhanced control over your historical data files both before their removal with the DRY RUN option, which allows you to preview the data files to be removed before applying the command. This provides a safe removal experience and helps you avoid unintended data loss. 


| 	                                                  | VACUUM TABLE 	 | OPTIMIZE TABLE 	 |
|----------------------------------------------------|----------------|------------------|
| Associated snapshots (incl. segments and blocks) 	 | Yes          	 | Yes            	 |
| Orphan snapshots (incl. segments and blocks)     	 | Yes          	 | Yes            	 |
| Orphan segments and blocks only                  	 | Yes          	 | No             	 |
| DRY RUN                                         	  | Yes          	 | No             	 |
