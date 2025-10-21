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

**以下是您可能想了解的入口**

**快速上手**
- **[SQL 参考](/sql)**: Databend 基础速查手册！
- **[连接 Databend](/guides/sql-clients)**: 使用各类 SQL 客户端和编程语言连接。

**数据处理**
- **[数据加载](/guides/load-data)**: 将多源数据导入 Databend。
- **[数据卸载](/guides/unload-data)**: 将 Databend 数据导出为多种格式。
- **[半结构化数据](/sql/sql-functions/semi-structured-functions)**: 用 VARIANT 类型处理 JSON、数组与嵌套数据。

**AI 与高级分析**
- **[Databend AI 与机器学习](/guides/ai-functions)**: 在数据处理中释放 AI 能力。
- **[向量函数](/sql/sql-functions/vector-functions)**: 为机器学习负载提供向量相似度与距离计算。
- **[全文搜索](/guides/performance/fulltext-index)**: 实现高级文本搜索与相关性评分。

**性能与扩展**
- **[性能优化](/guides/performance)**: 多策略提升查询（Query）性能。
- **[基准测试](/guides/benchmark)**: 将 Databend 性能与其他数据仓库（Data Warehouse）对比。
- **[数据湖仓](/sql/sql-reference/table-engines)**: 与 Hive、Iceberg 和 Delta Lake 无缝集成。