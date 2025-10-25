---
title: 统一工作负载
---

CityDrive Intelligence 记录每一次行车记录仪行程，将其拆分为帧，并为每个 `video_id` 存储多种信号：关系型元数据、JSON 清单、行为标签、嵌入向量以及 GPS 轨迹。本系列指南展示 Databend 如何将所有这些工作负载集中在同一个 Warehouse 中——无需复制作业，也不需要额外的搜索集群。

| 指南 | 涵盖内容 |
|-------|----------------|
| [SQL 分析（SQL Analytics）](./00-sql-analytics.md) | 基础表、筛选条件、连接（Join）、窗口、聚合索引 |
| [JSON 与搜索（JSON & Search）](./01-json-search.md) | 加载 `frame_metadata_catalog`，运行 Elasticsearch `QUERY()`，关联位图标签 |
| [向量搜索（Vector Search）](./02-vector-db.md) | 持久化嵌入向量，运行余弦搜索，连接风险指标 |
| [地理分析（Geo Analytics）](./03-geo-analytics.md) | 使用 `GEOMETRY`，距离/多边形筛选，交通信号灯连接 |
| [湖仓 ETL（Lakehouse ETL）](./04-lakehouse-etl.md) | 仅在 Stage 中预处理一次，向共享表执行 `COPY INTO`，添加 Stream/Task |

按顺序阅读这些指南，可以看到相同的标识符如何从经典 SQL 延伸到文本搜索、向量、地理以及 ETL，全都基于同一个 CityDrive 场景。