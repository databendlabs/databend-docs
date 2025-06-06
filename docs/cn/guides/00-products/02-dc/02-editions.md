---
title: 版本
---

import DatabendTable from '@site/src/components/DatabendTable';
import LanguageDocs from '@site/src/components/LanguageDocs';

Databend Cloud 提供三个版本：**基础版（Personal）**、**企业版（Business）** 和 **专享版（Dedicated）**，您可以根据不同需求选择，确保为各种用例提供最佳性能。

<LanguageDocs
cn=
'
如需快速了解这些版本，请访问 [https://www.databend.cn/databend-cloud](https://www.databend.cn/databend-cloud)。有关定价信息，请参阅 [定价与计费](/guides/products/dc/pricing)。有关各版本详细功能列表，请参阅 [功能列表](#feature-lists)。
'
en=
'
For a quick overview of these editions, see [https://www.databend.com/databend-cloud](https://www.databend.com/databend-cloud). For the pricing information, see [Pricing & Billing](/guides/products/dc/pricing). For the detailed feature list among these editions, see [Feature Lists](#feature-lists).
'
/>

## 功能列表

以下是 Databend Cloud 各版本的功能列表：

#### 发布管理

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '基础版（Personal）', '企业版（Business）', '专享版（Dedicated）']}
tbody={[
[`提前访问每周新版本，可在每个版本部署到生产账户前进行额外测试或验证。`, '', '✓', '✓']
]} />

#### 安全与治理

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '基础版（Personal）', '企业版（Business）', '专享版（Dedicated）']}
tbody={[
['SOC 2 Type II 认证。', '✓', '✓', '✓'],
['GDPR。', '✓', '✓', '✓'],
['所有数据的自动加密。', '✓', '✓', '✓'],
['对象级访问控制。', '✓', '✓', '✓'],
['标准时间回溯（Time Travel）（最多 1 天），用于访问或恢复修改和删除的数据。', '✓', '✓', '✓'],
['通过故障安全（Fail-safe）实现修改或删除数据的灾难恢复（超出时间回溯 7 天）。', '✓', '✓', '✓'],
['<b>扩展时间回溯（Time Travel）</b>。', '', '90 天', '90 天'],
['列级安全，对表或视图中的列应用掩码策略。', '✓', '✓', '✓'],
['通过账户使用 ACCESS_HISTORY 视图审计用户访问历史。', '✓', '✓', '✓'],
['<b>支持使用 AWS PrivateLink 与 Databend Cloud 服务建立私有连接</b>。', '', '✓', '✓'],
['<b>专用元数据存储和计算资源池（用于虚拟计算集群）</b>。', '', '', '✓'],
]}
/>

#### 计算资源

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '基础版（Personal）', '企业版（Business）', '专享版（Dedicated）']}
tbody={[
['虚拟计算集群（Warehouse），用于隔离查询和数据加载工作负载的独立计算集群。', '✓', '✓', '✓'],
['多集群扩展。', '', '✓', '✓'],
['资源监控器，用于监控虚拟计算集群信用使用情况。', '✓', '✓', '✓'],
]}
/>

#### SQL 支持

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '基础版（Personal）', '企业版（Business）', '专享版（Dedicated）']}
tbody={[
['标准 SQL，包括 SQL:1999 中定义的大多数 DDL 和 DML。', '✓', '✓', '✓'],
['高级 DML，如多表 INSERT、MERGE 和多重合并。', '✓', '✓', '✓'],
['对标准数据类型的广泛支持。', '✓', '✓', '✓'],
['对半结构化数据（JSON、ORC、Parquet）的原生支持。', '✓', '✓', '✓'],
['对地理空间数据的原生支持。', '✓', '✓', '✓'],
['对非结构化数据的原生支持。', '✓', '✓', '✓'],
['表列中字符串或文本数据的排序规则。', '✓', '✓', '✓'],
['多语句事务。', '✓', '✓', '✓'],
['用户定义函数（UDF），支持 JavaScript、Python 和 WebAssembly。', '', '✓', '✓'],
['外部函数，用于将 Databend Cloud 扩展到其他开发平台。', '✓', '✓', '✓'],
['用于外部函数的 Amazon API Gateway 私有端点。', '✓', '✓', '✓'],
['外部表，用于引用云存储数据湖中的数据。', '✓', '✓', '✓'],
['支持在超大表中聚簇数据以提高查询性能，并自动维护聚簇。', '✓', '✓', '✓'],
['点查找查询的搜索优化，并自动维护。', '✓', '✓', '✓'],
['物化视图，自动维护结果。', '✓', '✓', '✓'],
['Iceberg 表，用于引用云存储数据湖中的数据。', '✓', '✓', '✓'],
['模式检测，自动检测暂存半结构化数据文件中的模式并检索列定义。', '✓', '✓', '✓'],
['模式演进，自动演进表以支持数据源的新数据结构。', '✓', '✓', '✓'],
['支持 <a href="/sql/sql-commands/ddl/table/ddl-create-table-external-location" target="_self">使用外部位置创建表</a>。', '✓', '✓', '✓'],
['支持 <a href="/sql/sql-commands/ddl/table/attach-table" target="_self">ATTACH TABLE</a>。', '✓', '✓', '✓'],
]}
/>

#### 接口与工具

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '基础版（Personal）', '企业版（Business）', '专享版（Dedicated）']}
tbody={[
['下一代 SQL 工作区，用于高级查询开发、数据分析和可视化。', '✓', '✓', '✓'],
['BendSQL，命令行客户端，用于构建或测试查询、加载或卸载批量数据及自动化 DDL 操作。', '✓', '✓', '✓'],
['Rust、Python、Java、Node.js、.js、PHP 和 Go 的编程接口。', '✓', '✓', '✓'],
['对 JDBC 的原生支持。', '✓', '✓', '✓'],
['广泛的生态系统，用于连接 ETL、BI 及其他第三方供应商和技术。', '✓', '✓', '✓'],
]}
/>

#### 数据导入与导出

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '基础版（Personal）', '企业版（Business）', '专享版（Dedicated）']}
tbody={[
['从分隔平面文件（CSV、TSV 等）和半结构化数据文件（JSON、ORC、Parquet）批量加载。', '✓', '✓', '✓'],
['批量卸载到分隔平面文件和 JSON 文件。', '✓', '✓', '✓'],
['连续微批处理加载。', '✓', '✓', '✓'],
['流式处理，用于低延迟加载流数据。', '✓', '✓', '✓'],
['Databend Cloud Connector for Kafka，用于从 Apache Kafka 主题加载数据。', '✓', '✓', '✓'],
]}
/>

#### 数据管道

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '基础版（Personal）', '企业版（Business）', '专享版（Dedicated）']}
tbody={[
['流，用于跟踪表变更。', '✓', '✓', '✓'],
['任务，用于调度 SQL 语句执行，通常与表流结合使用。', '✓', '✓', '✓'],
]}
/>

#### 客户支持

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '基础版（Personal）', '企业版（Business）', '专享版（Dedicated）']}
tbody={[
['记录和跟踪支持工单。', '✓', '✓', '✓'],
['严重级别 1 问题的 4/7 覆盖和 1 小时响应窗口。', '✓', '✓', '✓'],
['<b>非严重级别 1 问题的响应时间（小时）</b>。', '8h', '4h', '1h'],
]}
/>