---
title: system_history.access_history
---

此表作为查询（Query）元数据的一部分，提供了每个查询访问和修改的对象的详细日志，包括表、列和暂存区（Stage）。它提供有关 DDL 和 DML 操作的结构化信息，以增强审计功能。

## 字段

| 字段                   | 类型      | 描述                                                                 |
|-------------------------|-----------|-----------------------------------------------------------------------------|
| query_id                | VARCHAR   | 查询的 ID。                                                        |
| query_start             | TIMESTAMP | 查询的开始时间。                                                |
| user_name               | VARCHAR   | 执行查询的用户名。                                |
| base_objects_accessed   | VARIANT   | 查询访问的对象。                                          |
| direct_objects_accessed | VARIANT   | 保留供将来使用；当前未使用。                              |
| objects_modified        | VARIANT   | 查询修改的对象。                                          |
| object_modified_by_ddl  | VARIANT   | DDL 修改的对象（例如 `CREATE TABLE`、`ALTER TABLE`）。        |

`base_objects_accessed`、`objects_modified` 和 `object_modified_by_ddl` 字段都是 JSON 对象数组。每个对象可能包含以下字段：

- `object_domain`: 对象的类型，可以是 [`Database`（数据库）, `Table`（表）, `Stage`（暂存区）] 中的一种。
- `object_name`: 对象的名称。对于暂存区（Stage），这是暂存区的名称。
- `columns`: 列信息，仅当 `object_domain` 为 `Table`（表）时存在。
- `stage_type`: 暂存区（Stage）的类型，仅当 `object_domain` 为 `Stage`（暂存区）时存在。
- `operation_type`: DDL 操作类型，可以是 [`Create`（创建）, `Alter`（修改）, `Drop`（删除）, `Undrop`（恢复）] 中的一种，仅在 `object_modified_by_ddl` 字段中存在。
- `properties`: 有关 DDL 操作的详细信息，仅在 `object_modified_by_ddl` 字段中存在。

## 示例

```sql
CREATE TABLE t (a INT, b string);
```

将被记录为：

```
               query_id: c2c1c7be-cee4-4868-a28e-8862b122c365
            query_start: 2025-06-12 03:31:19.042128
              user_name: root
  base_objects_accessed: []
direct_objects_accessed: []
       objects_modified: []
 object_modified_by_ddl: [{"object_domain":"Table","object_name":"default.default.t","operation_type":"Create","properties":{"columns":[{"column_name":"a","sub_operation_type":"Add"},{"column_name":"b","sub_operation_type":"Add"}],"create_options":{"compression":"zstd","database_id":"1","storage_format":"parquet"}}}]
```

`CREATE TABLE` 是一个 DDL 操作，因此它将被记录在 `object_modified_by_ddl` 字段中。

```sql
INSERT INTO t VALUES (1, 'book');
```

将被记录为：

```
               query_id: e92ebc00-a07e-4138-92a9-ea17a06f0165
            query_start: 2025-06-12 03:31:29.849848
              user_name: root
  base_objects_accessed: []
direct_objects_accessed: []
       objects_modified: [{"columns":[{"column_name":"a"},{"column_name":"b"}],"object_domain":"Table","object_name":"default.default.t"}]
 object_modified_by_ddl: []
```

`INSERT INTO` 是一个 DML 操作，因此它将被记录在 `objects_modified` 字段中。

```sql
COPY INTO @s FROM t;
```

```
               query_id: 7fd74374-c04a-4989-a6f7-bfe8cc27e511
            query_start: 2025-06-12 03:32:25.682248
              user_name: root
  base_objects_accessed: [{"columns":[{"column_name":"a"},{"column_name":"b"}],"object_domain":"Table","object_name":"default.default.t"}]
direct_objects_accessed: []
       objects_modified: [{"object_domain":"Stage","object_name":"s","stage_type":"Internal"}]
 object_modified_by_ddl: []
```

从表 `t` 到内部暂存区（Stage） `s` 的 `COPY INTO` 操作涉及读和写操作。执行此查询后，源表将记录在 `base_objects_accessed` 字段中，目标暂存区（Stage）将记录在 `objects_modified` 字段中。