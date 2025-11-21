---
title: 统一工作负载
---

CityDrive Intelligence 记录每一次行车过程的视频。通过后台处理工具，系统将视频流拆解为关键帧图片，进而从每张图片中提取出丰富的多模态信息，并以 `video_id` 为核心进行存储。这些信息涵盖了关系型元数据、JSON 清单、行为标签、向量嵌入以及 GPS 轨迹。

本系列指南将展示 Databend 如何在一个数仓中统一处理所有这些工作负载——既无需数据搬运，也无需维护额外的搜索集群。

| 指南 | 涵盖内容 |
|-------|----------------|
| [SQL 分析](./00-sql-analytics.md) | 基础表设计、过滤、连接、窗口函数及聚合索引 |
| [JSON 与搜索](./01-json-search.md) | 加载 `frame_metadata_catalog`，执行 Elasticsearch 风格的 `QUERY()`，并关联位图标签 |
| [向量搜索](./02-vector-db.md) | 存储向量嵌入，运行余弦相似度搜索，并关联风险指标 |
| [地理空间分析](./03-geo-analytics.md) | 利用 `GEOMETRY` 类型，进行距离/多边形过滤及红绿灯关联查询 |
| [Lakehouse ETL](./04-lakehouse-etl.md) | 一次暂存 (Stage)，通过 `COPY INTO` 写入共享表，并添加流/任务 (Streams/Tasks) |

建议按顺序阅读，体验同一套标识符如何贯穿经典 SQL、文本搜索、向量分析、地理空间分析和 ETL 流程——所有这一切都基于同一个 CityDrive 业务场景。
