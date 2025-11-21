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

**Databend 是一款基于 Rust 研发的开源**云原生数仓。它通过**标准 SQL 接口**，将存储、向量、分析、搜索及地理空间引擎融为一体。无需数据迁移，即可基于对象存储实现对各类数据的存储、检索、语义分析及实时洞察。

访问 [**GitHub**](https://github.com/databendlabs/databend) 探索核心引擎。无论通过 [**Databend Cloud**](https://www.databend.cn/)、`docker run` 还是 `pip install databend` 启动，运行的都是同一套基于对象存储的统一引擎。

'
en=
'

**Databend** — **ANY DATA. ANY SCALE. ONE DATABASE.**

**Open-source** datastore, vector, analytics, search, and geospatial engines converge on one **Snowflake-compatible SQL surface** so teams store anything, search everything, power semantic workloads, and deliver real-time insights without moving data.

Explore the engine on [**GitHub**](https://github.com/databendlabs/databend). Launch in [**Databend Cloud**](https://www.databend.com/), `docker run`, or `pip install databend`—every option runs the same unified engine on your object store.

'/>
<DocsOverview />

**核心主题概览：**

**快速上手**

- **[快速开始](/guides/deploy/quickstart)**: 使用 Docker 快速启动 Databend，加载示例数据并体验核心功能。
- **[Databend Cloud](/guides/cloud)**: 创建 Serverless 数仓，高效管理组织与数据资源。
- **[连接 Databend](/guides/sql-clients)**: 支持主流 SQL 客户端及编程语言，连接并使用 Databend。
- **[SQL 参考](/sql)**: 查阅 Databend 支持的 SQL 命令、函数及语法详情。

**数据处理**

- **[数据加载](/guides/load-data)**: 支持从多种数据源高效导入数据。
- **[数据卸载](/guides/unload-data)**: 将数据导出为多种格式，满足下游处理需求。
- **[半结构化数据](/sql/sql-functions/semi-structured-functions)**: 利用 VARIANT 类型，高效处理 JSON、数组及嵌套数据。

**统一分析场景**

- **[SQL 分析指南](/guides/query/sql-analytics)**: 基于统一平台，处理分析、搜索、向量及地理空间任务。
- **[JSON 与搜索指南](/guides/query/json-search)**: 结合倒排索引与 Elasticsearch 语法，实现 VARIANT 数据的高效检索。
- **[向量数据库指南](/guides/query/vector-db)**: 原生存储向量数据（Embeddings），直接在 SQL 中进行语义相似度计算。
- **[地理分析指南](/guides/query/geo-analytics)**: 利用地理空间 SQL 能力，进行地图绘制与位置分析。
- **[湖仓 ETL 指南](/guides/query/lakehouse-etl)**: 将对象存储文件流式写入托管表，消除数据孤岛。

**性能与扩展**

- **[性能优化](/guides/performance)**: 了解核心优化策略，提升查询性能。
- **[基准测试](/guides/benchmark)**: 查看 Databend 与其他数仓的性能对比报告。
- **[数据湖仓](/sql/sql-reference/table-engines)**: 集成 Hive, Iceberg 和 Delta Lake，构建开放的数据湖仓。

**社区与支持**

- **[加入 Slack](https://link.databend.com/join-slack)**: 加入社区，与核心开发团队及用户交流。
- **[文档反馈](https://github.com/databendlabs/databend-docs/issues)**: 提交文档问题或改进建议。
- **[路线图](https://github.com/databendlabs/databend/issues/14167)**: 关注开发计划，了解未来功能规划。
- **[联系我们](mailto:hi@databend.com)**: 如需帮助，请邮件联系我们。
