---
title: SET TAG / UNSET TAG
sidebar_position: 4
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.866"/>

为数据库对象分配或移除 Tag。Tag 必须先通过 [CREATE TAG](01-ddl-create-tag.md) 创建才能分配。

另请参阅：[CREATE TAG](01-ddl-create-tag.md)、[TAG_REFERENCES](/sql/sql-functions/table-functions/tag-references)

## 语法

```sql
-- 分配 Tag
ALTER { DATABASE | TABLE | VIEW | STAGE | CONNECTION
      | USER | ROLE | STREAM | FUNCTION | PROCEDURE }
    [ IF EXISTS ] <object_name>
    SET TAG <tag_name> = '<value>' [, <tag_name> = '<value>' ...]

-- 移除 Tag
ALTER { DATABASE | TABLE | VIEW | STAGE | CONNECTION
      | USER | ROLE | STREAM | FUNCTION | PROCEDURE }
    [ IF EXISTS ] <object_name>
    UNSET TAG <tag_name> [, <tag_name> ...]
```

## 支持的对象类型

| 对象类型     | 对象名称格式                | 示例 |
|-------------|--------------------------|---------|
| DATABASE    | `<database>`             | `ALTER DATABASE mydb SET TAG env = 'prod'` |
| TABLE       | `[<database>.]<table>`   | `ALTER TABLE mydb.users SET TAG env = 'prod'` |
| VIEW        | `[<database>.]<view>`    | `ALTER VIEW mydb.active_users SET TAG env = 'prod'` |
| STAGE       | `<stage>`                | `ALTER STAGE my_stage SET TAG env = 'prod'` |
| CONNECTION  | `<connection>`           | `ALTER CONNECTION my_conn SET TAG env = 'prod'` |
| USER        | `'<user>'`               | `ALTER USER 'alice' SET TAG env = 'prod'` |
| ROLE        | `<role>`                 | `ALTER ROLE analyst SET TAG env = 'prod'` |
| STREAM      | `[<database>.]<stream>`  | `ALTER STREAM mydb.my_stream SET TAG env = 'prod'` |
| FUNCTION    | `<function>`             | `ALTER FUNCTION my_udf SET TAG env = 'prod'` |
| PROCEDURE   | `<name>(<arg_types>)`    | `ALTER PROCEDURE my_proc(INT) SET TAG env = 'prod'` |

:::note
- 如果 Tag 设置了 `ALLOWED_VALUES`，则值必须是允许值之一。
- 对不存在的 Tag 名称执行 `UNSET TAG` 会返回错误，除非对象本身不存在且指定了 `IF EXISTS`。
- 对于 PROCEDURE，必须在对象名称中包含参数类型签名。
:::

## 示例

### 为数据库和表设置 Tag

```sql
CREATE TAG env ALLOWED_VALUES = ('dev', 'staging', 'prod');
CREATE TAG owner;

ALTER DATABASE default SET TAG env = 'prod';
ALTER TABLE default.my_table SET TAG env = 'staging', owner = 'team_a';
```

### 为 Stage 和 Connection 设置 Tag

```sql
ALTER STAGE data_stage SET TAG env = 'dev', owner = 'data_team';
ALTER CONNECTION my_s3 SET TAG env = 'prod';
```

### 为视图设置 Tag

```sql
ALTER VIEW default.active_users SET TAG env = 'prod', owner = 'analytics';
```

### 为用户和角色设置 Tag

```sql
ALTER USER 'alice' SET TAG env = 'prod', owner = 'security';
ALTER ROLE analyst SET TAG env = 'dev';
```

### 为 UDF 和存储过程设置 Tag

```sql
ALTER FUNCTION my_udf SET TAG env = 'dev';
ALTER PROCEDURE my_proc(DECIMAL(10,2)) SET TAG env = 'prod';
```

### 移除 Tag

```sql
ALTER TABLE default.my_table UNSET TAG env, owner;
ALTER STAGE data_stage UNSET TAG env;
ALTER USER 'alice' UNSET TAG env, owner;
```
