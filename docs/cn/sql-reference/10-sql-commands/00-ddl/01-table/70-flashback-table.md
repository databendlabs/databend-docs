---
title: FLASHBACK TABLE
sidebar_position: 9
---

使用快照 ID 或时间戳将表恢复到早期版本，仅涉及元数据操作，因此过程非常快速。

通过命令中指定的快照 ID 或时间戳，Databend 将表恢复到创建该快照时的先前状态。要检索表的快照 ID 和时间戳，请使用 [FUSE_SNAPSHOT](../../../20-sql-functions/16-system-functions/fuse_snapshot.md)。

表的时间回溯功能受以下条件限制：

- 该命令仅将现有表恢复到其先前状态。要恢复已删除的表，请使用 [UNDROP TABLE](21-ddl-undrop-table.md)。

- 表的时间回溯是 Databend 时间回溯功能的一部分。在使用该命令之前，请确保您要回溯的表符合时间回溯的条件。例如，该命令不适用于临时表，因为 Databend 不会为此类表创建或存储快照。

- 您无法在将表恢复到先前状态后回滚，但可以再次将表回溯到更早的状态。

- Databend 建议仅在紧急恢复时使用此命令。要查询表的历史数据，请使用 [AT](../../20-query-syntax/03-query-at.md) 子句。

## 语法

```sql
-- 使用快照 ID 恢复
ALTER TABLE <table> FLASHBACK TO (SNAPSHOT => '<snapshot-id>');

-- 使用快照时间戳恢复
ALTER TABLE <table> FLASHBACK TO (TIMESTAMP => '<timestamp>'::TIMESTAMP);
```

## 示例

### 步骤 1：创建示例用户表并插入数据
```sql
-- 创建示例用户表
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

### 步骤 2：模拟意外删除操作

```sql
-- 模拟意外删除操作
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

### 步骤 3：找到删除操作前的快照 ID
```sql
-- 假设之前查询的快照 ID 是 'xxxxxx'
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