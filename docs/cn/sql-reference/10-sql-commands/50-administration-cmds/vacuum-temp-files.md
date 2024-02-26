---
title: 清理临时文件
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.348"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='清理临时文件'/>

删除Databend创建的临时文件，例如溢出文件。

另见：[system.temp_files](../../00-sql-reference/20-system-tables/system-temp-files.md)

## 语法

```sql
VACUUM TEMPORARY FILES [ RETAIN <n> SECONDS | DAYS ] [ LIMIT <limit> ]
```

- **RETAIN n SECONDS | DAYS**：此选项决定临时文件的保留期限。当指定此选项时，Databend将比较*n*的值和设置`retention_period`的值，并将使用较大的值作为保留期限。例如，如果指定的*n*值大于默认的`retention_period`，那么Databend将保留*n*天的临时文件，因此超过*n*天的临时文件将被删除。

- **LIMIT**：要删除的临时文件的最大数量。

## 输出

VACUUM TEMPORARY FILES返回已删除临时文件的列表。

## 示例

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