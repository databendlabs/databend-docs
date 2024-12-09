---
title: 版本
---

import DatabendTable from '@site/src/components/DatabendTable';
import LanguageDocs from '@site/src/components/LanguageDocs';

Databend Cloud 提供三种版本：**基础版**、**商业版**和**专属版**，您可以根据不同的需求选择合适的版本，以确保最佳性能。

<LanguageDocs
cn=
'

如需快速了解这些版本，请访问 [https://www.databend.cn/databend-cloud](https://www.databend.cn/databend-cloud)。有关定价信息，请参阅 [定价与计费](/guides/overview/editions/dc/pricing)。有关各版本详细功能列表，请参阅 [功能列表](#feature-lists)。

'
en=
'

For a quick overview of these editions, see [https://www.databend.com/databend-cloud](https://www.databend.com/databend-cloud). For the pricing information, see [Pricing & Billing](/guides/overview/editions/dc/pricing). For the detailed feature list among these editions, see [Feature Lists](#feature-lists).

'/>

## 功能列表

以下是 Databend Cloud 各版本的功能列表：

#### 发布管理

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '基础版', '商业版', '专属版']}
tbody={[
[`每周新版本的早期访问，可在每次发布部署到生产账户之前用于额外的测试/验证。`, '', '✓', '✓']
]} />

#### 安全与治理

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '基础版', '商业版', '专属版']}
tbody={[
['SOC 1 Type I 认证。', '✓', '✓', '✓'],
['所有数据的自动加密。', '✓', '✓', '✓'],
['对象级访问控制。', '✓', '✓', '✓'],
['标准时间回溯（最长1天），用于访问/恢复修改和删除的数据。', '✓', '✓', '✓'],
['通过 Fail-safe 对修改/删除的数据进行灾难恢复（时间回溯之外的7天）。', '✓', '✓', '✓'],
['<b>扩展时间回溯</b>。', '', '90天', '90天'],
['列级安全，对表或视图中的列应用掩码策略。', '✓', '✓', '✓'],
['通过 Account Usage ACCESS_HISTORY 视图审计用户访问历史。', '✓', '✓', '✓'],
['<b>支持使用 AWS PrivateLink 进行私有连接到 Databend Cloud 服务</b>。', '', '✓', '✓'],
['<b>专用元数据存储和计算资源池（用于虚拟计算集群）</b>。', '', '', '✓'],
]}
/>

#### 计算资源

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '基础版', '商业版', '专属版']}
tbody={[
['虚拟计算集群，用于隔离查询和数据加载工作负载的独立计算集群。', '✓', '✓', '✓'],
['多集群扩展', '', '✓', '✓'],
['资源监控器，用于监控虚拟计算集群的信用使用情况。', '✓', '✓', '✓'],
]}
/>

#### SQL 支持

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '基础版', '商业版', '专属版']}
tbody={[
['标准 SQL，包括 SQL:1999 中定义的大多数 DDL 和 DML。', '✓', '✓', '✓'],
['高级 DML，如多表 INSERT、MERGE 和多重合并。', '✓', '✓', '✓'],
['广泛支持标准数据类型。', '✓', '✓', '✓'],
['对半结构化数据（JSON、ORC、Parquet）的原生支持。', '✓', '✓', '✓'],
['对地理空间数据的原生支持。', '✓', '✓', '✓'],
['对非结构化数据的原生支持。', '✓', '✓', '✓'],
['表列中字符串/文本数据的排序规则规则。', '✓', '✓', '✓'],
['多语句事务。', '✓', '✓', '✓'],
['用户定义函数（UDFs），支持 JavaScript、Python 和 WebAssembly。', '', '✓', '✓'],
['外部函数，用于扩展 Databend Cloud 到其他开发平台。', '✓', '✓', '✓'],
['Amazon API Gateway 私有端点用于外部函数。', '✓', '✓', '✓'],
['外部表，用于引用云存储数据湖中的数据。', '✓', '✓', '✓'],
['支持在大表中聚类数据以提高查询性能，并自动维护聚类。', '✓', '✓', '✓'],
['点查找查询的搜索优化，自动维护。', '✓', '✓', '✓'],
['物化视图，自动维护结果。', '✓', '✓', '✓'],
['Iceberg 表，用于引用云存储数据湖中的数据。', '✓', '✓', '✓'],
['模式检测，自动检测一组半结构化数据文件中的模式并检索列定义。', '✓', '✓', '✓'],
['模式演化，自动演化表以支持从数据源接收的新数据的结构。', '✓', '✓', '✓'],
['支持 <a href="/sql/sql-commands/ddl/table/ddl-create-table-external-location" target="_self">创建带有外部位置的表</a>。', '✓', '✓', '✓'],
['支持 <a href="/sql/sql-commands/ddl/table/attach-table" target="_self">ATTACH TABLE</a>。', '✓', '✓', '✓'],
]}
/>

#### 接口与工具

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '基础版', '商业版', '专属版']}
tbody={[
['下一代 SQL 工作表，用于高级查询开发、数据分析和可视化。', '✓', '✓', '✓'],
['BendSQL，用于构建/测试查询、加载/卸载批量数据和自动化 DDL 操作的命令行客户端。', '✓', '✓', '✓'],
['Rust、Python、Java、Node.js、.js、PHP 和 Go 的编程接口。', '✓', '✓', '✓'],
['对 JDBC 的原生支持。', '✓', '✓', '✓'],
['广泛的生态系统，用于连接 ETL、BI 和其他第三方供应商和技术。', '✓', '✓', '✓'],
]}
/>

#### 数据导入与导出

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '基础版', '商业版', '专属版']}
tbody={[
['从分隔的平面文件（CSV、TSV 等）和半结构化数据文件（JSON、ORC、Parquet）进行批量加载。', '✓', '✓', '✓'],
['批量卸载到分隔的平面文件和 JSON 文件。', '✓', '✓', '✓'],
['连续微批量加载。', '✓', '✓', '✓'],
['用于低延迟加载流数据的流式处理。', '✓', '✓', '✓'],
['Databend Cloud Connector for Kafka，用于从 Apache Kafka 主题加载数据。', '✓', '✓', '✓'],
]}
/>

#### 数据管道

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '基础版', '商业版', '专属版']}
tbody={[
['用于跟踪表更改的流。', '✓', '✓', '✓'],
['用于调度 SQL 语句执行的任务，通常与表流结合使用。', '✓', '✓', '✓'],
]}
/>

#### 客户支持

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '基础版', '商业版', '专属版']}
tbody={[
['记录和跟踪支持工单。', '✓', '✓', '✓'],
['4/7 覆盖率和严重性1问题的1小时响应窗口。', '✓', '✓', '✓'],
['<b>非严重性1问题的响应时间</b>。', '8h', '4h', '1h'],
]}
/>