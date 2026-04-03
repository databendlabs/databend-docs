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

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.888-patch-3" number="-1" defaultCollapsed={false}>

## Mar 31, 2026 (v1.2.888-patch-3)

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.888-patch-3

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.891-nightly" number="" defaultCollapsed={false}>

## Mar 30, 2026 (v1.2.891-nightly)

## What's Changed
### Exciting New Features ✨
* feat(stage): add TEXT file format params by **@youngsofun** in [#19588](https://github.com/databendlabs/databend/pull/19588)
* feat(http): add server-side parameter binding to /v1/query by **@cliftonc** in [#19601](https://github.com/databendlabs/databend/pull/19601)
* feat: enable TCP_NODELAY on gRPC listener sockets by **@drmingdrmer** in [#19619](https://github.com/databendlabs/databend/pull/19619)
* feat(query): support experimental table tags for FUSE table snapshots by **@zhyass** in [#19549](https://github.com/databendlabs/databend/pull/19549)
### Thoughtful Bug Fix 🔧
* fix(storage): split oversized compact blocks during recluster by **@zhyass** in [#19577](https://github.com/databendlabs/databend/pull/19577)
* fix(query): preserve parentheses in UNION queries by **@sundy-li** in [#19587](https://github.com/databendlabs/databend/pull/19587)
* fix(query): avoid create or alter recursive views by **@TCeason** in [#19584](https://github.com/databendlabs/databend/pull/19584)
* fix(query): escape LIKE ESCAPE literals in display by **@sundy-li** in [#19596](https://github.com/databendlabs/databend/pull/19596)
* fix: clarify AGENTS.md guidance for conflicts and patterns by **@forsaken628** in [#19617](https://github.com/databendlabs/databend/pull/19617)
* fix(query): enforce row access policy for Direct UPDATE and split predicate fields by **@TCeason** in [#19625](https://github.com/databendlabs/databend/pull/19625)
* fix: rename PanicError and fix executor OOM mapping by **@sundy-li** in [#19614](https://github.com/databendlabs/databend/pull/19614)
* fix: restore enable_merge_into_row_fetch by **@dqhl76** in [#19624](https://github.com/databendlabs/databend/pull/19624)
### Code Refactor 🎉
* refactor(storage): extract fuse block format abstraction by **@SkyFan2002** in [#19576](https://github.com/databendlabs/databend/pull/19576)
* refactor(sql): separate aggregate registration and reuse in binder by **@forsaken628** in [#19579](https://github.com/databendlabs/databend/pull/19579)

## New Contributors
* **@cliftonc** made their first contribution in [#19601](https://github.com/databendlabs/databend/pull/19601)

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.891-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.890-nightly" number="" defaultCollapsed={true}>

## Mar 23, 2026 (v1.2.890-nightly)

## What's Changed
### Exciting New Features ✨
* feat: optimize small bloom index reads by **@SkyFan2002** in [#19552](https://github.com/databendlabs/databend/pull/19552)
* feat(query): Runtime Filter support spatial index join by **@b41sh** in [#19530](https://github.com/databendlabs/databend/pull/19530)
* feat: better case handling for query stage. by **@youngsofun** in [#19566](https://github.com/databendlabs/databend/pull/19566)
* feat: rename TSV to TEXT. by **@youngsofun** in [#19580](https://github.com/databendlabs/databend/pull/19580)
* feat(test): display query_id on sqllogictest failure by **@dqhl76** in [#19528](https://github.com/databendlabs/databend/pull/19528)
* feat(query): reclaim memory on hash join finish by **@zhang2014** in [#19556](https://github.com/databendlabs/databend/pull/19556)
### Thoughtful Bug Fix 🔧
* fix(sql): implement recursive cte hooks in lite planner ctx by **@KKould** in [#19558](https://github.com/databendlabs/databend/pull/19558)
* fix(query): pass explicit data schema to spill reader instead of inferring from parquet metadata by **@zhang2014** in [#19564](https://github.com/databendlabs/databend/pull/19564)
* fix: bendpy register csv column positions followup by **@KKould** in [#19557](https://github.com/databendlabs/databend/pull/19557)
* fix: unload allow `include_query_id=true use_raw_path=true` for compat. by **@youngsofun** in [#19583](https://github.com/databendlabs/databend/pull/19583)
### Code Refactor 🎉
* refactor(expression): simplify filter and lambda evaluation by **@sundy-li** in [#19538](https://github.com/databendlabs/databend/pull/19538)
* refactor(sql): share optimizer replay support and add lite harness by **@forsaken628** in [#19542](https://github.com/databendlabs/databend/pull/19542)
* refactor: make Recursive CTE execution more streaming-oriented by **@KKould** in [#19545](https://github.com/databendlabs/databend/pull/19545)
* refactor(sql): improve eager aggregation rewrites by **@forsaken628** in [#19559](https://github.com/databendlabs/databend/pull/19559)
### Others 📒
* chore: upgrade databend-meta to v260304.0.0 and consolidate dependencies by **@drmingdrmer** in [#19513](https://github.com/databendlabs/databend/pull/19513)
* chore(query): add missing runtime filter logs by **@dqhl76** in [#19565](https://github.com/databendlabs/databend/pull/19565)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.890-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.889-nightly" number="" defaultCollapsed={true}>

## Mar 16, 2026 (v1.2.889-nightly)

## What's Changed
### Thoughtful Bug Fix 🔧
* fix(query): avoid reinitializing nullable aggregate states during merge by **@dqhl76** in [#19544](https://github.com/databendlabs/databend/pull/19544)
* fix(query): builtin function names should be case-insensitive regardless of unquoted_ident_case_sensitive by **@TCeason** in [#19537](https://github.com/databendlabs/databend/pull/19537)
* fix(http): skip S3 refresh for attached tables in HTTP catalog endpoints by **@TCeason** in [#19548](https://github.com/databendlabs/databend/pull/19548)
* fix(planner): decorrelate correlated scalar subquery limit (#13716) by **@sundy-li** in [#19532](https://github.com/databendlabs/databend/pull/19532)
* fix(sql): add missing SExpr import in type_check.rs by **@zhang2014** in [#19550](https://github.com/databendlabs/databend/pull/19550)
* fix: flatten IN-list OR predicates by **@SkyFan2002** in [#19546](https://github.com/databendlabs/databend/pull/19546)
* fix(query): scope runtime filter selectivity to bloom by **@SkyFan2002** in [#19547](https://github.com/databendlabs/databend/pull/19547)
### Code Refactor 🎉
* refactor: remove legacy table branch/tag implementation by **@zhyass** in [#19534](https://github.com/databendlabs/databend/pull/19534)
* refactor(planner): improve consistency of column references and rewrites by **@forsaken628** in [#19523](https://github.com/databendlabs/databend/pull/19523)
* refactor(query): refactor hash shuffle by **@zhang2014** in [#19505](https://github.com/databendlabs/databend/pull/19505)
### Others 📒
* chore(query): bump ast to 0.2.5 for Unicode identifier support by **@TCeason** in [#19541](https://github.com/databendlabs/databend/pull/19541)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.889-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.888-nightly" number="" defaultCollapsed={true}>

## Mar 12, 2026 (v1.2.888-nightly)

## What's Changed
### Exciting New Features ✨
* feat(perf): add per-plan hardware performance counters to EXPLAIN PERF by **@dqhl76** in [#19493](https://github.com/databendlabs/databend/pull/19493)
* feat: support copy into lance dataset. by **@youngsofun** in [#19495](https://github.com/databendlabs/databend/pull/19495)
* feat(query): Add spatial statistics to BlockMeta for geospatial range pruning by **@b41sh** in [#19515](https://github.com/databendlabs/databend/pull/19515)
### Thoughtful Bug Fix 🔧
* fix(query): improve EXPLAIN ANALYZE profiling for meta-only blocks by **@forsaken628** in [#19514](https://github.com/databendlabs/databend/pull/19514)
* fix: trim CR for TSV CRLF record delimiter by **@KKould** in [#19521](https://github.com/databendlabs/databend/pull/19521)
* fix(query): try_to_timestamp should return null when convert error by **@TCeason** in [#19527](https://github.com/databendlabs/databend/pull/19527)
* fix(query): avoid merge-into unmatched panic (#16885) by **@sundy-li** in [#19529](https://github.com/databendlabs/databend/pull/19529)
* fix(query): support unquoted Unicode aliases and identifiers by **@TCeason** in [#19526](https://github.com/databendlabs/databend/pull/19526)
* fix(join): project build columns for fast returning left join by **@zhang2014** in [#19539](https://github.com/databendlabs/databend/pull/19539)
### Code Refactor 🎉
* refactor(query): replace usize with Symbol as the global column ID for the SQL layer by **@forsaken628** in [#19517](https://github.com/databendlabs/databend/pull/19517)
### Build/Testing/CI Infra Changes 🔌
* ci: upgrade go-version. by **@youngsofun** in [#19540](https://github.com/databendlabs/databend/pull/19540)
### Others 📒
* chore(ut): fix test_sync_agg_index by **@TCeason** in [#19531](https://github.com/databendlabs/databend/pull/19531)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.888-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.887-nightly" number="" defaultCollapsed={true}>

## Mar 9, 2026 (v1.2.887-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): batch rank-limit sort with DataBlockVec and fix single-key LimitRank by **@forsaken628** in [#19510](https://github.com/databendlabs/databend/pull/19510)
### Thoughtful Bug Fix 🔧
* fix: isolate recursive CTE internal table names per source by **@KKould** in [#19504](https://github.com/databendlabs/databend/pull/19504)
* fix(query): prune runtime inlists with block bloom by **@SkyFan2002** in [#19516](https://github.com/databendlabs/databend/pull/19516)
### Others 📒
* chore: makefile add heaptracker by **@KKould** in [#19512](https://github.com/databendlabs/databend/pull/19512)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.887-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.886-nightly" number="" defaultCollapsed={true}>

## Mar 5, 2026 (v1.2.886-nightly)

## What's Changed
### Exciting New Features ✨
* feat: support TSV FIELD_DELIMITER = '' for line-as-string loading by **@KKould** in [#19492](https://github.com/databendlabs/databend/pull/19492)
### Thoughtful Bug Fix 🔧
* fix(query): short-circuit runtime filter merge on threshold by **@SkyFan2002** in [#19509](https://github.com/databendlabs/databend/pull/19509)
* fix: enable runtime filter for left semi join by **@SkyFan2002** in [#19511](https://github.com/databendlabs/databend/pull/19511)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.886-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.885-nightly" number="" defaultCollapsed={true}>

## Mar 4, 2026 (v1.2.885-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): Support `st_hilbert` function by **@b41sh** in [#19500](https://github.com/databendlabs/databend/pull/19500)
* feat(query): Implement Spatial Index with R-Tree by **@b41sh** in [#19411](https://github.com/databendlabs/databend/pull/19411)
* feat: infer_schema() support TSV by **@KKould** in [#19452](https://github.com/databendlabs/databend/pull/19452)
* feat(query): reuse source sort key and compact spilled sort streams by **@forsaken628** in [#19490](https://github.com/databendlabs/databend/pull/19490)
* feat(query): support Roman numeral format in to_char (RN/rn) by **@forsaken628** in [#19501](https://github.com/databendlabs/databend/pull/19501)
### Code Refactor 🎉
* refactor(query): refactor flight shuffle by **@zhang2014** in [#19458](https://github.com/databendlabs/databend/pull/19458)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.885-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.884-nightly" number="" defaultCollapsed={true}>

## Mar 2, 2026 (v1.2.884-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): support USER/ROLE/STREAM object tagging and references by **@TCeason** in [#19484](https://github.com/databendlabs/databend/pull/19484)
* feat(query): restore prefetch for spilled sort blocks by **@forsaken628** in [#19409](https://github.com/databendlabs/databend/pull/19409)
* feat(meta): add config setting to gate meta value compression by **@drmingdrmer** in [#19496](https://github.com/databendlabs/databend/pull/19496)
### Thoughtful Bug Fix 🔧
* fix(query): replace regex-based block comment lexer with memchr scanner by **@TCeason** in [#19487](https://github.com/databendlabs/databend/pull/19487)
* fix(query): tolerate unknown TaggableObject variants in tag reference listing by **@TCeason** in [#19497](https://github.com/databendlabs/databend/pull/19497)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.884-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.883-nightly" number="" defaultCollapsed={true}>

## Feb 27, 2026 (v1.2.883-nightly)

## What's Changed
### Exciting New Features ✨
* feat(meta): transparent zstd compression and typed serialization for meta KV values by **@drmingdrmer** in [#19465](https://github.com/databendlabs/databend/pull/19465)
* feat(query): extend tag support to view, udf, and procedure objects by **@TCeason** in [#19447](https://github.com/databendlabs/databend/pull/19447)
* feat: add default_warehouse option to user settings by **@everpcpc** in [#19456](https://github.com/databendlabs/databend/pull/19456)
* feat: add sandbox env injection case via cloud control by **@KKould** in [#19383](https://github.com/databendlabs/databend/pull/19383)
* feat(query): Support vacuum virtual column by **@b41sh** in [#19459](https://github.com/databendlabs/databend/pull/19459)
### Thoughtful Bug Fix 🔧
* fix(proto-conv): replace silent u64-&gt;usize casts with checked conversion by **@drmingdrmer** in [#19471](https://github.com/databendlabs/databend/pull/19471)
* fix: condition should be || not && by **@cuiweixie** in [#19461](https://github.com/databendlabs/databend/pull/19461)
* fix: surface errors silently swallowed in log-storage config and grant entries by **@drmingdrmer** in [#19474](https://github.com/databendlabs/databend/pull/19474)
* fix: r_cte wrong/flaky results under concurrency by **@KKould** in [#19439](https://github.com/databendlabs/databend/pull/19439)
* fix: some queries print query log and profile twice by **@dqhl76** in [#19455](https://github.com/databendlabs/databend/pull/19455)
### Code Refactor 🎉
* refactor: merge external-meta-version into MetaClient/MetaService columns by **@drmingdrmer** in [#19460](https://github.com/databendlabs/databend/pull/19460)
* refactor: clean up meta crates — simplify Cargo.toml, remove unused deps, and deduplicate code by **@drmingdrmer** in [#19462](https://github.com/databendlabs/databend/pull/19462)
* refactor: move meta plugin crates and eliminate unnecessary clones in UserGrantSet by **@drmingdrmer** in [#19466](https://github.com/databendlabs/databend/pull/19466)
* refactor(meta): minor structural cleanups in process, control, admin, semaphore by **@drmingdrmer** in [#19470](https://github.com/databendlabs/databend/pull/19470)
* refactor(app): deduplicate IdGenerator constructors via new() helper by **@drmingdrmer** in [#19475](https://github.com/databendlabs/databend/pull/19475)
* refactor(proto-conv): extract convert_field helper to deduplicate TryFrom boilerplate by **@drmingdrmer** in [#19476](https://github.com/databendlabs/databend/pull/19476)
* refactor(proto-conv): standardize BTreeMap conversions to iterator pattern by **@drmingdrmer** in [#19472](https://github.com/databendlabs/databend/pull/19472)
* refactor(control): extract lua_call helper to deduplicate Lua API wrappers by **@drmingdrmer** in [#19473](https://github.com/databendlabs/databend/pull/19473)
* refactor(api): split create_table into focused sub-functions by **@drmingdrmer** in [#19477](https://github.com/databendlabs/databend/pull/19477)
* refactor: optimize final aggregation for large datasets by **@dqhl76** in [#19360](https://github.com/databendlabs/databend/pull/19360)
* refactor(query): optimize system.tables for account_admin with precise filters by **@TCeason** in [#19480](https://github.com/databendlabs/databend/pull/19480)
* refactor: replace handle_write with direct MetaNode::write call by **@drmingdrmer** in [#19483](https://github.com/databendlabs/databend/pull/19483)
* refactor(query): normalize role mgr api boundaries by **@TCeason** in [#19437](https://github.com/databendlabs/databend/pull/19437)
### Build/Testing/CI Infra Changes 🔌
* ci(benchmark): enable internal benchmark and reduce load size by **@TCeason** in [#19482](https://github.com/databendlabs/databend/pull/19482)
### Documentation 📔
* docs(meta): fix broken README links for relocated directories by **@drmingdrmer** in [#19469](https://github.com/databendlabs/databend/pull/19469)
### Others 📒
* chore: revert Cargo.toml to pre-refactor state for selective review by **@drmingdrmer** in [#19463](https://github.com/databendlabs/databend/pull/19463)
* chore: add databend-meta-kv-tests integration test crate for compression by **@drmingdrmer** in [#19467](https://github.com/databendlabs/databend/pull/19467)

## New Contributors
* **@cuiweixie** made their first contribution in [#19461](https://github.com/databendlabs/databend/pull/19461)

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.883-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.882-nightly" number="" defaultCollapsed={true}>

## Feb 16, 2026 (v1.2.882-nightly)

## What's Changed
### Exciting New Features ✨
* feat: add async function read_file. by **@youngsofun** in [#19426](https://github.com/databendlabs/databend/pull/19426)
* feat(query): add privilege check for system.procedures table by **@TCeason** in [#19406](https://github.com/databendlabs/databend/pull/19406)
* feat: add --decode-values flag to metactl dump-raft-log-wal by **@drmingdrmer** in [#19448](https://github.com/databendlabs/databend/pull/19448)
* feat(copy): support partition by for copy into location by **@sundy-li** in [#19390](https://github.com/databendlabs/databend/pull/19390)
### Thoughtful Bug Fix 🔧
* fix: upgrade databend-meta crates to v260205.3.0 by **@drmingdrmer** in [#19438](https://github.com/databendlabs/databend/pull/19438)
* fix: Eliminate RwLock in SequenceCounter to avoid read-write deadlock issues by **@KKould** in [#19432](https://github.com/databendlabs/databend/pull/19432)
### Code Refactor 🎉
* refactor(config): dedup query config inner/outer by **@dantengsky** in [#19446](https://github.com/databendlabs/databend/pull/19446)
* refactor: meta/proto-conv: simplify conversions and reorganize into submodules by **@drmingdrmer** in [#19453](https://github.com/databendlabs/databend/pull/19453)
* refactor: reorganize meta/api into submodules by **@drmingdrmer** in [#19454](https://github.com/databendlabs/databend/pull/19454)
* refactor: extract fuse compat test matrix into test_cases.yaml by **@dantengsky** in [#19441](https://github.com/databendlabs/databend/pull/19441)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.882-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.881-nightly" number="" defaultCollapsed={true}>

## Feb 10, 2026 (v1.2.881-nightly)

## What's Changed
### Thoughtful Bug Fix 🔧
* fix(query): data lost in new hash join caused by spill by **@dqhl76** in [#19415](https://github.com/databendlabs/databend/pull/19415)
### Code Refactor 🎉
* refactor(management): simplify UserApi using upsert_pb/get_pb patterns by **@TCeason** in [#19413](https://github.com/databendlabs/databend/pull/19413)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.881-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.880-nightly" number="" defaultCollapsed={true}>

## Feb 9, 2026 (v1.2.880-nightly)

## What's Changed
### Exciting New Features ✨
* feat: add query-meta version compatibility documentation by **@drmingdrmer** in [#19421](https://github.com/databendlabs/databend/pull/19421)
* feat(query): expression evaluator initially support the computation of column statistics by **@forsaken628** in [#19368](https://github.com/databendlabs/databend/pull/19368)
### Thoughtful Bug Fix 🔧
* fix(mysql): avoid NOT_NULL for NULL columns by **@dantengsky** in [#19416](https://github.com/databendlabs/databend/pull/19416)
### Code Refactor 🎉
* refactor(query): Refactor virtual columns refresh into prepare/commit phases by **@b41sh** in [#19395](https://github.com/databendlabs/databend/pull/19395)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.880-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.879-nightly" number="" defaultCollapsed={true}>

## Feb 6, 2026 (v1.2.879-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): add procedure admin APIs by **@everpcpc** in [#19396](https://github.com/databendlabs/databend/pull/19396)
* feat: CSV/TSV encode tuple/map/array as JSON. by **@youngsofun** in [#19393](https://github.com/databendlabs/databend/pull/19393)
### Thoughtful Bug Fix 🔧
* fix(query): fix lost data in new join spill by **@zhang2014** in [#19405](https://github.com/databendlabs/databend/pull/19405)
* fix(query): try fix lost data when new join spilled by **@dqhl76** in [#19408](https://github.com/databendlabs/databend/pull/19408)
### Others 📒
* chore(ci): apply settings before role validation in session restore by **@TCeason** in [#19358](https://github.com/databendlabs/databend/pull/19358)
* chore(tests): batch slow sql suites by **@sundy-li** in [#19386](https://github.com/databendlabs/databend/pull/19386)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.879-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.878-nightly" number="" defaultCollapsed={true}>

## Feb 5, 2026 (v1.2.878-nightly)

## What's Changed
### Thoughtful Bug Fix 🔧
* fix(mysql): set UNSIGNED_FLAG for unsigned integer columns by **@TCeason** in [#19400](https://github.com/databendlabs/databend/pull/19400)
* fix: upgrade raft-log: use pread to prevent race condition in concurrent chunk reads by **@drmingdrmer** in [#19401](https://github.com/databendlabs/databend/pull/19401)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.878-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.877-nightly" number="" defaultCollapsed={true}>

## Feb 4, 2026 (v1.2.877-nightly)

## What's Changed
### Code Refactor 🎉
* refactor: unify gRPC message size into single config value by **@drmingdrmer** in [#19397](https://github.com/databendlabs/databend/pull/19397)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.877-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.876-nightly" number="" defaultCollapsed={true}>

## Feb 3, 2026 (v1.2.876-nightly)

## What's Changed
### Thoughtful Bug Fix 🔧
* fix: on_error_mode not work in transform. by **@youngsofun** in [#19387](https://github.com/databendlabs/databend/pull/19387)
* fix: empty database name by **@SkyFan2002** in [#19389](https://github.com/databendlabs/databend/pull/19389)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.876-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.875-nightly" number="" defaultCollapsed={true}>

## Feb 3, 2026 (v1.2.875-nightly)

## What's Changed
### Thoughtful Bug Fix 🔧
* fix: fix and polish format settings.  by **@youngsofun** in [#19373](https://github.com/databendlabs/databend/pull/19373)
### Code Refactor 🎉
* refactor(query): Refactor virtual columns storage & read planning by **@b41sh** in [#19284](https://github.com/databendlabs/databend/pull/19284)
* refactor(query): enable experimental new join by default by **@zhang2014** in [#19388](https://github.com/databendlabs/databend/pull/19388)
### Others 📒
* chore(ci):   Optimize the tests related to stateless permissions by **@TCeason** in [#19382](https://github.com/databendlabs/databend/pull/19382)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.875-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.874-nightly" number="" defaultCollapsed={true}>

## Feb 2, 2026 (v1.2.874-nightly)

## What's Changed
### Exciting New Features ✨
* feat: support independent schema for table branches by **@zhyass** in [#19269](https://github.com/databendlabs/databend/pull/19269)
* feat: preliminary support for common subexpression elimination by **@SkyFan2002** in [#19351](https://github.com/databendlabs/databend/pull/19351)
* feat: CSV support multi-bytes field delimiter. by **@youngsofun** in [#19355](https://github.com/databendlabs/databend/pull/19355)
* feat: support LATERAL for generate_series by **@KKould** in [#19349](https://github.com/databendlabs/databend/pull/19349)
* feat: Sandbox UDF by **@KKould** in [#19301](https://github.com/databendlabs/databend/pull/19301)
* feat(query): Support Geography functions by **@b41sh** in [#19320](https://github.com/databendlabs/databend/pull/19320)
* feat: support prune columns for materialized cte by **@SkyFan2002** in [#19362](https://github.com/databendlabs/databend/pull/19362)
### Thoughtful Bug Fix 🔧
* fix(query): respect null ordering in topn pruner by **@sundy-li** in [#19317](https://github.com/databendlabs/databend/pull/19317)
* fix: enhance feature verification logic by **@dqhl76** in [#19359](https://github.com/databendlabs/databend/pull/19359)
### Code Refactor 🎉
* refactor: extract HTTP admin API to standalone crate `databend-meta-admin` by **@drmingdrmer** in [#19335](https://github.com/databendlabs/databend/pull/19335)
* refactor: group gRPC and admin config fields into nested structs by **@drmingdrmer** in [#19336](https://github.com/databendlabs/databend/pull/19336)
* refactor: use TlsConfig in HttpServiceConfig by **@drmingdrmer** in [#19337](https://github.com/databendlabs/databend/pull/19337)
* refactor: embed KvApiArgs in Config by **@drmingdrmer** in [#19338](https://github.com/databendlabs/databend/pull/19338)
* refactor: move CLI config parsing to separate crate by **@drmingdrmer** in [#19339](https://github.com/databendlabs/databend/pull/19339)
* refactor: remove `databend-common-base` dependency from raft-store by **@drmingdrmer** in [#19341](https://github.com/databendlabs/databend/pull/19341)
* refactor: move CLI fields out of `MetaServiceConfig` into `MetaConfig` by **@drmingdrmer** in [#19342](https://github.com/databendlabs/databend/pull/19342)
* refactor: replace local count module with databend-base counter by **@drmingdrmer** in [#19343](https://github.com/databendlabs/databend/pull/19343)
* refactor: add `trace_request` to `SpawnApi` for server-side tracing by **@drmingdrmer** in [#19346](https://github.com/databendlabs/databend/pull/19346)
* refactor: simplify port allocation in meta-store to use OS-assigned ports by **@drmingdrmer** in [#19352](https://github.com/databendlabs/databend/pull/19352)
* refactor(meta): reorganize tests and use lightweight runtime for meta service by **@drmingdrmer** in [#19354](https://github.com/databendlabs/databend/pull/19354)
* refactor: move HTTP endpoint tests to admin crate by **@drmingdrmer** in [#19356](https://github.com/databendlabs/databend/pull/19356)
* refactor: move module tag registration from client to store crate by **@drmingdrmer** in [#19365](https://github.com/databendlabs/databend/pull/19365)
* refactor: add connect method to SpawnApi for channel creation by **@drmingdrmer** in [#19370](https://github.com/databendlabs/databend/pull/19370)
* refactor: decouple meta core crates from databend dependencies by **@drmingdrmer** in [#19372](https://github.com/databendlabs/databend/pull/19372)
* refactor: remove databend-common-meta-api dependency from meta-service by **@drmingdrmer** in [#19374](https://github.com/databendlabs/databend/pull/19374)
### Documentation 📔
* docs: update meta README to reflect current directory structure by **@drmingdrmer** in [#19348](https://github.com/databendlabs/databend/pull/19348)
* docs: rebrand Databend as AI agent-ready enterprise data warehouse by **@bohutang** in [#19379](https://github.com/databendlabs/databend/pull/19379)
### Others 📒
* chore: set correct engine name for StageTable and StageSinkTable by **@SkyFan2002** in [#19347](https://github.com/databendlabs/databend/pull/19347)
* chore(query): replacing closures in FunctionEval with traits by **@forsaken628** in [#19316](https://github.com/databendlabs/databend/pull/19316)
* chore(sqllogic): add tutorial test by **@TCeason** in [#19353](https://github.com/databendlabs/databend/pull/19353)
* chore: fix lint by **@drmingdrmer** in [#19361](https://github.com/databendlabs/databend/pull/19361)
* chore: fix lint by **@drmingdrmer** in [#19363](https://github.com/databendlabs/databend/pull/19363)
* chore: fix stateless test timeout by **@b41sh** in [#19367](https://github.com/databendlabs/databend/pull/19367)
* chore: fix lint by **@drmingdrmer** in [#19371](https://github.com/databendlabs/databend/pull/19371)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.874-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.873-nightly" number="" defaultCollapsed={true}>

## Jan 26, 2026 (v1.2.873-nightly)

## What's Changed
### Code Refactor 🎉
* refactor: decouple meta-service from databend-common-base runtime by **@drmingdrmer** in [#19319](https://github.com/databendlabs/databend/pull/19319)
* refactor: remove `MetaStorageError` and delete `stoerr` crate by **@drmingdrmer** in [#19322](https://github.com/databendlabs/databend/pull/19322)
* refactor: use `DatabendRuntime::spawn` in meta binaries by **@drmingdrmer** in [#19324](https://github.com/databendlabs/databend/pull/19324)
* refactor: make meta-client generic over RuntimeApi by **@drmingdrmer** in [#19327](https://github.com/databendlabs/databend/pull/19327)
* refactor: add `SpawnApi::prepare_request()` for gRPC metadata injection by **@drmingdrmer** in [#19329](https://github.com/databendlabs/databend/pull/19329)
* refactor: move 7 server-side meta crates to `src/meta/core/` by **@drmingdrmer** in [#19332](https://github.com/databendlabs/databend/pull/19332)
* refactor: remove environment variable configuration for metasrv by **@drmingdrmer** in [#19333](https://github.com/databendlabs/databend/pull/19333)
### Documentation 📔
* docs: clean up and improve README formatting by **@bohutang** in [#19331](https://github.com/databendlabs/databend/pull/19331)
### Others 📒
* chore: adjust lazy read setting by **@SkyFan2002** in [#19318](https://github.com/databendlabs/databend/pull/19318)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.873-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.872-nightly" number="" defaultCollapsed={true}>

## Jan 23, 2026 (v1.2.872-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): add nested loop join for new experimental hash join by **@forsaken628** in [#18961](https://github.com/databendlabs/databend/pull/18961)
* feat: support prewhere for fuse parquet by **@SkyFan2002** in [#19209](https://github.com/databendlabs/databend/pull/19209)
* feat(query): Support CREATE/DROP SPATIAL INDEX (Geometry/Geography types) by **@b41sh** in [#19314](https://github.com/databendlabs/databend/pull/19314)
### Thoughtful Bug Fix 🔧
* ci(test): enable profile configuration during test runs by **@dqhl76** in [#19245](https://github.com/databendlabs/databend/pull/19245)
* fix: preserve IO error kind in codec decoder for raft log recovery by **@drmingdrmer** in [#19315](https://github.com/databendlabs/databend/pull/19315)
* fix: drop/replace stage fail to delete files on OSS. by **@youngsofun** in [#19321](https://github.com/databendlabs/databend/pull/19321)
### Code Refactor 🎉
* refactor(query): refactor hybrid hash join for new join by **@zhang2014** in [#19307](https://github.com/databendlabs/databend/pull/19307)
* refactor(query): optimize system tables filter with lightweight permission check by **@TCeason** in [#19293](https://github.com/databendlabs/databend/pull/19293)
### Build/Testing/CI Infra Changes 🔌
* ci: reopen compat tests for py driver. by **@youngsofun** in [#19310](https://github.com/databendlabs/databend/pull/19310)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.872-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.871-nightly" number="" defaultCollapsed={true}>

## Jan 22, 2026 (v1.2.871-nightly)

## What's Changed
### Exciting New Features ✨
* feat: add table function for inspecting Parquet pages by **@SkyFan2002** in [#19278](https://github.com/databendlabs/databend/pull/19278)
* feat: introducing DataBlockVec to optimize multiple data block take by **@forsaken628** in [#19249](https://github.com/databendlabs/databend/pull/19249)
* feat: eliminate constant subquery by **@KKould** in [#19289](https://github.com/databendlabs/databend/pull/19289)
* feat: enhance binary input and output format by **@KKould** in [#19246](https://github.com/databendlabs/databend/pull/19246)
* feat: enable lazy materialization across joins with outer-join NULL handling by **@SkyFan2002** in [#19295](https://github.com/databendlabs/databend/pull/19295)
### Thoughtful Bug Fix 🔧
* fix: compile error by **@SkyFan2002** in [#19298](https://github.com/databendlabs/databend/pull/19298)
* fix: add TrackingPayloadExt trait for ergonomic future tracking by **@drmingdrmer** in [#19296](https://github.com/databendlabs/databend/pull/19296)
* fix: drain gRPC stream in `get_kv()` to prevent h2 reset errors by **@drmingdrmer** in [#19302](https://github.com/databendlabs/databend/pull/19302)
* fix(cloud): clamp task run pagination by **@sundy-li** in [#19297](https://github.com/databendlabs/databend/pull/19297)
* fix: in_memory_table_data_cache should use memory size of array instead of  buffer size. by **@youngsofun** in [#19305](https://github.com/databendlabs/databend/pull/19305)
* fix: cluster key consistency during ALTER TABLE column by **@zhyass** in [#19300](https://github.com/databendlabs/databend/pull/19300)
* chore(query): reapply iceberg bump by **@sundy-li** in [#19304](https://github.com/databendlabs/databend/pull/19304)
### Code Refactor 🎉
* refactor: use hickory-resolver directly in raft-store for DNS resolution by **@drmingdrmer** in [#19288](https://github.com/databendlabs/databend/pull/19288)
* refactor: replace custom JoinHandle wrapper with From&lt;JoinError&gt; impl by **@drmingdrmer** in [#19291](https://github.com/databendlabs/databend/pull/19291)
* refactor(query): support pushdown rules with SecureFilter for row access policy by **@TCeason** in [#19274](https://github.com/databendlabs/databend/pull/19274)
* refactor: use io::Error instead of MetaStorageError in sled-store by **@drmingdrmer** in [#19292](https://github.com/databendlabs/databend/pull/19292)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.871-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.870-nightly" number="" defaultCollapsed={true}>

## Jan 19, 2026 (v1.2.870-nightly)

## What's Changed
### Exciting New Features ✨
* feat: table branch support insert by **@zhyass** in [#19225](https://github.com/databendlabs/databend/pull/19225)
* feat: adjust columns of `system.stages` and `show stages` by **@youngsofun** in [#19257](https://github.com/databendlabs/databend/pull/19257)
### Thoughtful Bug Fix 🔧
* fix: out of bound on recursive cte & coercion_types left right not match on recursive scan by **@KKould** in [#19212](https://github.com/databendlabs/databend/pull/19212)
* fix: send responses only after state machine commit by **@drmingdrmer** in [#19286](https://github.com/databendlabs/databend/pull/19286)
### Code Refactor 🎉
* refactor(meta): decouple meta crates and improve stream error handling by **@drmingdrmer** in [#19263](https://github.com/databendlabs/databend/pull/19263)
* refactor: simplify location capture in location_future by **@drmingdrmer** in [#19267](https://github.com/databendlabs/databend/pull/19267)
* refactor: move Pool from common-base to meta-client by **@drmingdrmer** in [#19273](https://github.com/databendlabs/databend/pull/19273)
* refactor: remove implicit `From&lt;MetaError&gt; for ErrorCode` trait by **@drmingdrmer** in [#19275](https://github.com/databendlabs/databend/pull/19275)
* refactor: simplify `Pool` struct and retry loop by **@drmingdrmer** in [#19276](https://github.com/databendlabs/databend/pull/19276)
* refactor: replace `BuildInfoRef` with `semver::Version` in meta-client by **@drmingdrmer** in [#19277](https://github.com/databendlabs/databend/pull/19277)
* refactor: simplify KVAppError handling with into_nested() by **@drmingdrmer** in [#19280](https://github.com/databendlabs/databend/pull/19280)
* refactor: replace local `uniq_id` and `drop_callback` with `databend-base` by **@drmingdrmer** in [#19279](https://github.com/databendlabs/databend/pull/19279)
* refactor: replace `BuildInfoRef` with `semver::Version` in `RpcClientConf` by **@drmingdrmer** in [#19281](https://github.com/databendlabs/databend/pull/19281)
* refactor: simplify Runtime by extracting common spawn and builder logic by **@drmingdrmer** in [#19282](https://github.com/databendlabs/databend/pull/19282)
* refactor: use `anyhow::Result` for test function return types by **@drmingdrmer** in [#19283](https://github.com/databendlabs/databend/pull/19283)
* refactor: simplify control flow in Runtime methods by **@drmingdrmer** in [#19285](https://github.com/databendlabs/databend/pull/19285)
### Others 📒
* chore: update version for kv_list and kv_get_many features by **@drmingdrmer** in [#19270](https://github.com/databendlabs/databend/pull/19270)
* chore: remove sqllogicttest warnings by **@KKould** in [#19256](https://github.com/databendlabs/databend/pull/19256)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.870-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.869-nightly" number="" defaultCollapsed={true}>

## Jan 16, 2026 (v1.2.869-nightly)

## What's Changed
### Thoughtful Bug Fix 🔧
* fix: roll back h2 upgrade and ineffective reset workarounds by **@bohutang** in [#19264](https://github.com/databendlabs/databend/pull/19264)
### Code Refactor 🎉
* refactor: support row/bucket shuffle for aggregation by **@dqhl76** in [#19155](https://github.com/databendlabs/databend/pull/19155)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.869-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.868-nightly" number="" defaultCollapsed={true}>

## Jan 15, 2026 (v1.2.868-nightly)

## What's Changed
### Exciting New Features ✨
* feat: add configurable connection TTL for meta client by **@bohutang** in [#19259](https://github.com/databendlabs/databend/pull/19259)
### Thoughtful Bug Fix 🔧
* fix: stream diff SQL alias generation for quoted columns by **@zhyass** in [#19258](https://github.com/databendlabs/databend/pull/19258)
### Code Refactor 🎉
* refactor(meta): remove unused KVApi wrappers and traits by **@drmingdrmer** in [#19251](https://github.com/databendlabs/databend/pull/19251)
* refactor: rename `get_kv_stream` to `get_many_kv` with streaming input by **@drmingdrmer** in [#19254](https://github.com/databendlabs/databend/pull/19254)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.868-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.867-nightly" number="" defaultCollapsed={true}>

## Jan 14, 2026 (v1.2.867-nightly)

## What's Changed
### Exciting New Features ✨
* feat(iceberg): bump iceberg-rust to v0.8.0 and add write support by **@sundy-li** in [#19200](https://github.com/databendlabs/databend/pull/19200)
* feat(query): support tag_reference table function by **@TCeason** in [#19221](https://github.com/databendlabs/databend/pull/19221)
* feat(meta): add `KvList` gRPC API for listing keys by prefix by **@drmingdrmer** in [#19235](https://github.com/databendlabs/databend/pull/19235)
* feat: add `limit` parameter to `KVApi::list_kv()` and related methods by **@drmingdrmer** in [#19240](https://github.com/databendlabs/databend/pull/19240)
* feat(meta): add KvGetMany gRPC API; refactor: split chained awaits by **@drmingdrmer** in [#19244](https://github.com/databendlabs/databend/pull/19244)
* feat: support alter stage. by **@youngsofun** in [#19236](https://github.com/databendlabs/databend/pull/19236)
* feat(ci): add sha input to release workflow for custom commit targeting by **@bohutang** in [#19250](https://github.com/databendlabs/databend/pull/19250)
### Thoughtful Bug Fix 🔧
* fix(optimizer): add recursive identifier to prevent stack overflow by **@sundy-li** in [#19228](https://github.com/databendlabs/databend/pull/19228)
* fix(ci): make ci run databend query unit test by **@TCeason** in [#19233](https://github.com/databendlabs/databend/pull/19233)
* fix(query): fix rust-analyzer cyclic deps between common-functions and common-formats by **@TCeason** in [#19227](https://github.com/databendlabs/databend/pull/19227)
* fix(storage): prevent parquet page overflow by splitting large batches by **@dantengsky** in [#19206](https://github.com/databendlabs/databend/pull/19206)
* fix(query): normalize type names in DESC PROCEDURE by **@TCeason** in [#19237](https://github.com/databendlabs/databend/pull/19237)
* fix(test): ignore explain memo cost by **@dqhl76** in [#19238](https://github.com/databendlabs/databend/pull/19238)
* fix(meta): vacuum dropped table cleans policy refs by **@TCeason** in [#19239](https://github.com/databendlabs/databend/pull/19239)
* fix(ci): increase pool_max_idle_per_host by **@sundy-li** in [#19241](https://github.com/databendlabs/databend/pull/19241)
* fix(test): force HTTP/1.1 for sqllogictests client by **@sundy-li** in [#19243](https://github.com/databendlabs/databend/pull/19243)
### Code Refactor 🎉
* refactor(query): restructure hash join memory implementations by **@zhang2014** in [#19199](https://github.com/databendlabs/databend/pull/19199)
* refactor: encapsulate list parameters into `ListOptions` struct by **@drmingdrmer** in [#19242](https://github.com/databendlabs/databend/pull/19242)
* refactor(optimizer): refactor `SelectivityEstimator` by **@forsaken628** in [#19186](https://github.com/databendlabs/databend/pull/19186)
### Others 📒
* chore: remove fastrace::trace attributes from test suite by **@drmingdrmer** in [#19229](https://github.com/databendlabs/databend/pull/19229)
* chore: enhance EXPLAIN to display table branch qualifiers by **@zhyass** in [#19232](https://github.com/databendlabs/databend/pull/19232)
* chore: add setting for table ref by **@zhyass** in [#19234](https://github.com/databendlabs/databend/pull/19234)
* chore(query): bump ast to 0.2.4 and optimize gRPC configs by **@sundy-li** in [#19253](https://github.com/databendlabs/databend/pull/19253)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.867-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.866-nightly" number="" defaultCollapsed={true}>

## Jan 14, 2026 (v1.2.866-nightly)

## What's Changed
### Exciting New Features ✨
* feat: support variant cast to timestamp_tz by **@KKould** in [#19190](https://github.com/databendlabs/databend/pull/19190)
* feat: initial support for table branching and tagging by **@zhyass** in [#19035](https://github.com/databendlabs/databend/pull/19035)
* feat: to_decimal support more types by **@KKould** in [#19195](https://github.com/databendlabs/databend/pull/19195)
* feat(query): Variant timestamp_tz offset support seconds by **@b41sh** in [#19194](https://github.com/databendlabs/databend/pull/19194)
* feat(query): support ALTER &lt;object&gt; SET/UNSET TAG = value by **@TCeason** in [#19197](https://github.com/databendlabs/databend/pull/19197)
* feat: database level default connection configuration by **@dantengsky** in [#18886](https://github.com/databendlabs/databend/pull/18886)
* feat(formats): trim trailing zeros from decimal output in CSV/TSV exports by **@sundy-li** in [#19211](https://github.com/databendlabs/databend/pull/19211)
* feat: add request latency histogram tracking for meta service by **@drmingdrmer** in [#19215](https://github.com/databendlabs/databend/pull/19215)
* feat(query): support scalar subquery arguments in table functions by **@sundy-li** in [#19213](https://github.com/databendlabs/databend/pull/19213)
* fix: distinguish quoted and unquoted empty and null string when loading CSV  by **@youngsofun** in [#19207](https://github.com/databendlabs/databend/pull/19207)
### Thoughtful Bug Fix 🔧
* fix: use full join keys for hash shuffle to avoid skew by **@dqhl76** in [#19198](https://github.com/databendlabs/databend/pull/19198)
* fix(query): enable query result cache for queries with scalar subqueries by **@TCeason** in [#19202](https://github.com/databendlabs/databend/pull/19202)
* fix: auto-increment and computed columns in multi-table INSERT by **@zhyass** in [#19205](https://github.com/databendlabs/databend/pull/19205)
* fix(query): Ensure result cache keys include secure filter predicates by **@TCeason** in [#19210](https://github.com/databendlabs/databend/pull/19210)
* fix(query): fix parse float number error by **@b41sh** in [#19223](https://github.com/databendlabs/databend/pull/19223)
### Code Refactor 🎉
* refactor(query): rename skip duplicate hash tables to unique by **@zhang2014** in [#19192](https://github.com/databendlabs/databend/pull/19192)
* refactor(meta): upgrade openraft to v0.10.0-alpha.13 by **@drmingdrmer** in [#19193](https://github.com/databendlabs/databend/pull/19193)
* refactor(query): reduce string allocations in hot paths by **@sundy-li** in [#19201](https://github.com/databendlabs/databend/pull/19201)
* refactor: extract SchemaApiTestSuite to standalone crate by **@drmingdrmer** in [#19219](https://github.com/databendlabs/databend/pull/19219)
* refactor(query): use snapshot_location for DummyTableScan cache invalidation by **@TCeason** in [#19214](https://github.com/databendlabs/databend/pull/19214)
* refactor: split SchemaTestSuite into several sub tests by **@drmingdrmer** in [#19224](https://github.com/databendlabs/databend/pull/19224)
### Others 📒
* chore(query): clean up the useless `count_distinct` by **@forsaken628** in [#19191](https://github.com/databendlabs/databend/pull/19191)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.866-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.865-nightly" number="" defaultCollapsed={true}>

## Jan 5, 2026 (v1.2.865-nightly)

## What's Changed
### Thoughtful Bug Fix 🔧
* fix: avoid committing new snapshot if table not changed by **@dantengsky** in [#19174](https://github.com/databendlabs/databend/pull/19174)
### Others 📒
* chore: fix misleading comment about CTAS and `allow_append_only_skip` by **@dantengsky** in [#19189](https://github.com/databendlabs/databend/pull/19189)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.865-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.864-nightly" number="" defaultCollapsed={true}>

## Jan 4, 2026 (v1.2.864-nightly)

## What's Changed
### Thoughtful Bug Fix 🔧
* fix(query): enable role-based S3 credential chain by **@everpcpc** in [#19188](https://github.com/databendlabs/databend/pull/19188)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.864-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.863-nightly" number="" defaultCollapsed={true}>

## Jan 3, 2026 (v1.2.863-nightly)

## What's Changed
### Exciting New Features ✨
* feat: allow retry with the same query id when starting query. by **@youngsofun** in [#19184](https://github.com/databendlabs/databend/pull/19184)
* feat: add tag DDL support (CREATE/DROP/SHOW only) by **@TCeason** in [#19109](https://github.com/databendlabs/databend/pull/19109)
* feat(function): high performance bitmap_count,bitmap_intersect without deserialization by **@forsaken628** in [#19149](https://github.com/databendlabs/databend/pull/19149)
* feat(query): Standardize Nested Type String Quoting and Variant Serialization for JSON Compatibility by **@b41sh** in [#19164](https://github.com/databendlabs/databend/pull/19164)
* feat: support self join elimination by **@SkyFan2002** in [#19169](https://github.com/databendlabs/databend/pull/19169)
### Thoughtful Bug Fix 🔧
* fix(query): Fix inverted index JSON array matched all rows by **@b41sh** in [#19185](https://github.com/databendlabs/databend/pull/19185)
### Build/Testing/CI Infra Changes 🔌
* ci: update JDBC compat test by **@youngsofun** in [#19176](https://github.com/databendlabs/databend/pull/19176)
* ci: adjust runner sizes by **@everpcpc** in [#19180](https://github.com/databendlabs/databend/pull/19180)
### Others 📒
* chore: remove noisy logs by **@SkyFan2002** in [#19178](https://github.com/databendlabs/databend/pull/19178)
* chore(query): log hash join stage timings by **@zhang2014** in [#19179](https://github.com/databendlabs/databend/pull/19179)
* chore: remove bendpy from default workspace members by **@everpcpc** in [#19183](https://github.com/databendlabs/databend/pull/19183)
* chore(query): support read nested column in iceberg tables by **@sundy-li** in [#19182](https://github.com/databendlabs/databend/pull/19182)
* chore: Rewrite multi-arg COUNT(DISTINCT) via inner group-by by **@KKould** in [#19160](https://github.com/databendlabs/databend/pull/19160)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.863-nightly

</StepContent>

</StepsWrap> 
