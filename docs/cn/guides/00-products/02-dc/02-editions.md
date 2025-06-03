---
title: 版本
---

import DatabendTable from '@site/src/components/DatabendTable';
import LanguageDocs from '@site/src/components/LanguageDocs';

Databend Cloud 提供三种版本：**个人版**、**企业版**和**专属版**，满足不同场景需求，为各类使用场景提供最优性能。

<LanguageDocs
cn=
'
快速了解各版本特性，请访问 [https://www.databend.cn/databend-cloud](https://www.databend.cn/databend-cloud)。定价详情参见 [定价与计费](/guides/products/dc/pricing)。完整功能对比请查阅 [功能列表](#feature-lists)。
'
en=
'
For a quick overview of these editions, see [https://www.databend.com/databend-cloud](https://www.databend.com/databend-cloud). For the pricing information, see [Pricing & Billing](/guides/products/dc/pricing). For the detailed feature list among these editions, see [Feature Lists](#feature-lists).
'/>

## 功能列表

以下是 Databend Cloud 各版本功能对比：

#### 发布管理

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '个人版', '企业版', '专属版']}
tbody={[
[`每周新版本提前体验，支持生产环境部署前进行额外测试/验证`, '', '✓', '✓']
]} />

#### 安全与治理

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '个人版', '企业版', '专属版']}
tbody={[
['SOC 2 Type II 认证', '✓', '✓', '✓'],
['GDPR 合规', '✓', '✓', '✓'],
['全量数据自动加密', '✓', '✓', '✓'],
['对象级访问控制', '✓', '✓', '✓'],
['标准时间旅行（最长1天），支持访问/恢复修改或删除的数据', '✓', '✓', '✓'],
['故障安全（Fail-safe）机制，支持时间旅行后7天内的数据灾难恢复', '✓', '✓', '✓'],
['<b>扩展时间旅行</b>', '', '90 天', '90 天'],
['列级安全策略，支持对表/视图列数据脱敏', '✓', '✓', '✓'],
['通过 ACCESS_HISTORY 视图审计用户访问记录', '✓', '✓', '✓'],
['<b>支持通过 AWS PrivateLink 建立私有连接</b>', '', '✓', '✓'],
['<b>专属元数据存储与计算资源池（用于虚拟仓库）</b>', '', '', '✓'],
]}
/>

#### 计算资源

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '个人版', '企业版', '专属版']}
tbody={[
['虚拟仓库（Virtual Warehouses），隔离查询与数据加载工作负载', '✓', '✓', '✓'],
['多集群弹性扩展', '', '✓', '✓'],
['虚拟仓库资源使用监控', '✓', '✓', '✓'],
]}
/>

#### SQL 支持

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '个人版', '企业版', '专属版']}
tbody={[
['标准 SQL（兼容 SQL:1999 主要 DDL/DML 语法）', '✓', '✓', '✓'],
['高级 DML（多表 INSERT、MERGE 及多路合并）', '✓', '✓', '✓'],
['全面支持标准数据类型', '✓', '✓', '✓'],
['原生半结构化数据支持（JSON/ORC/Parquet）', '✓', '✓', '✓'],
['原生地理空间数据处理', '✓', '✓', '✓'],
['原生非结构化数据支持', '✓', '✓', '✓'],
['表列字符串/文本排序规则', '✓', '✓', '✓'],
['多语句事务处理', '✓', '✓', '✓'],
['用户定义函数（UDF），支持 JavaScript/Python/WebAssembly', '', '✓', '✓'],
['外部函数扩展开发平台能力', '✓', '✓', '✓'],
['Amazon API Gateway 私有端点支持', '✓', '✓', '✓'],
['外部表访问云存储数据湖', '✓', '✓', '✓'],
['大表数据自动聚簇优化与维护', '✓', '✓', '✓'],
['点查询搜索优化及自动维护', '✓', '✓', '✓'],
['自动维护的物化视图', '✓', '✓', '✓'],
['Iceberg 表访问云存储数据湖', '✓', '✓', '✓'],
['半结构化数据文件自动模式检测', '✓', '✓', '✓'],
['表结构自动演进适配数据源变更', '✓', '✓', '✓'],
['支持<a href="/sql/sql-commands/ddl/table/ddl-create-table-external-location" target="_self">外部位置建表</a>', '✓', '✓', '✓'],
['支持 <a href="/sql/sql-commands/ddl/table/attach-table" target="_self">ATTACH TABLE</a>', '✓', '✓', '✓'],
]}
/>

#### 接口与工具

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '个人版', '企业版', '专属版']}
tbody={[
['新一代 SQL 工作台：高级查询开发与数据分析可视化', '✓', '✓', '✓'],
['命令行工具 BendSQL：查询测试/批量数据加载/DDL 自动化', '✓', '✓', '✓'],
['编程接口：Rust/Python/Java/Node.js/PHP/Go', '✓', '✓', '✓'],
['原生 JDBC 支持', '✓', '✓', '✓'],
['广泛连接 ETL/BI 等第三方生态', '✓', '✓', '✓'],
]}
/>

#### 数据导入导出

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '个人版', '企业版', '专属版']}
tbody={[
['批量导入：分隔文件（CSV/TSV）及半结构化数据（JSON/ORC/Parquet）', '✓', '✓', '✓'],
['批量导出：分隔文件与 JSON 格式', '✓', '✓', '✓'],
['持续微批处理加载', '✓', '✓', '✓'],
['流式数据低延迟接入', '✓', '✓', '✓'],
['Kafka 连接器（Databend Cloud Connector for Kafka）', '✓', '✓', '✓'],
]}
/>

#### 数据管道

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '个人版', '企业版', '专属版']}
tbody={[
['数据流（Streams）追踪表变更', '✓', '✓', '✓'],
['任务（Tasks）调度 SQL 执行（常配合数据流使用）', '✓', '✓', '✓'],
]}
/>

#### 客户支持

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', '个人版', '企业版', '专属版']}
tbody={[
['支持工单记录与追踪', '✓', '✓', '✓'],
['一级严重问题：每周4天×7小时覆盖，1小时响应', '✓', '✓', '✓'],
['<b>非一级问题响应时效</b>', '8小时', '4小时', '1小时'],
]}
/>