---
title: TAG_REFERENCES
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.866"/>

返回指定数据库对象上分配的所有 Tag。使用此函数可审计 Tag 分配情况，用于治理和合规。

另请参阅：[SET TAG / UNSET TAG](/sql/sql-commands/ddl/tag/ddl-set-tag)

## 语法

```sql
SELECT * FROM TAG_REFERENCES('<object_name>', '<domain>')
```

| 参数             | 描述                                                                                                    |
|-----------------|--------------------------------------------------------------------------------------------------------|
| `object_name`   | 对象名称。对于表/视图/流，使用 `db.name` 格式。对于存储过程，需包含类型签名（如 `my_proc(INT)`）。            |
| `domain`        | 对象类型：`DATABASE`、`TABLE`、`VIEW`、`STREAM`、`STAGE`、`CONNECTION`、`USER`、`ROLE`、`UDF` 或 `PROCEDURE`。       |

## 输出列

| 列                 | 类型              | 描述                                                          |
|-------------------|------------------|--------------------------------------------------------------|
| `tag_name`        | String           | Tag 名称                                                      |
| `tag_value`       | String           | 分配给 Tag 的值                                                  |
| `object_database` | Nullable(String) | 数据库名称（STAGE、CONNECTION、USER、ROLE、UDF、PROCEDURE 为 NULL） |
| `object_id`       | Nullable(UInt64) | 对象 ID（仅 DATABASE、TABLE、VIEW 非 NULL）                     |
| `object_name`     | String           | 对象名称                                                      |
| `domain`          | String           | 对象类型                                                      |

## 示例

### 查询表上的 Tag

```sql
CREATE TAG env ALLOWED_VALUES = ('dev', 'staging', 'prod');
CREATE TAG owner;

CREATE TABLE default.users (id INT, name STRING);
ALTER TABLE default.users SET TAG env = 'prod', owner = 'team_a';

SELECT * EXCLUDE(object_id) FROM TAG_REFERENCES('default.users', 'TABLE');

┌───────────────────────────────────────────────────────────────────────┐
│ tag_name │ tag_value │ object_database │ object_name │    domain    │
├──────────┼───────────┼─────────────────┼─────────────┼──────────────┤
│ env      │ prod      │ default         │ users       │ TABLE        │
│ owner    │ team_a    │ default         │ users       │ TABLE        │
└───────────────────────────────────────────────────────────────────────┘
```

### 查询 Stage 上的 Tag

```sql
CREATE STAGE data_stage;
ALTER STAGE data_stage SET TAG env = 'staging', owner = 'data_team';

SELECT * EXCLUDE(object_id) FROM TAG_REFERENCES('data_stage', 'STAGE');

┌───────────────────────────────────────────────────────────────────────┐
│ tag_name │ tag_value │ object_database │ object_name │    domain    │
├──────────┼───────────┼─────────────────┼─────────────┼──────────────┤
│ env      │ staging   │ NULL            │ data_stage  │ STAGE        │
│ owner    │ data_team │ NULL            │ data_stage  │ STAGE        │
└───────────────────────────────────────────────────────────────────────┘
```

### 查询数据库上的 Tag

```sql
ALTER DATABASE default SET TAG env = 'prod';

SELECT * EXCLUDE(object_id) FROM TAG_REFERENCES('default', 'DATABASE');

┌───────────────────────────────────────────────────────────────────────┐
│ tag_name │ tag_value │ object_database │ object_name │    domain    │
├──────────┼───────────┼─────────────────┼─────────────┼──────────────┤
│ env      │ prod      │ default         │ default     │ DATABASE     │
└───────────────────────────────────────────────────────────────────────┘
```
