---
title: How Databend Optimizer Works
---

Databend's query optimizer orchestrates a series of transformations that turn SQL text into an executable plan. The optimizer builds an abstract representation of the query, enriches it with statistics, applies rule-based rewrites, explores join alternatives, and finally picks the cheapest physical operators.

## Core Building Blocks

- **SExpr**: A tree representation of relational operators and expressions. Every optimizer works with the same SExpr interface, which keeps transformations consistent.
- **Memo**: A shared data structure the Cascades optimizer uses to manage alternative SExprs along with their computed costs.
- **Rules**: Pattern-based rewrites that transform part of a plan into an equivalent but cheaper shape. Rule groups (for example `DEFAULT_REWRITE_RULES`) are executed by recursive optimizers.
- **Optimizer pipeline**: An ordered chain of optimizers. Each optimizer can transform the plan, enrich metadata, or decide whether the next optimizer should run.
- **Cost model**: A small set of per-row factors (compute, hash table, aggregate, network) that estimates the runtime cost of each candidate physical plan.

### Statistics Inputs

Databend collects statistics lazily and attaches them to scan nodes when the pipeline requires them:

**Table statistics**

- `num_rows`: Approximate row count used for cardinality estimation
- `data_size`: Total uncompressed data size in bytes
- `number_of_blocks`: Physical data blocks in object storage
- `number_of_segments`: Higher-level storage segments

**Column statistics**

- `min` and `max`: Value ranges that enable range pruning
- `null_count`: Number of null values for selectivity estimation
- `number_of_distinct_values`: Distinct counts that help choose join and aggregation strategies
- `histograms`: Optional buckets that improve selectivity for skewed data

## Optimization Pipeline at a Glance

The pipeline executed by Databend today is shown below (steps are executed in order unless noted as conditional):

| Step | Optimizer | Type | Purpose |
| --- | --- | --- | --- |
| 1 | `SubqueryDecorrelatorOptimizer` | Logical | Rewrite correlated subqueries into joins or apply/exists filters |
| 2 | `RuleStatsAggregateOptimizer` | Logical | Replace eligible aggregates (MIN/MAX) with statistics and propagate stats metadata |
| 3 | `CollectStatisticsOptimizer` | Metadata | Attach table and column statistics to scans for later costing |
| 4 | `RuleNormalizeAggregateOptimizer` | Logical | Simplify aggregates (shared `COUNT(*)`, remove redundant DISTINCT) |
| 5 | `PullUpFilterOptimizer` | Logical | Hoist predicates to the top of the tree and expose join conditions |
| 6 | `RecursiveRuleOptimizer` (`DEFAULT_REWRITE_RULES`) | Logical | Apply canonical rewrites such as filter and limit pushdown or projection pruning |
| 7 | `CTEFilterPushdownOptimizer` | Logical | Push filters into common table expressions and inline them when safe |
| 8 | `RecursiveRuleOptimizer` (`SplitAggregate`) | Logical | Build partial/final aggregate pairs for parallel execution |
| 9 | `DPhpyOptimizer` | Cost-guided logical | Explore join orders using dynamic programming guided by statistics |
| 10 | `SingleToInnerOptimizer` | Logical | Convert certain outer joins to inner joins once filters guarantee matchability |
| 11 | `DeduplicateJoinConditionOptimizer` | Logical | Remove duplicated join predicates so the executor evaluates each condition once |
| 12 | `RecursiveRuleOptimizer` (`CommuteJoin`) | Logical (conditional) | Explore commuted joins when `enable_join_reorder` is true |
| 13 | `CascadesOptimizer` | Cost-based | Select the cheapest physical operators using the memo and cost model |
| 14 | `RecursiveRuleOptimizer` (`EliminateEvalScalar`) | Cleanup (conditional) | Drop redundant projections when aggregate index planning is not active |
| 15 | `CleanupUnusedCTEOptimizer` | Cleanup | Prune CTE definitions that are no longer referenced by the final plan |

> Note: The optimizer pipeline is asynchronous. Each optimizer can short-circuit if it detects that more work is unnecessary (for example when Cascades times out and the pipeline falls back to the heuristic plan).

## Phase 1 - Preparation and Statistics

### 1. Subquery decorrelator

Transforms correlated subqueries into joins so the downstream optimizers operate on a join tree.

```sql
SELECT *
FROM customers c
WHERE c.total_orders > (
  SELECT AVG(total_orders)
  FROM customers
  WHERE region = c.region
);
```

```text
# Before
Filter (c.total_orders > Subquery)
└─ Scan (customers AS c)
   └─ Aggregate (AVG(total_orders))
      └─ Filter (region = c.region)
         └─ Scan (customers)

# After
Filter (c.total_orders > r.avg_total)
└─ Join (c.region = r.region)
   ├─ Scan (customers AS c)
   └─ Aggregate (region, AVG(total_orders) AS avg_total)
      └─ Scan (customers)
```

### 2. Statistics-aware aggregates

`RuleStatsAggregateOptimizer` replaces eligible aggregate functions with pre-computed statistics and surfaces statistics objects to downstream passes.

```sql
SELECT MIN(price) FROM products;
```

```text
# Before
Aggregate (MIN(price))
└─ EvalScalar
   └─ Scan (products)

# After
EvalScalar (price_min)
└─ DummyTableScan
```

The result avoids scanning the table when metadata already contains the answer.

### 3. Collect statistics

`CollectStatisticsOptimizer` resolves on-demand statistics from the storage layer and attaches them to scan nodes.

```text
Scan (orders)
  table_stats: { num_rows, data_size, ... }
  column_stats: { region: { min, max, ndv, null_count }, ... }
  histograms: { region: ... }
```

These statistics drive selectivity estimation, join exploration, and the Cascades cost model.

### 4. Normalize aggregates

`RuleNormalizeAggregateOptimizer` simplifies aggregates so that redundant work is eliminated early.

```sql
SELECT COUNT(id), COUNT(*), COUNT(DISTINCT region)
FROM orders
GROUP BY region;
```

```text
# COUNT(id) -> COUNT(*)
# Shared COUNT(*) reused
Aggregate (GROUP BY [region], COUNT(*), COUNT())
└─ Scan (orders)
```

## Phase 2 - Heuristic rewrites

### 5. Pull up filters

`PullUpFilterOptimizer` hoists predicates toward the root and gathers join conditions in a single filter node. Exposure of predicates at the top of the tree allows later rule batches to inspect and rearrange them.

### 6. Canonical rules (`DEFAULT_REWRITE_RULES`)

`RecursiveRuleOptimizer` runs a curated set of rewrite rules until they reach a fixed point. Representative examples:

- **Filter pushdown**

  ```text
  Filter (region = 'APAC')
  └─ Scan (orders)

  # becomes

  Scan (orders, pushdown_predicates=[region = 'APAC'])
  ```

- **Limit pushdown**

  ```text
  Limit (10)
  └─ Sort (order_date)
     └─ Scan (orders)

  # becomes

  Sort (order_date)
  └─ Limit (10)
     └─ Scan (orders)
  ```

- **Elimination**

  ```text
  Filter (1 = 1)
  └─ Scan (orders)

  # becomes

  Scan (orders)
  ```

The same batch also performs projection pruning, predicate normalization, and expression simplification.

### 7. CTE filter pushdown

`CTEFilterPushdownOptimizer` pushes predicates from the outer query into common table expressions (CTEs) and inlines trivial CTEs. This limits the amount of data materialized by reusable subplans.

```sql
WITH recent_orders AS (
  SELECT * FROM orders WHERE order_date > CURRENT_DATE - 30
)
SELECT * FROM recent_orders WHERE region = 'APAC';
```

After the optimizer, the inner CTE filter becomes `order_date > ... AND region = 'APAC'`, reducing the work required each time the CTE is referenced.

### 8. Aggregate splitting

The second `RecursiveRuleOptimizer` invocation runs only the `SplitAggregate` rule. It rewrites single-stage aggregates into partial/final pairs so that partial aggregation can happen close to the data.

```text
Aggregate (mode=Final, SUM(amount) BY region)
└─ Aggregate (mode=Partial, SUM(amount) BY region)
   └─ Scan (orders)
```

## Phase 3 - Join strategy

### 9. DPhpy join reordering

`DPhpyOptimizer` uses a dynamic-programming variant of the DP-Sub algorithm to enumerate alternative join orders. It relies on cardinality estimates produced earlier to rank candidates and keeps the cheapest plan for each join subset.

### 10. Single-to-inner conversion

`SingleToInnerOptimizer` converts outer joins into inner joins when filters above the join guarantee that null-extended rows would be discarded. This conversion unlocks additional hash join implementations and helps the cost model evaluate cheaper alternatives.

### 11. Deduplicate join conditions

`DeduplicateJoinConditionOptimizer` removes duplicate predicates (for example the same equality added by multiple rules). Fewer predicates mean smaller hash tables and less CPU spent evaluating redundant expressions.

### 12. Join commutation (conditional)

If `enable_join_reorder` is true, a final `RecursiveRuleOptimizer` run with the `CommuteJoin` rule explores left and right swaps that were not considered by the dynamic-programming step. Databend prefers to build hash tables on the right side of a join, so swapping ensures the smaller input becomes the build side.

## Phase 4 - Physical planning and cleanup

### 13. Cascades optimizer

`CascadesOptimizer` populates the memo with logical expressions, expands possible physical implementations (for example hash join versus nested loop), and picks the cheapest plan according to the cost model.

**Sample cost factors**

| Factor | Default value |
| --- | --- |
| `compute_per_row` | 1 |
| `hash_table_per_row` | 10 |
| `aggregate_per_row` | 5 |
| `network_per_row` | 50 |

Costs are computed per operator as `rows * factor` with adjustments for build and probe phases. The optimizer accumulates these estimates bottom-up and keeps the plan with the lowest total cost.

### 14. Eliminate EvalScalar (conditional)

Unless Databend is planning an aggregate index query, a final rule pass removes redundant scalar projections that may have been introduced to support rewrites.

### 15. Cleanup unused CTEs

`CleanupUnusedCTEOptimizer` walks the final plan and removes CTE definitions that are no longer referenced after the previous transformations. This keeps the executed plan compact.

## Observability

- Use `EXPLAIN` or `EXPLAIN PIPELINE` to view the final optimized plan.
- Set `SET enable_optimizer_profile = 1` and rerun your query to capture the optimizer pipeline trace in the query log.
- `EXPLAIN ANALYZE` shows the optimized plan alongside runtime statistics so you can compare estimates with actual metrics.

## Summary

Databend's optimizer combines rule-based and cost-based techniques. The preparation phase collects statistics and normalizes the plan, heuristic rewrites push predicates and split work for distributed execution, dedicated join optimizers explore join orderings, and the Cascades stage picks the cheapest physical implementation. Cleanup passes ensure the final plan is minimal. Together these steps minimize CPU, memory, network, and I/O usage for each query.
