---
title: 企业版功能
---

import DatabendTable from '@site/src/components/DatabendTable';

本页提供了可用的企业版功能的最新列表。要使用这些功能，您需要企业版或试用版许可证。有关更多详细信息，请参阅 [Databend 许可证](20-license.md)。

### 企业版功能列表

| 功能                                                                          | 类别       | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------------------------------------------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [审计追踪（Audit Trail）](/guides/security/audit-trail)                                     | 安全与合规 | 通过全面的审计日志监控数据库活动，以确保合规性和安全性。                                                                                                                                                                                                                                                                                                                                                                                   |
| [脱敏策略（Masking Policy）](/sql/sql-commands/ddl/mask-policy/)                             | 安全与合规 | 使用基于角色的脱敏策略保护敏感数据。                                                                                                                                                                                                                                                                                                                                                                                                                |
| 存储加密                                                               | 安全与合规 | 使用服务管理、KMS 或客户管理的密钥对静态数据进行加密。                                                                                                                                                                                                                                                                                                                                                                                               |
| [BendSave](/guides/data-management/data-recovery#bendsave) | 灾难恢复 | 备份和恢复整个 Databend 集群数据以进行灾难恢复。 |
| [故障安全（Fail-Safe）](/guides/security/fail-safe)                                          | 灾难恢复  | 从兼容 S3 的对象存储中恢复丢失或意外删除的数据。                                                                                                                                                                                                                                                                                                                                                                                            |
| [聚合索引（Aggregating Index）](/sql/sql-commands/ddl/aggregating-index)                     | 查询性能  | 通过预计算和索引聚合来加速查询。                                                                                                                                                                                                                                                                                                                                                                                                             |
| [全文索引（Full-Text Index）](/guides/performance/fulltext-index)                           | 查询性能  | 通过倒排索引和相关性评分实现闪电般的文本搜索。                                                                                                                                                                                                                                                                                                                                                                                          |
| [Ngram 索引](/guides/performance/ngram-index)                                  | 查询性能  | 通过通配符搜索加速 LIKE 模式匹配查询。                                                                                                                                                                                                                                                                                                                                                                                                        |
| [虚拟列（Virtual Column）](/sql/sql-commands/ddl/virtual-column)                          | 查询性能  | 通过对 VARIANT 数据的零配置性能优化，自动加速 JSON 查询。                                                                                                                                                                                                                                                                                                                                                                |
| [动态列（Dynamic Column）](/sql/sql-commands/ddl/table/ddl-create-table#computed-columns)  | 查询性能  | 通过存储或虚拟计算模式，从标量表达式自动生成列。                                                                                                                                                                                                                                                                                                                                                                         |
| [Python UDF](/guides/query/udf#python-requires-databend-enterprise)              | 高级分析 | 使用内置处理程序在 SQL 查询中执行 Python 代码。                                                                                                                                                                                                                                                                                                                                                                                                          |
| [ATTACH TABLE](/sql/sql-commands/ddl/table/attach-table)                         | 数据共享       | 创建到现有表数据的只读链接，实现跨环境的零拷贝访问。                                                                                                                                                                                                                                                                                                                                                                                |
| [流（Stream）](/sql/sql-commands/ddl/stream)                                           | 变更数据捕获 | 跟踪和捕获表更改，以进行增量数据处理。                                                                                                                                                                                                                                                                                                                                                                                                        |
| [Vacuum Temp Files](/sql/sql-commands/administration-cmds/vacuum-temp-files)     | 存储管理 | 清理临时文件（连接、聚合、排序溢出）以释放存储空间。                                                                                                                                                                                                                                                                                                                                                                                          |
| [Vacuum Dropped Table](/sql/sql-commands/ddl/table/vacuum-drop-table)            | 存储管理 | 删除已删除表的数据文件以优化存储，并提供恢复选项。                                                                                                                                                                                                                                                                                                                                                                                           |
| [Vacuum Historical Data](/sql/sql-commands/ddl/table/vacuum-table)               | 存储管理 | 移除孤立的段和块文件，以深度清理存储空间。                                                                                                                                                                                                                                                                                                                                                                                                      |

## Databend 社区版（Community） vs. 企业版（Enterprise）

本节在以下模块中对 Databend 社区版（Community）和 Databend 企业版（Enterprise）进行比较：

### 核心功能

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版（Community）', 'Databend 企业版（Enterprise）']}
tbody={[
['分布式元数据管理', '✓', '✓'],
['分布式 SQL 引擎', '✓', '✓'],
['分布式存储引擎', '✓', '✓'],
['分布式调度引擎', '✓', '✓'],
['向量化引擎', '✓', '✓'],
['分布式事务（Transaction）', '✓', '✓'],
['多版本数据', '✓', '✓'],
['时间回溯（Time Travel）', '✓', '✓'],
['性能优化器', '✓', '✓'],
['多租户与权限管理', '✓', '✓'],
['标准数据类型', '✓', '✓'],
['半结构化数据类型 (JSON)', '✓', '✓'],
['非结构化数据类型', 'Parquet/CSV/TSV/JSON/ORC/AVRO', 'Parquet/CSV/TSV/JSON/ORC/AVRO'],
['高级压缩（Compression）', '✓', '✓'],
['向量存储', '✓', '✓'],
['Apache Hive 查询（Query）', '✓', '✓'],
['Apache Iceberg 查询（Query）', '✓', '✓'],
['半结构化数据查询（Query）', '✓', '✓'],
['外部用户定义函数', '✓', '✓'],
['大查询（Query）资源隔离保护 (Spill)', '✓', '✓'],
]}
/>

### 扩展功能

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版（Community）', 'Databend 企业版（Enterprise）']}
tbody={[
['集群模式', '✕', '✓'],
['物化视图（Materialized View）', '✕', '✓'],
['AI 函数（情感分析、数据标注等）', '✕', '✓ (HuggingFace 开源模型)'],
['Python UDF (高级分析)', '✕', '✓'],
]}
/>

### 部署

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版（Community）', 'Databend 企业版（Enterprise）']}
tbody={[
['部署支持：K8s、裸金属、安装程序', '✓', '✓'],
['后端存储支持：S3、Azblob、GCS、OSS、COS', '✓', '✓'],
['x86_64 & ARM64 架构', '✓', '✓'],
['兼容龙芯、openEuler 等', '✓', '✓'],
['监控与告警 API', '✓', '✓'],
]}
/>

### 生态系统

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版（Community）', 'Databend 企业版（Enterprise）']}
tbody={[
['驱动支持：Go、Java、Rust、JS、Python', '✓', '✓'],
['原生 REST API', '✓', '✓'],
['原生客户端 BendSQL', '✓', '✓'],
]}
/>

### 安全性

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版（Community）', 'Databend 企业版（Enterprise）']}
tbody={[
['基础审计功能', '✓', '✓'],
['全面的审计追踪（Audit Trail）（系统历史表）', '✕', '✓'],
['访问控制 RBAC', '✓', '✓'],
['密码强度与过期策略', '✓', '✓'],
['白名单管理', '✓', '✓'],
['存储加密', '✕', '✓'],
['数据动态脱敏策略', '✕', '✓'],
]}
/>

### 数据集成与共享

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版（Community）', 'Databend 企业版（Enterprise）']}
tbody={[
['导入时数据处理', '✓', '✓'],
['流（Stream）（变更数据捕获）', '✕', '✓'],
['CDC 实时数据导入', '✕', '✓'],
['ATTACH TABLE (零拷贝数据共享)', '✕', '✓'],
['数据导出格式', 'Parquet/ORC/CSV/NDJSON', 'Parquet/ORC/CSV/NDJSON'],
]}
/>

### 查询性能

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版（Community）', 'Databend 企业版（Enterprise）']}
tbody={[
['聚合索引（Aggregating Index）（预计算聚合）', '✕', '✓'],
['全文索引（Full-Text Index）（文本搜索）', '✕', '✓'],
['Ngram 索引（模式匹配）', '✕', '✓'],
['虚拟列（Virtual Column）（JSON 查询加速）', '✕', '✓'],
['动态列（Dynamic Column）（计算列）', '✕', '✓'],
]}
title="查询性能"
/>

### 存储管理与灾难恢复

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版（Community）', 'Databend 企业版（Enterprise）']}
tbody={[
['冷热数据分离', '✕', '✓'],
['自动过期数据清理', '✕', '✓'],
['自动垃圾数据清理', '✕', '✓'],
['BendSave (集群备份与恢复)', '✕', '✓'],
['故障安全（Fail-Safe）（从对象存储恢复数据）', '✕', '✓'],
]}
title="存储管理与灾难恢复"
/>

### 客户支持

<DatabendTable
width={['70%', '15%', '15%']}
thead={['功能', 'Databend 社区版（Community）', 'Databend 企业版（Enterprise）']}
tbody={[
['24/7 支持与紧急响应', '✕', '✓'],
['部署与升级', '✕', '✓'],
['运维支持', '✕', '✓'],
]}
title="客户支持"
/>