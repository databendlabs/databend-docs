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

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.848-nightly" number="-1" defaultCollapsed={false}>

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

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.847-nightly" number="" defaultCollapsed={false}>

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

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.830-nightly" number="" defaultCollapsed={true}>

## Oct 20, 2025 (v1.2.830-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): Inverted index support search Variant inner fields by **@b41sh** in [#18861](https://github.com/databendlabs/databend/pull/18861)
### Thoughtful Bug Fix 🔧
* fix: config rename for file logging max_size by **@everpcpc** in [#18772](https://github.com/databendlabs/databend/pull/18772)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.830-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.829-nightly" number="" defaultCollapsed={true}>

## Oct 20, 2025 (v1.2.829-nightly)

## What's Changed
### Exciting New Features ✨
* feat: implement irreversible vacuum drop table protection by **@dantengsky** in [#18809](https://github.com/databendlabs/databend/pull/18809)
* feat(query): Show Statistics add Virtual Column Stats and Min/Max Fields by **@b41sh** in [#18849](https://github.com/databendlabs/databend/pull/18849)
* feat: meta: add I/O timing tracking for log entry application by **@drmingdrmer** in [#18854](https://github.com/databendlabs/databend/pull/18854)
* feat: meta: add detailed version output for databend-meta -V by **@drmingdrmer** in [#18856](https://github.com/databendlabs/databend/pull/18856)
* feat: add isnan and isinf functions for float types by **@RiversJin** in [#18858](https://github.com/databendlabs/databend/pull/18858)
* feat: metactl: add dump-raft-log-wal subcommand by **@drmingdrmer** in [#18865](https://github.com/databendlabs/databend/pull/18865)
### Thoughtful Bug Fix 🔧
* fix(query): optimize JWT key lookup to avoid unnecessary JWKS refresh by **@everpcpc** in [#18845](https://github.com/databendlabs/databend/pull/18845)
* fix(query): NULL constraint checking in column modification by **@TCeason** in [#18855](https://github.com/databendlabs/databend/pull/18855)
### Others 📒
* chore(storage): merge_io_reader passes through `opendal::Buffer` and no longer copies by **@forsaken628** in [#18840](https://github.com/databendlabs/databend/pull/18840)
* chore: upgrade openraft from from v0.10.0-alpha.9 to v0.10.0-alpha.11 by **@drmingdrmer** in [#18862](https://github.com/databendlabs/databend/pull/18862)
* chore: upgrade raft-log and display-more by **@drmingdrmer** in [#18864](https://github.com/databendlabs/databend/pull/18864)

## New Contributors
* **@RiversJin** made their first contribution in [#18858](https://github.com/databendlabs/databend/pull/18858)

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.829-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.828-nightly" number="" defaultCollapsed={true}>

## Oct 16, 2025 (v1.2.828-nightly)

## What's Changed
### Exciting New Features ✨
* feat: support optional arg name for create function by **@KKould** in [#18848](https://github.com/databendlabs/databend/pull/18848)
### Thoughtful Bug Fix 🔧
* fix: use compile-time cfg for platform-specific DMA flags by **@drmingdrmer** in [#18846](https://github.com/databendlabs/databend/pull/18846)
* fix: pipeline max_threads should use max width of Pipes. by **@youngsofun** in [#18837](https://github.com/databendlabs/databend/pull/18837)
### Code Refactor 🎉
* refactor: meta: unify FetchAddU64 into FetchIncreaseU64 by **@drmingdrmer** in [#18847](https://github.com/databendlabs/databend/pull/18847)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.828-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.827-nightly" number="" defaultCollapsed={true}>

## Oct 16, 2025 (v1.2.827-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): introduce BackpressureSpiller by **@forsaken628** in [#18802](https://github.com/databendlabs/databend/pull/18802)
* feat: External UDF support STAGE_LOCATION param by **@KKould** in [#18833](https://github.com/databendlabs/databend/pull/18833)
### Thoughtful Bug Fix 🔧
* fix: deserialize parquet error when stream's base table modify column type by **@zhyass** in [#18828](https://github.com/databendlabs/databend/pull/18828)
### Code Refactor 🎉
* refactor: meta-client: consolidate RPC timing into RpcHandler by **@drmingdrmer** in [#18832](https://github.com/databendlabs/databend/pull/18832)
* refactor: clarify the HTTP query lifecycle. by **@youngsofun** in [#18787](https://github.com/databendlabs/databend/pull/18787)
* refactor: simplify mask policy storage structure by **@TCeason** in [#18836](https://github.com/databendlabs/databend/pull/18836)
### Others 📒
* chore: reduce log in update_multi_table_meta by **@SkyFan2002** in [#18844](https://github.com/databendlabs/databend/pull/18844)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.827-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.826-nightly" number="" defaultCollapsed={true}>

## Oct 13, 2025 (v1.2.826-nightly)

## What's Changed
### Thoughtful Bug Fix 🔧
* fix: copy from CSV OOM when file is large. by **@youngsofun** in [#18830](https://github.com/databendlabs/databend/pull/18830)
### Others 📒
* chore: fix some meta typo by **@forsaken628** in [#18824](https://github.com/databendlabs/databend/pull/18824)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.826-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.825-nightly" number="" defaultCollapsed={true}>

## Oct 13, 2025 (v1.2.825-nightly)

## What's Changed
### Exciting New Features ✨
* feat: impl INNER/LEFT/RIGHT ANY JOIN by **@KKould** in [#18779](https://github.com/databendlabs/databend/pull/18779)
### Others 📒
* chore(query): add ruff toml file by **@sundy-li** in [#18823](https://github.com/databendlabs/databend/pull/18823)
* chore(query): constant folder support exclusive check by **@sundy-li** in [#18822](https://github.com/databendlabs/databend/pull/18822)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.825-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.824-nightly" number="" defaultCollapsed={true}>

## Oct 9, 2025 (v1.2.824-nightly)

## What's Changed
### Code Refactor 🎉
* refactor(query): add left join for experimental new hash join by **@zhang2014** in [#18814](https://github.com/databendlabs/databend/pull/18814)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.824-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.823-nightly" number="" defaultCollapsed={true}>

## Oct 6, 2025 (v1.2.823-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): decouple row access policy argument names from column names by **@TCeason** in [#18799](https://github.com/databendlabs/databend/pull/18799)
* feat: meta-service: add snapshot keys layout API with depth filtering by **@drmingdrmer** in [#18807](https://github.com/databendlabs/databend/pull/18807)
* feat(query): add copy_history table by **@sundy-li** in [#18806](https://github.com/databendlabs/databend/pull/18806)
* feat(query): Generate column statistics for virtual columns by **@b41sh** in [#18801](https://github.com/databendlabs/databend/pull/18801)
* feat: meta-service: add `proposed_at` tracking the time when a key is written by **@drmingdrmer** in [#18812](https://github.com/databendlabs/databend/pull/18812)
### Thoughtful Bug Fix 🔧
* fix(query): handle database ID properly in columns table permission check by **@TCeason** in [#18798](https://github.com/databendlabs/databend/pull/18798)
* fix: invalid sequence step by **@KKould** in [#18800](https://github.com/databendlabs/databend/pull/18800)
* fix(meta): use transaction instead of direct request for UpsertKV by **@drmingdrmer** in [#18813](https://github.com/databendlabs/databend/pull/18813)
### Code Refactor 🎉
* refactor(user): redesign ALTER USER implementation with improved API consistency by **@TCeason** in [#18804](https://github.com/databendlabs/databend/pull/18804)
* refactor(query): add new experimental hash join for inner join by **@zhang2014** in [#18783](https://github.com/databendlabs/databend/pull/18783)
* refactor(meta): extract TableMeta operations to dedicated ops module by **@drmingdrmer** in [#18816](https://github.com/databendlabs/databend/pull/18816)
* refactor: extract table identifier types to ident.rs by **@drmingdrmer** in [#18817](https://github.com/databendlabs/databend/pull/18817)
* refactor(meta): move get_db_id_or_err to DatabaseApi with nested Result by **@drmingdrmer** in [#18818](https://github.com/databendlabs/databend/pull/18818)
* refactor(meta): simplify stream metrics collection with Drop pattern by **@drmingdrmer** in [#18820](https://github.com/databendlabs/databend/pull/18820)
### Others 📒
* chore: log more info on jwks refresh by **@everpcpc** in [#18803](https://github.com/databendlabs/databend/pull/18803)
* chore: refine stream http api test by **@dantengsky** in [#18810](https://github.com/databendlabs/databend/pull/18810)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.823-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.822-nightly" number="" defaultCollapsed={true}>

## Sep 29, 2025 (v1.2.822-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): RoleInfo support comment by **@TCeason** in [#18788](https://github.com/databendlabs/databend/pull/18788)
### Thoughtful Bug Fix 🔧
* fix: prevent panic in multi-table insert commit by **@SkyFan2002** in [#18793](https://github.com/databendlabs/databend/pull/18793)
* fix: remove incorrect assertion in collecting dropped table ids by **@dantengsky** in [#18780](https://github.com/databendlabs/databend/pull/18780)
* fix: forbid SRF in copy transform. by **@youngsofun** in [#18795](https://github.com/databendlabs/databend/pull/18795)
### Build/Testing/CI Infra Changes 🔌
* ci: fix publish debug symbols by **@everpcpc** in [#18796](https://github.com/databendlabs/databend/pull/18796)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.822-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.821-nightly" number="" defaultCollapsed={true}>

## Sep 28, 2025 (v1.2.821-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): pivot support any order by expression by **@sundy-li** in [#18770](https://github.com/databendlabs/databend/pull/18770)
* feat(query): enable swap between tables by **@TCeason** in [#18767](https://github.com/databendlabs/databend/pull/18767)
* feat: impl Keyword `AUTOINCREMENT` by **@KKould** in [#18715](https://github.com/databendlabs/databend/pull/18715)
* feat: enable analyze hook after DML by **@zhyass** in [#18754](https://github.com/databendlabs/databend/pull/18754)
### Thoughtful Bug Fix 🔧
* fix: /v1/status return  stop time without start time.  by **@youngsofun** in [#18792](https://github.com/databendlabs/databend/pull/18792)
### Build/Testing/CI Infra Changes 🔌
* ci: publish debug symbols to R2 by **@everpcpc** in [#18784](https://github.com/databendlabs/databend/pull/18784)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.821-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.820-nightly" number="" defaultCollapsed={true}>

## Sep 25, 2025 (v1.2.820-nightly)

## What's Changed
### Exciting New Features ✨
* feat: /v1/status merge status of HttpQueryManager. by **@youngsofun** in [#18778](https://github.com/databendlabs/databend/pull/18778)
### Thoughtful Bug Fix 🔧
* fix: the result of the first parameter of `eval_or_filters` will affect the subsequent parameters by **@KKould** in [#18782](https://github.com/databendlabs/databend/pull/18782)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.820-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.819-nightly" number="" defaultCollapsed={true}>

## Sep 25, 2025 (v1.2.819-nightly)

## What's Changed
### Thoughtful Bug Fix 🔧
* fix: clean up temp table with external location by **@SkyFan2002** in [#18775](https://github.com/databendlabs/databend/pull/18775)
### Code Refactor 🎉
* refactor(meta-service): move raft to separate runtime by **@drmingdrmer** in [#18777](https://github.com/databendlabs/databend/pull/18777)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.819-nightly

</StepContent>

</StepsWrap> 
