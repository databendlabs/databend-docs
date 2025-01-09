---
title: system.columns
---

包含有关表列的信息。

```sql
DESC system.columns;
+--------------------+---------+------+---------+-------+
| 字段               | 类型    | 空值 | 默认值  | 额外  |
+--------------------+---------+------+---------+-------+
| name               | VARCHAR | 否   |         |       |
| database           | VARCHAR | 否   |         |       |
| table              | VARCHAR | 否   |         |       |
| type               | VARCHAR | 否   |         |       |
| default_kind       | VARCHAR | 否   |         |       |
| default_expression | VARCHAR | 否   |         |       |
| is_nullable        | BOOLEAN | 否   | false   |       |
| comment            | VARCHAR | 否   |         |       |

```

```sql
+--------------------------+----------+---------------------+------------------+-------------------+--------------+--------------------+-------------+---------+
| 名称                     | 数据库   | 表                  | 列类型           | 数据类型          | 默认类型     | 默认表达式         | 可为空      | 注释    |
+--------------------------+----------+---------------------+------------------+-------------------+--------------+--------------------+-------------+---------+
| id                       | system   | processes           | String           | VARCHAR           |              |                    | 否          |         |
| type                     | system   | processes           | String           | VARCHAR           |              |                    | 否          |         |
| host                     | system   | processes           | Nullable(String) | VARCHAR           |              |                    | 是          |         |
| user                     | system   | processes           | String           | VARCHAR           |              |                    | 否          |         |
| command                  | system   | processes           | String           | VARCHAR           |              |                    | 否          |         |
| database                 | system   | processes           | String           | VARCHAR           |              |                    | 否          |         |
| extra_info               | system   | processes           | String           | VARCHAR           |              |                    | 否          |         |
| memory_usage             | system   | processes           | Int64            | BIGINT            |              |                    | 否          |         |
| data_read_bytes          | system   | processes           | UInt64           | BIGINT UNSIGNED   |              |                    | 否          |         |
| data_write_bytes         | system   | processes           | UInt64           | BIGINT UNSIGNED   |              |                    | 否          |         |
| scan_progress_read_rows  | system   | processes           | UInt64           | BIGINT UNSIGNED   |              |                    | 否          |         |
| scan_progress_read_bytes | system   | processes           | UInt64           | BIGINT UNSIGNED   |              |                    | 否          |         |
| mysql_connection_id      | system   | processes           | Nullable(UInt32) | INT UNSIGNED      |              |                    | 是          |         |
....

```