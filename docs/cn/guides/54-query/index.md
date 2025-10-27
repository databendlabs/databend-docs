---
title: 统一引擎场景
---

CityDrive Intelligence 会保存每一次行车记录：把整段视频拆成帧,并为每个 `video_id` 写入结构化元数据、JSON 清单、行为标签、向量特征以及 GPS 轨迹。下面这一组指南展示 Databend 如何把这些需求都跑在同一个数仓里,既不需要复制数据,也不用额外搭建搜索或向量集群。

| 指南 | 内容摘要 |
|-------|----------------|
| [SQL 分析](./00-sql-analytics.md) | 构建基础表,示范过滤、连接、窗口与聚合索引 |
| [JSON 与搜索](./01-json-search.md) | 加载 `frame_metadata_catalog`,运行 Elasticsearch `QUERY()`,关联位图标签 |
| [向量搜索](./02-vector-db.md) | 保留向量特征,用余弦距离做语义相似度检索,并联动风险指标 |
| [地理分析](./03-geo-analytics.md) | 运用 `GEOMETRY`、距离/多边形过滤以及信号灯关联 |
| [湖仓 ETL](./04-lakehouse-etl.md) | 一次暂存,`COPY INTO` 共享表,并可选配 Streams/Tasks |

按顺序体验,即可看到同一批 CityDrive 标识符如何贯穿经典 SQL、全文检索、向量、地理和 ETL,全程由 Databend 的单一执行引擎托管。
