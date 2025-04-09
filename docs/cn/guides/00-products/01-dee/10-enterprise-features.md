---
title: 企业功能
---

import DatabendTable from '@site/src/components/DatabendTable';

本页提供了可用企业功能的最新列表。要访问这些功能，您需要企业版或试用版许可证。有关更多详细信息，请参见 [Databend 授权](20-license.md)。

### 企业功能列表


| 功能                                                                             | 分类           | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Vacuum Temp Files](/sql/sql-commands/administration-cmds/vacuum-temp-files)      | 存储           | - 通过删除临时文件（特别是 join、aggregate 和 sort spill 文件）来释放存储空间。<br/>- 根据需要设置保留期限和文件限制。                                                                                                                                                                                                                                                                                                                             |
| [Vacuum Dropped Table](/sql/sql-commands/ddl/table/vacuum-drop-table)             | 存储           | 通过删除已删除表的数据文件来优化存储。提供恢复选项和 dry-run 预览。                                                                                                                                                                                                                                                                                                                                                                                             |
| [Vacuum Historical Data](/sql/sql-commands/ddl/table/vacuum-table)                | 存储           | 深度清理您的存储空间：<br/>- 删除孤立的 segment 和 block 文件。<br/>- 使用 dry-run 选项安全地预览数据文件的删除。                                                                                                                                                                                                                                                                                                                    |
| [Virtual Column](/sql/sql-commands/ddl/virtual-column)                            | 查询           | 提高查询 Variant 数据的效率：<br/>- 虚拟列简化了查询，无需遍历整个嵌套结构。直接数据检索加速了查询执行。<br/>- 虚拟列显著减少了 Variant 数据中的内存使用，降低了内存溢出的风险。                                                                                                                                                                                                                                                                                 |
| [Aggregating Index](/sql/sql-commands/ddl/aggregating-index)                      | 查询           | 使用聚合索引提高查询速度：<br/>- 通过预计算和索引的聚合来增强查询。<br/>- 自定义索引以满足您独特的数据分析需求。                                                                                                                                                                                                                                                                                                                                   |
| [Computed Column](/sql/sql-commands/ddl/table/ddl-create-table#computed-columns)  | 查询           | 通过允许从现有列派生新列，计算列可以节省您的时间和精力：<br/>- 自动更新确保准确和一致的数据。<br/>- 现在可以在数据库中执行高级分析和计算。<br/>- 两种类型的计算列：存储列和虚拟列。虚拟列在查询时按需计算，从而节省空间。                                                                                                                                                                                                          |
| [Python UDF](/guides/query/udf#python-requires-databend-enterprise)               | 查询           | Python UDF 允许您通过 Databend 的内置处理程序从 SQL 查询中调用 Python 代码，从而在 SQL 查询中无缝集成 Python 逻辑。                                                                                                                                                                                                                                                                                                   |
| [ATTACH TABLE](/sql/sql-commands/ddl/table/attach-table)                          | 查询           | Attach Table 使您能够无缝地将云服务平台中的表连接到私有化部署环境中已部署的现有表，而无需物理移动数据。                                                                                                                                                                                                                                                                                                    |
| [Stream](/sql/sql-commands/ddl/stream)                                            | 数据流         | 使用 stream 实现高效的数据变更管理：<br/>- 支持仅追加模式：实时捕获数据插入。<br/>- 无缝利用 stream 进行直接查询和分析，确保快速洞察。                                                                                                                                                                                                                                                                                                           |
| [Masking Policy](/sql/sql-commands/ddl/mask-policy/)                              | 安全           | 通过基于角色的 masking 功能增强您的数据安全性：<br/>- 通过可自定义的数据 masking 保护敏感信息。<br/>- 在加强安全性的同时保持数据的可用性。                                                                                                                                                                                                                                                                           |
| Storage Encryption                                                                | 安全           | 增强服务器端数据加密的安全性，保护您的数据免受存储供应商的未经授权的访问：<br/>- 选择通过服务管理的密钥、KMS 管理的密钥或客户管理的密钥进行加密。选项可能因存储类型而异。<br/>- 目前在阿里云 OSS 上受支持。<br/>有关每个存储供应商的加密参数，请参阅 [部署指南](../../10-deploy/01-deploy/01-non-production/01-deploying-databend.md)。 |
| [Fail-Safe](/guides/security/fail-safe)                                           | 安全           | 从 S3 兼容的对象存储中恢复表数据。                                                                                                                                                                                                                                                                                                                                                                                                                    |
| [BendSave](/guides/data-management/data-recovery#bendsave) |  恢复 | BendSave 是一个命令行工具，用于备份和恢复 Databend 中的元数据和实际数据文件。 |

## Databend 社区版 vs. 企业版

本节比较了 Databend 社区版和 Databend 企业版在以下模块中的功能：

### 核心功能

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['分布式元数据管理', '✓', '✓'],
['分布式 SQL 引擎', '✓', '✓'],
['分布式存储引擎', '✓', '✓'],
['分布式调度引擎', '✓', '✓'],
['Vectorized Engine', '✓', '✓'],
['分布式事务', '✓', '✓'],
['多版本数据', '✓', '✓'],
['时间回溯', '✓', '✓'],
['性能优化器', '✓', '✓'],
['多租户和权限管理', '✓', '✓'],
['标准数据类型', '✓', '✓'],
['半结构化数据类型 (JSON)', '✓', '✓'],
['非结构化数据类型', 'Parquet/CSV/TSV/JSON/ORC', 'Parquet/CSV/TSV/JSON/ORC'],
['高级压缩', '✓', '✓'],
['Vector Storage', '✓', '✓'],
['Apache Hive Query', '✓', '✓'],
['Apache Iceberg Query', '✓', '✓'],
['半结构化数据查询', '✓', '✓'],
['外部用户自定义函数', '✓', '✓'],
['大查询资源隔离保护 (Spill)', '✓', '✓'],
]}
/>

### 扩展功能

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['集群模式', '✕', '✓'],
['物化视图', '✕', '✓'],
['AI 功能 (情感分析、数据标注等)', '✕', '✓ (HuggingFace 开源模型)']
]}
/>

### 部署

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['部署支持: K8s, 裸金属, 安装程序', '✓', '✓'],
['后端存储支持: S3, Azblob, GCS, OSS, COS, HDFS', '✓', '✓'],
['x86_64 & ARM64 架构', '✓', '✓'],
['兼容 LoongArch, openEuler 等', '✓', '✓'],
['监控和告警 APIs', '✓', '✓'],
]}
/>

### 生态系统

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['驱动支持: Go, Java, Rust, JS, Python', '✓', '✓'],
['原生 REST APIs', '✓', '✓'],
['原生客户端 BendSQL', '✓', '✓'],
]}
/>

### 安全性

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['审计功能', '✓', '✓'],
['访问控制 RBAC', '✓', '✓'],
['密码强度和过期策略', '✓', '✓'],
['白名单管理', '✓', '✓'],
['存储加密', '✕', '✓'],
['数据动态脱敏策略', '✕', '✓'],
]}
/>

### 数据导入 & 导出

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['导入期间的数据处理', '✓', '✓'],
['数据流式传输', '✕', '✓'],
['CDC 实时数据导入', '✕', '✓'],
['数据导出格式', 'Parquet/ORC/CSV/NDJSON', 'Parquet/ORC/CSV/NDJSON'],
]}
/>

### 查询优化

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
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
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['冷/热数据分离', '✕', '✓'],
['自动过期数据清理', '✕', '✓'],
['自动垃圾数据清理', '✕', '✓'],
]}
title="存储优化"
/>

### 客户支持

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版', 'Databend 企业版']}
tbody={[
['24/7 支持 & 紧急响应', '✕', '✓'],
['部署和升级', '✕', '✓'],
['运维支持', '✕', '✓'],
]}
title="客户支持"
/>