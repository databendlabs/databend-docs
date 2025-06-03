---
title: 版本
---

import DatabendTable from '@site/src/components/DatabendTable';
import LanguageDocs from '@site/src/components/LanguageDocs';

Databend Cloud 提供 **Personal**、**Business** 和 **Dedicated** 三个版本，可满足多样化需求，确保不同使用场景下的最佳性能。

<LanguageDocs
cn=
'
如需快速了解各版本，请访问 [https://www.databend.cn/databend-cloud](https://www.databend.cn/databend-cloud)。定价信息请参阅 [定价与计费](/guides/products/dc/pricing)，详细功能列表请参见 [功能列表](#feature-lists)。
'
en=
'
For a quick overview of these editions, see [https://www.databend.com/databend-cloud](https://www.databend.com/databend-cloud). For the pricing information, see [Pricing & Billing](/guides/products/dc/pricing). For the detailed feature list among these editions, see [Feature Lists](#feature-lists).
'
/>

## 功能列表

以下是 Databend Cloud 各版本的功能对比：

#### 发布管理

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', 'Personal', 'Business', 'Dedicated']}
tbody={[
[`提前访问每周新版本，可在部署至生产环境前进行额外测试/验证。`, '', '✓', '✓']
]} />

#### 安全与治理

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', 'Personal', 'Business', 'Dedicated']}
tbody={[
['SOC 2 Type II 认证', '✓', '✓', '✓'],
['GDPR', '✓', '✓', '✓'],
['全量数据自动加密', '✓', '✓', '✓'],
['对象级访问控制', '✓', '✓', '✓'],
['标准时间回溯(Time Travel)（最长1天），用于访问/恢复修改或删除的数据', '✓', '✓', '✓'],
['通过 Fail-safe 实现修改/删除数据的灾难恢复（超出时间回溯7天）', '✓', '✓', '✓'],
['<b>扩展时间回溯</b>', '', '90 天', '90 天'],
['列级安全性，可为表/视图列应用掩码策略', '✓', '✓', '✓'],
['通过 Account Usage ACCESS_HISTORY 视图审计用户访问历史', '✓', '✓', '✓'],
['<b>支持通过 AWS PrivateLink 私有连接至 Databend Cloud 服务</b>', '', '✓', '✓'],
['<b>专用元数据存储与计算资源池（用于虚拟计算集群）</b>', '', '', '✓'],
]}
/>

#### 计算资源

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', 'Personal', 'Business', 'Dedicated']}
tbody={[
['虚拟计算集群(virtual warehouses)，隔离查询与数据加载工作负载', '✓', '✓', '✓'],
['多集群扩展', '', '✓', '✓'],
['监控虚拟计算集群信用使用量的资源监视器', '✓', '✓', '✓'],
]}
/>

#### SQL 支持

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', 'Personal', 'Business', 'Dedicated']}
tbody={[
['标准 SQL，支持 SQL:1999 定义的大部分 DDL 和 DML', '✓', '✓', '✓'],
['高级 DML（如多表 INSERT、MERGE 及多合并）', '✓', '✓', '✓'],
['广泛支持标准数据类型', '✓', '✓', '✓'],
['原生支持半结构化数据（JSON、ORC、Parquet）', '✓', '✓', '✓'],
['原生支持地理空间数据', '✓', '✓', '✓'],
['原生支持非结构化数据', '✓', '✓', '✓'],
['表列中字符串/文本数据的排序规则', '✓', '✓', '✓'],
['多语句事务', '✓', '✓', '✓'],
['用户自定义函数(UDF)，支持 JavaScript、Python 和 WebAssembly', '', '✓', '✓'],
['外部函数，支持扩展至其他开发平台', '✓', '✓', '✓'],
['外部函数的 Amazon API Gateway 私有端点', '✓', '✓', '✓'],
['引用云存储数据湖数据的外部表', '✓', '✓', '✓'],
['支持超大规模表数据聚类以提升查询性能，自动维护聚类', '✓', '✓', '✓'],
['点查询搜索优化，自动维护', '✓', '✓', '✓'],
['物化视图，结果自动维护', '✓', '✓', '✓'],
['引用云存储数据湖数据的 Iceberg 表', '✓', '✓', '✓'],
['Schema 检测：自动识别暂存半结构化数据文件结构并获取列定义', '✓', '✓', '✓'],
['Schema 演化：自动更新表结构以适应新数据源', '✓', '✓', '✓'],
['支持<a href="/sql/sql-commands/ddl/table/ddl-create-table-external-location" target="_self">通过外部位置创建表</a>', '✓', '✓', '✓'],
['支持 <a href="/sql/sql-commands/ddl/table/attach-table" target="_self">ATTACH TABLE</a>', '✓', '✓', '✓'],
]}
/>

#### 接口与工具

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', 'Personal', 'Business', 'Dedicated']}
tbody={[
['新一代 SQL 工作区，支持高级查询开发、数据分析与可视化', '✓', '✓', '✓'],
['命令行客户端 BendSQL，支持构建/测试查询、批量数据加载/卸载及 DDL 自动化', '✓', '✓', '✓'],
['Rust/Python/Java/Node.js/.js/PHP/Go 编程接口', '✓', '✓', '✓'],
['原生 JDBC 支持', '✓', '✓', '✓'],
['广泛生态连接 ETL、BI 及第三方技术', '✓', '✓', '✓'],
]}
/>

#### 数据导入与导出

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', 'Personal', 'Business', 'Dedicated']}
tbody={[
['从分隔文件（CSV/TSV 等）和半结构化文件（JSON/ORC/Parquet）批量导入', '✓', '✓', '✓'],
['批量导出至分隔文件与 JSON 文件', '✓', '✓', '✓'],
['持续微批导入', '✓', '✓', '✓'],
['流式数据低延迟导入', '✓', '✓', '✓'],
['Databend Cloud Connector for Kafka（支持 Apache Kafka 数据导入）', '✓', '✓', '✓'],
]}
/>

#### 数据管道

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', 'Personal', 'Business', 'Dedicated']}
tbody={[
['Streams：追踪表变更', '✓', '✓', '✓'],
['Tasks：调度 SQL 语句执行（常与表 Streams 配合使用）', '✓', '✓', '✓'],
]}
/>

#### 客户支持

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', 'Personal', 'Business', 'Dedicated']}
tbody={[
['支持工单记录与追踪', '✓', '✓', '✓'],
['Severity 1 问题：每周4天覆盖，1小时响应', '✓', '✓', '✓'],
['<b>非 Severity 1 问题响应时间</b>', '8h', '4h', '1h'],
]}
/>