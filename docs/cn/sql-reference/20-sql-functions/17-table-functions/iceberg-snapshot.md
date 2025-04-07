---
title: ICEBERG_SNAPSHOT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.709"/>

返回关于 Iceberg 表快照的元数据，包括关于数据更改、操作和摘要统计的信息。

## 语法

```sql
ICEBERG_SNAPSHOT('<database_name>', '<table_name>');
```

## 输出

该函数返回一个包含以下列的表：

- `committed_at` (`TIMESTAMP`): 快照提交的时间戳。
- `snapshot_id` (`BIGINT`): 快照的唯一标识符。
- `parent_id` (`BIGINT`): 父快照 ID（如果适用）。
- `operation` (`STRING`): 执行的操作类型（例如，append、overwrite、delete）。
- `manifest_list` (`STRING`): 与快照关联的清单列表的文件路径。
- `summary` (`MAP<STRING, STRING>`): 一个类似 JSON 的结构，包含额外的元数据，例如：
    - `added-data-files`: 新添加的数据文件数。
    - `added-records`: 新添加的记录数。
    - `total-records`: 快照中的记录总数。
    - `total-files-size`: 所有数据文件的总大小（以字节为单位）。
    - `total-data-files`: 快照中的数据文件总数。
    - `total-delete-files`: 快照中的删除文件总数。

## 示例

```sql
SELECT * FROM ICEBERG_SNAPSHOT('tpcds', 'catalog_returns');
 
╭───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│        committed_at        │     snapshot_id     │ parent_id │ operation │                     manifest_list                    │                       summary                       │
├────────────────────────────┼─────────────────────┼───────────┼───────────┼──────────────────────────────────────────────────────┼─────────────────────────────────────────────────────┤
│ 2025-03-12 23:18:26.626000 │ 7565767416590411866 │         0 │ append    │ s3://warehouse/catalog_returns/metadata/snap-7565767 │ {'spark.app.id':'local-1741821433430','added-data-f │
│                            │                     │           │           │ 416590411866-1-fa1ea4d5-a382-497a-9f22-1acb9a74a346. │ iles':'2','added-records':'144067','total-equality- │
│                            │                     │           │           │ avro                                                 │ deletes':'0','changed-partition-count':'1','total-r │
│                            │                     │           │           │                                                      │ ecords':'144067','total-files-size':'7679811','tota │
│                            │                     │           │           │                                                      │ l-data-files':'2','added-files-size':'7679811','tot │
│                            │                     │           │           │                                                      │ al-delete-files':'0','total-position-deletes':'0'}  │
╰───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```