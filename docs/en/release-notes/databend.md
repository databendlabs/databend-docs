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

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/untagged-07c3d72e19e8e34a6539" number="" defaultCollapsed={true}>

## Apr 21, 2025 (v1.2.725)

## What's Changed
### Exciting New Features ✨
* feat: Add hdfs support in iceberg and fill iceberg statistics by **@Xuanwo** in [#17352](https://github.com/databendlabs/databend/pull/17352)
* feat: support specifying columns to include in the "Attach table" statement by **@dantengsky** in [#17442](https://github.com/databendlabs/databend/pull/17442)
* feat(metrics): add progress metrics via collector by **@flaneur2020** in [#17359](https://github.com/databendlabs/databend/pull/17359)
* feat(binder): support update from by **@Dousir9** in [#17464](https://github.com/databendlabs/databend/pull/17464)
* feat(query): add table stats api to admin interface by **@everpcpc** in [#17471](https://github.com/databendlabs/databend/pull/17471)
* feat: Use max/min to estimate ndv by **@Xuanwo** in [#17468](https://github.com/databendlabs/databend/pull/17468)
* feat: add table option `copy_dedup_full_path` by **@youngsofun** in [#17473](https://github.com/databendlabs/databend/pull/17473)
* feat(query):  add markov model function and feistel function for obfuscator by **@forsaken628** in [#17437](https://github.com/databendlabs/databend/pull/17437)
* feat(sqlsmith): fuzz test support more dbs as seed by **@b41sh** in [#17489](https://github.com/databendlabs/databend/pull/17489)
* feat: `SHOW CREATE TABLE` add quote for ident by **@KKould** in [#17505](https://github.com/databendlabs/databend/pull/17505)
* feat: object warehouse support rbac by **@TCeason** in [#17262](https://github.com/databendlabs/databend/pull/17262)
* feat: (semi-)sync table/field comments  with  the table being attached by **@dantengsky** in [#17478](https://github.com/databendlabs/databend/pull/17478)
* feat(raft-log): enhance raft-log reliability and add compatibility tests by **@drmingdrmer** in [#17510](https://github.com/databendlabs/databend/pull/17510)
* feat: add log.file.max_size and rolling test by **@BohuTANG** in [#17508](https://github.com/databendlabs/databend/pull/17508)
* feat: csv/tsv/ndjson support querying file meta data. by **@youngsofun** in [#17512](https://github.com/databendlabs/databend/pull/17512)
* feat(query): support `explain(DECORRELATED,verbose)` by **@forsaken628** in [#17518](https://github.com/databendlabs/databend/pull/17518)
* feat(query): add show_roles table function by **@TCeason** in [#17517](https://github.com/databendlabs/databend/pull/17517)
* feat: support query metadata from parquet. by **@youngsofun** in [#17527](https://github.com/databendlabs/databend/pull/17527)
* feat: skip reading empty files when load/query location. by **@youngsofun** in [#17522](https://github.com/databendlabs/databend/pull/17522)
* feat(base): enhanced query-level memory management by **@zhang2014** in [#17358](https://github.com/databendlabs/databend/pull/17358)
* feat(query): Supports folding of show grants results for roles and users by **@TCeason** in [#17543](https://github.com/databendlabs/databend/pull/17543)
* feat(query): support query level spill setting by **@zhang2014** in [#17542](https://github.com/databendlabs/databend/pull/17542)
* feat: support `WITHIN GROUP` clause for `AggregateFunction` by **@KKould** in [#17519](https://github.com/databendlabs/databend/pull/17519)
* feat(query): add catalog apis by **@everpcpc** in [#17493](https://github.com/databendlabs/databend/pull/17493)
* feat: support load Avro Files. by **@youngsofun** in [#17548](https://github.com/databendlabs/databend/pull/17548)
* feat(query): add api for users & roles by **@everpcpc** in [#17553](https://github.com/databendlabs/databend/pull/17553)
* feat(query): support nondeterministic update by **@forsaken628** in [#17555](https://github.com/databendlabs/databend/pull/17555)
* feat: `string_agg` is compatible with multiple types as arguments instead of just String by **@KKould** in [#17570](https://github.com/databendlabs/databend/pull/17570)
* feat: add table function `fuse_vacuum2()` by **@SkyFan2002** in [#16049](https://github.com/databendlabs/databend/pull/16049)
* feat: auto vacuum by **@dantengsky** in [#17579](https://github.com/databendlabs/databend/pull/17579)
* feat(query): database dml for iceberg catalog by **@sundy-li** in [#17578](https://github.com/databendlabs/databend/pull/17578)
* feat: UNPIVOT supports AS by **@forsaken628** in [#17595](https://github.com/databendlabs/databend/pull/17595)
* feat(query): bloom index support prune expr with simple casts by **@forsaken628** in [#17533](https://github.com/databendlabs/databend/pull/17533)
* feat(query): add catalog stats api by **@everpcpc** in [#17602](https://github.com/databendlabs/databend/pull/17602)
* feat(query): support create/drop table under iceberg catalog by **@TCeason** in [#17619](https://github.com/databendlabs/databend/pull/17619)
* feat(query): add iceberg table functions by **@sundy-li** in [#17626](https://github.com/databendlabs/databend/pull/17626)
* feat: heartbeat to avoid query result timeout.  by **@youngsofun** in [#17624](https://github.com/databendlabs/databend/pull/17624)
* feat: Enable test and doctest for all crates by **@Xuanwo** in [#17633](https://github.com/databendlabs/databend/pull/17633)
* feat: Add bendsave which can backup and restore databend data by **@Xuanwo** in [#17503](https://github.com/databendlabs/databend/pull/17503)
* feat: impl function `strip_null_value` for Variant by **@KKould** in [#17640](https://github.com/databendlabs/databend/pull/17640)
* feat(query): support left plan's from clause contains subquery  by **@forsaken628** in [#17621](https://github.com/databendlabs/databend/pull/17621)
* feat: support specifying compression when unloading to parquet. by **@youngsofun** in [#17664](https://github.com/databendlabs/databend/pull/17664)
* feat(meta): implement distributed semaphore based on meta-service by **@drmingdrmer** in [#17651](https://github.com/databendlabs/databend/pull/17651)
* feat: add support for storing logs in table by **@dqhl76** in [#17598](https://github.com/databendlabs/databend/pull/17598)
* feat(config): warn unknown field instead of panic on start up by **@flaneur2020** in [#17504](https://github.com/databendlabs/databend/pull/17504)
* feat: support nextval as field default value. by **@youngsofun** in [#17670](https://github.com/databendlabs/databend/pull/17670)
* feat: impl function: `regexp_extract` & `regexp_extract_all` by **@KKould** in [#17658](https://github.com/databendlabs/databend/pull/17658)
* feat(query): support mul fro interval type with int types by **@sundy-li** in [#17684](https://github.com/databendlabs/databend/pull/17684)
* feat: impl udf server add custom header by **@KKould** in [#17691](https://github.com/databendlabs/databend/pull/17691)
* feat(query): support query iceberg table by version by **@TCeason** in [#17693](https://github.com/databendlabs/databend/pull/17693)
* feat:  hybrid cache by **@dantengsky** in [#17704](https://github.com/databendlabs/databend/pull/17704)
* feat: introduce column oriented segment into by **@SkyFan2002** in [#17653](https://github.com/databendlabs/databend/pull/17653)
* feat: databend-metactl add command watch and upsert by **@drmingdrmer** in [#17739](https://github.com/databendlabs/databend/pull/17739)
* feat: Support Displaying Runtime Filters in EXPLAIN Output by **@SkyFan2002** in [#17726](https://github.com/databendlabs/databend/pull/17726)
* feat(query): page index and range index support eliminate cast by **@forsaken628** in [#17740](https://github.com/databendlabs/databend/pull/17740)
* feat(optimizer): optimizer trace log by **@BohuTANG** in [#17746](https://github.com/databendlabs/databend/pull/17746)
* feat(optimizer): add optimizer skip list by **@BohuTANG** in [#17750](https://github.com/databendlabs/databend/pull/17750)
* feat: function extract, date_part,date_diff support more date part by **@TCeason** in [#17759](https://github.com/databendlabs/databend/pull/17759)
* feat: table function that dumps snapshot information by **@dantengsky** in [#17763](https://github.com/databendlabs/databend/pull/17763)
* feat(optimizer): SExpr visitor by **@BohuTANG** in [#17768](https://github.com/databendlabs/databend/pull/17768)
* feat(meta-client): add `cache` crate for databend-meta service by **@drmingdrmer** in [#17766](https://github.com/databendlabs/databend/pull/17766)
* feat(query): table_statistics`(&lt;database_name&gt;[, table_name])` table functions by **@BohuTANG** in [#17781](https://github.com/databendlabs/databend/pull/17781)
* feat(query): support cluster level concurrent limit by **@zhang2014** in [#17778](https://github.com/databendlabs/databend/pull/17778)
* feat(query): support date_between(date_part, startdate, enddate) by **@TCeason** in [#17782](https://github.com/databendlabs/databend/pull/17782)
* feat: impl `Create/Drop` Index for Ngram Index by **@KKould** in [#17789](https://github.com/databendlabs/databend/pull/17789)
* feat: block stream write by **@zhyass** in [#17744](https://github.com/databendlabs/databend/pull/17744)
* feat: Bump opendal to 0.53.1 by **@Xuanwo** in [#17817](https://github.com/databendlabs/databend/pull/17817)
* feat: hybrid column data cache by **@dantengsky** in [#17771](https://github.com/databendlabs/databend/pull/17771)
### Thoughtful Bug Fix 🔧
* fix(query): fix WindowPartitionTopNExchange painc with an empty block  by **@forsaken628** in [#17453](https://github.com/databendlabs/databend/pull/17453)
* fix(parser): allow timestamp as a function name by **@forsaken628** in [#17455](https://github.com/databendlabs/databend/pull/17455)
* fix(query): fix order by derived column with limit return wrong values by **@b41sh** in [#17457](https://github.com/databendlabs/databend/pull/17457)
* fix(query): fold constant subquery to build filter plan instead of join plan by **@b41sh** in [#17448](https://github.com/databendlabs/databend/pull/17448)
* fix(query): fix left semi  optimize to inner join by **@sundy-li** in [#17458](https://github.com/databendlabs/databend/pull/17458)
* fix(query): fix bind internal column by **@b41sh** in [#17463](https://github.com/databendlabs/databend/pull/17463)
* fix(query): spill config should be mask by **@forsaken628** in [#17467](https://github.com/databendlabs/databend/pull/17467)
* fix(query): fix variant get string function auto cast null to SQL NULL by **@b41sh** in [#17466](https://github.com/databendlabs/databend/pull/17466)
* fix: InterpreterMetrics could subtract with overflow by **@forsaken628** in [#17461](https://github.com/databendlabs/databend/pull/17461)
* fix(query): fix stack overflow if excessive use of union all by **@zhang2014** in [#17475](https://github.com/databendlabs/databend/pull/17475)
* fix: check table mutability in `copy into` by **@dantengsky** in [#17480](https://github.com/databendlabs/databend/pull/17480)
* fix: impl hive disable_table_info_refresh for hive to avoid error when show table status from by **@BohuTANG** in [#17484](https://github.com/databendlabs/databend/pull/17484)
* fix(binder): AggregateRewriter should skip the rewrite of Pivot.aggregate by **@forsaken628** in [#17483](https://github.com/databendlabs/databend/pull/17483)
* fix(query): unsupport datetime format item should not return panic error by **@TCeason** in [#17490](https://github.com/databendlabs/databend/pull/17490)
* fix(binder): different UDAF call must have unique display_name by **@forsaken628** in [#17500](https://github.com/databendlabs/databend/pull/17500)
* fix(query): tpcds q69 fail by **@forsaken628** in [#17516](https://github.com/databendlabs/databend/pull/17516)
* fix(query): fix display ast with quoted comments by **@sundy-li** in [#17529](https://github.com/databendlabs/databend/pull/17529)
* fix: ensure result correctness when enable pruning cache by **@dqhl76** in [#17524](https://github.com/databendlabs/databend/pull/17524)
* fix(query): user/role name not support \b and \f by **@TCeason** in [#17530](https://github.com/databendlabs/databend/pull/17530)
* fix(query): ident role_name not support ' " \b \f in parse by **@TCeason** in [#17534](https://github.com/databendlabs/databend/pull/17534)
* fix: explain update sql panic by **@zhyass** in [#17474](https://github.com/databendlabs/databend/pull/17474)
* fix(query): show roles rewrite kind is err by **@TCeason** in [#17547](https://github.com/databendlabs/databend/pull/17547)
* fix: agg input does not match union output when subquery by **@KKould** in [#17552](https://github.com/databendlabs/databend/pull/17552)
* fix: with recursive bind table panic by **@KKould** in [#17554](https://github.com/databendlabs/databend/pull/17554)
* fix: parquet meta cache key include md5 or mtime or query_id. by **@youngsofun** in [#17556](https://github.com/databendlabs/databend/pull/17556)
* fix(query): fix incorrect domain folder by **@sundy-li** in [#17549](https://github.com/databendlabs/databend/pull/17549)
* fix: The update in MERGE INTO was mistakenly optimized as a delete by **@SkyFan2002** in [#17571](https://github.com/databendlabs/databend/pull/17571)
* fix(query): show catalog support iceberg engine by **@TCeason** in [#17569](https://github.com/databendlabs/databend/pull/17569)
* fix: session leak when execute explain pipeline in cluster mode by **@dqhl76** in [#17572](https://github.com/databendlabs/databend/pull/17572)
* fix(storage): hilbert cluster information by **@zhyass** in [#17577](https://github.com/databendlabs/databend/pull/17577)
* fix: tpcds Q69 fail by **@forsaken628** in [#17588](https://github.com/databendlabs/databend/pull/17588)
* fix(parser): allow reorder the task options in CREATE TASK/ALTER TASK by **@flaneur2020** in [#17537](https://github.com/databendlabs/databend/pull/17537)
* fix: parquet meta cache key should not use mtime. by **@youngsofun** in [#17589](https://github.com/databendlabs/databend/pull/17589)
* fix(query): /v1/roles return all roles for account admin by **@everpcpc** in [#17596](https://github.com/databendlabs/databend/pull/17596)
* fix(query): fix fold agg mismatch datatypes by **@sundy-li** in [#17593](https://github.com/databendlabs/databend/pull/17593)
* fix: the output columns of cte related columns lack the columns required by cte itself by **@KKould** in [#17576](https://github.com/databendlabs/databend/pull/17576)
* fix: tpcds spill test fail by **@forsaken628** in [#17597](https://github.com/databendlabs/databend/pull/17597)
* fix(query): fix comment display by **@sundy-li** in [#17615](https://github.com/databendlabs/databend/pull/17615)
* fix(query): fix cast nested types cause panic by **@b41sh** in [#17622](https://github.com/databendlabs/databend/pull/17622)
* fix(query): fix string view memory size calculate error by **@b41sh** in [#17629](https://github.com/databendlabs/databend/pull/17629)
* fix: trim object preix error by **@SkyFan2002** in [#17636](https://github.com/databendlabs/databend/pull/17636)
* fix(query): to_date parse string with format should use UTC timezone by **@TCeason** in [#17641](https://github.com/databendlabs/databend/pull/17641)
* fix(query): fix incorrect left mark join schema by **@sundy-li** in [#17642](https://github.com/databendlabs/databend/pull/17642)
* fix: disk cache failed to build on macOS by **@dantengsky** in [#17643](https://github.com/databendlabs/databend/pull/17643)
* fix(ddl): fix modify column data type null to not null failed by **@b41sh** in [#17650](https://github.com/databendlabs/databend/pull/17650)
* fix(query): to_date(9999-12-31, format_string) should success by **@TCeason** in [#17652](https://github.com/databendlabs/databend/pull/17652)
* fix(ci): flaky test by **@zhyass** in [#17663](https://github.com/databendlabs/databend/pull/17663)
* fix: Enforce storage http client to use native tls by **@Xuanwo** in [#17686](https://github.com/databendlabs/databend/pull/17686)
* fix(query): fix variant failed to successfully apply virtual column in bind join by **@KKould** in [#17673](https://github.com/databendlabs/databend/pull/17673)
* fix: persistent log table may loss records when shutdown by **@dqhl76** in [#17695](https://github.com/databendlabs/databend/pull/17695)
* fix: flaky unit test `test_persistent_log_write` by **@dqhl76** in [#17701](https://github.com/databendlabs/databend/pull/17701)
* fix: DNS resolve error in some cases by **@Xuanwo** in [#17699](https://github.com/databendlabs/databend/pull/17699)
* fix(query): broadcast subquery for markjoin if condition has null values by **@sundy-li** in [#17706](https://github.com/databendlabs/databend/pull/17706)
* fix(query): process_like directly unwrap is not safe by **@TCeason** in [#17722](https://github.com/databendlabs/databend/pull/17722)
* fix: flaky hybrid cache test by **@dantengsky** in [#17735](https://github.com/databendlabs/databend/pull/17735)
* fix(query): `ClientSessionManager::refresh_state` subtracts with overflow if clock drift is present by **@forsaken628** in [#17742](https://github.com/databendlabs/databend/pull/17742)
* fix: align EXPLAIN output with actual partition pruning statistics by **@dqhl76** in [#17491](https://github.com/databendlabs/databend/pull/17491)
* fix: correct state type for Decimal256 AVG aggregation  by **@dantengsky** in [#17774](https://github.com/databendlabs/databend/pull/17774)
* fix(query): don't check file format in proto-conv by **@sundy-li** in [#17793](https://github.com/databendlabs/databend/pull/17793)
* fix: Remove set nonblocking = false for mysql tcp stream by **@Xuanwo** in [#17798](https://github.com/databendlabs/databend/pull/17798)
* fix(metrics): remove high cardinality labels in metrics by **@flaneur2020** in [#17820](https://github.com/databendlabs/databend/pull/17820)
### Code Refactor 🎉
* refactor: s3 region auto detect error add timeout/endpoint by **@BohuTANG** in [#17482](https://github.com/databendlabs/databend/pull/17482)
* refactor: re-generate hint file after alter table operations by **@dantengsky** in [#17511](https://github.com/databendlabs/databend/pull/17511)
* refactor: remove timeout from snapshot hint refresh process by **@dantengsky** in [#17532](https://github.com/databendlabs/databend/pull/17532)
* refactor(meta): simplify map key handling and improve naming consistency by **@drmingdrmer** in [#17545](https://github.com/databendlabs/databend/pull/17545)
* refactor: add `VirtualDataScheam` to `TableMeta` by **@KKould** in [#17591](https://github.com/databendlabs/databend/pull/17591)
* refactor: extract map-api and watcher to separate crates by **@drmingdrmer** in [#17594](https://github.com/databendlabs/databend/pull/17594)
* refactor(meta): adopt external crate for shared state machine logic by **@drmingdrmer** in [#17609](https://github.com/databendlabs/databend/pull/17609)
* refactor: move MatchSeq to external crate map-api by **@drmingdrmer** in [#17610](https://github.com/databendlabs/databend/pull/17610)
* refactor(meta): upgrade OpenRaft to v0.10.0-alpha.9 by **@drmingdrmer** in [#17612](https://github.com/databendlabs/databend/pull/17612)
* refactor(query): refactor json functions by **@b41sh** in [#16840](https://github.com/databendlabs/databend/pull/16840)
* refactor(query): refactor test style by **@sundy-li** in [#17630](https://github.com/databendlabs/databend/pull/17630)
* refactor: Improved Hilbert Clustering with Range Partition by **@zhyass** in [#17424](https://github.com/databendlabs/databend/pull/17424)
* refactor: Unified query for hilbert and linear clustering information by **@zhyass** in [#17618](https://github.com/databendlabs/databend/pull/17618)
* refactor: optimize file reading for disk-based cache on Unix by **@dantengsky** in [#17638](https://github.com/databendlabs/databend/pull/17638)
* refactor(query): Optimizations for Variant type column filter by **@b41sh** in [#17646](https://github.com/databendlabs/databend/pull/17646)
* refactor(query): remove background service by **@zhang2014** in [#17659](https://github.com/databendlabs/databend/pull/17659)
* refactor: use `BlocksSerializer` to replace `StringBlock` to simplify the serialization by **@KKould** in [#17667](https://github.com/databendlabs/databend/pull/17667)
* refactor(optimizer): ir by **@BohuTANG** in [#17685](https://github.com/databendlabs/databend/pull/17685)
* refactor(planner): refine the file organization by **@BohuTANG** in [#17687](https://github.com/databendlabs/databend/pull/17687)
* refactor(optimizer): optimizer/operator by **@BohuTANG** in [#17689](https://github.com/databendlabs/databend/pull/17689)
* refactor(optimizer): optimizers by **@BohuTANG** in [#17692](https://github.com/databendlabs/databend/pull/17692)
* refactor(optimizer): optimizers by **@BohuTANG** in [#17697](https://github.com/databendlabs/databend/pull/17697)
* refactor(query):  rewrite function call expr to cast expr by **@forsaken628** in [#17669](https://github.com/databendlabs/databend/pull/17669)
* refactor(optimizer): optimize trait and pipeline by **@BohuTANG** in [#17712](https://github.com/databendlabs/databend/pull/17712)
* refactor: enhance copy from avro. by **@youngsofun** in [#17709](https://github.com/databendlabs/databend/pull/17709)
* refactor(optimizer): cascade by **@BohuTANG** in [#17714](https://github.com/databendlabs/databend/pull/17714)
* refactor(query): Introduces dedicated structs for expression types by **@forsaken628** in [#17719](https://github.com/databendlabs/databend/pull/17719)
* refactor: extract crate databendlabs/display-more to display various types by **@drmingdrmer** in [#17721](https://github.com/databendlabs/databend/pull/17721)
* refactor(optimizer): rules by **@BohuTANG** in [#17727](https://github.com/databendlabs/databend/pull/17727)
* refactor(optimizer): move rule/utils by **@BohuTANG** in [#17731](https://github.com/databendlabs/databend/pull/17731)
* refactor: use Weak ref to break cyclic references by **@drmingdrmer** in [#17743](https://github.com/databendlabs/databend/pull/17743)
* refactor(optimizer): refine hyper_dp/dphyp.rs by **@BohuTANG** in [#17753](https://github.com/databendlabs/databend/pull/17753)
* refactor(meta-client): Improve `MetaHandshakeError` by **@drmingdrmer** in [#17755](https://github.com/databendlabs/databend/pull/17755)
* refactor: Bump arrow-udf-runtime so that we can use new pyo3 by **@Xuanwo** in [#17758](https://github.com/databendlabs/databend/pull/17758)
* refactor: add helper methods to trait `LicenseManager` by **@dantengsky** in [#17761](https://github.com/databendlabs/databend/pull/17761)
* refactor: reduce `MetaClientError` by **@drmingdrmer** in [#17764](https://github.com/databendlabs/databend/pull/17764)
* refactor(optimizer): s_expr.rs by **@BohuTANG** in [#17767](https://github.com/databendlabs/databend/pull/17767)
* refactor: `DecimalSumState` overflow handling in SUM aggregation by **@dantengsky** in [#17773](https://github.com/databendlabs/databend/pull/17773)
* refactor(optimizer): refine the tpcds tests by **@BohuTANG** in [#17777](https://github.com/databendlabs/databend/pull/17777)
* refactor(query): Combining TransformSortMergeLimit, TransformSortMerge, and TransformSortSpill by **@forsaken628** in [#17762](https://github.com/databendlabs/databend/pull/17762)
* refactor: add `query_profile` and `query_details` persistent log tables by **@dqhl76** in [#17702](https://github.com/databendlabs/databend/pull/17702)
* refactor: Bump opendal to 0.53 for better metrics by **@Xuanwo** in [#17788](https://github.com/databendlabs/databend/pull/17788)
* refactor(fuse): runtime filter into two files: expr_bloom_filter.rs and expr_runtime_pruner.rs by **@BohuTANG** in [#17804](https://github.com/databendlabs/databend/pull/17804)
* refactor: move segment generation into TableMutationAggregator for MERGE INTO by **@zhyass** in [#17800](https://github.com/databendlabs/databend/pull/17800)
* refactor: upgrade min-meta-service-version to 1.2.677 by **@drmingdrmer** in [#17783](https://github.com/databendlabs/databend/pull/17783)
* refactor(query): auto generate virtual columns for variant column by **@b41sh** in [#17707](https://github.com/databendlabs/databend/pull/17707)
* refactor(query): remove unsafe implementation of Send and Sync for AcquireQueueGuard by **@drmingdrmer** in [#17818](https://github.com/databendlabs/databend/pull/17818)
### Build/Testing/CI Infra Changes 🔌
* ci: add workflow to publish deb repo by **@everpcpc** in [#17485](https://github.com/databendlabs/databend/pull/17485)
* ci: fix download deb packages by **@everpcpc** in [#17486](https://github.com/databendlabs/databend/pull/17486)
* ci: fix gpg key for deb distribution by **@everpcpc** in [#17487](https://github.com/databendlabs/databend/pull/17487)
* ci: add view sqlsmith test by **@TCeason** in [#17472](https://github.com/databendlabs/databend/pull/17472)
* ci: package meta & query deb separately by **@everpcpc** in [#17488](https://github.com/databendlabs/databend/pull/17488)
* ci: fix pack binaries by **@everpcpc** in [#17544](https://github.com/databendlabs/databend/pull/17544)
* ci: upgrade tj-actions/changed-files to v46 by **@everpcpc** in [#17613](https://github.com/databendlabs/databend/pull/17613)
* ci: fix flaky ttc test  by **@forsaken628** in [#17665](https://github.com/databendlabs/databend/pull/17665)
* ci: release target with hdfs by **@everpcpc** in [#17671](https://github.com/databendlabs/databend/pull/17671)
* ci: fix local benchmark artifact by **@everpcpc** in [#17674](https://github.com/databendlabs/databend/pull/17674)
* ci: add hadoop envs for query image by **@everpcpc** in [#17715](https://github.com/databendlabs/databend/pull/17715)
* ci: tmp disable local benchmark by **@everpcpc** in [#17717](https://github.com/databendlabs/databend/pull/17717)
* ci: fix local benchmark by **@everpcpc** in [#17718](https://github.com/databendlabs/databend/pull/17718)
* ci: fix archive benchmark result by **@everpcpc** in [#17754](https://github.com/databendlabs/databend/pull/17754)
* ci: fix test with ttc conainter by **@everpcpc** in [#17769](https://github.com/databendlabs/databend/pull/17769)
* ci: tmp disable test 20_0025_stackoverflow by **@everpcpc** in [#17770](https://github.com/databendlabs/databend/pull/17770)
* ci: fix start test container by **@everpcpc** in [#17772](https://github.com/databendlabs/databend/pull/17772)
* ci: fix build feature for benchmark by **@everpcpc** in [#17796](https://github.com/databendlabs/databend/pull/17796)
* ci: use larger runner for release by **@everpcpc** in [#17799](https://github.com/databendlabs/databend/pull/17799)
* ci: fix ttc test by **@everpcpc** in [#17807](https://github.com/databendlabs/databend/pull/17807)
### Others 📒
* chore(metrics): tune the histogram bucket for seconds/milliseconds by **@flaneur2020** in [#17197](https://github.com/databendlabs/databend/pull/17197)
* chore(ci): fix benchmark comment failure by **@zhang2014** in [#17470](https://github.com/databendlabs/databend/pull/17470)
* chore(query): add monotonicity function property by **@sundy-li** in [#17469](https://github.com/databendlabs/databend/pull/17469)
* chore(query): add placeholder parser by **@sundy-li** in [#17481](https://github.com/databendlabs/databend/pull/17481)
* chore(ci): fix benchmark comment failure by **@zhang2014** in [#17492](https://github.com/databendlabs/databend/pull/17492)
* chore: add more log info(like temp dir) for the vacuum temp files hook by **@BohuTANG** in [#17494](https://github.com/databendlabs/databend/pull/17494)
* chore(query): continue the vacuum query hook even aborted by **@sundy-li** in [#17497](https://github.com/databendlabs/databend/pull/17497)
* chore: Split metactl into lib meta/control and bin metactl by **@Xuanwo** in [#17496](https://github.com/databendlabs/databend/pull/17496)
* chore: modify license url by **@TCeason** in [#17513](https://github.com/databendlabs/databend/pull/17513)
* chore: refine some fuse_time_travel_size related logs by **@dantengsky** in [#17515](https://github.com/databendlabs/databend/pull/17515)
* chore(query): allow arrow dictionary array into databend by **@sundy-li** in [#17521](https://github.com/databendlabs/databend/pull/17521)
* chore(query): revert 17516 by **@zhang2014** in [#17539](https://github.com/databendlabs/databend/pull/17539)
* chore: rename `EvalExpireTime` to `Expirable` for better semantics by **@drmingdrmer** in [#17540](https://github.com/databendlabs/databend/pull/17540)
* chore(query): siphash support generic types by **@sundy-li** in [#17535](https://github.com/databendlabs/databend/pull/17535)
* chore(query): remove old sort spill by **@forsaken628** in [#17546](https://github.com/databendlabs/databend/pull/17546)
* chore: polish error message in `CommitSink` by **@dantengsky** in [#17558](https://github.com/databendlabs/databend/pull/17558)
* chore: reorganize meta service watcher module by **@drmingdrmer** in [#17557](https://github.com/databendlabs/databend/pull/17557)
* chore: add infer filter unit test by **@BohuTANG** in [#17574](https://github.com/databendlabs/databend/pull/17574)
* chore(optimizer): deduplicate_join_condition unit tests by **@BohuTANG** in [#17585](https://github.com/databendlabs/databend/pull/17585)
* chore: optimize sparse data read by **@zhyass** in [#17581](https://github.com/databendlabs/databend/pull/17581)
* chore(optimizer): normalize_disjunctive_filter unit test by **@BohuTANG** in [#17592](https://github.com/databendlabs/databend/pull/17592)
* chore(storage): add block file size by **@zhyass** in [#17580](https://github.com/databendlabs/databend/pull/17580)
* chore(query): add udf script configs by **@sundy-li** in [#17601](https://github.com/databendlabs/databend/pull/17601)
* chore(query): optimize show tables from iceberg catalog by **@TCeason** in [#17603](https://github.com/databendlabs/databend/pull/17603)
* chore(meta): add meta-meta compatibility chart svg by **@drmingdrmer** in [#17606](https://github.com/databendlabs/databend/pull/17606)
* chore(optimizer): add tpcds unit test for optimizer by **@BohuTANG** in [#17605](https://github.com/databendlabs/databend/pull/17605)
* chore: update cast.rs by **@eltociear** in [#17590](https://github.com/databendlabs/databend/pull/17590)
* chore(optimizer): snow_plan -&gt; good_plan by **@BohuTANG** in [#17611](https://github.com/databendlabs/databend/pull/17611)
* chore(cluster): remove useless debug log by **@zhang2014** in [#17614](https://github.com/databendlabs/databend/pull/17614)
* chore: optimize show tables with multi catalogs by **@TCeason** in [#17632](https://github.com/databendlabs/databend/pull/17632)
* chore: optimize building bloom index for null by **@zhyass** in [#17625](https://github.com/databendlabs/databend/pull/17625)
* chore: Add bendsave in release by **@Xuanwo** in [#17644](https://github.com/databendlabs/databend/pull/17644)
* chore: Make sure bendsave is built while releasing by **@Xuanwo** in [#17649](https://github.com/databendlabs/databend/pull/17649)
* chore: make error message when CTAS committing failed more user-friendly by **@SkyFan2002** in [#17645](https://github.com/databendlabs/databend/pull/17645)
* chore: calc rows per block for recluster by **@zhyass** in [#17639](https://github.com/databendlabs/databend/pull/17639)
* chore: missing column index for output columns in explain verbose by **@forsaken628** in [#17657](https://github.com/databendlabs/databend/pull/17657)
* chore(query): check schema mismatch in projection render result by **@sundy-li** in [#17654](https://github.com/databendlabs/databend/pull/17654)
* chore(query): add glob function by **@sundy-li** in [#17666](https://github.com/databendlabs/databend/pull/17666)
* chore(optimizer): add rule/push_down_filter_join unit test by **@BohuTANG** in [#17676](https://github.com/databendlabs/databend/pull/17676)
* chore: Always print detailed error from opendal by **@Xuanwo** in [#17681](https://github.com/databendlabs/databend/pull/17681)
* chore: use default encoding of parquet columns instead of plain. by **@youngsofun** in [#17688](https://github.com/databendlabs/databend/pull/17688)
* chore(query): Making Column Debug more readable by **@forsaken628** in [#17690](https://github.com/databendlabs/databend/pull/17690)
* chore(query): add cache id for distribute scheduler by **@zhang2014** in [#17708](https://github.com/databendlabs/databend/pull/17708)
* chore: optimize select name from system.tables by **@TCeason** in [#17700](https://github.com/databendlabs/databend/pull/17700)
* chore(query): allow group by constant literal by **@sundy-li** in [#17711](https://github.com/databendlabs/databend/pull/17711)
* chore: minor refine on RoleMgr by **@drmingdrmer** in [#17683](https://github.com/databendlabs/databend/pull/17683)
* chore(query): Optimize cast expr error display by **@forsaken628** in [#17710](https://github.com/databendlabs/databend/pull/17710)
* chore: show file path when copy meet invalid parquet file. by **@youngsofun** in [#17716](https://github.com/databendlabs/databend/pull/17716)
* chore: impl Display for WatchResponse and related pb types by **@drmingdrmer** in [#17725](https://github.com/databendlabs/databend/pull/17725)
* chore: add local build databend package by **@wubx** in [#17737](https://github.com/databendlabs/databend/pull/17737)
* chore(query): delete no useful function epoch(Int64Type)-&gt;IntervalType by **@TCeason** in [#17730](https://github.com/databendlabs/databend/pull/17730)
* chore: use Usage privilege optimize USEDB Plan by **@TCeason** in [#17679](https://github.com/databendlabs/databend/pull/17679)
* chore(logger): upgrade logforth to support global max_files limit for log_dir by **@BohuTANG** in [#17637](https://github.com/databendlabs/databend/pull/17637)
* chore: increase the concurrency of fuse_time_travel_size by **@SkyFan2002** in [#17745](https://github.com/databendlabs/databend/pull/17745)
* chore: Using an ordered BTreeSet instead of a HashSet as a ColumnSet implementation by **@forsaken628** in [#17747](https://github.com/databendlabs/databend/pull/17747)
* chore: Bump rust toolchain by **@Xuanwo** in [#17751](https://github.com/databendlabs/databend/pull/17751)
* chore: Bump Rust toolchain to nightly-2025-04-04 by **@Xuanwo** in [#17752](https://github.com/databendlabs/databend/pull/17752)
* chore: show file path when copy decompress fail. by **@youngsofun** in [#17732](https://github.com/databendlabs/databend/pull/17732)
* chore: check ee license for disk cache by **@dantengsky** in [#17749](https://github.com/databendlabs/databend/pull/17749)
* chore: upgrade outdated dependencies  by **@forsaken628** in [#17776](https://github.com/databendlabs/databend/pull/17776)
* chore(optimizer): spill out statistics yaml in tpcds_test by **@BohuTANG** in [#17784](https://github.com/databendlabs/databend/pull/17784)
* chore(query): add iceberg table metadata cache by **@sundy-li** in [#17780](https://github.com/databendlabs/databend/pull/17780)
* chore(ci): remove hdfs from docker image by **@everpcpc** in [#17786](https://github.com/databendlabs/databend/pull/17786)
* chore: bump jsonb 0.5.0 by **@b41sh** in [#17698](https://github.com/databendlabs/databend/pull/17698)
* chore: refine error handling in persistent log table by **@dqhl76** in [#17792](https://github.com/databendlabs/databend/pull/17792)
* chore(ci): change the sccache log level to debug by **@forsaken628** in [#17790](https://github.com/databendlabs/databend/pull/17790)
* chore: Extracting `databend_common_version` to help improve compilation cache hit rate by **@forsaken628** in [#17801](https://github.com/databendlabs/databend/pull/17801)
* chore: make `databend_common_expression` compilation cacheable by **@forsaken628** in [#17806](https://github.com/databendlabs/databend/pull/17806)
* chore(ci): add ci test_stateless_cluster_linux timeout minute to 18 by **@TCeason** in [#17813](https://github.com/databendlabs/databend/pull/17813)

## New Contributors
* **@KKould** made their first contribution in [#17505](https://github.com/databendlabs/databend/pull/17505)
* **@eltociear** made their first contribution in [#17590](https://github.com/databendlabs/databend/pull/17590)

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.725

</StepContent>

</StepsWrap> 
