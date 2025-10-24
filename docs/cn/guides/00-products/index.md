---
title: Databend 产品
slug: /
---

import DocsOverview from '@site/src/components/DocsOverview'
import Speaker from '@site/src/components/Speaker'
import LanguageDocs from '@site/src/components/LanguageDocs';

欢迎阅读 Databend（发音为 /ˈdeɪtəˌbɛnd/）<Speaker /> 文档。
<LanguageDocs
cn=
'

**Databend** —— ANY DATA. ANY SCALE. ONE DATABASE.

内置存储、向量、分析、搜索与地理空间引擎共享一套 Snowflake 兼容 SQL 接口，让团队可以存任何数据、查任何内容、驱动语义工作负载，并实时交付洞察而无需搬运数据。

无论是 Databend Cloud、Docker 自托管还是 `pip install databend`，统一引擎都直接运行在你的对象存储之上。

'
en=
'

**Databend** — **ANY DATA. ANY SCALE. ONE DATABASE.**

**Open-source** datastore, vector, analytics, search, and geospatial engines converge on one **Snowflake-compatible SQL surface** so teams store anything, search everything, power semantic workloads, and deliver real-time insights without moving data.

Explore the engine on [**GitHub**](https://github.com/databendlabs/databend). Launch in Databend Cloud, `docker run`, or `pip install databend`—every option runs the same unified engine on your object store.

'/>

<DocsOverview />

**以下是一些你可能感兴趣的入口**

**入门指南**
- **[快速入门](/guides/deploy/quickstart)**：使用 Docker 启动 Databend 并快速加载示例数据。
- **[Databend Cloud](/guides/cloud)**：启动无服务器计算集群（Warehouse）并管理你的组织。
- **[连接到 Databend](/guides/sql-clients)**：使用各种 SQL 客户端和编程语言进行连接。
- **[SQL 参考](/sql)**：浏览 Databend SQL 命令、函数和语法。

**数据处理**
- **[数据加载](/guides/load-data)**：将数据从各种来源导入 Databend。
- **[数据卸载](/guides/unload-data)**：将数据从 Databend 导出为不同格式。
- **[半结构化数据](/sql/sql-functions/semi-structured-functions)**：使用 VARIANT 类型处理 JSON、数组和嵌套数据。

**统一工作负载**
- **[SQL 分析指南](/guides/query/sql-analytics)**：用于分析、搜索、向量和地理空间工作负载的共享会话表。
- **[JSON 和搜索指南](/guides/query/json-search)**：使用倒排索引和 Lucene 风格的 `QUERY` 查询 VARIANT 有效载荷。
- **[向量数据库指南](/guides/query/vector-db)**：在 Databend 内部存储嵌入并运行语义相似性。
- **[地理空间分析指南](/guides/query/geo-analytics)**：使用地理空间 SQL 映射事件以获取实时洞察。
- **[湖仓 ETL 指南](/guides/query/lakehouse-etl)**：将对象存储文件流式传输到托管表，消除数据孤岛。

**性能与规模**
- **[性能优化](/guides/performance)**：通过各种策略增强查询性能。
- **[基准测试](/guides/benchmark)**：将 Databend 性能与其他数据仓库进行比较。
- **[数据湖仓](/sql/sql-reference/table-engines)**：与 Hive、Iceberg 和 Delta Lake 无缝集成。

**社区与支持**
- **[加入 Slack](https://link.databend.cn/join-slack)**：与 Databend 社区和核心工程师交流。
- **[文档问题](https://github.com/databendlabs/databend-docs/issues)**：报告问题或请求新的文档覆盖范围。
- **[路线图](https://github.com/databendlabs/databend/issues/14167)**：跟踪即将推出的功能并分享反馈。
- **[发送邮件给我们](mailto:hi@databend.cn)**：需要帮助时直接联系团队。