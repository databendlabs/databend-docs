---
title: system_history.access_history
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.764"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='ACCESS HISTORY'/>

**数据血缘（Data Lineage）与访问控制审计** - 跟踪查询访问或修改的所有数据库对象（表、列、暂存区（Stage））。这对于以下方面至关重要：

- **数据血缘（Data Lineage）**：了解整个数据库中的数据流和依赖关系。
- **合规性报告（Compliance Reporting）**：跟踪谁在何时访问了敏感数据。
- **变更管理（Change Management）**：监控 DDL 操作和模式修改。
- **安全分析（Security Analysis）**：识别异常访问模式或未经授权的数据访问。

## 字段

| 字段                   | 类型      | 描述                                                                 |
|-------------------------|-----------|-----------------------------------------------------------------------------|
| query_id                | VARCHAR   | 查询的 ID。                                                        |
| query_start             | TIMESTAMP | 查询的开始时间。                                                |
| user_name               | VARCHAR   | 执行查询的用户名。                                |
| base_objects_accessed   | VARIANT   | 查询访问的对象。                                          |
| direct_objects_accessed | VARIANT   | 保留供将来使用；当前未使用。                              |
| objects_modified        | VARIANT   | 查询修改的对象。                                          |
| object_modified_by_ddl  | VARIANT   | DDL（例如 `CREATE TABLE`、`ALTER TABLE`）修改的对象。        |

`base_objects_accessed`、`objects_modified` 和 `object_modified_by_ddl` 字段都是 JSON 对象数组。每个对象可能包含以下字段：

- `object_domain`：对象类型，为 [`Database`, `Table`, `Stage`] 之一。
- `object_name`：对象名称。对于暂存区（Stage），这是暂存区（Stage）的名称。
- `columns`：列信息，仅当 `object_domain` 为 `Table` 时存在。
- `stage_type`：暂存区（Stage）的类型，仅当 `object_domain` 为 `Stage` 时存在。
- `operation_type`：DDL 操作类型，为 [`Create`, `Alter`, `Drop`, `Undrop`] 之一，仅在 `object_modified_by_ddl` 字段中存在。
- `properties`：DDL 操作的详细信息，仅在 `object_modified_by_ddl` 字段中存在。

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

`COPY INTO` 操作从表 `t` 复制到内部暂存区（Internal Stage） `s`，涉及读和写两种操作。执行此查询后，源表将被记录在 `base_objects_accessed` 字段中，目标暂存区（Stage）将被记录在 `objects_modified` 字段中。