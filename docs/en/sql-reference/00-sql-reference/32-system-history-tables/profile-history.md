---
title: system_history.profile_history
---
Stores detailed execution profiles for SQL queries in Databend. Each entry provides performance metrics and execution statistics, allowing users to analyze and optimize query performance.

## Fields


| Field           | Type      | Description                                                                 |
|-----------------|-----------|-----------------------------------------------------------------------------|
| timestamp       | TIMESTAMP | The timestamp when the profile was recorded                                 |
| query_id        | VARCHAR   | The ID of the query associated with this profile                            |
| profiles        | VARIANT   | A JSON object containing detailed execution profile information             |
| statistics_desc | VARIANT   | A JSON object describing statistics format                                  |



## Examples

The `profiles` field can be used to extract specific information. For example, to get the `OutputRows` value for every physical plan, the following query can be used:
```sql
SELECT jq('[.[] | {id, output_rows: .statistics[4]}]', profiles ) AS result FROM system_history.profile_history LIMIT 1;

*************************** 1. row ***************************
result: [{"id":0,"output_rows":1},{"id":3,"output_rows":8},{"id":1,"output_rows":1},{"id":2,"output_rows":1}]
```
