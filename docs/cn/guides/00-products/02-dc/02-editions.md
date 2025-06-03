---
title: 版本
---

import DatabendTable from '@site/src/components/DatabendTable';
import LanguageDocs from '@site/src/components/LanguageDocs';

Databend Cloud 提供三个版本：**Personal**、**Business** 和 **Dedicated**，您可根据不同需求选择，确保各类用例获得最佳性能。

<LanguageDocs
cn=
'
如需快速了解各版本，请访问 [https://www.databend.cn/databend-cloud](https://www.databend.cn/databend-cloud)。定价信息请参阅 [定价与计费](/guides/products/dc/pricing)，详细功能列表请见 [功能列表](#feature-lists)。
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
thead={['功能', 'Personal', 'Business', 'Dedicated']}
tbody={[
[`提前获取每周新版本，可在部署至生产环境前进行额外测试/验证`, '', '✓', '✓']
]} />

#### 安全与治理

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', 'Personal', 'Business', 'Dedicated']}
tbody={[
['SOC 2 Type II 认证', '✓', '✓', '✓'],
['GDPR 合规', '✓', '✓', '✓'],
['全数据自动加密', '✓', '✓', '✓'],
['对象级访问控制', '✓', '✓', '✓'],
['标准 Time Travel（最长 1 天）访问/恢复修改删除数据', '✓', '✓', '✓'],
['通过 Fail-safe 实现修改/删除数据的灾难恢复（Time Travel 外延 7 天）', '✓', '✓', '✓'],
['<b>扩展 Time Travel</b>', '', '90 天', '90 天'],
['列级安全：对表或视图列应用脱敏策略', '✓', '✓', '✓'],
['通过 ACCESS_HISTORY 视图审计用户访问记录', '✓', '✓', '✓'],
['<b>支持通过 AWS PrivateLink 私有连接至 Databend Cloud 服务</b>', '', '✓', '✓'],
['<b>专用元数据存储与计算资源池（用于虚拟仓库）</b>', '', '', '✓'],
]}
/>

#### 计算资源

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', 'Personal', 'Business', 'Dedicated']}
tbody={[
['虚拟仓库：隔离查询与数据加载工作负载的独立计算集群', '✓', '✓', '✓'],
['多集群弹性扩展', '', '✓', '✓'],
['监控虚拟仓库计算资源使用量的资源监视器', '✓', '✓', '✓'],
]}
/>

#### SQL 支持

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', 'Personal', 'Business', 'Dedicated']}
tbody={[
['标准 SQL（含 SQL:1999 定义的大部分 DDL/DML）', '✓', '✓', '✓'],
['高级 DML：多表 INSERT、MERGE 及多合并操作', '✓', '✓', '✓'],
['广泛支持标准数据类型', '✓', '✓', '✓'],
['原生支持半结构化数据（JSON/ORC/Parquet）', '✓', '✓', '✓'],
['原生支持地理空间数据', '✓', '✓', '✓'],
['原生支持非结构化数据', '✓', '✓', '✓'],
['表列中字符串/文本数据的排序规则', '✓', '✓', '✓'],
['多语句事务', '✓', '✓', '✓'],
['支持 JavaScript/Python/WebAssembly 的用户定义函数 (UDF)', '', '✓', '✓'],
['外部函数：扩展至其他开发平台', '✓', '✓', '✓'],
['外部函数的 Amazon API Gateway 私有端点', '✓', '✓', '✓'],
['外部表：引用云存储数据湖中的数据', '✓', '✓', '✓'],
['支持大表数据聚类（自动维护）以提升查询性能', '✓', '✓', '✓'],
['点查找查询的搜索优化（自动维护）', '✓', '✓', '✓'],
['物化视图（结果自动维护）', '✓', '✓', '✓'],
['Iceberg 表：引用云存储数据湖中的数据', '✓', '✓', '✓'],
['模式检测：自动识别半结构化数据文件结构并获取列定义', '✓', '✓', '✓'],
['模式演化：自动更新表结构以适应新数据源', '✓', '✓', '✓'],
['支持 <a href="/sql/sql-commands/ddl/table/ddl-create-table-external-location" target="_self">创建含外部位置的表</a>', '✓', '✓', '✓'],
['支持 <a href="/sql/sql-commands/ddl/table/attach-table" target="_self">ATTACH TABLE</a>', '✓', '✓', '✓'],
]}
/>

#### 接口与工具

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', 'Personal', 'Business', 'Dedicated']}
tbody={[
['新一代 SQL 工作区：高级查询开发、数据分析与可视化', '✓', '✓', '✓'],
['BendSQL 命令行客户端：构建/测试查询、批量数据加载/卸载、DDL 自动化', '✓', '✓', '✓'],
['编程接口：Rust/Python/Java/Node.js/PHP/Go', '✓', '✓', '✓'],
['原生 JDBC 支持', '✓', '✓', '✓'],
['广泛连接 ETL/BI 等第三方技术与供应商的生态系统', '✓', '✓', '✓'],
]}
/>

#### 数据导入导出

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', 'Personal', 'Business', 'Dedicated']}
tbody={[
['批量加载：分隔文本文件 (CSV/TSV 等) 与半结构化数据文件 (JSON/ORC/Parquet)', '✓', '✓', '✓'],
['批量卸载至分隔文本文件与 JSON 文件', '✓', '✓', '✓'],
['持续微批加载', '✓', '✓', '✓'],
['流式处理：低延迟加载流数据', '✓', '✓', '✓'],
['Databend Cloud Connector for Kafka：从 Apache Kafka 主题加载数据', '✓', '✓', '✓'],
]}
/>

#### 数据管道

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', 'Personal', 'Business', 'Dedicated']}
tbody={[
['Streams：追踪表变更', '✓', '✓', '✓'],
['Tasks：调度 SQL 语句执行（常与表流配合使用）', '✓', '✓', '✓'],
]}
/>

#### 客户支持

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['功能', 'Personal', 'Business', 'Dedicated']}
tbody={[
['支持工单记录与追踪', '✓', '✓', '✓'],
['严重等级 1 问题：每周 4 天/每天 7 小时覆盖，1 小时响应', '✓', '✓', '✓'],
['<b>非严重等级 1 问题响应时间</b>', '8 小时', '4 小时', '1 小时'],
]}
/>