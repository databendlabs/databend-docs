---
title: system_history.profile_history
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.764"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='PROFILE HISTORY'/>

**查询性能深度分析** - 针对每个 SQL 查询的详细执行配置文件和统计信息。主要用于：

- **性能优化**：识别瓶颈并优化慢查询
- **资源规划**：了解内存、CPU 和 I/O 使用模式
- **执行分析**：分析查询计划和执行统计信息
- **容量管理**：监控资源消耗随时间变化的趋势

## 字段

| 字段            | 类型      | 描述                                       |
|-----------------|-----------|--------------------------------------------|
| timestamp       | TIMESTAMP | 记录配置文件的时间戳（Timestamp）          |
| query_id        | VARCHAR   | 与此配置文件关联的查询（Query）ID          |
| profiles        | VARIANT   | 包含详细执行配置文件信息的 JSON 对象       |
| statistics_desc | VARIANT   | 描述统计信息格式的 JSON 对象               |

## 示例

可以使用 `profiles` 字段提取特定信息。例如，要获取每个物理计划的 `OutputRows` 值，可以使用以下查询：
```sql
SELECT jq('[.[] | {id, output_rows: .statistics[4]}]', profiles ) AS result FROM system_history.profile_history LIMIT 1;

*************************** 1. row ***************************
result: [{"id":0,"output_rows":1},{"id":3,"output_rows":8},{"id":1,"output_rows":1},{"id":2,"output_rows":1}]
```