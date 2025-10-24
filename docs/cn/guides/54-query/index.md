---
title: 统一工作负载
---

Databend 现已作为统一引擎，支持 SQL 分析（SQL Analytics）、多模态搜索、向量相似度、地理空间分析和持续 ETL。本系列教程以 **EverDrive Smart Vision** 场景为例（会话 ID 如 `SES-20240801-SEA01`，帧 ID 如 `FRAME-0001`），展示如何让同一数据集流经所有工作负载，而无需在系统间复制数据。

| 指南 | 涵盖内容 |
|-------|----------------|
| [SQL 分析](./00-sql-analytics.md) | 构建共享表、切分会话、添加窗口/聚合加速 |
| [JSON 与搜索](./01-json-search.md) | 存储检测负载并 `QUERY` 风险场景 |
| [向量搜索](./02-vector-db.md) | 保存帧嵌入并查找语义邻居 |
| [地理分析](./03-geo-analytics.md) | 使用 `HAVERSINE`、多边形、H3 映射事件 |
| [湖仓 ETL](./04-lakehouse-etl.md) | 暂存文件、`COPY INTO` 表、可选流/任务 |

按顺序学习这些教程，了解 Databend 的单一优化器如何在同一车队数据上驱动分析、搜索、向量、地理和加载流水线。