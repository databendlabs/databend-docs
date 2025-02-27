---
title: FUSE_TIME_TRAVEL_SIZE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.684"/>

计算表的历史数据（用于时间回溯）的存储大小。

## 语法

```sql
-- 计算所有数据库中所有表的历史数据大小
SELECT ...
FROM fuse_time_travel_size();

-- 计算指定数据库中所有表的历史数据大小
SELECT ...
FROM fuse_time_travel_size('<database_name>');

-- 计算指定数据库中指定表的历史数据大小
SELECT ...
FROM fuse_time_travel_size('<database_name>', '<table_name>'));
```

## 输出

该函数返回一个包含以下列的结果集：

| 列名                           | 描述                                                                                           |
|----------------------------------|-------------------------------------------------------------------------------------------------------|
| `database_name`                  | 表所在的数据库名称。                                                  |
| `table_name`                     | 表的名称。                                                                                |
| `is_dropped`                     | 表示表是否已被删除（`true` 表示已删除，`false` 表示未删除）。          |
| `time_travel_size`               | 表的历史数据（用于时间回溯）的总存储大小，单位为字节。                  |
| `latest_snapshot_size`           | 表的最新快照的存储大小，单位为字节。                                       |
| `data_retention_period_in_hours` | 时间回溯数据的保留时间，单位为小时（`NULL` 表示使用默认保留策略）。 |
| `error`                          | 获取存储大小时遇到的任何错误（如果没有错误发生，则为 `NULL`）。               |

## 示例

以下示例计算 `default` 数据库中所有表的历史数据：

```sql
SELECT * FROM fuse_time_travel_size('default')

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ database_name │ table_name │ is_dropped │ time_travel_size │ latest_snapshot_size │ data_retention_period_in_hours │       error      │
├───────────────┼────────────┼────────────┼──────────────────┼──────────────────────┼────────────────────────────────┼──────────────────┤
│ default       │ books      │ true       │             2810 │                 1490 │                           NULL │ NULL             │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```