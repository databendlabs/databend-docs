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

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.882-nightly" number="-1" defaultCollapsed={false}>

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

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.881-nightly" number="" defaultCollapsed={false}>

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

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.862-nightly" number="" defaultCollapsed={true}>

## Dec 29, 2025 (v1.2.862-nightly)

## What's Changed
### Exciting New Features ✨
* feat: clustering_statistics support specify snapshot by **@zhyass** in [#19148](https://github.com/databendlabs/databend/pull/19148)
* feat(query): Enhanced Inverted Index for VARIANT Type to precise matching Object within Arrays by **@b41sh** in [#19096](https://github.com/databendlabs/databend/pull/19096)
### Thoughtful Bug Fix 🔧
* fix: allow credential chain for system_history tables by **@dqhl76** in [#19167](https://github.com/databendlabs/databend/pull/19167)
### Code Refactor 🎉
* refactor(query): use unchecked utf8 for payload flush by **@zhang2014** in [#19159](https://github.com/databendlabs/databend/pull/19159)
* refactor: prioritize table options for retention policy by **@dantengsky** in [#19162](https://github.com/databendlabs/databend/pull/19162)
* refactor(query): send runtime filter packets as data blocks by **@zhang2014** in [#19170](https://github.com/databendlabs/databend/pull/19170)
* refactor(query): streamline flight exchange coordination by **@zhang2014** in [#19175](https://github.com/databendlabs/databend/pull/19175)
### Build/Testing/CI Infra Changes 🔌
* ci: upgrade llvm in build-tool image by **@everpcpc** in [#19166](https://github.com/databendlabs/databend/pull/19166)
* ci: install missing packages by **@everpcpc** in [#19171](https://github.com/databendlabs/databend/pull/19171)
* ci: enable unit test by **@everpcpc** in [#19172](https://github.com/databendlabs/databend/pull/19172)
* ci: update unit test. by **@youngsofun** in [#19168](https://github.com/databendlabs/databend/pull/19168)
### Others 📒
* chore: ndv upper cutoff by **@forsaken628** in [#19133](https://github.com/databendlabs/databend/pull/19133)
* chore(query): add stats for new final aggregators by **@dqhl76** in [#19156](https://github.com/databendlabs/databend/pull/19156)
* chore(query): add probe rows log for hash join by **@zhang2014** in [#19165](https://github.com/databendlabs/databend/pull/19165)
* chore: Date/Time elements are used in AggregateDistinct in numerical form, reducing the memory usage of the Set. by **@KKould** in [#19157](https://github.com/databendlabs/databend/pull/19157)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.862-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.861-nightly" number="" defaultCollapsed={true}>

## Dec 25, 2025 (v1.2.861-nightly)

## What's Changed
### Exciting New Features ✨
* feat(storage): organize storage credential configs for security by **@BohuTANG** in [#19147](https://github.com/databendlabs/databend/pull/19147)
### Thoughtful Bug Fix 🔧
* fix(query): fix fragment not found in warehouse level table by **@zhang2014** in [#19152](https://github.com/databendlabs/databend/pull/19152)
* fix: recluster final infinite loop by **@zhyass** in [#19151](https://github.com/databendlabs/databend/pull/19151)
### Others 📒
* chore(query): revert "fix(query): update opendal (#19110)" by **@zhang2014** in [#19146](https://github.com/databendlabs/databend/pull/19146)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.861-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.860-nightly" number="" defaultCollapsed={true}>

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

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.859-nightly" number="" defaultCollapsed={true}>

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

</StepsWrap> 
