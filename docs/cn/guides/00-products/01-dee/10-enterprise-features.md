---
title: 企业版功能
---

import DatabendTable from '@site/src/components/DatabendTable';

本页提供了可用的企业版功能的最新列表。要使用这些功能，您需要企业版或试用版许可证。有关更多详细信息，请参阅 [Databend 许可证](20-license.md)。

### 企业版功能列表

| 功能                                                                             | 类别       | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [清理临时文件 (Vacuum Temp Files)](/sql/sql-commands/administration-cmds/vacuum-temp-files) | 存储       | - 通过删除临时文件（特别是 join、aggregate 和 sort 溢出文件）释放存储空间。<br/>- 根据需要设置保留时间和文件限制。                                                                                                                                                                                                                                                                                                                                                     |
| [清理已删除表 (Vacuum Dropped Table)](/sql/sql-commands/ddl/table/vacuum-drop-table) | 存储       | 通过删除已删除表的数据文件优化存储。提供恢复选项和空跑（dry-run）预览功能。                                                                                                                                                                                                                                                                                                                                                                                                |
| [清理历史数据 (Vacuum Historical Data)](/sql/sql-commands/ddl/table/vacuum-table) | 存储       | 深度清理存储空间：<br/>- 删除孤立的段（segment）和块（block）文件。<br/>- 使用空跑（dry-run）选项安全预览数据文件删除。                                                                                                                                                                                                                                                                                                                                                     |
| [虚拟列 (Virtual Column)](/sql/sql-commands/ddl/virtual-column) | 查询       | 提升 Variant 数据查询效率：<br/>- 避免遍历嵌套结构，通过直接数据检索加速查询执行。<br/>- 显著降低 Variant 数据内存占用，减少内存溢出风险。                                                                                                                                                                                                                                                                                             |
| [聚合索引 (Aggregating Index)](/sql/sql-commands/ddl/aggregating-index) | 查询       | 通过预计算索引化聚合提升查询速度：<br/>- 利用预计算结果加速查询。<br/>- 根据数据分析需求自定义索引。                                                                                                                                                                                                                                                                                                                                   |
| [计算列 (Computed Column)](/sql/sql-commands/ddl/table/ddl-create-table#computed-columns) | 查询       | 从现有列自动派生新列：<br/>- 确保数据准确性和一致性。<br/>- 支持数据库内高级分析和计算。<br/>- 提供存储型和虚拟型两种计算列：虚拟列在查询时动态计算，节省存储空间。                                                                                                                                                                                                                                                        |
| [Python UDF](/guides/query/udf#python-requires-databend-enterprise) | 查询       | 通过内置处理程序在 SQL 查询中调用 Python 代码，实现 Python 逻辑与 SQL 查询的无缝集成。                                                                                                                                                                                                                                                                                                                                  |
| [ATTACH TABLE](/sql/sql-commands/ddl/table/attach-table) | 查询       | 将云服务平台中的表无缝连接到私有部署环境的现有表，无需物理移动数据。                                                                                                                                                                                                                                                                                                                                                                            |
| [流 (Stream)](/sql/sql-commands/ddl/stream) | 数据流     | 高效管理数据变更：<br/>- 支持仅追加模式，实时捕获数据插入。<br/>- 直接查询分析流数据，快速获取洞察。                                                                                                                                                                                                                                                                                                                                             |
| [数据脱敏策略 (Masking Policy)](/sql/sql-commands/ddl/mask-policy/) | 安全       | 基于角色的数据脱敏功能：<br/>- 通过可定制脱敏规则保护敏感信息。<br/>- 在强化安全性的同时保持数据可用性。                                                                                                                                                                                                                                                                                                                                             |
| 存储加密 (Storage Encryption) | 安全       | 增强服务器端数据加密安全性，防止存储供应商未授权访问：<br/>- 支持服务托管密钥、KMS 托管密钥或客户托管密钥加密（选项因存储类型而异）。<br/>- 目前支持阿里云 OSS。<br/>各存储供应商加密参数详见[部署指南](../../10-deploy/01-deploy/01-non-production/01-deploying-databend.md)。 |
| [故障保护 (Fail-Safe)](/guides/security/fail-safe) | 安全       | 从 S3 兼容对象存储恢复表数据。                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| [BendSave](/guides/data-management/data-recovery#bendsave) | 恢复       | 用于备份和恢复 Databend 元数据及数据文件的命令行工具。                                                                                                                                                                                                                                                                                                                                                                                             |

## Databend 社区版 vs. 企业版

以下模块对比 Databend 社区版和企业版：

### 核心功能

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['分布式元数据管理', '✓', '✓'],
['分布式 SQL 引擎', '✓', '✓'],
['分布式存储引擎', '✓', '✓'],
['分布式调度引擎', '✓', '✓'],
['向量化引擎', '✓', '✓'],
['分布式事务 (Distributed Transaction)', '✓', '✓'],
['多版本数据', '✓', '✓'],
['时间回溯 (Time Travel)', '✓', '✓'],
['性能优化器 (Performance Optimizer)', '✓', '✓'],
['多租户与权限管理', '✓', '✓'],
['标准数据类型', '✓', '✓'],
['半结构化数据类型 (JSON)', '✓', '✓'],
['非结构化数据类型', 'Parquet/CSV/TSV/JSON/ORC', 'Parquet/CSV/TSV/JSON/ORC'],
['高级压缩 (Advanced Compression)', '✓', '✓'],
['向量存储', '✓', '✓'],
['Apache Hive 查询 (Apache Hive Query)', '✓', '✓'],
['Apache Iceberg 查询 (Apache Iceberg Query)', '✓', '✓'],
['半结构化数据查询 (Semi-structured Data Query)', '✓', '✓'],
['外部用户定义函数', '✓', '✓'],
['大查询资源隔离保护 (Spill)', '✓', '✓'],
]}
/>

### 扩展功能

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['集群模式', '✕', '✓'],
['物化视图 (Materialized Views)', '✕', '✓'],
['AI 函数（情感分析、数据标注等）', '✕', '✓ (HuggingFace 开源模型)']
]}
/>

### 部署

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['部署支持：K8s、裸金属、安装程序', '✓', '✓'],
['后端存储支持：S3、Azblob、GCS、OSS、COS', '✓', '✓'],
['x86_64 & ARM64 架构', '✓', '✓'],
['兼容龙芯、欧拉等', '✓', '✓'],
['监控与告警 API', '✓', '✓'],
]}
/>

### 生态

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['驱动支持：Go、Java、Rust、JS、Python', '✓', '✓'],
['原生 REST API', '✓', '✓'],
['原生客户端 BendSQL', '✓', '✓'],
]}
/>

### 安全

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['审计功能', '✓', '✓'],
['访问控制 RBAC', '✓', '✓'],
['密码强度与过期策略', '✓', '✓'],
['白名单管理', '✓', '✓'],
['存储加密', '✕', '✓'],
['数据动态脱敏策略', '✕', '✓'],
]}
/>

### 数据导入与导出

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['导入时数据处理', '✓', '✓'],
['数据流', '✕', '✓'],
['CDC 实时数据导入', '✕', '✓'],
['数据导出格式', 'Parquet/ORC/CSV/NDJSON', 'Parquet/ORC/CSV/NDJSON'],
]}
/>

### 查询优化 (Query Optimizations)

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['聚合查询加速优化', '✕', '✓'],
['JSON 查询加速优化', '✕', '✓'],
['预计算能力', '✕', '✓'],
]}
title="查询优化 (Query Optimizations)"
/>

### 存储优化 (Storage Optimizations)

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['冷热数据分离', '✕', '✓'],
['自动过期数据清理', '✕', '✓'],
['自动垃圾数据清理', '✕', '✓'],
]}
title="存储优化 (Storage Optimizations)"
/>

### 客户支持 (Customer Support)

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['7x24 小时支持与紧急响应', '✕', '✓'],
['部署与升级', '✕', '✓'],
['运维支持', '✕', '✓'],
]}
title="客户支持 (Customer Support)"
/>