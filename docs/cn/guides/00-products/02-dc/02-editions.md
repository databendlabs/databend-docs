```markdown
---
title: 版本
---

import DatabendTable from '@site/src/components/DatabendTable';
import LanguageDocs from '@site/src/components/LanguageDocs';

Databend Cloud 提供三个版本：**Personal**、**Business** 和 **Dedicated**，您可以选择适合的版本，以满足各种需求并确保不同使用场景的最佳性能。

<LanguageDocs
cn=
'

如需快速了解这些版本，请访问 [https://www.databend.cn/databend-cloud](https://www.databend.cn/databend-cloud)。有关定价信息，请参阅 [定价与计费](/guides/products/dc/pricing)。有关各版本详细功能列表，请参阅 [功能列表](#feature-lists)。

'
en=
'

For a quick overview of these editions, see [https://www.databend.com/databend-cloud](https://www.databend.com/databend-cloud). For the pricing information, see [Pricing & Billing](/guides/products/dc/pricing). For the detailed feature list among these editions, see [Feature Lists](#feature-lists).

'/>

## 功能列表

以下是 Databend Cloud 各个版本的功能列表：

#### 发布管理

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', 'Personal', 'Business', 'Dedicated']}
tbody={[
[`提前访问每周新版本，可在每个版本部署到您的生产帐户之前用于额外的测试/验证。`, '', '✓', '✓']
]} />

#### 安全与治理

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', 'Personal', 'Business', 'Dedicated']}
tbody={[
['SOC 2 Type II 认证。', '✓', '✓', '✓'],
['GDPR', '✓', '✓', '✓'],
['自动加密所有数据。', '✓', '✓', '✓'],
['对象级别访问控制。', '✓', '✓', '✓'],
['标准时间回溯（最长 1 天），用于访问/恢复修改和删除的数据。', '✓', '✓', '✓'],
['通过 Fail-safe 恢复修改/删除的数据（时间回溯后 7 天）。', '✓', '✓', '✓'],
['<b>扩展时间回溯</b>。', '', '90 天', '90 天'],
['列级别安全性，用于将 masking 策略应用于表或视图中的列。', '✓', '✓', '✓'],
['通过 Account Usage ACCESS_HISTORY 视图审计用户访问历史。', '✓', '✓', '✓'],
['<b>支持使用 AWS PrivateLink 私有连接到 Databend Cloud 服务</b>。', '', '✓', '✓'],
['<b>专用元数据存储和计算资源池（在虚拟计算集群中使用）</b>。', '', '', '✓'],
]}
/>

#### 计算资源

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', 'Personal', 'Business', 'Dedicated']}
tbody={[
['虚拟计算集群，用于隔离查询和数据加载工作负载的独立计算集群。', '✓', '✓', '✓'],
['多集群扩展', '', '✓', '✓'],
['用于监控虚拟计算集群信用使用情况的资源监视器。', '✓', '✓', '✓'],
]}
/>

#### SQL 支持

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', 'Personal', 'Business', 'Dedicated']}
tbody={[
['标准 SQL，包括 SQL:1999 中定义的大多数 DDL 和 DML。', '✓', '✓', '✓'],
['高级 DML，如多表 INSERT、MERGE 和多重合并。', '✓', '✓', '✓'],
['广泛支持标准数据类型。', '✓', '✓', '✓'],
['原生支持半结构化数据（JSON、ORC、Parquet）。', '✓', '✓', '✓'],
['原生支持地理空间数据。', '✓', '✓', '✓'],
['原生支持非结构化数据。', '✓', '✓', '✓'],
['表列中字符串/文本数据的排序规则。', '✓', '✓', '✓'],
['多语句事务。', '✓', '✓', '✓'],
['用户定义函数 (UDF)，支持 JavaScript、Python 和 WebAssembly。', '', '✓', '✓'],
['用于将 Databend Cloud 扩展到其他开发平台的外部函数。', '✓', '✓', '✓'],
['用于外部函数的 Amazon API Gateway 私有端点。', '✓', '✓', '✓'],
['用于引用云存储数据湖中数据的外部表。', '✓', '✓', '✓'],
['支持在非常大的表中对数据进行聚类以提高查询性能，并自动维护聚类。', '✓', '✓', '✓'],
['用于点查找查询的搜索优化，并自动维护。', '✓', '✓', '✓'],
['物化视图，自动维护结果。', '✓', '✓', '✓'],
['Iceberg 表，用于引用云存储数据湖中的数据。', '✓', '✓', '✓'],
['Schema detection，用于自动检测一组暂存的半结构化数据文件中的 schema 并检索列定义。', '✓', '✓', '✓'],
['Schema evolution，用于自动演化表以支持从数据源接收的新数据的结构。', '✓', '✓', '✓'],
['支持 <a href="/sql/sql-commands/ddl/table/ddl-create-table-external-location" target="_self">创建具有外部位置的表</a>。', '✓', '✓', '✓'],
['支持 <a href="/sql/sql-commands/ddl/table/attach-table" target="_self">ATTACH TABLE</a>。', '✓', '✓', '✓'],
]}
/>

#### 接口与工具

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', 'Personal', 'Business', 'Dedicated']}
tbody={[
['下一代 SQL worksheet，用于高级查询开发、数据分析和可视化。', '✓', '✓', '✓'],
['BendSQL，一个命令行客户端，用于构建/测试查询、加载/卸载批量数据以及自动化 DDL 操作。', '✓', '✓', '✓'],
['Rust、Python、Java、Node.js、.js、PHP 和 Go 的编程接口。', '✓', '✓', '✓'],
['原生支持 JDBC。', '✓', '✓', '✓'],
['广泛的生态系统，用于连接到 ETL、BI 和其他第三方供应商和技术。', '✓', '✓', '✓'],
]}
/>

#### 数据导入与导出

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', 'Personal', 'Business', 'Dedicated']}
tbody={[
['从分隔的平面文件（CSV、TSV 等）和半结构化数据文件（JSON、ORC、Parquet）批量加载。', '✓', '✓', '✓'],
['批量卸载到分隔的平面文件和 JSON 文件。', '✓', '✓', '✓'],
['连续微批加载。', '✓', '✓', '✓'],
['用于低延迟加载流数据的流式传输。', '✓', '✓', '✓'],
['Databend Cloud Connector for Kafka，用于从 Apache Kafka 主题加载数据。', '✓', '✓', '✓'],
]}
/>

#### 数据管道

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', 'Personal', 'Business', 'Dedicated']}
tbody={[
['用于跟踪表更改的流。', '✓', '✓', '✓'],
['用于调度 SQL 语句执行的任务，通常与表流结合使用。', '✓', '✓', '✓'],
]}
/>

#### 客户支持

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', 'Personal', 'Business', 'Dedicated']}
tbody={[
['日志记录和跟踪支持票证。', '✓', '✓', '✓'],
['4/7 覆盖和 1 小时响应窗口，适用于 1 级严重性问题。', '✓', '✓', '✓'],
['<b>在数小时内响应非 1 级严重性问题</b>。', '8h', '4h', '1h'],
]}
/>
```