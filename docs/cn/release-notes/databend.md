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

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.860-nightly" number="-1" defaultCollapsed={false}>

## Dec 24, 2025 (v1.2.860-nightly)

## What's Changed
### Exciting New Features ✨
* feat: enhance table function fuse_encoding by **@dantengsky** in [#19127](https://github.com/databendlabs/databend/pull/19127)
* feat(query): support flight keepalive settings by **@zhang2014** in [#19141](https://github.com/databendlabs/databend/pull/19141)
### Thoughtful Bug Fix 🔧
* fix: where comparing old and new bitmap versions occurred when directly comparing bytes in join and group by operations. by **@KKould** in [#19082](https://github.com/databendlabs/databend/pull/19082)
* fix: distinct_eliminated is rewritten as distinct_on_group_key by **@KKould** in [#19142](https://github.com/databendlabs/databend/pull/19142)
### Code Refactor 🎉
* refactor: system.build_options as key-value by **@BohuTANG** in [#19137](https://github.com/databendlabs/databend/pull/19137)
* refactor: release table lock earlier during DML execution by **@dantengsky** in [#19113](https://github.com/databendlabs/databend/pull/19113)
* refactor(query): window supports const columns by **@forsaken628** in [#19140](https://github.com/databendlabs/databend/pull/19140)
* refactor: reduce max page size of http handler to 4MB. by **@youngsofun** in [#19136](https://github.com/databendlabs/databend/pull/19136)
### Others 📒
* chore(query): add release profile for aarch64 by **@zhang2014** in [#19135](https://github.com/databendlabs/databend/pull/19135)
* chore(query): allow_anonymous when key token is empty by **@sundy-li** in [#19143](https://github.com/databendlabs/databend/pull/19143)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.860-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.859-nightly" number="" defaultCollapsed={false}>

## Dec 22, 2025 (v1.2.859-nightly)

## What's Changed
### Others 📒
* chore(query): add aarch64 profile with optimization level 3  by **@dantengsky** in [#19105](https://github.com/databendlabs/databend/pull/19105)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.859-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.858-nightly" number="" defaultCollapsed={true}>

## Dec 22, 2025 (v1.2.858-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): Inverted Index and Vector Index support hybrid cache by **@b41sh** in [#19124](https://github.com/databendlabs/databend/pull/19124)
### Thoughtful Bug Fix 🔧
* fix: change history tables' clean operations timing check and update mechanism by **@dqhl76** in [#19095](https://github.com/databendlabs/databend/pull/19095)
* fix(query): update opendal by **@sundy-li** in [#19110](https://github.com/databendlabs/databend/pull/19110)
* fix(query): Fix drop Aggregating index failed by **@b41sh** in [#19131](https://github.com/databendlabs/databend/pull/19131)
### Code Refactor 🎉
* refactor(optimizer): simplify the implementation of rule eager aggregation by **@forsaken628** in [#19112](https://github.com/databendlabs/databend/pull/19112)
* refactor: `vacuum temporary files` also cleans inactive temp table data by **@dantengsky** in [#19092](https://github.com/databendlabs/databend/pull/19092)
### Build/Testing/CI Infra Changes 🔌
* ci: prepare upgrade toolchain by **@everpcpc** in [#19116](https://github.com/databendlabs/databend/pull/19116)
* ci: fix build build-tool image by **@everpcpc** in [#19117](https://github.com/databendlabs/databend/pull/19117)
* ci: cargo-nextest install target by **@everpcpc** in [#19118](https://github.com/databendlabs/databend/pull/19118)
* ci: fix install cargo nextest by **@everpcpc** in [#19119](https://github.com/databendlabs/databend/pull/19119)
* ci: fix install cargo-nextest by **@everpcpc** in [#19120](https://github.com/databendlabs/databend/pull/19120)
* ci: fix install rust tools by **@everpcpc** in [#19121](https://github.com/databendlabs/databend/pull/19121)
* ci: install tools binary without binstall by **@everpcpc** in [#19122](https://github.com/databendlabs/databend/pull/19122)
* ci: remove some tools from build-tool image by **@everpcpc** in [#19123](https://github.com/databendlabs/databend/pull/19123)
* ci: sccache prefix with toolchain version by **@everpcpc** in [#19129](https://github.com/databendlabs/databend/pull/19129)
* ci: remove mold from build & tmp disable unit test by **@everpcpc** in [#19130](https://github.com/databendlabs/databend/pull/19130)
### Others 📒
* chore: adjust cloud image build timeout from 60 minutes to 120 minutes by **@dantengsky** in [#19102](https://github.com/databendlabs/databend/pull/19102)
* chore: remove unused settings for aggregation by **@dqhl76** in [#19103](https://github.com/databendlabs/databend/pull/19103)
* chore(ci): try enable ENABLE_SCCACHE again by **@sundy-li** in [#19128](https://github.com/databendlabs/databend/pull/19128)
* chore: rename body_format query_result_format. by **@youngsofun** in [#19132](https://github.com/databendlabs/databend/pull/19132)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.858-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.857-nightly" number="" defaultCollapsed={true}>

## Dec 15, 2025 (v1.2.857-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): tighten procedure overload resolution by **@TCeason** in [#19084](https://github.com/databendlabs/databend/pull/19084)
* feat: basic support of schema evolution in copy for parquet by **@youngsofun** in [#19094](https://github.com/databendlabs/databend/pull/19094)
* feat: extend join condition dedup to anti/semi joins by **@SkyFan2002** in [#19097](https://github.com/databendlabs/databend/pull/19097)
* feat(query): add create_query to /v1/catalog/list_database_tables by **@everpcpc** in [#19099](https://github.com/databendlabs/databend/pull/19099)
### Thoughtful Bug Fix 🔧
* fix: udf args recursion crash and binding not found on table by **@KKould** in [#19091](https://github.com/databendlabs/databend/pull/19091)
* fix(query): fix stale indices in process_or by **@sundy-li** in [#19085](https://github.com/databendlabs/databend/pull/19085)
### Code Refactor 🎉
* refactor: reduce the memory of the HashIndex in the AggregateHashTable by **@forsaken628** in [#19046](https://github.com/databendlabs/databend/pull/19046)
### Others 📒
* chore: avoid bloom filter clone by **@SkyFan2002** in [#19098](https://github.com/databendlabs/databend/pull/19098)
* chore: remove format! in heavy IO loop  by **@dqhl76** in [#19077](https://github.com/databendlabs/databend/pull/19077)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.857-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.856-nightly" number="" defaultCollapsed={true}>

## Dec 10, 2025 (v1.2.856-nightly)

## What's Changed
### Exciting New Features ✨
* feat: add explicit FLUSH PRIVILEGES to refresh role cache for query node by **@camilesing** in [#19066](https://github.com/databendlabs/databend/pull/19066)
* feat: heuristic rule for fuse parquet dictionary page by **@dantengsky** in [#19024](https://github.com/databendlabs/databend/pull/19024)
* feat: spill profile metrics by **@BohuTANG** in [#19075](https://github.com/databendlabs/databend/pull/19075)
* feat(query): add metrics session_acquired_queries_total by **@everpcpc** in [#19087](https://github.com/databendlabs/databend/pull/19087)
### Code Refactor 🎉
* refactor(query): supports parallel data transmission between nodes by **@zhang2014** in [#18984](https://github.com/databendlabs/databend/pull/18984)
* refactor: build the runtime filter during the HashJoin block collection process by **@SkyFan2002** in [#19058](https://github.com/databendlabs/databend/pull/19058)
### Build/Testing/CI Infra Changes 🔌
* ci: benchmark optimize by **@everpcpc** in [#19086](https://github.com/databendlabs/databend/pull/19086)
### Others 📒
* chore: combine the logic that triggers automatic compression upon write by **@zhyass** in [#19050](https://github.com/databendlabs/databend/pull/19050)
* chore: revert structured spill config by **@BohuTANG** in [#19088](https://github.com/databendlabs/databend/pull/19088)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.856-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.855-nightly" number="" defaultCollapsed={true}>

## Dec 9, 2025 (v1.2.855-nightly)

## What's Changed
### Exciting New Features ✨
* feat: perf small_union and small_symmetric_difference by **@KKould** in [#19069](https://github.com/databendlabs/databend/pull/19069)
### Thoughtful Bug Fix 🔧
* fix: http handler cut block to pages using memory size after gc. by **@youngsofun** in [#19071](https://github.com/databendlabs/databend/pull/19071)
* fix: query error when stream_consume_batch_size_hint is not 0 by **@zhyass** in [#19074](https://github.com/databendlabs/databend/pull/19074)
### Code Refactor 🎉
* refactor: try reduce aggregate hash index cost on hot path by **@dqhl76** in [#19072](https://github.com/databendlabs/databend/pull/19072)
### Build/Testing/CI Infra Changes 🔌
* ci: fix do not sync debug symbols to R2 by **@everpcpc** in [#19078](https://github.com/databendlabs/databend/pull/19078)
* ci: rename debug symbol for publish by **@everpcpc** in [#19080](https://github.com/databendlabs/databend/pull/19080)
* ci: benchmark tpch1000 with local disk cache by **@everpcpc** in [#19081](https://github.com/databendlabs/databend/pull/19081)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.855-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.854-nightly" number="" defaultCollapsed={true}>

## Dec 8, 2025 (v1.2.854-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): row access policy support rbac by **@TCeason** in [#19064](https://github.com/databendlabs/databend/pull/19064)
* feat(query): add THROW support to SQL procedures by **@TCeason** in [#19067](https://github.com/databendlabs/databend/pull/19067)
### Build/Testing/CI Infra Changes 🔌
* ci: fix missing token for publish dbg by **@everpcpc** in [#19070](https://github.com/databendlabs/databend/pull/19070)
### Others 📒
* chore(query): replace custom wrappers with intrinsics::assume by **@zhang2014** in [#19063](https://github.com/databendlabs/databend/pull/19063)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.854-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.853-nightly" number="" defaultCollapsed={true}>

## Dec 5, 2025 (v1.2.853-nightly)

## What's Changed
### Exciting New Features ✨
* feat: perf bitmap intersect by **@KKould** in [#19041](https://github.com/databendlabs/databend/pull/19041)
* feat(query): speed up string→timestamp/date/timestamptz parsing via DayLUT fast path by **@TCeason** in [#19045](https://github.com/databendlabs/databend/pull/19045)
* feat: improve scan IO profile metrics by **@BohuTANG** in [#18975](https://github.com/databendlabs/databend/pull/18975)
* feat: impl `bitmap_construct_agg` by **@KKould** in [#19053](https://github.com/databendlabs/databend/pull/19053)
### Thoughtful Bug Fix 🔧
* fix(query): fix filter bug  with small block-size by **@sundy-li** in [#19047](https://github.com/databendlabs/databend/pull/19047)
* fix: Pruning multithreading without accumulating time by **@KKould** in [#19044](https://github.com/databendlabs/databend/pull/19044)
### Code Refactor 🎉
* refactor: bytes view calc `total_bytes_len` lazy. by **@youngsofun** in [#19056](https://github.com/databendlabs/databend/pull/19056)
### Build/Testing/CI Infra Changes 🔌
* ci: add benchmark for tpch1000 by **@everpcpc** in [#19057](https://github.com/databendlabs/databend/pull/19057)
* ci: fix bendsql run for benchmark by **@everpcpc** in [#19059](https://github.com/databendlabs/databend/pull/19059)
* ci: fix benchmark database by **@everpcpc** in [#19060](https://github.com/databendlabs/databend/pull/19060)
* ci: adjust tpch1000 benchmark timeout by **@everpcpc** in [#19061](https://github.com/databendlabs/databend/pull/19061)
* ci: fix tpch1000 benchmark timeout by **@everpcpc** in [#19062](https://github.com/databendlabs/databend/pull/19062)
* ci: comment ignore ndjson files for benchmark by **@everpcpc** in [#19065](https://github.com/databendlabs/databend/pull/19065)
* ci: update database for benchmark by **@everpcpc** in [#19068](https://github.com/databendlabs/databend/pull/19068)
### Others 📒
* chore: revert "fix: fix memory_size of sliced string view. (#19014)" by **@youngsofun** in [#19051](https://github.com/databendlabs/databend/pull/19051)
* chore:  map log target to short semantic categories by **@forsaken628** in [#18925](https://github.com/databendlabs/databend/pull/18925)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.853-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.852-nightly" number="" defaultCollapsed={true}>

## Dec 2, 2025 (v1.2.852-nightly)

## What's Changed
### Exciting New Features ✨
* feat: improve runtime filter check via SIMD by **@SkyFan2002** in [#19039](https://github.com/databendlabs/databend/pull/19039)
### Build/Testing/CI Infra Changes 🔌
* ci: add a flag to allow skip trim debug info by **@dqhl76** in [#19043](https://github.com/databendlabs/databend/pull/19043)
### Others 📒
* chore: eliminate several unnecessary branches from the hot path of the aggregate function by **@forsaken628** in [#19028](https://github.com/databendlabs/databend/pull/19028)
* chore: improve `explain perf` to support flag inlined function by **@dqhl76** in [#19042](https://github.com/databendlabs/databend/pull/19042)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.852-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.851-nightly" number="" defaultCollapsed={true}>

## Dec 1, 2025 (v1.2.851-nightly)

## What's Changed
### Exciting New Features ✨
* feat: better display of retained identity by **@camilesing** in [#19029](https://github.com/databendlabs/databend/pull/19029)
### Thoughtful Bug Fix 🔧
* fix(query): Fix inverted index matched score caused panic by **@b41sh** in [#19032](https://github.com/databendlabs/databend/pull/19032)
* fix: implements bitmap comparison by **@dantengsky** in [#19038](https://github.com/databendlabs/databend/pull/19038)
* fix(query): fix stack overflow errors thrown during serialization by **@zhang2014** in [#19040](https://github.com/databendlabs/databend/pull/19040)
### Code Refactor 🎉
* refactor: Optimize timestamp/timestamptz function by DayLUT by **@TCeason** in [#19031](https://github.com/databendlabs/databend/pull/19031)
### Others 📒
* chore(query): set `enable_experimental_virtual_column` default as 0 by **@b41sh** in [#19033](https://github.com/databendlabs/databend/pull/19033)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.851-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.850-nightly" number="" defaultCollapsed={true}>

## Dec 1, 2025 (v1.2.850-nightly)

## What's Changed
### Exciting New Features ✨
* feat: add cost to explain pruning stats by **@KKould** in [#19015](https://github.com/databendlabs/databend/pull/19015)
* feat: add column update_on for user functions table by **@KKould** in [#19018](https://github.com/databendlabs/databend/pull/19018)
* feat(query): add DATE ± INTERVAL -&gt; DATE function by **@TCeason** in [#19022](https://github.com/databendlabs/databend/pull/19022)
### Code Refactor 🎉
* refactor(query): decrease call tzdb parse by **@TCeason** in [#19004](https://github.com/databendlabs/databend/pull/19004)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.850-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.849-nightly" number="" defaultCollapsed={true}>

## Nov 27, 2025 (v1.2.849-nightly)

## What's Changed
### Exciting New Features ✨
* feat: support position column in common sql query by **@KKould** in [#19012](https://github.com/databendlabs/databend/pull/19012)
* feat: improve runtime filter [Part 3] by **@SkyFan2002** in [#19006](https://github.com/databendlabs/databend/pull/19006)
* feat: enable Decimal64 handling in fuse table deserialization by **@dantengsky** in [#19008](https://github.com/databendlabs/databend/pull/19008)
* feat(query): Inverted Index Top-N Pruning for ORDER BY + LIMIT Queries by **@b41sh** in [#19016](https://github.com/databendlabs/databend/pull/19016)
### Thoughtful Bug Fix 🔧
* fix: load of large zip file. by **@youngsofun** in [#19010](https://github.com/databendlabs/databend/pull/19010)
* fix(rbac): forbiden grant create-ownership-object privilege to user by **@TCeason** in [#18987](https://github.com/databendlabs/databend/pull/18987)
* fix: fix memory_size of sliced string view. by **@youngsofun** in [#19014](https://github.com/databendlabs/databend/pull/19014)
* fix: runtime filters not work when probe keys are simple casts of non-nullable columns to nullable types by **@SkyFan2002** in [#19020](https://github.com/databendlabs/databend/pull/19020)
### Code Refactor 🎉
* refactor(func): optimize function `array_aggregate` by **@forsaken628** in [#19005](https://github.com/databendlabs/databend/pull/19005)
* refactor: move aggregation spill logic into partial aggregate by **@dqhl76** in [#18999](https://github.com/databendlabs/databend/pull/18999)
* refactor(query): add the matcher id when calling the optimizer apply by **@zhang2014** in [#19017](https://github.com/databendlabs/databend/pull/19017)
### Build/Testing/CI Infra Changes 🔌
* ci: ttc test with arrow body format. by **@youngsofun** in [#18985](https://github.com/databendlabs/databend/pull/18985)
* ci: 'onlyif http'-&gt;'skipif mysql' to cover ttc tests by **@youngsofun** in [#19011](https://github.com/databendlabs/databend/pull/19011)
* ci: refactor databend-go compat test. by **@youngsofun** in [#19023](https://github.com/databendlabs/databend/pull/19023)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.849-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.848-nightly" number="" defaultCollapsed={true}>

## Nov 24, 2025 (v1.2.848-nightly)

## What's Changed
### Thoughtful Bug Fix 🔧
* fix: unable to get field on rank limit when rule_eager_aggregation applied by **@KKould** in [#19007](https://github.com/databendlabs/databend/pull/19007)
* fix: pivot extra columns on projection by **@KKould** in [#18994](https://github.com/databendlabs/databend/pull/18994)
### Code Refactor 🎉
* refactor: bump crates arrow* and parquet to version 56 by **@dantengsky** in [#18997](https://github.com/databendlabs/databend/pull/18997)
### Others 📒
* chore(ut): support for const columns as input to function unit tests by **@forsaken628** in [#19009](https://github.com/databendlabs/databend/pull/19009)
* chore(query): enable to cache the previous python import directory for python udf by **@sundy-li** in [#19003](https://github.com/databendlabs/databend/pull/19003)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.848-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.847-nightly" number="" defaultCollapsed={true}>

## Nov 21, 2025 (v1.2.847-nightly)

## What's Changed
### Others 📒
* chore: make query service start after meta by **@everpcpc** in [#19002](https://github.com/databendlabs/databend/pull/19002)
* chore(query): Refresh virtual column support limit and selection by **@b41sh** in [#19001](https://github.com/databendlabs/databend/pull/19001)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.847-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.846-nightly" number="" defaultCollapsed={true}>

## Nov 21, 2025 (v1.2.846-nightly)

## What's Changed
### Thoughtful Bug Fix 🔧
* fix: Block::to_record_batch fail when a column is array of NULLs. by **@youngsofun** in [#18989](https://github.com/databendlabs/databend/pull/18989)
* fix: `desc password policy ` column types must match schema types. by **@youngsofun** in [#18990](https://github.com/databendlabs/databend/pull/18990)
### Code Refactor 🎉
* refactor(query): pass timezone by reference to avoid Arc churn by **@TCeason** in [#18998](https://github.com/databendlabs/databend/pull/18998)
* refactor(query): remove potential performance hotspots caused by fetch_add by **@zhang2014** in [#18995](https://github.com/databendlabs/databend/pull/18995)
### Others 📒
* chore(query): Accelerate vector index quantization score calculation with SIMD by **@b41sh** in [#18957](https://github.com/databendlabs/databend/pull/18957)
* chore(query): clamp timestamps to jiff range before timezone conversion by **@TCeason** in [#18996](https://github.com/databendlabs/databend/pull/18996)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.846-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.845-nightly" number="" defaultCollapsed={true}>

## Nov 20, 2025 (v1.2.845-nightly)

## What's Changed
### Exciting New Features ✨
* feat: impl UDTF Server by **@KKould** in [#18947](https://github.com/databendlabs/databend/pull/18947)
* feat(query):masking policy support rbac by **@TCeason** in [#18982](https://github.com/databendlabs/databend/pull/18982)
* feat: improve runtime filter [Part 2] by **@SkyFan2002** in [#18955](https://github.com/databendlabs/databend/pull/18955)
### Build/Testing/CI Infra Changes 🔌
* ci: upgrade k3s for meta chaos by **@everpcpc** in [#18983](https://github.com/databendlabs/databend/pull/18983)
### Others 📒
* chore: bump opendal to 0.54.1 by **@dqhl76** in [#18970](https://github.com/databendlabs/databend/pull/18970)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.845-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.844-nightly" number="" defaultCollapsed={true}>

## Nov 18, 2025 (v1.2.844-nightly)

## What's Changed
### Others 📒
* chore: adjust the storage method of timestamp_tz so that the timestamp value is retrieved directly. by **@KKould** in [#18974](https://github.com/databendlabs/databend/pull/18974)
* chore: add more logs to cover aggregate spill by **@dqhl76** in [#18980](https://github.com/databendlabs/databend/pull/18980)
* chore(query): Virtual column support external table by **@b41sh** in [#18981](https://github.com/databendlabs/databend/pull/18981)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.844-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.843-nightly" number="" defaultCollapsed={true}>

## Nov 18, 2025 (v1.2.843-nightly)

## What's Changed
### Thoughtful Bug Fix 🔧
* fix(query): count_distinct needs to handle nullable correctly by **@forsaken628** in [#18973](https://github.com/databendlabs/databend/pull/18973)
### Build/Testing/CI Infra Changes 🔌
* ci: fix dependency for test cloud control server by **@everpcpc** in [#18978](https://github.com/databendlabs/databend/pull/18978)
### Others 📒
* chore(query): improve python udf script by **@sundy-li** in [#18960](https://github.com/databendlabs/databend/pull/18960)
* chore(query): delete replace masking/row access policy by **@TCeason** in [#18972](https://github.com/databendlabs/databend/pull/18972)
* chore(query): Optimize Optimizer Performance by Reducing Redundant Computations by **@b41sh** in [#18979](https://github.com/databendlabs/databend/pull/18979)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.843-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.842-nightly" number="" defaultCollapsed={true}>

## Nov 17, 2025 (v1.2.842-nightly)

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.842-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.841-nightly" number="" defaultCollapsed={true}>

## Nov 14, 2025 (v1.2.841-nightly)

## What's Changed
### Exciting New Features ✨
* feat: http handler return geometry_output_format with data. by **@youngsofun** in [#18963](https://github.com/databendlabs/databend/pull/18963)
* feat(query): add table statistics admin api by **@zhang2014** in [#18967](https://github.com/databendlabs/databend/pull/18967)
* feat: upgrade nom to version 8.0.0 and accelerate expr_element using the first token. by **@KKould** in [#18935](https://github.com/databendlabs/databend/pull/18935)
### Thoughtful Bug Fix 🔧
* fix(query): or_filter get incorrectly result by **@zhyass** in [#18965](https://github.com/databendlabs/databend/pull/18965)
* fix(query): Fix copy into Variant field panic with infinite number by **@b41sh** in [#18962](https://github.com/databendlabs/databend/pull/18962)
### Code Refactor 🎉
* refactor: stream spill triggering for partial aggregation by **@dqhl76** in [#18943](https://github.com/databendlabs/databend/pull/18943)
* chore: optimize ExprBloomFilter to use references instead of clones by **@dantengsky** in [#18157](https://github.com/databendlabs/databend/pull/18157)
### Others 📒
* chore(query): adjust the default Bloom filter enable setting by **@zhang2014** in [#18966](https://github.com/databendlabs/databend/pull/18966)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.841-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.840-nightly" number="" defaultCollapsed={true}>

## Nov 14, 2025 (v1.2.840-nightly)

## What's Changed
### Exciting New Features ✨
* feat: new fuse table option `enable_parquet_dictionary` by **@dantengsky** in [#17675](https://github.com/databendlabs/databend/pull/17675)
### Thoughtful Bug Fix 🔧
* fix: timestamp_tz display by **@KKould** in [#18958](https://github.com/databendlabs/databend/pull/18958)
### Others 📒
* chore: flaky test by **@zhyass** in [#18959](https://github.com/databendlabs/databend/pull/18959)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.840-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.839-nightly" number="" defaultCollapsed={true}>

## Nov 13, 2025 (v1.2.839-nightly)

## What's Changed
### Thoughtful Bug Fix 🔧
* fix: return timezone when set in query level. by **@youngsofun** in [#18952](https://github.com/databendlabs/databend/pull/18952)
* fix(query): Skip sequence lookups when re-binding stored defaults by **@TCeason** in [#18946](https://github.com/databendlabs/databend/pull/18946)
* fix(query): build mysql tls config by **@everpcpc** in [#18953](https://github.com/databendlabs/databend/pull/18953)
* fix(query): defer MySQL session creation until the handshake completes by **@everpcpc** in [#18956](https://github.com/databendlabs/databend/pull/18956)
### Code Refactor 🎉
* refactor(query): prevent masking/row access policy name conflicts by **@TCeason** in [#18937](https://github.com/databendlabs/databend/pull/18937)
* refactor(query): optimize visibility checker for large-scale deployments improved 10x by **@TCeason** in [#18954](https://github.com/databendlabs/databend/pull/18954)
### Others 📒
* chore(query): improve resolve large array by **@sundy-li** in [#18949](https://github.com/databendlabs/databend/pull/18949)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.839-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.838-nightly" number="" defaultCollapsed={true}>

## Nov 12, 2025 (v1.2.838-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): support policy_reference table function by **@TCeason** in [#18944](https://github.com/databendlabs/databend/pull/18944)
* feat: improve runtime filter [Part 1] by **@SkyFan2002** in [#18893](https://github.com/databendlabs/databend/pull/18893)
### Thoughtful Bug Fix 🔧
* fix(query): fix query function parsing nested conditions by **@b41sh** in [#18940](https://github.com/databendlabs/databend/pull/18940)
* fix(query): handle complex types in procedure argument parsing by **@TCeason** in [#18929](https://github.com/databendlabs/databend/pull/18929)
* fix: error in multi statement transaction retry by **@SkyFan2002** in [#18934](https://github.com/databendlabs/databend/pull/18934)
* fix: flaky test progress not updated in real time in cluster mode by **@youngsofun** in [#18945](https://github.com/databendlabs/databend/pull/18945)
### Code Refactor 🎉
* refactor(binder): move the rewrite of ASOF JOIN to the logical plan and remove scalar_expr from `DerivedColumn` by **@forsaken628** in [#18938](https://github.com/databendlabs/databend/pull/18938)
* refactor(query): optimized `UnaryState` design and simplified `string_agg` implementation by **@forsaken628** in [#18941](https://github.com/databendlabs/databend/pull/18941)
* refactor(query): rename exchange hash to node to node hash by **@zhang2014** in [#18948](https://github.com/databendlabs/databend/pull/18948)
### Others 📒
* chore(query): ignore assert const in memo logical test by **@zhang2014** in [#18950](https://github.com/databendlabs/databend/pull/18950)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.838-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.837-nightly" number="" defaultCollapsed={true}>

## Nov 10, 2025 (v1.2.837-nightly)

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.837-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.836-nightly" number="" defaultCollapsed={true}>

## Nov 8, 2025 (v1.2.836-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): Support `bitmap_to_array` function by **@b41sh** in [#18927](https://github.com/databendlabs/databend/pull/18927)
* feat(query): prevent dropping in-use security policies by **@TCeason** in [#18918](https://github.com/databendlabs/databend/pull/18918)
* feat(mysql): add JDBC healthcheck regex to support SELECT 1 FROM DUAL by **@yufan022** in [#18933](https://github.com/databendlabs/databend/pull/18933)
* feat: return timezone in HTTP handler. by **@youngsofun** in [#18936](https://github.com/databendlabs/databend/pull/18936)
### Thoughtful Bug Fix 🔧
* fix: FilterExecutor needs to handle projections when `enable_selector_executor` is turned off.  by **@forsaken628** in [#18921](https://github.com/databendlabs/databend/pull/18921)
* fix(query): fix Inverted/Vector index panic with Native Storage Format by **@b41sh** in [#18932](https://github.com/databendlabs/databend/pull/18932)
* fix(query): optimize the cost estimation of some query plans by **@zhang2014** in [#18926](https://github.com/databendlabs/databend/pull/18926)
* fix: alter column with specify approx distinct by **@zhyass** in [#18928](https://github.com/databendlabs/databend/pull/18928)
### Code Refactor 🎉
* refactor: refine experimental final aggregate spill by **@dqhl76** in [#18907](https://github.com/databendlabs/databend/pull/18907)
* refactor(query): AccessType downcasts now return Result so mismatches surface useful diagnostics by **@forsaken628** in [#18923](https://github.com/databendlabs/databend/pull/18923)
* refactor(query): merge pipeline core, sources and sinks crate by **@zhang2014** in [#18939](https://github.com/databendlabs/databend/pull/18939)
### Others 📒
* chore: remove fixeme on TimestampTz by **@KKould** in [#18924](https://github.com/databendlabs/databend/pull/18924)
* chore: fixed time zone on shanghai to fix flasky 02_0079_function_interval.test by **@KKould** in [#18930](https://github.com/databendlabs/databend/pull/18930)
* chore: DataType::TimestampTz display: "TimestampTz" -&gt; "Timestamp_Tz" by **@KKould** in [#18931](https://github.com/databendlabs/databend/pull/18931)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.836-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.835-nightly" number="" defaultCollapsed={true}>

## Nov 4, 2025 (v1.2.835-nightly)

## What's Changed
### Exciting New Features ✨
* feat:  add has_data in system.streams by **@zhyass** in [#18920](https://github.com/databendlabs/databend/pull/18920)
* feat(query): BackpressureSpiller has been changed to a fully synchronous call by **@forsaken628** in [#18899](https://github.com/databendlabs/databend/pull/18899)
* feat(query): add more info to /v1/verify by **@everpcpc** in [#18882](https://github.com/databendlabs/databend/pull/18882)
### Thoughtful Bug Fix 🔧
* fix: decimal overflow check is inadequate by **@forsaken628** in [#18919](https://github.com/databendlabs/databend/pull/18919)
### Others 📒
* chore: bump databend-common-ast to 0.2.3 by **@KKould** in [#18915](https://github.com/databendlabs/databend/pull/18915)
* chore: refine UDF transport error messaging by **@BohuTANG** in [#18910](https://github.com/databendlabs/databend/pull/18910)
* chore(query): Compatible with the MySQL BI Ecosystem by **@TCeason** in [#18909](https://github.com/databendlabs/databend/pull/18909)
* chore: update meta-service feature requirements for meta-client by **@drmingdrmer** in [#18911](https://github.com/databendlabs/databend/pull/18911)
* chore: Enable Advanced Indexing Features for Community Edition by **@b41sh** in [#18917](https://github.com/databendlabs/databend/pull/18917)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.835-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.834-nightly" number="" defaultCollapsed={true}>

## Nov 3, 2025 (v1.2.834-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): masking policy USING clause with multi-column support by **@TCeason** in [#18884](https://github.com/databendlabs/databend/pull/18884)
* feat(query): the HTTP protocol supports returning a body in arrow IPC format by **@forsaken628** in [#18890](https://github.com/databendlabs/databend/pull/18890)
* feat: support DataType `TimestampTz` by **@KKould** in [#18892](https://github.com/databendlabs/databend/pull/18892)
* feat: support ANSI CURRENT_DATE/CURRENT_TIME keywords by **@BohuTANG** in [#18902](https://github.com/databendlabs/databend/pull/18902)
### Thoughtful Bug Fix 🔧
* fix(query): prevent modification of columns with security policies by **@TCeason** in [#18896](https://github.com/databendlabs/databend/pull/18896)
* fix: hilbert recluster get parser error by **@zhyass** in [#18904](https://github.com/databendlabs/databend/pull/18904)
* fix: trim duplicated metrics suffix by **@everpcpc** in [#18908](https://github.com/databendlabs/databend/pull/18908)
### Code Refactor 🎉
* refactor: include databend-metabench in release packages by **@drmingdrmer** in [#18912](https://github.com/databendlabs/databend/pull/18912)
### Build/Testing/CI Infra Changes 🔌
* ci: fix flaky test. by **@youngsofun** in [#18898](https://github.com/databendlabs/databend/pull/18898)
### Others 📒
* chore(query): declare var in procedure support optional default expr by **@sundy-li** in [#18897](https://github.com/databendlabs/databend/pull/18897)
* chore: improve error msg by **@camilesing** in [#18885](https://github.com/databendlabs/databend/pull/18885)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.834-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.833-nightly" number="" defaultCollapsed={true}>

## Oct 27, 2025 (v1.2.833-nightly)

## What's Changed
### Thoughtful Bug Fix 🔧
* fix(query): fix panic if miss match empty data type by **@zhang2014** in [#18894](https://github.com/databendlabs/databend/pull/18894)
### Code Refactor 🎉
* refactor(query): experimental aggregate final with recursive spill support by **@dqhl76** in [#18866](https://github.com/databendlabs/databend/pull/18866)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.833-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.832-nightly" number="" defaultCollapsed={true}>

## Oct 27, 2025 (v1.2.832-nightly)

## What's Changed
### Exciting New Features ✨
* feat: enable geo and virtual column settings by default by **@BohuTANG** in [#18873](https://github.com/databendlabs/databend/pull/18873)
* feat: remove enable_experimental_merge_into setting by **@camilesing** in [#18841](https://github.com/databendlabs/databend/pull/18841)
* feat: optimize expression parse by **@KKould** in [#18871](https://github.com/databendlabs/databend/pull/18871)
* feat: remove useless optional fields in response of query_state_handler. by **@youngsofun** in [#18876](https://github.com/databendlabs/databend/pull/18876)
* feat: enhance s3 intelligent tiering storage class supporting by **@dantengsky** in [#18863](https://github.com/databendlabs/databend/pull/18863)
### Thoughtful Bug Fix 🔧
* fix(storage): analyze table get out of index by **@zhyass** in [#18877](https://github.com/databendlabs/databend/pull/18877)
* fix(query): Preserve case for Variant MapAccess in computed columns by **@b41sh** in [#18872](https://github.com/databendlabs/databend/pull/18872)
* fix(query): fix set_null_schema by **@sundy-li** in [#18880](https://github.com/databendlabs/databend/pull/18880)
* fix(ci): fix tpcds spill tests that no longer work by **@forsaken628** in [#18869](https://github.com/databendlabs/databend/pull/18869)
* fix: ignore group_by_shuffle_mode in grouping set query by **@SkyFan2002** in [#18881](https://github.com/databendlabs/databend/pull/18881)
* fix: meta-service: watch stream should be atomically added by **@drmingdrmer** in [#18888](https://github.com/databendlabs/databend/pull/18888)
* fix(query): fix row access policy parameter order and case sensitivity by **@TCeason** in [#18889](https://github.com/databendlabs/databend/pull/18889)
### Code Refactor 🎉
* refactor(query): improve transforms directory organization (sorts, filters, blocks, columns) by **@forsaken628** in [#18883](https://github.com/databendlabs/databend/pull/18883)
* refactor(query): enable grace hash join if force join spill data by **@zhang2014** in [#18878](https://github.com/databendlabs/databend/pull/18878)
### Build/Testing/CI Infra Changes 🔌
* ci: fix flaky tests. by **@youngsofun** in [#18887](https://github.com/databendlabs/databend/pull/18887)
### Others 📒
* chore: remove redundant experimental procedure toggles by **@BohuTANG** in [#18875](https://github.com/databendlabs/databend/pull/18875)
* chore: ensuring all imperfect blocks are compacted by **@zhyass** in [#18860](https://github.com/databendlabs/databend/pull/18860)

## New Contributors
* **@camilesing** made their first contribution in [#18841](https://github.com/databendlabs/databend/pull/18841)

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.832-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.831-nightly" number="" defaultCollapsed={true}>

## Oct 20, 2025 (v1.2.831-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): better script engine with dynamic schema support by **@sundy-li** in [#18838](https://github.com/databendlabs/databend/pull/18838)
### Thoughtful Bug Fix 🔧
* fix: memory size of string view should count views array. by **@youngsofun** in [#18867](https://github.com/databendlabs/databend/pull/18867)
### Code Refactor 🎉
* refactor: rewrite meta-meta compat test with python by **@drmingdrmer** in [#18870](https://github.com/databendlabs/databend/pull/18870)
### Others 📒
* chore: remove common-password feature to reduce binary size by **@TCeason** in [#18868](https://github.com/databendlabs/databend/pull/18868)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.831-nightly

</StepContent>

</StepsWrap> 
