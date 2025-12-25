---
title: Databend 产品
slug: /
---

import DocsOverview from '@site/src/components/DocsOverview'
import Speaker from '@site/src/components/Speaker'

欢迎来到 Databend（发音为 /ˈdeɪtəˌbɛnd/）<Speaker /> 文档。

[**Databend**](https://github.com/databendlabs/databend) 是一款 100% Rust 打造、专为对象存储设计的新一代云原生数据仓库，为多模态数据提供统一的存储与计算。只需标准 SQL，即可在一个平台上轻松实现 BI 分析(Analytics)、AI 向量检索(Vector Database)、全文检索(Search)以及地理空间分析(Geospatial Analytics)；内置强大的 Stream + Task 能力，自动实现数据实时摄取、清洗与治理，彻底告别复杂 ETL 流程，让数据架构极致简洁，助您快速构建现代化数据平台。

<DocsOverview />

**核心功能概览：**

**快速上手**

- **[快速开始](/guides/self-hosted/quickstart)**: 使用 Docker 快速启动，轻松加载示例数据。
- **[Databend Cloud](/guides/cloud)**: 启动 Serverless 数仓，轻松管理组织与数据。
- **[连接 Databend](/guides/connect)**: 使用各类 SQL 客户端及编程语言连接 Databend。
- **[SQL 参考](/sql)**: 浏览 Databend SQL 命令、函数及语法。

**数据处理**

- **[数据导入](/guides/load-data)**: 从多种数据源将数据导入 Databend。
- **[数据导出](/guides/unload-data)**: 将数据导出为不同格式，适配下游需求。
- **[半结构化数据](/sql/sql-functions/semi-structured-functions)**: 使用 VARIANT 类型处理 JSON、数组及嵌套数据。

**多模态分析**

- **[SQL 分析](/guides/query/sql-analytics)**: 基于共享会话表，统一处理分析、搜索、向量和地理空间任务。
- **[JSON 与搜索](/guides/query/json-search)**: 利用倒排索引和 Elasticsearch 语法高效查询 VARIANT 数据。
- **[向量数据库](/guides/query/vector-db)**: 存储向量数据（Embeddings）并进行语义相似度计算。
- **[地理分析](/guides/query/geo-analytics)**: 使用地理空间 SQL 进行地图绘制与实时分析。
- **[湖仓 ETL](/guides/query/lakehouse-etl)**: 将对象存储文件流式写入托管表，消除数据孤岛。

**性能与扩展**

- **[性能优化](/guides/performance)**: 利用多种策略提升查询性能。
- **[基准测试](/guides/benchmark)**: 查看 Databend 与其他数仓的性能对比。
- **[数据湖仓](/sql/sql-reference/table-engines)**: 无缝集成 Hive、Iceberg 和 Delta Lake。

**社区与支持**

- **[加入 Slack](https://link.databend.com/join-slack)**: 与核心团队及社区成员实时交流。
- **[文档反馈](https://github.com/databendlabs/databend-docs/issues)**: 提交问题或改进建议。
- **[路线图](https://github.com/databendlabs/databend/issues/14167)**: 跟踪功能规划与开发进度。
- **[联系我们](mailto:hi@databend.com)**: 获取直接帮助与支持。