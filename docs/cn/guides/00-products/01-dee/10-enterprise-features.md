---
title: 企业版功能
---

import DatabendTable from '@site/src/components/DatabendTable';

本页面提供了可用企业版功能的最新列表。要访问这些功能，您需要企业版或试用许可证。更多详情，请参阅 [Licensing Databend](20-license.md)。

### 企业版功能列表

| 功能                                                                          | 类别       | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [清理临时文件](/sql/sql-commands/administration-cmds/vacuum-temp-files)     | 存储        | - 通过删除临时文件释放存储空间，特别是连接、聚合和排序溢出文件。<br/>- 根据需要设置保留期和文件限制。                                                                                                                                                                                                                                                                                                                                                                                             |
| [清理已删除表](/sql/sql-commands/ddl/table/vacuum-drop-table)            | 存储        | 通过删除已删除表的数据文件优化存储空间，提供恢复选项和试运行预览功能。                                                                                                                                                                                                                                                                                                                                                                                              |
| [清理历史数据](/sql/sql-commands/ddl/table/vacuum-table)               | 存储        | 深度清理存储空间：<br/>- 删除孤立的段和块文件。<br/>- 使用试运行选项安全预览数据文件删除操作。                                                                                                                                                                                                                                                                                                                                                                                    |
| [虚拟列 (Virtual Column)](/sql/sql-commands/ddl/virtual-column)                           | 查询          | 提升变体数据查询效率：<br/>- 简化查询过程，避免遍历整个嵌套结构，直接检索数据加速执行。<br/>- 显著降低变体数据内存使用，减少内存溢出风险。                                                                                                                                                                                                                                                                                                                                                     |
| [聚合索引 (Aggregating Index)](/sql/sql-commands/ddl/aggregating-index)                     | 查询          | 通过预计算和索引聚合提升查询速度：<br/>- 增强查询性能。<br/>- 支持自定义索引以满足特定数据分析需求。                                                                                                                                                                                                                                                                                                                                                                                             |
| [计算列 (Computed Column)](/sql/sql-commands/ddl/table/ddl-create-table#computed-columns) | 查询          | 从现有列派生新列以节省时间：<br/>- 自动更新确保数据准确一致。<br/>- 支持数据库内高级分析和计算。<br/>- 提供存储型和虚拟型两种类型；虚拟列在查询时动态计算，节省存储空间。                                                                                                                                                                                                                                                                                                                          |
| [Python UDF](/guides/query/udf#python-requires-databend-enterprise)              | 查询          | 通过内置处理器在 SQL 查询中调用 Python 代码，实现 Python 逻辑与 SQL 的无缝集成。                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| [附加表 (ATTACH TABLE)](/sql/sql-commands/ddl/table/attach-table)                         | 查询          | 无缝连接云服务平台中的表到私有部署环境的现有表，无需物理移动数据。                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| [流 (Stream)](/sql/sql-commands/ddl/stream)                                           | 数据流        | 高效管理数据变更：<br/>- 支持仅追加模式，实时捕获数据插入。<br/>- 直接查询和分析流数据，确保快速洞察。                                                                                                                                                                                                                                                                                                                                                                                             |
| [掩码策略 (Masking Policy)](/sql/sql-commands/ddl/mask-policy/)                             | 安全       | 基于角色的数据掩码增强安全性：<br/>- 通过可定制掩码保护敏感信息。<br/>- 在强化安全的同时保持数据可用性。                                                                                                                                                                                                                                                                                                                                                                           |
| 存储加密                                                               | 安全       | 增强服务器端数据加密安全性，防止存储供应商未授权访问：<br/>- 支持服务管理密钥、KMS 管理密钥或客户管理密钥加密；选项因存储类型而异。<br/>- 目前支持阿里云 OSS。<br/>各存储供应商加密参数详见[部署指南](../../10-deploy/01-deploy/01-non-production/01-deploying-databend.md)。 |
| [故障安全 (Fail-Safe)](/guides/security/fail-safe)                                          | 安全       | 从 S3 兼容对象存储恢复表数据。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| [BendSave](/guides/data-management/data-recovery#bendsave) | 恢复 | BendSave 是用于备份和恢复 Databend 元数据及实际数据文件的命令行工具。 |

## Databend 社区版 (Community) 与企业版 (Enterprise) 对比

本节在以下模块中比较 Databend 社区版 (Community) 与 Databend 企业版 (Enterprise)：

### 核心功能

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版 (Community)', 'Databend 企业版 (Enterprise)']}
tbody={[
['分布式元数据管理', '✓', '✓'],
['分布式 SQL 引擎', '✓', '✓'],
['分布式存储引擎', '✓', '✓'],
['分布式调度引擎', '✓', '✓'],
['向量化引擎', '✓', '✓'],
['分布式事务 (Transaction)', '✓', '✓'],
['多版本数据', '✓', '✓'],
['时间旅行 (Time Travel)', '✓', '✓'],
['性能优化器', '✓', '✓'],
['多租户和权限管理', '✓', '✓'],
['标准数据类型', '✓', '✓'],
['半结构化数据类型 (JSON)', '✓', '✓'],
['非结构化数据类型', 'Parquet/CSV/TSV/JSON/ORC', 'Parquet/CSV/TSV/JSON/ORC'],
['高级压缩 (Compression)', '✓', '✓'],
['向量存储', '✓', '✓'],
['Apache Hive 查询', '✓', '✓'],
['Apache Iceberg 查询', '✓', '✓'],
['半结构化数据查询', '✓', '✓'],
['外部用户定义函数', '✓', '✓'],
['大查询资源隔离保护 (Spill)', '✓', '✓'],
]}
/>

### 扩展功能

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版 (Community)', 'Databend 企业版 (Enterprise)']}
tbody={[
['集群模式', '✕', '✓'],
['物化视图 (Materialized Views)', '✕', '✓'],
['AI 函数 (情感分析、数据标注等)', '✕', '✓ (HuggingFace 开源模型)']
]}
/>

### 部署

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版 (Community)', 'Databend 企业版 (Enterprise)']}
tbody={[
['部署支持：K8s、裸机、安装程序', '✓', '✓'],
['后端存储支持：S3、Azblob、GCS、OSS、COS', '✓', '✓'],
['x86_64 和 ARM64 架构', '✓', '✓'],
['兼容龙芯、openEuler 等', '✓', '✓'],
['监控和告警 API', '✓', '✓'],
]}
/>

### 生态系统

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版 (Community)', 'Databend 企业版 (Enterprise)']}
tbody={[
['驱动支持：Go、Java、Rust、JS、Python', '✓', '✓'],
['原生 REST API', '✓', '✓'],
['原生客户端 BendSQL', '✓', '✓'],
]}
/>

### 安全

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版 (Community)', 'Databend 企业版 (Enterprise)']}
tbody={[
['审计功能', '✓', '✓'],
['访问控制 RBAC', '✓', '✓'],
['密码强度和过期策略', '✓', '✓'],
['白名单管理', '✓', '✓'],
['存储加密', '✕', '✓'],
['数据动态掩码策略 (Masking Policy)', '✕', '✓'],
]}
/>

### 数据导入导出

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版 (Community)', 'Databend 企业版 (Enterprise)']}
tbody={[
['导入期间数据处理', '✓', '✓'],
['数据流', '✕', '✓'],
['CDC 实时数据导入', '✕', '✓'],
['数据导出格式', 'Parquet/ORC/CSV/NDJSON', 'Parquet/ORC/CSV/NDJSON'],
]}
/>

### 查询优化

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版 (Community)', 'Databend 企业版 (Enterprise)']}
tbody={[
['聚合查询加速优化', '✕', '✓'],
['JSON 查询加速优化', '✕', '✓'],
['预计算能力', '✕', '✓'],
]}
title="查询优化"
/>

### 存储优化

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版 (Community)', 'Databend 企业版 (Enterprise)']}
tbody={[
['冷热数据分离', '✕', '✓'],
['自动过期数据清理', '✕', '✓'],
['自动垃圾数据清理', '✕', '✓'],
]}
title="存储优化"
/>

### 客户支持

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版 (Community)', 'Databend 企业版 (Enterprise)']}
tbody={[
['24/7 支持和紧急响应', '✕', '✓'],
['部署和升级', '✕', '✓'],
['运维支持', '✕', '✓'],
]}
title="客户支持"
/>