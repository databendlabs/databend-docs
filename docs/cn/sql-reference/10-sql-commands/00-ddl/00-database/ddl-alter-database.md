---
title: ALTER DATABASE
sidebar_position: 4
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: unreleased (PR #20689)"/>

更改数据库的名称，或为数据库设置默认存储选项。

## 语法

```sql
-- 重命名数据库
ALTER DATABASE [ IF EXISTS ] <name> RENAME TO <new_db_name>

-- 设置默认存储选项
ALTER DATABASE [ IF EXISTS ] <name> SET OPTIONS (
    <database_option> = '<value>' [, ...]
)
```

## 参数

| 参数                          | 描述                                                                                                                          |
|:-----------------------------|:------------------------------------------------------------------------------------------------------------------------------|
| `DEFAULT_STORAGE_CONNECTION` | 已有连接的名称（通过 `CREATE CONNECTION` 创建），作为该数据库中表的默认存储连接。                                               |
| `DEFAULT_STORAGE_PATH`       | 该数据库中表的默认存储路径 URI（如 `s3://bucket/path/`），必须以 `/` 结尾，且与连接的存储类型匹配。                            |
| `DEFAULT_S3_STORAGE_CLASS`   | 新建非临时外部 Fuse 表的默认 S3 存储类别。支持 `standard` 和 `intelligent_tiering`，不区分大小写。 |

:::note
- `SET OPTIONS` 只对执行该语句后新建的表生效，已有表不受影响。
- 可以单独更新连接或路径，但前提是另一个选项已在该数据库上设置。
- `DEFAULT_S3_STORAGE_CLASS` 可以单独设置，不要求数据库同时配置 `DEFAULT_STORAGE_CONNECTION` 和 `DEFAULT_STORAGE_PATH`。
- 新建非临时外部 Fuse 表时，如果未指定 `S3_STORAGE_CLASS`，表会继承存储类别默认值。显式指定的外部位置和从数据库继承的外部位置均适用。
- 更改此默认值不会更新已有表的存储类别选项，也不会改变已有 S3 对象的存储类别。
:::

## 示例

### 重命名数据库

```sql
CREATE DATABASE DATABEND;
```

```sql
SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| DATABEND           |
| information_schema |
| default            |
| system             |
+--------------------+
```

```sql
ALTER DATABASE `DATABEND` RENAME TO `NEW_DATABEND`;
```

```sql
SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| NEW_DATABEND       |
| default            |
| system             |
+--------------------+
```

### 设置默认存储选项

```sql
ALTER DATABASE analytics SET OPTIONS (
    DEFAULT_STORAGE_CONNECTION = 'my_s3',
    DEFAULT_STORAGE_PATH = 's3://mybucket/analytics_v2/'
);
```

### 设置默认 S3 存储类别

```sql
ALTER DATABASE external_analytics SET OPTIONS (
    DEFAULT_S3_STORAGE_CLASS = 'standard'
);
```

此操作仅更改新建非临时外部 Fuse 表的默认值。要更改已有外部表，请使用 [ALTER TABLE ... SET OPTIONS](../01-table/90-alter-table.md#fuse-引擎选项)。

## Tag 操作

为数据库分配或移除 Tag。Tag 必须先通过 [CREATE TAG](../08-tag/01-ddl-create-tag.md) 创建。完整说明请参阅 [SET TAG / UNSET TAG](../08-tag/04-ddl-set-tag.md)。

### 语法

```sql
ALTER DATABASE [ IF EXISTS ] <name> SET TAG <tag_name> = '<value>' [, <tag_name> = '<value>' ...]

ALTER DATABASE [ IF EXISTS ] <name> UNSET TAG <tag_name> [, <tag_name> ...]
```

### 示例

```sql
ALTER DATABASE mydb SET TAG env = 'prod', owner = 'team_a';
ALTER DATABASE mydb UNSET TAG env, owner;
```
