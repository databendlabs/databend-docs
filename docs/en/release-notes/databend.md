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

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.831-nightly" number="-1" defaultCollapsed={false}>

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

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.830-nightly" number="" defaultCollapsed={false}>

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

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.818-nightly" number="" defaultCollapsed={true}>

## Sep 24, 2025 (v1.2.818-nightly)

## What's Changed
### Exciting New Features ✨
* feat(meta): add member-list subcommand to databend-metactl by **@drmingdrmer** in [#18760](https://github.com/databendlabs/databend/pull/18760)
* feat(meta-service): add snapshot V004 streaming protocol by **@drmingdrmer** in [#18763](https://github.com/databendlabs/databend/pull/18763)
### Thoughtful Bug Fix 🔧
* fix: auto commit of ddl not work when calling procedure in transaction by **@SkyFan2002** in [#18753](https://github.com/databendlabs/databend/pull/18753)
* fix: vacuum tables that are dropped by `create or replace` statement by **@dantengsky** in [#18751](https://github.com/databendlabs/databend/pull/18751)
* fix(query): fix data lost caused by nullable in spill by **@zhang2014** in [#18766](https://github.com/databendlabs/databend/pull/18766)
### Code Refactor 🎉
* refactor(query):  improve the readability of aggregate function hash table by **@forsaken628** in [#18747](https://github.com/databendlabs/databend/pull/18747)
* refactor(query): Optimize Virtual Column Write Performance by **@b41sh** in [#18752](https://github.com/databendlabs/databend/pull/18752)
### Others 📒
* chore: resolve post-merge compilation failure after KvApi refactoring by **@dantengsky** in [#18761](https://github.com/databendlabs/databend/pull/18761)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.818-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.817-nightly" number="" defaultCollapsed={true}>

## Sep 22, 2025 (v1.2.817-nightly)

## What's Changed
### Exciting New Features ✨
* feat: databend-metabench: benchmark list by **@drmingdrmer** in [#18745](https://github.com/databendlabs/databend/pull/18745)
* feat: /v1/status include last_query_request_at. by **@youngsofun** in [#18750](https://github.com/databendlabs/databend/pull/18750)
### Thoughtful Bug Fix 🔧
* fix: query dropped table in fuse_time_travel_size() report error by **@SkyFan2002** in [#18748](https://github.com/databendlabs/databend/pull/18748)
### Code Refactor 🎉
* refactor(meta-service): separate raft-log-store and raft-state-machine store by **@drmingdrmer** in [#18746](https://github.com/databendlabs/databend/pull/18746)
* refactor: meta-service: simplify raft store and state machine by **@drmingdrmer** in [#18749](https://github.com/databendlabs/databend/pull/18749)
* refactor(query): stream style block writer for hash join spill by **@zhang2014** in [#18742](https://github.com/databendlabs/databend/pull/18742)
* refactor(native): preallocate zero offsets before compression by **@BohuTANG** in [#18756](https://github.com/databendlabs/databend/pull/18756)
* refactor: meta-service: compact immutable levels periodically by **@drmingdrmer** in [#18757](https://github.com/databendlabs/databend/pull/18757)
* refactor(query): add async buffer for spill data by **@zhang2014** in [#18758](https://github.com/databendlabs/databend/pull/18758)
### Build/Testing/CI Infra Changes 🔌
* ci: add compat test for databend-go. by **@youngsofun** in [#18734](https://github.com/databendlabs/databend/pull/18734)
### Others 📒
* chore: move auto implemented KvApi methods to Ext trait by **@drmingdrmer** in [#18759](https://github.com/databendlabs/databend/pull/18759)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.817-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.816-nightly" number="" defaultCollapsed={true}>

## Sep 19, 2025 (v1.2.816-nightly)

## What's Changed
### Exciting New Features ✨
* feat(rbac): procedure object support rbac by **@TCeason** in [#18730](https://github.com/databendlabs/databend/pull/18730)
### Thoughtful Bug Fix 🔧
* fix(query): reduce redundant result-set-spill logs during query waits by **@BohuTANG** in [#18741](https://github.com/databendlabs/databend/pull/18741)
* fix: fuse_vacuum2 panic while vauuming empty table with data_retentio… by **@dantengsky** in [#18744](https://github.com/databendlabs/databend/pull/18744)
### Code Refactor 🎉
* refactor: compactor internal structure by **@drmingdrmer** in [#18738](https://github.com/databendlabs/databend/pull/18738)
* refactor(query): refactor the join partition to reduce memory amplification by **@zhang2014** in [#18732](https://github.com/databendlabs/databend/pull/18732)
* refactor: Make the ownership key deletion and table/database replace in the same transaction by **@TCeason** in [#18739](https://github.com/databendlabs/databend/pull/18739)
### Others 📒
* chore(meta-service): re-organize tests for raft-store by **@drmingdrmer** in [#18740](https://github.com/databendlabs/databend/pull/18740)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.816-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.815-nightly" number="" defaultCollapsed={true}>

## Sep 18, 2025 (v1.2.815-nightly)

## What's Changed
### Exciting New Features ✨
* feat: add ANY_VALUE as alias for ANY aggregate function by **@BohuTANG** in [#18728](https://github.com/databendlabs/databend/pull/18728)
* feat: add Immutable::compact to merge two level by **@drmingdrmer** in [#18731](https://github.com/databendlabs/databend/pull/18731)
### Thoughtful Bug Fix 🔧
* fix: last query id not only contain those cached. by **@youngsofun** in [#18727](https://github.com/databendlabs/databend/pull/18727)
### Code Refactor 🎉
* refactor: raft-store: in-memory readonly level compaction by **@drmingdrmer** in [#18736](https://github.com/databendlabs/databend/pull/18736)
* refactor: new setting `max_vacuum_threads` by **@dantengsky** in [#18737](https://github.com/databendlabs/databend/pull/18737)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.815-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.814-nightly" number="" defaultCollapsed={true}>

## Sep 17, 2025 (v1.2.814-nightly)

## What's Changed
### Thoughtful Bug Fix 🔧
* fix(query): ensure jwt roles to user if not exists by **@everpcpc** in [#18720](https://github.com/databendlabs/databend/pull/18720)
* fix(query): Set Parquet default encoding to `PLAIN` to ensure data compatibility by **@b41sh** in [#18724](https://github.com/databendlabs/databend/pull/18724)
### Others 📒
* chore: replace Arc&lt;Mutex&lt;SysData&gt;&gt; with SysData by **@drmingdrmer** in [#18723](https://github.com/databendlabs/databend/pull/18723)
* chore: add error check on private task test script by **@KKould** in [#18698](https://github.com/databendlabs/databend/pull/18698)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.814-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.813-nightly" number="" defaultCollapsed={true}>

## Sep 16, 2025 (v1.2.813-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): support result set spilling by **@forsaken628** in [#18679](https://github.com/databendlabs/databend/pull/18679)
### Thoughtful Bug Fix 🔧
* fix(meta-service): detach the SysData to avoid race condition by **@drmingdrmer** in [#18722](https://github.com/databendlabs/databend/pull/18722)
### Code Refactor 🎉
* refactor(raft-store): update trait interfaces and restructure leveled map by **@drmingdrmer** in [#18719](https://github.com/databendlabs/databend/pull/18719)
### Documentation 📔
* docs(raft-store): enhance documentation across all modules by **@drmingdrmer** in [#18721](https://github.com/databendlabs/databend/pull/18721)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.813-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.812-nightly" number="" defaultCollapsed={true}>

## Sep 15, 2025 (v1.2.812-nightly)

## What's Changed
### Exciting New Features ✨
* feat: `infer_schema` expands csv and ndjson support by **@KKould** in [#18552](https://github.com/databendlabs/databend/pull/18552)
### Thoughtful Bug Fix 🔧
* fix(query): column default expr should not cause seq.nextval modify by **@b41sh** in [#18694](https://github.com/databendlabs/databend/pull/18694)
* fix: `vacuum2` all should ignore SYSTEM dbs by **@dantengsky** in [#18712](https://github.com/databendlabs/databend/pull/18712)
* fix(meta-service): snapshot key count should be reset by **@drmingdrmer** in [#18718](https://github.com/databendlabs/databend/pull/18718)
### Code Refactor 🎉
* refactor(meta-service): respond mget items in stream instead of in a vector by **@drmingdrmer** in [#18716](https://github.com/databendlabs/databend/pull/18716)
* refactor(meta-service0): rotbl: use `spawn_blocking()` instead `blocking_in_place()` by **@drmingdrmer** in [#18717](https://github.com/databendlabs/databend/pull/18717)
### Build/Testing/CI Infra Changes 🔌
* ci: migration `09_http_handler`  to pytest by **@forsaken628** in [#18714](https://github.com/databendlabs/databend/pull/18714)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.812-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.811-nightly" number="" defaultCollapsed={true}>

## Sep 11, 2025 (v1.2.811-nightly)

## What's Changed
### Thoughtful Bug Fix 🔧
* fix: error occurred when retrying transaction on empty table by **@SkyFan2002** in [#18703](https://github.com/databendlabs/databend/pull/18703)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.811-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.810-nightly" number="" defaultCollapsed={true}>

## Sep 10, 2025 (v1.2.810-nightly)

## What's Changed
### Exciting New Features ✨
* feat: impl Date & Timestamp on `RANGE BETWEEN` by **@KKould** in [#18696](https://github.com/databendlabs/databend/pull/18696)
* feat: add pybend Python binding with S3 connection and stage support by **@BohuTANG** in [#18704](https://github.com/databendlabs/databend/pull/18704)
* feat(query): add api to list stream by **@everpcpc** in [#18701](https://github.com/databendlabs/databend/pull/18701)
### Thoughtful Bug Fix 🔧
* fix: collected profiles lost in cluster mode by **@dqhl76** in [#18680](https://github.com/databendlabs/databend/pull/18680)
* fix(python-binding): complete Python binding CI configuration by **@BohuTANG** in [#18686](https://github.com/databendlabs/databend/pull/18686)
* fix(python-binding): resolve virtual environment permission conflicts in CI by **@BohuTANG** in [#18708](https://github.com/databendlabs/databend/pull/18708)
* fix: error when using materialized CTE in multi-statement transactions by **@SkyFan2002** in [#18707](https://github.com/databendlabs/databend/pull/18707)
* fix(query): add config to the embed mode to clarify this mode by **@zhang2014** in [#18710](https://github.com/databendlabs/databend/pull/18710)
### Build/Testing/CI Infra Changes 🔌
* ci: run behave test of bendsql for compact. by **@youngsofun** in [#18697](https://github.com/databendlabs/databend/pull/18697)
* ci: Temporarily disable warehouse testing of private tasks by **@KKould** in [#18709](https://github.com/databendlabs/databend/pull/18709)
### Others 📒
* chore(python-binding): documentation and PyPI metadata by **@BohuTANG** in [#18711](https://github.com/databendlabs/databend/pull/18711)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.810-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.809-nightly" number="" defaultCollapsed={true}>

## Sep 8, 2025 (v1.2.809-nightly)

## What's Changed
### Exciting New Features ✨
* feat: support reset of worksheet session. by **@youngsofun** in [#18688](https://github.com/databendlabs/databend/pull/18688)
### Thoughtful Bug Fix 🔧
* fix(query): fix unable cast Variant Nullable type to Int32 type in MERGE INTO by **@b41sh** in [#18687](https://github.com/databendlabs/databend/pull/18687)
* fix: meta-semaphore: re-connect when no event recevied by **@drmingdrmer** in [#18690](https://github.com/databendlabs/databend/pull/18690)
### Code Refactor 🎉
* refactor(meta-semaphore): handle error occurs during new-stream, lease-extend by **@drmingdrmer** in [#18695](https://github.com/databendlabs/databend/pull/18695)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.809-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.808-nightly" number="" defaultCollapsed={true}>

## Sep 8, 2025 (v1.2.808-nightly)

## What's Changed
### Exciting New Features ✨
* feat: support Check Constraint by **@KKould** in [#18661](https://github.com/databendlabs/databend/pull/18661)
* feat(parser): add intelligent SQL error suggestion system by **@BohuTANG** in [#18670](https://github.com/databendlabs/databend/pull/18670)
* feat: enhance resource scheduling logs with clear status and configuration details by **@BohuTANG** in [#18684](https://github.com/databendlabs/databend/pull/18684)
* feat(meta-semaphore): allows to specify timestamp as semaphore seq by **@drmingdrmer** in [#18685](https://github.com/databendlabs/databend/pull/18685)
### Thoughtful Bug Fix 🔧
* fix: clean `db_id_table_name` during vacuuming dropped tables by **@dantengsky** in [#18665](https://github.com/databendlabs/databend/pull/18665)
* fix: forbid transform with where clause. by **@youngsofun** in [#18681](https://github.com/databendlabs/databend/pull/18681)
* fix(query): fix incorrect order of group by items with CTE or subquery by **@sundy-li** in [#18692](https://github.com/databendlabs/databend/pull/18692)
### Code Refactor 🎉
* refactor(meta): extract utilities from monolithic util.rs by **@drmingdrmer** in [#18678](https://github.com/databendlabs/databend/pull/18678)
* refactor(query): split Spiller to provide more scalability by **@forsaken628** in [#18691](https://github.com/databendlabs/databend/pull/18691)
### Build/Testing/CI Infra Changes 🔌
* ci: compat test for JDBC use test from main. by **@youngsofun** in [#18668](https://github.com/databendlabs/databend/pull/18668)
### Others 📒
* chore: add test about create sequence to keep old version by **@TCeason** in [#18673](https://github.com/databendlabs/databend/pull/18673)
* chore: add some log for runtime filter by **@SkyFan2002** in [#18674](https://github.com/databendlabs/databend/pull/18674)
* chore: add profile for runtime filter by **@SkyFan2002** in [#18675](https://github.com/databendlabs/databend/pull/18675)
* chore: catch `to_date`/`to_timestamp` unwrap by **@KKould** in [#18677](https://github.com/databendlabs/databend/pull/18677)
* chore(query): add retry for semaphore queue by **@zhang2014** in [#18689](https://github.com/databendlabs/databend/pull/18689)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.808-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.807-nightly" number="" defaultCollapsed={true}>

## Sep 3, 2025 (v1.2.807-nightly)

## What's Changed
### Exciting New Features ✨
* feat(query): Add SecureFilter for Row Access Policies and Stats Privacy by **@TCeason** in [#18623](https://github.com/databendlabs/databend/pull/18623)
* feat(query): support `start` and `increment` options for sequence creation by **@TCeason** in [#18659](https://github.com/databendlabs/databend/pull/18659)
### Thoughtful Bug Fix 🔧
* fix(rbac): create or replace ownership_object should delete the old ownership key by **@TCeason** in [#18667](https://github.com/databendlabs/databend/pull/18667)
* fix(history-table): stop heartbeat when another node starts by **@dqhl76** in [#18664](https://github.com/databendlabs/databend/pull/18664)
### Code Refactor 🎉
* refactor: extract garbage collection api to garbage_collection_api.rs by **@drmingdrmer** in [#18663](https://github.com/databendlabs/databend/pull/18663)
* refactor(meta): complete SchemaApi trait decomposition by **@drmingdrmer** in [#18669](https://github.com/databendlabs/databend/pull/18669)
### Others 📒
* chore: enable distributed recluster  by **@zhyass** in [#18644](https://github.com/databendlabs/databend/pull/18644)
* chore(ci): make ci success by **@TCeason** in [#18672](https://github.com/databendlabs/databend/pull/18672)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.807-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.806-nightly" number="" defaultCollapsed={true}>

## Sep 2, 2025 (v1.2.806-nightly)

## What's Changed
### Thoughtful Bug Fix 🔧
* fix(query): try fix hang for cluster aggregate by **@zhang2014** in [#18655](https://github.com/databendlabs/databend/pull/18655)
### Code Refactor 🎉
* refactor(schema-api): extract SecurityApi trait by **@drmingdrmer** in [#18658](https://github.com/databendlabs/databend/pull/18658)
* refactor(query): remove useless ee feature by **@zhang2014** in [#18660](https://github.com/databendlabs/databend/pull/18660)
### Build/Testing/CI Infra Changes 🔌
* ci: fix download artifact for sqlsmith by **@everpcpc** in [#18662](https://github.com/databendlabs/databend/pull/18662)
* ci: ttc test with nginx and minio. by **@youngsofun** in [#18657](https://github.com/databendlabs/databend/pull/18657)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.806-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.805-nightly" number="" defaultCollapsed={true}>

## Sep 1, 2025 (v1.2.805-nightly)

## What's Changed
### Exciting New Features ✨
* feat: Add `RuleFilterFlattenOr` by **@KKould** in [#18621](https://github.com/databendlabs/databend/pull/18621)
* feat: add settings to control analyze table by **@zhyass** in [#18642](https://github.com/databendlabs/databend/pull/18642)
### Code Refactor 🎉
* refactor: refactor inlist runtime filter with  or_filters and add configurable runtime filter thresholds by **@SkyFan2002** in [#18622](https://github.com/databendlabs/databend/pull/18622)
* refactor(schema-api): extract CatalogApi trait from SchemaApi by **@drmingdrmer** in [#18654](https://github.com/databendlabs/databend/pull/18654)
### Build/Testing/CI Infra Changes 🔌
* ci: extract action for minio. by **@youngsofun** in [#18651](https://github.com/databendlabs/databend/pull/18651)
* ci: fix install nfpm by **@everpcpc** in [#18656](https://github.com/databendlabs/databend/pull/18656)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.805-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.804-nightly" number="" defaultCollapsed={true}>

## Sep 1, 2025 (v1.2.804-nightly)

## What's Changed
### Exciting New Features ✨
* feat: support function 'or_filters' by **@KKould** in [#18606](https://github.com/databendlabs/databend/pull/18606)
* feat(query): Supports fixed-length sort fields encoding by **@forsaken628** in [#18584](https://github.com/databendlabs/databend/pull/18584)
* feat(query): Hierarchical Grouping Sets Optimization by **@sundy-li** in [#18616](https://github.com/databendlabs/databend/pull/18616)
* feat(query): add rule_merge_limit by **@xiedeyantu** in [#18636](https://github.com/databendlabs/databend/pull/18636)
* feat: add compile-time API freezing macro for struct compatibility by **@BohuTANG** in [#18632](https://github.com/databendlabs/databend/pull/18632)
* feat: implement separate RPC delay metrics for read and write operations by **@drmingdrmer** in [#18648](https://github.com/databendlabs/databend/pull/18648)
### Thoughtful Bug Fix 🔧
* fix: drop table ownership while vacuuming by **@dantengsky** in [#18613](https://github.com/databendlabs/databend/pull/18613)
* fix(test): flaky test from history table permit guard by **@dqhl76** in [#18624](https://github.com/databendlabs/databend/pull/18624)
### Code Refactor 🎉
* refactor(query): revert pr 18589 by **@zhang2014** in [#18638](https://github.com/databendlabs/databend/pull/18638)
* refactor(query): Optimize set returning function result block max bytes by **@b41sh** in [#18626](https://github.com/databendlabs/databend/pull/18626)
* refactor(exception): enhance ErrorCodeResultExt with comprehensive error codes by **@drmingdrmer** in [#18643](https://github.com/databendlabs/databend/pull/18643)
* refactor(meta-api): consolidate schema API implementation by **@drmingdrmer** in [#18646](https://github.com/databendlabs/databend/pull/18646)
* refactor(meta-service): remove deprecated rpc_delay_seconds metric by **@drmingdrmer** in [#18647](https://github.com/databendlabs/databend/pull/18647)
* refactor(frozen-api): optimize API boundary protection by **@BohuTANG** in [#18649](https://github.com/databendlabs/databend/pull/18649)
* refactor(schema-api): extract DatabaseApi trait from SchemaApi by **@drmingdrmer** in [#18650](https://github.com/databendlabs/databend/pull/18650)
* refactor(schema-api): extract TableApi and IndexApi traits by **@drmingdrmer** in [#18652](https://github.com/databendlabs/databend/pull/18652)
### Build/Testing/CI Infra Changes 🔌
* ci: allow backport PRs to build cloud image by **@everpcpc** in [#18628](https://github.com/databendlabs/databend/pull/18628)
* ci: retryable for status code 143 by **@everpcpc** in [#18630](https://github.com/databendlabs/databend/pull/18630)
* ci: default run ci on ARM64 runner by **@everpcpc** in [#18610](https://github.com/databendlabs/databend/pull/18610)
* ci: add test_compat_client_standalone by **@forsaken628** in [#18631](https://github.com/databendlabs/databend/pull/18631)
* ci: add telemetry source tracking for build environment identification by **@BohuTANG** in [#18653](https://github.com/databendlabs/databend/pull/18653)
### Others 📒
* chore: migrating vergen to v9 by **@forsaken628** in [#18617](https://github.com/databendlabs/databend/pull/18617)
* chore: rm unused test and data. by **@youngsofun** in [#18634](https://github.com/databendlabs/databend/pull/18634)
* chore(meta-service): adjust internal structure for state machine by **@drmingdrmer** in [#18633](https://github.com/databendlabs/databend/pull/18633)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.804-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.803-nightly" number="" defaultCollapsed={true}>

## Aug 28, 2025 (v1.2.803-nightly)

## What's Changed
### Thoughtful Bug Fix 🔧
* fix: deserialization error of AdditionalStatsMeta.location by **@zhyass** in [#18618](https://github.com/databendlabs/databend/pull/18618)
### Code Refactor 🎉
* refactor(meta-service): replace Vec with BTreeMap in ImmutableLevels by **@drmingdrmer** in [#18608](https://github.com/databendlabs/databend/pull/18608)
* refactor: restructure leveled map data architecture by **@drmingdrmer** in [#18619](https://github.com/databendlabs/databend/pull/18619)
### Build/Testing/CI Infra Changes 🔌
* ci: binstall target for rust tools by **@everpcpc** in [#18615](https://github.com/databendlabs/databend/pull/18615)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.803-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.802-nightly" number="" defaultCollapsed={true}>

## Aug 27, 2025 (v1.2.802-nightly)

## What's Changed
### Exciting New Features ✨
* feat(meta-service): add a node to cluster as learner: databend-meta --join ... --learner by **@drmingdrmer** in [#18600](https://github.com/databendlabs/databend/pull/18600)
* feat: auto-generate table statistics during write by **@zhyass** in [#18548](https://github.com/databendlabs/databend/pull/18548)
* feat(storage): show statistics by **@zhyass** in [#18599](https://github.com/databendlabs/databend/pull/18599)
### Thoughtful Bug Fix 🔧
* fix: replace linear OR chain with balanced binary tree in build_inlist_filter by **@SkyFan2002** in [#18605](https://github.com/databendlabs/databend/pull/18605)
### Code Refactor 🎉
* refactor: add heartbeat to reduce meta requests for history tables by **@dqhl76** in [#18594](https://github.com/databendlabs/databend/pull/18594)
* refactor(query): Optimize the `array_agg` function to reduce memory usage by **@b41sh** in [#18607](https://github.com/databendlabs/databend/pull/18607)
### Build/Testing/CI Infra Changes 🔌
* ci: fix cancelled conclusion by **@everpcpc** in [#18604](https://github.com/databendlabs/databend/pull/18604)
* ci: build build-tool on arm64 by **@everpcpc** in [#18611](https://github.com/databendlabs/databend/pull/18611)
* ci: remove deprecated alpine build image by **@everpcpc** in [#18612](https://github.com/databendlabs/databend/pull/18612)
* ci: remove nextest from dev image by **@everpcpc** in [#18614](https://github.com/databendlabs/databend/pull/18614)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.802-nightly

</StepContent>

</StepsWrap> 
