---
title: Aggregate TopN
sidebar_label: Aggregate TopN
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: Unreleased"/>

The `enable_aggregate_final_top_n` setting enables optional output pruning in final aggregation. For an eligible `GROUP BY` query ordered by aggregate results, final aggregation keeps only its leading candidate groups. The query's final ordering and limit still determine the result.

This setting is not in a confirmed published release yet. Check that your Databend build provides it before use.

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `enable_aggregate_final_top_n` | `0` | `0` disables this optional path. `1` allows final aggregation to prune its output for eligible queries. |
| `max_push_down_limit` | `10000` | Upper bound on the candidate row count for this optimization. With an offset, the TopN candidate count includes `LIMIT + OFFSET`. |

The setting does not enable encoded columns. It does not require `enable_encoded_columns`.

## Eligible Queries

The optimizer can use this path when:

- The query has at least one grouping key.
- Each ordering key refers directly to a grouping key or an aggregate result.
- The candidate row count is at most `max_push_down_limit`.
- The aggregation does not use grouping sets.
- The plan matches the optimizer's supported aggregation and ordering shape.

Do not assume that every expression over an aggregate result is eligible. A query without `LIMIT` does not use this bounded-output path. The setting does not change which queries are valid SQL.

## Example

Use a statement-level hint to keep the setting local to one query:

```sql
SELECT /*+ SET_VAR(enable_aggregate_final_top_n = 1) */
    number % 10 AS bucket,
    SUM(number) AS total
FROM numbers(100)
GROUP BY bucket
ORDER BY total DESC, bucket
LIMIT 3;
```

To inspect the plan without running the query, use [EXPLAIN](/sql/sql-commands/explain-cmds/explain) with the same hint:

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

Plan details depend on the build and optimizer decisions. These examples do not prescribe a specific plan display or a measured speedup.

## Scope and Limits

Final aggregation prunes rows as it produces completed group results. It does not stop the source scan early or avoid computing all required aggregate states. Do not treat the setting as a bound on total query memory or spill volume.

This path limits candidates from individual final-aggregation hash tables. It does not guarantee that the entire distributed query emits only `LIMIT` rows between stages. The final ordering and limit still apply above those candidates.

Ordering only by grouping keys has separate optimization paths. Disabling `enable_aggregate_final_top_n` does not disable every TopN optimization.
