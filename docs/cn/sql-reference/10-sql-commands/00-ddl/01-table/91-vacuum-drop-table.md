---
title: VACUUM DROP TABLE
sidebar_position: 18
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.208"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VACUUM DROP TABLE'/>

VACUUM DROP TABLE 命令通过永久移除已删除表的数据文件来帮助节省存储空间，释放存储空间，并使您能够高效地管理此过程。它提供了可选参数来针对特定数据库，设置保留时间，预览和限制要清理的数据文件数量。要列出数据库的已删除表，请使用 [SHOW DROP TABLES](show-drop-tables.md)。

另见：[VACUUM TABLE](91-vacuum-table.md)

### 语法和示例

```sql
VACUUM DROP TABLE 
    [ FROM <database_name> ] 
    [ RETAIN <n> HOURS ] 
    [ DRY RUN ] 
    [ LIMIT <file_count> ]
```

- `FROM <database_name>`：此参数将寻找已删除表的搜索限制在特定数据库中。如果未指定，命令将扫描所有数据库，包括那些已被删除的。

    ```sql title="示例："
    -- 从 "default" 数据库中移除已删除的表
    VACUUM DROP TABLE FROM default;

    -- 从所有数据库中移除已删除的表
    VACUUM DROP TABLE;
    ```

- `RETAIN <n> HOURS`：此参数确定已删除表的数据文件的保留状态，只移除那些创建时间超过 *n* 小时的文件。在没有此参数的情况下，命令默认使用 `retention_period` 设置（通常设置为12小时），在清理过程中移除超过12小时的数据文件。

    ```sql title="示例："
    -- 移除已删除表中超过24小时的数据文件
    VACUUM DROP TABLE RETAIN 24 HOURS;
    ```

- `DRY RUN`：指定此参数时，数据文件不会被移除，而是返回最多100个候选文件的列表，这些文件如果没有使用此参数，将会被移除。这在您想要预览 VACUUM DROP TABLE 命令的潜在影响，而实际上不移除任何数据文件之前很有用。例如：

    ```sql title="示例："
    -- 预览将要为已删除的表移除的数据文件
    VACUUM DROP TABLE DRY RUN;

    -- 预览将要为 "default" 数据库中已删除的表移除的数据文件
    VACUUM DROP TABLE FROM default DRY RUN;

    -- 预览将要为超过24小时的已删除表移除的数据文件
    VACUUM DROP TABLE RETAIN 24 HOURS DRY RUN;
    ```

- `LIMIT <file_count>`：此参数限制要移除的数据文件数量。

    ```sql title="示例："
    -- 限制移除5个数据文件并预览它们
    VACUUM DROP TABLE DRY RUN LIMIT 5;

    Table    |File                                       |
    ---------+-------------------------------------------+
    employees|ee9cc37505974ea9a4258688c2426aab_v2.parquet|
    employees|f67e87ab51fd4c869717230b1c9a0de4_v2.parquet|
    employees|ee9cc37505974ea9a4258688c2426aab_v4.parquet|
    employees|f67e87ab51fd4c869717230b1c9a0de4_v4.parquet|
    employees|42978ea8ad9b468db5813d2d674d106b_v4.mpk    |
    ```