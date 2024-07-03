---
title: FLASHBACK TABLE
sidebar_position: 9
---

使用快照 ID 或时间戳将表回滚到早期版本，此操作仅涉及元数据操作，因此是一个快速过程。

通过您在命令中指定的快照 ID 或时间戳，Databend 将表回滚到创建快照时的先前状态。要检索表的快照 ID 和时间戳，请使用 [FUSE_SNAPSHOT](../../../20-sql-functions/16-system-functions/fuse_snapshot.md)。

回滚表的能力受到以下条件的限制：

- 该命令仅将现有表回滚到其先前状态。要恢复已删除的表，请使用 [UNDROP TABLE](21-ddl-undrop-table.md)。

- 表的回滚是 Databend 时间旅行功能的一部分。在使用该命令之前，请确保您想要回滚的表符合时间旅行的条件。例如，该命令不适用于临时表，因为 Databend 不为此类表创建或存储快照。

- 回滚表到先前状态后，您不能回滚操作，但您可以再次将表回滚到更早的状态。

- Databend 建议仅在紧急恢复时使用此命令。要查询表的历史数据，请使用 [AT](../../20-query-syntax/03-query-at.md) 子句。

## 语法

```sql
-- 通过快照 ID 恢复
ALTER TABLE <table> FLASHBACK TO (SNAPSHOT => '<snapshot-id>');

-- 通过快照时间戳恢复
ALTER TABLE <table> FLASHBACK TO (TIMESTAMP => '<timestamp>'::TIMESTAMP);
```

## 示例

### 步骤 1: 创建一个示例用户表并插入数据

```sql
-- 创建一个示例用户表
CREATE TABLE users (
    id INT,
    first_name VARCHAR,
    last_name VARCHAR,
    email VARCHAR,
    registration_date TIMESTAMP
);

-- 插入示例数据
INSERT INTO users (id, first_name, last_name, email, registration_date)
VALUES (1, 'John', 'Doe', 'john.doe@example.com', '2023-01-01 00:00:00'),
       (2, 'Jane', 'Doe', 'jane.doe@example.com', '2023-01-02 00:00:00');
```

数据：

```sql
SELECT * FROM users;
+------+------------+-----------+----------------------+----------------------------+
| id   | first_name | last_name | email                | registration_date          |
+------+------------+-----------+----------------------+----------------------------+
|    1 | John       | Doe       | john.doe@example.com | 2023-01-01 00:00:00.000000 |
|    2 | Jane       | Doe       | jane.doe@example.com | 2023-01-02 00:00:00.000000 |
+------+------------+-----------+----------------------+----------------------------+
```

快照：

```sql
SELECT * FROM Fuse_snapshot('default', 'users')\G;
*************************** 1. row ***************************
         snapshot_id: c5c538d6b8bc42f483eefbddd000af7d
   snapshot_location: 29356/44446/_ss/c5c538d6b8bc42f483eefbddd000af7d_v2.json
      format_version: 2
previous_snapshot_id: NULL
       segment_count: 1
         block_count: 1
           row_count: 2
  bytes_uncompressed: 150
    bytes_compressed: 829
          index_size: 1028
           timestamp: 2023-04-19 04:20:25.062854
```

### 步骤 2: 模拟一个意外删除操作

```sql
-- 模拟一个意外删除操作
DELETE FROM users WHERE id = 1;
```

数据：

```sql
+------+------------+-----------+----------------------+----------------------------+
| id   | first_name | last_name | email                | registration_date          |
+------+------------+-----------+----------------------+----------------------------+
|    2 | Jane       | Doe       | jane.doe@example.com | 2023-01-02 00:00:00.000000 |
+------+------------+-----------+----------------------+----------------------------+
```

快照：

```sql
SELECT * FROM Fuse_snapshot('default', 'users')\G;
*************************** 1. row ***************************
         snapshot_id: 7193af51a4c9423ebd6ddbb04327b280
   snapshot_location: 29356/44446/_ss/7193af51a4c9423ebd6ddbb04327b280_v2.json
      format_version: 2
previous_snapshot_id: c5c538d6b8bc42f483eefbddd000af7d
       segment_count: 1
         block_count: 1
           row_count: 1
  bytes_uncompressed: 87
    bytes_compressed: 778
          index_size: 1028
           timestamp: 2023-04-19 04:22:20.390430
*************************** 2. row ***************************
         snapshot_id: c5c538d6b8bc42f483eefbddd000af7d
   snapshot_location: 29356/44446/_ss/c5c538d6b8bc42f483eefbddd000af7d_v2.json
      format_version: 2
previous_snapshot_id: NULL
       segment_count: 1
         block_count: 1
           row_count: 2
  bytes_uncompressed: 150
    bytes_compressed: 829
          index_size: 1028
           timestamp: 2023-04-19 04:20:25.062854
```

### 步骤 3: 查找删除操作前的快照 ID

```sql
-- 假设从前一个查询中的 snapshot_id 是'xxxxxx'
-- 将表恢复到删除操作前的快照
ALTER TABLE users FLASHBACK TO (SNAPSHOT => 'c5c538d6b8bc42f483eefbddd000af7d');
```

数据：

```sql
SELECT * FROM users;
+------+------------+-----------+----------------------+----------------------------+
| id   | first_name | last_name | email                | registration_date          |
+------+------------+-----------+----------------------+----------------------------+
|    1 | John       | Doe       | john.doe@example.com | 2023-01-01 00:00:00.000000 |
|    2 | Jane       | Doe       | jane.doe@example.com | 2023-01-02 00:00:00.000000 |
+------+------------+-----------+----------------------+----------------------------+
```

````markdown
# 快照 {#snapshot}

使用 `Fuse_snapshot` 函数可以获取指定表的当前快照信息。以下是一个示例查询，以及其返回的结果：

```sql
SELECT * FROM Fuse_snapshot('default', 'users')\G;
```
````

返回结果示例：

```sql
*************************** 1. row ***************************
         snapshot_id: c5c538d6b8bc42f483eefbddd000af7d
   snapshot_location: 29356/44446/_ss/c5c538d6b8bc42f483eefbddd000af7d_v2.json
      format_version: 2
previous_snapshot_id: NULL
       segment_count: 1
         block_count: 1
           row_count: 2
  bytes_uncompressed: 150
    bytes_compressed: 829
          index_size: 1028
           timestamp: 2023-04-19 04:20:25.062854
```

- `snapshot_id` 是快照的唯一标识符。
- `snapshot_location` 指示快照文件的存储位置。
- `format_version` 表示快照格式的版本。
- `previous_snapshot_id` 是前一个快照的 ID，如果是第一个快照，则为 NULL。
- `segment_count`、`block_count` 和 `row_count` 分别表示快照中的段数、块数和行数。
- `bytes_uncompressed` 和 `bytes_compressed` 分别表示数据未压缩和压缩后的字节数。
- `index_size` 表示索引的大小。
- `timestamp` 是快照创建的时间戳。
