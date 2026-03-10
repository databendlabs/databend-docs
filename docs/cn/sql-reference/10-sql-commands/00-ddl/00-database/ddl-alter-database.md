---
title: RENAME DATABASE
sidebar_position: 4
---

更改数据库的名称。

## 句法

```sql
ALTER DATABASE [ IF EXISTS ] <name> RENAME TO <new_db_name>
```

## 示例

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