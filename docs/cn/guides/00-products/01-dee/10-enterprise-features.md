---
title: 企业版功能
---

import DatabendTable from '@site/src/components/DatabendTable';

本页面提供了可用企业版功能的最新列表。要访问这些功能，您需要企业版或试用许可证。有关更多详细信息，请参阅 [Databend 许可证](20-license.md)。

### 企业版功能列表

| 功能 | 类别 | 描述 |
|------|------|------|
| [审计追踪 (Audit Trail)](/guides/security/audit-trail) | 安全与合规 | 通过全面的审计日志监控数据库活动，满足合规性和安全性要求。 |
| [掩码策略 (Masking Policy)](/sql/sql-commands/ddl/mask-policy/) | 安全与合规 | 通过基于角色的掩码策略保护敏感数据。 |
| 存储加密 (Storage Encryption) | 安全与合规 | 使用服务托管、KMS 或客户托管密钥对静态数据进行加密。 |
| [BendSave](/guides/data-management/data-recovery#bendsave) | 灾难恢复 | 备份和恢复整个 Databend 集群数据，实现灾难恢复。 |
| [故障安全 (Fail-Safe)](/guides/security/fail-safe) | 灾难恢复 | 从 S3 兼容的对象存储中恢复丢失或意外删除的数据。 |
| [聚合索引 (Aggregating Index)](/sql/sql-commands/ddl/aggregating-index) | 查询性能 | 通过预计算和索引聚合来加速查询。 |
| [全文索引 (Full-Text Index)](/guides/performance/fulltext-index) | 查询性能 | 使用倒排索引和相关性评分实现极速文本搜索。 |
| [Ngram 索引 (Ngram Index)](/guides/performance/ngram-index) | 查询性能 | 通过通配符搜索加速 LIKE 模式匹配查询。 |
| [虚拟列 (Virtual Column)](/sql/sql-commands/ddl/virtual-column) | 查询性能 | 自动加速 JSON 查询，为 VARIANT 数据提供零配置性能优化。 |
| [动态列 (Dynamic Column)](/sql/sql-commands/ddl/table/ddl-create-table#computed-columns) | 查询性能 | 通过存储或虚拟计算模式，从标量表达式自动生成列。 |
| [Python UDF](/sql/sql-commands/ddl/udf/ddl-create-function-embedded#python) | 高级分析 | 使用内置处理程序在 SQL 查询中执行 Python 代码。 |
| [ATTACH TABLE](/sql/sql-commands/ddl/table/attach-table) | 数据共享 | 创建指向现有表数据的只读链接，实现跨环境的零拷贝访问。 |
| [流 (Stream)](/sql/sql-commands/ddl/stream) | 变更数据捕获 | 跟踪并捕获表变更，支持增量数据处理。 |
| [清理临时文件 (Vacuum Temp Files)](/sql/sql-commands/administration-cmds/vacuum-temp-files) | 存储管理 | 清理临时文件（连接、聚合、排序溢出）以释放存储空间。 |
| [清理已删除表 (Vacuum Dropped Table)](/sql/sql-commands/ddl/table/vacuum-drop-table) | 存储管理 | 删除已删除表的数据文件以优化存储，并提供恢复选项。 |
| [清理历史数据 (Vacuum Historical Data)](/sql/sql-commands/ddl/table/vacuum-table) | 存储管理 | 删除孤立的段和块文件，深度清理存储空间。 |

## Databend 社区版 vs. 企业版

本节对比 Databend 社区版与企业版在关键功能上的差异：

### 核心数据库引擎

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['分布式元数据管理', '✓', '✓'],
['分布式 SQL 引擎', '✓', '✓'],
['分布式存储引擎', '✓', '✓'],
['分布式调度引擎', '✓', '✓'],
['向量化引擎', '✓', '✓'],
['分布式事务', '✓', '✓'],
['多版本数据', '✓', '✓'],
['时间回溯', '✓', '✓'],
['性能优化器', '✓', '✓'],
['多租户和权限管理', '✓', '✓'],
['标准数据类型', '✓', '✓'],
['半结构化数据类型 (JSON)', '✓', '✓'],
['非结构化数据类型', 'Parquet/CSV/TSV/JSON/ORC/AVRO', 'Parquet/CSV/TSV/JSON/ORC/AVRO'],
['高级压缩', '✓', '✓'],
['向量存储', '✓', '✓'],
['Apache Hive 查询', '✓', '✓'],
['Apache Iceberg 查询', '✓', '✓'],
['半结构化数据查询', '✓', '✓'],
['外部用户定义函数', '✓', '✓'],
['大查询资源隔离保护 (Spill)', '✓', '✓'],
]}
/>

### 企业安全与合规

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['基础审计功能', '✓', '✓'],
['全面审计追踪 (系统历史表)', '✕', '✓'],
['访问控制 RBAC', '✓', '✓'],
['密码强度和过期策略', '✓', '✓'],
['白名单管理', '✓', '✓'],
['存储加密', '✕', '✓'],
['数据动态掩码策略', '✕', '✓'],
]}
/>

### 高性能查询优化

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['聚合索引 (预计算聚合)', '✕', '✓'],
['全文索引 (文本搜索)', '✕', '✓'],
['Ngram 索引 (模式匹配)', '✕', '✓'],
['虚拟列 (JSON 查询加速)', '✕', '✓'],
['动态列 (计算列)', '✕', '✓'],
]}
/>

### 高级分析与 AI

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['物化视图', '✕', '✓'],
['AI 函数 (情感分析、数据标注等)', '✕', '✓ (HuggingFace 开源模型)'],
['Python UDF (高级分析)', '✕', '✓'],
]}
/>

### 实时数据集成

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['导入期间的数据处理', '✓', '✓'],
['流 (变更数据捕获)', '✕', '✓'],
['CDC 实时数据导入', '✕', '✓'],
['ATTACH TABLE (零拷贝数据共享)', '✕', '✓'],
['数据导出格式', 'Parquet/ORC/CSV/NDJSON', 'Parquet/ORC/CSV/NDJSON'],
]}
/>

### 企业存储与备份

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['冷/热数据分离', '✕', '✓'],
['自动过期数据清理', '✕', '✓'],
['自动垃圾数据清理', '✕', '✓'],
['BendSave (集群备份与恢复)', '✕', '✓'],
['故障安全 (从对象存储恢复数据)', '✕', '✓'],
]}
/>

### 生产部署

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['部署支持：K8s、裸机、安装程序', '✓', '✓'],
['后端存储支持：S3、Azblob、GCS、OSS、COS', '✓', '✓'],
['x86_64 和 ARM64 架构', '✓', '✓'],
['兼容龙芯、openEuler 等', '✓', '✓'],
['监控和告警 API', '✓', '✓'],
]}
/>

### 开发者工具与 API

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['驱动支持：Go、Java、Rust、JS、Python', '✓', '✓'],
['原生 REST API', '✓', '✓'],
['原生客户端 BendSQL', '✓', '✓'],
]}
/>

### 企业支持

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['7×24 支持与紧急响应', '✕', '✓'],
['部署和升级', '✕', '✓'],
['运维支持', '✕', '✓'],
]}
/>