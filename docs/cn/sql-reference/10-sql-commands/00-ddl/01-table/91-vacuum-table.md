---
title: VACUUM TABLE
sidebar_position: 17
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.368"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VACUUM TABLE'/>

VACUUM TABLE 命令通过永久删除表中的历史数据文件来帮助优化系统性能，释放存储空间。这包括：

- 与表相关的快照，以及它们相关的段和块。

- 孤立文件。在 Databend 中，孤立文件指的是不再与表关联的快照、段和块。孤立文件可能由各种操作和错误生成，例如在数据备份和恢复期间，它们可能会占用宝贵的磁盘空间，并随着时间的推移降低系统性能。

另见：[VACUUM DROP TABLE](91-vacuum-drop-table.md)

### 语法和示例

```sql
VACUUM TABLE <table_name> [ DRY RUN [SUMMARY] ]
```

- `DRY RUN [SUMMARY]`：当指定此参数时，候选孤立文件将不会被移除。相反，将返回最多 1,000 个候选文件及其大小（以字节为单位）的列表，显示如果没有使用该选项将会被移除的内容。当包含可选参数 `SUMMARY` 时，命令返回将要移除的文件总数及其字节总大小。

### 输出

VACUUM TABLE 命令（不带 `DRY RUN`）返回一个表，总结了被清理文件的重要统计信息，包含以下列：

| 列名             | 描述                                 |
|----------------|-------------------------------------|
| snapshot_files | 快照文件数量                        |
| snapshot_size  | 快照文件总大小，以字节为单位         |
| segments_files | 段文件数量                          |
| segments_size  | 段文件总大小，以字节为单位           |
| block_files    | 块文件数量                          |
| block_size     | 块文件总大小，以字节为单位           |
| index_files    | 索引文件数量                        |
| index_size     | 索引文件总大小，以字节为单位         |
| total_files    | 所有类型文件的总数量                |
| total_size     | 所有类型文件的总大小，以字节为单位   |

```sql title='示例：'
// highlight-next-line
VACUUM TABLE c;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ snapshot_files │ snapshot_size │ segments_files │ segments_size │ block_files │ block_size │ index_files │ index_size │ total_files │ total_size │
├────────────────┼───────────────┼────────────────┼───────────────┼─────────────┼────────────┼─────────────┼────────────┼─────────────┼────────────┤
│              3 │          1954 │              9 │          4802 │           9 │       1890 │           9 │       3060 │          30 │      11706 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

当指定 `DRY RUN` 参数与 VACUUM TABLE 命令时，它返回最多 1,000 个候选文件及其字节大小的列表。如果指定了 `DRY RUN SUMMARY`，命令提供要移除的文件总数及其组合大小。

```sql title='示例：'
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

VACUUM TABLE 命令移除早于 `DATA_RETENTION_TIME_IN_DAYS` 设置的数据文件。这个保留期可以根据需要进行调整，例如，调整为 2 天：

```sql
SET GLOBAL DATA_RETENTION_TIME_IN_DAYS = 2;
```

`DATA_RETENTION_TIME_IN_DAYS` 默认为 1 天（24 小时），最大值根据 Databend 版本而异：

| 版本                                      | 默认保留期      | 最大保留期       |
|------------------------------------------|---------------|----------------|
| Databend 社区版 & 企业版                 | 1 天（24 小时） | 90 天          |
| Databend Cloud（标准版）                    | 1 天（24 小时） | 1 天（24 小时） |
| Databend Cloud（商业版）                    | 1 天（24 小时） | 90 天          |

检查 `DATA_RETENTION_TIME_IN_DAYS` 的当前值：

```sql
SHOW SETTINGS LIKE 'DATA_RETENTION_TIME_IN_DAYS';
```

### VACUUM TABLE 与 OPTIMIZE TABLE

Databend 提供了两个命令用于从表中移除历史数据文件：VACUUM TABLE 和 [OPTIMIZE TABLE](60-optimize-table.md)（带 PURGE 选项）。尽管这两个命令都能永久删除数据文件，但它们在处理孤立文件方面有所不同：OPTIMIZE TABLE 能够移除孤立的快照，以及相应的段和块。然而，可能存在没有任何关联快照的孤立段和块。在这种情况下，只有 VACUUM TABLE 能帮助清理它们。

VACUUM TABLE 和 OPTIMIZE TABLE 都允许您指定一个周期来决定哪些历史数据文件将被移除。然而，OPTIMIZE TABLE 要求您事先从查询中获取快照 ID 或时间戳，而 VACUUM TABLE 允许您直接指定保留数据文件的小时数。VACUUM TABLE 在移除历史数据文件之前提供了增强的控制，通过 DRY RUN 选项，允许您在应用命令之前预览将要被移除的数据文件。这提供了一个安全的移除体验，并帮助您避免意外的数据丢失。

| 	                                                  | VACUUM TABLE 	 | OPTIMIZE TABLE 	 |
|----------------------------------------------------|----------------|------------------|
| 关联的快照（包括段和块） 	                          | 是          	 | 是            	 |
| 孤立的快照（包括段和块）     	                      | 是          	 | 是            	 |
| 仅孤立的段和块                                   	  | 是          	 | 否             	 |
| DRY RUN                                         	  | 是          	 | 否             	 |