---
sidebar_label: Databend Releases
title: Databend Releases
sidebar_position: 1
slug: /
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

This page provides information about recent features, enhancements, and bug fixes for <a href="https://github.com/databendlabs/databend">Databend</a>.

<StepsWrap> 

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.925-patch-12" number="-1" defaultCollapsed={false}>

## Sep 1, 2026 (v1.2.925-patch-12)

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.925-patch-12

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.936-nightly" number="" defaultCollapsed={false}>

## Aug 31, 2026 (v1.2.936-nightly)

## What's Changed
### Exciting New Features ✨
* feat(sql): use typed bounds for histogram statistics by **@forsaken628** in [#20317](https://github.com/databendlabs/databend/pull/20317)
* feat: support data sharing by **@SkyFan2002** in [#20053](https://github.com/databendlabs/databend/pull/20053)
* feat(query): support cascading hierarchical grouping sets by **@forsaken628** in [#20249](https://github.com/databendlabs/databend/pull/20249)
* feat(query): choose materialized views by rewrite cost by **@sundy-li** in [#20337](https://github.com/databendlabs/databend/pull/20337)
### Thoughtful Bug Fix 🔧
* fix(query): fix distributed grouping sets with materialized CTEs by **@forsaken628** in [#20328](https://github.com/databendlabs/databend/pull/20328)
* fix(query): track common hashtable allocator memory by **@dqhl76** in [#20321](https://github.com/databendlabs/databend/pull/20321)
* fix(storage): stream small parquet file batches by **@youngsofun** in [#20356](https://github.com/databendlabs/databend/pull/20356)
* fix(query): make number string casts deterministic by **@forsaken628** in [#20352](https://github.com/databendlabs/databend/pull/20352)
* fix: avoid mechanically removing Exchange operators by **@SkyFan2002** in [#20371](https://github.com/databendlabs/databend/pull/20371)
* fix(query): skip hash join probe when build is empty by **@dqhl76** in [#20355](https://github.com/databendlabs/databend/pull/20355)
* fix(query): accelerate multi-key hash shuffle by **@dantengsky** in [#20331](https://github.com/databendlabs/databend/pull/20331)
* fix(query): use structural keys for evaluator CSE by **@KKould** in [#20374](https://github.com/databendlabs/databend/pull/20374)
* fix(query): preserve cast comparison operand order by **@youngsofun** in [#20375](https://github.com/databendlabs/databend/pull/20375)
* fix(query): match empty LIKE patterns exactly by **@KKould** in [#20363](https://github.com/databendlabs/databend/pull/20363)
* fix(query): re-sort re-aggregated MV blocks before recluster serialization by **@zhang2014** in [#20378](https://github.com/databendlabs/databend/pull/20378)
* fix(query): avoid decimal join keys for integer-to-string casts by **@dantengsky** in [#20333](https://github.com/databendlabs/databend/pull/20333)
* fix(query): record early client close as LogType::Closed by **@youngsofun** in [#20376](https://github.com/databendlabs/databend/pull/20376)
* fix(query): count result_rows when produced, not when consumed by **@youngsofun** in [#20377](https://github.com/databendlabs/databend/pull/20377)
* fix(query): canonicalize keys before deriving join stats by **@youngsofun** in [#20393](https://github.com/databendlabs/databend/pull/20393)
* fix(meta): avoid embedded service port races by **@forsaken628** in [#20391](https://github.com/databendlabs/databend/pull/20391)
* fix: reduce vacuum2 memory during gc by **@dantengsky** in [#20394](https://github.com/databendlabs/databend/pull/20394)
* fix(storage): bound parquet row group bytes by **@dqhl76** in [#20387](https://github.com/databendlabs/databend/pull/20387)
* fix(runner): cloud build workflow remove spot instance by **@hantmac** in [#20401](https://github.com/databendlabs/databend/pull/20401)
* fix(query): flatten lambdas in correlated subqueries by **@youngsofun** in [#20389](https://github.com/databendlabs/databend/pull/20389)
* fix(query): preserve null validity in correlated joins by **@sundy-li** in [#20354](https://github.com/databendlabs/databend/pull/20354)
* fix(query): expose unpivot columns in query block by **@KKould** in [#20396](https://github.com/databendlabs/databend/pull/20396)
* fix(query): avoid parsing WASM UDF code as UTF-8 by **@youngsofun** in [#20404](https://github.com/databendlabs/databend/pull/20404)
### Code Refactor 🎉
* refactor(query): skip unnecessary CTE column scan by **@KKould** in [#20344](https://github.com/databendlabs/databend/pull/20344)
* refactor(query): avoid repeated subquery traversal by **@KKould** in [#20334](https://github.com/databendlabs/databend/pull/20334)
* refactor(storage): avoid materializing recluster endpoints by **@KKould** in [#20372](https://github.com/databendlabs/databend/pull/20372)
* refactor(query): avoid redundant optimizer expression clones by **@KKould** in [#20346](https://github.com/databendlabs/databend/pull/20346)
* refactor(query): consume expressions in constant folder by **@KKould** in [#20373](https://github.com/databendlabs/databend/pull/20373)
* refactor(query): avoid eager collection in hot paths by **@KKould** in [#20384](https://github.com/databendlabs/databend/pull/20384)
### Others 📒
* chore(ci): Change the metachaos notification from a failure-style alert to a warning-style alert  by **@TCeason** in [#20388](https://github.com/databendlabs/databend/pull/20388)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.936-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.925-patch-11" number="" defaultCollapsed={true}>

## Aug 26, 2026 (v1.2.925-patch-11)

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.925-patch-11

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.925-patch-10" number="" defaultCollapsed={true}>

## Aug 25, 2026 (v1.2.925-patch-10)

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.925-patch-10

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.935-nightly" number="" defaultCollapsed={true}>

## Aug 24, 2026 (v1.2.935-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): add enable_materialized_view_rewrite setting by **@sundy-li** in [#20336](https://github.com/databendlabs/databend/pull/20336)
* feat(query): reaggregate aggregate MV blocks on compact by **@sundy-li** in [#20340](https://github.com/databendlabs/databend/pull/20340)
### Thoughtful Bug Fix 🔧
* fix(storage): disable automatic HTTP decompression by **@youngsofun** in [#20339](https://github.com/databendlabs/databend/pull/20339)
* fix(query): spill window partitions during output by **@dqhl76** in [#20343](https://github.com/databendlabs/databend/pull/20343)
* fix(query): quote nested SQL in procedure expressions with SQL rules by **@forsaken628** in [#20338](https://github.com/databendlabs/databend/pull/20338)
* fix(query): ignore system sources in lineage by **@youngsofun** in [#20349](https://github.com/databendlabs/databend/pull/20349)
* fix(query): refresh ATTACH table schema in system.columns/statistics by **@TCeason** in [#19966](https://github.com/databendlabs/databend/pull/19966)
* fix(storage): restore node-global memory budget for recluster by **@zhyass** in [#20360](https://github.com/databendlabs/databend/pull/20360)
### Code Refactor 🎉
* refactor(query): carry scalar function return types by **@KKould** in [#20320](https://github.com/databendlabs/databend/pull/20320)
* refactor(query): optimize column collection and replacement by **@KKould** in [#20345](https://github.com/databendlabs/databend/pull/20345)
* refactor: stage decompressor split output. by **@youngsofun** in [#20341](https://github.com/databendlabs/databend/pull/20341)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.935-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.925-patch-9" number="" defaultCollapsed={true}>

## Aug 21, 2026 (v1.2.925-patch-9)

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.925-patch-9

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.934-nightly" number="" defaultCollapsed={true}>

## Aug 20, 2026 (v1.2.934-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): materialized view support rewrite rule by **@b41sh** in [#20302](https://github.com/databendlabs/databend/pull/20302)
* feat(query): refresh lineage for existing views by **@youngsofun** in [#20315](https://github.com/databendlabs/databend/pull/20315)
* feat(query): materialized view support set|unset table option and comment by **@TCeason** in [#20306](https://github.com/databendlabs/databend/pull/20306)
* feat(query): add partial evaluation policy by **@sundy-li** in [#20318](https://github.com/databendlabs/databend/pull/20318)
* feat(query): configure lineage independently by **@youngsofun** in [#20322](https://github.com/databendlabs/databend/pull/20322)
* feat(query): extract explicit materialized CTE lineage by **@youngsofun** in [#20327](https://github.com/databendlabs/databend/pull/20327)
### Thoughtful Bug Fix 🔧
* fix(query): skip inactive rows in vectorized LIKE by **@dantengsky** in [#20211](https://github.com/databendlabs/databend/pull/20211)
* fix(query): propagate suppressed row errors to is_not_error through nested calls by **@junli1026** in [#20305](https://github.com/databendlabs/databend/pull/20305)
* fix(query): avoid oversized row output buffer allocations by **@dqhl76** in [#20325](https://github.com/databendlabs/databend/pull/20325)
* fix(query): accelerate runtime bloom filter checks by **@dantengsky** in [#20323](https://github.com/databendlabs/databend/pull/20323)
* fix(stage): improve Parquet unload compatibility with older readers by **@youngsofun** in [#20326](https://github.com/databendlabs/databend/pull/20326)
### Code Refactor 🎉
* refactor(sql): move join statistics tests to SQL goldens by **@forsaken628** in [#20293](https://github.com/databendlabs/databend/pull/20293)
* refactor(query): move lambda detection out of parser by **@KKould** in [#20295](https://github.com/databendlabs/databend/pull/20295)
* refactor(query): split datetime helpers by responsibility by **@forsaken628** in [#20190](https://github.com/databendlabs/databend/pull/20190)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.934-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.925-patch-8" number="" defaultCollapsed={true}>

## Aug 18, 2026 (v1.2.925-patch-8)

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.925-patch-8

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.933-nightly" number="" defaultCollapsed={true}>

## Aug 17, 2026 (v1.2.933-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): extract query lineage from plans by **@youngsofun** in [#20201](https://github.com/databendlabs/databend/pull/20201)
* feat(query): add history-based data lineage by **@youngsofun** in [#20235](https://github.com/databendlabs/databend/pull/20235)
* feat(query): add aggregate state merge combinators by **@sundy-li** in [#20257](https://github.com/databendlabs/databend/pull/20257)
* feat(query): add json_path_transform lambda function by **@zhang2014** in [#20281](https://github.com/databendlabs/databend/pull/20281)
* feat(query): extend eliminate_self_join to support table-scan with pushed predicates by **@junli1026** in [#20284](https://github.com/databendlabs/databend/pull/20284)
* feat(query): Materialized View support hybrid reads by **@b41sh** in [#20276](https://github.com/databendlabs/databend/pull/20276)
* feat(query): add materialized view DDL and maintenance lifecycle by **@TCeason** in [#20266](https://github.com/databendlabs/databend/pull/20266)
* feat(fuse): add Hilbert clustering metadata and statistics by **@zhyass** in [#20291](https://github.com/databendlabs/databend/pull/20291)
* feat(query): add direct lineage neighbor lookup by **@youngsofun** in [#20300](https://github.com/databendlabs/databend/pull/20300)
* feat(query): support catalog and view table fields by **@youngsofun** in [#20304](https://github.com/databendlabs/databend/pull/20304)
* feat(query): retain lineage history by default by **@youngsofun** in [#20311](https://github.com/databendlabs/databend/pull/20311)
* feat: benchmark: consolidate the meta benchmarks into one harness by **@drmingdrmer** in [#20314](https://github.com/databendlabs/databend/pull/20314)
* feat(query): extend runtime filters to single-column probe expressions by **@SkyFan2002** in [#20301](https://github.com/databendlabs/databend/pull/20301)
### Thoughtful Bug Fix 🔧
* fix(storage): map missing NO_CHECK snapshot 404 to TableHistoricalDataNotFound by **@dantengsky** in [#20265](https://github.com/databendlabs/databend/pull/20265)
* fix(query): skip task cleanup on unassigned nodes by **@KKould** in [#20263](https://github.com/databendlabs/databend/pull/20263)
* fix(sql): preserve async function determinism by **@KKould** in [#19718](https://github.com/databendlabs/databend/pull/19718)
* fix(query): preserve parquet small-file compression ratio by **@dqhl76** in [#20283](https://github.com/databendlabs/databend/pull/20283)
* fix(storage): coalesce partitioned hash writes by **@KKould** in [#20275](https://github.com/databendlabs/databend/pull/20275)
* fix(query): atomically enable stream change tracking by **@zhyass** in [#20272](https://github.com/databendlabs/databend/pull/20272)
* fix(query): avoid repeated recluster vacuum by **@zhyass** in [#20285](https://github.com/databendlabs/databend/pull/20285)
* fix(query): avoid cache population in mutation row fetch by **@sundy-li** in [#20288](https://github.com/databendlabs/databend/pull/20288)
* fix(query): route mutations with internal columns through table scans by **@zhyass** in [#20269](https://github.com/databendlabs/databend/pull/20269)
* fix(query): normalize procedure signatures in RBAC lookups by **@TCeason** in [#20297](https://github.com/databendlabs/databend/pull/20297)
* fix(query): use current time for selectivity estimation by **@dantengsky** in [#20298](https://github.com/databendlabs/databend/pull/20298)
* fix(iceberg): refresh expiring table credentials by **@sundy-li** in [#20303](https://github.com/databendlabs/databend/pull/20303)
* fix(query): bound final aggregate finish memory by **@dqhl76** in [#20316](https://github.com/databendlabs/databend/pull/20316)
* fix(fuse): recheck runtime TopN during block reads by **@zhang2014** in [#20309](https://github.com/databendlabs/databend/pull/20309)
### Code Refactor 🎉
* refactor(query): reduce expression analysis allocation by **@KKould** in [#20256](https://github.com/databendlabs/databend/pull/20256)
* refactor(query): reshape lineage history metadata by **@youngsofun** in [#20289](https://github.com/databendlabs/databend/pull/20289)
* refactor(query): clarify get lineage object output by **@youngsofun** in [#20296](https://github.com/databendlabs/databend/pull/20296)
### Documentation 📔
* docs: guide agents to defer collection by **@KKould** in [#20287](https://github.com/databendlabs/databend/pull/20287)
### Others 📒
* chore(query): Add `fuse_virtual_column_build` table function by **@b41sh** in [#20299](https://github.com/databendlabs/databend/pull/20299)
* chore: Enable Materialized View Features for Enterprise Edition by **@b41sh** in [#20307](https://github.com/databendlabs/databend/pull/20307)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.933-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.925-patch-7" number="" defaultCollapsed={true}>

## Aug 10, 2026 (v1.2.925-patch-7)

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.925-patch-7

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.932-nightly" number="" defaultCollapsed={true}>

## Aug 10, 2026 (v1.2.932-nightly)

## What's Changed
### Exciting New Features ✨
* feat(expression): range-sensitive monotonicity for index pruning by **@zhang2014** in [#20241](https://github.com/databendlabs/databend/pull/20241)
* feat(query): fused TopN operator with runtime scan filters by **@zhang2014** in [#20247](https://github.com/databendlabs/databend/pull/20247)
* feat(query): propagate column statistics through UNION ALL by **@forsaken628** in [#20224](https://github.com/databendlabs/databend/pull/20224)
* feat(query): Materialized View support refresh with CHANGE_TRACKING by **@b41sh** in [#20213](https://github.com/databendlabs/databend/pull/20213)
* feat(fuse): add hash-distributed partition writes by **@KKould** in [#20216](https://github.com/databendlabs/databend/pull/20216)
* feat(query): add 'change$row_id' as an internal column by **@zhyass** in [#20251](https://github.com/databendlabs/databend/pull/20251)
* feat: avoid deserialization in bitmap_contains/min/max/has_any/has_all by **@harry-hao** in [#20210](https://github.com/databendlabs/databend/pull/20210)
* feat(query): derive sort and window statistics by **@sundy-li** in [#20248](https://github.com/databendlabs/databend/pull/20248)
* feat(fuse): support ALTER TABLE PARTITION BY by **@KKould** in [#20239](https://github.com/databendlabs/databend/pull/20239)
* feat: meta: upgrade databend-meta to v260629.2.0, add raft protocol secret, compatible mode by **@drmingdrmer** in [#20280](https://github.com/databendlabs/databend/pull/20280)
### Thoughtful Bug Fix 🔧
* fix(fuse): isolate partition and cluster layouts by **@KKould** in [#20221](https://github.com/databendlabs/databend/pull/20221)
* fix(meta): disallow replacing tables with different engines by **@zhyass** in [#20234](https://github.com/databendlabs/databend/pull/20234)
* fix(query): improve selectivity estimation for boolean expressions by **@forsaken628** in [#20237](https://github.com/databendlabs/databend/pull/20237)
* fix(query): keep active temporary tables during vacuum by **@SkyFan2002** in [#20254](https://github.com/databendlabs/databend/pull/20254)
* fix(query): prefer input columns in GROUPING arguments by **@zhang2014** in [#20262](https://github.com/databendlabs/databend/pull/20262)
* fix(query): prevent temporary CTAS staging leaks by **@zhyass** in [#20261](https://github.com/databendlabs/databend/pull/20261)
* fix(query): inherit function properties through aliases by **@TCeason** in [#20255](https://github.com/databendlabs/databend/pull/20255)
* fix(sql): make GROUP BY name resolution column-first by **@forsaken628** in [#20274](https://github.com/databendlabs/databend/pull/20274)
* fix(functions): support nullable calendar monotonicity by **@zhang2014** in [#20271](https://github.com/databendlabs/databend/pull/20271)
### Code Refactor 🎉
* refactor(query): infer equality for singleton domains by **@KKould** in [#20250](https://github.com/databendlabs/databend/pull/20250)
* refactor(query): defer expression collection and cloning by **@KKould** in [#20253](https://github.com/databendlabs/databend/pull/20253)
* refactor: modularize and harden recluster orchestration by **@zhyass** in [#20258](https://github.com/databendlabs/databend/pull/20258)
### Build/Testing/CI Infra Changes 🔌
* ci(compat): rework compat_fuse runner with shared-data case groups by **@zhang2014** in [#20242](https://github.com/databendlabs/databend/pull/20242)

## New Contributors
* **@harry-hao** made their first contribution in [#20210](https://github.com/databendlabs/databend/pull/20210)

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.932-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.879-patch.2" number="" defaultCollapsed={true}>

## Aug 7, 2026 (v1.2.879-patch.2)

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.879-patch.2

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.925-patch-6" number="" defaultCollapsed={true}>

## Aug 6, 2026 (v1.2.925-patch-6)

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.925-patch-6

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.931-nightly" number="" defaultCollapsed={true}>

## Aug 3, 2026 (v1.2.931-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): rewrite outer join exclusion filters as anti joins by **@forsaken628** in [#20189](https://github.com/databendlabs/databend/pull/20189)
* feat(meta): add materialized view metadata support by **@TCeason** in [#20184](https://github.com/databendlabs/databend/pull/20184)
* feat(fuse): support partitioned table layout by **@KKould** in [#20143](https://github.com/databendlabs/databend/pull/20143)
### Thoughtful Bug Fix 🔧
* fix(query): make synchronous spill processors interruptible by **@dqhl76** in [#20161](https://github.com/databendlabs/databend/pull/20161)
* fix(binder): correct join statistics propagation by **@forsaken628** in [#20122](https://github.com/databendlabs/databend/pull/20122)
* fix(query): support table index privilege checks by **@TCeason** in [#20124](https://github.com/databendlabs/databend/pull/20124)
* fix(query): avoid rescanning Volnitsky fallback prefix by **@dantengsky** in [#20209](https://github.com/databendlabs/databend/pull/20209)
* fix(ci): harden AI declaration parsing by **@bohutang** in [#20226](https://github.com/databendlabs/databend/pull/20226)
* fix(query): pass complete Volnitsky n-grams by **@dantengsky** in [#20208](https://github.com/databendlabs/databend/pull/20208)
* fix(test): fix parser and stateful test failures by **@dqhl76** in [#20231](https://github.com/databendlabs/databend/pull/20231)
* fix(query): make hash join streams interruptible by **@dqhl76** in [#20236](https://github.com/databendlabs/databend/pull/20236)
* fix(query): stop flight exchange task after shutdown by **@dqhl76** in [#20229](https://github.com/databendlabs/databend/pull/20229)
* fix(storage): decouple batch-delete size from max_threads by **@dantengsky** in [#20219](https://github.com/databendlabs/databend/pull/20219)
### Code Refactor 🎉
* refactor(query): simplify SQL parser error tracking by **@KKould** in [#20194](https://github.com/databendlabs/databend/pull/20194)
* refactor(query): optimize escaped literal LIKE matching by **@dantengsky** in [#20207](https://github.com/databendlabs/databend/pull/20207)
### Documentation 📔
* docs: add AI contribution policy and PR guardrail by **@bohutang** in [#20225](https://github.com/databendlabs/databend/pull/20225)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.931-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.930-nightly" number="" defaultCollapsed={true}>

## Jul 27, 2026 (v1.2.930-nightly)

## What's Changed
### Exciting New Features ✨
* feat(stream): improve stream backlog estimates with snapshot logical change counters by **@zhyass** in [#20160](https://github.com/databendlabs/databend/pull/20160)
* feat(query): make product name configurable by **@sundy-li** in [#20129](https://github.com/databendlabs/databend/pull/20129)
* feat(query): refresh TopN statistics on append by **@KKould** in [#20091](https://github.com/databendlabs/databend/pull/20091)
* feat(query): paimon catalog support read and distributed write by **@Pandas886** in [#20132](https://github.com/databendlabs/databend/pull/20132)
* feat(query): reject alter view definition changes by **@youngsofun** in [#20202](https://github.com/databendlabs/databend/pull/20202)
* feat(storage): adapt string stats length for common prefixes by **@dantengsky** in [#20199](https://github.com/databendlabs/databend/pull/20199)
### Thoughtful Bug Fix 🔧
* fix(query): preserve segment order during compaction by **@SkyFan2002** in [#20128](https://github.com/databendlabs/databend/pull/20128)
* fix(query): include node id in flight errors by **@dqhl76** in [#20177](https://github.com/databendlabs/databend/pull/20177)
* fix(query): avoid buffer retention in K-way merge sort with LIMIT by **@dantengsky** in [#20178](https://github.com/databendlabs/databend/pull/20178)
* fix(stream): speed up append-only batch snapshot lookup by **@dantengsky** in [#20173](https://github.com/databendlabs/databend/pull/20173)
* fix(query): handle date boundaries by **@forsaken628** in [#20183](https://github.com/databendlabs/databend/pull/20183)
* fix(storage): restore cluster stats pages for rollback compatibility by **@zhyass** in [#20192](https://github.com/databendlabs/databend/pull/20192)
* fix(query): avoid spill at Top-N limit boundary by **@dantengsky** in [#20186](https://github.com/databendlabs/databend/pull/20186)
* fix: preserve imperfect block statistics for replace and merge by **@zhyass** in [#20187](https://github.com/databendlabs/databend/pull/20187)
* fix(storage): read legacy bincode v4 segments by **@dantengsky** in [#20191](https://github.com/databendlabs/databend/pull/20191)
### Code Refactor 🎉
* refactor(query): read geometry SRID from EWKB header via geozero by **@ariesdevil** in [#20174](https://github.com/databendlabs/databend/pull/20174)
* refactor: remove the legacy Hilbert clustering implementation by **@zhyass** in [#20175](https://github.com/databendlabs/databend/pull/20175)
* refactor(storage): remove obsolete cluster page pruning by **@zhyass** in [#20179](https://github.com/databendlabs/databend/pull/20179)
### Build/Testing/CI Infra Changes 🔌
* ci: allow checkout fork PR merge refs by **@smallfish** in [#20203](https://github.com/databendlabs/databend/pull/20203)
### Others 📒
* chore: avoid redundant opendal runtime layer spawns by **@dqhl76** in [#20159](https://github.com/databendlabs/databend/pull/20159)
* chore(test): add copy check udf privilege test by **@TCeason** in [#20180](https://github.com/databendlabs/databend/pull/20180)
* chore: replace deprecated crates VS Code extension by **@Standing-Man** in [#20195](https://github.com/databendlabs/databend/pull/20195)

## New Contributors
* **@Standing-Man** made their first contribution in [#20195](https://github.com/databendlabs/databend/pull/20195)
* **@Pandas886** made their first contribution in [#20132](https://github.com/databendlabs/databend/pull/20132)

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.930-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.929-nightly" number="" defaultCollapsed={true}>

## Jul 20, 2026 (v1.2.929-nightly)

## What's Changed
### Exciting New Features ✨
* feat(stage): support ORC unload by **@youngsofun** in [#20123](https://github.com/databendlabs/databend/pull/20123)
* feat: metactl: run ordered Lua sources by **@drmingdrmer** in [#20149](https://github.com/databendlabs/databend/pull/20149)
### Thoughtful Bug Fix 🔧
* fix(query): correct date/timestamp arithmetic domain calculation on overflow by **@TCeason** in [#20135](https://github.com/databendlabs/databend/pull/20135)
* fix(query): preserve scalar bloom hashes in replace into by **@dantengsky** in [#20141](https://github.com/databendlabs/databend/pull/20141)
* fix(query): reject nullable domains in monotonic folding by **@forsaken628** in [#20130](https://github.com/databendlabs/databend/pull/20130)
* fix(query): drop heap-backed min-max aggregate states by **@dqhl76** in [#20146](https://github.com/databendlabs/databend/pull/20146)
* fix(query): restore row-fetch parallelism by **@dantengsky** in [#20147](https://github.com/databendlabs/databend/pull/20147)
* fix(query): improve private task run tracking by **@KKould** in [#20150](https://github.com/databendlabs/databend/pull/20150)
* fix(query): handle single-row inequality joins safely by **@dantengsky** in [#20155](https://github.com/databendlabs/databend/pull/20155)
* fix(iceberg): preserve supported predicate conjuncts by **@finchxxia** in [#20164](https://github.com/databendlabs/databend/pull/20164)
* fix(binder): prevent SELECT alias with grouping() from shadowing columns in GROUPING SETS by **@zhang2014** in [#20170](https://github.com/databendlabs/databend/pull/20170)
* fix(storage): avoid applying Parquet fast-read setting to Fuse MergeIO by **@dantengsky** in [#20171](https://github.com/databendlabs/databend/pull/20171)
### Build/Testing/CI Infra Changes 🔌
* ci: accept TestNG skipped exit code by **@youngsofun** in [#20148](https://github.com/databendlabs/databend/pull/20148)
### Others 📒
* chore: bump databend-meta and databend-meta-client to latest by **@drmingdrmer** in [#20142](https://github.com/databendlabs/databend/pull/20142)
* chore: disable snapshot compression with databend-meta v260628.2.0 by **@drmingdrmer** in [#20154](https://github.com/databendlabs/databend/pull/20154)

## New Contributors
* **@finchxxia** made their first contribution in [#20164](https://github.com/databendlabs/databend/pull/20164)

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.929-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.928-nightly" number="" defaultCollapsed={true}>

## Jul 13, 2026 (v1.2.928-nightly)

## What's Changed
### Exciting New Features ✨
* feat(copy): improve ColumnMissingError with contextual advice by **@youngsofun** in [#20029](https://github.com/databendlabs/databend/pull/20029)
* feat(query): support ilike operators by **@sundy-li** in [#20106](https://github.com/databendlabs/databend/pull/20106)
* feat(query): add stream backlog API and table function by **@zhyass** in [#20104](https://github.com/databendlabs/databend/pull/20104)
* feat(query): support PostgreSQL aggregate syntax by **@KKould** in [#20108](https://github.com/databendlabs/databend/pull/20108)
* feat: meta: add Lua transaction support by **@drmingdrmer** in [#20131](https://github.com/databendlabs/databend/pull/20131)
* feat(meta): add metactl.now_ms() monotonic clock for Lua scripts by **@drmingdrmer** in [#20136](https://github.com/databendlabs/databend/pull/20136)
* feat(metabench): add bulk-load and random-read benchmarks by **@drmingdrmer** in [#20137](https://github.com/databendlabs/databend/pull/20137)
### Thoughtful Bug Fix 🔧
* fix(query): recheck function after cast elimination by **@KKould** in [#20102](https://github.com/databendlabs/databend/pull/20102)
* fix(query): avoid persisting normalized recluster stats by **@zhyass** in [#20107](https://github.com/databendlabs/databend/pull/20107)
* fix(query): trigger all ready task successors by **@KKould** in [#20120](https://github.com/databendlabs/databend/pull/20120)
* fix(sql): fix udaf alias handling and show function params in plans by **@forsaken628** in [#20061](https://github.com/databendlabs/databend/pull/20061)
* fix(query): set variable to NULL when subquery returns empty result by **@dantengsky** in [#20118](https://github.com/databendlabs/databend/pull/20118)
* fix(query): cancel open private task runs on drop by **@KKould** in [#20109](https://github.com/databendlabs/databend/pull/20109)
* fix(query): record missing spill write metrics by **@dqhl76** in [#20086](https://github.com/databendlabs/databend/pull/20086)
### Code Refactor 🎉
* refactor(query): make segment compaction commit through CommitSink by **@SkyFan2002** in [#20114](https://github.com/databendlabs/databend/pull/20114)
* refactor(query): reduce parser success path overhead by **@sundy-li** in [#20119](https://github.com/databendlabs/databend/pull/20119)
* refactor(functions): split aggregate tests by function by **@forsaken628** in [#20125](https://github.com/databendlabs/databend/pull/20125)
* refactor: meta: cover metactl.to_string rendering rules, add zipf by **@drmingdrmer** in [#20133](https://github.com/databendlabs/databend/pull/20133)
### Build/Testing/CI Infra Changes 🔌
* ci(iceberg): cover variant metadata reads by **@sundy-li** in [#20110](https://github.com/databendlabs/databend/pull/20110)
### Others 📒
* chore(query): add spatial join test to correctness regressions by **@TCeason** in [#20101](https://github.com/databendlabs/databend/pull/20101)
* chore: Enable Virtual column features for Community Edition by **@b41sh** in [#20116](https://github.com/databendlabs/databend/pull/20116)
* chore(query): Refactor SQLSmith tests into a separate library by **@b41sh** in [#20121](https://github.com/databendlabs/databend/pull/20121)
* chore(query): log top-N plan node memory usage on memory limit exceeded by **@dqhl76** in [#20077](https://github.com/databendlabs/databend/pull/20077)
* chore: bump databend-meta and databend-meta-client to latest by **@drmingdrmer** in [#20127](https://github.com/databendlabs/databend/pull/20127)
* chore(planner): add debug trace for optimizer statistics collection by **@forsaken628** in [#20010](https://github.com/databendlabs/databend/pull/20010)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.928-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.927-nightly" number="" defaultCollapsed={true}>

## Jul 6, 2026 (v1.2.927-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): Vector type support recluster using the `K-Means` algorithm by **@b41sh** in [#20004](https://github.com/databendlabs/databend/pull/20004)
* feat(query): support broadcast spatial join in distributed clusters by **@TCeason** in [#20088](https://github.com/databendlabs/databend/pull/20088)
* feat(query): add resource usage to query_history table by **@dqhl76** in [#20094](https://github.com/databendlabs/databend/pull/20094)
* feat(query): add count-min sketch frequency stats by **@KKould** in [#20049](https://github.com/databendlabs/databend/pull/20049)
* feat(query): skip recluster partial sort for ordered tasks by **@zhyass** in [#20096](https://github.com/databendlabs/databend/pull/20096)
* feat(stage): support avro unload by **@youngsofun** in [#20080](https://github.com/databendlabs/databend/pull/20080)
### Thoughtful Bug Fix 🔧
* fix(query): avoid nested loop fallback for equi hash join by **@dantengsky** in [#20076](https://github.com/databendlabs/databend/pull/20076)
* fix(query): Stack overflow (SIGSEGV) on deeply nested expression trees by **@TCeason** in [#20092](https://github.com/databendlabs/databend/pull/20092)
* fix(query):  Fix `unnest` to handle nullable array and variant types correctly by **@TCeason** in [#20095](https://github.com/databendlabs/databend/pull/20095)
* fix: deterministic HLL row accounting in commit metadata by **@zhyass** in [#20065](https://github.com/databendlabs/databend/pull/20065)
* fix(base): avoid self-deadlock during runtime drop by **@dqhl76** in [#20103](https://github.com/databendlabs/databend/pull/20103)
* fix(query): resolve physical column name for runtime filter probe target by **@dantengsky** in [#20105](https://github.com/databendlabs/databend/pull/20105)
### Code Refactor 🎉
* refactor: meta: split dictionary updates by id by **@drmingdrmer** in [#20083](https://github.com/databendlabs/databend/pull/20083)
### Others 📒
* chore(query): Remove spatial runtime filters from join planning by **@b41sh** in [#20081](https://github.com/databendlabs/databend/pull/20081)
* chore: upgrade databend-meta to v260628.0.0 by **@drmingdrmer** in [#20085](https://github.com/databendlabs/databend/pull/20085)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.927-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.926-nightly" number="" defaultCollapsed={true}>

## Jun 29, 2026 (v1.2.926-nightly)

## What's Changed
### Thoughtful Bug Fix 🔧
* fix(query): normalize nullable runtime inlist filters by **@SkyFan2002** in [#20066](https://github.com/databendlabs/databend/pull/20066)
* fix(query): avoid empty role cache during reload race by **@youngsofun** in [#20071](https://github.com/databendlabs/databend/pull/20071)
* fix(query): handle nan in float arithmetic domains by **@KKould** in [#20067](https://github.com/databendlabs/databend/pull/20067)
* fix(query): scope HTTP session state by tenant by **@3em0** in [#19931](https://github.com/databendlabs/databend/pull/19931)
### Code Refactor 🎉
* refactor: meta: decouple index create option by **@drmingdrmer** in [#20069](https://github.com/databendlabs/databend/pull/20069)
* refactor: meta: decouple database create option by **@drmingdrmer** in [#20070](https://github.com/databendlabs/databend/pull/20070)
* refactor(query): introduces new parquet writer by **@zhang2014** in [#20011](https://github.com/databendlabs/databend/pull/20011)

## New Contributors
* **@3em0** made their first contribution in [#19931](https://github.com/databendlabs/databend/pull/19931)

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.926-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.925-nightly" number="" defaultCollapsed={true}>

## Jun 26, 2026 (v1.2.925-nightly)

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.925-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.924-nightly" number="" defaultCollapsed={true}>

## Jun 26, 2026 (v1.2.924-nightly)

## What's Changed
### Others 📒
* chore: add aggressive_recluster gate for recluster by **@zhyass** in [#20052](https://github.com/databendlabs/databend/pull/20052)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.924-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.923-nightly" number="" defaultCollapsed={true}>

## Jun 26, 2026 (v1.2.923-nightly)

## What's Changed
### Exciting New Features ✨
* feat: meta: add protobuf storage variants by **@drmingdrmer** in [#20038](https://github.com/databendlabs/databend/pull/20038)
* feat(query): use top-n stats for equality selectivity by **@KKould** in [#20019](https://github.com/databendlabs/databend/pull/20019)
* feat(query): add single-node spatial index join with R-tree by **@TCeason** in [#20025](https://github.com/databendlabs/databend/pull/20025)
* feat(query): show pruning IO costs in explain by **@SkyFan2002** in [#20058](https://github.com/databendlabs/databend/pull/20058)
### Thoughtful Bug Fix 🔧
* fix(storage): move copy_status tracking from partition planning to actual read in parquet copy by **@youngsofun** in [#20045](https://github.com/databendlabs/databend/pull/20045)
* fix(storage): stabilize recluster candidate scheduling by **@zhyass** in [#19995](https://github.com/databendlabs/databend/pull/19995)
* fix(query): cleanup canceled Lance stage output by **@YZL0v3ZZ** in [#20050](https://github.com/databendlabs/databend/pull/20050)
* fix(query): rewrite residual aggregates in having by **@sundy-li** in [#20056](https://github.com/databendlabs/databend/pull/20056)
* fix(query): hash nullable runtime bloom filters consistently by **@SkyFan2002** in [#20055](https://github.com/databendlabs/databend/pull/20055)
* fix(query): avoid range join for single-row side by **@sundy-li** in [#20062](https://github.com/databendlabs/databend/pull/20062)
### Code Refactor 🎉
* refactor: meta: make proto encoding infallible by **@drmingdrmer** in [#20051](https://github.com/databendlabs/databend/pull/20051)
* refactor: meta: add reusable transactional key removal by **@drmingdrmer** in [#20054](https://github.com/databendlabs/databend/pull/20054)
* refactor: meta: move RefApi tag tests to api crate by **@drmingdrmer** in [#20063](https://github.com/databendlabs/databend/pull/20063)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.923-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.922-nightly" number="" defaultCollapsed={true}>

## Jun 24, 2026 (v1.2.922-nightly)

## What's Changed
### Exciting New Features ✨
* feat(stage): support metadata$file_path, file_basename, file_content_key, file_last_modified by **@youngsofun** in [#20036](https://github.com/databendlabs/databend/pull/20036)
* feat(storage): add allowlist endpoint_url_policy mode by **@youngsofun** in [#20047](https://github.com/databendlabs/databend/pull/20047)
### Thoughtful Bug Fix 🔧
* fix(query): update nested materialized CTE ref counts by **@SkyFan2002** in [#20026](https://github.com/databendlabs/databend/pull/20026)
* fix(storage): refine proxy statistics routing by **@KKould** in [#20024](https://github.com/databendlabs/databend/pull/20024)
* fix(query): mark async sink finish after completion by **@YZL0v3ZZ** in [#20021](https://github.com/databendlabs/databend/pull/20021)
* fix: avoid repeated stale spill meta cleanup in RECLUSTER FINAL by **@zhyass** in [#20037](https://github.com/databendlabs/databend/pull/20037)
* fix: avoid abort on allocation failure in concat and spill paths by **@zhyass** in [#20039](https://github.com/databendlabs/databend/pull/20039)
* fix(query): mark async accumulating finish after completion by **@YZL0v3ZZ** in [#20043](https://github.com/databendlabs/databend/pull/20043)
* fix(query): skip unsupported runtime filter probe targets by **@SkyFan2002** in [#20040](https://github.com/databendlabs/databend/pull/20040)
* fix(storage): move stage_path_traversal_policy from settings to config by **@youngsofun** in [#20046](https://github.com/databendlabs/databend/pull/20046)
### Code Refactor 🎉
* refactor: udf: store UDF metadata as table types by **@drmingdrmer** in [#20034](https://github.com/databendlabs/databend/pull/20034)
* refactor(query): remove legacy aggregate pipeline by **@dqhl76** in [#20022](https://github.com/databendlabs/databend/pull/20022)
* refactor: meta: remove file format encode sentinels by **@drmingdrmer** in [#20035](https://github.com/databendlabs/databend/pull/20035)
* refactor: remove unused StorageParams::None variant by **@youngsofun** in [#20041](https://github.com/databendlabs/databend/pull/20041)
### Build/Testing/CI Infra Changes 🔌
* ci: fix cloud load benchmark runner by **@forsaken628** in [#20028](https://github.com/databendlabs/databend/pull/20028)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.922-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.921-nightly" number="" defaultCollapsed={true}>

## Jun 22, 2026 (v1.2.921-nightly)

## What's Changed
### Accepted RFCs 🛫
* rfc: KLL based analyze histogram generation by **@KKould** in [#20009](https://github.com/databendlabs/databend/pull/20009)
### Exciting New Features ✨
* feat: distribute multi-table insert writes by **@SkyFan2002** in [#20005](https://github.com/databendlabs/databend/pull/20005)
* feat(query): add clustering depth percentiles and optimize overlap an… by **@zhyass** in [#20023](https://github.com/databendlabs/databend/pull/20023)
* feat(query): support KLL analyze histograms by **@KKould** in [#20014](https://github.com/databendlabs/databend/pull/20014)
### Thoughtful Bug Fix 🔧
* fix: avoid invalid semi join rewrite for partial group keys by **@KKould** in [#20006](https://github.com/databendlabs/databend/pull/20006)
* fix(query): preserve spilled result page across restore cancellation by **@YZL0v3ZZ** in [#20016](https://github.com/databendlabs/databend/pull/20016)
* fix(storage): adjust proxy route cost by **@KKould** in [#20017](https://github.com/databendlabs/databend/pull/20017)
* fix(query): make metadata$filename stage-relative for csv/text/ndjson/avro by **@youngsofun** in [#20012](https://github.com/databendlabs/databend/pull/20012)
* fix(functions): respect tdigest weighted state weight by **@forsaken628** in [#19952](https://github.com/databendlabs/databend/pull/19952)
### Code Refactor 🎉
* refactor(functions): Optimize `jq` function performance by **@b41sh** in [#19946](https://github.com/databendlabs/databend/pull/19946)
* refactor: optimize mysql connection handling by **@dantengsky** in [#19294](https://github.com/databendlabs/databend/pull/19294)
* refactor: add MetaServiceKeyErrorBuilder for meta keys by **@drmingdrmer** in [#20030](https://github.com/databendlabs/databend/pull/20030)
* refactor: meta: split key error builders by **@drmingdrmer** in [#20032](https://github.com/databendlabs/databend/pull/20032)
* refactor: meta: reorganize txn fetched records by **@drmingdrmer** in [#20033](https://github.com/databendlabs/databend/pull/20033)
### Build/Testing/CI Infra Changes 🔌
* ci: improve the benchmarking report to include more details by **@forsaken628** in [#19994](https://github.com/databendlabs/databend/pull/19994)
* ci: simplify shell_env.sh with BENDSQL_ERROR_NO_VERSION by **@youngsofun** in [#20018](https://github.com/databendlabs/databend/pull/20018)
### Others 📒
* chore(query): Copy into arrow support Array type cast to Vector type by **@b41sh** in [#20013](https://github.com/databendlabs/databend/pull/20013)

## New Contributors
* **@YZL0v3ZZ** made their first contribution in [#20016](https://github.com/databendlabs/databend/pull/20016)

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.921-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.920-nightly" number="" defaultCollapsed={true}>

## Jun 15, 2026 (v1.2.920-nightly)

## What's Changed
### Exciting New Features ✨
* feat(storage): add endpoint egress policy by **@youngsofun** in [#19980](https://github.com/databendlabs/databend/pull/19980)
### Thoughtful Bug Fix 🔧
* fix(query): guard tenant override in sessions by **@youngsofun** in [#19975](https://github.com/databendlabs/databend/pull/19975)
* fix(query): handle malformed UDF script metadata by **@KKould** in [#19983](https://github.com/databendlabs/databend/pull/19983)
* fix(query): preserve null-safe join keys in null filter rule by **@KKould** in [#20000](https://github.com/databendlabs/databend/pull/20000)
* fix(query): preserve single join null filtering by **@KKould** in [#19999](https://github.com/databendlabs/databend/pull/19999)
* fix(query): preserve TopN sort semantics by **@KKould** in [#19998](https://github.com/databendlabs/databend/pull/19998)
* fix(query): preserve union coercion in filter pushdown by **@KKould** in [#19997](https://github.com/databendlabs/databend/pull/19997)
* fix(query): recluster infinite loop caused by inconsistent block size estimation by **@zhyass** in [#20002](https://github.com/databendlabs/databend/pull/20002)
* fix: propagate config file error with context instead of unwrap by **@VishwaN22** in [#19972](https://github.com/databendlabs/databend/pull/19972)
### Code Refactor 🎉
* refactor(query): remove legacy aggregate hash index by **@dqhl76** in [#20003](https://github.com/databendlabs/databend/pull/20003)
* refactor(query): unify window/cte spill to async_buffer path  by **@dqhl76** in [#20001](https://github.com/databendlabs/databend/pull/20001)

## New Contributors
* **@VishwaN22** made their first contribution in [#19972](https://github.com/databendlabs/databend/pull/19972)

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.920-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.919-nightly" number="" defaultCollapsed={true}>

## Jun 11, 2026 (v1.2.919-nightly)

## What's Changed
### Exciting New Features ✨
* feat(time-travel): add NO_CHECK for timestamp navigation via UUID v7 by **@dantengsky** in [#19764](https://github.com/databendlabs/databend/pull/19764)
* feat(query): support arrow stage file formats by **@youngsofun** in [#19953](https://github.com/databendlabs/databend/pull/19953)
* feat(query): support async table hooks by **@KKould** in [#19962](https://github.com/databendlabs/databend/pull/19962)
* feat(query): replace Geometry deserialization with streaming bbox extraction by **@TCeason** in [#19944](https://github.com/databendlabs/databend/pull/19944)
### Thoughtful Bug Fix 🔧
* fix(query): quote binder rewrite identifiers by **@sundy-li** in [#19969](https://github.com/databendlabs/databend/pull/19969)
* fix(query): harden connection info masking in logs and error messages by **@bohutang** in [#19889](https://github.com/databendlabs/databend/pull/19889)
* fix(query): add stage path traversal policy by **@youngsofun** in [#19973](https://github.com/databendlabs/databend/pull/19973)
* fix(query): reject duplicate named windows by **@KKould** in [#19978](https://github.com/databendlabs/databend/pull/19978)
* fix(query): avoid eliminating aggregate union branch by **@KKould** in [#19987](https://github.com/databendlabs/databend/pull/19987)
* fix(storage): S3 region detection timeout should not fail the query by **@dantengsky** in [#19985](https://github.com/databendlabs/databend/pull/19985)
* fix(query): preserve offset above outer join limit pushdown by **@KKould** in [#19988](https://github.com/databendlabs/databend/pull/19988)
* fix(query): preserve task options on alter set by **@KKould** in [#19976](https://github.com/databendlabs/databend/pull/19976)
### Code Refactor 🎉
* refactor(meta): remove kvapi::Value impls for blanket marker trait by **@drmingdrmer** in [#19974](https://github.com/databendlabs/databend/pull/19974)
* refactor(query): split aggregate row pointer capabilities by **@forsaken628** in [#19986](https://github.com/databendlabs/databend/pull/19986)
* refactor(storage): remove native storage format by **@zhang2014** in [#19982](https://github.com/databendlabs/databend/pull/19982)
* refactor: improve RECLUSTER FINAL convergence and memory safety by **@zhyass** in [#19989](https://github.com/databendlabs/databend/pull/19989)
### Others 📒
* chore: skip copy dedup for log history by **@dqhl76** in [#19979](https://github.com/databendlabs/databend/pull/19979)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.919-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.918-nightly" number="" defaultCollapsed={true}>

## Jun 8, 2026 (v1.2.918-nightly)

## What's Changed
### Exciting New Features ✨
* feat(time-travel): add NO_CHECK for snapshot direct lookup by **@dantengsky** in [#19763](https://github.com/databendlabs/databend/pull/19763)
### Thoughtful Bug Fix 🔧
* fix(query): unblock failed private task runs by **@KKould** in [#19965](https://github.com/databendlabs/databend/pull/19965)
### Code Refactor 🎉
* refactor(query): make aggregate payload lifecycle explicit by **@forsaken628** in [#19967](https://github.com/databendlabs/databend/pull/19967)
### Build/Testing/CI Infra Changes 🔌
* ci: remove bendsave from release and upgrade github actions by **@everpcpc** in [#19964](https://github.com/databendlabs/databend/pull/19964)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.918-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.917-nightly" number="" defaultCollapsed={true}>

## Jun 4, 2026 (v1.2.917-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): virtual column support materialized cte by **@b41sh** in [#19902](https://github.com/databendlabs/databend/pull/19902)
* feat(query): add local admin handlers for tenant-prefixed routes by **@everpcpc** in [#19956](https://github.com/databendlabs/databend/pull/19956)
### Thoughtful Bug Fix 🔧
* fix(query): align private task history with cloud by **@KKould** in [#19943](https://github.com/databendlabs/databend/pull/19943)
* fix(query): stabilize pivot any rewrite by **@KKould** in [#19949](https://github.com/databendlabs/databend/pull/19949)
* fix(binder): allow unresolved complex GROUP BY alias fallback by **@forsaken628** in [#19958](https://github.com/databendlabs/databend/pull/19958)
* fix(query): avoid nested window plans by **@sundy-li** in [#19933](https://github.com/databendlabs/databend/pull/19933)
* fix(query): escape rewritten SQL string literals by **@KKould** in [#19957](https://github.com/databendlabs/databend/pull/19957)
* fix(storage): make vacuum2 block deletion incremental by **@SkyFan2002** in [#19960](https://github.com/databendlabs/databend/pull/19960)
### Code Refactor 🎉
* refactor(storage):  limit concurrent io operations by **@dqhl76** in [#19948](https://github.com/databendlabs/databend/pull/19948)
### Build/Testing/CI Infra Changes 🔌
* ci(release): add custom release type and restrict sha to custom only by **@everpcpc** in [#19950](https://github.com/databendlabs/databend/pull/19950)
* ci: guard nightly docker tag updates by **@youngsofun** in [#19959](https://github.com/databendlabs/databend/pull/19959)
### Others 📒
* chore(deps): bump openssl from 0.10.72 to 0.10.80 by **@dependabot**[bot] in [#19893](https://github.com/databendlabs/databend/pull/19893)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.917-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.768-patch.1" number="" defaultCollapsed={true}>

## Jun 3, 2026 (v1.2.768-patch.1)

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.768-patch.1

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.916-nightly" number="" defaultCollapsed={true}>

## Jun 2, 2026 (v1.2.916-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): refine ndjson infer schema by **@youngsofun** in [#19928](https://github.com/databendlabs/databend/pull/19928)
* feat(query): add proxy table engine MVP by **@KKould** in [#19924](https://github.com/databendlabs/databend/pull/19924)
### Thoughtful Bug Fix 🔧
* fix(query): bound ANALYZE statistics commit retry by **@zhyass** in [#19942](https://github.com/databendlabs/databend/pull/19942)
* fix(query): use to_hex instead of hex in stream change tracking row ID generation by **@zhyass** in [#19945](https://github.com/databendlabs/databend/pull/19945)
### Code Refactor 🎉
* refactor(query): split stage and file format resolution from TableContext by **@forsaken628** in [#19938](https://github.com/databendlabs/databend/pull/19938)
* refactor(query): centralize interpreter execution hooks by **@dqhl76** in [#19865](https://github.com/databendlabs/databend/pull/19865)
### Documentation 📔
* docs(query): add proxy engine design by **@sundy-li** in [#19920](https://github.com/databendlabs/databend/pull/19920)
### Others 📒
* chore: add meta-to-meta (raft) compatibility docs by **@drmingdrmer** in [#19947](https://github.com/databendlabs/databend/pull/19947)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.916-nightly

</StepContent>

</StepsWrap> 
