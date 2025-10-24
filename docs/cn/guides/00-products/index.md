---
title: Databend 产品
slug: /
---

import DocsOverview from '@site/src/components/DocsOverview'
import Speaker from '@site/src/components/Speaker'
import LanguageDocs from '@site/src/components/LanguageDocs';

欢迎来到 Databend（发音为 /ˈdeɪtəˌbɛnd/）<Speaker /> 文档。
<LanguageDocs
cn=
'

**Databend** —— 任何数据，任意规模，一个数据库。

Databend 将存储、向量、分析、搜索与地理空间能力统一到一个兼容 Snowflake 的 SQL 引擎中。你可以存储任何类型的数据，通过 SQL 完成所有查询和分析，驱动 AI 语义工作负载，实时获得洞察——全程无需数据搬运。

无论选择 Databend Cloud 云服务、Docker 容器部署，还是 `pip install databend` 本地安装，都是同一套引擎，直接运行在你的对象存储上。

'
en=
'

**Databend** — **ANY DATA. ANY SCALE. ONE DATABASE.**

**Open-source** datastore, vector, analytics, search, and geospatial engines converge on one **Snowflake-compatible SQL surface** so teams store anything, search everything, power semantic workloads, and deliver real-time insights without moving data.

Explore the engine on [**GitHub**](https://github.com/databendlabs/databend). Launch in Databend Cloud, `docker run`, or `pip install databend`—every option runs the same unified engine on your object store.

'/>

<DocsOverview />

**以下是一些您可能感兴趣的入门主题**

**快速上手**
- **[快速开始](/guides/deploy/quickstart)**: 使用 Docker 快速启动 Databend 并加载示例数据。
- **[Databend Cloud](/guides/cloud)**: 启动无服务器仓库并管理您的组织。
- **[连接到 Databend](/guides/sql-clients)**: 使用各种 SQL 客户端和编程语言进行连接。
- **[SQL 参考](/sql)**: 浏览 Databend SQL 命令、函数和语法。

**数据处理**
- **[数据加载](/guides/load-data)**: 将各种来源的数据导入 Databend。
- **[数据卸载](/guides/unload-data)**: 将 Databend 中的数据导出为不同格式。
- **[半结构化数据](/sql/sql-functions/semi-structured-functions)**: 使用 VARIANT 类型处理 JSON、数组和嵌套数据。

**统一工作负载**
- **[SQL 分析指南](/guides/query/sql-analytics)**: 用于分析、搜索、向量和地理工作负载的共享会话表。
- **[JSON 与搜索指南](/guides/query/json-search)**: 使用倒排索引和 Lucene 风格的 `QUERY` 查询 VARIANT 数据。
- **[向量数据库指南](/guides/query/vector-db)**: 在 Databend 中存储嵌入向量并运行语义相似度搜索。
- **[地理分析指南](/guides/query/geo-analytics)**: 使用地理空间 SQL 绘制事件地图以获得实时洞察。
- **[湖仓 ETL 指南](/guides/query/lakehouse-etl)**: 将对象存储文件流式传输到托管表中，无需数据孤岛。

**性能与扩展**
- **[性能优化](/guides/performance)**: 通过各种策略提升查询性能。
- **[基准测试](/guides/benchmark)**: 将 Databend 的性能与其他数据仓库进行比较。
- **[数据湖仓](/sql/sql-reference/table-engines)**: 与 Hive、Iceberg 和 Delta Lake 无缝集成。

**社区与支持**
- **[加入 Slack](https://link.databend.com/join-slack)**: 与 Databend 社区和核心工程师交流。
- **[文档问题](https://github.com/databendlabs/databend-docs/issues)**: 报告问题或请求新内容。
- **[路线图](https://github.com/databendlabs/databend/issues/14167)**: 跟踪即将推出的功能并分享反馈。
- **[邮件联系](mailto:hi@databend.com)**: 需要帮助时直接联系团队。
