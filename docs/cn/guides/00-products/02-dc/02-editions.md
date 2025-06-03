---
title: 版本
---

import DatabendTable from '@site/src/components/DatabendTable';
import LanguageDocs from '@site/src/components/LanguageDocs';

Databend Cloud 提供三种版本：**个人版**、**企业版**和**专属版**，可满足不同场景需求，为各类使用场景提供最优性能。

<LanguageDocs
cn='
如需快速了解各版本特性，请访问 [https://www.databend.cn/databend-cloud](https://www.databend.cn/databend-cloud)。定价详情请参阅[计费说明](/guides/products/dc/pricing)，完整功能对比请查看[功能列表](#feature-lists)。
'
en='
For a quick overview of these editions, see [https://www.databend.com/databend-cloud](https://www.databend.com/databend-cloud). For the pricing information, see [Pricing & Billing](/guides/products/dc/pricing). For the detailed feature list among these editions, see [Feature Lists](#feature-lists).
'/>

## 功能列表

以下是 Databend Cloud 各版本功能对比：

#### 版本管理

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '个人版', '企业版', '专属版']}
tbody={[
[`每周新版本抢先体验，可在生产环境部署前进行额外测试验证`, '', '✓', '✓']
]} />

#### 安全合规

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '个人版', '企业版', '专属版']}
tbody={[
['SOC 2 Type II 认证', '✓', '✓', '✓'],
['GDPR 合规', '✓', '✓', '✓'],
['全量数据自动加密', '✓', '✓', '✓'],
['对象级访问控制', '✓', '✓', '✓'],
['标准时间旅行（最长24小时）用于访问/恢复修改删除的数据', '✓', '✓', '✓'],
['通过故障安全机制实现数据灾难恢复（时间旅行后7天内）', '✓', '✓', '✓'],
['<b>扩展时间旅行</b>', '', '90天', '90天'],
['列级安全策略，支持对表/视图列数据脱敏', '✓', '✓', '✓'],
['通过ACCOUNT_USAGE.ACCESS_HISTORY视图审计用户访问记录', '✓', '✓', '✓'],
['<b>支持通过AWS PrivateLink建立私有连接</b>', '', '✓', '✓'],
['<b>专属元数据存储与计算资源池（用于虚拟仓库）</b>', '', '', '✓'],
]}
/>

#### 计算资源

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '个人版', '企业版', '专属版']}
tbody={[
['虚拟仓库，独立计算集群隔离查询与数据加载工作负载', '✓', '✓', '✓'],
['多集群弹性扩展', '', '✓', '✓'],
['资源监控器，实时追踪虚拟仓库资源消耗', '✓', '✓', '✓'],
]}
/>

#### SQL 支持

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '个人版', '企业版', '专属版']}
tbody={[
['标准SQL语法，兼容SQL:1999规范定义的DDL/DML', '✓', '✓', '✓'],
['高级DML操作（多表INSERT、MERGE等）', '✓', '✓', '✓'],
['全面支持标准数据类型', '✓', '✓', '✓'],
['原生半结构化数据支持（JSON/ORC/Parquet）', '✓', '✓', '✓'],
['原生地理空间数据支持', '✓', '✓', '✓'],
['原生非结构化数据支持', '✓', '✓', '✓'],
['表列字符串排序规则配置', '✓', '✓', '✓'],
['多语句事务支持', '✓', '✓', '✓'],
['用户定义函数（支持JavaScript/Python/WebAssembly）', '', '✓', '✓'],
['外部函数扩展，支持对接其他开发平台', '✓', '✓', '✓'],
['Amazon API Gateway私有端点支持外部函数', '✓', '✓', '✓'],
['外部表功能，支持引用云存储数据湖', '✓', '✓', '✓'],
['自动维护的大表数据聚类优化', '✓', '✓', '✓'],
['自动维护的点查询搜索优化', '✓', '✓', '✓'],
['自动更新的物化视图', '✓', '✓', '✓'],
['Iceberg表支持', '✓', '✓', '✓'],
['半结构化数据模式自动检测', '✓', '✓', '✓'],
['表结构自动演进', '✓', '✓', '✓'],
['支持<a href="/sql/sql-commands/ddl/table/ddl-create-table-external-location" target="_self">创建外部位置表</a>', '✓', '✓', '✓'],
['支持<a href="/sql/sql-commands/ddl/table/attach-table" target="_self">ATTACH TABLE</a>操作', '✓', '✓', '✓'],
]}
/>

#### 接口工具

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '个人版', '企业版', '专属版']}
tbody={[
['新一代SQL工作台，支持高级查询开发与数据分析可视化', '✓', '✓', '✓'],
['BendSQL命令行工具，支持查询测试/批量数据操作/DDL自动化', '✓', '✓', '✓'],
['多语言SDK（Rust/Python/Java/Node.js/PHP/Go）', '✓', '✓', '✓'],
['原生JDBC驱动支持', '✓', '✓', '✓'],
['丰富的ETL/BI生态集成', '✓', '✓', '✓'],
]}
/>

#### 数据集成

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '个人版', '企业版', '专属版']}
tbody={[
['批量导入（CSV/TSV/JSON/ORC/Parquet等格式）', '✓', '✓', '✓'],
['批量导出（分隔文件/JSON格式）', '✓', '✓', '✓'],
['持续微批处理导入', '✓', '✓', '✓'],
['流式数据低延迟接入', '✓', '✓', '✓'],
['Kafka连接器（Apache Kafka数据源支持）', '✓', '✓', '✓'],
]}
/>

#### 数据管道

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '个人版', '企业版', '专属版']}
tbody={[
['数据变更流（Streams）', '✓', '✓', '✓'],
['定时任务（Tasks），支持结合数据流调度SQL执行', '✓', '✓', '✓'],
]}
/>

#### 技术支持

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '个人版', '企业版', '专属版']}
tbody={[
['工单系统支持', '✓', '✓', '✓'],
['7×4小时服务，P1级问题1小时响应', '✓', '✓', '✓'],
['<b>非P1问题响应时效</b>', '8小时', '4小时', '1小时'],
]}
/>