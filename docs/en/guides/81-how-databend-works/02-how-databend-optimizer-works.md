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

### Running example

To make the discussion concrete, keep the following analytics query in mind. Each phase highlights the part of the query that triggers the transformation being described.

```sql
WITH recent_orders AS (
  SELECT *
  FROM orders
  WHERE order_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '3' MONTH
    AND fulfillment_status <> 'CANCELLED'
)
SELECT c.region,
       COUNT(*) AS order_count,
       COUNT(o.id) AS row_count,
       COUNT(DISTINCT o.product_id) AS product_count,
       MIN(o.total_amount) AS min_amount,
       AVG(o.total_amount) AS avg_amount
FROM recent_orders o
JOIN customers c ON o.customer_id = c.id
LEFT JOIN products p ON o.product_id = p.id
WHERE c.status = 'ACTIVE'
  AND o.total_amount > 0
  AND p.is_active = TRUE
  AND 1 = 1
  AND EXISTS (
        SELECT 1
        FROM support_tickets t
        WHERE t.customer_id = c.id
          AND t.created_at > DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1' MONTH
      )
GROUP BY c.region
HAVING COUNT(*) > 100
ORDER BY order_count DESC
LIMIT 10;
```

## Phase 1: Prep & Stats

The first phase normalizes the query tree, removes obviously redundant work, and attaches the statistics that the rest of the pipeline depends on. In practice this means decorrelating subqueries, folding aggregates when metadata already has the answer, and annotating scan nodes with row counts and value ranges for later costing.

### 1. Subquery decorrelator

Transforms correlated subqueries into joins so the downstream optimizers operate on a join tree. In the running example, the `EXISTS` clause that checks recent support tickets is decorrelated:

```sql
... AND EXISTS (
      SELECT 1
      FROM support_tickets t
      WHERE t.customer_id = c.id
        AND t.created_at > DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1' MONTH
    )
```

```text
# Before
Filter (EXISTS correlated_subquery)
└─ Join (o.customer_id = c.id)
   ├─ Join (o.product_id = p.id)
   │  ├─ Scan (customers AS c)
   │  ├─ Scan (products AS p)
   │  └─ Scan (recent_orders AS o)
   └─ Subquery
      └─ Scan (support_tickets AS t)
         └─ Filter (t.customer_id = c.id AND t.created_at > ... )

# After
Join (Left Semi, c.id = tickets.customer_id)
├─ Join (o.customer_id = c.id AND o.product_id = p.id)
│  ├─ Scan (customers AS c)
│  ├─ Scan (products AS p)
│  └─ Scan (recent_orders AS o)
└─ Aggregate (tickets.customer_id)
   └─ Filter (tickets.created_at > ... )
      └─ Scan (support_tickets AS tickets)
```

### 2. Statistics-aware aggregates

`RuleStatsAggregateOptimizer` replaces eligible aggregate functions with pre-computed statistics and surfaces statistics objects to downstream passes. In the running example, if the SELECT list contained `MIN(o.total_amount)` without filtering, the optimizer would short-circuit to metadata instead of scanning `recent_orders`.

```sql
SELECT ..., MIN(o.total_amount) AS min_amount
FROM recent_orders o
...
```

```text
Scan (orders)
  table_stats: { num_rows, data_size, ... }
  column_stats: { region: { min, max, ndv, null_count }, ... }
  histograms: { region: ... }
```

These statistics drive selectivity estimation, join exploration, and the Cascades cost model.

### 4. Normalize aggregates

`RuleNormalizeAggregateOptimizer` simplifies aggregates so that redundant work is eliminated early. For instance, it converts `COUNT(o.id)` into `COUNT(*)` under the hood and deduplicates shared counters before pushing the work into the split aggregate phase.

## Phase 2: Heuristic Rewrites

With statistics in place, the second phase reshapes the logical plan: filters move closer to the data, aggregates split into partial/final stages, and CTEs get the same predicate exposure as base tables. Rules not shown explicitly here cover projection pruning and expression simplification, ensuring only necessary columns and predicates reach the join search.

### 6. Canonical rules (`DEFAULT_REWRITE_RULES`)

`RecursiveRuleOptimizer` runs a curated set of rewrite rules until they reach a fixed point. Representative examples:

- **Filter pushdown**

  ```text
  Filter (o.total_amount > 0)
  └─ Scan (recent_orders)

  # becomes

  Scan (recent_orders, pushdown_predicates=[total_amount > 0])
  ```

- **Limit pushdown**

  ```text
  Limit (10)
  └─ Sort (order_count DESC)
     └─ Join (...)

  # becomes

  Sort (order_count DESC)
  └─ Limit (10)
     └─ Join (...)
  ```

- **Elimination**

  ```text
  Filter (1 = 1 AND c.status = 'ACTIVE')
  └─ ...

  # becomes

  Filter (c.status = 'ACTIVE')
  └─ ...
  ```

The same batch also performs projection pruning, predicate normalization, and expression simplification.

### 7. CTE filter pushdown

`CTEFilterPushdownOptimizer` pushes predicates from the outer query into common table expressions (CTEs) and inlines trivial CTEs. In our query the CTE `recent_orders` receives the predicate `c.status = 'ACTIVE'` so the storage layer only reads active customers for the last three months.

```sql
WITH recent_orders AS (
  SELECT *
  FROM orders
  WHERE order_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '3' MONTH
    AND status = 'ACTIVE'          -- pushed into the CTE
)
```

### 8. Aggregate splitting

The second `RecursiveRuleOptimizer` invocation runs only the `SplitAggregate` rule. It rewrites single-stage aggregates into partial/final pairs so that partial aggregation can happen close to the data. The COUNT/AVG in the running query therefore become partial/final pairs: partial COUNT/AVG on each partition, final COUNT/AVG before the ORDER BY/LIMIT.

```text
Aggregate (mode=Final, SUM(amount) BY region)
└─ Aggregate (mode=Partial, SUM(amount) BY region)
   └─ Scan (orders)
```

## Phase 3: Join Strategy

Once the input has been cleaned up and annotated, Databend explores join alternatives and prepares the join tree for physical planning. Rules without dedicated examples (such as predicate deduplication) apply automatically before costing to keep hash tables and filter lists lean.

### 9. DPhpy join reordering

`DPhpyOptimizer` uses a dynamic-programming variant of the DP-Sub algorithm to enumerate alternative join orders. It relies on cardinality estimates produced earlier to rank candidates and keeps the cheapest plan for each join subset.

```sql
FROM recent_orders o
JOIN customers c ON o.customer_id = c.id
JOIN products p ON o.product_id = p.id
...
```

```
# Query graph
customers ──(customer_id)── orders ──(product_id)── products
           ╰──────────────┬──────────────╯
                      support_tickets

# One candidate ordering explored by DPhpy
Join (Hash, build=customers, probe=products)
├─ Build: customers (status = 'ACTIVE')  -- small after filter
└─ Probe: products
     └─ Join (Hash, build=products, probe=orders)
        ├─ Build: products (is_active = TRUE)
        └─ Probe: orders (recent_orders CTE)
```

By examining build/probe cardinalities, the optimizer favours orders where the filtered dimension tables build hash tables and the large fact table remains on the probe side.

### 10. Single-to-inner conversion

`SingleToInnerOptimizer` converts outer joins into inner joins when filters above the join guarantee that null-extended rows would be discarded. Because our query filters on `p.is_active = TRUE`, the original `LEFT JOIN products p` is rewritten as an inner join—rows without a matching product would fail the predicate anyway.

### 12. Join commutation (conditional)

If `enable_join_reorder` is true, a final `RecursiveRuleOptimizer` run with the `CommuteJoin` rule explores left and right swaps that were not considered by the dynamic-programming step. Databend prefers to build hash tables on the right side of a join, so swapping ensures the smaller input becomes the build side.

```sql
... JOIN customers c ON o.customer_id = c.id
```

```
# Before commutation
Join (Hash, build=orders, probe=customers)
├─ Build: orders   -- large fact table
└─ Probe: customers

# After commutation
Join (Hash, build=customers, probe=orders)
├─ Build: customers -- dimension table (smaller)
└─ Probe: orders    -- fact table
```

This extra pass reclaims cases where DPhpy produced a good join order but the physical orientation (build versus probe) still favours the larger relation.

**Join-strategy cheat sheet**

```
┌────────────────────────────┬──────────────────────────────────────────────┐
│ Optimizer                  │ Key effect                                   │
├────────────────────────────┼──────────────────────────────────────────────┤
│ DPhpyOptimizer             │ Enumerates join orders based on cardinality   │
│ SingleToInnerOptimizer     │ Turns eligible outer joins into cheaper inner │
│                             │ joins when filters eliminate null-extended rows │
│ DeduplicateJoinCondition   │ Removes repeated predicates to shrink hash    │
│                             │ tables                                        │
│ CommuteJoin (conditional)  │ Swaps build/probe sides to place the smaller  │
│                             │ input on the hash-table side                 │
└────────────────────────────┴──────────────────────────────────────────────┘
```

## Phase 4: Physical & Cleanup

The final phase turns the logical tree into physical operators, evaluates their cost, and removes any remaining scaffolding. Helper rules without diagrams here (for example removing redundant projections) run automatically after Cascades picks a plan.

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

## Observability

- Use `EXPLAIN` or `EXPLAIN PIPELINE` to view the final optimized plan.
- Query the system query log (`SELECT * FROM system.query_log WHERE query_id = ...`) and inspect the optimizer profile to see which stages ran, in what order, and how long each took.
- `EXPLAIN ANALYZE` shows the optimized plan alongside runtime statistics so you can compare estimates with actual metrics.

## Summary

Databend's optimizer blends rule-based rewrites with cost-based selection. Keep in mind:

- Phase 1 prepares the tree (decorrelate, fold in statistics) so later stages have clean inputs and realistic cardinalities.
- Phase 2 reduces data volume early by pushing filters, splitting aggregates, and propagating predicates into CTEs.
- Phase 3 explores join orders, converts joins into their cheapest equivalents, and reshapes build/probe sides.
- Phase 4 turns the surviving logical alternatives into physical operators using Cascades and cleans up scaffolding.

When a query behaves differently from what you expect, walk through these phases against a concrete query: check the normalized plan (`EXPLAIN`) to ensure subqueries became joins, confirm predicate pushdown, inspect the join strategy in the query log, and only then look at runtime counters. The pipeline is designed so each step leaves the plan slightly better for the next, trimming CPU, memory, network, and I/O along the way.
