---
title: ICEBERG_SNAPSHOT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.709"/>

返回Iceberg表快照的元数据，包括数据变更、操作类型及统计摘要等信息。

## 语法

```sql
ICEBERG_SNAPSHOT('<database_name>', '<table_name>');
```

## 输出

该函数返回包含以下列的表：

- `committed_at` (`TIMESTAMP`): 快照提交时间戳。
- `snapshot_id` (`BIGINT`): 快照唯一标识符。
- `parent_id` (`BIGINT`): 父快照ID（如存在）。
- `operation` (`STRING`): 执行的操作类型（如追加、覆盖、删除）。
- `manifest_list` (`STRING`): 快照关联的清单列表文件路径。
- `summary` (`MAP<STRING, STRING>`): 包含额外元数据的类JSON结构，例如：
    - `added-data-files`: 新增数据文件数量。
    - `added-records`: 新增记录数。
    - `total-records`: 快照总记录数。
    - `total-files-size`: 所有数据文件总大小（字节）。
    - `total-data-files`: 快照中数据文件总数。
    - `total-delete-files`: 快照中删除文件总数。

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