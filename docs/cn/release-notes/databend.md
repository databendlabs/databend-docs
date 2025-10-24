---
sidebar_label: Databend 版本发布（Databend Releases）
title: Databend 版本发布（Databend Releases）
sidebar_position: 1
slug: /
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

本页面提供有关 <a href="https://github.com/databendlabs/databend">Databend</a> 最新功能、增强功能和错误修复的信息。

<StepsWrap> 

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.831-nightly" number="-1" defaultCollapsed={false}>

## 2025 年 10 月 20 日 (v1.2.831-nightly)

## 变更内容（What's Changed）
### 激动人心的新功能 ✨
* feat(query): 更好的脚本引擎，支持动态模式（dynamic schema support） by **@sundy-li** in [#18838](https://github.com/databendlabs/databend/pull/18838)
### 细致的错误修复 🔧
* fix: 字符串视图（string view）的内存大小应计算视图数组。 by **@youngsofun** in [#18867](https://github.com/databendlabs/databend/pull/18867)
### 代码重构 🎉
* refactor: 使用 Python 重写 meta-meta 兼容性测试 by **@drmingdrmer** in [#18870](https://github.com/databendlabs/databend/pull/18870)
### 其他 📒
* chore: 移除 common-password 功能以减小二进制文件大小 by **@TCeason** in [#18868](https://github.com/databendlabs/databend/pull/18868)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.831-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.830-nightly" number="" defaultCollapsed={false}>

## 2025 年 10 月 20 日 (v1.2.830-nightly)

## 变更内容（What's Changed）
### 激动人心的新功能 ✨
* feat(query): 倒排索引（Inverted index）支持搜索 Variant 内部字段 by **@b41sh** in [#18861](https://github.com/databendlabs/databend/pull/18861)
### 细致的错误修复 🔧
* fix: 配置文件中文件日志 `max_size` 的重命名 by **@everpcpc** in [#18772](https://github.com/databendlabs/databend/pull/18772)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.830-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.829-nightly" number="" defaultCollapsed={true}>

## 2025 年 10 月 20 日 (v1.2.829-nightly)

## 变更内容（What's Changed）
### 激动人心的新功能 ✨
* feat: 实现不可逆的 VACUUM DROP TABLE 保护 by **@dantengsky** in [#18809](https://github.com/databendlabs/databend/pull/18809)
* feat(query): SHOW STATISTICS 添加虚拟列（Virtual Column）统计信息和 Min/Max 字段 by **@b41sh** in [#18849](https://github.com/databendlabs/databend/pull/18849)
* feat: meta: 为日志条目应用添加 I/O 计时跟踪 by **@drmingdrmer** in [#18854](https://github.com/databendlabs/databend/pull/18854)
* feat: meta: 为 databend-meta -V 添加详细的版本输出 by **@drmingdrmer** in [#18856](https://github.com/databendlabs/databend/pull/18856)
* feat: 为浮点类型添加 isnan 和 isinf 函数 by **@RiversJin** in [#18858](https://github.com/databendlabs/databend/pull/18858)
* feat: metactl: 添加 dump-raft-log-wal 子命令 by **@drmingdrmer** in [#18865](https://github.com/databendlabs/databend/pull/18865)
### 细致的错误修复 🔧
* fix(query): 优化 JWT 密钥查找以避免不必要的 JWKS 刷新 by **@everpcpc** in [#18845](https://github.com/databendlabs/databend/pull/18845)
* fix(query): 列修改中的 NULL 约束检查 by **@TCeason** in [#18855](https://github.com/databendlabs/databend/pull/18855)
### 其他 📒
* chore(storage): merge_io_reader 传递 `opendal::Buffer` 且不再复制 by **@forsaken628** in [#18840](https://github.com/databendlabs/databend/pull/18840)
* chore: 将 openraft 从 v0.10.0-alpha.9 升级到 v0.10.0-alpha.11 by **@drmingdrmer** in [#18862](https://github.com/databendlabs/databend/pull/18862)
* chore: 升级 raft-log 和 display-more by **@drmingdrmer** in [#18864](https://github.com/databendlabs/databend/pull/18864)

## 新贡献者（New Contributors）
* **@RiversJin** 在 [#18858](https://github.com/databendlabs/databend/pull/18858) 中完成了首次贡献

**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.829-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.828-nightly" number="" defaultCollapsed={true}>

## 2025 年 10 月 16 日 (v1.2.828-nightly)

## 变更内容（What's Changed）
### 激动人心的新功能 ✨
* feat: 支持 CREATE FUNCTION 的可选参数名称 by **@KKould** in [#18848](https://github.com/databendlabs/databend/pull/18848)
### 细致的错误修复 🔧
* fix: 为平台特定的 DMA 标志使用编译时 cfg by **@drmingdrmer** in [#18846](https://github.com/databendlabs/databend/pull/18846)
* fix: Pipeline（流水线） max_threads 应该使用 Pipes 的最大宽度。 by **@youngsofun** in [#18837](https://github.com/databendlabs/databend/pull/18837)
### 代码重构 🎉
* refactor: meta: 将 FetchAddU64 统一为 FetchIncreaseU64 by **@drmingdrmer** in [#18847](https://github.com/databendlabs/databend/pull/18847)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.828-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.827-nightly" number="" defaultCollapsed={true}>

## 2025 年 10 月 16 日 (v1.2.827-nightly)

## 变更内容（What's Changed）
### 激动人心的新功能 ✨
* feat(query): 引入 BackpressureSpiller by **@forsaken628** in [#18802](https://github.com/databendlabs/databend/pull/18802)
* feat: 外部 UDF 支持 STAGE_LOCATION 参数 by **@KKould** in [#18833](https://github.com/databendlabs/databend/pull/18833)
### 细致的错误修复 🔧
* fix: 当流（stream）的基础表修改列类型时，Parquet 反序列化错误 by **@zhyass** in [#18828](https://github.com/databendlabs/databend/pull/18828)
### 代码重构 🎉
* refactor: meta-client: 将 RPC 计时整合到 RpcHandler 中 by **@drmingdrmer** in [#18832](https://github.com/databendlabs/databend/pull/18832)
* refactor: 澄清 HTTP 查询（Query）生命周期。 by **@youngsofun** in [#18787](https://github.com/databendlabs/databend/pull/18787)
* refactor: 简化掩码策略（mask policy）存储结构 by **@TCeason** in [#18836](https://github.com/databendlabs/databend/pull/18836)
### 其他 📒
* chore: 减少 update_multi_table_meta 中的日志 by **@SkyFan2002** in [#18844](https://github.com/databendlabs/databend/pull/18844)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.827-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.826-nightly" number="" defaultCollapsed={true}>

## 2025 年 10 月 13 日 (v1.2.826-nightly)

## 变更内容（What's Changed）
### 细致的错误修复 🔧
* fix: 文件较大时，从 CSV COPY 导致 OOM。 by **@youngsofun** in [#18830](https://github.com/databendlabs/databend/pull/18830)
### 其他 📒
* chore: 修复一些 meta 拼写错误 by **@forsaken628** in [#18824](https://github.com/databendlabs/databend/pull/18824)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.826-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.825-nightly" number="" defaultCollapsed={true}>

## 2025 年 10 月 13 日 (v1.2.825-nightly)

## 变更内容（What's Changed）
### 激动人心的新功能 ✨
* feat: 实现 INNER/LEFT/RIGHT ANY JOIN by **@KKould** in [#18779](https://github.com/databendlabs/databend/pull/18779)
### 其他 📒
* chore(query): 添加 ruff toml 文件 by **@sundy-li** in [#18823](https://github.com/databendlabs/databend/pull/18823)
* chore(query): 常量折叠（constant folder）支持排他性检查 by **@sundy-li** in [#18822](https://github.com/databendlabs/databend/pull/18822)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.825-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.824-nightly" number="" defaultCollapsed={true}>

## 2025 年 10 月 9 日 (v1.2.824-nightly)

## 变更内容（What's Changed）
### 代码重构 🎉
* refactor(query): 为实验性的新哈希连接（hash join）添加左连接（left join） by **@zhang2014** in [#18814](https://github.com/databendlabs/databend/pull/18814)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.824-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.823-nightly" number="" defaultCollapsed={true}>

## 2025 年 10 月 6 日 (v1.2.823-nightly)

## 变更内容（What's Changed）
### 激动人心的新功能 ✨
* feat(query): 将行访问策略（row access policy）参数名称与列名称解耦 by **@TCeason** in [#18799](https://github.com/databendlabs/databend/pull/18799)
* feat: meta-service: 添加具有深度过滤的快照键布局 API by **@drmingdrmer** in [#18807](https://github.com/databendlabs/databend/pull/18807)
* feat(query): 添加 copy_history 表 by **@sundy-li** in [#18806](https://github.com/databendlabs/databend/pull/18806)
* feat(query): 为虚拟列（virtual columns）生成列统计信息 by **@b41sh** in [#18801](https://github.com/databendlabs/databend/pull/18801)
* feat: meta-service: 添加 `proposed_at` 跟踪键写入时间 by **@drmingdrmer** in [#18812](https://github.com/databendlabs/databend/pull/18812)
### 细致的错误修复 🔧
* fix(query): 在 columns 表权限检查中正确处理数据库 ID by **@TCeason** in [#18798](https://github.com/databendlabs/databend/pull/18798)
* fix: 无效的序列步长 by **@KKould** in [#18800](https://github.com/databendlabs/databend/pull/18800)
* fix(meta): 对 UpsertKV 使用事务而不是直接请求 by **@drmingdrmer** in [#18813](https://github.com/databendlabs/databend/pull/18813)
### 代码重构 🎉
* refactor(user): 重新设计 ALTER USER 实现，改进 API 一致性 by **@TCeason** in [#18804](https://github.com/databendlabs/databend/pull/18804)
* refactor(query): 为内连接（inner join）添加新的实验性哈希连接 by **@zhang2014** in [#18783](https://github.com/databendlabs/databend/pull/18783)
* refactor(meta): 将 TableMeta 操作提取到专用的 ops 模块 by **@drmingdrmer** in [#18816](https://github.com/databendlabs/databend/pull/18816)
* refactor: 将表标识符类型提取到 ident.rs by **@drmingdrmer** in [#18817](https://github.com/databendlabs/databend/pull/18817)
* refactor(meta): 将 get_db_id_or_err 移动到带有嵌套 Result 的 DatabaseApi by **@drmingdrmer** in [#18818](https://github.com/databendlabs/databend/pull/18818)
* refactor(meta): 使用 Drop 模式简化流（stream）指标收集 by **@drmingdrmer** in [#18820](https://github.com/databendlabs/databend/pull/18820)
### 其他 📒
* chore: 在 jwks 刷新时记录更多信息 by **@everpcpc** in [#18803](https://github.com/databendlabs/databend/pull/18803)
* chore: 优化流（stream） http api 测试 by **@dantengsky** in [#18810](https://github.com/databendlabs/databend/pull/18810)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.823-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.822-nightly" number="" defaultCollapsed={true}>

## 2025 年 9 月 29 日 (v1.2.822-nightly)

## 变更内容（What's Changed）
### 激动人心的新功能 ✨
* feat(query): RoleInfo 支持 comment by **@TCeason** in [#18788](https://github.com/databendlabs/databend/pull/18788)
### 细致的错误修复 🔧
* fix: 防止多表插入提交时发生 panic by **@SkyFan2002** in [#18793](https://github.com/databendlabs/databend/pull/18793)
* fix: 移除收集已删除表 ID 时不正确的断言 by **@dantengsky** in [#18780](https://github.com/databendlabs/databend/pull/18780)
* fix: 禁止在 copy transform 中使用 SRF。 by **@youngsofun** in [#18795](https://github.com/databendlabs/databend/pull/18795)
### 构建/测试/CI 基础设施变更 🔌
* ci: 修复发布调试符号 by **@everpcpc** in [#18796](https://github.com/databendlabs/databend/pull/18796)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.822-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.821-nightly" number="" defaultCollapsed={true}>

## 2025 年 9 月 28 日 (v1.2.821-nightly)

## 变更内容（What's Changed）
### 激动人心的新功能 ✨
* feat(query): pivot 支持任意 order by 表达式 by **@sundy-li** in [#18770](https://github.com/databendlabs/databend/pull/18770)
* feat(query): 启用表之间的 SWAP by **@TCeason** in [#18767](https://github.com/databendlabs/databend/pull/18767)
* feat: 实现关键字 `AUTOINCREMENT` by **@KKould** in [#18715](https://github.com/databendlabs/databend/pull/18715)
* feat: 在 DML 后启用 analyze hook by **@zhyass** in [#18754](https://github.com/databendlabs/databend/pull/18754)
### 细致的错误修复 🔧
* fix: /v1/status 返回没有开始时间的停止时间。 by **@youngsofun** in [#18792](https://github.com/databendlabs/databend/pull/18792)
### 构建/测试/CI 基础设施变更 🔌
* ci: 发布调试符号到 R2 by **@everpcpc** in [#18784](https://github.com/databendlabs/databend/pull/18784)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.821-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.820-nightly" number="" defaultCollapsed={true}>

## 2025 年 9 月 25 日 (v1.2.820-nightly)

## 变更内容（What's Changed）
### 激动人心的新功能 ✨
* feat: /v1/status 合并 HttpQueryManager 的状态。 by **@youngsofun** in [#18778](https://github.com/databendlabs/databend/pull/18778)
### 细致的错误修复 🔧
* fix: `eval_or_filters` 的第一个参数的结果会影响后续参数 by **@KKould** in [#18782](https://github.com/databendlabs/databend/pull/18782)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.820-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.819-nightly" number="" defaultCollapsed={true}>

## 2025 年 9 月 25 日 (v1.2.819-nightly)

## 变更内容（What's Changed）
### 细致的错误修复 🔧
* fix: 清理具有外部位置的临时表 by **@SkyFan2002** in [#18775](https://github.com/databendlabs/databend/pull/18775)
### 代码重构 🎉
* refactor(meta-service): 将 raft 移动到单独的运行时 by **@drmingdrmer** in [#18777](https://github.com/databendlabs/databend/pull/18777)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.819-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.818-nightly" number="" defaultCollapsed={true}>

## 2025 年 9 月 24 日 (v1.2.818-nightly)

## 变更内容（What's Changed）
### 激动人心的新功能 ✨
* feat(meta): 为 databend-metactl 添加 member-list 子命令 by **@drmingdrmer** in [#18760](https://github.com/databendlabs/databend/pull/18760)
* feat(meta-service): 添加快照 V004 流（streaming）协议 by **@drmingdrmer** in [#18763](https://github.com/databendlabs/databend/pull/18763)
### 细致的错误修复 🔧
* fix: 在事务中调用过程时，ddl 的自动提交不起作用 by **@SkyFan2002** in [#18753](https://github.com/databendlabs/databend/pull/18753)
* fix: 清理被 `create or replace` 语句删除的表 by **@dantengsky** in [#18751](https://github.com/databendlabs/databend/pull/18751)
* fix(query): 修复由于 spill 中的 nullable 导致的数据丢失 by **@zhang2014** in [#18766](https://github.com/databendlabs/databend/pull/18766)
### 代码重构 🎉
* refactor(query): 提高聚合函数哈希表的可读性 by **@forsaken628** in [#18747](https://github.com/databendlabs/databend/pull/18747)
* refactor(query): 优化虚拟列（Virtual Column）写入性能 by **@b41sh** in [#18752](https://github.com/databendlabs/databend/pull/18752)
### 其他 📒
* chore: 解决 KvApi 重构后合并后的编译失败 by **@dantengsky** in [#18761](https://github.com/databendlabs/databend/pull/18761)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.818-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.817-nightly" number="" defaultCollapsed={true}>

## 2025 年 9 月 22 日 (v1.2.817-nightly)

## 变更内容（What's Changed）
### 激动人心的新功能 ✨
* feat: databend-metabench: 基准测试列表 by **@drmingdrmer** in [#18745](https://github.com/databendlabs/databend/pull/18745)
* feat: /v1/status 包含 last_query_request_at。 by **@youngsofun** in [#18750](https://github.com/databendlabs/databend/pull/18750)
### 细致的错误修复 🔧
* fix: 在 fuse_time_travel_size() 中查询已删除的表报告错误 by **@SkyFan2002** in [#18748](https://github.com/databendlabs/databend/pull/18748)
### 代码重构 🎉
* refactor(meta-service): 分离 raft-log-store 和 raft-state-machine store by **@drmingdrmer** in [#18746](https://github.com/databendlabs/databend/pull/18746)
* refactor: meta-service: 简化 raft store 和状态机 by **@drmingdrmer** in [#18749](https://github.com/databendlabs/databend/pull/18749)
* refactor(query): 用于哈希连接 spill 的流（stream）式块写入器 by **@zhang2014** in [#18742](https://github.com/databendlabs/databend/pull/18742)
* refactor(native): 在压缩前预分配零偏移量 by **@BohuTANG** in [#18756](https://github.com/databendlabs/databend/pull/18756)
* refactor: meta-service: 定期压缩不可变级别 by **@drmingdrmer** in [#18757](https://github.com/databendlabs/databend/pull/18757)
* refactor(query): 为 spill 数据添加异步缓冲区 by **@zhang2014** in [#18758](https://github.com/databendlabs/databend/pull/18758)
### 构建/测试/CI 基础设施变更 🔌
* ci: 为 databend-go 添加兼容性测试。 by **@youngsofun** in [#18734](https://github.com/databendlabs/databend/pull/18734)
### 其他 📒
* chore: 将自动实现的 KvApi 方法移动到 Ext trait by **@drmingdrmer** in [#18759](https://github.com/databendlabs/databend/pull/18759)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.817-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.816-nightly" number="" defaultCollapsed={true}>

## 2025 年 9 月 19 日 (v1.2.816-nightly)

## 变更内容（What's Changed）
### 激动人心的新功能 ✨
* feat(rbac): 过程对象支持 rbac by **@TCeason** in [#18730](https://github.com/databendlabs/databend/pull/18730)
### 细致的错误修复 🔧
* fix(query): 减少查询等待期间冗余的 result-set-spill 日志 by **@BohuTANG** in [#18741](https://github.com/databendlabs/databend/pull/18741)
* fix: fuse_vacuum2 在清理带有 data_retentio 的空表时发生 panic by **@dantengsky** in [#18744](https://github.com/databendlabs/databend/pull/18744)
### 代码重构 🎉
* refactor: compactor 内部结构 by **@drmingdrmer** in [#18738](https://github.com/databendlabs/databend/pull/18738)
* refactor(query): 重构连接分区以减少内存放大 by **@zhang2014** in [#18732](https://github.com/databendlabs/databend/pull/18732)
* refactor: 使所有权键删除和表/数据库替换在同一事务中 by **@TCeason** in [#18739](https://github.com/databendlabs/databend/pull/18739)
### 其他 📒
* chore(meta-service): 重新组织 raft-store 的测试 by **@drmingdrmer** in [#18740](https://github.com/databendlabs/databend/pull/18740)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.816-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.815-nightly" number="" defaultCollapsed={true}>

## 2025 年 9 月 18 日 (v1.2.815-nightly)

## 变更内容（What's Changed）
### 激动人心的新功能 ✨
* feat: 添加 ANY_VALUE 作为 ANY 聚合函数的别名 by **@BohuTANG** in [#18728](https://github.com/databendlabs/databend/pull/18728)
* feat: 添加 Immutable::compact 以合并两个级别 by **@drmingdrmer** in [#18731](https://github.com/databendlabs/databend/pull/18731)
### 细致的错误修复 🔧
* fix: 上一个查询 ID 不仅包含那些缓存的。 by **@youngsofun** in [#18727](https://github.com/databendlabs/databend/pull/18727)
### 代码重构 🎉
* refactor: raft-store: 内存只读级别压缩 by **@drmingdrmer** in [#18736](https://github.com/databendlabs/databend/pull/18736)
* refactor: 新设置 `max_vacuum_threads` by **@dantengsky** in [#18737](https://github.com/databendlabs/databend/pull/18737)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.815-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.814-nightly" number="" defaultCollapsed={true}>

## 2025 年 9 月 17 日 (v1.2.814-nightly)

## 变更内容（What's Changed）
### 细致的错误修复 🔧
* fix(query): 确保 jwt 角色在不存在时分配给用户 by **@everpcpc** in [#18720](https://github.com/databendlabs/databend/pull/18720)
* fix(query): 将 Parquet 默认编码设置为 `PLAIN` 以确保数据兼容性 by **@b41sh** in [#18724](https://github.com/databendlabs/databend/pull/18724)
### 其他 📒
* chore: 用 SysData 替换 Arc&lt;Mutex&lt;SysData&gt;&gt; by **@drmingdrmer** in [#18723](https://github.com/databendlabs/databend/pull/18723)
* chore: 在私有任务测试脚本中添加错误检查 by **@KKould** in [#18698](https://github.com/databendlabs/databend/pull/18698)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.814-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.813-nightly" number="" defaultCollapsed={true}>

## 2025 年 9 月 16 日 (v1.2.813-nightly)

## 变更内容（What's Changed）
### 激动人心的新功能 ✨
* feat(query): 支持结果集溢出（result set spilling） by **@forsaken628** in [#18679](https://github.com/databendlabs/databend/pull/18679)
### 细致的错误修复 🔧
* fix(meta-service): 分离 SysData 以避免竞争条件 by **@drmingdrmer** in [#18722](https://github.com/databendlabs/databend/pull/18722)
### 代码重构 🎉
* refactor(raft-store): 更新 trait 接口并重构分级映射 by **@drmingdrmer** in [#18719](https://github.com/databendlabs/databend/pull/18719)
### 文档 📔
* docs(raft-store): 增强所有模块的文档 by **@drmingdrmer** in [#18721](https://github.com/databendlabs/databend/pull/18721)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.813-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.812-nightly" number="" defaultCollapsed={true}>

## 2025 年 9 月 15 日 (v1.2.812-nightly)

## 变更内容（What's Changed）
### 激动人心的新功能 ✨
* feat: `infer_schema` 扩展了对 csv 和 ndjson 的支持 by **@KKould** in [#18552](https://github.com/databendlabs/databend/pull/18552)
### 细致的错误修复 🔧
* fix(query): 列默认表达式不应导致 seq.nextval 修改 by **@b41sh** in [#18694](https://github.com/databendlabs/databend/pull/18694)
* fix: `vacuum2` all 应该忽略 SYSTEM 数据库 by **@dantengsky** in [#18712](https://github.com/databendlabs/databend/pull/18712)
* fix(meta-service): 快照键计数应该被重置 by **@drmingdrmer** in [#18718](https://github.com/databendlabs/databend/pull/18718)
### 代码重构 🎉
* refactor(meta-service): 以流（stream）而不是向量（vector）响应 mget 项 by **@drmingdrmer** in [#18716](https://github.com/databendlabs/databend/pull/18716)
* refactor(meta-service0): rotbl: 使用 `spawn_blocking()` 代替 `blocking_in_place()` by **@drmingdrmer** in [#18717](https://github.com/databendlabs/databend/pull/18717)
### 构建/测试/CI 基础设施变更 🔌
* ci: 迁移 `09_http_handler` 到 pytest by **@forsaken628** in [#18714](https://github.com/databendlabs/databend/pull/18714)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.812-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.811-nightly" number="" defaultCollapsed={true}>

## 2025 年 9 月 11 日 (v1.2.811-nightly)

## 变更内容（What's Changed）
### 细致的错误修复 🔧
* fix: 在空表上重试事务时发生错误 by **@SkyFan2002** in [#18703](https://github.com/databendlabs/databend/pull/18703)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.811-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.810-nightly" number="" defaultCollapsed={true}>

## 2025 年 9 月 10 日 (v1.2.810-nightly)

## 变更内容（What's Changed）
### 激动人心的新功能 ✨
* feat: 在 `RANGE BETWEEN` 上实现 Date 和 Timestamp by **@KKould** in [#18696](https://github.com/databendlabs/databend/pull/18696)
* feat: 添加 pybend Python 绑定，支持 S3 连接和暂存区（stage） by **@BohuTANG** in [#18704](https://github.endlabs/databend/pull/18704)
* feat(query): 添加列出流（stream）的 api by **@everpcpc** in [#18701](https://github.com/databendlabs/databend/pull/18701)
### 细致的错误修复 🔧
* fix: 在集群模式下收集的配置文件丢失 by **@dqhl76** in [#18680](https://github.com/databendlabs/databend/pull/18680)
* fix(python-binding): 完成 Python 绑定 CI 配置 by **@BohuTANG** in [#18686](https://github.com/databendlabs/databend/pull/18686)
* fix(python-binding): 解决 CI 中虚拟环境权限冲突 by **@BohuTANG** in [#18708](https://github.com/databendlabs/databend/pull/18708)
* fix: 在多语句事务中使用物化 CTE 时出错 by **@SkyFan2002** in [#18707](https://github.com/databendlabs/databend/pull/18707)
* fix(query): 为嵌入模式添加配置以澄清此模式 by **@zhang2014** in [#18710](https://github.com/databendlabs/databend/pull/18710)
### 构建/测试/CI 基础设施变更 🔌
* ci: 运行 bendsql 的 compact behave 测试。 by **@youngsofun** in [#18697](https://github.com/databendlabs/databend/pull/18697)
* ci: 暂时禁用私有任务的计算集群（warehouse）测试 by **@KKould** in [#18709](https://github.com/databendlabs/databend/pull/18709)
### 其他 📒
* chore(python-binding): 文档和 PyPI 元数据 by **@BohuTANG** in [#18711](https://github.com/databendlabs/databend/pull/18711)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.810-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.809-nightly" number="" defaultCollapsed={true}>

## 2025 年 9 月 8 日 (v1.2.809-nightly)

## 变更内容（What's Changed）
### 激动人心的新功能 ✨
* feat: 支持重置工作区（worksheet）会话。 by **@youngsofun** in [#18688](https://github.com/databendlabs/databend/pull/18688)
### 细致的错误修复 🔧
* fix(query): 修复 MERGE INTO 中无法将 Variant Nullable 类型转换为 Int32 类型 by **@b41sh** in [#18687](https://github.com/databendlabs/databend/pull/18687)
* fix: meta-semaphore: 当没有接收到事件时重新连接 by **@drmingdrmer** in [#18690](https://github.com/databendlabs/databend/pull/18690)
### 代码重构 🎉
* refactor(meta-semaphore): 处理 new-stream, lease-extend 期间发生的错误 by **@drmingdrmer** in [#18695](https://github.com/databendlabs/databend/pull/18695)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.809-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.808-nightly" number="" defaultCollapsed={true}>

## 2025 年 9 月 8 日 (v1.2.808-nightly)

## 变更内容（What's Changed）
### 激动人心的新功能 ✨
* feat: 支持 Check Constraint by **@KKould** in [#18661](https://github.com/databendlabs/databend/pull/18661)
* feat(parser): 添加智能 SQL 错误建议系统 by **@BohuTANG** in [#18670](https://github.com/databendlabs/databend/pull/18670)
* feat: 增强资源调度日志，提供清晰的状态和配置详情 by **@BohuTANG** in [#18684](https://github.com/databendlabs/databend/pull/18684)
* feat(meta-semaphore): 允许将时间戳指定为信号量序列 by **@drmingdrmer** in [#18685](https://github.com/databendlabs/databend/pull/18685)
### 细致的错误修复 🔧
* fix: 在清理已删除的表时清理 `db_id_table_name` by **@dantengsky** in [#18665](https://github.com/databendlabs/databend/pull/18665)
* fix: 禁止带有 where 子句的 transform。 by **@youngsofun** in [#18681](https://github.com/databendlabs/databend/pull/18681)
* fix(query): 修复带有 CTE 或子查询的 group by 项顺序不正确 by **@sundy-li** in [#18692](https://github.com/databendlabs/databend/pull/18692)
### 代码重构 🎉
* refactor(meta): 从单一的 util.rs 中提取实用程序 by **@drmingdrmer** in [#18678](https://github.com/databendlabs/databend/pull/18678)
* refactor(query): 拆分 Spiller 以提供更大的可扩展性 by **@forsaken628** in [#18691](https://github.com/databendlabs/databend/pull/18691)
### 构建/测试/CI 基础设施变更 🔌
* ci: JDBC 的兼容性测试使用 main 中的测试。 by **@youngsofun** in [#18668](https://github.com/databendlabs/databend/pull/18668)
### 其他 📒
* chore: 添加关于创建序列的测试以保留旧版本 by **@TCeason** in [#18673](https://github.com/databendlabs/databend/pull/18673)
* chore: 为运行时过滤器添加一些日志 by **@SkyFan2002** in [#18674](https://github.com/databendlabs/databend/pull/18674)
* chore: 为运行时过滤器添加配置文件 by **@SkyFan2002** in [#18675](https://github.com/databendlabs/databend/pull/18675)
* chore: 捕获 `to_date`/`to_timestamp` unwrap by **@KKould** in [#18677](https://github.com/databendlabs/databend/pull/18677)
* chore(query): 为信号量队列添加重试 by **@zhang2014** in [#18689](https://github.com/databendlabs/databend/pull/18689)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.808-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.807-nightly" number="" defaultCollapsed={true}>

## 2025 年 9 月 3 日 (v1.2.807-nightly)

## 变更内容（What's Changed）
### 激动人心的新功能 ✨
* feat(query): 为行访问策略（Row Access Policies）和统计信息隐私添加 SecureFilter by **@TCeason** in [#18623](https://github.com/databendlabs/databend/pull/18623)
* feat(query): 支持序列创建的 `start` 和 `increment` 选项 by **@TCeason** in [#18659](https://github.com/databendlabs/databend/pull/18659)
### 细致的错误修复 🔧
* fix(rbac): create or replace ownership_object 应该删除旧的所有权键 by **@TCeason** in [#18667](https://github.com/databendlabs/databend/pull/18667)
* fix(history-table): 当另一个节点启动时停止心跳 by **@dqhl76** in [#18664](https://github.com/databendlabs/databend/pull/18664)
### 代码重构 🎉
* refactor: 将垃圾收集 api 提取到 garbage_collection_api.rs by **@drmingdrmer** in [#18663](https://github.com/databendlabs/databend/pull/18663)
* refactor(meta): 完成 SchemaApi trait 分解 by **@drmingdrmer** in [#18669](https://github.com/databendlabs/databend/pull/18669)
### 其他 📒
* chore: 启用分布式 recluster by **@zhyass** in [#18644](https://github.com/databendlabs/databend/pull/18644)
* chore(ci): 使 ci 成功 by **@TCeason** in [#18672](https://github.com/databendlabs/databend/pull/18672)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.807-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.806-nightly" number="" defaultCollapsed={true}>

## 2025 年 9 月 2 日 (v1.2.806-nightly)

## 变更内容（What's Changed）
### 细致的错误修复 🔧
* fix(query): 尝试修复集群聚合（cluster aggregate）的挂起 by **@zhang2014** in [#18655](https://github.com/databendlabs/databend/pull/18655)
### 代码重构 🎉
* refactor(schema-api): 提取 SecurityApi trait by **@drmingdrmer** in [#18658](https://github.com/databendlabs/databend/pull/18658)
* refactor(query): 移除无用的 ee 功能 by **@zhang2014** in [#18660](https://github.com/databendlabs/databend/pull/18660)
### 构建/测试/CI 基础设施变更 🔌
* ci: 修复 sqlsmith 的下载 artifact by **@everpcpc** in [#18662](https://github.com/databendlabs/databend/pull/18662)
* ci: ttc 使用 nginx 和 minio 进行测试。 by **@youngsofun** in [#18657](https://github.com/databendlabs/databend/pull/18657)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.806-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.805-nightly" number="" defaultCollapsed={true}>

## 2025 年 9 月 1 日 (v1.2.805-nightly)

## 变更内容（What's Changed）
### 激动人心的新功能 ✨
* feat: 添加 `RuleFilterFlattenOr` by **@KKould** in [#18621](https://github.com/databendlabs/databend/pull/18621)
* feat: 添加设置以控制 analyze table by **@zhyass** in [#18642](https://github.com/databendlabs/databend/pull/18642)
### 代码重构 🎉
* refactor: 使用 or_filters 重构 inlist 运行时过滤器并添加可配置的运行时过滤器阈值 by **@SkyFan2002** in [#18622](https://github.com/databendlabs/databend/pull/18622)
* refactor(schema-api): 从 SchemaApi 中提取 CatalogApi trait by **@drmingdrmer** in [#18654](https://github.com/databendlabs/databend/pull/18654)
### 构建/测试/CI 基础设施变更 🔌
* ci: 提取 minio 的 action。 by **@youngsofun** in [#18651](https://github.com/databendlabs/databend/pull/18651)
* ci: 修复安装 nfpm by **@everpcpc** in [#18656](https://github.com/databendlabs/databend/pull/18656)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.805-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.804-nightly" number="" defaultCollapsed={true}>

## 2025 年 9 月 1 日 (v1.2.804-nightly)

## 变更内容（What's Changed）
### 激动人心的新功能 ✨
* feat: 支持函数 'or_filters' by **@KKould** in [#18606](https://github.com/databendlabs/databend/pull/18606)
* feat(query): 支持定长排序字段编码 by **@forsaken628** in [#18584](https://github.com/databendlabs/databend/pull/18584)
* feat(query): 分层分组集（Hierarchical Grouping Sets）优化 by **@sundy-li** in [#18616](https://github.com/databendlabs/databend/pull/18616)
* feat(query): 添加 rule_merge_limit by **@xiedeyantu** in [#18636](https://github.com/databendlabs/databend/pull/18636)
* feat: 添加编译时 API 冻结宏以实现结构兼容性 by **@BohuTANG** in [#18632](https://github.com/databendlabs/databend/pull/18632)
* feat: 为读写操作实现单独的 RPC 延迟指标 by **@drmingdrmer** in [#18648](https://github.com/databendlabs/databend/pull/18648)
### 细致的错误修复 🔧
* fix: 在清理时删除表所有权 by **@dantengsky** in [#18613](https://github.com/databendlabs/databend/pull/18613)
* fix(test): 历史表许可守卫导致的测试不稳定 by **@dqhl76** in [#18624](https://github.com/databendlabs/databend/pull/18624)
### 代码重构 🎉
* refactor(query): 恢复 pr 18589 by **@zhang2014** in [#18638](https://github.com/databendlabs/databend/pull/18638)
* refactor(query): 优化 set returning function 结果块最大字节数 by **@b41sh** in [#18626](https://github.com/databendlabs/databend/pull/18626)
* refactor(exception): 使用全面的错误代码增强 ErrorCodeResultExt by **@drmingdrmer** in [#18643](https://github.com/databendlabs/databend/pull/18643)
* refactor(meta-api): 整合 schema API 实现 by **@drmingdrmer** in [#18646](https://github.com/databendlabs/databend/pull/18646)
* refactor(meta-service): 移除已弃用的 rpc_delay_seconds 指标 by **@drmingdrmer** in [#18647](https://github.com/databendlabs/databend/pull/18647)
* refactor(frozen-api): 优化 API 边界保护 by **@BohuTANG** in [#18649](https://github.com/databendlabs/databend/pull/18649)
* refactor(schema-api): 从 SchemaApi 中提取 DatabaseApi trait by **@drmingdrmer** in [#18650](https://github.com/databendlabs/databend/pull/18650)
* refactor(schema-api): 提取 TableApi 和 IndexApi traits by **@drmingdrmer** in [#18652](https://github.com/databendlabs/databend/pull/18652)
### 构建/测试/CI 基础设施变更 🔌
* ci: 允许 backport PR 构建云镜像 by **@everpcpc** in [#18628](https://github.com/databendlabs/databend/pull/18628)
* ci: 对状态码 143 进行重试 by **@everpcpc** in [#18630](https://github.com/databendlabs/databend/pull/18630)
* ci: 默认在 ARM64 runner 上运行 ci by **@everpcpc** in [#18610](https://github.com/databendlabs/databend/pull/18610)
* ci: 添加 test_compat_client_standalone by **@forsaken628** in [#18631](https://github.com/databendlabs/databend/pull/18631)
* ci: 添加遥测源跟踪以识别构建环境 by **@BohuTANG** in [#18653](https://github.com/databendlabs/databend/pull/18653)
### 其他 📒
* chore: 迁移 vergen 到 v9 by **@forsaken628** in [#18617](https://github.com/databendlabs/databend/pull/18617)
* chore: 移除未使用的测试和数据。 by **@youngsofun** in [#18634](https://github.com/databendlabs/databend/pull/18634)
* chore(meta-service): 调整状态机的内部结构 by **@drmingdrmer** in [#18633](https://github.com/databendlabs/databend/pull/18633)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.804-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.803-nightly" number="" defaultCollapsed={true}>

## 2025 年 8 月 28 日 (v1.2.803-nightly)

## 变更内容（What's Changed）
### 细致的错误修复 🔧
* fix: AdditionalStatsMeta.location 的反序列化错误 by **@zhyass** in [#18618](https://github.com/databendlabs/databend/pull/18618)
### 代码重构 🎉
* refactor(meta-service): 在 ImmutableLevels 中用 BTreeMap 替换 Vec by **@drmingdrmer** in [#18608](https://github.com/databendlabs/databend/pull/18608)
* refactor: 重构分级映射数据架构 by **@drmingdrmer** in [#18619](https://github.com/databendlabs/databend/pull/18619)
### 构建/测试/CI 基础设施变更 🔌
* ci: rust 工具的 binstall target by **@everpcpc** in [#18615](https://github.com/databendlabs/databend/pull/18615)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.803-nightly

</StepContent>

<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/v1.2.802-nightly" number="" defaultCollapsed={true}>

## 2025 年 8 月 27 日 (v1.2.802-nightly)

## 变更内容（What's Changed）
### 激动人心的新功能 ✨
* feat(meta-service): 添加一个节点作为学习者加入集群：databend-meta --join ... --learner by **@drmingdrmer** in [#18600](https://github.com/databendlabs/databend/pull/18600)
* feat: 在写入期间自动生成表统计信息 by **@zhyass** in [#18548](https://github.com/databendlabs/databend/pull/18548)
* feat(storage): 显示统计信息 by **@zhyass** in [#18599](https://github.com/databendlabs/databend/pull/18599)
### 细致的错误修复 🔧
* fix: 在 build_inlist_filter 中用平衡二叉树替换线性 OR 链 by **@SkyFan2002** in [#18605](https://github.com/databendlabs/databend/pull/18605)
### 代码重构 🎉
* refactor: 添加心跳以减少历史表对 meta 的请求 by **@dqhl76** in [#18594](https://github.com/databendlabs/databend/pull/18594)
* refactor(query): 优化 `array_agg` 函数以减少内存使用 by **@b41sh** in [#18607](https://github.com/databendlabs/databend/pull/18607)
### 构建/测试/CI 基础设施变更 🔌
* ci: 修复已取消的结论 by **@everpcpc** in [#18604](https://github.com/databendlabs/databend/pull/18604)
* ci: 在 arm64 上构建 build-tool by **@everpcpc** in [#18611](https://github.com/databendlabs/databend/pull/18611)
* ci: 移除已弃用的 alpine 构建镜像 by **@everpcpc** in [#18612](https://github.com/databendlabs/databend/pull/18612)
* ci: 从 dev 镜像中移除 nextest by **@everpcpc** in [#18614](https://github.com/databendlabs/databend/pull/18614)


**Full Changelog**: https://github.com/databendlabs/databend/releases/tag/v1.2.802-nightly

</StepContent>

</StepsWrap>