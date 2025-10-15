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

**Databend** 是新一代云原生 **[数据+AI] 分析平台**，支持结构化、半结构化和非结构化多模态数据。

作为 **Snowflake 的开源替代方案**，具有**近 100% SQL 兼容性**和原生 AI 能力，受到世界级企业信赖，管理着 **800+ PB** 数据和**每日 1 亿+** 查询。

'
en=
'

**Databend** is the multimodal cloud **[Data+AI]** warehouse bringing structured, semi-structured, unstructured, and vector data together in native columnar storage that runs directly on your object store—your data is ready the moment it lands.

Built-in Datastore, Vector Database, Analytics, Search, and Geospatial engines converge on one Snowflake-compatible SQL surface, so teams store anything, search everything, power semantic workloads, and deliver real-time insights without moving data.

'/>

<DocsOverview />

**以下是一些您可能感兴趣的入门主题**

**快速上手**
- **[SQL 参考](/sql)**: Databend 基础知识的快速访问指南！
- **[连接到 Databend](/guides/sql-clients)**: 使用各种 SQL 客户端和编程语言进行连接。

**数据处理**
- **[数据加载](/guides/load-data)**: 将各种来源的数据导入 Databend。
- **[数据卸载](/guides/unload-data)**: 将 Databend 中的数据导出为不同格式。
- **[半结构化数据](/sql/sql-functions/semi-structured-functions)**: 使用 VARIANT 类型处理 JSON、数组和嵌套数据。

**AI 与高级分析**
- **[Databend AI 与机器学习](/guides/ai-functions)**: 在数据处理中利用 AI 功能。
- **[向量函数](/sql/sql-functions/vector-functions)**: 用于机器学习工作负载的向量相似度和距离计算。
- **[全文搜索](/guides/performance/fulltext-index)**: 高级文本搜索和相关性评分。

**性能与扩展**
- **[性能优化](/guides/performance)**: 通过各种策略提升查询性能。
- **[基准测试](/guides/benchmark)**: 将 Databend 的性能与其他数据仓库（Data Warehouse）进行比较。
- **[数据湖仓](/guides/access-data-lake)**: 与 Hive、Iceberg 和 Delta Lake 无缝集成。