---
title: 聚合 TopN
sidebar_label: 聚合 TopN
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: Unreleased"/>

`enable_aggregate_final_top_n` 设置用于启用最终聚合阶段的可选输出裁剪。对于符合条件且按聚合结果排序的 `GROUP BY` 查询，最终聚合仅保留排序靠前的候选分组。查询的最终排序和行数限制仍然决定结果。

目前尚未确认包含此设置的已发布版本。使用前，请检查 Databend 构建版本是否提供该设置。

## 设置

| 设置 | 默认值 | 说明 |
|------|--------|------|
| `enable_aggregate_final_top_n` | `0` | `0` 禁用此可选路径。`1` 允许最终聚合对符合条件的查询裁剪输出。 |
| `max_push_down_limit` | `10000` | 此优化允许的候选行数上限。存在偏移量时，TopN 候选数包含 `LIMIT + OFFSET`。 |

此设置不会启用编码列，也不依赖 `enable_encoded_columns`。

## 适用查询

满足以下条件时，优化器可以使用此路径：

- 查询至少有一个分组键。
- 每个排序键都直接引用分组键或聚合结果。
- 候选行数不超过 `max_push_down_limit`。
- 聚合不使用 grouping sets。
- 执行计划符合优化器支持的聚合及排序结构。

不要假设对聚合结果执行的所有表达式都符合条件。没有 `LIMIT` 的查询不会使用此有限输出路径。该设置不改变 SQL 查询的合法性。

## 示例

使用语句级提示，将设置限制在单条查询内：

```sql
SELECT /*+ SET_VAR(enable_aggregate_final_top_n = 1) */
    number % 10 AS bucket,
    SUM(number) AS total
FROM numbers(100)
GROUP BY bucket
ORDER BY total DESC, bucket
LIMIT 3;
```

如需查看计划而不执行查询，请使用带相同提示的 [EXPLAIN](/sql/sql-commands/explain-cmds/explain)：

```sql
EXPLAIN
SELECT /*+ SET_VAR(enable_aggregate_final_top_n = 1) */
    number % 10 AS bucket,
    SUM(number) AS total
FROM numbers(100)
GROUP BY bucket
ORDER BY total DESC, bucket
LIMIT 3;
```

计划细节取决于构建版本和优化器决策。这些示例不规定具体的计划显示格式，也不表示已测得性能提升。

## 范围与限制

最终聚合在生成已完成分组的结果时裁剪行。它不会提前停止源数据扫描，也不会避免计算所有必需的聚合状态。不要将此设置视为查询总内存或溢出数据量的上限。

此路径限制的是各最终聚合哈希表的候选行。它不保证整个分布式查询在阶段间仅传递 `LIMIT` 行。这些候选行之上仍会执行最终排序和行数限制。

仅按分组键排序有其他优化路径。禁用 `enable_aggregate_final_top_n` 不会禁用所有 TopN 优化。
