---
title: system.temp_files
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.348"/>

包含 Databend 创建的临时文件的信息，例如溢出文件。要删除临时文件，请使用 [VACUUM TEMPORARY FILES](../../10-sql-commands/50-administration-cmds/vacuum-temp-files.md) 命令。

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
```
