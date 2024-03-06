---
title: VACUUM TABLE
sidebar_position: 17
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.39"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VACUUM TABLE'/>

VACUUM TABLE 命令通过永久删除表中的历史数据文件来帮助优化系统性能，释放存储空间。这包括：

- 与表相关的快照，以及它们相关的段和块。

- 孤立文件。在 Databend 中，孤立文件指的是不再与表关联的快照、段和块。孤立文件可能由各种操作和错误生成，例如在数据备份和恢复期间，它们可能会占用宝贵的磁盘空间，并随着时间的推移降低系统性能。

另见：[VACUUM DROP TABLE](91-vacuum-drop-table.md)

### 语法和示例

```sql
VACUUM TABLE <table_name> [ DRY RUN ]
```

- **DRY RUN**：指定此选项时，候选孤立文件不会被移除，而是返回最多 1000 个候选文件的列表，这些是如果不使用该选项将会被移除的文件。当你想在实际移除任何数据文件之前预览 VACUUM TABLE 命令对表的潜在影响时，这非常有用。例如：

    ```sql
    VACUUM TABLE t DRY RUN;

    +-----------------------------------------------------+
    | Files                                               |
    +-----------------------------------------------------+
    | 1/8/_sg/932addea38c64393b82cb4b8fb7a2177_v3.bincode |
    | 1/8/_b/b68cbe5fe015474d85a92d5f7d1b5d99_v2.parquet  |
    +-----------------------------------------------------+
    ```

### 调整数据保留时间

`VACUUM TABLE` 命令会移除早于 `DATA_RETENTION_TIME_IN_DAYS` 设置的数据文件。这个保留期可以根据需要进行调整，例如，调整为 2 天：

```sql
SET GLOBAL DATA_RETENTION_TIME_IN_DAYS = 2;
```

默认的 `DATA_RETENTION_TIME_IN_DAYS` 根据环境而异：

- Databend 版本：90 天
- Databend 云标准版：7 天
- Databend 云企业版：90 天

要检查当前设置，请使用：

```sql
SHOW SETTINGS LIKE 'DATA_RETENTION_TIME_IN_DAYS';
```

### VACUUM TABLE 与 OPTIMIZE TABLE

Databend 提供了两个命令用于从表中移除历史数据文件：VACUUM TABLE 和 [OPTIMIZE TABLE](60-optimize-table.md)（带有 PURGE 选项）。尽管这两个命令都能永久删除数据文件，但它们在处理孤立文件方面有所不同：OPTIMIZE TABLE 能够移除孤立的快照，以及相应的段和块。然而，存在没有任何关联快照的孤立段和块的可能性。在这种情况下，只有 VACUUM TABLE 能帮助清理它们。

VACUUM TABLE 和 OPTIMIZE TABLE 都允许你指定一个期限来确定要移除哪些历史数据文件。然而，OPTIMIZE TABLE 要求你事先从查询中获取快照 ID 或时间戳，而 VACUUM TABLE 允许你直接指定保留数据文件的小时数。VACUUM TABLE 在移除数据文件之前提供了增强的控制，通过 DRY RUN 选项，允许你在应用命令之前预览要移除的数据文件。这提供了一个安全的移除体验，并帮助你避免意外的数据丢失。


| 	                                                  | VACUUM TABLE 	 | OPTIMIZE TABLE 	 |
|----------------------------------------------------|----------------|------------------|
| 关联的快照（包括段和块） 	                          | 是          	 | 是            	 |
| 孤立的快照（包括段和块）     	                      | 是          	 | 是            	 |
| 仅孤立的段和块                                   	  | 是          	 | 否             	 |
| DRY RUN                                         	  | 是          	 | 否             	 |