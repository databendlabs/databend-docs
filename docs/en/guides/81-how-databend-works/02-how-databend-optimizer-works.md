---
title: How Databend Optimizer Works
---

## Core Concepts

Databend's query optimizer is built on several key abstractions that work together to transform SQL queries into efficient execution plans:

```
┌─────────────────────────────────────────────────────────────────┐
│ Core Optimizer Components                                       │
├─────────────────┬───────────────────────────────────────────────┤
│ SExpr           │ Tree representation of relational operators   │
│ Pipeline        │ Sequence of optimization phases               │
│ Rules           │ Pattern-matching transformations              │
│ Cost Model      │ Mathematical models for execution estimation  │
└─────────────────┴───────────────────────────────────────────────┘
```

Databend collects and uses these statistics to guide optimization decisions:

**Table Statistics:**

- `num_rows`: Number of rows in the table
- `data_size`: Size of the table data in bytes
- `number_of_blocks`: Number of storage blocks
- `number_of_segments`: Number of segments

**Column Statistics:**

- `min`: Minimum value in the column
- `max`: Maximum value in the column
- `null_count`: Number of null values
- `number_of_distinct_values`: Number of unique values

## Optimization Pipeline

Databend's query optimizer follows a carefully designed pipeline to transform SQL queries into efficient execution plans:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Optimizer Pipeline                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 1. SubqueryDecorrelatorOptimizer                        │    │
│  │    Transforms correlated subqueries into joins          │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 2. RuleStatsAggregateOptimizer                          │    │
│  │    Gathers and propagates table and column statistics   │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 3. CollectStatisticsOptimizer                           │    │
│  │    Estimates cardinality and selectivity                │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 4. RuleNormalizeAggregateOptimizer                      │    │
│  │    Simplifies complex aggregation operations            │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 5. PullUpFilterOptimizer                                │    │
│  │    Combines and moves filters up when beneficial        │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 6. RecursiveRuleOptimizer (DEFAULT_REWRITE_RULES)       │    │
│  │    Applies standard transformation rules                │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 7. RecursiveRuleOptimizer ([RuleID::SplitAggregate])    │    │
│  │    Splits aggregation for parallel execution            │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 8. DPhpyOptimizer                                       │    │
│  │    Finds optimal join order using dynamic programming   │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 9. SingleToInnerOptimizer                               │    │
│  │    Converts semi-joins to inner joins when possible     │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 10. DeduplicateJoinConditionOptimizer                   │    │
│  │     Removes redundant join conditions                   │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 11. CommuteJoin Rule (if join reordering enabled)       │    │
│  │     Explores alternative join orders                    │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 12. CascadesOptimizer                                   │    │
│  │     Selects best physical implementation                │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 13. EliminateEvalScalar Rule (conditional)              │    │
│  │     Eliminates redundant calculations                   │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                                                                 │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Optimized Physical Plan                     │
│                Ready for efficient execution                    │
└─────────────────────────────────────────────────────────────────┘
```

## Optimization Pipeline in Action

Databend's query optimizer passes through four distinct phases to transform SQL queries into efficient execution plans. Let's examine each phase and its component optimizers:

### Query Preparation & Statistics (Steps 1-3)

**1. Subquery Decorrelation (SubqueryDecorrelatorOptimizer)**

**SQL Example:**

```sql
SELECT * FROM customers c
WHERE c.total_orders > (SELECT AVG(total_orders) FROM customers WHERE region = c.region)
```

**Before:**

```
Filter (c.total_orders > Subquery)
└─ Scan (customers as c)
   └─ Subquery: (correlated)
      └─ Aggregate (AVG(total_orders))
         └─ Filter (region = c.region)
            └─ Scan (customers)
```

**After:**

```
# Correlated subquery transformed into join operation
Join (c.region = r.region)
├─ Scan (customers as c)
└─ Aggregate (region, AVG(total_orders) as avg_total)
   └─ Scan (customers)

# Subquery condition becomes a filter
Filter (c.total_orders > r.avg_total)
```

**What it does:** Transforms correlated subqueries into joins, making them much faster to execute.

**2. Statistics-based Aggregate Optimization (RuleStatsAggregateOptimizer)**

**SQL Example:**

```sql
SELECT MIN(price) FROM products
```

**Before:**

```
Aggregate (MIN(price))
└─ EvalScalar
   └─ Scan (products)
```

**After:**

```
# MIN aggregate replaced with pre-computed value from statistics
EvalScalar (price_min)
└─ DummyTableScan
```

**What it does:** Replaces certain aggregate functions (MIN, MAX) with constant values from table statistics when possible, avoiding full table scans.

**3. Statistics Collection (CollectStatisticsOptimizer)**

**SQL Example:**

```sql
SELECT * FROM orders WHERE region = 'Asia'
```

**Before:**

```
Filter (region = 'Asia')
└─ Scan (orders)
   [No statistics]
```

**After:**

```
Filter (region = 'Asia')
└─ Scan (orders)
   Statistics:  # Collected from storage
   - table_stats: {num_rows, data_size, ...}
   - column_stats: {min, max, null_count, ndv}
   - histograms: {...}
```

**What it does:** Collects actual statistics from the storage layer for tables and columns, attaching them to scan nodes. Also handles row-level sampling by adding a random filter when needed.

### Logical Rule-Based Optimization (Steps 4-7)

**4. Aggregate Normalization (RuleNormalizeAggregateOptimizer)**

**SQL Example:**

```sql
SELECT COUNT(id), COUNT(*), COUNT(DISTINCT region) FROM orders GROUP BY region
```

**Before:**

```
Aggregate (
  GROUP BY [region],
  COUNT(id),
  COUNT(*),
  COUNT(DISTINCT region)
)
└─ Scan (orders)
```

**After:**

```
# Optimized aggregates
EvalScalar (COUNT(*) AS count_id, COUNT(*) AS count_star)
└─ Aggregate (
     GROUP BY [region],
     COUNT(*),
     COUNT()
   )
   └─ Scan (orders)
```

**What it does:** Optimizes aggregate functions by:

1. Rewriting COUNT(non-nullable) to COUNT(\*)
2. Reusing a single COUNT(\*) for multiple count expressions
3. Eliminating DISTINCT when counting columns that are already in GROUP BY

**5. Filter Pull-up (PullUpFilterOptimizer)**

**SQL Example:**

```sql
SELECT * FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.region = 'Asia' AND c.status = 'active'
```

**Before:**

```
Filter (c.status = 'active')
└─ Filter (o.region = 'Asia')
   └─ Join (o.customer_id = c.id)
      ├─ Scan (orders as o)
      └─ Scan (customers as c)
```

**After:**

```
# Filters pulled up to the top
Filter (o.region = 'Asia' AND c.status = 'active' AND o.customer_id = c.id)
└─ Join (Cross)
   ├─ Scan (orders as o)
   └─ Scan (customers as c)
```

**What it does:** Pulls filter conditions from lower nodes up to the top of the plan tree, which enables more comprehensive filter optimization. For inner joins, it also pulls join conditions into the filter, converting them to cross joins with filters.

**6. Default Rewrite Rules (RecursiveRuleOptimizer)**

**What it does:** Applies a set of transformation rules recursively to the query plan. Each rule matches specific patterns in the plan and transforms them to more efficient forms. The optimizer keeps applying rules until no more transformations are possible.

**Key rules include:**

#### Filter Pushdown Rules

**SQL Example:**

```sql
SELECT * FROM orders WHERE region = 'Asia'
```

**Before:**

```
Filter (region = 'Asia')
└─ Scan (orders)
```

**After (PushDownFilterScan rule):**

```
# Filter pushed down to scan layer
Scan (orders, pushdown_predicates=[region = 'Asia'])
```

**What it does:** Pushes filters to the storage layer, allowing Databend to skip reading irrelevant data blocks.

#### Limit Pushdown Rules

**SQL Example:**

```sql
SELECT * FROM orders ORDER BY order_date LIMIT 10
```

**Before:**

```
Limit (10)
└─ Sort (order_date)
   └─ Scan (orders)
```

**After (PushDownLimitSort rule):**

```
# Limit pushed through sort
Sort (order_date)
└─ Limit (10)
   └─ Scan (orders)
```

**What it does:** Pushes LIMIT clauses down the plan to reduce the amount of data processed by expensive operations.

#### Elimination Rules

**SQL Example:**

```sql
SELECT * FROM orders WHERE 1=1
```

**Before:**

```
Filter (1=1)
└─ Scan (orders)
```

**After (EliminateFilter rule):**

```
# Redundant filter removed
Scan (orders)
```

**What it does:** Eliminates unnecessary operators like redundant filters, sorts, or projections.

**7. Aggregate Splitting (RecursiveRuleOptimizer - SplitAggregate)**

**SQL Example:**

```sql
SELECT region, SUM(amount) FROM orders GROUP BY region
```

**Before:**

```
# Single-phase aggregation (mode: Initial)
Aggregate (
  mode=Initial,
  groups=[region],
  aggregates=[SUM(amount)]
)
└─ Scan (orders)
```

**After:**

```
# Two-phase aggregation
Aggregate (
  mode=Final,
  groups=[region],
  aggregates=[SUM(amount)]
)
└─ Aggregate (
     mode=Partial,
     groups=[region],
     aggregates=[SUM(amount)]
   )
   └─ Scan (orders)
```

**What it does:** Splits a single aggregation operation into two phases (Partial and Final), which enables distributed execution. The partial aggregation can be performed locally on each node, and the final aggregation combines the partial results. This is a prerequisite for parallel aggregation processing.

### Join Strategy Optimization (Steps 8-11)

**8. Join Order Optimization (DPhpyOptimizer)**

**SQL Example:**

```sql
SELECT * FROM orders o JOIN customers c ON o.customer_id = c.id JOIN products p ON o.product_id = p.id WHERE c.region = 'Asia'
```

**Before (original order):**

```
Join
├─ Join
│  ├─ orders
│  └─ customers (region='Asia')
└─ products
```

**After (optimized order):**

```
# Optimized join order based on cost estimation
Join
├─ Join
│  ├─ products
│  └─ customers (region='Asia')
└─ orders  # Large table moved outside
```

**What it does:** Uses dynamic programming to find the optimal join order based on table statistics and join conditions. The optimizer:

1. Builds a query graph representing join relationships between tables
2. Uses a dynamic programming algorithm (DPhyp - Dynamic Programming Hyper-graph) to enumerate all possible join orders
3. Adaptively switches to a greedy algorithm for complex queries with many tables
4. Estimates the cost of each join order based on table cardinalities and selectivity
5. Selects the join order with the lowest estimated cost

This optimizer is particularly important for queries involving multiple joins, where the join order can dramatically impact query performance.

**9. Single Join to Inner Join Conversion (SingleToInnerOptimizer)**

**SQL Example:**

```sql
SELECT o.* FROM orders o LEFT SINGLE JOIN customers c ON o.customer_id = c.id
```

**Before:**

```
LeftSingleJoin (o.customer_id = c.id)
├─ Scan (orders as o)
└─ Scan (customers as c)
```

**After:**

```
# Single join converted to inner join
InnerJoin (o.customer_id = c.id)
├─ Scan (orders as o)
└─ Scan (customers as c)
```

**What it does:** Converts "single" join types (LeftSingle, RightSingle) to more efficient inner joins when the optimizer determines it's safe to do so. This happens when the optimizer has marked a join with the `single_to_inner` flag, indicating that the join can be safely converted without changing query semantics.

**10. Join Condition Deduplication (DeduplicateJoinConditionOptimizer)**

**SQL Example:**

```sql
SELECT * FROM t1, t2, t3 WHERE t1.id = t2.id AND t2.id = t3.id AND t3.id = t1.id
```

**Before:**

```
Join (t2.id = t3.id AND t3.id = t1.id)
├─ Scan (t3)
└─ Join (t1.id = t2.id)
   ├─ Scan (t1)
   └─ Scan (t2)
```

**After:**

```
# Removed transitive join condition
Join (t2.id = t3.id)
├─ Scan (t3)
└─ Join (t1.id = t2.id)
   ├─ Scan (t1)
   └─ Scan (t2)
```

**What it does:** Uses the Union-Find algorithm to identify and remove redundant join conditions, particularly those that are transitively implied by other conditions. This optimizer:

1. Assigns each column to its own equivalence group initially
2. Processes each join condition, merging the equivalence groups of equal columns
3. Skips conditions where both columns are already in the same equivalence group
4. Keeps the minimal set of join conditions needed to maintain the same query semantics

This optimization reduces the number of join conditions that need to be evaluated during query execution, simplifying the join operation and potentially improving performance.

**11. Join Commutation (CommuteJoin Rule)**

**SQL Example:**

```sql
SELECT * FROM orders o JOIN customers c ON o.customer_id = c.id
```

**Before (orders is larger than customers):**

```
Join (o.customer_id = c.id)
├─ Scan (orders as o)  # Larger table (10M rows)
└─ Scan (customers as c)  # Smaller table (100K rows)
```

**After (CommuteJoin rule applied):**

```
# Join order swapped to put smaller table on left
Join (c.id = o.customer_id)
├─ Scan (customers as c)  # Smaller table moved to left
└─ Scan (orders as o)  # Larger table moved to right
```

**What it does:** Applies the commutativity property of joins to optimize the physical execution. This rule:

1. Compares the cardinality (estimated row count) of the left and right inputs
2. For inner joins and certain outer joins, swaps the inputs if the left side has fewer rows than the right side
3. Adjusts join conditions and join types accordingly (e.g., LEFT becomes RIGHT)

Since Databend typically uses the right side as the build side in hash joins, this optimization ensures the smaller table is used for building the hash table, which improves join performance by reducing memory usage and hash table build time.

### Cost-Based Physical Plan Selection (Step 12)

**12. Cost-Based Implementation Selection (CascadesOptimizer)**

**SQL Example:**

```sql
SELECT customer_name, SUM(total_price) as total_spend
FROM customers JOIN orders ON customers.id = orders.customer_id
WHERE customers.region = 'Asia'
GROUP BY customer_name;
```

**What it does:** Selects the most efficient way to execute your query by comparing costs of different implementation options.

**How Cascades Works:**

```
┌───────────────────────────────────────────────────────────┐
│                   CASCADES OPTIMIZER                      │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  1. COMPARE ALTERNATIVES FOR EACH OPERATION               │
│                                                           │
│     Operation A                Operation B                │
│     Cost: 1000      vs.       Cost: 100  ✓                │
│                                                           │
│  2. SELECT LOWEST-COST OPTION                             │
│                                                           │
│  3. BUILD FINAL PLAN FROM SELECTED OPTIONS                │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**For our example query:**

```
┌─────────────────────────────────────────────────────────┐
│ OPERATION             │ ALTERNATIVES        │ COST      │
├───────────────────────┼─────────────────────┼───────────┤
│ SCAN customers        │ FullTableScan       │ 1000      │
│ WHERE region='Asia'   │ FilterScan  ✓       │  100      │
├───────────────────────┼─────────────────────┼───────────┤
│ JOIN                  │ NestedLoopJoin      │ 2000      │
│                       │ HashJoin  ✓         │  500      │
├───────────────────────┼─────────────────────┼───────────┤
│ AGGREGATE             │ SortAggregate       │  800      │
│ GROUP BY customer_name│ HashAggregate  ✓    │  300      │
└───────────────────────┴─────────────────────┴───────────┘
```

**How Costs Are Calculated:**

```
┌───────────────────────────────────────────────────────────┐
│ OPERATION         │ ACTUAL CODE IMPLEMENTATION            │
├───────────────────┼───────────────────────────────────────┤
│ Scan              │ group.stat_info.cardinality *         │
│                   │ compute_per_row                       │
├───────────────────┼───────────────────────────────────────┤
│ Join              │ build_card * hash_table_per_row +     │
│                   │ probe_card * compute_per_row          │
├───────────────────┼───────────────────────────────────────┤
│ Aggregate         │ card * aggregate_per_row              │
├───────────────────┼───────────────────────────────────────┤
│ Exchange (Hash)   │ cardinality * network_per_row +       │
│                   │ cardinality * compute_per_row         │
└───────────────────┴───────────────────────────────────────┘
```

**Cost factors are defined with these default values:**

```
┌───────────────────────────────────────────────────────────┐
│ COST FACTOR         │ DEFAULT VALUE                       │
├─────────────────────┼─────────────────────────────────────┤
│ compute_per_row     │ 1                                   │
├─────────────────────┼─────────────────────────────────────┤
│ hash_table_per_row  │ 10                                  │
├─────────────────────┼─────────────────────────────────────┤
│ aggregate_per_row   │ 5                                   │
├─────────────────────┼─────────────────────────────────────┤
│ network_per_row     │ 50                                  │
└─────────────────────┴─────────────────────────────────────┘
```

**Note:** These values show the relative costs of different operations. For example, network operations (50) are much more expensive than simple computation (1), and hash tables (10) are more expensive than aggregation (5).

These cost factors are combined with cardinality (row count) estimates to calculate the total cost of each operation. The optimizer then selects the implementation with the lowest total cost.

Costs are calculated recursively - a plan's total cost includes all its operations plus their children.

## Summary

Databend's query optimizer employs a sophisticated, multi-stage pipeline to transform user SQL queries into highly efficient physical execution plans. It leverages core concepts like SExpr for plan representation, a rich set of transformation rules, detailed statistics, and a cost model to explore and evaluate various plan alternatives.

The process involves:

1.  **Preparation:** Decorrelating subqueries and gathering necessary statistics.
2.  **Logical Optimization:** Applying rule-based transformations (like filter pushdown, aggregate normalization) to refine the logical plan structure.
3.  **Join Optimization:** Strategically determining the best join order and methods using techniques like dynamic programming.
4.  **Physical Planning:** Selecting the most cost-effective physical operators (e.g., Hash Join vs. Nested Loop Join) using the Cascades framework.

By systematically applying these steps, the optimizer aims to minimize resource usage (CPU, memory, I/O) and maximize query execution speed.
