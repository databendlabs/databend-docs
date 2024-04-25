---
title: VACUUM TEMPORARY FILES
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.348"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VACUUM TEMPORARY FILES'/>

Removes temporary files created by Databend, such as spill files.

See also: [system.temp_files](../../00-sql-reference/20-system-tables/system-temp-files.md)

## Syntax

```sql
VACUUM TEMPORARY FILES [ RETAIN <n> SECONDS | DAYS ] [ LIMIT <limit> ]
```

- **RETAIN n SECONDS | DAYS**: This option determines the retention period for temporary files. When this option is specified, Databend will compare the values of *n* and the setting `retention_period`, and it will use the larger value as the retention period. For example, if the specified value of *n* is greater than the default `retention_period`, then Databend will retain temporary files for *n* days, so temporary files that are older than *n* days will be removed. 

- **LIMIT**: The maximum number of temporary files to be removed.

## Output

VACUUM TEMPORARY FILES returns a list of deleted temporary files.

## Example

```sql
SELECT
  *
FROM
  system.temp_files;

┌───────────────────────────────────────────────────────────────────────────────────────┐
│ file_type │        file_name       │ file_content_length │   file_last_modified_time  │
├───────────┼────────────────────────┼─────────────────────┼────────────────────────────┤
│ Spill     │ 84H8qt3UKN9Axsj4IzrJw7 │              784960 │ 2024-02-26 02:14:46.037784 │
│ Spill     │ y5W2CGXzYtDeBqZuvW0cW  │              775424 │ 2024-02-26 02:14:46.037784 │
└───────────────────────────────────────────────────────────────────────────────────────┘

VACUUM TEMPORARY FILES;

┌────────────────────────┐
│          Files         │
├────────────────────────┤
│ 84H8qt3UKN9Axsj4IzrJw7 │
│ y5W2CGXzYtDeBqZuvW0cW  │
└────────────────────────┘
```