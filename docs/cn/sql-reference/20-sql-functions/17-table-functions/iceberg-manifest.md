---
title: ICEBERG_MANIFEST
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.709"/>

返回Iceberg表清单文件的元数据，包括文件路径、分区详情及快照关联信息。

## 语法

```sql
ICEBERG_MANIFEST('<数据库名>', '<表名>');
```

## 输出

该函数返回包含以下列的表：

- `content` (`INT`): 文件内容类型（0表示数据文件，1表示删除文件）。
- `path` (`STRING`): 数据文件或删除文件的路径。
- `length` (`BIGINT`): 文件大小（字节）。
- `partition_spec_id` (`INT`): 文件关联的分区规范ID。
- `added_snapshot_id` (`BIGINT`): 添加该文件的快照ID。
- `added_data_files_count` (`INT`): 新增数据文件数量。
- `existing_data_files_count` (`INT`): 引用的现有数据文件数量。
- `deleted_data_files_count` (`INT`): 删除的数据文件数量。
- `added_delete_files_count` (`INT`): 新增删除文件数量。
- `partition_summaries` (`MAP<STRING, STRING>`): 文件相关分区值的摘要。

## 示例

```sql
SELECT * FROM ICEBERG_MANIFEST('tpcds', 'catalog_returns');
 
╭───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ content │      path      │ length │ partition_spec │ added_snapshot │ added_data_fil │ existing_data_ │ deleted_data_ │ added_delete_ │ existing_dele │ deleted_delet │ partition_sum │
│  Int32  │     String     │  Int64 │       _id      │       _id      │    es_count    │   files_count  │  files_count  │  files_count  │ te_files_coun │ e_files_count │     maries    │
│         │                │        │      Int32     │ Nullable(Int64 │ Nullable(Int32 │ Nullable(Int32 │ Nullable(Int3 │ Nullable(Int3 │       t       │ Nullable(Int3 │ Array(Nullabl │
│         │                │        │                │        )       │        )       │        )       │       2)      │       2)      │ Nullable(Int3 │       2)      │ e(Tuple(Nulla │
│         │                │        │                │                │                │                │               │               │       2)      │               │ ble(Boolean), │
│         │                │        │                │                │                │                │               │               │               │               │ Nullable(Bool │
│         │                │        │                │                │                │                │               │               │               │               │ ean), String, │
│         │                │        │                │                │                │                │               │               │               │               │   String)))   │
├─────────┼────────────────┼────────┼────────────────┼────────────────┼────────────────┼────────────────┼───────────────┼───────────────┼───────────────┼───────────────┼───────────────┤
│       0 │ s3://warehouse │   9241 │              0 │ 75657674165904 │              2 │              0 │             0 │             2 │             0 │             0 │ []            │
│         │ /catalog_retur │        │                │          11866 │                │                │               │               │               │               │               │
│         │ ns/metadata/fa │        │                │                │                │                │               │               │               │               │               │
│         │ 1ea4d5-a382-49 │        │                │                │                │                │               │               │               │               │               │
│         │ 7a-9f22-1acb9a │        │                │                │                │                │               │               │               │               │               │
│         │ 74a346-m0.avro │        │                │                │                │                │               │               │               │               │               │
╰───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```