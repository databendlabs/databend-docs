---
title: ALTER DATABASE
sidebar_position: 4
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.866"/>

更改数据库的名称，或为数据库设置默认存储选项。

## 语法

```sql
-- 重命名数据库
ALTER DATABASE [ IF EXISTS ] <name> RENAME TO <new_db_name>

-- 设置默认存储选项
ALTER DATABASE [ IF EXISTS ] <name> SET OPTIONS (
    DEFAULT_STORAGE_CONNECTION = '<connection_name>'
  | DEFAULT_STORAGE_PATH = '<path>'
)
```

## 参数

| 参数                          | 描述                                                                                                                          |
|:-----------------------------|:------------------------------------------------------------------------------------------------------------------------------|
| `DEFAULT_STORAGE_CONNECTION` | 已有连接的名称（通过 `CREATE CONNECTION` 创建），作为该数据库中表的默认存储连接。                                               |
| `DEFAULT_STORAGE_PATH`       | 该数据库中表的默认存储路径 URI（如 `s3://bucket/path/`），必须以 `/` 结尾，且与连接的存储类型匹配。                            |

:::note
- `SET OPTIONS` 只对执行该语句后新建的表生效，已有表不受影响。
- 每次可以单独更新一个选项，但前提是另一个选项已在该数据库上设置。
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
