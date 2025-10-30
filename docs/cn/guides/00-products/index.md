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

**Databend** —— **一套引擎撑起所有数据与场景（ANY DATA. ANY SCALE. ONE DATABASE）.**

**Databend 是开源的**云原生数仓，把存储、向量搜索、SQL 分析、全文检索与地理计算统一到一套与**Snowflake 兼容的 SQL 接口上**。所有数据都放在对象存储里，写入、分析、搜索一次到位，无需折腾多套系统。

在 [**GitHub**](https://github.com/databendlabs/databend) 上探索其引擎。您可以通过 [**Databend Cloud**](https://www.databend.cn/)、`docker run` 或 `pip install databend` 启动它，每种方式都在您的对象存储上运行着同一个统一的引擎。

'
en=
'

**Databend** — **ANY DATA. ANY SCALE. ONE DATABASE.**

**Open-source** datastore, vector, analytics, search, and geospatial engines converge on one **Snowflake-compatible SQL surface** so teams store anything, search everything, power semantic workloads, and deliver real-time insights without moving data.

Explore the engine on [**GitHub**](https://github.com/databendlabs/databend). Launch in [**Databend Cloud**](https://www.databend.com/), `docker run`, or `pip install databend`—every option runs the same unified engine on your object store.

'/>
<DocsOverview />

**推荐先从这些主题开始了解**

**快速上手**

- **[快速开始](/guides/deploy/quickstart)**: 用 Docker 几分钟内启动 Databend，并加载示例数据。
- **[Databend Cloud](/guides/cloud)**: 创建无服务器仓库，集中管理组织与资源。
- **[连接到 Databend](/guides/sql-clients)**: 通过常见 SQL 客户端或编程语言接入 Databend。
- **[SQL 参考](/sql)**: 查询 Databend 支持的 SQL 命令、函数与语法。

**数据处理**

- **[数据加载](/guides/load-data)**: 把不同来源的数据导入 Databend。
- **[数据卸载](/guides/unload-data)**: 将 Databend 数据导出为所需格式。
- **[半结构化数据](/sql/sql-functions/semi-structured-functions)**: 借助 VARIANT 处理 JSON、数组与嵌套结构。

**统一引擎场景**

- **[SQL 分析指南](/guides/query/sql-analytics)**: 用同一套引擎支撑分析、搜索、向量与地理任务。
- **[JSON 与搜索指南](/guides/query/json-search)**: 依托倒排索引和 Elasticsearch 风格 `QUERY` 检索 VARIANT 载荷。
- **[向量数据库指南](/guides/query/vector-db)**: 在 Databend 内存储嵌入并完成语义相似检索。
- **[地理分析指南](/guides/query/geo-analytics)**: 借助地理空间 SQL 绘制事件地图，实时定位热点。
- **[湖仓 ETL 指南](/guides/query/lakehouse-etl)**: 将对象存储文件流式写入托管表，杜绝数据孤岛。

**性能与扩展**

- **[性能优化](/guides/performance)**: 结合多种策略加速查询与计算。
- **[基准测试](/guides/benchmark)**: 了解 Databend 与其他数据仓库的性能对比。
- **[数据湖仓](/sql/sql-reference/table-engines)**: 与 Hive、Iceberg、Delta Lake 无缝协作。

**社区与支持**

- **[加入 Slack](https://link.databend.com/join-slack)**: 与社区成员及核心工程师直接交流。
- **[文档问题](https://github.com/databendlabs/databend-docs/issues)**: 反馈文档缺失或提交改进建议。
- **[路线图](https://github.com/databendlabs/databend/issues/14167)**: 跟踪即将发布的功能并留下意见。
- **[邮件联系](mailto:hi@databend.com)**: 需要即时协助时写信给我们。
