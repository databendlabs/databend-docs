---
title: VACUUM TABLE
sidebar_position: 17
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.368"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VACUUM TABLE'/>

VACUUM TABLE 命令通过永久移除表中的历史数据文件来释放存储空间，从而优化系统性能。这包括：

- 与表关联的快照及其相关的段和块。

- 孤立文件。在 Databend 中，孤立文件指的是不再与表关联的快照、段和块。孤立文件可能由各种操作和错误产生，例如在数据备份和恢复过程中，它们会占用宝贵的磁盘空间并随着时间的推移降低系统性能。

另请参阅：[VACUUM DROP TABLE](91-vacuum-drop-table.md)

### 语法和示例

```sql
VACUUM TABLE <table_name> [ DRY RUN [SUMMARY] ]
```

- `DRY RUN [SUMMARY]`：指定此参数时，候选的孤立文件不会被移除。相反，将返回最多 1,000 个候选文件及其大小（以字节为单位），显示如果不使用此选项将移除的内容。当包含可选参数 `SUMMARY` 时，命令将返回要移除的文件总数及其总大小（以字节为单位）。

### 输出

VACUUM TABLE 命令（不带 `DRY RUN`）返回一个表格，总结了被清理文件的关键统计信息，包含以下列：

| 列             | 描述                               |
|----------------|------------------------------------|
| snapshot_files | 快照文件数量                       |
| snapshot_size  | 快照文件总大小（以字节为单位）     |
| segments_files | 段文件数量                         |
| segments_size  | 段文件总大小（以字节为单位）       |
| block_files    | 块文件数量                         |
| block_size     | 块文件总大小（以字节为单位）       |
| index_files    | 索引文件数量                       |
| index_size     | 索引文件总大小（以字节为单位）     |
| total_files    | 所有类型文件的总数量               |
| total_size     | 所有类型文件的总大小（以字节为单位）|

```sql title='示例:'
// highlight-next-line
VACUUM TABLE c;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ snapshot_files │ snapshot_size │ segments_files │ segments_size │ block_files │ block_size │ index_files │ index_size │ total_files │ total_size │
├────────────────┼───────────────┼────────────────┼───────────────┼─────────────┼────────────┼─────────────┼────────────┼─────────────┼────────────┤
│              3 │          1954 │              9 │          4802 │           9 │       1890 │           9 │       3060 │          30 │      11706 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

当指定 `DRY RUN` 参数时，VACUUM TABLE 命令将返回最多 1,000 个候选文件及其大小（以字节为单位）。如果指定 `DRY RUN SUMMARY`，命令将提供要移除的文件总数及其总大小。

```sql title='示例:'
// highlight-next-line
VACUUM TABLE c DRY RUN;

┌──────────────────────────────────────────────────────────────┐
│                       file                       │ file_size │
├──────────────────────────────────────────────────┼───────────┤
│ 1/67/_ss/61aaf678b9af41568b539099b4b09908_v4.mpk │       543 │
│ 1/67/_ss/dd149d21151c459d8c87076f9412c12c_v4.mpk │       516 │
│ 1/67/_ss/7ba0b2e2f63c4d42897a48830027dcf3_v4.mpk │       462 │
│ 1/67/_ss/db55dac72b29452db976cf0af0f8d962_v4.mpk │       588 │
│ 1/67/_ss/d8055967298f478d97cddaa66cf67e11_v4.mpk │       563 │
│ 1/67/_ss/00c4288dac014760808006f821f1ecbe_v4.mpk │       609 │
└──────────────────────────────────────────────────────────────┘
// highlight-next-line
VACUUM TABLE c DRY RUN SUMMARY;

┌──────────────────────────┐
│ total_files │ total_size │
├─────────────┼────────────┤
│           6 │       3281 │
└──────────────────────────┘
```

### 调整数据保留时间

VACUUM TABLE 命令移除早于 `data_retention_time_in_days` 设置的数据文件。可以根据需要调整此保留期限，例如调整为 2 天：

```sql
SET GLOBAL data_retention_time_in_days = 2;
```

`data_retention_time_in_days` 默认值为 1 天（24 小时），最大值因 Databend 版本而异：

| 版本                                     | 默认保留时间   | 最大保留时间     |
|------------------------------------------|----------------|------------------|
| Databend 社区版和企业版                  | 1 天（24 小时）| 90 天            |
| Databend Cloud（标准版）                 | 1 天（24 小时）| 1 天（24 小时）  |
| Databend Cloud（商业版）                 | 1 天（24 小时）| 90 天            |

要检查 `data_retention_time_in_days` 的当前值：

```sql
SHOW SETTINGS LIKE 'data_retention_time_in_days';
```

### VACUUM TABLE 与 OPTIMIZE TABLE

Databend 提供了两个命令来移除表中的历史数据文件：VACUUM TABLE 和 [OPTIMIZE TABLE](60-optimize-table.md)（带 PURGE 选项）。尽管这两个命令都能够永久删除数据文件，但它们在处理孤立文件的方式上有所不同：OPTIMIZE TABLE 能够移除孤立的快照及其对应的段和块。然而，存在没有关联快照的孤立段和块的情况。在这种情况下，只有 VACUUM TABLE 能够帮助清理它们。

VACUUM TABLE 和 OPTIMIZE TABLE 都允许你指定一个时间段来确定要移除的历史数据文件。然而，OPTIMIZE TABLE 需要你事先通过查询获取快照 ID 或时间戳，而 VACUUM TABLE 允许你直接指定保留数据文件的小时数。VACUUM TABLE 在移除前提供了对历史数据文件的增强控制，通过 DRY RUN 选项，你可以在应用命令前预览要移除的数据文件。这提供了安全的移除体验，并帮助你避免意外的数据丢失。

| 	                                                  | VACUUM TABLE 	 | OPTIMIZE TABLE 	 |
|----------------------------------------------------|----------------|------------------|
| 关联的快照（包括段和块） 	                         | 是          	 | 是            	 |
| 孤立的快照（包括段和块）     	                     | 是          	 | 是            	 |
| 仅孤立的段和块                  	                 | 是          	 | 否             	 |
| DRY RUN                                         	  | 是          	 | 否             	 |