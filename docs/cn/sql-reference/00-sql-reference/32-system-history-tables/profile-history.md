---
title: system_history.profile_history
---

存储 Databend 中 SQL 查询（Query）的详细执行剖析。每个条目都提供性能指标和执行统计信息，允许用户分析和优化查询（Query）性能。

## 字段

| 字段 | 类型 | 描述 |
|-----------------|-----------|-----------------------------------------------------------------------------|
| timestamp | TIMESTAMP | 记录剖析时的时间戳 |
| query_id | VARCHAR | 与此剖析关联的查询（Query） ID |
| profiles | VARIANT | 包含详细执行剖析信息的 JSON 对象 |
| statistics_desc | VARIANT | 描述统计信息格式的 JSON 对象 |

## 示例

`profiles` 字段可用于提取特定信息。例如，要获取每个物理计划 (Physical Plan) 的 `OutputRows` 值，可以使用以下查询（Query）：
```sql
SELECT jq('[.[] | {id, output_rows: .statistics[4]}]', profiles ) AS result FROM system_history.profile_history LIMIT 1;

*************************** 1. row ***************************
result: [{"id":0,"output_rows":1},{"id":3,"output_rows":8},{"id":1,"output_rows":1},{"id":2,"output_rows":1}]
```