---
title: 统一工作负载（Unified Workloads）
---

CityDrive Intelligence 记录每一次行车记录仪的驾驶数据，将其分割成帧，并为每个 `video_id` 存储多个信号：关系元数据、JSON 清单、行为标签、嵌入向量和 GPS 轨迹。本指南集展示了 Databend 如何将所有这些工作负载保存在一个数据仓库（Data Warehouse）中——无需复制作业，无需额外的搜索集群。

| 指南 | 涵盖内容 |
|-------|----------------|
| [SQL 分析（SQL Analytics）](./00-sql-analytics.md) | 基础表、过滤器、连接（Join）、窗口函数、聚合索引（Aggregating Index） |
| [JSON 与搜索（JSON & Search）](./01-json-search.md) | 加载 `frame_metadata_catalog`，运行 Elasticsearch `QUERY()`，链接位图标签 |
| [向量搜索（Vector Search）](./02-vector-db.md) | 持久化嵌入向量，运行余弦搜索，连接风险指标 |
| [地理空间分析（Geo Analytics）](./03-geo-analytics.md) | 使用 `GEOMETRY`，距离/多边形过滤器，交通灯连接（Join） |
| [湖仓 ETL（Lakehouse ETL）](./04-lakehouse-etl.md) | 一次暂存（Stage），`COPY INTO` 共享表，添加流（Stream）/任务（Task） |

请按顺序浏览它们，以了解相同的标识符如何从经典 SQL 流向文本搜索、向量、地理空间和 ETL——所有这些都基于一个 CityDrive 场景。