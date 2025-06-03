---
title: system_history.profile_history
---
Stores detailed execution profiles for SQL queries in Databend. Each entry provides performance metrics and execution statistics, allowing users to analyze and optimize query performance.

The `profiles` field contains a JSON object with detailed information.

```sql
DESCRIBE system_history.profile_history

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

You can use the `profiles` field to extract specific information from the JSON object. For example, to get the `OutputRows` value for every physical plan, you can use the following query:
```sql
SELECT jq('[.[] | {id, output_rows: .statistics[4]}]', profiles ) AS result FROM system_history.profile_history LIMIT 1;
*************************** 1. row ***************************
result: [{"id":0,"output_rows":1},{"id":3,"output_rows":8},{"id":1,"output_rows":1},{"id":2,"output_rows":1}]
```
