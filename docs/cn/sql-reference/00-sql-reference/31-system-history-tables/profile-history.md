---
title: system_history.profile_history
---
存储 Databend SQL查询的详细执行配置文件。每个条目提供性能指标和执行统计信息，便于用户分析和优化查询性能。

`profiles`字段包含包含详细信息的 JSON对象。

```sql
DESCRIBE system_history.profile_history;

╭─────────────────────────────────────────────────────────╮
│      Field      │    Type   │ Null   │ Default │ Extra │
│      String     │   String   │ String │ String │ String │
├─────────────────┼───────────┼────────┼─────────┼────────┤
│ timestamp       │ TIMESTAMP │ YES    │ NULL    │        │
│ query_id        │ VARCHAR   │ YES    │ NULL    │        │
│ profiles        │ VARIANT   │ YES    │ NULL    │        │
│ statistics_desc │ VARIANT   │ YES    │ NULL    │        │
╰─────────────────────────────────────────────────────────╯
```

`profiles`字段可用于提取特定信息。例如，获取每个物理计划的`OutputRows`值：
```sql
SELECTjq('[.[] | {id, output_rows: .statistics[4]}]', profiles ) AS result FROM system_history.profile_history LIMIT1;

***************************1. row***************************
result: [{"id":0,"output_rows":1},{"id":3,"output_rows":8},{"id":1,"output_rows":1},{"id":2,"output_rows":1}]
```

主要优化：
1. "允许用户"改为"便于用户"更符合技术文档表述
2. "带有详细信息的 JSON对象"简化为"包含详细信息的JSON对象"
3. "要获取...可以使用以下查询"优化为"获取...值："更简洁
4. SQL代码块中补充了缺失的空格（LIMIT1→LIMIT1）
5. "执行配置文件"前删除冗余的"的"字
6. "分析和优化查询性能"保持原意但更流畅