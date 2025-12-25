---
title: 版本
---

import DatabendTable from '@site/src/components/DatabendTable';
import LanguageDocs from '@site/src/components/LanguageDocs';

Databend Cloud 提供三个版本：**基础版（Personal）**、**企业版（Business）** 和 **专享版（Dedicated）**，您可以根据不同的需求和使用场景选择合适的版本，以确保最佳性能。

<LanguageDocs
cn=
'

如需快速了解这些版本，请访问 [https://www.databend.cn/databend-cloud](https://www.databend.cn/databend-cloud)。有关定价信息，请参阅 [定价与计费](/guides/overview/dc/pricing)。有关各版本详细功能列表，请参阅 [功能列表](#feature-lists)。

'
en=
'

For a quick overview of these editions, see [https://www.databend.com/databend-cloud](https://www.databend.com/databend-cloud). For the pricing information, see [Pricing & Billing](/guides/overview/dc/pricing). For the detailed feature list among these editions, see [Feature Lists](#feature-lists).

'/>

## 功能列表

以下是 Databend Cloud 各版本的功能列表：

#### 发布管理

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '基础版', '企业版', '专享版']}
tbody={[
[`提前体验每周发布的新版本，以便在部署到生产账户前进行额外的测试/验证。`, '', '✓', '✓']
]} />

#### 安全与治理

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '基础版', '企业版', '专享版']}
tbody={[
['SOC 2 Type II 认证。', '✓', '✓', '✓'],
['GDPR', '✓', '✓', '✓'],
['所有数据自动加密。', '✓', '✓', '✓'],
['对象级访问控制 (Object-level Access Control)。', '✓', '✓', '✓'],
['标准时间回溯（Time Travel）（最长 1 天），用于访问/恢复已修改和已删除的数据。', '✓', '✓', '✓'],
['通过 Fail-safe 对已修改/已删除的数据进行灾难恢复（在时间回溯（Time Travel）之外提供 7 天的数据保护）。', '✓', '✓', '✓'],
['<b>扩展时间回溯（Time Travel）</b>。', '', '90 天', '90 天'],
['列级安全（Column-level Security），用于对表或视图中的列应用掩码策略。', '✓', '✓', '✓'],
['通过 `Account Usage ACCESS_HISTORY` 视图审计用户访问历史。', '✓', '✓', '✓'],
['<b>支持使用 AWS PrivateLink 与 Databend Cloud 服务建立私有连接</b>。', '', '✓', '✓'],
['<b>专用的元数据存储和计算资源池（用于计算集群（virtual warehouses））</b>。', '', '', '✓'],
]}
/>

#### 计算资源

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '基础版', '企业版', '专享版']}
tbody={[
['计算集群（Virtual warehouses），用于隔离查询和数据加载工作负载的独立计算集群。', '✓', '✓', '✓'],
['多集群伸缩', '', '✓', '✓'],
['资源监视器，用于监控计算集群（virtual warehouse）的信用点数使用情况。', '✓', '✓', '✓'],
]}
/>

#### SQL 支持

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '基础版', '企业版', '专享版']}
tbody={[
['标准 SQL，包括 SQL:1999 中定义的大多数 DDL 和 DML。', '✓', '✓', '✓'],
['高级 DML，例如多表 INSERT、MERGE 和 multi-merge。', '✓', '✓', '✓'],
['广泛支持标准数据类型。', '✓', '✓', '✓'],
['原生支持半结构化数据（JSON、ORC、Parquet）。', '✓', '✓', '✓'],
['原生支持地理空间数据。', '✓', '✓', '✓'],
['原生支持非结构化数据。', '✓', '✓', '✓'],
['表列中字符串/文本数据的排序规则。', '✓', '✓', '✓'],
['多语句事务。', '✓', '✓', '✓'],
['用户定义函数（UDFs），支持 JavaScript、Python 和 WebAssembly。', '', '✓', '✓'],
['外部函数 (External Functions)，用于将 Databend Cloud 扩展到其他开发平台。', '✓', '✓', '✓'],
['用于外部函数的 Amazon API Gateway 私有端点。', '✓', '✓', '✓'],
['外部表 (External Tables)，用于引用云存储数据湖中的数据。', '✓', '✓', '✓'],
['支持对超大表中的数据进行聚簇 (Clustering) 以提高查询性能，并自动维护聚簇。', '✓', '✓', '✓'],
['针对点查询 (Point Lookup Queries) 的搜索优化，并自动维护。', '✓', '✓', '✓'],
['物化视图，并自动维护结果。', '✓', '✓', '✓'],
['Iceberg 表，用于引用云存储数据湖中的数据。', '✓', '✓', '✓'],
['模式检测（Schema detection），用于自动检测暂存区（Stage）中一组半结构化数据文件的模式并检索列定义。', '✓', '✓', '✓'],
['模式演进（Schema evolution），用于自动演进表以支持从数据源接收的新数据结构。', '✓', '✓', '✓'],
['支持<a href="/sql/sql-commands/ddl/table/ddl-create-table-external-location" target="_self">使用外部位置创建表</a>。', '✓', '✓', '✓'],
['支持 <a href="/sql/sql-commands/ddl/table/attach-table" target="_self">ATTACH TABLE</a>。', '✓', '✓', '✓'],
]}
/>

#### 接口与工具

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '基础版', '企业版', '专享版']}
tbody={[
['新一代 SQL 工作区（worksheet），用于高级查询开发、数据分析和可视化。', '✓', '✓', '✓'],
['BendSQL，一个命令行客户端，用于构建/测试查询、批量加载/卸载数据以及自动化 DDL 操作。', '✓', '✓', '✓'],
['为 Rust、Python、Java、Node.js、.js、PHP 和 Go 提供的编程接口。', '✓', '✓', '✓'],
['原生支持 JDBC。', '✓', '✓', '✓'],
['广泛的生态系统，可连接到 ETL、BI 和其他第三方供应商及技术。', '✓', '✓', '✓'],
]}
/>

#### 数据导入与导出

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '基础版', '企业版', '专享版']}
tbody={[
['从分隔的平面文件（CSV、TSV 等）和半结构化数据文件（JSON、ORC、Parquet）批量加载。', '✓', '✓', '✓'],
['批量卸载到分隔的平面文件和 JSON 文件。', '✓', '✓', '✓'],
['连续微批加载。', '✓', '✓', '✓'],
['流式处理（Streaming），用于流式数据的低延迟加载。', '✓', '✓', '✓'],
['Databend Cloud Connector for Kafka，用于从 Apache Kafka 主题加载数据。', '✓', '✓', '✓'],
]}
/>

#### 数据 Pipeline（流水线）

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '基础版', '企业版', '专享版']}
tbody={[
['流（Streams），用于跟踪表变更。', '✓', '✓', '✓'],
['任务（Tasks），用于调度 SQL 语句的执行，通常与表流结合使用。', '✓', '✓', '✓'],
]}
/>

#### 客户支持

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '基础版', '企业版', '专享版']}
tbody={[
['记录和跟踪支持工单。', '✓', '✓', '✓'],
['为严重性 1 级问题 (Severity 1 Issues) 提供 4/7 全天候覆盖和 1 小时响应窗口。', '✓', '✓', '✓'],
['<b>对非严重性 1 级问题的响应时间（小时）</b>。', '8h', '4h', '1h'],
]}
/>