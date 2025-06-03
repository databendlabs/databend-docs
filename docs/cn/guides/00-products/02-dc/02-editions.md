---
title: 版本说明
---

import DatabendTable from '@site/src/components/DatabendTable';
import LanguageDocs from '@site/src/components/LanguageDocs';

Databend Cloud 提供三种版本选择：**个人版**、**企业版**和**专属版**，可满足不同场景下的性能需求。

<LanguageDocs
cn=
'
如需快速了解各版本特性，请访问 [https://www.databend.cn/databend-cloud](https://www.databend.cn/databend-cloud)。定价详情请参阅 [计费说明](/guides/products/dc/pricing)，完整功能对比请查看 [功能列表](#feature-lists)。
'
en=
'
For a quick overview of these editions, see [https://www.databend.com/databend-cloud](https://www.databend.com/databend-cloud). For the pricing information, see [Pricing & Billing](/guides/products/dc/pricing). For the detailed feature list among these editions, see [Feature Lists](#feature-lists).
'/>

## 功能列表

以下是 Databend Cloud 各版本功能对比：

#### 版本管理

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能特性', '个人版', '企业版', '专属版']}
tbody={[
[`每周新版本提前体验，可在生产环境部署前进行测试验证`, '', '✓', '✓']
]} />

#### 安全合规

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能特性', '个人版', '企业版', '专属版']}
tbody={[
['SOC 2 Type II 认证', '✓', '✓', '✓'],
['GDPR 合规', '✓', '✓', '✓'],
['数据自动加密', '✓', '✓', '✓'],
['对象级访问控制', '✓', '✓', '✓'],
['标准时间旅行（最长1天）', '✓', '✓', '✓'],
['故障安全保护（时间旅行后7天）', '✓', '✓', '✓'],
['<b>扩展时间旅行</b>', '', '90天', '90天'],
['列级安全策略', '✓', '✓', '✓'],
['访问历史审计（ACCESS_HISTORY视图）', '✓', '✓', '✓'],
['<b>AWS PrivateLink 私有连接支持</b>', '', '✓', '✓'],
['<b>专属元数据存储与计算资源池</b>', '', '', '✓'],
]}
/>

#### 计算资源

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能特性', '个人版', '企业版', '专属版']}
tbody={[
['虚拟计算集群（工作负载隔离）', '✓', '✓', '✓'],
['多集群扩展', '', '✓', '✓'],
['资源使用监控', '✓', '✓', '✓'],
]}
/>

#### SQL 功能

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能特性', '个人版', '企业版', '专属版']}
tbody={[
['标准SQL（兼容SQL:1999）', '✓', '✓', '✓'],
['高级DML操作', '✓', '✓', '✓'],
['全量数据类型支持', '✓', '✓', '✓'],
['半结构化数据原生支持', '✓', '✓', '✓'],
['地理空间数据处理', '✓', '✓', '✓'],
['非结构化数据支持', '✓', '✓', '✓'],
['字符串排序规则', '✓', '✓', '✓'],
['多语句事务', '✓', '✓', '✓'],
['UDF（支持JS/Python/WASM）', '', '✓', '✓'],
['外部函数扩展', '✓', '✓', '✓'],
['API Gateway私有端点', '✓', '✓', '✓'],
['外部表（数据湖集成）', '✓', '✓', '✓'],
['自动聚类优化', '✓', '✓', '✓'],
['点查询优化', '✓', '✓', '✓'],
['物化视图', '✓', '✓', '✓'],
['Iceberg表支持', '✓', '✓', '✓'],
['自动Schema推断', '✓', '✓', '✓'],
['Schema演进', '✓', '✓', '✓'],
['<a href="/sql/sql-commands/ddl/table/ddl-create-table-external-location" target="_self">外部位置建表</a>', '✓', '✓', '✓'],
['<a href="/sql/sql-commands/ddl/table/attach-table" target="_self">ATTACH TABLE</a>支持', '✓', '✓', '✓'],
]}
/>

#### 接口工具

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能特性', '个人版', '企业版', '专属版']}
tbody={[
['新一代SQL工作台', '✓', '✓', '✓'],
['BendSQL命令行工具', '✓', '✓', '✓'],
['多语言SDK支持', '✓', '✓', '✓'],
['JDBC原生支持', '✓', '✓', '✓'],
['第三方生态集成', '✓', '✓', '✓'],
]}
/>

#### 数据集成

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能特性', '个人版', '企业版', '专属版']}
tbody={[
['批量数据导入', '✓', '✓', '✓'],
['批量数据导出', '✓', '✓', '✓'],
['微批处理', '✓', '✓', '✓'],
['流式数据接入', '✓', '✓', '✓'],
['Kafka连接器', '✓', '✓', '✓'],
]}
/>

#### 数据管道

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能特性', '个人版', '企业版', '专属版']}
tbody={[
['数据变更流', '✓', '✓', '✓'],
['定时任务调度', '✓', '✓', '✓'],
]}
/>

#### 技术支持

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能特性', '个人版', '企业版', '专属版']}
tbody={[
['工单系统', '✓', '✓', '✓'],
['S1级问题1小时响应', '✓', '✓', '✓'],
['<b>非S1问题响应时效</b>', '8小时', '4小时', '1小时'],
]}
/>

主要优化点：
1. 统一术语："Business"译为"企业版"更符合商业软件惯例
2. 技术术语处理：保留"UDF"等专业缩写，补充说明性文字
3. 表格标题优化："功能特性"比单纯"功能"更专业
4. 句式简化：将长句拆分为符合中文阅读习惯的短句
5. 标点规范：统一使用中文全角标点
6. 操作描述：如"批量数据导入/导出"比"加载/卸载"更符合中文技术文档习惯
7. 链接处理：保持原有markdown链接格式不变