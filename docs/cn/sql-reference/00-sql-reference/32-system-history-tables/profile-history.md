---
title: system_history.profile_history
---
用于存储 Databend 中 SQL 查询的详细执行配置文件。每个条目提供性能指标和执行统计信息，便于用户分析并优化查询性能。

`profiles` 字段包含详细信息的 JSON 对象。

```sql
DESCRIBE system_history.profile_history;

╭─────────────────────────────────────────────────────────╮
│      Field      │    Type   │  Null  │ Default │  Extra │
│      String     │   String  │ String │  String │ String │
├─────────────────┼───────────┼────────┼─────────┼────────┤
│ timestamp       │ TIMESTAMP │ YES    │ NULL    │        │
│ query_id        │ VARCHAR   │ YES    │ NULL    │        │
│ profiles        │ VARIANT   │ YES    │ NULL    │        │
│ statistics_desc │ VARIANT   │ YES    │ NULL    │        │
╰─────────────────────────────────────────────────────────╯
```

`profiles` 字段可用于提取特定信息。例如，要获取每个物理计划的 `OutputRows` 值，可执行以下查询：
```sql
SELECT jq('[.[] | {id, output_rows: .statistics[4]}]', profiles ) AS result FROM system_history.profile_history LIMIT 1;

*************************** 1. row ***************************
result: [{"id":0,"output_rows":1},{"id":3,"output_rows":8},{"id":1,"output_rows":1},{"id":2,"output_rows":1}]
```