---
title: VACUUM DROP TABLE
sidebar_position: 18
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.335"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VACUUM DROP TABLE'/>

VACUUM DROP TABLE 命令通过永久删除已删除表的数据文件来帮助节省存储空间，释放存储空间，并使您能够有效地管理该过程。它提供了可选参数来针对特定数据库，设置保留时间，预览和限制要清理的数据文件数量。要列出数据库的已删除表，请使用 [SHOW DROP TABLES](show-drop-tables.md)。

另见：[VACUUM TABLE](91-vacuum-table.md)

### 语法

```sql
VACUUM DROP TABLE 
    [ FROM <database_name> ] 
    [ DRY RUN ] 
    [ LIMIT <file_count> ]
```

- `FROM <database_name>`：此参数将搜索已删除表的范围限制在特定数据库内。如果未指定，命令将扫描所有数据库，包括那些已被删除的。

    ```sql title="示例："
    -- 从 "default" 数据库中移除已删除的表
    VACUUM DROP TABLE FROM default;

    -- 从所有数据库中移除已删除的表
    VACUUM DROP TABLE;
    ```

- `DRY RUN`：指定此参数时，数据文件不会被移除，而是返回最多100个候选文件的列表，这些文件如果没有使用该参数，将会被移除。当您想在实际移除任何数据文件之前预览 VACUUM DROP TABLE 命令的潜在影响时，这非常有用。例如：

    ```sql title="示例："
    -- 预览要为已删除的表移除的数据文件
    VACUUM DROP TABLE DRY RUN;

    -- 预览要在 "default" 数据库中为已删除的表移除的数据文件
    VACUUM DROP TABLE FROM default DRY RUN;
    ```

- `LIMIT <file_count>`：此参数限制要移除的数据文件数量。

    ```sql title="示例："
    -- 限制移除的数据文件数量为5个并预览它们
    VACUUM DROP TABLE DRY RUN LIMIT 5;

    Table    |File                                       |
    ---------+-------------------------------------------+
    employees|ee9cc37505974ea9a4258688c2426aab_v2.parquet|
    employees|f67e87ab51fd4c869717230b1c9a0de4_v2.parquet|
    employees|ee9cc37505974ea9a4258688c2426aab_v4.parquet|
    employees|f67e87ab51fd4c869717230b1c9a0de4_v4.parquet|
    employees|42978ea8ad9b468db5813d2d674d106b_v4.mpk    |
    ```

### 调整数据保留时间

`VACUUM DROP TABLE` 命令会移除早于 `DATA_RETENTION_TIME_IN_DAYS` 设置的数据文件。这个保留期可以根据需要进行调整，例如，调整为2天：

```sql
SET GLOBAL DATA_RETENTION_TIME_IN_DAYS = 2;
```

默认的 `DATA_RETENTION_TIME_IN_DAYS` 根据环境而异：

- Databend Edition：90天
- Databend Cloud Standard Edition：7天
- Databend Cloud Enterprise Edition：90天

要检查当前设置，请使用：

```sql
SHOW SETTINGS LIKE 'DATA_RETENTION_TIME_IN_DAYS';
```